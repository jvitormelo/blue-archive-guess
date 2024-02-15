import { useMemo, useRef, useState } from "react";
import "./App.css";
import { Gal, gals } from "./data/gals";
import { create } from "zustand";

function simpleOperatorFilter(
  operator: string,
  value1: number,
  value2: number
) {
  if (operator === ">") {
    return value1 > value2;
  }
  if (operator === "<") {
    return value1 < value2;
  }
  if (operator === "=") {
    return value1 === value2;
  }
  if (operator === ">=") {
    return value1 >= value2;
  }
  if (operator === "<=") {
    return value1 <= value2;
  }
}

function splitOperatorAndValue(input: string) {
  const regex = /([<>]=?)(\d+)/;
  const match = input.match(regex);

  if (!match) return null;

  return [match[1], parseInt(match[2])] as const;
}

function App() {
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [name, setName] = useState("");

  const { toggleVoiceActive } = useGalsStore((s) => s.actions);

  const [soundDelay, setSoundDelay] = useState(500);

  const [showMultipleVersions, setShowMultipleVersions] = useState(true);

  const activeFilter = useMemo(() => {
    const heightMatch = splitOperatorAndValue(height);
    const ageMatch = splitOperatorAndValue(age);

    return [
      (gal: Gal) => {
        if (!heightMatch) return true;
        const [operator, value] = heightMatch;

        return simpleOperatorFilter(operator, gal.parsedHeight, value);
      },
      (gal: Gal) => {
        if (showMultipleVersions) return true;
        return !gal.isMultipleVersion;
      },

      (gal: Gal) => {
        if (!ageMatch) return true;
        const [operator, value] = ageMatch;
        console.log(operator);
        return simpleOperatorFilter(operator, gal.parsedAge, value);
      },
      (gal: Gal) => gal.name.toLowerCase().includes(name.toLowerCase()),
    ];
  }, [height, showMultipleVersions, age, name]);

  const filteredGals = useMemo(() => {
    return gals.filter((gal) => activeFilter.every((filter) => filter(gal)));
  }, [activeFilter]);

  function playAllSound() {
    filteredGals.forEach((gal, i) => {
      setTimeout(() => {
        const audio = new Audio(gal.voice);

        audio.play();
        audio.onplay = () => {
          toggleVoiceActive(gal.link);
        };
        audio.onended = () => {
          toggleVoiceActive(gal.link);
        };
      }, i * soundDelay);
    });
  }

  return (
    <main>
      <div>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Height
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>

        <label>
          Age
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <label htmlFor="showMultipleVersions">
          Show multiple versions
          <input
            id="showMultipleVersions"
            type="checkbox"
            checked={showMultipleVersions}
            onChange={(e) => setShowMultipleVersions(e.target.checked)}
          />
        </label>

        <label>
          Next Voice Delay
          <input
            value={soundDelay}
            type="number"
            onChange={(e) => setSoundDelay(parseInt(e.target.value))}
          ></input>
        </label>
        <button onClick={playAllSound}>BRU ARCHIVUUUU</button>
      </div>

      <div
        style={{
          paddingTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          gridTemplateColumns: "repeat(4, 1fr)",
          maxWidth: "400px",
          marginInline: "auto",
        }}
      >
        {filteredGals.map((gal, i) => (
          <GalItem key={i} gal={gal} />
        ))}
      </div>
    </main>
  );
}

function GalItem({ gal }: { gal: Gal }) {
  const audio = new Audio(gal.voice);

  const galState = useGalsStore((s) => s.galState.get(gal.link));
  const intervalRef = useRef(0);

  const playSound = () => {
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(() => {
      audio.play();
    }, 500);
  };

  const stopSound = () => {
    audio.pause();
    audio.currentTime = 0;
    clearTimeout(intervalRef.current);
  };

  return (
    <div
      className="hexagon-border"
      onMouseEnter={playSound}
      onMouseLeave={stopSound}
      data-voice-active={galState?.isVoiceActive}
    >
      <div className="hexagon">
        <img
          className="hexagon-image"
          width={40}
          height={45}
          loading="lazy"
          src={gal.icon}
        />
      </div>
    </div>
  );
}

type GalStore = {
  galState: Map<
    string,
    {
      isVoiceActive: boolean;
    }
  >;
  actions: {
    toggleVoiceActive: (name: string) => void;
  };
};
const useGalsStore = create<GalStore>((set) => ({
  galState: new Map(),
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
  },
}));

export default App;
