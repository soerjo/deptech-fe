import { GenderEnum } from "@/enum/gender.enum";

export type GetUserResponse = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  gender: GenderEnum;
};

export type GetUserFilter = {
  take?: number;
  page?: number;
  search?: string;
};

export type CreateUser = {
  first_name: string;
  last_name: string;
  email: string;
  birthday: Date;
  gender: GenderEnum;
};

export type UpdateUser = {
  first_name: string;
  last_name: string;
  email: string;
  birthday: Date;
  gender: GenderEnum;
};
