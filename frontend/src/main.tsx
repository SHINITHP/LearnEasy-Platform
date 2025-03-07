import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import { store, persistor } from "./redux/store.ts";
import { Provider } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { PersistGate } from "redux-persist/integration/react";
import Home from './pages/Home.tsx'
import Otp from './pages/Otp.tsx'
import Sample from './pages/Sample.tsx'



createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
        <Routes>
          {/* <Route path='' element={<ProtectedRoute />}>
  
          </Route> */}
          <Route path='/' element={<Home/>} />
          <Route path='/enter-otp' element={<Otp />}/>
          <Route path='/sample' element={<Sample />}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  
)
