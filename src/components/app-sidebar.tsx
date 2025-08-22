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
import { useCallback } from "react";
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
import { useRouter, usePathname } from "next/navigation";

// Menu items for patient.
const patientItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Appointments",
    url: "/appointment",
    icon: ClipboardClock,
  },
  {
    title: "Treatments",
    url: "/treatments",
    icon: Bandage,
  },
];

//Menu items for secretary. 
const secretaryItems = [
  {title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  }, 
  {title: "Appointments",
    url: "/appointment/secretary",
    icon: ClipboardClock,
  },  
  {title: "Patients",
    url: "/Patients",
    icon: Bandage,
  }, 
  {title: "Chatbot",
    url: "/Chatbot",
    icon: Settings,
  }


]

//menu items for super_admin and admin.
const adminItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  },
];



export function AppSidebar({ role }: { role: string }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const signOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const items = useCallback(() => {
    switch (role) {
      case 'patient':
        return patientItems;
      case 'admin':
      case 'super_admin':
        return adminItems;
      case 'secretary':
        return secretaryItems;
      default:
        return patientItems;
    }
  }, [role])();

  const getActiveItem = (itemUrl: string) => {
    if (pathname === itemUrl) return true;
    if (pathname.startsWith(itemUrl) && itemUrl !== '/dashboard') return true;
    if (pathname === '/dashboard' && itemUrl === '/dashboard') return true;
    return false;
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
                    isActive={getActiveItem(item.url)}
                    className="data-[active=true]:bg-royal-blue-100 data-[active=true]:hover:bg-royal-blue-100"
                  >
                    <a href={item.url}>
                      <item.icon
                        className={
                          getActiveItem(item.url) ? "text-royal-blue-600" : ""
                        }
                      />
                      <span
                        className={
                          getActiveItem(item.url)
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
