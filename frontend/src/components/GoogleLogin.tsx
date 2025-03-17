import { useDispatch } from 'react-redux';
import { useLazyGoogleLoginQuery } from '../api/services/authApi';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { setAuth } from '../redux/features/authSlice';
import { toast } from 'react-toastify';


const GoogleLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ googleLogin ] = useLazyGoogleLoginQuery();

    const responseGoogle = async(authResult : any) => {
        try {
            if (authResult?.code) {
                const response  = await googleLogin(authResult.code).unwrap();
                console.log(response)
                const { data } = response;
                if(response.success){
                    dispatch(setAuth({ token: data.token, user: data.user }));
                    navigate('/');
                    toast.success("Login Successful!");
                }
            }    
        } catch (error: any) {
            console.log('Error while requesting google code', error)
            toast.error(error.data?.message || "Login failed!");
        }
    }
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    });


  return (
    <button onClick={handleGoogleLogin} className="w-8 h-8 cursor-pointer rounded-full bg-[#2f4021] flex items-center justify-center focus:outline-none">
        <i className="fa-brands fa-google text-[17px] text-[#ffffff]"></i>
    </button>
  )
}

export default GoogleLogin
