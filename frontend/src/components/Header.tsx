"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">RoleWithAI</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/personas" className="text-sm text-white/70 hover:text-white transition-colors">
            Personas
          </Link>
          <Link href="/how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Right: Auth + Ask AI² */}
        <div className="flex items-center gap-3">
          {/* Ask AI² Button */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              asChild
            >
              <Link href="#ai">
                <MessageSquare className="h-3 w-3 mr-1" />
                Ask AI²
              </Link>
            </Button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
              <Link href="#login">Log in</Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" asChild>
              <Link href="#signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
