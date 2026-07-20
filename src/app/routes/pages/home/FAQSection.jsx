import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI analyze my public GitHub repository?',
    a: 'README Forge scans the repository using public endpoints, reading metadata like programming languages, dependencies (e.g., package.json), and the file structure. It compiles this structure and sends it to the Gemini API to draft professional documentation.',
  },
  {
    q: 'Is my Google Gemini API key exposed in the browser?',
    a: 'No. All operations are routed through a server-side Express API gateway. Your API keys are strictly configured on the server, ensuring zero client-side exposure.',
  },
  {
    q: 'Can I customize the generated README before exporting?',
    a: 'Absolutely. The platform features a real-time Markdown preview editor. You can live-edit the generated markdown, switch between themes, and see changes instantly before copy/download.',
  },
  {
    q: 'Are generations cached to save token usage?',
    a: 'Yes, the backend implements a SHA-256 in-memory caching layer. Identical configurations or repository structures generate instantly from the cache, avoiding duplicate API calls.',
  },
];

/**
 * FAQ accordion section — self-contained with its own activeFaq state.
 * Memoized at the outer level so the accordion logic lives here, not in HomePortal.
 */
export const FAQSection = memo(function FAQSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base">
          Everything you need to know about using README Forge.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden text-left shadow-sm"
          >
            <button
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-gray-950 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 dark:text-gray-450 transition-transform duration-200 ${
                  activeFaq === idx ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {activeFaq === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-6 text-xs sm:text-sm text-gray-650 dark:text-gray-400 leading-relaxed border-t border-gray-150 dark:border-gray-850 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
});
