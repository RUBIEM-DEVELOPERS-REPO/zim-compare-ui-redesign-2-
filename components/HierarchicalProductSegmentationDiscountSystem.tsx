"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HierarchicalProductSegmentationDiscountSystem({ recommendations, onDiscountedRecommendations }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hierarchical Discount System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Discount system will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}
