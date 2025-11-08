export const TARGET_INTENSITY_2025 = 89.3368;

export function computeComplianceBalance(actual, energy) {
  return (TARGET_INTENSITY_2025 - actual) * energy;
}
