"use client";

import React, { useEffect } from "react";
import { LogOut, Moon, Sun, ChevronDown, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useShop } from "@/context/shop-context";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const supabase = createClient();

  const { shops } = useShop();
  const currentShopId = searchParams.get("shopId");
  useEffect(() => {
    if (!shops || shops.length === 0) return;

    //Check the Cookie if URL is empty
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("last_shop_id="))
      ?.split("=")[1];

    //Priority: URL > Cookie > First Shop in list
    const activeId = currentShopId || cookieValue || shops[0]?.id;

    //If the URL is missing the ID, or is different, update it
    if (currentShopId !== activeId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("shopId", activeId);

      // Update cookie so the choice is remembered
      document.cookie = `last_shop_id=${activeId}; path=/; max-age=31536000; SameSite=Lax`;

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [shops, currentShopId, searchParams, pathname, router]);

  // Find the selected shop object to show the correct name in the button
  // If no ID is found yet, it defaults to the first shop in the list
  const selectedShop = shops.find((s) => s.id === currentShopId) || shops[0];

  const handleShopChange = (id: string) => {
    // 1. Update the "Memory" (Cookie)
    document.cookie = `last_shop_id=${id}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Update the Context State
    const params = new URLSearchParams(searchParams.toString());
    params.set("shopId", id);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }

    //Clear local storage
    document.cookie =
      "last_shop_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    //Refresh the current route to update Server Components
    // and redirect to login
    router.refresh();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
          <h1 className="text-sm md:text-lg font-bold tracking-tight text-primary truncate max-w-30 sm:max-w-none">
            BARBER <span className="hidden sm:inline">DASHBOARD</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2 md:px-4 flex gap-2 max-w-35 md:max-w-50"
              >
                <span className="truncate">
                  {selectedShop?.name.toUpperCase() || "SELECT SHOP"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Shop</DropdownMenuLabel>
              <DropdownMenuSeparator />
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full border"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="flex items-center justify-between px-2 py-1.5 text-sm font-medium">
                <span>Appearance</span>
                <div className="flex border rounded-md p-0.5 scale-90">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
