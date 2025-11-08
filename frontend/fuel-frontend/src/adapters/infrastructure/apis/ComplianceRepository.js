import api from "./axiosClient";

export const ComplianceRepository = {
  // Fetch CB (Compliance Balance)
  getCB: async ({ shipId, year, actualIntensity, fuelConsumption }) =>
    (
      await api.get(`/compliance/cb`, {
        params: { shipId, year, actualIntensity, fuelConsumption },
      })
    ).data,

  // Bank CB
  bank: async (data) => (await api.post("/banking/bank", data)).data,

  // Apply CB
  apply: async (data) => (await api.post("/banking/apply", data)).data,

  // Adjusted CB
  getAdjustedCB: async (year) =>
    (await api.get(`/compliance/adjusted-cb?year=${year}`)).data,

  // Pooling
  createPool: async (data) => (await api.post("/pools", data)).data,
};
