import { IApiResponse, TPaginationResponse } from "@/interfaces/apiResponse";
import {
  CreateCategory,
  ICategory,
  UpdateCategory,
} from "@/interfaces/category";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/category",
    prepareHeaders: headers => {
      const token = getAuthCookie(AUTH_TOKEN);
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: builder => ({
    create: builder.mutation<IApiResponse<{}>, CreateCategory>({
      query: payload => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Category"],
    }),
    update: builder.mutation<IApiResponse<{}>, UpdateCategory & { id: number }>(
      {
        query: ({ id, ...payload }) => ({
          url: `/${id}`,
          method: "PATCH",
          body: { ...payload },
        }),
        invalidatesTags: ["Category"],
      }
    ),
    delete: builder.mutation<IApiResponse<{}>, { id: number }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    GetAll: builder.query<IApiResponse<ICategory[]>, {}>({
      query: payload => {
        return {
          url: "/",
          method: "GET",
          params: payload,
        };
      },
      providesTags: ["Category"],
    }),
    GetById: builder.query<IApiResponse<ICategory>, { id: number }>({
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
} = categoryApi;
