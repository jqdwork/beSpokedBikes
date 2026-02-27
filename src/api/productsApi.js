import { service } from "./service";

const productsApi = {
  getProducts: async () => service.get("/products"),
  updateProduct: async (id, body) => service.put(`/products/${id}`, body),
};

export default productsApi;
