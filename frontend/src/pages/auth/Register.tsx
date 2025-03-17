// import { useState } from "react";

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { registerSchema } from "../../utils/validation";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../api/services/authApi";
import GoogleLogin from "../../components/GoogleLogin";
import Otp from "../Otp";


const Register = () => {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isEnterOtp = searchParams.get('mode') === 'enter-otp';

  const handleEnterOtp = () => {
    setSearchParams({ mode: 'enter-otp' });
  }
  

  const [ register ] = useRegisterMutation();

  const [ formData, setFormData ] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = registerSchema.validate(formData, { abortEarly: false });

    if (error) {
        error.details.forEach((err) => toast.error(err.message));
    } else {
        try {
          const response = await register({ email: formData.email , password: formData.password, userName: formData.userName, confirmPassword: formData.confirmPassword  }).unwrap();
          if(response.success){
            localStorage.setItem('userEmail', response.data.email);
            handleEnterOtp();
          }
        } catch (error: any) {
          toast.error(error.data?.message || "Invalid credentials!");
        }
    }
  }


  return (
    <div className="h-screen flex flex-col lg:flex-row ">
            {/* <!-- Left Side (Image) --> */}
            <div className="w-full lg:w-3/5  lg:block hidden h-screen">
              <img className="w-full h-full object-fill " src="/src/assets/auth-image.avif" alt="" />
            </div>
    
    
            {/* <!-- Right Side (Text and Buttons) --> */}
            <div className="w-full h-screen lg:w-2/5 flex flex-col items-center justify-center p-4 ">
    
                <h1 className="text-lg text-center mb-3 text-[#2f4021]">
                  <span className="text-black">Welcome to </span>
                  <span className="font-bold">Learn<span className="font-normal">Easy</span></span>
                </h1>

                <div className="rounded-[100px] p-2 bg-[#afd275] sm:w-[320px] w-[300px]">
                  <div className="flex space-x-4 items-center justify-center">
                    {/* <!-- Login Button --> */}
                    <Link className="" to={"/login"}><button id="loginBtn" className="sm:w-[145px] h-[37px] w-[135px] rounded-[100px]  text-white focus:outline-none cursor-pointer text-[15px]">Login</button></Link>

                    {/* <!-- Register Button --> */}
                    <Link className="p-0 m-0" to={"/register"}><button id="registerBtn" className="sm:w-[145px] h-[37px] w-[135px] rounded-[100px] bg-[#2f4021]  text-white focus:outline-none cursor-pointer text-[15px]">Register</button></Link>
                  </div>
                </div>
    
    
    
              {/* <!-- Login Form using <form> --> */}
                  <form onSubmit={handleSubmit} className="w-[90%]  sm:w-[80%] mx-auto mt-8  sm:mt-10" id="loginForm"> 
                      {/* <!-- Username Input --> */}
                      <label htmlFor="userName" className="block text-[#2f4021] text-[13px] mb-1">User Name</label>
                        <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleFormChange} className="w-full h-[39px]  placeholder:font-normal placeholder:text-[13px] placeholder:text-[#bbbbbb] rounded-[100px] px-4 py2 border border-[#2f4021] focus:border-2 focus:border-[#2f4021]" placeholder="Enter your username"  required/>
                        {/* <!-- Email Input --> */}
                        <label htmlFor="email" className="block text-[#2f4021] text-[13px] mb-1 mt-3">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full h-[39px]  placeholder:font-normal placeholder:text-[13px] placeholder:text-[#bbbbbb] rounded-[100px] px-4 py2 border border-[#2f4021] focus:border-2 focus:border-[#2f4021]" placeholder="Enter your email"  required/>
                    
                        {/* <!-- Password Input --> */}
                        <label htmlFor="password" className="block text-[#2f4021] text-[13px] mb-1 mt-3">Password</label>
                        <input type="text" id="password" name="password" value={formData.password} onChange={handleFormChange} className="w-full h-[39px]  placeholder:font-normal placeholder:text-[13px] placeholder:text-[#bbbbbb] rounded-[100px] px-4 py2 border border-[#2f4021] focus:border-2 focus:border-[#2f4021]" placeholder="Enter your password"  required/>
                        
                    
                        {/* <!-- Confirm Password Input --> */}
                        <label htmlFor="confirmPassword" className="block text-[#2f4021] text-[13px] mb-1 mt-3">Confirm Password</label>
                        <input type="text" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} className="w-full h-[39px]  placeholder:font-normal placeholder:text-[13px] placeholder:text-[#bbbbbb] rounded-[100px] px-4 py2 border border-[#2f4021] focus:border-2 focus:border-[#2f4021]" placeholder="Re-enter your password"  required/>
                        
                    
                        {/* <!-- Submit Button --> */}
                        <div className="flex items-center justify-center">
                            <button type="submit" className="cursor-pointer w-[60%] sm:w-[50%] mt-6 sm:mt-7 h-[38px] rounded-[100px] bg-[#2f4021] text-white focus:outline-none text-[15px]">
                                Register
                            </button>
                        </div>
                  </form>
    
    
                  <div className="w-[80%] sm:w-[55%] mx-auto mt-4 text-center flex flex-col items-center justify-center">
                      <p className="text-[12px] text-[#2f4021] mb-3">------ Or Continue With ------</p>
                      <div className="flex space-x-4">
                          {/* <!-- Google Button --> */}
                          <GoogleLogin />

    
                          {/* <!-- Facebook Button --> */}
                          <button className="w-8 h-8 rounded-full bg-[#2f4021] flex items-center justify-center focus:outline-none">
                              <i className="fa-brands fa-facebook-f text-[17px] text-[#ffffff]"></i>                    
                          </button>
    
                          {/* <!-- Twitter Button --> */}
                          <button className="w-8 h-8 rounded-full bg-[#2f4021] flex items-center justify-center focus:outline-none">
                              <i className="fa-brands fa-x-twitter text-[17px] text-[#ffffff]"></i>                    
                          </button>
                      </div>
                  </div>
    
    
    
    
    
            </div>

            {isEnterOtp && <Otp />}
            
    
          </div>
  );
};

export default Register;
