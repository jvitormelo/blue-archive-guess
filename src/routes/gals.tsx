import { GalDetail } from "@/views/gal/detail";
import { GalsFilter } from "@/views/gal/filter";
import { GalsGrid } from "@/views/gal/grid";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gals")({
  component: GalsRoute,
});

function GalsRoute() {
  return (
    <div
      className="grid grid-cols-3 gap-8"
      style={{
        height: "calc(100vh - 4rem)",
      }}
    >
      <GalDetail />
      <GalsGrid />
      <GalsFilter />
    </div>
  );
}
