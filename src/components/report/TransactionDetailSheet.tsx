"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { formatEUR } from "@/lib/utils";
import { Transaction, TransactionItem } from "@/types/reports";

interface Props {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}
export function TransactionDetailSheet({
  transaction,
  isOpen,
  onClose,
}: Props) {
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Fetch items only when the sheet opens
  const fetchItems = async () => {
    if (!transaction) return;
    setLoading(true);
    const { data } = await supabase
      .from("transaction_items")
      .select("*")
      .eq("transaction_id", transaction.id);

    setItems((data as TransactionItem[]) || []);
    setLoading(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent onOpenAutoFocus={fetchItems} className="w-100 sm:w-135">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <div className="text-sm text-muted-foreground">
            ID: {transaction?.id.slice(0, 8)}...
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 p-2">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span className="font-medium">
                {transaction?.created_at &&
                  new Date(transaction.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Employee:</span>
              <span className="font-medium">{transaction?.employee?.name}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-3">Items & Services</h4>
            {loading ? (
              <p className="text-sm text-center py-4">Loading items...</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.item_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span>{formatEUR(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatEUR(transaction?.base_total || 0)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount:</span>
              <span>-{formatEUR(transaction?.discount || 0)}</span>
            </div>
            <div className="flex justify-between text-sm text-blue-600">
              <span>Tip:</span>
              <span>+{formatEUR(transaction?.tip || 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatEUR(transaction?.final_total || 0)}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
