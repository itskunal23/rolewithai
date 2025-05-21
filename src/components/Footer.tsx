import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background py-12 border-t border-zinc-800">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold">RoleWithAI</span>
            </Link>
            <p className="text-sm text-foreground/60 max-w-xs">
              AI-powered career development platform helping professionals navigate their career journey.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-foreground/60 hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-foreground/60 hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#ai-mentor" className="text-sm text-foreground/60 hover:text-foreground">
                    AI Mentor
                  </Link>
                </li>
                <li>
                  <Link href="#skill-tracking" className="text-sm text-foreground/60 hover:text-foreground">
                    Skill Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#learning-paths" className="text-sm text-foreground/60 hover:text-foreground">
                    Learning Paths
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#blog" className="text-sm text-foreground/60 hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#guides" className="text-sm text-foreground/60 hover:text-foreground">
                    Career Guides
                  </Link>
                </li>
                <li>
                  <Link href="#case-studies" className="text-sm text-foreground/60 hover:text-foreground">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-sm text-foreground/60 hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="text-sm text-foreground/60 hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="text-sm text-foreground/60 hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-sm text-foreground/60 hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#privacy" className="text-sm text-foreground/60 hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="text-sm text-foreground/60 hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#cookies" className="text-sm text-foreground/60 hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <div className="mt-8 flex flex-col md:flex-row justify-between">
          <p className="text-xs text-foreground/60">
            © {new Date().getFullYear()} RoleWithAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#twitter" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">Twitter</span>
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
                className="h-4 w-4"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
            <Link href="#linkedin" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">LinkedIn</span>
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
                className="h-4 w-4"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
            <Link href="#instagram" className="text-foreground/60 hover:text-foreground">
              <span className="sr-only">Instagram</span>
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
                className="h-4 w-4"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
