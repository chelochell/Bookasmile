"use client";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  LayoutDashboard,
  ClipboardClock,
  Bandage,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: MdDashboard,
  },
  {
    title: "Appointments",
    url: "#",
    icon: ClipboardClock,
  },
  {
    title: "Treatments",
    url: "#",
    icon: Bandage,
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const router = useRouter();
  const signOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <Sidebar
      className="w-56"
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "16rem",
        } as React.CSSProperties
      }
    >
      <SidebarContent>
        <SidebarGroup className="py-4 pl-4">
          <SidebarGroupLabel className="text-xl font-bold text-black mb-4 font-poppins">
            BookaSmile
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === item.title}
                    className="data-[active=true]:bg-royal-blue-100 data-[active=true]:hover:bg-royal-blue-100"
                  >
                    <a
                      href={item.url}
                      onClick={() => setActiveItem(item.title)}
                    >
                      <item.icon
                        className={
                          activeItem === item.title ? "text-royal-blue-600" : ""
                        }
                      />
                      <span
                        className={
                          activeItem === item.title
                            ? "text-royal-blue-600"
                            : "text-slate-600"
                        }
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-gray-100">
              <a href="#" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-900">
                    Dr. Smith
                  </span>
                  <span className="text-xs text-gray-500">
                    dentist@clinic.com
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm text-gray-600">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
