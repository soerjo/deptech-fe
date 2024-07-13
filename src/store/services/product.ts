import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import { CreateProduct, IProduct, UpdateProduct } from "@/interfaces/product";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/product",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: builder => ({
    create: builder.mutation<IApiResponse<{}>, CreateProduct>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Product"],
    }),
    update: builder.mutation<IApiResponse<{}>, UpdateProduct & { id: number }>({
      query: ({ id, ...payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ["Product"],
    }),
    delete: builder.mutation<IApiResponse<{}>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    GetAll: builder.query<IApiResponse<IProduct[]>, {}>({
      query: payload => {
        return {
          url: "/",
          method: "GET",
          params: payload,
        };
      },
      providesTags: ["Product"],
    }),
    GetById: builder.query<IApiResponse<IProduct>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useGetAllQuery,
  useLazyGetAllQuery,
  useGetByIdQuery,
  useLazyGetByIdQuery,
  useDeleteMutation,
} = productApi;
