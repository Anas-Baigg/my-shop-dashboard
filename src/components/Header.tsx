"use client";
import React from "react";
import { LogOut, Moon, Sun } from "lucide-react"; // Icons
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useShop } from "@/context/shop-context";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { setTheme } = useTheme();
  const { shops } = useShop();
  // 1. Get the ID from the URL instead of context state
  const currentShopId = searchParams.get("shopId");
  // 2. Find the selected shop object so we can show its name
  const selectedShop = shops.find((s) => s.id === currentShopId) || shops[0];

  const handleShopChange = (id: string) => {
    // 3. Create a new "URL Search Params" object based on current URL
    const params = new URLSearchParams(searchParams.toString());

    // 4. Update the shopId parameter
    params.set("shopId", id);

    // 5. Navigate to the new URL (keeps you on the same page, just changes the ID)
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-zinc-950/60 dark:border-zinc-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />

          <h1 className="text-xl font-bold tracking-tight text-primary">
            BARBER DASHBOARD
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-30 justify-center">
                {selectedShop?.name.toUpperCase() || "SELECT SHOP"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {shops.map((shop) => (
                <DropdownMenuItem
                  key={shop.id}
                  onClick={() => handleShopChange(shop.id)}
                >
                  {shop.name.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
