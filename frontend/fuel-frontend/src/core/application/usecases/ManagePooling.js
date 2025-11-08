export const getAdjustedCBs = async (repo, year) => {
  return await repo.getAdjustedCB(year);
};

export const createPool = async (repo, data) => {
  return await repo.createPool(data);
};
