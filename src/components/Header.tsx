"use client";

import React, { useEffect } from "react";
import { LogOut, Moon, Sun, ChevronDown } from "lucide-react";
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

  const { shops, currentShopId, setCurrentShopId } = useShop();

  useEffect(() => {
    // 1. Check URL first
    const urlId = searchParams.get("shopId");

    // 2. Check Cookie if URL is empty
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("last_shop_id="))
      ?.split("=")[1];

    const activeId = urlId || cookieValue;

    //found an ID in memory/URL, tell the context to use it
    if (activeId && activeId !== currentShopId) {
      setCurrentShopId(activeId);
    }
  }, [searchParams, currentShopId, setCurrentShopId]);

  // Find the selected shop object to show the correct name in the button
  // If no ID is found yet, it defaults to the first shop in the list
  const selectedShop = shops.find((s) => s.id === currentShopId) || shops[0];

  const handleShopChange = (id: string) => {
    // 1. Update the "Memory" (Cookie)
    document.cookie = `last_shop_id=${id}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Update the Context State
    setCurrentShopId(id);

    // 3. Update the URL so the current page refreshes with the new data
    const params = new URLSearchParams(searchParams.toString());
    params.set("shopId", id);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:bg-zinc-950/60 dark:border-zinc-800">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1 className="text-xl font-bold tracking-tight text-primary hidden sm:block">
            BARBER DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* SHOP SELECTOR DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-35 justify-between">
                {selectedShop?.name.toUpperCase() || "SELECT SHOP"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              {shops.map((shop) => (
                <DropdownMenuItem
                  key={shop.id}
                  onClick={() => handleShopChange(shop.id)}
                  className={
                    currentShopId === shop.id ? "bg-accent font-bold" : ""
                  }
                >
                  {shop.name.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* THEME TOGGLE */}
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
