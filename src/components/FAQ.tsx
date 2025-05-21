"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FAQ = () => {
  const [open, setOpen] = useState<string | null>(null);

  const faqs = [
    {
      id: "faq-1",
      question: "What sets RoleWithAI apart from other career development platforms?",
      answer: "RoleWithAI uniquely combines AI-powered personalization with human mentorship to create a comprehensive career development experience. Our platform adapts to your specific goals, skills, and learning style, providing guidance that's truly tailored to your needs. Unlike generic learning platforms, we focus on holistic career development, integrating skill assessment, learning resources, and career planning into a seamless experience."
    },
    {
      id: "faq-2",
      question: "How accurate is the AI mentor's guidance?",
      answer: "Our AI mentor is built on advanced machine learning models trained on career development data from various industries. It continuously improves through user interactions and feedback. While the AI provides highly relevant guidance based on your profile and goals, we combine this with human expert oversight to ensure accuracy and practical relevance. This hybrid approach delivers the benefits of AI's data processing capabilities with human expertise and experience."
    },
    {
      id: "faq-3",
      question: "Can RoleWithAI help with career transitions?",
      answer: "Absolutely. Career transitions are one of our platform's strengths. RoleWithAI analyzes your existing skills and identifies transferable abilities relevant to your target field. It then creates a personalized learning path to bridge any gaps, recommends networking opportunities, and provides industry-specific guidance. Our human mentors with experience in career transitions can provide additional insights and support throughout your journey."
    },
    {
      id: "faq-4",
      question: "How does the skill tracking feature work?",
      answer: "Our skill tracking system combines self-assessment, AI-powered evaluation based on your completed learning activities, and optional verification through practical challenges. The platform visualizes your progress, identifying strengths and growth areas. It also benchmarks your skills against industry standards and role requirements, helping you understand where you stand and what to focus on next. The system updates in real-time as you complete learning activities and skill assessments."
    },
    {
      id: "faq-5",
      question: "Are the learning resources created by RoleWithAI?",
      answer: "RoleWithAI curates high-quality learning resources from trusted providers rather than creating all content in-house. This approach allows us to offer comprehensive coverage across various domains and skill levels. Our AI evaluates thousands of resources based on quality, relevance, and effectiveness, then matches them to your specific learning needs and style. We also partner with industry experts to create exclusive content for specialized topics and emerging fields."
    },
    {
      id: "faq-6",
      question: "How does the human mentorship program work?",
      answer: "Our mentorship program connects you with industry professionals based on your career goals, industry, and specific needs. After completing your profile and mentorship preferences, our algorithm suggests potential matches. You can review mentor profiles and select your preferred mentor. Mentorship includes scheduled video sessions, messaging access, and progress reviews. Mentors provide personalized advice, industry insights, and accountability to complement the AI guidance."
    },
  ];

  const toggleFaq = (id: string) => {
    setOpen(open === id ? null : id);
  };

  return (
    <section id="faq" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to know about RoleWithAI and how it can help your career.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-zinc-800 py-5">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFaq(faq.id)}
              >
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <span className="ml-4 shrink-0">
                  {open === faq.id ? (
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
                      className="h-5 w-5"
                    >
                      <line x1="18" x2="6" y1="6" y2="18" />
                      <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                  ) : (
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
                      className="h-5 w-5"
                    >
                      <line x1="12" x2="12" y1="5" y2="19" />
                      <line x1="5" x2="19" y1="12" y2="12" />
                    </svg>
                  )}
                </span>
              </button>

              {open === faq.id && (
                <div className="mt-4 text-foreground/70 text-sm">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-5 text-foreground/70">Still have questions?</p>
          <Dialog>
            <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Contact Support
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Get in touch</DialogTitle>
                <DialogDescription>
                  Our support team is ready to help with any questions you have about RoleWithAI.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-foreground/70">support@rolewithai.com</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Chat Support</p>
                  <p className="text-sm text-foreground/70">Available 24/7 within the platform</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Community Forum</p>
                  <p className="text-sm text-foreground/70">Join our community for peer support</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
