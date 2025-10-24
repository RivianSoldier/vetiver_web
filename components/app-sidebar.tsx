import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

import { AppSidebarNav } from "@/app/private/app-sidebar-nav";
import { AppSidebarFooter } from "@/app/private/app-sidebar-footer";
import { AppSidebarHeader } from "@/app/private/app-sidebar-header";

const items: {
  title: string;
  url: string;
  icon: "map" | "info" | "history";
}[] = [
  {
    title: "Mapa",
    url: "/private",
    icon: "map",
  },
  {
    title: "Histórico",
    url: "/private/historico",
    icon: "history",
  },
  // {
  //   title: "Guia de uso",
  //   url: "/private/guia",
  //   icon: "info",
  // },
];

type AppSidebarProps = {
  variant: "sidebar" | "floating" | "inset";
};

export async function AppSidebar({ variant }: AppSidebarProps) {
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
        <AppSidebarNav items={items} />
      </SidebarContent>

      <SidebarFooter>
        <AppSidebarFooter user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
