
import { Button } from "@/components/ui/button";
import DashboardDialog from "@/components/dashboard/DialogDashboard";
export default async function(){
   

    return (
        <div>

            <h1 className="text-center text-4xl">Dashboard</h1>
            <aside className="w-full">
                <DashboardDialog></DashboardDialog>
            </aside>

        </div>
    )
}