import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGalsStore } from "@/views/gal/store";

export const GalDetail = () => {
  const gal = useGalsStore((s) => s.selectedGal);

  if (!gal) return <Card className="gal-details max-h-lvh" />;

  return (
    <Card className="gal-details max-h-lvh">
      <CardHeader>
        <CardTitle>
          <h1>{gal.name}</h1>
        </CardTitle>
        <img
          key={gal.iconHighRes}
          src={gal.iconHighRes}
          height={300}
          className="aspect-auto"
          loading="lazy"
          alt={gal.name}
        />
      </CardHeader>

      <CardContent>
        <p>Age: {gal.age}</p>
        <p>Height: {gal.height}</p>
      </CardContent>
    </Card>
  );
};
