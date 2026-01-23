import { Sprout, Droplets, Clock, TrendingUp, IndianRupee, Leaf } from 'lucide-react';
import { CropRecommendation } from '@/app/services/farmingServices';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';

interface CropRecommendationCardProps {
  recommendation: CropRecommendation;
}

export function CropRecommendationCard({ recommendation }: CropRecommendationCardProps) {
  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-primary">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold">{recommendation.cropName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">Suitability:</span>
              <span className={`font-semibold ${getSuitabilityColor(recommendation.suitability)}`}>
                {recommendation.suitability}%
              </span>
            </div>
          </div>
        </div>
        <Badge variant={recommendation.suitability >= 80 ? "default" : "secondary"} className="bg-accent">
          {recommendation.suitability >= 80 ? 'Highly Recommended' : 'Recommended'}
        </Badge>
      </div>

      <Progress value={recommendation.suitability} className="h-2 mb-4" />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Expected Yield</p>
            <p className="text-sm font-medium truncate">{recommendation.expectedYield}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Droplets className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Water Need</p>
            <p className="text-sm font-medium truncate">{recommendation.waterRequirement.split('(')[0]}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Growth Period</p>
            <p className="text-sm font-medium truncate">{recommendation.growthPeriod}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <IndianRupee className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Market Price</p>
            <p className="text-sm font-medium truncate">{recommendation.marketPrice}</p>
          </div>
        </div>
      </div>

      {recommendation.tips && recommendation.tips.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 mb-2">
            <Leaf className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Quick Tips:</span>
          </div>
          <ul className="space-y-1">
            {recommendation.tips.map((tip, index) => (
              <li key={index} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
