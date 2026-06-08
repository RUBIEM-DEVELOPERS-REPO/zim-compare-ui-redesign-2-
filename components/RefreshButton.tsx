"use client";

import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      onClick={handleRefresh}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}
