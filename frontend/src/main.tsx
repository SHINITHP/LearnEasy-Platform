import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from 'react-redux'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import App from './App.tsx'
// import ProtectedRoute from './components/ProtectedRoute.tsx'
import Home from './pages/Home.tsx'
import Otp from './pages/Otp.tsx'
import Sample from './pages/Sample.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/auth/ForgotPassword.tsx';

const clientId = '943990024899-laf4m0uuarlaphsh4f1sebki7e1ser47.apps.googleusercontent.com'; 

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId}>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} > 
            <Route index element={<Home />} />
          </Route>
          {/* <Route path="/enter-otp" element={<Otp />} /> */}
          <Route path="/sample" element={<Sample />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  <ToastContainer position="top-right" autoClose={3000} toastStyle={{ fontSize: "12px", padding: "5px" }} />
  </GoogleOAuthProvider>
);
