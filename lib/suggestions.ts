import type { CalculatorInputs, EmissionBreakdown, AISuggestion, ReductionPlanDay } from '@/types';

/**
 * Generate personalized carbon reduction suggestions based on user inputs.
 */
export function generateSuggestions(
  inputs: CalculatorInputs,
  emissions: EmissionBreakdown
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Transport suggestions
  if (inputs.transport.mode === 'car') {
    suggestions.push({
      id: 'switch-public',
      category: 'transport',
      title: 'Switch to public transport',
      description:
        'Taking the bus or train instead of driving can reduce your transport emissions by up to 58%. Consider commuting by metro or bus at least 3 days a week.',
      impact: 'high',
      savingsKg: Math.round(emissions.transport * 0.58 * 100) / 100,
    });

    if (inputs.transport.distancePerWeek > 50) {
      suggestions.push({
        id: 'carpool',
        category: 'transport',
        title: 'Start carpooling',
        description:
          'Sharing your ride with just one other person halves your per-person emissions. Use carpooling apps or coordinate with colleagues.',
        impact: 'medium',
        savingsKg: Math.round(emissions.transport * 0.5 * 100) / 100,
      });
    }

    suggestions.push({
      id: 'ev-switch',
      category: 'transport',
      title: 'Consider an electric vehicle',
      description:
        'EVs produce zero tailpipe emissions. Even accounting for electricity generation, EVs emit 50-70% less CO2 than conventional cars.',
      impact: 'high',
      savingsKg: Math.round(emissions.transport * 0.6 * 100) / 100,
    });
  }

  if (inputs.transport.mode === 'public' && inputs.transport.distancePerWeek > 30) {
    suggestions.push({
      id: 'bike-commute',
      category: 'transport',
      title: 'Try cycling for short trips',
      description:
        'For trips under 5 km, cycling is faster than public transit and produces zero emissions. Consider an e-bike for longer distances.',
      impact: 'medium',
      savingsKg: Math.round(emissions.transport * 0.3 * 100) / 100,
    });
  }

  if (inputs.transport.distancePerWeek > 100) {
    suggestions.push({
      id: 'remote-work',
      category: 'transport',
      title: 'Work remotely when possible',
      description:
        'Remote work eliminates commute emissions entirely. Even 2 days per week of remote work can significantly reduce your carbon footprint.',
      impact: 'high',
      savingsKg: Math.round(emissions.transport * 0.4 * 100) / 100,
    });
  }

  // Energy suggestions
  if (inputs.energy.monthlyElectricity > 300) {
    suggestions.push({
      id: 'reduce-electricity',
      category: 'energy',
      title: 'Reduce electricity consumption',
      description:
        'Switch to LED lighting, use energy-efficient appliances, and unplug devices when not in use. These small changes can reduce consumption by 20-30%.',
      impact: 'high',
      savingsKg: Math.round(emissions.energy * 0.25 * 100) / 100,
    });
  }

  if (inputs.energy.monthlyElectricity > 150) {
    suggestions.push({
      id: 'smart-thermostat',
      category: 'energy',
      title: 'Install a smart thermostat',
      description:
        'Smart thermostats optimize heating and cooling schedules automatically, reducing energy waste by 10-15% without sacrificing comfort.',
      impact: 'medium',
      savingsKg: Math.round(emissions.energy * 0.12 * 100) / 100,
    });
  }

  suggestions.push({
    id: 'renewable-energy',
    category: 'energy',
    title: 'Switch to renewable energy',
    description:
      'Choose a green energy provider or install solar panels. Renewable energy sources produce near-zero emissions during operation.',
    impact: 'high',
    savingsKg: Math.round(emissions.energy * 0.85 * 100) / 100,
  });

  // Diet suggestions
  if (inputs.diet.type === 'non-vegetarian') {
    suggestions.push({
      id: 'reduce-meat',
      category: 'diet',
      title: 'Reduce meat consumption',
      description:
        'Cutting meat intake by half can reduce diet-related emissions by 35%. Try Meatless Mondays and explore plant-based alternatives.',
      impact: 'high',
      savingsKg: Math.round(emissions.diet * 0.35 * 100) / 100,
    });

    suggestions.push({
      id: 'local-food',
      category: 'diet',
      title: 'Buy local and seasonal food',
      description:
        'Locally sourced food travels shorter distances, reducing transport emissions. Seasonal produce also requires less energy-intensive growing methods.',
      impact: 'medium',
      savingsKg: Math.round(emissions.diet * 0.1 * 100) / 100,
    });
  }

  if (inputs.diet.type === 'mixed') {
    suggestions.push({
      id: 'more-plant-based',
      category: 'diet',
      title: 'Add more plant-based meals',
      description:
        'Increasing plant-based meals to 4+ days per week can reduce your diet emissions by 25%. Explore legumes, grains, and plant proteins.',
      impact: 'medium',
      savingsKg: Math.round(emissions.diet * 0.25 * 100) / 100,
    });
  }

  suggestions.push({
    id: 'reduce-waste',
    category: 'diet',
    title: 'Minimize food waste',
    description:
      'About 8-10% of global emissions come from food waste. Plan meals, store food properly, and compost organic waste.',
    impact: 'low',
    savingsKg: Math.round(emissions.diet * 0.08 * 100) / 100,
  });

  // General
  suggestions.push({
    id: 'carbon-offset',
    category: 'general',
    title: 'Invest in carbon offsets',
    description:
      'Support verified carbon offset projects like reforestation, renewable energy, or methane capture to neutralize your remaining emissions.',
    impact: 'medium',
    savingsKg: Math.round(emissions.total * 0.2 * 100) / 100,
  });

  return suggestions;
}

/**
 * Generate a 30-day carbon reduction plan.
 */
export function generateReductionPlan(
  inputs: CalculatorInputs
): ReductionPlanDay[] {
  const plan: ReductionPlanDay[] = [
    { day: 1, task: 'Audit your current energy consumption', category: 'energy', tip: 'Check your electricity meter and note your baseline usage.' },
    { day: 2, task: 'Switch all lights to LED bulbs', category: 'energy', tip: 'LEDs use 75% less energy and last 25x longer than incandescent bulbs.' },
    { day: 3, task: 'Try a plant-based meal', category: 'diet', tip: 'Start with a simple recipe like lentil soup or veggie stir-fry.' },
    { day: 4, task: 'Unplug unused electronics', category: 'energy', tip: 'Phantom energy can account for 10% of your electricity bill.' },
    { day: 5, task: 'Walk or cycle for a short errand', category: 'transport', tip: 'Trips under 2 km are perfect for walking — it takes about 20 minutes.' },
    { day: 6, task: 'Start a compost bin', category: 'diet', tip: 'Food waste in landfills produces methane, a potent greenhouse gas.' },
    { day: 7, task: 'Review your weekly progress', category: 'general', tip: 'Reflection helps build lasting habits. Celebrate small wins!' },
    { day: 8, task: 'Research public transit routes', category: 'transport', tip: 'Map out bus or train routes for your most common destinations.' },
    { day: 9, task: 'Cook a batch meal to reduce waste', category: 'diet', tip: 'Batch cooking reduces energy use and prevents food spoilage.' },
    { day: 10, task: 'Lower thermostat by 1°C', category: 'energy', tip: 'Each degree reduction saves about 3% on heating costs.' },
    { day: 11, task: 'Try carpooling to work', category: 'transport', tip: 'Ask a colleague if they would be interested in sharing rides.' },
    { day: 12, task: 'Buy local produce', category: 'diet', tip: 'Visit a farmers market — local food travels fewer food miles.' },
    { day: 13, task: 'Air-dry your laundry', category: 'energy', tip: 'Dryers are one of the most energy-hungry household appliances.' },
    { day: 14, task: 'Review your two-week progress', category: 'general', tip: 'You\'re halfway there! Note which changes felt easiest to maintain.' },
    { day: 15, task: 'Research renewable energy options', category: 'energy', tip: 'Many providers offer green energy plans at comparable prices.' },
    { day: 16, task: 'Plan a Meatless Monday', category: 'diet', tip: 'Replacing one day of meat per week saves ~340 kg CO2 per year.' },
    { day: 17, task: 'Optimize your commute route', category: 'transport', tip: 'Shorter or less congested routes reduce fuel consumption.' },
    { day: 18, task: 'Fix any dripping taps', category: 'energy', tip: 'A dripping tap can waste 5,500 liters of water per year.' },
    { day: 19, task: 'Try a fully plant-based day', category: 'diet', tip: 'Challenge yourself — explore cuisines that are naturally plant-based.' },
    { day: 20, task: 'Use a reusable water bottle', category: 'general', tip: 'Producing a plastic bottle generates ~82g of CO2.' },
    { day: 21, task: 'Review your three-week progress', category: 'general', tip: 'Most habits take 21 days to form. You\'re building momentum!' },
    { day: 22, task: 'Shorten your shower by 2 minutes', category: 'energy', tip: 'This can save 40 liters of hot water per shower.' },
    { day: 23, task: 'Try a remote work day', category: 'transport', tip: 'Zero commute means zero transport emissions for the day.' },
    { day: 24, task: 'Organize a neighborhood swap', category: 'general', tip: 'Trading items instead of buying new reduces manufacturing emissions.' },
    { day: 25, task: 'Plan meals for the week', category: 'diet', tip: 'Meal planning reduces impulse purchases and food waste by up to 25%.' },
    { day: 26, task: 'Check your tire pressure', category: 'transport', tip: 'Properly inflated tires improve fuel efficiency by up to 3%.' },
    { day: 27, task: 'Switch to cold water laundry', category: 'energy', tip: 'Heating water accounts for about 90% of washing machine energy use.' },
    { day: 28, task: 'Explore carbon offset options', category: 'general', tip: 'Consider supporting verified reforestation or renewable energy projects.' },
    { day: 29, task: 'Share your journey with others', category: 'general', tip: 'Inspiring others multiplies your environmental impact exponentially.' },
    { day: 30, task: 'Set goals for next month', category: 'general', tip: 'Build on your successes and tackle areas that still need improvement.' },
  ];

  // Customize based on inputs
  if (inputs.transport.mode === 'bike') {
    plan[4] = { ...plan[4], task: 'Encourage a friend to cycle', tip: 'You already cycle — help someone else start!' };
    plan[10] = { ...plan[10], task: 'Explore new cycling routes', tip: 'Finding scenic routes makes cycling even more enjoyable.' };
  }

  if (inputs.diet.type === 'vegetarian') {
    plan[2] = { ...plan[2], task: 'Try a fully vegan meal', tip: 'Even vegetarian diets can be improved by reducing dairy.' };
    plan[18] = { ...plan[18], task: 'Research vegan protein sources', tip: 'Tofu, tempeh, seitan, and legumes are excellent protein sources.' };
  }

  return plan;
}
