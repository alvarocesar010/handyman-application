export function roundUpToNext5(value: number): number {
  return Math.ceil(value / 5) * 5;
}

/**
 * Adjusts the travel cost so the rounded total matches line items.
 * This avoids "missing money" perception.
 */
export function applyRoundingAdjustment(
  itemsTotal: number,
  travelCost: number
) {
  const rawTotal = itemsTotal + travelCost;
  const roundedTotal = roundUpToNext5(rawTotal);
  const adjustment = roundedTotal - rawTotal;

  return {
    adjustedTravelCost: travelCost + adjustment,
    roundingAdjustment: adjustment,
    finalTotal: roundedTotal,
  };
}
