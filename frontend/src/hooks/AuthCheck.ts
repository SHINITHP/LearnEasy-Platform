import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../api/services/authApi";
import { logout, setAuth } from "../redux/features/authSlice";

const AuthCheck = () => {
    const dispatch = useDispatch();
    const tokenExpiry = useSelector((state: any) => state.auth.tokenExpiry);
    const [refreshToken] = useRefreshTokenMutation();

    useEffect(() => {
        
        const now = Date.now();
        const timeUntilExpiry = tokenExpiry - now;

        //Refresh token 30 seconds before expiry
        const refreshBuffer = 30 * 1000;
        const refreshTime = timeUntilExpiry - refreshBuffer;

        if(refreshTime > 0){
            const timeout = setTimeout(async() => {
                try {
                    const { data } = await refreshToken().unwrap();
                    dispatch(setAuth({ token: data.token, user: data.user }));
                } catch (error) {
                    dispatch(logout());
                }
            }, refreshTime); 

            return () => clearTimeout(timeout);

        }
    },[tokenExpiry, dispatch, refreshToken])

    return null;

    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         const now = Date.now();

    //         if (tokenExpiry && now >= tokenExpiry) {
    //             try {
    //                 
    //             } catch (error) {
    //                 dispatch(logout());
    //             }
    //         }
    //     }, 5000); // Checks every 5 seconds

    //     return () => clearInterval(interval); // Cleanup interval on unmount
    // }, [tokenExpiry, dispatch, refreshToken]);

    // return null;
};

export default AuthCheck;
