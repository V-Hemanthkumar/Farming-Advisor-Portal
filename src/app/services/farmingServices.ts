// Mock services for FarmWise Chatbot

export interface CropRecommendation {
  cropName: string;
  suitability: number;
  expectedYield: string;
  waterRequirement: string;
  growthPeriod: string;
  marketPrice: string;
  tips: string[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
  forecast: {
    day: string;
    temp: number;
    condition: string;
    precipitation: number;
  }[];
}

export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface ImageAnalysisResult {
  cropType: string;
  healthStatus: 'healthy' | 'moderate' | 'poor';
  healthScore: number;
  diseases: {
    name: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    treatment: string;
  }[];
  recommendations: string[];
}

const cropDatabase = {
  'loamy': {
    'summer': ['Corn', 'Tomato', 'Cucumber', 'Watermelon', 'Cotton'],
    'winter': ['Wheat', 'Barley', 'Peas', 'Mustard', 'Carrot'],
    'monsoon': ['Rice', 'Sugarcane', 'Soybean', 'Cotton', 'Groundnut'],
    'spring': ['Potato', 'Onion', 'Cabbage', 'Cauliflower', 'Spinach']
  },
  'clay': {
    'summer': ['Rice', 'Sunflower', 'Sorghum', 'Cotton', 'Broccoli'],
    'winter': ['Wheat', 'Chickpea', 'Lettuce', 'Cabbage', 'Broccoli'],
    'monsoon': ['Rice', 'Jute', 'Sugarcane', 'Turmeric', 'Ginger'],
    'spring': ['Potato', 'Peas', 'Beans', 'Cauliflower', 'Radish']
  },
  'sandy': {
    'summer': ['Millet', 'Watermelon', 'Cucumber', 'Peanut', 'Carrot'],
    'winter': ['Potato', 'Radish', 'Carrot', 'Turnip', 'Beetroot'],
    'monsoon': ['Groundnut', 'Pearl Millet', 'Cowpea', 'Green Gram', 'Cucumber'],
    'spring': ['Tomato', 'Pepper', 'Eggplant', 'Beans', 'Melon']
  },
  'silt': {
    'summer': ['Soybean', 'Corn', 'Tomato', 'Pepper', 'Squash'],
    'winter': ['Wheat', 'Barley', 'Oats', 'Spinach', 'Lettuce'],
    'monsoon': ['Rice', 'Sugarcane', 'Soybean', 'Corn', 'Vegetables'],
    'spring': ['Potato', 'Cabbage', 'Cauliflower', 'Peas', 'Beans']
  }
};

const cropDetails: Record<string, Partial<CropRecommendation>> = {
  'Rice': { waterRequirement: 'High (1200-1500mm)', growthPeriod: '120-150 days', marketPrice: '₹2000-2500/quintal' },
  'Wheat': { waterRequirement: 'Medium (450-650mm)', growthPeriod: '120-140 days', marketPrice: '₹1900-2200/quintal' },
  'Corn': { waterRequirement: 'Medium (500-800mm)', growthPeriod: '90-120 days', marketPrice: '₹1500-1800/quintal' },
  'Cotton': { waterRequirement: 'Medium-High (700-1300mm)', growthPeriod: '150-180 days', marketPrice: '₹5500-6500/quintal' },
  'Sugarcane': { waterRequirement: 'Very High (1500-2500mm)', growthPeriod: '12-18 months', marketPrice: '₹2750-3000/ton' },
  'Potato': { waterRequirement: 'Medium (500-700mm)', growthPeriod: '90-120 days', marketPrice: '₹800-1200/quintal' },
  'Tomato': { waterRequirement: 'Medium (600-800mm)', growthPeriod: '90-120 days', marketPrice: '₹1500-2500/quintal' },
  'Onion': { waterRequirement: 'Medium (350-550mm)', growthPeriod: '120-150 days', marketPrice: '₹1000-2000/quintal' },
  'Soybean': { waterRequirement: 'Medium (450-700mm)', growthPeriod: '90-120 days', marketPrice: '₹3800-4200/quintal' },
  'Groundnut': { waterRequirement: 'Medium (500-700mm)', growthPeriod: '120-140 days', marketPrice: '₹5000-5500/quintal' },
};

export const getCropRecommendations = (
  soilType: string,
  location: string,
  season: string,
  temperature: number
): CropRecommendation[] => {
  const soil = soilType.toLowerCase();
  const seasonKey = season.toLowerCase() as keyof typeof cropDatabase.loamy;
  
  const crops = cropDatabase[soil as keyof typeof cropDatabase]?.[seasonKey] || 
                cropDatabase['loamy'][seasonKey];
  
  return crops.slice(0, 5).map((crop, index) => {
    const details = cropDetails[crop] || {};
    const baseSuitability = 85 - (index * 5);
    const tempAdjustment = Math.abs(temperature - 25) < 5 ? 10 : 0;
    
    return {
      cropName: crop,
      suitability: Math.min(95, baseSuitability + tempAdjustment),
      expectedYield: `${15 + index * 2}-${25 + index * 3} quintals/acre`,
      waterRequirement: details.waterRequirement || 'Medium (500-700mm)',
      growthPeriod: details.growthPeriod || '90-120 days',
      marketPrice: details.marketPrice || '₹1500-2500/quintal',
      tips: [
        `Best planting time: ${season}`,
        `Optimal for ${soil} soil`,
        `Current temperature (${temperature}°C) is ${temperature > 20 && temperature < 35 ? 'ideal' : 'acceptable'}`,
      ]
    };
  });
};

export const getWeatherData = (location: string): WeatherData => {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = 22 + Math.floor(Math.random() * 12);
  
  return {
    location,
    temperature: baseTemp,
    condition: randomCondition,
    humidity: 55 + Math.floor(Math.random() * 30),
    rainfall: Math.random() * 10,
    forecast: [
      { day: 'Today', temp: baseTemp, condition: randomCondition, precipitation: 10 },
      { day: 'Tomorrow', temp: baseTemp + 2, condition: 'Partly Cloudy', precipitation: 20 },
      { day: 'Day 3', temp: baseTemp - 1, condition: 'Cloudy', precipitation: 30 },
      { day: 'Day 4', temp: baseTemp + 1, condition: 'Sunny', precipitation: 5 },
      { day: 'Day 5', temp: baseTemp + 3, condition: 'Clear', precipitation: 0 },
      { day: 'Day 6', temp: baseTemp, condition: 'Light Rain', precipitation: 40 },
      { day: 'Day 7', temp: baseTemp - 2, condition: 'Partly Cloudy', precipitation: 15 },
    ]
  };
};

export const getMarketPrices = (): MarketPrice[] => {
  const crops = [
    { crop: 'Wheat', price: 2050, unit: '₹/quintal', trend: 'up' as const, change: 3.2 },
    { crop: 'Rice', price: 2300, unit: '₹/quintal', trend: 'up' as const, change: 2.8 },
    { crop: 'Cotton', price: 6200, unit: '₹/quintal', trend: 'stable' as const, change: 0.5 },
    { crop: 'Sugarcane', price: 2850, unit: '₹/ton', trend: 'down' as const, change: -1.2 },
    { crop: 'Soybean', price: 4100, unit: '₹/quintal', trend: 'up' as const, change: 4.5 },
    { crop: 'Corn', price: 1650, unit: '₹/quintal', trend: 'stable' as const, change: 0.3 },
    { crop: 'Potato', price: 1000, unit: '₹/quintal', trend: 'down' as const, change: -5.5 },
    { crop: 'Onion', price: 1800, unit: '₹/quintal', trend: 'up' as const, change: 8.2 },
    { crop: 'Tomato', price: 2100, unit: '₹/quintal', trend: 'up' as const, change: 6.1 },
    { crop: 'Groundnut', price: 5300, unit: '₹/quintal', trend: 'stable' as const, change: -0.8 },
  ];
  
  return crops;
};

export const analyzeImage = (imageFile: File): Promise<ImageAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cropTypes = ['Wheat', 'Rice', 'Tomato', 'Cotton', 'Corn', 'Potato'];
      const healthStatuses: ('healthy' | 'moderate' | 'poor')[] = ['healthy', 'moderate', 'poor'];
      const diseases = [
        {
          name: 'Leaf Blight',
          confidence: 78,
          severity: 'medium' as const,
          treatment: 'Apply fungicide (Mancozeb 75% WP @ 2.5g/liter). Remove infected leaves. Improve air circulation.'
        },
        {
          name: 'Nutrient Deficiency (Nitrogen)',
          confidence: 65,
          severity: 'low' as const,
          treatment: 'Apply nitrogen-rich fertilizer (Urea @ 50kg/acre). Consider organic compost application.'
        }
      ];
      
      const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
      const healthStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
      const healthScore = healthStatus === 'healthy' ? 85 + Math.random() * 10 : 
                         healthStatus === 'moderate' ? 60 + Math.random() * 20 : 
                         40 + Math.random() * 15;
      
      const result: ImageAnalysisResult = {
        cropType,
        healthStatus,
        healthScore: Math.round(healthScore),
        diseases: healthStatus !== 'healthy' ? diseases.slice(0, healthStatus === 'poor' ? 2 : 1) : [],
        recommendations: [
          `This appears to be ${cropType} in ${healthStatus} condition`,
          healthStatus === 'healthy' 
            ? 'Continue current care practices. Monitor regularly for any changes.'
            : 'Immediate attention recommended. Follow treatment guidelines.',
          'Ensure proper irrigation schedule',
          'Monitor for pest activity',
          healthStatus !== 'healthy' ? 'Consider soil testing for nutrient analysis' : 'Maintain current nutrient management'
        ]
      };
      
      resolve(result);
    }, 2000);
  });
};

export const getFarmingTips = (category?: string): string[] => {
  const tips = {
    general: [
      'Always test your soil before planting to understand nutrient levels',
      'Rotate crops seasonally to maintain soil health and prevent pest buildup',
      'Use mulching to conserve soil moisture and control weeds',
      'Monitor weather forecasts regularly to plan irrigation and harvesting',
      'Keep detailed records of planting dates, inputs, and yields for better planning'
    ],
    irrigation: [
      'Water early morning or evening to minimize evaporation',
      'Use drip irrigation for water efficiency and better crop health',
      'Check soil moisture before irrigating - avoid overwatering',
      'Consider rainwater harvesting for sustainable water management'
    ],
    pest: [
      'Implement Integrated Pest Management (IPM) practices',
      'Use pest-resistant crop varieties when available',
      'Encourage beneficial insects by planting diverse crops',
      'Regularly scout fields for early pest detection'
    ],
    fertilizer: [
      'Apply fertilizers based on soil test recommendations',
      'Use organic manure to improve soil structure and fertility',
      'Follow recommended NPK ratios for your specific crop',
      'Split fertilizer applications for better nutrient uptake'
    ]
  };
  
  if (category && category in tips) {
    return tips[category as keyof typeof tips];
  }
  
  return tips.general;
};
