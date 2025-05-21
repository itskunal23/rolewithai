"use client";

import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "RoleWithAI has revolutionized my career transition. The AI mentor accurately identified my transferable skills and created a personalized learning path that made my move from marketing to data science possible.",
      author: "Alex Chen",
      role: "Data Scientist at TechCorp",
      handle: "@AlexChen",
    },
    {
      quote: "The skill tracking feature provided clarity on exactly what I needed to improve to advance in my career. Within 6 months, I was promoted to a senior position thanks to the focused development plan.",
      author: "Sarah Johnson",
      role: "Senior Developer at InnovateTech",
      handle: "@SarahJ",
    },
    {
      quote: "As someone who loves learning, I struggled with information overload. RoleWithAI curated exactly what I needed to learn, in the right order, saving me countless hours and accelerating my growth.",
      author: "Michael Rodriguez",
      role: "Data Analytics Lead at DataFlow",
      handle: "@MikeRodriguez",
    },
    {
      quote: "The human mentor matching feature connected me with an industry veteran who provided insights I couldn't find anywhere else. This mentorship was instrumental in helping me navigate complex career decisions.",
      author: "Priya Patel",
      role: "Product Manager at Innovate Inc",
      handle: "@PriyaPatel",
    },
    {
      quote: "I was skeptical about AI career guidance, but RoleWithAI's recommendations were surprisingly accurate. The platform understood my unique skills and suggested roles I hadn't considered but were perfect fits.",
      author: "James Wilson",
      role: "UX Researcher at DesignHub",
      handle: "@JWilson",
    },
    {
      quote: "The career roadmap visualization gave me a clear picture of my professional journey. Being able to see the path ahead, with specific milestones, helped me stay motivated and focused on my goals.",
      author: "Emma Thompson",
      role: "Marketing Director at GrowthLabs",
      handle: "@EmmaT",
    },
    {
      quote: "The AI mentor's ability to adapt to my changing interests and provide relevant resources kept me engaged with my learning journey. It's like having a career coach available 24/7.",
      author: "David Kim",
      role: "AI Engineer at TechFuture",
      handle: "@DavidKim",
    },
    {
      quote: "The community features connected me with professionals facing similar challenges. The peer support and collaborative learning environment enhanced my experience and expanded my network.",
      author: "Olivia Garcia",
      role: "Content Strategist at MediaPro",
      handle: "@OliviaG",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-zinc-900/50">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Success Stories</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Hear from professionals who transformed their careers with RoleWithAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black border border-zinc-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-foreground/90 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-sm font-medium">{testimonial.author}</p>
                    <p className="text-xs text-foreground/70">{testimonial.role}</p>
                    <p className="text-xs text-primary">{testimonial.handle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Join thousands of professionals who are transforming their careers with
            personalized AI guidance and structured learning pathways.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
