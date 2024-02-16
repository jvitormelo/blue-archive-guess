import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gal } from "@/data/gals";
import { cn } from "@/lib/utils";
import { GuessuLevel, useGuessuStore } from "@/views/guessu/store";
import { createFileRoute } from "@tanstack/react-router";
import { useReducer } from "react";

export const Route = createFileRoute("/guessu")({
  component: Guessu,
});

function Guessu() {
  const { currentLevel, actions } = useGuessuStore();

  function handleStart() {
    actions.createLevel();
  }

  return (
    <div>
      {currentLevel ? (
        <LevelView level={currentLevel} />
      ) : (
        <Button onClick={handleStart}>Start</Button>
      )}
    </div>
  );
}

function LevelView({ level }: { level: GuessuLevel }) {
  const actions = useGuessuStore((s) => s.actions);

  const [selected, setSelected] = useReducer(
    (state: Gal | null, gal: Gal | null) => {
      if (gal?.link === state?.link) {
        return null;
      }
      return gal;
    },
    null
  );

  return (
    <div className="flex flex-col lg:flex-row-reverse">
      <Card className="h-fit sticky top-5">
        <CardHeader>
          <CardTitle>Round: {level.level}</CardTitle>
        </CardHeader>
        <CardContent>
          <audio src={level.correctGal.voice} controls />

          <Button
            onClick={() => {
              const result = actions.guess(selected!);

              if (result) {
                setSelected(null);
              } else {
                alert("Try again");
                window.location.reload();
              }
            }}
            className="mt-4 w-full"
            disabled={selected === null}
          >
            Confirm
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4 flex-wrap justify-center">
        {level.options.map((gal) => (
          <Card
            key={gal.link}
            onClick={() => setSelected(gal)}
            className={cn("cursor-pointer", {
              "border-green-900 bg-green-400": selected?.link === gal.link,
            })}
          >
            <CardHeader className="text-center">
              <CardTitle>{gal.name}</CardTitle>
              <img
                className="h-[225px]"
                width={200}
                src={gal.iconHighRes}
                alt={gal.name}
              />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
