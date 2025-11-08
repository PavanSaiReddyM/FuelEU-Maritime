import api from "./axiosClient";

export const RouteRepository = {
  getAll: async () => (await api.get("/routes/all")).data,
  setBaseline: async (id) => (await api.post(`/routes/${id}/baseline`)).data,
  getComparison: async () => (await api.get("/routes/comparison")).data,
};
