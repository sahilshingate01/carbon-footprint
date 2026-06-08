import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carbon Footprint Calculator',
  description: 'Calculate your weekly carbon emissions from transport, energy use, and diet. Get your eco-score and personalized reduction suggestions.',
  openGraph: {
    title: 'Carbon Footprint Calculator | CarbonTrack',
    description: 'Calculate your weekly carbon emissions and get AI-powered reduction tips.',
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
