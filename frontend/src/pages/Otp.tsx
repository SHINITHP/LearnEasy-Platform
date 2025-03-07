import React, { useRef, useState } from 'react'
import { useVerifyOtpMutation } from '../api/services/authApi';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/features/authSlice';
import { toast } from 'react-toastify';

const Otp = ({ length = 6 }) => {

    const [otp, setOTP] = useState<string[]>(new Array(length).fill(""));

    const [ verifyOtp ] = useVerifyOtpMutation();
    const email = localStorage.getItem('userEmail');
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        console.log("Submitting OTP:", enteredOtp);
        // Call API to verify OTP
        try {
            if (!email) {
                console.error("Email is null, cannot proceed with OTP verification.");
                return;
            }
              
            const response = await verifyOtp({ otp: enteredOtp, email }).unwrap();
            const { data } = response;
            if(response.success){
              dispatch(setAuth({ token: data.token, user: data.user }))
              navigate('/');
              toast.success("Registered Successful!");
            }
        } catch (error) {
            
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };
    
    



    return (
      <>
            <div className="h-screen flex flex-col lg:flex-row "> 

                  {/* <!-- Left Side (Image) --> */}
                  <div className="w-full lg:w-3/5 p-8 pl-12 pr-12 lg:block hidden h-screen ">
                    <img className="w-full h-full object-fill rounded-2xl" src="/src/assets/otp3.png" alt="" />
                  </div>

                  {/* <!-- Right Side (Text and Buttons) --> */}
                  <div className="w-full h-screen lg:w-2/5 flex flex-col lg:items-start items-center justify-center p-4 ">
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

            </div>
      </>
    )
}

export default Otp