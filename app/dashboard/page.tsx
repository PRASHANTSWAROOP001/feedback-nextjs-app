
import { Button } from "@/components/ui/button";
import DashboardDialog from "@/components/dashboard/DialogDashboard";
import {findWorkspace} from "../action/checkWorkspace"
import WorkspaceCard from "@/components/dashboard/WorkspaceCard";
export default async function(){

    const {success, message, data} = await findWorkspace()

    return (
        <div>

            <h1 className="text-center text-4xl">Dashboard</h1>
            <aside className="w-full">
                {! success && <DashboardDialog></DashboardDialog>}
               {success && data?.id && data?.name && data?.createdAt && (
  <WorkspaceCard
    id={data.id}
    name={data.name}
    createdAt={data.createdAt}
  />
)}

            </aside>

        </div>
    )
}