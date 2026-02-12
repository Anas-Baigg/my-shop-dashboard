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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      const { data, error } = await supabase
        .from("shops")
        .select("id, name")
        .eq("owner_id", userId);

      if (!error && data) {
        setShops(data);
      }
      setLoading(false);
    }

    if (userId) fetchShops();
  }, [userId, supabase]);

  return (
    <ShopContext.Provider value={{ shops, loading }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}
