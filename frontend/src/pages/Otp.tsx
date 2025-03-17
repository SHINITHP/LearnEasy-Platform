import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useVerifyOtpAndRegisterMutation } from '../api/services/authApi';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/features/authSlice';
import { toast } from 'react-toastify';

const Otp = ({ length = 6 }) => {

    const [otp, setOTP] = useState<string[]>(new Array(length).fill(""));

    const [ verifyOtpAndRegister ] = useVerifyOtpAndRegisterMutation();
    const email = localStorage.getItem('userEmail');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();

    const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));


    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;

        if (!/^\d?$/.test(value)) return; // Allow only numbers
        const newOtp = [...otp];
        newOtp[index] = value;
        setOTP(newOtp);

         // Move focus to next input
         if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();  // Move to next input
          }

        // Auto-submit when last digit is entered
        if (index === 5 && value) {
            newOtp.join("")
        }

    }

    const handleOTPSubmit = async (enteredOtp: string) => {
        // Call API to verify OTP
        try {
            if (!email) {
                console.error("Email is null, cannot proceed with OTP verification.");
                return;
            }
              
            const response = await verifyOtpAndRegister({ otp: enteredOtp, email }).unwrap();
            const { data } = response;
            if(response.success){
              dispatch(setAuth({ token: data.token, user: data.user }))
              navigate('/');
              toast.success("Registered Successful!");
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };


    const closeModal = () => {
        setSearchParams({});
    };

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

                  {/* <!-- Right Side (Text and Buttons) --> */}
                  <div className="w-full h-screen flex flex-col lg:items-start items-center justify-center p-4 ">
                      <div className="rounded-lg p-8 max-w-xs md:max-w-md w-full">
                          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">Verify Your OTP</h2>
                          <p className="text-center text-sm text-gray-600 mb-4">Enter the 6-digit OTP sent to your email.</p>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleOTPSubmit(otp.join(""));                    
                          }}>
                              <div className="flex space-x-2 justify-center mb-6">
                              {otp.map((digit, index) => (
                                  <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    className="w-10 h-10 md:w-12 md:h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#2f4021]"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)} 
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                  />
                                ))}
                              </div>
                              <button type="submit" className="w-full bg-[#2f4021] text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-[#2f4021] transition duration-200 cursor-pointer">Verify OTP</button>
                          </form>
                          <p className="text-center text-gray-600 mt-6 text-sm">
                              Didn’t receive the code? <a href="#" className="text-[#2f4021] hover:underline">Resend OTP</a>
                          </p>
                      </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          
    )
}

export default Otp;