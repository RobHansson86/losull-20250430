/**
 * Centralized insulation information used across the application.
 *
 * Each brand contains its insulation types with pricing per thickness
 * and nominal density (kg/m³). If a manufacturer updates prices or
 * densities, adjust the corresponding `prices` or `density` values in
 * this file so that all calculations stay consistent.
 */

export type InsulationType = "oppen" | "slutet0_45" | "slutet45_90";

interface InsulationTypeData {
  /** Display name for UI selections */
  name: string;
  /** Default thickness in millimeters */
  defaultThickness: number;
  /** Material density in kg/m³ */
  density: number;
  /** Price map where key is thickness (mm) and value is price per m² */
  prices: Record<number, number>;
}

interface BrandData {
  name: string;
  types: Record<InsulationType, InsulationTypeData>;
}

export const insulationData: Record<"hunton", BrandData> = {
  hunton: {
    name: "Hunton",
    types: {
      oppen: {
        name: "Hunton Öppet Bjälklag",
        defaultThickness: 200,
        density: 38,
        prices: {
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
          800: 480
        }
      },
      slutet0_45: {
        name: "Hunton Slutet 0–45°",
        defaultThickness: 200,
        density: 52,
        prices: {
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
          800: 770
        }
      },
      slutet45_90: {
        name: "Hunton Slutet 45–90°",
        defaultThickness: 70,
        density: 65,
        prices: {
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
          800: 880
        }
      }
    }
  }
};

export default insulationData;
