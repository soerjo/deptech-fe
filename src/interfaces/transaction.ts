import { TransactionEnum } from "@/enum/transaction.enum";

export type ITransaction = {
  id: number;
  name: string;
  transaction_type: TransactionEnum;
  quantity: number;
  productId: number;
};

export type GetUserFilter = {
  take?: number;
  page?: number;
  search?: string;
};

export type CreateTransaction = {
  name: string;
  transaction_type: TransactionEnum;
  quantity: number;
  productId: number;
};
