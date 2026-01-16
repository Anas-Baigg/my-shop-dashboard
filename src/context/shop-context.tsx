"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Shop = { id: string; name: string };

type ShopContextType = {
  shops: Shop[];
  currentShopId: String | null;
  setCurrentShopId: (id: string) => void;
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
  const [currentShopId, setCurrentShopId] = useState<string | null>(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function loadingShops() {
      setloading(true);

      const { data, error } = await supabase
        .from("shops")
        .select("id,name")
        .eq("owner_id", userId);
      if (!error && data) {
        setShops(data);
        if (!currentShopId && data.length > 0) {
          setCurrentShopId(data[0].id);
        }
      }
      setloading(false);
    }
    loadingShops();
  }, [userId]);
  return (
    <ShopContext.Provider
      value={{
        shops,
        currentShopId,
        setCurrentShopId,
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
