import React, { useState } from "react";
import { Link } from "react-router-dom";
import Search from "../components/Search";

const LandingPage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      <nav className="w-full h-[100px] lg:h-[70px] flex flex-col lg:flex pl-5 pr-5 md:pl-10 md:pr-10 border-b border-b-[#e7e6e6]">
        {/* Top-bar */}
        <div className="w-full h-[70px] flex justify-between lg:justify-normal items-center">
          {/* icon-image */}
          <img className="w-[140px] sm:w-[220px] object-contain" src="/src/assets/learnease-logo.png" alt="Logo" />

          {/* Menu-icon */}
          <div className="lg:hidden h-full flex items-center">
            <i className="fa-solid fa-magnifying-glass text-[#2f4021]  cursor-pointer" onClick={() => setShowSearch(true)}></i>
            {/* <i className="fa-solid fa-bars text-[#2f4021] text-xl"></i> */}
          </div>

          {/* search-bar */}
          <div className="hidden lg:flex items-center w-[40%] h-full pl-10">
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
          <div className="hidden lg:block w-[33%]">
            <ul className="flex justify-evenly items-center w-full text-sm">
              <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">Home</li>
              {/* <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">My-Learning</li> */}
              <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">Courses</li>
              <li className="cursor-pointer font-medium hover:text-[#AFD275] transition duration-400">Notes</li>
            </ul>
          </div>

          {/* Login-button */}
          <Link className="hidden lg:flex" to={"/login"}>
            <button className="bg-[#AFD275] w-[120px] h-10 rounded-xl cursor-pointer tracking-wide hover:bg-[#2f4021] hover:text-[#AFD275] transition duration-400 ease-in-out">
              Sign In
            </button>
          </Link>
        </div>

        {/* Lower-Bar */}
        <div className="w-full h-[50px] block lg:hidden">
          <ul className="flex justify-between sm:justify-start sm:gap-9 h-full items-center w-full text-xs sm:text-lg">
            <li className="cursor-pointer h-full font-bold border-b-4 pl-2 pr-2 flex text-[#AFD275] justify-center items-center hover:text-[#AFD275] transition duration-400">
              Home
            </li>
            <li className="cursor-pointer font-medium h-full pl-2 pr-2 flex text-[#2f4021] justify-center items-center hover:text-[#AFD275] transition duration-400">
              My-Learning
            </li>
            <li className="cursor-pointer font-medium h-full pl-2 pr-2 flex text-[#2f4021] justify-center items-center hover:text-[#AFD275] transition duration-400">
              Courses
            </li>
            <li className="cursor-pointer font-medium h-full pl-2 pr-2 flex text-[#2f4021] justify-center items-center hover:text-[#AFD275] transition duration-400">
              Notes
            </li>
          </ul>
        </div>
      </nav>

      {/* Show Search Modal */}
      {showSearch && <Search onClose={() => setShowSearch(false)} />}
    </div>
  );
};

export default LandingPage;
