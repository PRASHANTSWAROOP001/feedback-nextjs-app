import Navbar from "@/components/shared/navbar";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { Badge } from "@/components/ui/badge";
import { Check,} from "lucide-react";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import dynamic from "next/dynamic";
import MainSkeleton from "@/components/shared/MainSkeleton";

const ReviewSection = dynamic(()=>import("@/components/landingPage/Review"),{
  ssr:true,
  loading:()=><MainSkeleton></MainSkeleton>
} )

const HowItWorksSection = dynamic(()=>import("@/components/landingPage/HowItWorks"), {
  ssr:true,
  loading:()=><MainSkeleton></MainSkeleton>
})


const Pricing = dynamic(()=>import("@/components/landingPage/Pricing"), {
  ssr:true,
  loading:()=><MainSkeleton></MainSkeleton>
})

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <section id="home" className="w-full py-12 md:py-24 lg:py-28 h-screen">
        <AnimatedGridPattern
          numSquares={50}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
        />
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-4 lg:text-lg">
                📬 Collect Feedback Seamlessly
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                One Link. Honest Feedback.
                <br />
                <span className="text-primary">No Noise, Just Insights.</span>
              </h1>
              <p className="mx-auto max-w-[700px] py-2 text-muted-foreground md:text-xl">
                Simplify how you collect and manage feedback — send a magic
                link, and let your customers, users, or team respond with ease.
                Perfect for teams, creators, and businesses who value real
                input.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <ShimmerButton>Start Collecting Feedback</ShimmerButton>
              <InteractiveHoverButton>See It In Action</InteractiveHoverButton>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500" />
              <span>Free 14-day trial</span>
              <Check className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>
      <HowItWorksSection></HowItWorksSection>
      <ReviewSection></ReviewSection>
      <Pricing></Pricing>
    </div>
  );
}
