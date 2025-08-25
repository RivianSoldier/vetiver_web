"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, LogOut } from "lucide-react";
import SignOut from "@/app/private/signout";
import { cn } from "@/lib/utils";

type User = {
  email?: string;
};

export function AppSidebarFooter({ user }: { user: User }) {
  const { isMobile, state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="hover:bg-[#404040] cursor-pointer"
            asChild
          >
            <SidebarMenuButton className="mb-2 h-12 w-full justify-start rounded-md  data-[collapsed=true]:justify-center data-[collapsed=true]:px-0">
              <div
                className={cn(
                  "flex flex-shrink-0 items-center justify-center rounded-full bg-purple-900 font-poppins font-bold text-white transition-all duration-200",
                  state === "expanded" ? "h-8 w-8" : "h-6 w-6 ml-[-4px]"
                )}
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {state === "expanded" && (
                <>
                  <span className="truncate ml-3 font-nunito">
                    {user.email}
                  </span>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            className="w-[var(--radix-dropdown-menu-trigger-width)] border-none bg-[#404040] text-white"
          >
            <DropdownMenuItem className="cursor-pointer focus:bg-gray-500/50">
              <LogOut className="mr-2" />
              <SignOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
