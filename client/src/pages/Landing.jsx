import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Dumbbell,
  Apple,
  TrendingUp,
  Brain,
  Target,
  Zap,
} from 'lucide-react';
import Button from '../components/common/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: Brain,
    title: 'Personalized From Day One',
    description:
      'Your fitness profile drives every recommendation. Goals, experience, dietary needs, schedule — the AI builds a plan around your actual life.',
  },
  {
    icon: Dumbbell,
    title: 'Train With Purpose',
    description:
      'Structured workout plans that adapt to your performance. Track sets, reps, and weight with a focused session interface.',
  },
  {
    icon: Apple,
    title: 'Eat For Your Goal',
    description:
      'Macro-aware meal plans, food logging, smart swaps, and contextual nutrition coaching — all calibrated to your targets.',
  },
  {
    icon: TrendingUp,
    title: 'Understand Your Progress',
    description:
      'Readiness scores, training load, fitness scores, and interactive analytics transform raw data into actionable insight.',
  },
  {
    icon: Zap,
    title: 'Your Plan Evolves With You',
    description:
      'The system analyzes your actual behavior — completed workouts, missed sessions, nutrition adherence — and adapts recommendations.',
  },
  {
    icon: Target,
    title: 'Built Around Your Real Life',
    description:
      'Sleep patterns, stress levels, available time, equipment — intelligence that respects constraints rather than ignoring them.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              KINETIQ
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-muted text-accent-text text-xs font-medium border border-accent/20 mb-6">
              <Activity className="w-3 h-3" />
              Personal Fitness Intelligence
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your fitness plan should{' '}
            <span className="text-gradient">adapt to you</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Personalized workouts, nutrition, and progress intelligence built around your body,
            goals, and lifestyle. Your plan gets smarter as you train.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/register">
              <Button size="lg" className="min-w-[180px]">
                Build My Plan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="min-w-[180px]">
                Explore Platform
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intelligence Loop Visual */}
      <section className="py-16 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Intelligence that compounds
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Every workout you complete, every meal you log, every night of sleep — feeds back into
              the system. Your plan evolves with real data, not assumptions.
            </p>
          </motion.div>

          {/* Loop visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="surface p-6 sm:p-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { step: '01', label: 'ASSESS', desc: 'Your profile & goals' },
                { step: '02', label: 'PLAN', desc: 'AI-generated program' },
                { step: '03', label: 'EXECUTE', desc: 'Track real performance' },
                { step: '04', label: 'ADAPT', desc: 'Intelligence evolves' },
              ].map((item, i) => (
                <div key={item.step} className="space-y-2">
                  <span className="text-xs font-mono text-accent">{item.step}</span>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden sm:block absolute">
                      <ArrowRight className="w-4 h-4 text-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="surface p-5 hover:border-border-hover transition-colors"
              >
                <feature.icon className="w-5 h-5 text-accent mb-3" />
                <h3 className="text-sm font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Preview */}
      <section className="py-16 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="surface p-6 sm:p-8">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-6">
              Sample Dashboard
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'READINESS', value: '82', unit: '/100' },
                { label: 'FITNESS SCORE', value: '74', unit: '' },
                { label: 'WEEKLY ADHERENCE', value: '87', unit: '%' },
                { label: 'TRAINING LOAD', value: '1,240', unit: 'AU' },
              ].map((metric) => (
                <div key={metric.label}>
                  <p className="metric-label mb-1">{metric.label}</p>
                  <p className="metric-value text-3xl sm:text-4xl">
                    {metric.value}
                    <span className="text-sm text-text-muted font-normal ml-0.5">
                      {metric.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Start training smarter
          </h2>
          <p className="text-text-secondary mb-8">
            Create your fitness profile and receive your personalized plan in minutes.
          </p>
          <Link to="/register">
            <Button size="lg">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-accent flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              KINETIQ
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Personal Fitness Intelligence — Not a substitute for professional medical advice
          </p>
        </div>
      </footer>
    </div>
  );
}
