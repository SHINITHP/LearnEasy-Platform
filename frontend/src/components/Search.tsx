import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchPageProps {
  onClose: () => void;
}

const Search: React.FC<SearchPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ y: "-100vh", opacity: 0 }}  // Slide in from top
          animate={{ y: "0vh", opacity: 1 }}     // Settle at center
          exit={{ y: "100vh", opacity: 0 }}      // Slide out to bottom
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full bg-white m-0 p-0 relative"
        >
          <form className=" w-full flex justify-between items-center h-13 border border-b-[#2f4021]">
            <button className="bg-[#2f4021] w-14 h-full flex justify-center items-center">
              <i className="fa-solid fa-magnifying-glass text-[#fff] text-2xl"></i>
            </button>
            <input
              className="w-[80%] h-full pl-4 border-0 outline-0"
              type="text"
              placeholder="What do you want to learn?"
            />
            <button
              className="w-14 h-full flex justify-center items-center"
              onClick={onClose}
            >
              <i className=" fa-solid fa-xmark text-[#2f4021] text-2xl"></i>
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Search;
