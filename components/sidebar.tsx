import { Button } from "@/components/ui/button"
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Clock, Plus } from "lucide-react"

export function Sidebar() {
  const history = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A modern dark theme portfolio",
      date: "2 hours ago",
    },
    {
      id: 2,
      title: "E-commerce Landing",
      description: "Product showcase with hero section",
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Restaurant Website",
      description: "Menu and booking system",
      date: "3 days ago",
    },
    {
      id: 4,
      title: "Blog Template",
      description: "Minimalist blog design",
      date: "1 week ago",
    },
  ]

  return (
    <SidebarContainer>
      <SidebarHeader className="border-b p-4">
        <div className="mb-2 px-2 text-xl font-semibold">GenWeb</div>
        <div className="mb-4 px-2 text-sm text-muted-foreground">AI-powered website generator</div>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Website
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 py-4 text-xs font-medium text-muted-foreground">HISTORY</div>
        <SidebarMenu>
          {history.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton className="flex flex-col items-start gap-1 p-3">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {item.date}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarContainer>
  )
}

