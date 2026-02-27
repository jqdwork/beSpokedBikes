import { service } from "./service";

const salesApi = {
  getSales: async () => service.get("/sales"),
  createSale: async (body) => service.post("/sales", body),
};
export default salesApi;
