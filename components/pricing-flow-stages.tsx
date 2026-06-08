"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  currentStage?: string;
  competitiveCompleted?: boolean;
  economicCompleted?: boolean;
}

export function PricingFlowStages({ currentStage, competitiveCompleted, economicCompleted }: Props) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${competitiveCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
            <span className="text-white font-bold">1</span>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Competitive Analysis</p>
            <p className="text-xs text-muted-foreground">Current Stage</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
