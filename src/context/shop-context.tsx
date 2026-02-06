"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Shop = { id: string; name: string };

type ShopContextType = {
  shops: Shop[];
  loading: boolean;
};

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function loadingShops() {
      setloading(true);

      const { data, error } = await supabase
        .from("shops")
        .select("id,name")
        .eq("owner_id", userId);
      if (data) {
        setShops(data);
      }
      setloading(false);
    }
    loadingShops();
  }, [userId]);
  return (
    <ShopContext.Provider
      value={{
        shops,
        loading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return context;
}
