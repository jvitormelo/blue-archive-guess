import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Gal, gals } from "@/data/gals";
import { simpleOperatorFilter, splitOperatorAndValue } from "@/utils/filter";
import { useGalsStore } from "@/views/gal/store";
import { useMemo, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const GalsGrid = () => {
  const { setSelectedGal } = useGalsStore((s) => s.actions);
  const { height, age, name, showMultipleVersions } = useGalsStore(
    (s) => s.filters
  );

  const soundDelay = useGalsStore((s) => s.config.soundDelay);

  const { toggleVoiceActive } = useGalsStore((s) => s.actions);

  const [intervals, setInterval] = useState<NodeJS.Timeout[]>([]);

  function playAllSound() {
    const galsIntervals = filteredGals.map((gal, i) => {
      const interval = setTimeout(() => {
        const audio = new Audio(gal.voice);

        audio.play();
        audio.onplay = () => {
          toggleVoiceActive(gal.link);
        };
        audio.onended = () => {
          toggleVoiceActive(gal.link);
        };
      }, i * soundDelay);
      return interval;
    });

    setInterval(galsIntervals);
  }

  function stopAllSound() {
    intervals.forEach(clearTimeout);
    setInterval([]);
  }

  const isPlaying = intervals.length > 0;

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

  return (
    <div className="flex flex-col overflow-y-auto items-center">
      <div className="pb-4 flex gap-2">
        <Button onClick={isPlaying ? stopAllSound : playAllSound}>
          {isPlaying ? "😭😭😭" : "BRUUUU ARCHIVU"}
        </Button>
        <Popover>
          <PopoverTrigger
            disabled={isPlaying}
            className="disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Settings className="my-auto" />
          </PopoverTrigger>
          <PopoverContent>
            <h2 className="mb-1">Sound delay</h2>
            <Slider
              className="mb-2"
              value={[soundDelay]}
              onValueChange={(e) => {
                useGalsStore.setState({ config: { soundDelay: e[0] } });
              }}
              min={0}
              max={1500}
              step={50}
            />
            {soundDelay}ms
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap gap-4 overflow-x-hidden  overflow-y-scroll  justify-center h-full w-full">
        {filteredGals.map((gal, i) => (
          <GalItem onSelect={() => setSelectedGal(gal)} key={i} gal={gal} />
        ))}
      </div>
    </div>
  );
};

function GalItem({ gal, onSelect }: { gal: Gal; onSelect: () => void }) {
  const audio = new Audio(gal.voice);

  const galState = useGalsStore((s) => s.galState.get(gal.link));
  const intervalRef = useRef<NodeJS.Timeout>();

  const playSound = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
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
      onClick={onSelect}
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
