"use client"
import {Home, Inbox,Signpost,Handshake, NotebookText, Settings, ScrollText} from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useUser } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup , DropdownMenuContent} from "../ui/dropdown-menu"
import { useClerk } from "@clerk/nextjs"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title:"Topic",
    url:"/dashboard/topic",
    icon:ScrollText
  },

  {
    title: "Email",
    url: "/dashboard/email",
    icon: Inbox,
  },
  {
    title: "Category",
    url: "/dashboard/category",
    icon: Signpost,
  },
  {
    title: "Invite",
    url: "/dashboard/invitation",
    icon: Handshake,
  },
  {
    title: "Feedback",
    url: "/dashboard/feedback",
    icon: NotebookText,
  },
  {
    title:"Dashboard",
    url:"/dashboard",
    icon:Settings
  }
]

export function AppSidebar() {
    const {user } = useUser();
    const {signOut} = useClerk()
    const email = user?.primaryEmailAddress?.emailAddress;
    const rootmail = email?.split("@")[0]

    function handleSignout (){
       signOut()
       toast("Successully logged out", {
        description:"Login Again :)"
       })
    }



    return (
    <Sidebar>

         <SidebarHeader>Dashboard</SidebarHeader>
      <SidebarContent>
       
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center">
       <DropdownMenu >
        <DropdownMenuTrigger asChild>
             <div className="relative w-[80%]">
      <Avatar className="w-full text-sky-500 h-10 border-2  ">
        <AvatarFallback>{rootmail}</AvatarFallback>
      </Avatar>

      {/* Ping Animation */}
      <span className="absolute -top-0 -right-0 flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
      </span>
    </div>

        </DropdownMenuTrigger>
       <DropdownMenuContent className="w-56" align="center">
         <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
            <DropdownMenuItem>
                User Info 👤
            </DropdownMenuItem>
            <DropdownMenuItem>
                Profile 🤖
            </DropdownMenuItem>
            <DropdownMenuItem>
                Billing 💸
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuLabel>User Action</DropdownMenuLabel>
            <DropdownMenuItem onClick={()=>handleSignout()}>
                Logout 🚪
            </DropdownMenuItem>
       </DropdownMenuContent>
       </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}