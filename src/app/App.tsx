import { useState, useRef, useEffect } from 'react';
import { Send, Upload, Sprout, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { ChatMessage } from '@/app/components/ChatMessage';
import { QuickActions } from '@/app/components/QuickActions';
import { CropRecommendationCard } from '@/app/components/CropRecommendationCard';
import { WeatherWidget } from '@/app/components/WeatherWidget';
import { MarketPricesCard } from '@/app/components/MarketPricesCard';
import { ImageAnalysisCard } from '@/app/components/ImageAnalysisCard';
import { FarmingTipsCard } from '@/app/components/FarmingTipsCard';
import {
  getCropRecommendations,
  getWeatherData,
  getMarketPrices,
  analyzeImage,
  getFarmingTips,
  CropRecommendation,
  WeatherData,
  MarketPrice,
  ImageAnalysisResult,
} from '@/app/services/farmingServices';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  component?: React.ReactNode;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop recommendation form state
  const [soilType, setSoilType] = useState('');
  const [location, setLocation] = useState('');
  const [season, setSeason] = useState('');

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: "🌾 Welcome to FarmWise - Your Smart Farming Assistant! 🌱\n\nI'm here to help you make informed agricultural decisions. I can assist you with:\n\n• Crop recommendations based on your soil and climate\n• Real-time weather forecasts\n• Current market prices for crops\n• Crop health analysis from images\n• Expert farming tips and advice\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot', component?: React.ReactNode) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      component,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'crop_recommendation':
        setShowCropDialog(true);
        break;
      case 'weather':
        addMessage("Show me the weather forecast", 'user');
        await handleWeatherRequest();
        break;
      case 'market_prices':
        addMessage("What are the current market prices?", 'user');
        await handleMarketPricesRequest();
        break;
      case 'image_analysis':
        setShowImageDialog(true);
        break;
      case 'farming_tips':
        addMessage("Give me some farming tips", 'user');
        await handleFarmingTipsRequest();
        break;
    }
  };

  const handleCropRecommendation = async () => {
    if (!soilType || !location || !season) {
      return;
    }

    setShowCropDialog(false);
    addMessage(
      `I need crop recommendations for ${soilType} soil in ${location} during ${season} season`,
      'user'
    );

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const weatherData = getWeatherData(location);
    const recommendations = getCropRecommendations(soilType, location, season, weatherData.temperature);

    const cropCards = (
      <div className="mt-3 space-y-3">
        {recommendations.map((rec, index) => (
          <CropRecommendationCard key={index} recommendation={rec} />
        ))}
      </div>
    );

    addMessage(
      `Based on your ${soilType} soil type in ${location} during ${season} season, here are the top 5 crop recommendations:\n\nThese recommendations consider current weather conditions (${weatherData.temperature}°C, ${weatherData.condition}) and are optimized for maximum yield and profitability.`,
      'bot',
      cropCards
    );

    setIsLoading(false);
    setSoilType('');
    setLocation('');
    setSeason('');
  };

  const handleWeatherRequest = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const location = 'Your Area';
    const weatherData = getWeatherData(location);

    const weatherWidget = (
      <div className="mt-3">
        <WeatherWidget weather={weatherData} />
      </div>
    );

    addMessage(
      `Here's the current weather and 7-day forecast for your area. This information helps you plan irrigation, spraying, and harvesting activities.`,
      'bot',
      weatherWidget
    );

    setIsLoading(false);
  };

  const handleMarketPricesRequest = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const prices = getMarketPrices();

    const pricesCard = (
      <div className="mt-3">
        <MarketPricesCard prices={prices} />
      </div>
    );

    addMessage(
      `Here are the current market prices for major crops. Prices are updated regularly and show market trends to help you make better selling decisions.`,
      'bot',
      pricesCard
    );

    setIsLoading(false);
  };

  const handleImageUpload = async (file: File) => {
    setShowImageDialog(false);
    const imageUrl = URL.createObjectURL(file);
    
    addMessage(`I've uploaded a crop image for analysis`, 'user');

    setIsLoading(true);
    addMessage('Analyzing your crop image... This may take a moment.', 'bot');

    const result = await analyzeImage(file);

    // Remove loading message
    setMessages((prev) => prev.slice(0, -1));

    const analysisCard = (
      <div className="mt-3">
        <ImageAnalysisCard result={result} imageUrl={imageUrl} />
      </div>
    );

    let statusMessage = '';
    if (result.healthStatus === 'healthy') {
      statusMessage = 'Great news! Your crop appears to be in healthy condition.';
    } else if (result.healthStatus === 'moderate') {
      statusMessage = 'Your crop shows some signs of stress. Early intervention recommended.';
    } else {
      statusMessage = 'Attention needed! Your crop requires immediate care.';
    }

    addMessage(
      `Image analysis complete! ${statusMessage}\n\nI've identified this as ${result.cropType} with a health score of ${result.healthScore}%. ${result.diseases.length > 0 ? `Detected ${result.diseases.length} potential issue(s).` : 'No major issues detected.'} See detailed analysis below:`,
      'bot',
      analysisCard
    );

    setIsLoading(false);
  };

  const handleFarmingTipsRequest = async (category?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const tips = getFarmingTips(category);

    const tipsCard = (
      <div className="mt-3">
        <FarmingTipsCard tips={tips} category={category || 'General'} />
      </div>
    );

    addMessage(
      `Here are some expert ${category || 'general'} farming tips to help improve your productivity and crop health:`,
      'bot',
      tipsCard
    );

    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, 'user');
    setInputValue('');

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('rain')) {
      await handleWeatherRequest();
    } else if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('cost')) {
      await handleMarketPricesRequest();
    } else if (lowerMessage.includes('crop') && (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('grow'))) {
      setShowCropDialog(true);
    } else if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
        await handleFarmingTipsRequest('irrigation');
      } else if (lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
        await handleFarmingTipsRequest('pest');
      } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
        await handleFarmingTipsRequest('fertilizer');
      } else {
        await handleFarmingTipsRequest();
      }
    } else {
      addMessage(
        `I can help you with:\n\n• Crop recommendations - Tell me your soil type and location\n• Weather forecasts - Ask "What's the weather?"\n• Market prices - Ask "Show market prices"\n• Image analysis - Upload a crop photo\n• Farming tips - Ask for specific advice\n\nYou can also use the quick action buttons below for faster access!`,
        'bot'
      );
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-primary to-accent text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FarmWise</h1>
                <p className="text-sm opacity-90">Smart Farming Advisory Portal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">AI Assistant Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Chat Messages */}
        <div className="bg-card rounded-2xl shadow-lg border border-border mb-4 overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                sender={message.sender}
                timestamp={message.timestamp}
              >
                {message.component}
              </ChatMessage>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="border-t border-border p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">Quick Actions:</p>
            <QuickActions onAction={handleQuickAction} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-card">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex-shrink-0"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about farming..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="flex-shrink-0 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>FarmWise uses AI-powered analysis to provide farming recommendations.</p>
          <p className="mt-1">Data is for informational purposes. Always consult local agricultural experts.</p>
        </div>
      </main>

      {/* Crop Recommendation Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Get Crop Recommendations
            </DialogTitle>
            <DialogDescription>
              Tell us about your farm conditions to get personalized crop recommendations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="soil-type">Soil Type</Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger id="soil-type">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loamy">Loamy Soil</SelectItem>
                  <SelectItem value="clay">Clay Soil</SelectItem>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                  <SelectItem value="silt">Silt Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Punjab, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Current Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="monsoon">Monsoon</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCropRecommendation}
              disabled={!soilType || !location || !season}
              className="w-full bg-gradient-to-r from-primary to-accent"
            >
              Get Recommendations
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Crop Image
            </DialogTitle>
            <DialogDescription>
              Upload a clear photo of your crop for health analysis and disease detection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Click below to select an image or drag and drop
              </p>
              <Button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowImageDialog(false);
                }}
                className="bg-gradient-to-r from-primary to-accent"
              >
                Choose Image
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Supported formats: JPG, PNG • Max size: 5MB
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
