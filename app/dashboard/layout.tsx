import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar></AppSidebar>
      <main className="w-full h-screen">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}