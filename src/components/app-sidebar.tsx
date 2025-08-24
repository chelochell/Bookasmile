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
  Building2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useCallback, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { cn } from "@/lib/utils";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MenuSubItem {
  title: string;
  url: string;
  icon?: React.ComponentType<any>;
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  subItems?: MenuSubItem[];
}

// Menu items for patient.
const patientItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Appointments",
    url: "/appointment",
    icon: ClipboardClock,
    subItems: [
      { title: "Book Appointment", url: "/appointment/new" },
      { title: "Upcoming", url: "/appointment/upcoming" },
      { title: "History", url: "/appointment/history" }
    ]
  },
  {
    title: "Treatments",
    url: "/treatments",
    icon: Bandage,
    subItems: [
      { title: "Current", url: "/treatments/current" },
      { title: "Completed", url: "/treatments/completed" }
    ]
  },
];

//Menu items for secretary. 
const secretaryItems: MenuItem[] = [
  {title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  }, 
  {title: "Appointments",
    url: "/appointment/secretary",
    icon: ClipboardClock,
    subItems: [
      { title: "Manage Appointments", url: "/appointment/secretary/manage" },
      { title: "Schedule", url: "/appointment/secretary/schedule" }
    ]
  },  
  {title: "Patients",
    url: "/Patients",
    icon: User,
    subItems: [
      { title: "All Patients", url: "/patients/all" },
      { title: "New Patient", url: "/patients/new" }
    ]
  }, 
  {title: "Chatbot",
    url: "/Chatbot",
    icon: Settings,
  }
]

//Menu items for dentist.
const dentistItems: MenuItem[] = [
  {title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Appointments",
    url: "/appointment",
    icon: ClipboardClock,
    subItems: [
      { title: "Today's Schedule", url: "/appointment/today" },
      { title: "Upcoming", url: "/appointment/upcoming" }
    ]
  },
];

//menu items for super_admin and admin.
const adminItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Clinic Branches",
    url: "/admin/clinic-branches",
    icon: Building2,
    subItems: [
      { title: "All Branches", url: "/admin/clinic-branches/all" },
      { title: "Add Branch", url: "/admin/clinic-branches/new" }
    ]
  },
];



interface AppSidebarProps {
  role: string;
  user: any;
}

export function AppSidebar({ role, user }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
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
      case 'dentist':
        return dentistItems;
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

  const isSubItemActive = (subItems: MenuSubItem[] | undefined) => {
    return subItems?.some(subItem => getActiveItem(subItem.url)) || false;
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isExpanded = (title: string) => expandedItems.includes(title);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'patient': return 'Patient';
      case 'dentist': return 'Dentist';
      case 'secretary': return 'Secretary';
      case 'admin': return 'Admin';
      case 'super_admin': return 'Super Admin';
      default: return 'User';
    }
  };

  return (
    <Sidebar
      className="bg-gray-100 py-8 px-3 h-full !border-r-0 !border-l-0 [&>*]:!border-r-0 [&>*]:!border-l-0 group-data-[side=left]:!border-r-0 group-data-[side=right]:!border-l-0"
      style={
        {
          "--sidebar-width": "320px",
          "--sidebar-width-mobile": "320px",
        } as React.CSSProperties
      }
    >
      <SidebarContent className="bg-gray-100">
        {/* Header with User Profile */}
        <div className="p-6 bg-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image ?? "/avatar-placeholder.png"} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 font-poppins">
                {user.name || 'User'}
              </h2>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="px-4 pb-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const isActive = getActiveItem(item.url) || isSubItemActive(item.subItems);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const expanded = isExpanded(item.title);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <div className="space-y-1">
                      <SidebarMenuButton
                        asChild={!hasSubItems}
                        isActive={isActive}
                        className={cn(
                          "w-full justify-start h-12 px-3 rounded-lg transition-all duration-200",
                          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                          "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                          "data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground"
                        )}
                        onClick={hasSubItems ? () => toggleExpanded(item.title) : undefined}
                      >
                        {hasSubItems ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.title}</span>
                            </div>
                            {expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        ) : (
                          <a href={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.title}</span>
                          </a>
                        )}
                      </SidebarMenuButton>
                      
                      {/* Sub Items */}
                      {hasSubItems && expanded && (
                        <div className="ml-8 space-y-1">
                          {item.subItems!.map((subItem) => (
                            <SidebarMenuButton
                              key={subItem.title}
                              asChild
                              isActive={getActiveItem(subItem.url)}
                              className={cn(
                                "h-10 px-3 rounded-lg text-sm transition-all duration-200",
                                "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                                "hover:bg-gray-100 text-gray-600 hover:text-gray-800",
                                "data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground"
                              )}
                            >
                              <a href={subItem.url} className="flex items-center gap-2 w-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 bg-gray-100">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start h-12 px-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Sign out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
