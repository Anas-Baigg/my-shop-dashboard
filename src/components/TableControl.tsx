"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RotateCcw, X } from "lucide-react";

export function TableControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasDateFilter = searchParams.has("from") || searchParams.has("to");

  const handleReload = () => {
    router.refresh(); // re-fetch server component data
  };

  const handleClear = () => {
    router.push(pathname); // removes all query params
  };

  return (
    <div className="flex gap-1 items-center sm:gap-2 justify-end">
      <Button
        variant="outline"
        size="icon"
        onClick={handleReload}
        title="Reload"
        className="h-9 w-9"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reload</span>
      </Button>

      {hasDateFilter && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          className="h-9 w-9 sm:w-auto sm:px-3"
        >
          <X className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline text-sm">Clear</span>
        </Button>
      )}
    </div>
  );
}
