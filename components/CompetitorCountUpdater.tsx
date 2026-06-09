"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CompetitorCountUpdater({ onCountUpdate }: any) {
  const [count, setCount] = useState(0);

  const handleUpdate = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (onCountUpdate) {
      onCountUpdate(newCount);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Count</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold">{count}</p>
          <Button onClick={handleUpdate} variant="outline">
            Update Count
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
