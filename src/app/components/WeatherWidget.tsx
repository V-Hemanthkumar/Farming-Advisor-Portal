import { Cloud, Droplets, Wind, MapPin, CloudRain, Sun, CloudSun } from 'lucide-react';
import { WeatherData } from '@/app/services/farmingServices';
import { Card } from '@/app/components/ui/card';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return <CloudRain className="w-8 h-8" />;
    if (cond.includes('cloud') && cond.includes('partly')) return <CloudSun className="w-8 h-8" />;
    if (cond.includes('cloud')) return <Cloud className="w-8 h-8" />;
    return <Sun className="w-8 h-8" />;
  };

  return (
    <div className="space-y-3">
      <Card className="p-5 bg-gradient-to-br from-primary to-accent text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <p className="text-sm opacity-90">{weather.location}</p>
            </div>
            <h3 className="text-4xl font-bold">{weather.temperature}°C</h3>
            <p className="text-sm opacity-90 mt-1">{weather.condition}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
            {getWeatherIcon(weather.condition)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 opacity-80" />
            <div>
              <p className="text-xs opacity-80">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 opacity-80" />
            <div>
              <p className="text-xs opacity-80">Rainfall</p>
              <p className="font-semibold">{weather.rainfall.toFixed(1)}mm</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Wind className="w-4 h-4 text-primary" />
          7-Day Forecast
        </h4>
        <div className="space-y-2">
          {weather.forecast.map((day, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-medium w-20">{day.day}</span>
                <div className="text-muted-foreground">
                  {getWeatherIcon(day.condition)}
                </div>
                <span className="text-xs text-muted-foreground flex-1">{day.condition}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span className="text-muted-foreground">{day.precipitation}%</span>
                </div>
                <span className="font-semibold text-sm w-12 text-right">{day.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
