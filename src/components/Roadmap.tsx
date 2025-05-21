import { Separator } from "@/components/ui/separator";

const Roadmap = () => {
  const roadmapData = [
    {
      quarter: "Q1 2024",
      title: "Core Platform Launch",
      items: [
        { name: "Core platform launch", completed: true },
        { name: "Basic AI mentor", completed: true },
        { name: "Skill tracking", completed: true },
        { name: "Learning paths", completed: true },
      ],
    },
    {
      quarter: "Q2 2024",
      title: "Enhanced Personalization",
      items: [
        { name: "Advanced AI mentor", completed: false },
        { name: "Human mentor matching", completed: false },
        { name: "Career roadmap visualization", completed: false },
        { name: "Community features", completed: false },
      ],
    },
    {
      quarter: "Q3 2024",
      title: "Career Tools Expansion",
      items: [
        { name: "AI-powered resume builder", completed: false },
        { name: "Interview preparation", completed: false },
        { name: "Skill certification", completed: false },
        { name: "Job matching", completed: false },
      ],
    },
    {
      quarter: "Q4 2024",
      title: "Enterprise & Mobile",
      items: [
        { name: "Enterprise features", completed: false },
        { name: "Advanced analytics", completed: false },
        { name: "Mobile app", completed: false },
        { name: "API access", completed: false },
      ],
    },
  ];

  return (
    <section id="roadmap" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Feature Roadmap</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Our development plan for building the future of career development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roadmapData.map((quarter, index) => (
            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {quarter.quarter}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{quarter.title}</h3>
                </div>

                <ul className="space-y-3">
                  {quarter.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {item.completed ? (
                          <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3 text-primary"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-zinc-700"></div>
                        )}
                      </div>
                      <span className={`text-sm ${item.completed ? "" : "text-foreground/70"}`}>
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Separator className="bg-zinc-800 my-10" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-xl">
              <h3 className="text-2xl font-bold mb-4">Continuous Improvement</h3>
              <p className="text-foreground/70">
                Our roadmap evolves based on user feedback and industry trends. We're committed to
                continuously enhancing the platform to better serve your career development needs.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center space-x-4">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
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
                  className="h-5 w-5 text-primary"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium">Have a feature idea?</h4>
                <p className="text-xs text-foreground/70">We'd love to hear your suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
