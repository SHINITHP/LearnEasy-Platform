// import Register from './pages/Register' 
// import Login from "./pages/Login";
// import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} toastStyle={{ fontSize: "12px", padding: "5px" }} />
    </>
  );
}

export default App;
  