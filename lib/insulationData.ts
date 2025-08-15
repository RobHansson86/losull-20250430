export type Brand = "Hunton" | "Knauf";
export type InsulationType = "oppen" | "slutet0_45" | "slutet45_90";

interface TypeData {
  thicknessPrices: Record<number, number>;
  defaultThickness: number;
}

interface BrandData {
  density: number; // kg per m^3
  types: Partial<Record<InsulationType, TypeData>>;
}

export const insulationData: Record<Brand, BrandData> = {
  Hunton: {
    density: 35,
    types: {
      oppen: {
        thicknessPrices: {
          200: 156,
          250: 187.5,
          300: 225,
          350: 262.5,
          400: 240,
          450: 270,
          500: 300,
          550: 330,
          600: 360,
          650: 390,
          700: 420,
          750: 450,
          800: 480,
        },
        defaultThickness: 200,
      },
      slutet0_45: {
        thicknessPrices: {
          200: 200.2,
          220: 211.75,
          250: 240.63,
          300: 288.75,
          350: 336.88,
          400: 385,
          450: 433.13,
          500: 481.25,
          550: 529.38,
          600: 577.5,
          650: 625.63,
          700: 673.75,
          750: 721.88,
          800: 770,
        },
        defaultThickness: 200,
      },
      slutet45_90: {
        thicknessPrices: {
          70: 86.24,
          95: 117.04,
          120: 147.84,
          145: 159.5,
          170: 187,
          195: 214.5,
          200: 220,
          220: 242,
          250: 275,
          300: 330,
          350: 385,
          400: 440,
          450: 495,
          500: 550,
          550: 605,
          600: 660,
          650: 715,
          700: 770,
          750: 825,
          800: 880,
        },
        defaultThickness: 70,
      },
    },
  },
  Knauf: {
    density: 25,
    types: {
      oppen: {
        thicknessPrices: {
          200: 140.4,
          250: 168.75,
          300: 202.5,
          350: 236.25,
          400: 216,
          450: 243,
          500: 270,
          550: 297,
          600: 324,
          650: 351,
          700: 378,
          750: 405,
          800: 432,
        },
        defaultThickness: 200,
      },
    },
  },
};

export function getTypeLabel(brand: Brand, type: InsulationType): string {
  if (brand === "Hunton") {
    switch (type) {
      case "oppen":
        return "Hunton Öppet Bjälklag";
      case "slutet0_45":
        return "Hunton Slutet 0–45°";
      case "slutet45_90":
        return "Hunton Slutet 45–90°";
      default:
        return type;
    }
  } else {
    switch (type) {
      case "oppen":
        return "Knauf Öppet Bjälklag";
      default:
        return type;
    }
  }
}
