import Link from 'next/link';
import { ArrowRight, BarChart3, Calculator, Lightbulb, Shield, TrendingDown, Leaf } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden">
        <div className="gradient-mesh absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-36">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-3 py-1 animate-fade-in">
              <Leaf className="h-3.5 w-3.5 text-eco-a" />
              <span className="font-mono text-xs text-mute">
                Carbon Footprint Awareness Platform
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-2.4px] text-ink sm:text-5xl lg:text-6xl animate-slide-up">
              Understand your impact.{' '}
              <span className="gradient-text">Reduce your footprint.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-body animate-slide-up" style={{ animationDelay: '100ms' }}>
              Track emissions from transport, energy, and diet. Get AI-powered
              insights and a personalized plan to lower your carbon footprint.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link
                href="/calculator"
                prefetch={true}
                id="hero-cta-primary"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-medium text-white transition-all hover:bg-ink/80 hover:scale-[1.02] active:scale-[0.98]"
              >
                Calculate Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                prefetch={true}
                id="hero-cta-secondary"
                className="inline-flex h-12 items-center justify-center rounded-full border border-hairline-strong bg-white/60 px-6 text-base font-medium text-ink backdrop-blur-sm transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section id="stats-band" className="border-y border-hairline bg-surface-0">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '4.7t', label: 'Global Avg CO₂/Year', icon: '🌍' },
              { value: '26%', label: 'From Transport', icon: '🚗' },
              { value: '25%', label: 'From Energy', icon: '⚡' },
              { value: '18%', label: 'From Food', icon: '🥗' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <dt className="sr-only">{stat.label}</dt>
                <span className="text-2xl mb-2" aria-hidden="true">{stat.icon}</span>
                <dd className="text-2xl font-semibold text-ink tracking-tight">{stat.value}</dd>
                <dt className="mt-1 text-xs text-mute" aria-hidden="true">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-surface-4">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="text-center mb-14">
            <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Features</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-1.28px] text-ink sm:text-4xl">
              Everything you need to go green.
            </h2>
            <p className="mt-4 text-base text-body max-w-lg mx-auto">
              From detailed calculators to AI-powered insights, CarbonTrack gives you the tools
              to understand and reduce your environmental impact.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Calculator className="h-5 w-5" />,
                title: 'Carbon Calculator',
                description: 'Calculate emissions from transport, electricity, and diet with precise emission factors.',
                color: 'text-brand-blue bg-brand-blue/10',
              },
              {
                icon: <BarChart3 className="h-5 w-5" />,
                title: 'Visual Dashboard',
                description: 'Interactive charts showing your emission breakdown, trends, and monthly comparisons.',
                color: 'text-brand-amber bg-brand-amber/10',
              },
              {
                icon: <Lightbulb className="h-5 w-5" />,
                title: 'AI Insights',
                description: 'Personalized reduction suggestions with estimated CO₂ savings per recommendation.',
                color: 'text-brand-pink bg-brand-pink/10',
              },
              {
                icon: <TrendingDown className="h-5 w-5" />,
                title: 'Eco Score',
                description: 'Track your environmental performance on a 0–100 scale with letter grades.',
                color: 'text-eco-a bg-eco-a/10',
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: 'Privacy First',
                description: 'All data stored locally in your browser. No accounts, no servers, no tracking.',
                color: 'text-brand-violet bg-brand-violet/10',
              },
              {
                icon: <Leaf className="h-5 w-5" />,
                title: '30-Day Plan',
                description: 'A customized daily action plan to systematically reduce your carbon footprint.',
                color: 'text-brand-cyan bg-brand-cyan/10',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-elevated rounded-xl p-6 transition-all duration-300 hover:border-hairline-strong hover:translate-y-[-2px] group"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg mb-4 ${feature.color} transition-transform group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-ink tracking-tight mb-2">{feature.title}</h3>
                <p className="text-sm text-body leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section id="cta-band" className="relative overflow-hidden bg-surface-0 border-t border-hairline">
        <div className="gradient-mesh absolute inset-0 pointer-events-none opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          <h2 className="text-3xl font-semibold tracking-[-1.28px] text-ink sm:text-4xl">
            Start making a difference today.
          </h2>
          <p className="mt-4 text-base text-body max-w-md mx-auto">
            It takes less than a minute to calculate your footprint and get
            personalized recommendations.
          </p>
          <Link
            href="/calculator"
            prefetch={true}
            id="cta-band-button"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-base font-medium text-white transition-all hover:bg-ink/80 hover:scale-[1.02] active:scale-[0.98]"
          >
            Calculate Your Footprint
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
