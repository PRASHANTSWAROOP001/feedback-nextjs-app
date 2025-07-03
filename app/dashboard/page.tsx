import DashboardDialog from "@/components/dashboard/DialogDashboard";
import { findWorkspace } from "../action/checkWorkspace";
import dynamic from "next/dynamic";

// Lazy-load the big components
const WorkspaceCard = dynamic(() => import('@/components/dashboard/WorkspaceCard'), { ssr: true });
const CategoryCard = dynamic(() => import('@/components/dashboard/CategoryCard'), { ssr: true });
const TopicCard = dynamic(() => import('@/components/dashboard/TopicCard'), { ssr: true });
const EmailCard = dynamic(() => import('@/components/dashboard/EmailCard'), { ssr: true });

export default async function DashboardPage() {
  const { success, data } = await findWorkspace();

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
      </div>
    </main>
  );
}
