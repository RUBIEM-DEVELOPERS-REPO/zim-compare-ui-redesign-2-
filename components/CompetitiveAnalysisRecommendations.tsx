"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  onRecommendationsGenerated?: (recommendations: any[]) => void;
}

export default function CompetitiveAnalysisRecommendations({ onRecommendationsGenerated }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Price recommendations will appear here based on market analysis</p>
        </div>
      </CardContent>
    </Card>
  );
}
