"use client";

import { Card, CardContent } from "@/components/ui/card";

const Personas = () => {
  const personas = [
    {
      name: "Alex",
      role: "Career Changer",
      background: "Marketing professional",
      goal: "Transition to AI/ML",
      painPoints: ["Unclear path", "Skill gaps", "Industry knowledge"],
      needs: ["Structured learning", "Mentorship", "Skill validation"],
    },
    {
      name: "Sarah",
      role: "Tech Professional",
      background: "Software Engineer",
      goal: "Career advancement",
      painPoints: ["Skill validation", "Networking", "Growth opportunities"],
      needs: ["Skill assessment", "Industry insights", "Leadership training"],
    },
    {
      name: "Michael",
      role: "Learning Enthusiast",
      background: "Data Analyst",
      goal: "Continuous learning",
      painPoints: ["Time management", "Focus", "Information overload"],
      needs: ["Personalized learning", "Progress tracking", "Structured content"],
    },
  ];

  return (
    <section id="personas" className="py-20 bg-zinc-900/50">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Who We Help</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            RoleWithAI is designed for professionals at every stage of their career journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <Card key={index} className="bg-black border border-zinc-800 overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{persona.name}</h3>
                    <p className="text-sm text-primary font-medium">{persona.role}</p>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60 uppercase font-medium mb-1">Background</div>
                    <p className="text-sm">{persona.background}</p>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60 uppercase font-medium mb-1">Goal</div>
                    <p className="text-sm">{persona.goal}</p>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60 uppercase font-medium mb-1">Pain Points</div>
                    <ul className="text-sm space-y-1">
                      {persona.painPoints.map((point, i) => (
                        <li key={i} className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 mr-2"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs text-foreground/60 uppercase font-medium mb-1">Needs</div>
                    <ul className="text-sm space-y-1">
                      {persona.needs.map((need, i) => (
                        <li key={i} className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Whether you're looking to change careers, advance in your current role, or simply enhance your skills,
            RoleWithAI provides the guidance and tools you need to succeed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Personas;
