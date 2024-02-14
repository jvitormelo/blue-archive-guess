import { useMemo, useState } from "react";
import "./App.css";
import { Gal, gals } from "./data/gals";

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
    ];
  }, [height, showMultipleVersions, age]);

  const filteredGals = useMemo(() => {
    return gals.filter((gal) => activeFilter.every((filter) => filter(gal)));
  }, [activeFilter]);
  return (
    <main>
      <div>
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
          <div key={i} className="hexagon-border">
            <div className="hexagon">
              <img width={40} height={45} loading="lazy" src={gal.icon}></img>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
