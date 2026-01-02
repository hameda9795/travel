'use client';

import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = 'Veelgestelde Vragen' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Safety check for items array
  const faqItems = items || [];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate Schema.org FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="my-12">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-accent text-white p-2 rounded-lg">
          <MessageCircleQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full flex justify-between items-center p-5 text-left hover:bg-muted transition-colors"
              aria-expanded={openIndex === index}
            >
              <h3 className="text-lg font-semibold text-foreground pr-4">{item.question}</h3>
              <ChevronDown
                className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 pt-2">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
