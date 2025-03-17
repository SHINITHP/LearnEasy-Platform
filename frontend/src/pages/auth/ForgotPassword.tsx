import React, { ReactElement, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useSendOtpMutation } from "../../api/services/authApi";
import { toast } from "react-toastify";
import Otp from "../Otp";


const ForgotPassword = () => {

    const [ email, setEmail ] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [ sendOtp ] = useSendOtpMutation();

    const isEnterOtp = searchParams.get('mode') === 'enter-otp';


    const closeModal = () => {
        setSearchParams({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await sendOtp({ email }).unwrap();
            if(response.success){
                // setSearchParams({ mode: 'enter-otp' });
                toast.success(`Please check your Email : ${response.data.user.email}`)
            }
        } catch (error: any) {
            toast.error(error.data.message);
        }
    }


  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
        <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} // Scale in effect
              animate={{ scale: 1, opacity: 1 }}   // Appear fully
              exit={{ scale: 0.8, opacity: 0 }}    // Shrink out
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white w-[80%] sm:w-[60%]  md:w-[60%] lg:w-[32%] h-[70%] pt-2 pb-2 rounded-lg shadow-lg flex flex-col items-center"
            >
              {/* Close Button */}
              <div className="w-full flex justify-end ">
                <button onClick={closeModal} className="pr-3 cursor-pointer text-3xl font-extralight top-1 text-right">
                  &times;
                </button>
              </div>

              <div className="w-full h-[90%]  flex flex-col  justify-center items-center pl-10 pr-10">
                {/* Modal Content */}
                <h2 className="text-3xl font-bold mb-4">Forgot password</h2>
                <p className=" text-xs w-[90%] text-center tracking-wide leading-5">Enter the email address you use on LearnEase. We'll send you an OTP to reset your password.</p>
                <form onSubmit={handleSubmit} className="mt-10 w-full">
                    <label htmlFor="email" className="w-full text-sm tracking-wide">Email
                        <input type="email" id="email" placeholder="Enter your email" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)}} value={email} className="outline-none w-full border border-[#c5c1c1] focus:border-[#2f4021]  mt-1 p-2 rounded mb-4 h-12" required />
                    </label>
                    <button type="submit" className="w-full bg-[#2f4021] text-white py-2 rounded cursor-pointer h-12">
                      Reset Password
                    </button>
                </form>

                <p className="mt-5 text-sm tracking-wide">Back to <Link to={'/login'} className="text-blue-500 text-sm tracking-wide underline">Login</Link></p>

              </div>



            </motion.div>
        </AnimatePresence>

            {isEnterOtp && <Otp />}

    </div>
  );
};

export default ForgotPassword;
