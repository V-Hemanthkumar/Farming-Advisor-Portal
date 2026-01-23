import { Lightbulb, Sprout } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface FarmingTipsCardProps {
  tips: string[];
  category?: string;
}

export function FarmingTipsCard({ tips, category = 'General' }: FarmingTipsCardProps) {
  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/10 border-l-4 border-l-accent">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-semibold">{category} Farming Tips</h4>
          <p className="text-xs text-muted-foreground">Expert advice for better farming</p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-semibold text-accent">{index + 1}</span>
            </div>
            <p className="text-sm flex-1">{tip}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
