import Gals from "../../public/gals.json";

export const gals = Gals.map((gal) => ({
  ...gal,
  parsedAge: parseInt(gal.age),
  parsedHeight: parseInt(gal.height.split("cm")[0]),
  isMultipleVersion: gal.name.includes("("),
}));

export type Gal = (typeof gals)[number];

export const minHeight = Math.min(...gals.map((gal) => gal.parsedHeight));

export const maxHeight = Math.max(...gals.map((gal) => gal.parsedHeight));

export const minAge = Math.min(...gals.map((gal) => gal.parsedAge));

export const maxAge = Math.max(...gals.map((gal) => gal.parsedAge));
