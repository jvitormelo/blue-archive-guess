import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useGalsStore } from "@/views/gal/store";

export const GalsFilter = () => {
  const { age, height, name, showMultipleVersions } = useGalsStore(
    (s) => s.filters
  );

  const { setFilter } = useGalsStore((s) => s.actions);

  return (
    <Card className="max-h-lvh">
      <CardHeader>Find the perfect gal</CardHeader>

      <CardContent className="flex flex-col gap-4">
        <label className="flex gap-2 items-center">
          Name
          <Input
            type="text"
            value={name}
            onChange={(e) => setFilter({ name: e.target.value })}
          />
        </label>
        <label className="flex gap-2 items-center">
          Height
          <Input
            type="text"
            value={height}
            onChange={(e) => setFilter({ height: e.target.value })}
          />
        </label>

        <label className="flex gap-2 items-center">
          Age
          <Input
            type="text"
            value={age}
            onChange={(e) => setFilter({ age: e.target.value })}
          />
        </label>

        <label
          htmlFor="showMultipleVersions"
          className="flex gap-2 items-center"
        >
          Show multiple versions
          <Switch
            id="showMultipleVersions"
            checked={showMultipleVersions}
            onCheckedChange={(e) => setFilter({ showMultipleVersions: e })}
          />
        </label>
      </CardContent>
    </Card>
  );
};
