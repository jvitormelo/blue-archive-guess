import { GalDetail } from "@/views/gal/detail";
import { GalsFilter } from "@/views/gal/filter";
import { GalsGrid } from "@/views/gal/grid";

export const GalsView = () => {
  return (
    <div className="grid grid-cols-3 gap-8">
      <GalDetail />
      <GalsGrid />
      <GalsFilter />
    </div>
  );
};
