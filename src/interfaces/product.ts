export type IProduct = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  stock: number;
  categoryCode: string;
};

export type GetUserFilter = {
  take?: number;
  page?: number;
  search?: string;
};

export type CreateProduct = {
  name: string;
  description?: string;
  image_url?: string;
  category: string;
};

export type UpdateProduct = {
  name: string;
  description?: string;
  image_url?: string;
  category: string;
};
