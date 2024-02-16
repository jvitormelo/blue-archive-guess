import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guessu")({
  component: Guessu,
});

function Guessu() {
  return (
    <div
      className="grid grid-cols-3 gap-8"
      style={{
        height: "calc(100vh - 4rem)",
      }}
    >
      Guessado
    </div>
  );
}
