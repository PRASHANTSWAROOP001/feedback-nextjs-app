import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
import { ShimmerButton } from "../magicui/shimmer-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ParticlesBackground from "./ParticleBackground";
import Link from "next/link";

const freePlanFeatures = [
  "Up to 10 user categories",
  "100 user emails",
  "1000+ feedback submissions/month",
  "Basic analytics dashboard",
  "30-day feedback history",
  "Forever Free Tier"
];

const paidPlanFeatures = [
  "Starts From As Low As ₹149",
  "Up to 30 user categories",
  "10,000 feedback submissions/month",
  "Sentiment analysis (AI-powered)",
  "Summarized feedback insights",
  "Advanced analytics",
  "Custom branding (logo & colors)",
  "Team collaboration tools",
  "Export to CSV / Notion / Sheets",
  "24/7 email support",
];


const enterprisePlanFeatures = [
  "Unlimited user categories",
  "Real-time feedback updates & alerts",
  "Unlimited feedback submissions",
  "Graph-based insight visualization",
  "24/7 call & email support",
  "Bunch Of Other Things",
];



export default function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full relative py-12 md:py-20 overflow-hidden"
    >
      {/* ⬇️ Particle Background */}

      <ParticlesBackground></ParticlesBackground>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for your team. Upgrade or downgrade
              at any time.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {/* Starter Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>
                Perfect for small teams getting started
              </CardDescription>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">₹0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {freePlanFeatures.map((val,index)=>(
                  <FeatureItem text={val} key={index}></FeatureItem>
                ))}
              </ul>
              <Link href={"/signup"}><ShimmerButton className="w-full"> Signup </ShimmerButton></Link>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="border-primary shadow-lg">
            <CardHeader>
              <Badge className="w-fit"> ✨ Live Now</Badge>
              <CardTitle>Professional</CardTitle>
              <CardDescription>
                For growing teams that need more power
              </CardDescription>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">₹149</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {paidPlanFeatures.map((val,index)=>(
                  <FeatureItem text={val} key={index}></FeatureItem>
                ))}
              </ul>
              <Link href={"/payment"}>
              <InteractiveHoverButton className="w-full">
                Checkout Prices
              </InteractiveHoverButton></Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Future Plans</CardTitle>
              <CardDescription>For large teams with custom needs</CardDescription>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {enterprisePlanFeatures.map((val, index)=>(
                  <FeatureItem text = {val} key={index}></FeatureItem>
                ))}
              </ul>
              <InteractiveHoverButton className="w-full">
                Spam The Waitlist
              </InteractiveHoverButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ✅ Extracted Feature list item
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center space-x-2">
      <Check className="h-4 w-4 text-green-500" />
      <span>{text}</span>
    </li>
  );
}
