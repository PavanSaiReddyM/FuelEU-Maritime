export const getComplianceBalance = async (repo, year) => {
  return await repo.getCB(year);
};

export const bankBalance = async (repo, data) => {
  return await repo.bank(data);
};

export const applyBalance = async (repo, data) => {
  return await repo.apply(data);
};
