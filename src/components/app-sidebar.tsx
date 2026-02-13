"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  PersonStanding,
  ReceiptText,
  Box, // for Products
  Scissors, // for Cuts
  Store, // for Shops
  CreditCard, // for Till Balance
  Clock, // for Time Logs
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  {
    title: "Reports",
    url: "/dashboard",
    icon: ReceiptText,
  },
  {
    title: "Employee",
    url: "/employee",
    icon: PersonStanding,
  },
  {
    title: "Products",
    url: "/products",
    icon: Box,
  },
  {
    title: "Cuts",
    url: "/cuts",
    icon: Scissors,
  },
  {
    title: "Shops",
    url: "/shops",
    icon: Store,
  },
  {
    title: "Till Balance",
    url: "/tillBalance",
    icon: CreditCard,
  },
  {
    title: "Time Logs",
    url: "/timeLogs",
    icon: Clock,
  },
];

export function AppSidebar() {
  const searchParams = useSearchParams();
  const currentShopId = searchParams.get("shopId");

  if (!currentShopId) return null;

  const params = new URLSearchParams(searchParams.toString());
  params.set("shopId", currentShopId);
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`${item.url}?${params.toString()}`}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
