import apiSlice from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
        { success: boolean; message: string; data: { user: { id: string, email: string }, token: string } },
            // { user: { userName: string; email: string; }; token: string }, // the response we get
            { email: string; password: string }>({ // requested email and password
                query: (credentials) => ({
                    url: "/auth/login",
                    method: "POST",
                    body: credentials,
                }),
        }),
        register: builder.mutation<{ success: boolean; data: {email: string, message: string} }, { userName: string; email: string; password: string; confirmPassword: string }>({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
              }),        
        }),
        verifyOtp: builder.mutation<{ success: boolean; message: string; data: { user: { id: string, email: string }, token: string } }, { otp: string; email: string }>({
            query: (data) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: data,
            })
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useVerifyOtpMutation } = authApi;
