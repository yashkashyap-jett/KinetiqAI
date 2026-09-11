import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function BuildingProfile() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-[var(--radius-xl)] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6"
        >
          <Activity className="w-7 h-7 text-accent" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Building your fitness profile
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 mt-6"
        >
          {[
            'Analyzing your goals',
            'Calculating macro targets',
            'Personalizing your plan',
          ].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.5 }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
              {step}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
