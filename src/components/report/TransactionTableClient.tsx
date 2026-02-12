"use client";

import { useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransactionDetailSheet } from "./TransactionDetailSheet";
import { formatEUR } from "@/lib/utils";
import { Transaction } from "@/types/reports";

export function TransactionTableClient({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTx(transaction);
    setIsSheetOpen(true);
  };

  return (
    <>
      <TableBody>
        {!transactions || transactions.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-10 text-muted-foreground"
            >
              No transactions found for this period.
            </TableCell>
          </TableRow>
        ) : (
          transactions?.map((t) => (
            <TableRow
              key={t.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleRowClick(t)}
            >
              <TableCell>
                <div className="font-medium">
                  {new Date(t.created_at).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </TableCell>
              <TableCell>{t.employee?.name || "N/A"}</TableCell>
              <TableCell>
                <Badge
                  variant={t.payment_method === "Cash" ? "default" : "outline"}
                >
                  {t.payment_method}
                </Badge>
              </TableCell>
              <TableCell>{t.tip > 0 ? `${formatEUR(t.tip)}` : "-"}</TableCell>
              <TableCell className="text-right font-bold">
                {formatEUR(t.final_total)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

      {/* The Slide-out Detail Panel */}
      <TransactionDetailSheet
        transaction={selectedTx}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  );
}
