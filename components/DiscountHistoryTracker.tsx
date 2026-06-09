"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiscountHistoryTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Discount history will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}
