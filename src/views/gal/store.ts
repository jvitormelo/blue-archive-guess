import { Gal } from "@/data/gals";
import { create } from "zustand";

type GalsFilter = {
  name: string;
  height: string;
  age: string;
  showMultipleVersions: boolean;
};

const initialFilters: GalsFilter = {
  name: "",
  height: "",
  age: "",
  showMultipleVersions: true,
};

type GalStore = {
  selectedGal: Gal | null;
  galState: Map<
    string,
    {
      isVoiceActive: boolean;
    }
  >;
  filters: GalsFilter;
  config: {
    soundDelay: number;
  };
  actions: {
    toggleVoiceActive: (name: string) => void;
    setSelectedGal: (gal: Gal | null) => void;
    setFilter: (filter: Partial<GalsFilter>) => void;
  };
};

export const useGalsStore = create<GalStore>((set) => ({
  galState: new Map(),
  selectedGal: null,
  config: {
    soundDelay: 500,
  },
  filters: initialFilters,
  actions: {
    toggleVoiceActive: (name) => {
      set((state) => {
        const current = state.galState.get(name);
        if (!current) {
          state.galState.set(name, { isVoiceActive: true });
        } else {
          state.galState.set(name, { isVoiceActive: !current.isVoiceActive });
        }

        return {
          galState: new Map(state.galState),
        };
      });
    },
    setSelectedGal: (gal) => {
      set({ selectedGal: gal });
    },
    setFilter: (filter) => {
      set((state) => ({
        filters: {
          ...state.filters,
          ...filter,
        },
      }));
    },
  },
}));
