'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I book an appointment?',
    answer: 'Click on the "Book Appointment" button on our homepage, select your preferred specialty or doctor, pick an available time slot, and confirm. You will receive an instant confirmation via SMS and WhatsApp.'
  },
  {
    question: 'Can I choose my preferred doctor?',
    answer: 'Yes! You can view detailed profiles of all our board-certified clinical specialists, check their qualifications, ratings, experience, and book directly with your preferred expert.'
  },
  {
    question: 'How do I access my medical records?',
    answer: 'All your clinical summaries, diagnostic reports, and prescriptions are securely stored in your HIPAA-compliant digital patient portal. Log in at any time to inspect, download, or share them.'
  },
  {
    question: 'Can I cancel or reschedule an appointment?',
    answer: 'Absolutely. You can reschedule or cancel an appointment up to 2 hours before the scheduled time directly from your user dashboard under "Upcoming Schedule."'
  },
  {
    question: 'Is online payment secure?',
    answer: 'Yes, our payment portal uses bank-grade SSL encryption and is fully PCI-DSS compliant. We support credit/debit cards, digital wallets, and insurance billing.'
  },
  {
    question: 'How do I receive laboratory reports?',
    answer: 'Laboratory and diagnostic imaging results are processed quickly. Once verified by our pathology team, they are pushed directly to your patient portal and you will be notified via SMS.'
  },
  {
    question: 'Are emergency services available?',
    answer: 'Yes, our emergency response and trauma dispatch services operate 24/7. We guarantee coordination and physician routing in under 3 minutes for all critical emergencies.'
  },
  {
    question: 'How can I contact hospital support?',
    answer: 'You can connect with our patient experience team via the live chat widget, email us at support@medinexa.com, or call our 24/7 support line at +1 (800) 555-0199.'
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-28 overflow-hidden bg-white dark:bg-slate-950/20 border-t border-border/30">
      {/* Background shape */}
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-[10%] w-[500px] h-[500px] rounded-full bg-secondary/5 dark:bg-secondary/10 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-4"
          >
            <FiHelpCircle className="h-3.5 w-3.5" />
            <span>Support FAQ</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-5 leading-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-body font-medium"
          >
            Find answers to the most common questions about appointments, doctors, payments, reports, and hospital services.
          </motion.p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md transition-all duration-300 hover:border-primary/25 hover:shadow-sm"
              >
                {/* Accordion Trigger button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer outline-none focus:bg-slate-100/40 dark:focus:bg-slate-800/40"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-heading group-hover:text-primary transition-colors duration-250 pr-4">
                    {faq.question}
                  </span>
                  
                  {/* Chevron rotates smoothly */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-body group-hover:bg-primary group-hover:text-white transition-all shrink-0"
                  >
                    <FiChevronDown className="h-4 w-4 stroke-[2.5]" />
                  </motion.div>
                </button>

                {/* Collapsible panel body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-body font-medium leading-relaxed border-t border-border/30 mt-0.5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
