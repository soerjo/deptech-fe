import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { CreateTransaction, ITransaction } from "@/interfaces/transaction";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/transaction",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Transaction"],
  endpoints: builder => ({
    create: builder.mutation<IApiResponse<{}>, CreateTransaction>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Transaction"],
    }),
    GetAll: builder.query<IApiResponse<ITransaction[]>, {}>({
      query: payload => {
        return {
          url: "/",
          method: "GET",
          params: payload,
        };
      },
      providesTags: ["Transaction"],
    }),
  }),
});

export const { useCreateMutation, useGetAllQuery, useLazyGetAllQuery } =
  transactionApi;
