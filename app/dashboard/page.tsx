import DashboardDialog from "@/components/dashboard/DialogDashboard";
import { findWorkspace } from "../action/workspace/workspace";
import {
  getLastHourFeedback,
  getLastHourInvites,
} from "../action/dashboard_activity/activity";
import {
  getMonthlyEmailUseage,
  allowedEmailQuoteCheck,
} from "../action/email/emailActions";
import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Calendar,
  CheckCircle,
  CreditCard,
  Mail,
  MessageSquare,
  Package,
  Send,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import {
  checkSubscription,
  lastPaymentDetails,
} from "../action/subscription/subscription";

// Lazy-load the big components
const WorkspaceCard = dynamic(
  () => import("@/components/dashboard/WorkspaceCard"),
  { ssr: true }
);
const CategoryCard = dynamic(
  () => import("@/components/dashboard/CategoryCard"),
  { ssr: true }
);
const TopicCard = dynamic(() => import("@/components/dashboard/TopicCard"), {
  ssr: true,
});
const EmailCard = dynamic(() => import("@/components/dashboard/EmailCard"), {
  ssr: true,
});

type SubscriptionData = {
  pricing: {
    name: string;
    emailUsageLimit: number;
    price: number;
    validity: number;
    savings: string | null;
  };
  startDate: Date;
  expiryDate: Date;
  pricingId: string;
};

type Benefits = {
  text: string;
};

export default async function DashboardPage() {
  const { success, data } = await findWorkspace();
  const feedbackData = await getLastHourFeedback();
  const inviteData = await getLastHourInvites();
  const currentUsage = await getMonthlyEmailUseage();
  const allowedUsage = await allowedEmailQuoteCheck();

  const emailUsage: number = currentUsage.usage || 0;
  const emailQuota: number = allowedUsage.limit || 500;
  const percentage: number = (emailUsage / emailQuota) * 100;

  const lastPayment = await lastPaymentDetails();

  const orderSuccess = lastPayment.order_success;
  const orderAttempt = lastPayment.order_attempt;

  const lastOrder = orderSuccess ?? orderAttempt;

  const checkSubcriptionValues = await checkSubscription();
  const subsData: SubscriptionData | undefined =
    checkSubcriptionValues.subscriptionData;
  const benefitsData: Benefits[] | undefined = checkSubcriptionValues.benefits;

  function ReturnDays(): number {
    if (subsData != undefined) {
      const today = new Date();

      const fromDate = today > subsData.startDate ? today : subsData.startDate;

      const diff = subsData.expiryDate.getTime() - fromDate.getTime();

      const val = Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);

      return val;
    } else {
      return 0;
    }
  }

  return (
    <main className="w-full min-h-screen relative">
      {/* Fixed Dashboard heading at top center */}

      <div className="mx-auto">
        <h1 className="text-4xl text-center">Dashboard</h1>
      </div>

      {/* Top right corner positioning for Dialog/WorkspaceCard */}
      <aside className="fixed top-4 right-4 z-20">
        {!success && <DashboardDialog />}
      </aside>

      {/* Main content area with padding to account for fixed header */}
      <div className="pt-12 px-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {data && (
            <WorkspaceCard
              createdAt={data.createdAt}
              id={data.id}
              name={data.name}
            />
          )}
          <CategoryCard />
          <TopicCard />
          {data && <EmailCard workspaceId={data.id} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-16">
          {/* EmailUsageCard */}

          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email Usage
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {percentage.toPrecision(2)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">This month</span>
                    <span className="font-medium">
                      {emailUsage} / {emailQuota}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
                <p className="text-xs text-gray-500">
                  Resets every billing cycle
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Invitations Sent */}
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-600" />
                Invitations Sent
              </CardTitle>
              <CardDescription>Last 1 hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">
                    {inviteData.count || 0}
                  </div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Recent Email:</span>
                    <p className="font-medium truncate">
                      {inviteData.recent?.email != null
                        ? inviteData.recent?.email
                        : "None"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Topic:</span>
                    <p className="font-medium">
                      {inviteData.recent?.topic != null
                        ? inviteData.recent.topic
                        : "None"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      <Users className="w-3 h-3 mr-1" />
                      {inviteData.recent?.sentAt != null
                        ? inviteData.recent.sentAt.toLocaleDateString()
                        : "None Sent"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Feedback */}
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-pink-600" />
                Live Feedback
              </CardTitle>
              <CardDescription>Last 1 hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">
                    {feedbackData.count || 0}
                  </div>
                  <p className="text-sm text-gray-600">Feedbacks Received</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recent</span>
                  <span className="font-medium">
                    {feedbackData.lastSent != undefined
                      ? feedbackData.lastSent.toLocaleDateString()
                      : "none sent"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    {feedbackData.validAverage != undefined
                      ? feedbackData.validAverage
                      : "not collected"}
                  </span>
                  <span className="text-sm text-gray-600">avg rating</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Payment Details */}
          {lastOrder && (
            <Card className="...">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Last Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order ID</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      #{lastOrder.id}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date</span>
                    <span className="text-sm font-medium">
                      {new Date(lastOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{(lastOrder.amount / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {lastOrder.status.charAt(0).toUpperCase() +
                        lastOrder.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Subscription */}
          {subsData && (
            <>
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Active Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-purple-700">
                        {subsData.pricing.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Start:</span>
                          <p className="font-medium">
                            {new Date(subsData.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Expiry:</span>
                          <p className="font-medium">
                            {new Date(subsData.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        <span className="font-bold text-orange-600">
                          {ReturnDays()} days
                        </span>{" "}
                        left
                      </span>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Benefits
                      </h4>
                      <ul className="space-y-1">
                        {benefitsData &&
                          benefitsData.map((value, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {value.text}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Summary */}
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Your Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-indigo-700">
                        {subsData?.pricing.name}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹
                        {subsData?.pricing.price != undefined
                          ? subsData.pricing.price / 100
                          : 0}
                        <span className="text-sm font-normal text-gray-600">
                          /{subsData?.pricing.validity}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email Limit</span>
                        <span className="font-medium">
                          {subsData?.pricing.emailUsageLimit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Validity</span>
                        <span className="font-medium">
                          {subsData?.pricing.validity} days
                        </span>
                      </div>
                    </div>
                    {subsData?.pricing.savings && (
                      <Badge
                        variant="outline"
                        className="w-full justify-center bg-green-50 text-green-700 border-green-200"
                      >
                        {subsData.pricing.savings}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
