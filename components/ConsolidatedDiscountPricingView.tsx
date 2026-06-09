"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConsolidatedDiscountPricingView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consolidated Discount Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Consolidated pricing view will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}
