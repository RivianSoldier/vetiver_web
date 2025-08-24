"use client";

import * as React from "react";
import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

const company = {
  name: "Vetiver",
  plan: "Empresa",
};

export function AppSidebarHeader() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mt-2"
        >
          <Link
            className="relative size-12 data-[collapsed=true]:size-8"
            href="/private"
          >
            <div className="">
              <Image
                fill
                src="/sidebar_logo.png"
                alt="Logo"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {state === "expanded" && (
            <div className="ml-3 grid flex-1 text-left">
              <span className="truncate font-poppins text-lg font-semibold">
                {company.name}
              </span>
              <span className="truncate font-nunito text-sm">
                {company.plan}
              </span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
