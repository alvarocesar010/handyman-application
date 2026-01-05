export const FURNITURE_PRICING = {
  chest_drawers: {
    label: "Chest of drawers",
    basePrice: 30,
    pricePerDrawer: 4,
    baseMinutes: 30,
    minutesPerDrawer: 8,
  },

  wardrobe: {
    label: "Wardrobe",
    basePrice: 60,
    pricePerDoor: 12,
    baseMinutes: 60,
    minutesPerDoor: 15,
  },

  bed: {
    label: "Bed",
    basePrice: 40,
    baseMinutes: 45,
    sizeMultiplier: {
      single: 1,
      double: 1.2,
      king: 1.4,
    },
  },
} as const;
