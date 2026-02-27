import { service } from "./service";

const customersApi = {
  getCustomers: async () => service.get("/customers"),
};
export default customersApi;
