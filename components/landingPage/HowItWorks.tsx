import { User, FolderIcon, TagIcon, Send } from "lucide-react";
import { BentoCard,} from "@/components/magicui/bento-grid";

const steps = [
  {
    Icon: User,
    name: "Create Your Account",
    description: "Sign up in seconds — no credit card needed.",
    href: "/docs#get-started",
    cta: "Get started",
    background: <img className="absolute -right-20 -top-20 opacity-10" alt="decoration" />,
    className: "lg:col-span-1",
  },
  {
    Icon: FolderIcon,
    name: "Set Up Your Workspace",
    description: "Organize by team, project, or client — however you work.",
    href: "/docs#workspace",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-10" alt="decoration" />,
    className: "lg:col-span-1",
  },
  {
    Icon: TagIcon,
    name: "Add Categories & Topics",
    description: "Structure feedback for features, bugs, ideas and more.",
    href: "/docs#categories",
    cta: "See example",
    background: <img className="absolute -right-20 -top-20 opacity-10" alt="decoration" />,
    className: "lg:col-span-1",
  },
  {
    Icon: Send,
    name: "Share Magic Link & Collect",
    description: "Send invite links via email — no login needed to respond.",
    href: "/docs#invites",
    cta: "How it works",
    background: <img className="absolute -right-20 -top-20 opacity-10" alt="decoration" />,
    className: "lg:col-span-1",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center space-y-4 mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          How It Works — Start in Minutes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get up and running with just a few clicks. Whether you’re a solo
          creator or a growing team, collecting structured feedback has never
          been easier.
        </p>
      </div>

      {/* Grid layout: 1 column on small screens, 2 columns from md and up */}
      <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <BentoCard key={step.name} {...step} />
        ))}
      </div>
    </section>
  );
}
