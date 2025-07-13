import DashboardDialog from "@/components/dashboard/DialogDashboard";
import { findWorkspace } from "../action/workspace/workspace";
import { getLastHourFeedback, getLastHourInvites } from "../action/dashboard_activity/activity";
import { getMonthlyEmailUseage, allowedEmailQuoteCheck } from "../action/email/emailActions";
import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
} from "lucide-react"

// Lazy-load the big components
const WorkspaceCard = dynamic(() => import('@/components/dashboard/WorkspaceCard'), { ssr: true });
const CategoryCard = dynamic(() => import('@/components/dashboard/CategoryCard'), { ssr: true });
const TopicCard = dynamic(() => import('@/components/dashboard/TopicCard'), { ssr: true });
const EmailCard = dynamic(() => import('@/components/dashboard/EmailCard'), { ssr: true });



export default async function DashboardPage() {
  const { success, data } = await findWorkspace();
  const feedbackData = await getLastHourFeedback()
  const inviteData = await getLastHourInvites()
  const currentUsage = await getMonthlyEmailUseage()
  const allowedUsage = await allowedEmailQuoteCheck()

  const emailUsage:number = currentUsage.usage || 0
  const emailQuota:number = allowedUsage.limit || 500
  const percentage:number = ((emailUsage)/(emailQuota))*100
  return (
    <main className="w-full h-screen relative">
      {/* Fixed Dashboard heading at top center */}
      <h1 className="fixed top-4 left-1/2 transform -translate-x-1/2 text-4xl z-10 bg-white px-4 py-2 rounded-lg shadow-sm">
        Dashboard
      </h1>

      {/* Top right corner positioning for Dialog/WorkspaceCard */}
      <aside className="fixed top-4 right-4 z-20">
        {!success && <DashboardDialog />}
      </aside>

      {/* Main content area with padding to account for fixed header */}
      <div className="pt-20 px-4 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {data && <WorkspaceCard createdAt={data.createdAt} id={data.id} name={data.name} />}
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
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
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
                <p className="text-xs text-gray-500">Resets every billing cycle</p>
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
                  <div className="text-3xl font-bold text-cyan-600">{inviteData.count || 0}</div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Recent Email:</span>
                    <p className="font-medium truncate">{inviteData.recent?.email !=null ? inviteData.recent?.email : "None"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Topic:</span>
                    <p className="font-medium">{inviteData.recent?.topic != null ? inviteData.recent.topic : "None"}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      <Users className="w-3 h-3 mr-1" />
                      {inviteData.recent?.sentAt != null ? inviteData.recent.sentAt.toLocaleDateString() :"None Sent"}
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
                  <div className="text-3xl font-bold text-pink-600">{feedbackData.count || 0}</div>
                  <p className="text-sm text-gray-600">Feedbacks Received</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Recent</span>
                  <span className="font-medium">{feedbackData.lastSent!=undefined ? feedbackData.lastSent.toLocaleDateString() :"none sent"}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{feedbackData.validAverage!=undefined ? feedbackData.validAverage: "not collected"}</span>
                  <span className="text-sm text-gray-600">avg rating</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  );
}
