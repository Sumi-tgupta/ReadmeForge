import React, { memo } from 'react';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free Plan',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for getting started on your GitHub profile README.',
    perks: [
      '20 AI Generations per month',
      'Guided Profile Builder Wizard',
      'Live Markdown Previews',
      'Basic Badges & Trophies',
    ],
    popular: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro Plan',
    price: '$5',
    period: 'month',
    desc: 'Ideal for active developers and open source contributors.',
    perks: [
      '150 AI Generations per month',
      'Advanced Repository Scan Engine',
      'Direct PDF & Markdown Exports',
      'Priority Prompt Queueing',
      'Premium Themes & Styles',
    ],
    popular: false,
    cta: 'Coming Soon',
  },
  {
    name: 'Ultra Plan',
    price: '$20',
    period: 'month',
    desc: 'For power users needing uncapped, professional tooling.',
    perks: [
      'Unlimited AI Generations',
      'Unlimited Repository Audits',
      'Early Access to Beta Features',
      'Custom Branding & Templates',
      '24/7 Priority Support',
    ],
    popular: false,
    cta: 'Coming Soon',
  },
];

export const PricingSection = memo(function PricingSection() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
          Choose the plan that fits your workflow. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10 shadow-xl shadow-indigo-500/5 scale-[1.03] z-10'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" /> Most Popular
              </span>
            )}

            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">{plan.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 border-b border-gray-150 dark:border-gray-800 pb-5">
                <span className="text-4xl font-black tracking-tight text-gray-950 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">/{plan.period}</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {plan.cta === 'Get Started' ? (
                <a
                  href="#products"
                  className="block text-center w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  disabled
                  className="block text-center w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-400 dark:text-gray-500 font-bold text-xs border border-gray-200/50 dark:border-gray-700/50 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
