import { Badge } from "../ui/badge";
import { ShimmerButton } from "../magicui/shimmer-button";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
import { Meteors } from "../magicui/meteors";

export default function WhyPage() {
  return (
    <section
      id="about"
      className="relative w-full py-20 overflow-hidden bg-background"
    >
      {/* 🔥 Meteor Shower Background */}
      <div className="absolute inset-0 z-0">
        <Meteors number={25} />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge className="text-sm px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
            ✨ Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Why I Built This 🚀
          </h1>
            <p className="max-w-2xl  md:text-lg">
            Feedback tools shouldn't feel like tax forms. 
            I built this because Google Forms were too boring, and feedback felt like a chore — name, email, too many fields, and zero soul.
            So I made a system that cuts the friction: magic link → write → done. 
            Human, fast, and built for real teams where voices matter.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <ShimmerButton>Try it Out → Rate Us</ShimmerButton>
            <InteractiveHoverButton>Read the Full Story</InteractiveHoverButton>
          </div>
        </div>
      </div>
    </section>
  );
}
