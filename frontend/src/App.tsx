import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthCheck from "./hooks/AuthCheck";
import Navbar from "./pages/layouts/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  console.log('App rendered correctly')
  return (
    <>
      <AuthCheck />
      <Navbar />
    </>
  );
}

export default App;
