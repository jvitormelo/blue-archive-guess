import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gal } from "@/data/gals";
import { cn } from "@/lib/utils";
import { GuessuLevel, useGuessuStore } from "@/views/guessu/store";
import { createFileRoute } from "@tanstack/react-router";
import { useReducer, useRef } from "react";
import VictorySound from "@/assets/victory.m4a";

export const Route = createFileRoute("/guessu")({
  component: Guessu,
});

function Guessu() {
  const { currentLevel, actions } = useGuessuStore();

  if (!currentLevel) {
    actions.createLevel();
  }

  return <div>{currentLevel && <LevelView level={currentLevel} />}</div>;
}

function LevelView({ level }: { level: GuessuLevel }) {
  const actions = useGuessuStore((s) => s.actions);

  const victorySound = useRef(new Audio(VictorySound));
  const [selected, setSelected] = useReducer(
    (state: Gal | null, gal: Gal | null) => {
      if (gal?.link === state?.link) {
        return null;
      }
      return gal;
    },
    null
  );

  const [isVictoryOpen, toggleVicotryOpen] = useReducer(
    (state: boolean) => !state,
    false
  );

  const [isDefeatOpen, toggleDefeatOpen] = useReducer(
    (state: boolean) => !state,
    false
  );

  const handleGuess = () => {
    const result = actions.guess(selected!);
    setSelected(null);
    if (result) {
      victorySound.current.volume = 0.2;
      victorySound.current.currentTime = 1.5;
      victorySound.current.play();
      toggleVicotryOpen();
    } else {
      toggleDefeatOpen();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row-reverse">
      <Dialog open={isVictoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-3xl text-yellow-400 font-bold">
              Victory!
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="flex flex-col items-center">
            <span>
              {" "}
              You have successfully guessed
              <strong> {level.correctGal.name}</strong>
            </span>
            <img
              src={level.correctGal.iconHighRes}
              alt={level.correctGal.name}
              width={200}
            />

            <span>
              VA: <strong>{level.correctGal.voiceActor}</strong>
            </span>
            <Button
              onClick={() => {
                toggleVicotryOpen();
                actions.nextLevel();
              }}
              className="mt-4"
            >
              Continue
            </Button>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={isDefeatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-3xl text-red-400 font-bold">
              Defeat!
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="flex flex-col items-center">
            <span>
              {" "}
              The correct answer was
              <strong> {level.correctGal.name}</strong>
            </span>
            <img
              src={level.correctGal.iconHighRes}
              alt={level.correctGal.name}
              width={200}
            />

            <span>
              VA: <strong>{level.correctGal.voiceActor}</strong>
            </span>

            <div className="flex flex-col mt-4">
              <span className="text-lg">
                Your Score was:{" "}
                <strong className="text-xl text-primary">{level.score}</strong>
              </span>
              <Button
                onClick={() => {
                  toggleDefeatOpen();
                  actions.createLevel();
                }}
              >
                Try Again
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Card className="h-fit sticky top-5">
        <CardHeader>
          <CardTitle>Score: {level.score}</CardTitle>
        </CardHeader>

        <CardContent>
          <audio src={level.correctGal.voice} controls />

          <Button
            onClick={handleGuess}
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
