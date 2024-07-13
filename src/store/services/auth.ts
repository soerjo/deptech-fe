import { IApiResponse } from "@/interfaces/apiResponse";
import { LoginResponse } from "@/interfaces/auth.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/auth",
  }),
  endpoints: builder => ({
    login: builder.mutation<
      IApiResponse<LoginResponse>,
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "/login",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
    getAuthData: builder.query<IApiResponse<LoginResponse>, { token: string }>({
      query: ({ token }) => ({
        url: "/details",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useGetAuthDataQuery } = authApi;
