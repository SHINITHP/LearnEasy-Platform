import apiSlice from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
        { success: boolean; message: string; data: { user: { userId: string, email: string }, token: string } },
            // { user: { userName: string; email: string; }; token: string }, // the response we get
            { email: string; password: string }>({ // requested email and password
                query: (credentials) => ({
                    url: "/auth/login",
                    method: "POST",
                    body: credentials,
                    credentials: "include" 
                }),
        }),
        register: builder.mutation<{ success: boolean; data: {email: string, message: string} }, { userName: string; email: string; password: string; confirmPassword: string }>({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
              }),        
        }),
        sendOtp: builder.mutation<{ success: boolean; message: string; data: { user: { userId: string, email: string }} }, { email: string; }>({ 
            query: (data) => ({
                url: "/auth/forgot-Password",
                method: "POST",
                body: data,
            })
        }),
        verifyOtpAndRegister: builder.mutation<{ success: boolean; message: string; data: { user: { userId: string, email: string }, token: string } }, { otp: string; email: string }>({
            query: (data) => ({
                url: "/auth/verifyOtp-register",
                method: "POST",
                body: data,
            })
        }),
        refreshToken: builder.mutation<{ data: { token: string; user: { userId: string, email: string } } }, void >({
            query: () => ({
                url: "/auth/refreshToken",
                method: "POST",
                credentials: "include"
            })
        }),
        resetPassword: builder.mutation<{ success: boolean; message: string; },{ token: string, newPassword: string } >({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                body: data,
                credentials: "include"
            })
        }),
        verifyOtp: builder.mutation<{ success: boolean; message: string; data: { user: { userId: string, email: string }, token: string } }, { otp: string; email: string }>({
            query: (data) => ({
                url: "/auth/verifyOtp",
                method: "POST",
                body: data,
            })
        }),
        googleLogin: builder.query<{ success: boolean; data: { token: string; user: { userId: string, email: string } } }, string>({
            query: (code) => ({
              url: `/auth/google`,
              method: 'GET',
              params: { code },
            }),
        }),                 
        verifyResetToken: builder.query<{ success: boolean; data: { user: { userId: string; email: string }, expirationTime: number } },{ token: string }>({
            query: ({ token }) => ({
              url: "/auth/verify-reset-token",
              method: "GET",
              params: { token },
            }),
        }),
        logoutUser: builder.mutation<{ data: { success: boolean; } }, { userId: string } >({
            query: (data) => ({
                url: "/auth/logout",
                method: "POST",
                body: data,
                credentials: "include"
            })
        })
    }),
});

export const { useLoginMutation, useResetPasswordMutation, useLazyVerifyResetTokenQuery, useLazyGoogleLoginQuery , useSendOtpMutation, useRegisterMutation, useVerifyOtpAndRegisterMutation, useRefreshTokenMutation, useLogoutUserMutation } = authApi;
