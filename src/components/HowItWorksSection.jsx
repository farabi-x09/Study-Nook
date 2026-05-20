import Link from 'next/link';
import { Search, CalendarCheck, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: <Search size={26} />,
    title: 'Search & Filter',
    desc: 'Browse all available rooms. Filter by floor, amenities, hourly rate, or seat capacity to find your perfect match.',
  },
  {
    step: '02',
    icon: <CalendarCheck size={26} />,
    title: 'Pick Your Slot',
    desc: 'Choose a date and time window. See real-time availability and book your slot instantly — no waiting required.',
  },
  {
    step: '03',
    icon: <BookOpen size={26} />,
    title: 'Study in Peace',
    desc: "Show up, settle in, and focus. Your room is reserved and waiting. Manage or cancel anytime from My Bookings.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 mb-3">
          <Sparkles size={11} />
          Simple process
        </div>
        <h2
          className="text-3xl font-extrabold theme-text"
          style={{ fontFamily: 'var(--font-playfair, serif)' }}
        >
          How It Works
        </h2>
        <p className="theme-text-muted text-sm mt-2 max-w-md mx-auto">
          Three easy steps between you and your next productive study session.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Connector line (desktop only) */}
        <div className="hidden md:block absolute top-14 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 dark:from-amber-800 dark:via-amber-600 dark:to-amber-800" />

        {STEPS.map((s) => (
          <div key={s.step} className="flex flex-col items-center text-center relative">
            {/* Circle */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex flex-col items-center justify-center shadow-lg mb-6">
              {s.icon}
              <span className="text-xs font-black mt-1 opacity-80 tracking-widest">{s.step}</span>
            </div>
            <h3
              className="font-extrabold theme-text text-lg mb-2"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              {s.title}
            </h3>
            <p className="theme-text-muted text-sm leading-relaxed max-w-xs">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          Get Started Now <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
