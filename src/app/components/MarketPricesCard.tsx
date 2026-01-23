import { TrendingUp, TrendingDown, Minus, IndianRupee } from 'lucide-react';
import { MarketPrice } from '@/app/services/farmingServices';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

interface MarketPricesCardProps {
  prices: MarketPrice[];
}

export function MarketPricesCard({ prices }: MarketPricesCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-primary" />
          Current Market Prices
        </h4>
        <Badge variant="outline" className="text-xs">
          Live Updates
        </Badge>
      </div>

      <div className="space-y-2">
        {prices.map((item, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-lg">🌾</span>
              </div>
              <div>
                <p className="font-medium">{item.crop}</p>
                <p className="text-xs text-muted-foreground">{item.unit}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">₹{item.price}</p>
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(item.trend)}`}>
                  {getTrendIcon(item.trend)}
                  <span>{item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Prices updated as of {new Date().toLocaleDateString()} • Market varies by region
      </p>
    </Card>
  );
}
