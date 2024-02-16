import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGalsStore } from "@/views/gal/store";

export const GalDetail = () => {
  const gal = useGalsStore((s) => s.selectedGal);

  if (!gal) return <Card className="gal-details max-h-lvh" />;

  return (
    <Card key={gal.link} className="gal-details max-h-lvh animate-fade">
      <CardHeader className="">
        <CardTitle>{gal.name}</CardTitle>
        <img
          key={gal.iconHighRes}
          src={gal.iconHighRes}
          height={366}
          className="aspect-auto lg:h-[366px]"
          loading="lazy"
          alt={gal.name}
        />
      </CardHeader>

      <CardContent>
        <p>Age: {gal.age}</p>
        <p>Height: {gal.height}</p>
      </CardContent>
      <CardFooter>
        <audio src={gal.voice} controls></audio>
      </CardFooter>
    </Card>
  );
};
