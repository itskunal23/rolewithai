import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "AI Mentor",
      description: "Personalized AI guidance for career decisions and skill development with real-time advice.",
      details: [
        "Natural language chat interface",
        "Career advice generation",
        "Learning path recommendations",
        "Progress tracking"
      ],
    },
    {
      title: "Skill Tracking",
      description: "Visualize your skill development journey with detailed analytics and growth metrics.",
      details: [
        "Skill assessment",
        "Progress visualization",
        "Learning recommendations",
        "Achievement system"
      ],
    },
    {
      title: "Learning Paths",
      description: "Curated learning experiences tailored to your career goals and industry requirements.",
      details: [
        "Personalized curriculum",
        "Progress tracking",
        "Resource recommendations",
        "Milestone system"
      ],
    },
    {
      title: "Career Roadmap",
      description: "Visualize your career journey and set milestones for continuous professional growth.",
      details: [
        "Career trajectory planning",
        "Industry insights",
        "Role requirements",
        "Skill gap analysis"
      ],
    },
    {
      title: "Human Mentorship",
      description: "Connect with industry professionals for personalized guidance and networking opportunities.",
      details: [
        "Mentor matching",
        "Scheduled sessions",
        "Feedback system",
        "Community access"
      ],
    },
    {
      title: "Job Matching",
      description: "Find opportunities that match your skills, experience, and career aspirations.",
      details: [
        "Job recommendations",
        "Application tracking",
        "Interview preparation",
        "Career transition support"
      ],
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Core Features</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Our AI-powered platform delivers personalized career guidance with industry-leading tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-foreground/70">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
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
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
