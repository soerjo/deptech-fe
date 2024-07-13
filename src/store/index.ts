import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./slice/auth";

import { authApi } from "./services/auth";
import { userApi } from "./services/user";
import { productApi } from "./services/product";
import { categoryApi } from "./services/category";
import { transactionApi } from "./services/transaction";

export const makeStore = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      userApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      transactionApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof makeStore.getState>;
export type AppDispatch = typeof makeStore.dispatch;
