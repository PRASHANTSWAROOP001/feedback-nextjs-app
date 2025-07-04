import { Mail} from "lucide-react";
import { getAllCategory } from "@/app/action/getAllCategory";
import getAllTopics from "@/app/action/getAllTopic";
import { Topic } from "@/app/generated/prisma";
import { TopicResponse } from "@/types/types";
import { Category } from "@/app/generated/prisma";
import { CategoryResponse } from "@/types/types";
import dynamic from "next/dynamic";
import { SkeletonCard } from "@/components/shared/SkeltonCard";
import InviteTable from "@/components/invitation/InviteTable";

const EmailTable = dynamic(()=>import("@/components/invitation/EmailTable"), {
  ssr:true,
  loading:()=> <SkeletonCard></SkeletonCard>
})


export default async function InvitationPage() {
    const topicData:TopicResponse = await getAllTopics();
    const topicArray:Topic[]|undefined= topicData.data
    const categoryData:CategoryResponse = await getAllCategory()
    const categoryArray:Category[]|undefined = categoryData.data

  return (
    <main className="w-full min-h-screen bg-gray-50/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Mail className="h-8 w-8 text-blue-600" />
            Email Invitations
          </h1>
          <p className="text-gray-600 text-lg">
            Select recipients and send invitations to join your platform
          </p>
        </div>
      </div>

      <div className="mt-2">

        <EmailTable topicArray={topicArray && topicArray.length > 0 ? topicArray: []} 
         categoryArray={categoryArray && categoryArray.length > 0 ? categoryArray: []}></EmailTable>

      </div>

      <div className="py-8">
        <InviteTable topicArray={topicArray && topicArray.length > 0 ? topicArray: []}></InviteTable>
      </div>

    </main>
  );
}
