"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { MapPinned, BookAlert, ClipboardClock } from "lucide-react";

const iconMap = {
  map: MapPinned,
  info: BookAlert,
  history: ClipboardClock,
};

type NavItem = {
  title: string;
  url: string;
  icon: keyof typeof iconMap;
};

interface AppSidebarNavProps {
  items: NavItem[];
}

export function AppSidebarNav({ items }: AppSidebarNavProps) {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-4">
      <SidebarGroupLabel className="text-md font-nunito mb-2">
        Páginas
      </SidebarGroupLabel>
      <SidebarMenu className="gap-4">
        {items.map((item) => {
          const isActive = pathname === item.url;
          const IconComponent = iconMap[item.icon];

          return (
            <SidebarMenuItem
              className="h-12 flex items-center"
              key={item.title}
            >
              <SidebarMenuButton
                className={cn(
                  "h-12 w-full py-0 flex justify-start rounded-md data-[collapsed=true]:justify-start data-[collapsed=true]:mx-0",
                  !isActive && "hover:bg-[#404040]"
                )}
                asChild
                tooltip={item.title}
                isActive={isActive}
              >
                <Link href={item.url}>
                  <div className="flex-shrink-0">
                    <IconComponent
                      className={cn(
                        "transition-all duration-200",
                        isActive ? "text-[#45BF55]" : "",
                        state === "expanded" ? "size-8" : "size-6 mx-[-4px]"
                      )}
                    />
                  </div>
                  {state === "expanded" && (
                    <span
                      className={cn(
                        "font-nunito",
                        isActive &&
                          "bg-gradient-to-r from-[#45BF55] to-[#008D80] bg-clip-text text-transparent font-bold"
                      )}
                    >
                      {item.title}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
