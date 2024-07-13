export type UserPayload = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  gender: string;
};

export enum UserRole {
  SYSTEMADMIN = "SYSTEMADMIN",
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
}

export type LoginResponse = {
  jwt: string;
  payload: UserPayload;
};
