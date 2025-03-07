import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000/api",
        credentials: "include",
    }),
    endpoints: () => ({}),  // Empty initially, we inject endpoints later
});


export default apiSlice;