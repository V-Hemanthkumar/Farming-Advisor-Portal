import { ImageAnalysisResult } from '@/app/services/farmingServices';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { AlertCircle, CheckCircle, AlertTriangle, Leaf, Bug, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

interface ImageAnalysisCardProps {
  result: ImageAnalysisResult;
  imageUrl: string;
}

export function ImageAnalysisCard({ result, imageUrl }: ImageAnalysisCardProps) {
  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={imageUrl} 
              alt="Analyzed crop" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  {result.cropType}
                </h4>
                <p className="text-sm text-muted-foreground">Crop Identification</p>
              </div>
              <Badge className={getHealthColor(result.healthStatus)}>
                {result.healthStatus.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <span className="text-sm font-semibold">{result.healthScore}%</span>
                </div>
                <Progress value={result.healthScore} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {result.diseases.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold flex items-center gap-2 mb-3">
            <Bug className="w-4 h-4 text-destructive" />
            Detected Issues
          </h4>
          <div className="space-y-3">
            {result.diseases.map((disease, index) => (
              <Alert key={index} className="border-l-4 border-l-destructive">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{disease.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Confidence: {disease.confidence}%
                        </p>
                      </div>
                      <Badge className={getSeverityBadge(disease.severity)}>
                        {disease.severity} severity
                      </Badge>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <p className="text-sm font-medium mb-1">Treatment:</p>
                      <p className="text-sm">{disease.treatment}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/5">
        <h4 className="font-semibold flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-accent" />
          Recommendations
        </h4>
        <ul className="space-y-2">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-accent mt-1 flex-shrink-0">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
