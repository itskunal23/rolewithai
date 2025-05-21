import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">RoleWithAI</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm text-foreground/70 hover:text-foreground">
              Features
            </Link>
            <Link href="#personas" className="text-sm text-foreground/70 hover:text-foreground">
              Personas
            </Link>
            <Link href="/how-it-works" className="text-sm text-foreground/70 hover:text-foreground">
              How it works
            </Link>
            <Link href="#pricing" className="text-sm text-foreground/70 hover:text-foreground">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="#login">Log in</Link>
          </Button>
          <Button size="sm" className="bg-primary" asChild>
            <Link href="#signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
