import React from 'react'

const Sample = () => {
  return (
    <div className=' w-full h-screen flex items-center justify-center'>
        <div className='md:bg-[#fff] h-10/12 w-full md:w-11/12 lg:w-8/12 flex md:shadow-2xl md:rounded-2xl'>
            {/* left-side div */}
            <div className='w-full md:w-3/5 flex flex-col justify-center items-center '>
 
                <h1 className='text-center text-[#2f4021] font-bold text-3xl'>Sign Up</h1>
                <br />
                <form className='w-full flex flex-col justify-center items-center '>
                    {/* fullName-input */}
                    <div className="flex items-center bg-[#eeecec] w-[75%] p-3 h-11">
                        <i className="fa-solid fa-user text-[#777676] text-lg"></i>
                        <input type="text" placeholder="Enter Full Name" className="bg-transparent pl-3 text-sm focus:outline-none w-full text-gray-700"/>
                    </div>

                    {/* email-input */}
                    <div className="flex items-center bg-[#eeecec] w-[75%] p-3 h-11 mt-5">
                        <i className="fa-solid fa-envelope text-[#777676] text-lg"></i>
                        <input type="text" placeholder="Enter Email" className="bg-transparent pl-3 text-sm focus:outline-none w-full text-gray-700"/>
                    </div>

                    {/* password-input */}
                    <div className="flex items-center bg-[#eeecec] w-[75%] p-3 h-11 mt-5">
                        <i className="fa-solid fa-lock text-[#777676] text-lg"></i>
                        <input type="text" placeholder="Enter Password" className="bg-transparent pl-3 text-sm focus:outline-none w-full text-gray-700"/>
                    </div>

                    {/* confirmPassword-input */}
                    <div className="flex items-center bg-[#eeecec] w-[75%] p-3 h-11 mt-5">
                        <i className="fa-solid fa-lock text-[#777676] text-lg"></i>
                        <input type="text" placeholder="Re-Enter Password" className="bg-transparent pl-3 text-sm focus:outline-none w-full text-gray-700"/>
                    </div>

                    <button type='submit' className='bg-[#2f4021] h-10 w-[200px] rounded-4xl text-[#fff] tracking-wider font-medium mt-6'>SIGN UP</button>
                    
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

            {/* right-side div */}
            <div className="w-2/5 bg-[#2f4021] bg-opacity-90 shadow-2xl rounded-r-2xl hidden md:flex flex-col items-center justify-center">
                <h1 className='text-3xl text-amber-50 font-bold font-[Poppins]'>Hello, Friend!</h1>
                <p className='text-center text-sm pl-6 pr-6 leading-relaxed	tracking-wide text-[#c3c1c1] font-light mt-5'>Sign up now and unlock a world of learning opportunities.</p>
            </div>
        </div>
    </div>
  )
}

export default Sample