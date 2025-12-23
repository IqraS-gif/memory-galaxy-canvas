import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

export const EmptyState = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-md px-6">
        <motion.div
          className="relative inline-block mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-6 h-6 text-mood-happy fill-mood-happy" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-3"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            <Star className="w-5 h-5 text-mood-calm fill-mood-calm" />
          </motion.div>
        </motion.div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-3 text-glow">
          Your Sky Awaits
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Transform your precious memories into stars. Each moment becomes a point of light in your personal constellation.
        </p>
        <p className="text-sm text-muted-foreground/70 mt-4">
          Click "Add Star" below to begin
        </p>
      </div>
    </motion.div>
  );
};
