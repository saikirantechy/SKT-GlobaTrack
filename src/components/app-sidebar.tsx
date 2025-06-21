"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  QrCode,
  Languages,
  MessageSquareHeart,
} from "lucide-react";
import { SktLogoIcon } from "./skt-logo-icon";

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/translate",
      label: "Translator",
      icon: Languages,
    },
    {
      href: "/event-pass",
      label: "Event Pass",
      icon: QrCode,
    },
    {
      href: "/engagement",
      label: "Engagement",
      icon: MessageSquareHeart,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SktLogoIcon className="size-8" />
          <h1 className="text-xl font-headline font-semibold">SKT GlobaTrack</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className="font-body">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
