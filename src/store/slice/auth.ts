import { createSlice } from "@reduxjs/toolkit";
import {
  AUTH_PAYLOAD,
  AUTH_TOKEN,
  getAuthCookie,
  removeCookies,
  setAuthCookie,
} from "@/lib/cookies";
import { authApi } from "../services/auth";

const initialState: any = {} as any;

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: () => {
      removeCookies([AUTH_TOKEN, AUTH_PAYLOAD]);
      return {};
    },
    setInitialState: () => {
      const payload = getAuthCookie(AUTH_PAYLOAD);
      const token = getAuthCookie(AUTH_TOKEN);
      const data: any = payload && JSON.parse(payload);

      return { ...data, token };
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        console.log({ payload });
        state = payload.data.payload;
        setAuthCookie(payload.data.jwt, AUTH_TOKEN);
        setAuthCookie(JSON.stringify(payload.data.payload), AUTH_PAYLOAD);
      }
    );
  },
});

export const { logout, setInitialState } = slice.actions;
export const authReducer = slice.reducer;
