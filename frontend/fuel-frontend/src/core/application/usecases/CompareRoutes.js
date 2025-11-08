export const compareRoutes = async (repo) => {
  const data = await repo.getComparison();
  const target = 89.3368;

  return data.map((r) => ({
    ...r,
    percentDiff: ((r.ghg_intensity / target) - 1) * 100,
    compliant: r.ghg_intensity <= target
  }));
};
