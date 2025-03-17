import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "../../utils/validation";
import { useEffect, useState } from "react";
import { useLazyVerifyResetTokenQuery, useResetPasswordMutation } from "../../api/services/authApi";


const ResetPassword = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [ formData, setFormData ] = useState({ newPassword: "", confirmPassword: "" });
    const [ showPassword, setShowPassword ] = useState(false);
    const [ VerifyResetToken ] = useLazyVerifyResetTokenQuery();
    const [ validToken, setValidToken ] = useState<boolean | null>(null);
    const token: string = searchParams.get("token") ?? "";
    const [ resetPassword ] = useResetPasswordMutation();

    useEffect(() => {
        const fetchTokenValidation = async () => {
            try {
                const response = await VerifyResetToken({ token }).unwrap();
                setValidToken(response.success);
    
                if (response.success && response.data.expirationTime) {
                    const expiryTimestamp = new Date(response.data.expirationTime).getTime(); // Convert to milliseconds
                    const remainingTime = expiryTimestamp - Date.now();
                    
                    if (remainingTime > 0) {
                        setTimeout(() => setValidToken(false), remainingTime); // Auto-expire token
                    } else {
                        setValidToken(false);
                    }
                }
            } catch {
                setValidToken(false);
            }
        };
    
        if (token) fetchTokenValidation();
    }, [token]);
    
    
  
    const closeModal = () => {
        setSearchParams({});
    };

    const handleFormData =(e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const { error } = resetPasswordSchema.validate(formData, { abortEarly: false });

        if (error) {
            error.details.forEach((err) => toast.error(err.message));
        }else{
            const response = await resetPassword({ token, newPassword: formData.newPassword }).unwrap();
            if(response.success){
                navigate('/login');
                toast.success(response.message);
                console.log('response',response);
            }
        }
    }
    console.log(validToken)
  return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
            <AnimatePresence>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} // Scale in effect
                  animate={{ scale: 1, opacity: 1 }}   // Appear fully
                  exit={{ scale: 0.8, opacity: 0 }}    // Shrink out
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`bg-white w-[80%] sm:w-[60%]  md:w-[60%] lg:w-[32%] ${ validToken ? 'h-[70%]' : 'h-[50%]'} pt-2 pb-2 rounded-lg shadow-lg flex flex-col items-center`}
                >

                    {/* Close Button */}
                    <div className="w-full flex justify-end ">
                      <button onClick={closeModal} className="pr-3 cursor-pointer text-3xl font-extralight top-1 text-right">
                        &times;
                      </button>
                    </div>

                    

                    <div className="w-full h-[90%]  flex flex-col  justify-center items-center pl-10 pr-10"> 
                        <h2 className="text-3xl font-bold mb-4">Reset password</h2>

                        { validToken && 
                        <form onSubmit={handleSubmit} className="mt-5 w-full">
                            <label htmlFor="newPassword" className="w-full text-sm tracking-wide relative">New password
                                <input type={ showPassword? 'text' : 'password' } name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleFormData} placeholder="Enter new password" className="outline-none w-full border border-[#c5c1c1] focus:border-[#2f4021] mt-1 p-2 pr-10 rounded mb-4 h-12" required />
                                <i id="eyeIcon" onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)} className={`fas ${showPassword ? 'fa-eye': 'fa-eye-slash'} cursor-pointer absolute right-3 top-12 transform -translate-y-1/2 text-gray-500`}></i>
                            </label>
                            <label htmlFor="confirmPassword" className="w-full text-sm tracking-wide">Confirm password
                                <input type="text" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormData} placeholder="Enter confirm password" className="outline-none w-full border border-[#c5c1c1] focus:border-[#2f4021]  mt-1 p-2 rounded mb-4 h-12" required />
                            </label>
                            <button type="submit" className="w-full bg-[#2f4021] text-white py-2 rounded cursor-pointer h-12">
                              Reset Password
                            </button>
                        </form>
                        }
                        { !validToken && 
                            <div className="w-[95%] h-3/5 flex flex-col items-center justify-evenly"> 
                                <h1 className="w-full text-xs text-center tracking-wider leading-5  bg-gray-200">Uh oh! Your password reset token is invalid or has expired! Please try once and and that you clicked on the link within half an hour of receiving it. </h1>
                            <p className="mt-5 text-sm tracking-wide">Request a new password <Link to={'/login?mode=forgotPassword'} className="text-blue-500 text-sm tracking-wide underline">Reset Link</Link></p>
                            </div>
                        }
                    </div>

                </motion.div> 
            </AnimatePresence>

        </div>
  )
}

export default ResetPassword