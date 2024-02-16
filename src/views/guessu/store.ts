import { Gal, gals } from "@/data/gals";
import { create } from "zustand";

export type GuessuLevel = { level: number; correctGal: Gal; options: Gal[] };

type Store = {
  currentLevel: GuessuLevel | null;
  levelHistory: GuessuLevel[];

  actions: {
    createLevel: () => void;
    guess: (gal: Gal) => boolean;
  };
};

export const useGuessuStore = create<Store>((set, get) => ({
  currentLevel: null,
  levelHistory: [],
  actions: {
    createLevel: () => {
      set({
        currentLevel: generateFirstLevel(),

        levelHistory: [],
      });
    },
    guess: (galGuess) => {
      const currentLevel = get().currentLevel!;
      const isCorrect = currentLevel.correctGal.link === galGuess.link;

      if (!isCorrect) {
        return false;
      }

      set((state) => {
        const newHistory = [...state.levelHistory, currentLevel];

        const { correctGal, options } = generateGals(
          newHistory.flatMap((level) => level.options)
        );

        return {
          currentLevel: {
            level: currentLevel.level + 1,
            correctGal,
            options,
          },
          levelHistory: newHistory,
        };
      });

      return true;
    },
  },
}));

function generateFirstLevel(): GuessuLevel {
  const { correctGal, options } = generateGals([]);

  return {
    level: 1,
    correctGal,
    options,
  };
}

function generateGals(exclude: Gal[] = []) {
  const correctGal = getRandomGal(exclude);

  const options: Gal[] = [];

  for (let i = 0; i < 4; i++) {
    options.push(getRandomGal([...exclude, ...options]));
  }

  return {
    correctGal,
    options: shuffle([correctGal, ...options]),
  };
}

const getRandomGal = (exclude: Gal[] = []): Gal => {
  const excludeLinks = exclude.map((gal) => gal.link);
  const filteredGals = gals.filter((gal) => !excludeLinks.includes(gal.link));

  const randomIndex = Math.floor(Math.random() * filteredGals.length);
  return filteredGals[randomIndex];
};

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
