export type ICategory = {
  code: string;
  name: string;
  description: string;
};

export type GetUserFilter = {
  take?: number;
  page?: number;
  search?: string;
};

export type CreateCategory = {
  code: string;
  name: string;
  description?: string;
};

export type UpdateCategory = {
  code: string;
  name: string;
  description?: string;
};
