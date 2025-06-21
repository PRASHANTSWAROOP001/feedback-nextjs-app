import DashboardDialog from "@/components/dashboard/DialogDashboard";
import {findWorkspace} from "../action/checkWorkspace"
import WorkspaceCard from "@/components/dashboard/WorkspaceCard";
import CategoryCard from "@/components/dashboard/CategoryCard";
import TopicCard from "@/components/dashboard/TopicCard";

export default async function(){
    const {success, message, data} = await findWorkspace()

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
                {/* Your main dashboard content will go here */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">

                    {data && (<WorkspaceCard createdAt={data?.createdAt} id={data?.id} name={data?.name}></WorkspaceCard>)}
                       <CategoryCard />
                       <TopicCard/>
                </div>
            </div>
        </main>
    )
}