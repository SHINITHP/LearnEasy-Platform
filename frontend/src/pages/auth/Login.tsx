import React, { useEffect } from 'react'
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { loginSchema } from "../../utils/validation";
import { toast } from "react-toastify";
import { useLoginMutation } from '../../api/services/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, setAuth } from '../../redux/features/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const [ showPassword, setShowPassword ] = useState(false);
    const [ formData, setFormData ] = useState({ email: "", password: "" });
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        console.log("isAuthenticated :", isAuthenticated)
        if(isAuthenticated){
            navigate('/');
        }
    },[isAuthenticated])
    
    const handleFormData =(e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = loginSchema.validate(formData, { abortEarly: false });

        if (error) {
            error.details.forEach((err) => toast.error(err.message));
        } else {
            try {
                const response = await login({ email: formData.email , password: formData.password }).unwrap();
                const { data } = response;
                if(response.success){
                    dispatch(setAuth({ token: data.token, user: data.user }));
                    navigate('/');
                    toast.success("Login Successful!");
                }
            } catch (error: any) {
                console.log('error :', error)
                toast.error(error.data?.message || "Login failed!");
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

          <div className="rounded-[100px] p-2 bg-[#afd275] sm:w-[320px] w-[250px]">
            <div className="flex space-x-4 items-center justify-center">
              {/* <!-- Login Button --> */}
              <Link className="" to={"/login"}><button id="loginBtn" className="sm:w-[145px] h-[37px] w-[110px] rounded-[100px] bg-[#2f4021] text-white focus:outline-none cursor-pointer text-[15px]">Login</button></Link>

              {/* <!-- Register Button --> */}
              <Link className="p-0 m-0" to={"/register"}><button id="registerBtn" className="sm:w-[145px] h-[37px] rounded-[100px] w-[110px]  text-white focus:outline-none cursor-pointer text-[15px]">Register</button></Link>
            </div>
          </div>



          {/* <!-- Login Form using <form> --> */}
              <form onSubmit={handleSubmit} className="w-[90%]  sm:w-[80%] mx-auto mt-8  sm:mt-10" id="loginForm"> 

                  {/* <!-- Email Input --> */}
                  <label htmlFor="email" className="block text-[#2f4021] text-[13px] mb-1 ">Email Address</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleFormData} className="w-full h-[39px]  placeholder:font-normal placeholder:text-[13px] placeholder:text-[#bbbbbb] rounded-[100px] px-4 py2 border border-[#2f4021] focus:border-2 focus:border-[#2f4021]" placeholder="Enter your email"  required/>
                  {/* <p className="text-[10px] pl-3 pt-1 text-red-500">Invalid email format</p> */}
                  {/* <!-- Password Input --> */}
                  <label htmlFor="password" className="block text-[#2f4021] text-[13px] mb-1 mt-3">Password</label>
                  <div className="relative">
                  <input type={ showPassword ? 'text' : 'password'} value={formData.password} onChange={handleFormData}  id="password" name="password" className="w-full h-[39px]  placeholder:font-normal placeholder:text-[13px] placeholder:text-[#bbbbbb] rounded-[100px] px-4 py2 border border-[#2f4021] focus:border-2 focus:border-[#2f4021]" placeholder="Enter your password"  required/>
                      <button type="button" id="togglePassword" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2f4021]">
                          {/* <!-- Eye Icon (Font Awesome) --> */}
                          {showPassword ? <i id="eyeIcon" onClick={() => {setShowPassword(false)}} className="fas fa-eye cursor-pointer"></i> : <i onClick={() => {setShowPassword(true)}} id="eyeIcon" className="fas fa-eye-slash cursor-pointer"></i> }

                      </button>
                  </div>
                  {/* <p className="text-[10px] pl-3 pt-1 text-red-500">Invalid email format</p> */}

                  {/* <!-- Forgot Password link --> */}
                  <div className="text-right mt-2">
                      <a href="#" className="text-[#2f4021] text-[13px] hover:text-blue-500">Forgot Password?</a>
                  </div>
                  {/* <!-- Submit Button --> */}
                  <div className="flex items-center justify-center">
                      <button type="submit" className="cursor-pointer w-[60%] sm:w-[50%] mt-5  sm:mt-4 h-[38px] rounded-[100px] bg-[#2f4021] text-white focus:outline-none">
                          Login
                      </button>
                  </div>


              </form>


              <div className="w-[80%] sm:w-[55%] mx-auto mt-4 text-center flex flex-col items-center justify-center">
                  <p className="text-[12px] text-[#2f4021] mb-3">------ Or Continue With ------</p>
                  <div className="flex space-x-4">
                      {/* <!-- Google Button --> */}
                      <button className="w-8 h-8 rounded-full bg-[#2f4021] flex items-center justify-center focus:outline-none">
                          <i className="fa-brands fa-google text-[17px] text-[#ffffff]"></i>
                      </button>

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

      </div>
    )
}

export default Login