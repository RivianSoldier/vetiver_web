import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { MapPinned, ListChecks, ClipboardClock } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

import { AppSidebarNav } from "@/app/private/app-sidebar-nav";
import { AppSidebarFooter } from "@/app/private/app-sidebar-footer";
import { AppSidebarHeader } from "@/app/private/app-sidebar-header";

const items: {
  title: string;
  url: string;
  icon: "map" | "list" | "history";
}[] = [
  {
    title: "Mapa",
    url: "/private",
    icon: "map",
  },
  {
    title: "Lista",
    url: "/private/lista",
    icon: "list",
  },
  {
    title: "Histórico",
    url: "/private/historico",
    icon: "history",
  },
];

type AppSidebarProps = {
  variant: "sidebar" | "floating" | "inset";
};

export async function AppSidebar({ variant }: AppSidebarProps) {
  const headerList = headers();
  const pathname = (await headerList).get("x-current-path");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <Sidebar collapsible="icon" variant={variant}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <AppSidebarNav items={items} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <AppSidebarFooter user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
