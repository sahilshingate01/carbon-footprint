import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Track your carbon emissions over time with weekly and monthly breakdowns, trend charts, and eco-score history.',
  openGraph: {
    title: 'Emissions Dashboard | CarbonTrack',
    description: 'Track your carbon emissions over time with detailed charts and analytics.',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
