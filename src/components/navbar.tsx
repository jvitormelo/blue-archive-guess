import { Github } from "lucide-react";
export const Navbar = () => {
  return (
    <header className="flex justify-center py-2 bg-primary opacity-70">
      <a
        href="https://github.com/jvitormelo/blue-archive-guess"
        target="_blank"
        rel="noopener noreferrer"
        className=" text-white rounded-full"
      >
        <Github size={24} />
      </a>
    </header>
  );
};
