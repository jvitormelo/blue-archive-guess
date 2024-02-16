import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex gap-8 w-full justify-center min-h-lvh items-center">
      <Link to="/gals">
        <Button>Guessu</Button>
      </Link>

      <Link to={"/guessu"}>
        <Button>Gals</Button>
      </Link>
    </div>
  );
}
