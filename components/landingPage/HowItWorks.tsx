import {
  User,
  FolderIcon,
  TagIcon,
  Send,
} from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";


const steps = [
  {
    Icon: User,
    name: "Create Your Account",
    description: "Sign up in seconds — no credit card needed.",
    href: "/docs#get-started",
    cta: "Get started",
    background: <img className="absolute -right-20 -top-20 opacity-10" />,
    className: "lg:col-span-1",
  },
  {
    Icon: FolderIcon,
    name: "Set Up Your Workspace",
    description: "Organize by team, project, or client — however you work.",
    href: "/docs#workspace",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-10" />,
    className: "lg:col-span-1",
  },
  {
    Icon: TagIcon,
    name: "Add Categories & Topics",
    description: "Structure feedback for features, bugs, ideas and more.",
    href: "/docs#categories",
    cta: "See example",
    background: <img className="absolute -right-20 -top-20 opacity-10" />,
    className: "lg:col-span-1",
  },
  {
    Icon: Send,
    name: "Share Magic Link & Collect",
    description: "Send invite links via email — no login needed to respond.",
    href: "/docs#invites",
    cta: "How it works",
    background: <img className="absolute -right-20 -top-20 opacity-10" />,
    className: "lg:col-span-1",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center space-y-4 mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          How It Works — Start in Minutes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get up and running with just a few clicks. Whether you’re a solo creator or a growing team, collecting structured feedback has never been easier.
        </p>
      </div>

      {/* Grid layout: 1 column on small screens, 2 columns from md and up */}
      <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step) => (
          <BentoCard key={step.name} {...step} />
        ))}
      </div>

      {/* Terminal - same width as 2 cards + gap */}
      <div className="w-full flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-3xl mx-auto flex justify-center items-center">
          <Terminal>
            <TypingAnimation>&gt; npx feedback-app init</TypingAnimation>

            <AnimatedSpan delay={1500} className="text-green-500">
              <span>✔ Creating your account...</span>
            </AnimatedSpan>

            <AnimatedSpan delay={2000} className="text-green-500">
              <span>✔ Setting up workspace: "Acme Inc"</span>
            </AnimatedSpan>

            <AnimatedSpan delay={2500} className="text-green-500">
              <span>✔ Added categories: Features, Bugs, Ideas</span>
            </AnimatedSpan>

            <AnimatedSpan delay={3000} className="text-green-500">
              <span>✔ Created feedback topic: "New Dashboard Design"</span>
            </AnimatedSpan>

            <AnimatedSpan delay={3500} className="text-green-500">
              <span>✔ Generated magic invite link</span>
            </AnimatedSpan>

            <AnimatedSpan delay={4000} className="text-blue-500">
              <span>ℹ Link shared with 10 users</span>
            </AnimatedSpan>

            <TypingAnimation delay={4500} className="text-muted-foreground">
              Feedback rolling in... 📬
            </TypingAnimation>

            <TypingAnimation delay={5000} className="text-muted-foreground">
              Time to act on insights 🚀
            </TypingAnimation>
          </Terminal>
        </div>
      </div>
    </section>
  );
}

