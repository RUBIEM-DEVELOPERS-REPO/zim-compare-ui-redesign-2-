"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface Props {
  className?: string;
}

export default function MLPredictionPanel({ className }: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          AI Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p>ML-based predictions will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}
