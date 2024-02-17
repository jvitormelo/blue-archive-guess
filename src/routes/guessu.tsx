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
import DefeatSound from "@/assets/defeat.m4a";

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
  const defeatSound = useRef(new Audio(DefeatSound));
  const [selected, setSelected] = useReducer(
    (state: Gal | null, gal: Gal | null) => {
      if (gal?.link === state?.link) {
        return null;
      }
      return gal;
    },
    null
  );

  const [isVictoryOpen, toggleVictoryOpen] = useReducer(
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
      victorySound.current.currentTime = 0;
      victorySound.current.play();
      toggleVictoryOpen();
    } else {
      setTimeout(() => {
        defeatSound.current.volume = 0.2;
        defeatSound.current.currentTime = 0;
        defeatSound.current.play();
      }, 500);

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
          </DialogDescription>
          <Button
            onClick={() => {
              victorySound.current.pause();
              toggleVictoryOpen();
              actions.nextLevel();
            }}
            className="mt-4 w-fit mx-auto"
          >
            Continue
          </Button>
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
          </DialogDescription>
          <div className="flex flex-col mt-4 text-center">
            <span className="text-lg mb-1">
              Your Score was:{" "}
              <strong className="text-xl text-primary">{level.score}</strong>
            </span>
            <Button
              className="w-fit mx-auto"
              onClick={() => {
                defeatSound.current.pause();
                toggleDefeatOpen();
                actions.createLevel();
              }}
            >
              Try Again
            </Button>
          </div>
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

      <div className="grid grid-cols-2 lg:flex gap-3 lg:gap-4 flex-wrap justify-center pt-4 lg:pt-0">
        {level.options.map((gal) => (
          <button onClick={() => setSelected(gal)} key={gal.link}>
            <Card
              className={cn("h-full fade-in-5", {
                "border-green-900 bg-green-400": selected?.link === gal.link,
              })}
            >
              <CardHeader className="text-center h-full">
                <CardTitle>{gal.name}</CardTitle>

                <img
                  className="lg:h-[225px] "
                  width={200}
                  src={gal.iconHighRes}
                  alt={gal.name}
                />
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
