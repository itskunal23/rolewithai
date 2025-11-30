"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      description: "Basic career guidance and learning tools",
      price: "$0",
      frequency: "forever",
      features: [
        "Basic AI mentor",
        "Limited skill tracking",
        "Community access",
        "Basic learning paths",
        "Career resource library",
      ],
      limitations: [
        "Limited AI interactions",
        "Basic skill assessments only",
        "No human mentorship",
        "Standard learning content",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced features for serious career development",
      price: "$19",
      frequency: "per month",
      features: [
        "Advanced AI mentor",
        "Full skill tracking",
        "Community access",
        "Premium learning paths",
        "Career roadmap visualization",
        "Monthly human mentor session",
        "Resume review & feedback",
        "Interview preparation",
        "Job matching recommendations",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Custom solutions for organizations",
      price: "Custom",
      frequency: "pricing",
      features: [
        "Everything in Pro",
        "Team management features",
        "Advanced analytics dashboard",
        "Customized learning paths",
        "Dedicated account manager",
        "API access",
        "White-labeling options",
        "Custom integrations",
        "Priority support",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pricing Plans</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Choose the perfect plan for your career development needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`${
                tier.popular
                  ? "border-primary bg-black relative"
                  : "bg-zinc-900 border-zinc-800"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-sm text-foreground/70 ml-1">{tier.frequency}</span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">What's included:</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.limitations.length > 0 && (
                    <>
                      <h4 className="text-sm font-medium mt-6">Limitations:</h4>
                      <ul className="space-y-2">
                        {tier.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-5 w-5 mr-2 text-foreground/50"
                            >
                              <line x1="18" x2="6" y1="6" y2="18"></line>
                              <line x1="6" x2="18" y1="6" y2="18"></line>
                            </svg>
                            <span className="text-sm text-foreground/70">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${tier.popular ? "bg-primary" : ""}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h3 className="text-xl font-bold mb-2">Need a custom solution?</h3>
                <p className="text-foreground/70 max-w-xl">
                  Contact our sales team for custom enterprise solutions designed for your organization's specific needs.
                </p>
              </div>
              <Button variant="outline" className="min-w-[150px]">Contact Sales</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
