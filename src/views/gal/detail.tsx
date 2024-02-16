import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGalsStore } from "@/views/gal/store";

export const GalDetail = () => {
  const gal = useGalsStore((s) => s.selectedGal);

  if (!gal) return <Card className="gal-details max-h-lvh" />;

  return (
    <Card className="gal-details max-h-lvh">
      <CardHeader>
        <h1>{gal.name}</h1>
      </CardHeader>

      <CardContent>
        <p>Age: {gal.age}</p>
        <p>Height: {gal.height}</p>
      </CardContent>
    </Card>
  );
};
