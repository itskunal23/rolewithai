import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background py-8 border-t border-zinc-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="text-sm text-white/60 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#support" className="text-sm text-white/60 hover:text-white transition-colors">
              Support
            </Link>
          </div>

          {/* Privacy Message */}
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Lock className="h-4 w-4 text-green-400" />
            <span>Your data is encrypted. AI runs entirely on your device.</span>
          </div>
        </div>

        <Separator className="bg-zinc-800 my-4" />

        <div className="text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} RoleWithAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
