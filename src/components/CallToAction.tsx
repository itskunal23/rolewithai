"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none" />

      <div className="container px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
            Focus on what matters.
            <span className="gradient-text block mt-2">Your career growth.</span>
          </h2>

          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Join thousands of professionals who are transforming their careers with personalized AI guidance
            and structured learning pathways.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary">
              <Link href="#signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
              <Link href="#demo">Request Demo</Link>
            </Button>
          </div>

          <div className="pt-6 text-sm text-foreground/60">
            No credit card required for free tier.
            Upgrade or cancel anytime.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
