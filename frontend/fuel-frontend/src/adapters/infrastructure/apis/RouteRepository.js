import api from "./axiosClient";

export const RouteRepository = {
  getAll: async () => {
    try {
      const response = await api.get("/routes");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch routes: " + error.message);
    }
  },
  
  setBaseline: async (id) => {
    try {
      const response = await api.post(`/routes/${id}/baseline`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to set baseline: " + error.message);
    }
  },
  getComparison: async () => {
    try {
      const response = await api.get("/routes/comparison");
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch comparison: " + error.message);
    }
  }

};