import { Leaf, Info, Lightbulb, ShieldAlert, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Education & Climate Insights',
  description: 'Understand carbon footprints, global warming basics, daily emission factors, and calculation methodology.',
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <span className="font-mono text-xs uppercase tracking-wider text-brand-blue">Climate Education</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-1.28px] text-ink sm:text-4xl">
          Understanding Your Footprint
        </h1>
        <p className="mt-3 text-base text-body max-w-xl mx-auto">
          Knowledge is the first step toward action. Explore how daily decisions shape our climate and how to make a tangible impact.
        </p>
      </div>

      <div className="space-y-10">
        {/* Section 1: What is a Carbon Footprint? */}
        <section className="card-elevated rounded-xl p-8 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10">
              <Leaf className="h-5 w-5 text-brand-blue" />
            </div>
            <h2 className="text-xl font-semibold text-ink tracking-tight">What is a Carbon Footprint?</h2>
          </div>
          <p className="text-sm text-body leading-relaxed mb-4">
            A <strong>carbon footprint</strong> is the total amount of greenhouse gases (primarily carbon dioxide, methane, and nitrous oxide) emitted into the atmosphere by our direct and indirect activities. It is usually expressed in equivalent tonnes of CO₂ (CO₂e).
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-6">
            <div className="card-soft rounded-lg p-4">
              <h3 className="text-sm font-semibold text-ink mb-2">Direct Emissions</h3>
              <p className="text-xs text-mute leading-relaxed">
                Emissions from sources that you directly control or own. Examples include driving a gasoline car, heating your home with natural gas, or burning firewood.
              </p>
            </div>
            <div className="card-soft rounded-lg p-4">
              <h3 className="text-sm font-semibold text-ink mb-2">Indirect Emissions</h3>
              <p className="text-xs text-mute leading-relaxed">
                Emissions resulting from products and services you consume. Examples include electricity generated at a coal plant for your household devices, or the emissions created to manufacture and ship your groceries.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Global Warming Basics */}
        <section className="card-elevated rounded-xl p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10">
              <ShieldAlert className="h-5 w-5 text-error" />
            </div>
            <h2 className="text-xl font-semibold text-ink tracking-tight">Global Warming & Climate Change</h2>
          </div>
          <p className="text-sm text-body leading-relaxed mb-4">
            The Earth is warmed by the greenhouse effect: greenhouse gases trap heat from the sun that would otherwise escape back into space. This maintains a stable temperature suitable for life. 
          </p>
          <p className="text-sm text-body leading-relaxed">
            However, human activities—such as burning fossil fuels, deforestation, and industrial agriculture—have dramatically increased greenhouse gas concentrations. This causes <strong>global warming</strong>, leading to rising sea levels, severe weather patterns, biodiversity loss, and ecosystem collapse. Keeping global warming within 1.5°C is critical to avoiding the worst impacts.
          </p>
        </section>

        {/* Section 3: Daily Actions Contribution */}
        <section className="card-elevated rounded-xl p-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10">
              <Lightbulb className="h-5 w-5 text-brand-amber" />
            </div>
            <h2 className="text-xl font-semibold text-ink tracking-tight">How Daily Decisions Impact Emissions</h2>
          </div>
          <div className="space-y-4">
            <div className="border-l-2 border-cat-transport pl-4">
              <h3 className="text-sm font-semibold text-ink">Transportation</h3>
              <p className="text-xs text-mute leading-relaxed mt-1">
                Commuting is often an individual&apos;s largest source of direct emissions. Single-occupancy gas vehicles emit high levels of CO₂ per kilometer. Switching to public transit, biking, or electric vehicles is the fastest way to drop transport emissions.
              </p>
            </div>
            <div className="border-l-2 border-cat-energy pl-4">
              <h3 className="text-sm font-semibold text-ink">Household Energy</h3>
              <p className="text-xs text-mute leading-relaxed mt-1">
                Heating, cooling, and electricity use emit CO₂ depending on the grid mix. Coal-dominant grids produce heavy emissions per kWh, whereas renewable-heavy grids are low-impact. Saving energy, using LED bulbs, and turning off idle appliances helps lower emissions.
              </p>
            </div>
            <div className="border-l-2 border-cat-diet pl-4">
              <h3 className="text-sm font-semibold text-ink">Diet & Food Systems</h3>
              <p className="text-xs text-mute leading-relaxed mt-1">
                Meat production (specifically beef and lamb) releases high amounts of methane, a potent greenhouse gas, alongside emissions from feed production and land clearance. Transitioning to a vegetarian or plant-heavy diet can reduce dietary footprints by up to 50%.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Sources & Methodology */}
        <section className="card-elevated rounded-xl p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-violet/10">
              <Info className="h-5 w-5 text-brand-violet" />
            </div>
            <h2 className="text-xl font-semibold text-ink tracking-tight">Methodology & Emission Factors</h2>
          </div>
          <p className="text-sm text-body leading-relaxed mb-4">
            CarbonTrack uses standardized global average emission factors compiled from leading research institutions (IPCC, EPA, and DEFRA). The emission factors utilized in our calculator are as follows:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-hairline text-mute uppercase font-mono">
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Sub-type</th>
                  <th className="pb-2">Factor</th>
                  <th className="pb-2 text-right">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/40">
                <tr>
                  <td className="py-2 font-medium text-ink">Transportation</td>
                  <td className="py-2 text-body">Gasoline Car</td>
                  <td className="py-2 text-body">0.210</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / km</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Transportation</td>
                  <td className="py-2 text-body">Public Transit (Bus/Train)</td>
                  <td className="py-2 text-body">0.089</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / km</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Transportation</td>
                  <td className="py-2 text-body">Bicycle / Walk</td>
                  <td className="py-2 text-body">0.000</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / km</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Household Energy</td>
                  <td className="py-2 text-body">Electricity Consumption</td>
                  <td className="py-2 text-body">0.420</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / kWh</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Dietary Footprint</td>
                  <td className="py-2 text-body">Vegetarian</td>
                  <td className="py-2 text-body">3.800</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / day</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Dietary Footprint</td>
                  <td className="py-2 text-body">Mixed Diet</td>
                  <td className="py-2 text-body">5.600</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / day</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Dietary Footprint</td>
                  <td className="py-2 text-body">Non-Vegetarian</td>
                  <td className="py-2 text-body">7.200</td>
                  <td className="py-2 text-right text-mute">kg CO₂ / day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-brand-blue/5 rounded-xl border border-brand-blue/15 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-brand-blue" />
            <div>
              <h3 className="text-sm font-semibold text-ink">Ready to reduce your impact?</h3>
              <p className="text-xs text-mute">Create a calculation to get a custom 30-day plan.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/calculator"
              className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-xs font-medium text-white transition-colors hover:bg-ink/80"
            >
              Carbon Calculator
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-full border border-hairline bg-surface-2 px-4 text-xs text-body transition-colors hover:text-ink hover:border-hairline-strong"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
