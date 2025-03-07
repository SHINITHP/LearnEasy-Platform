import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from 'react'
import Search from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthenticated } from "../../redux/features/authSlice";
import { Link } from "react-router";
import { toast } from "react-toastify";


const Navbar = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();

    const dropdownRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
          }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
      

    return (
        <nav className="w-full h-[100px] lg:h-[70px] flex flex-col lg:flex pl-3 pr-3 sm:pl-5 sm:pr-5 md:pl-10 md:pr-10 border-b border-b-[#e7e6e6] bg-[#ffffff]">
          {/* Top-bar */}
          <div className="w-full h-[70px] flex justify-between  lg:justify-normal items-center">
            {/* icon-image */}
            <img className="w-[140px] sm:w-[220px] object-contain" src="/src/assets/learnease-logo.png" alt="Logo" />
  
            {/* search-bar */}
            <div className="hidden lg:flex items-center w-[40%] h-full pl-4 xl:pl-10">
              <form className="w-full h-11 border border-[#dddada] rounded-3xl pl-4 pr-1 flex justify-between items-center">
                <input className="w-[90%] h-full font-light border-none outline-none focus:border-none text-black text-sm" type="text" placeholder="What do you want to learn?" />
                <div className="h-8 flex w-8 justify-center items-center bg-[#2f4021] rounded-full cursor-pointer">
                  <button type="submit" className="cursor-pointer">
                    <i className="fa-solid fa-magnifying-glass text-[#fff]"></i>
                  </button>
                </div>
              </form>
            </div>
  
  
            {/* services and auth */}
            <div className="h-full flex w-[44%] items-center justify-end lg:justify-center font-['Source_Sans_Pro',Arial,sans-serif]">
  
              {/* Search-icon */}
              <div className="lg:hidden h-full flex items-center pr-3 sm:pr-5">
                <i className="fa-solid fa-magnifying-glass text-[#2f4021] cursor-pointer" onClick={() => setShowSearch(true)}></i>
              </div>

              {/* <i className="fa-solid fa-bars text-[#2f4021] text-lg cursor-pointer sm:hidden"></i> */}
  
              <ul className="hidden lg:flex justify-evenly items-center w-full text-sm">
                <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">Home</li>
                {isAuthenticated && ( 
                <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">My-Learning</li>
                )}           
                <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">Courses</li>
                <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">Notes</li>
              </ul>
  
              {/* Profile Dropdown */}
            { isAuthenticated ? 
              <div className="relative h-full flex justify-center items-center" ref={dropdownRef}>

                <div className={`flex justify-center items-center w-17 lg:w-20 h-4/5 cursor-pointer hover:bg-[#f1f1f1] ${ showDropdown ? "bg-[#f1f1f1]" : "bg-transparent" }`} onClick={() => setShowDropdown(!showDropdown)}>
                  <h1 className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#2f4021] text-[#fff] flex justify-center items-center text-xs lg:text-sm">S</h1>
                  <i className={`fa-solid fa-angle-${showDropdown ? 'up' : 'down' } text-xs pl-2`}></i>
                </div>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full right-0 mt-1 md:mt-1 w-55 border-[#2f4021]  bg-[#fff] shadow-lg text-sm border rounded-sm z-50 font-['Source_Sans_Pro',Arial,sans-serif]">
                      <li className="p-2 hover:bg-gray-100 cursor-pointer pl-6 h-10 rounded-tl-sm rounded-tr-sm tracking-wider font-extralight " onClick={() => setShowDropdown(false)}>Profile</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer pl-6 h-10  tracking-wider font-extralight"onClick={() => setShowDropdown(false)}>Settings</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer pl-6 h-10  tracking-wider font-extralight"onClick={() => setShowDropdown(false)}>Logout</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer pl-6 h-10  tracking-wider font-extralight"onClick={() => setShowDropdown(false)}>My Purchase</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer pl-6 h-10  tracking-wider font-extralight"onClick={() => setShowDropdown(false)}>Help Center</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer pl-6 h-10  tracking-wider font-extralight" onClick={() => {
                        dispatch(logout())
                        setShowDropdown(false);
                        toast('Logout successfull')
                        }}>Logout</li>
                      <li className="p-2 hover:bg-gray-100 cursor-pointer border-t rounded-bl-sm rounded-br-sm border-t-[#2f4021] pl-6  h-20 flex flex-col justify-center items-start ">
                        <div className="w-full flex  justify-between items-center font-bold text-[#AFD275]">
                          <h1>Get LearnEase <span className="text-xs bg-[#AFD275] p-1 text-[#fff]">PLUS</span></h1>
                          <i className="fa-solid fa-share-from-square text-[#AFD275] pr-2"></i>
                        </div>
                        <p className=" pt-2 text-xs">Access 10,000+ courses</p>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

            :
            // Login-button
            <Link className="flex" to={"/login"}>
              <button className="bg-[#AFD275] rounded-md h-7 w-[60px] text-xs xs:rounded-lg xs:h-8 xs:w-[80px] xs:text-sm sm:text-lg  sm:w-[120px] sm:h-10 sm:rounded-xl cursor-pointer tracking-wide hover:bg-[#2f4021] hover:text-[#AFD275] transition duration-400 ease-in-out">
                Sign In
              </button>
            </Link>
            }   
            
  
            </div>
          </div>
  
          {/* Lower-Bar */}
          <div className="w-full h-[50px] block lg:hidden">
              <ul className="flex justify-between sm:justify-start sm:gap-9 h-full items-center w-full text-xs sm:text-lg">
                <li className="cursor-pointer h-full font-bold border-b-4 pl-2 pr-2 flex text-[#AFD275] justify-center items-center hover:text-[#AFD275] transition duration-400">
                  Home
                </li>
                {isAuthenticated && ( 
                <li className="cursor-pointer font-medium h-full pl-2 pr-2 flex text-[#2f4021] justify-center items-center hover:text-[#AFD275] transition duration-400">
                  My-Learning
                </li> )}
                <li className="cursor-pointer font-medium h-full pl-2 pr-2 flex text-[#2f4021] justify-center items-center hover:text-[#AFD275] transition duration-400">
                  Courses
                </li>
                <li className="cursor-pointer font-medium h-full pl-2 pr-2 flex text-[#2f4021] justify-center items-center hover:text-[#AFD275] transition duration-400">
                  Notes
                </li>
              </ul>
            </div>
  
          {/* Show Search Modal */}
          {showSearch && <Search onClose={() => setShowSearch(false)} />}
  
        </nav>
    );
}

export default Navbar