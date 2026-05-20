import { ShieldCheck, Zap, Star, Wifi, Wind, MonitorPlay, PencilLine } from 'lucide-react';

const WHY_FEATURES = [
  {
    icon: <ShieldCheck size={22} />,
    title: 'Verified Spaces',
    desc: 'Every room is reviewed and approved before listing — no surprises, just quality.',
    color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  },
  {
    icon: <Zap size={22} />,
    title: 'Instant Booking',
    desc: 'Reserve a room in seconds. No emails, no phone calls — just click and go.',
    color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  },
  {
    icon: <Star size={22} />,
    title: 'Top-Rated Rooms',
    desc: 'Browse community-rated spaces and pick one that fits your study style.',
    color: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400',
  },
  {
    icon: <Wifi size={22} />,
    title: 'All Amenities Included',
    desc: 'Wi-Fi, whiteboards, projectors, power outlets — everything you need to focus.',
    color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  },
  {
    icon: <Wind size={22} />,
    title: 'Quiet & Comfortable',
    desc: 'Noise-controlled, air-conditioned environments designed for deep focus.',
    color: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400',
  },
  {
    icon: <MonitorPlay size={22} />,
    title: 'Collaboration Ready',
    desc: 'Group rooms with projectors and whiteboards for team projects and presentations.',
    color: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400',
  },
];

export default function WhyStudyNookSection() {
  return (
    <section style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="border-y py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 mb-3">
            <PencilLine size={11} />
            Why us
          </div>
          <h2
            className="text-3xl font-extrabold theme-text"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            The StudyNook Advantage
          </h2>
          <p className="theme-text-muted text-sm mt-2 max-w-md mx-auto">
            We built the smarter way to find, book, and enjoy library study spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_FEATURES.map((f) => (
            <div
              key={f.title}
              className="theme-card border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-600/30 transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold theme-text text-base mb-1" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
                  {f.title}
                </h3>
                <p className="theme-text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
