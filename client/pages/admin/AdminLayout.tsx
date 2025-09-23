import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInput,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Users, FileText, MessagesSquare, Shield, LineChart, Settings, LifeBuoy, Wallet, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";

export type AdminSection =
  | "dashboard"
  | "users"
  | "content"
  | "communication"
  | "finance"
  | "security"
  | "reports"
  | "settings"
  | "support";

export function useThemeToggle() {
  const [theme, setTheme] = React.useState<string>(() => localStorage.getItem("alumnihub_theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light"));
  React.useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("alumnihub_theme", theme);
  }, [theme]);
  const toggle = React.useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, toggle };
}

export default function AdminLayout({
  section,
  onSectionChange,
  search,
  setSearch,
  children,
}: {
  section: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  search: string;
  setSearch: (s: string) => void;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useThemeToggle();

  return (
    <SidebarProvider>
      <Sidebar className="bg-[rgb(18,24,38)] text-white">
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-semibold">Admin Panel</div>
          <SidebarInput placeholder="Search" value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {[
                { id: "dashboard", label: "Dashboard", icon: LineChart },
                { id: "users", label: "Users", icon: Users },
                { id: "content", label: "Content", icon: FileText },
                { id: "communication", label: "Communication", icon: MessagesSquare },
                { id: "finance", label: "Finance", icon: Wallet },
                { id: "security", label: "Security", icon: Shield },
                { id: "reports", label: "Reports", icon: LineChart },
                { id: "settings", label: "Settings", icon: Settings },
                { id: "support", label: "Support", icon: LifeBuoy },
              ].map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={section === (item.id as AdminSection)} onClick={() => onSectionChange(item.id as AdminSection)}>
                    <item.icon className="opacity-90" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-14 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8">
                <Bell className="mr-2 h-4 w-4" />
                {user?.name || "Admin"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSectionChange("settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={cn("p-4", section === "dashboard" ? "" : "")}>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
