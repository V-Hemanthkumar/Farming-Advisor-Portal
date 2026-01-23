import { Sprout, Cloud, TrendingUp, Camera, Lightbulb, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { icon: Sprout, label: 'Crop Recommendations', action: 'crop_recommendation' },
    { icon: Cloud, label: 'Weather Forecast', action: 'weather' },
    { icon: TrendingUp, label: 'Market Prices', action: 'market_prices' },
    { icon: Camera, label: 'Analyze Crop Image', action: 'image_analysis' },
    { icon: Lightbulb, label: 'Farming Tips', action: 'farming_tips' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {actions.map((item, index) => {
        const Icon = item.icon;
        return (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-3 px-2 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all"
            onClick={() => onAction(item.action)}
          >
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-xs text-center leading-tight">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
