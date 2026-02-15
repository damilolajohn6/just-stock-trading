import { Scale, ShieldCheck, Truck, Leaf } from 'lucide-react';
import { Container } from '@/components/shared/container';

const props = [
  {
    icon: Scale,
    title: 'Pay by Weight',
    description: 'Only £15 per kilo — grab more, spend less',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Checked',
    description: 'Every item inspected & verified before sale',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'UK-wide delivery, free on orders over £50',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Leaf,
    title: 'Sustainable',
    description: 'Save clothing from landfill, one kilo at a time',
    color: 'from-green-500 to-emerald-500',
  },
];

export function ValueProps() {
  return (
    <section className="bg-zinc-950 py-16 text-white lg:py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">Shop Big, Pay Light</h2>
          <p className="mx-auto max-w-xl text-lg text-zinc-400">
            Premium vintage, streetwear, Y2K gems and everyday fashion — all priced by weight.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {props.map((prop) => (
            <div
              key={prop.title}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              {/* Icon */}
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${prop.color} mb-4 shadow-lg`}
              >
                <prop.icon className="h-7 w-7 text-white" />
              </div>

              <h3 className="mb-2 text-lg font-semibold">{prop.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{prop.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
