import api from "./axiosClient";

export const ComplianceRepository = {
  getCB: async (year) => (await api.get(`/compliance/cb?year=${year}`)).data,
  bank: async (data) => (await api.post("/banking/bank", data)).data,
  apply: async (data) => (await api.post("/banking/apply", data)).data,
  getAdjustedCB: async (year) =>
    (await api.get(`/compliance/adjusted-cb?year=${year}`)).data,
  createPool: async (data) => (await api.post("/pools", data)).data,
};
