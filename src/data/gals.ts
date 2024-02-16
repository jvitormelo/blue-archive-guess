import Gals from "../../public/gals.json";

export const gals = Gals.map((gal) => ({
  ...gal,
  parsedAge: parseInt(gal.age),
  parsedHeight: parseInt(gal.height.split("cm")[0]),
  isMultipleVersion: gal.name.includes("("),
}));

export type Gal = (typeof gals)[number];

export const allSchools = Array.from(new Set(gals.map((gal) => gal.school)));
