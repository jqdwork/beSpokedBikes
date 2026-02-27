import { service } from "./service";

const salesPersonApi = {
  getSalesPersons: async () => service.get("/salesPersons"),
  updateSalesPerson: async (id, body) =>
    service.put(`/salesPersons/${id}`, body),
};
export default salesPersonApi;
