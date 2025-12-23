import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateConstellation?: () => void;
}

export const EmptyState = ({ onCreateConstellation }: EmptyStateProps) => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center max-w-md px-6">
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
        
        <h2 className="font-display text-2xl font-bold text-foreground mb-3 text-glow">
          Create Your First Constellation
        </h2>
        <p className="text-muted-foreground mb-8">
          Start by creating a constellation, then add your precious memories as stars that light up your personal sky.
        </p>
        
        {onCreateConstellation && (
          <Button 
            onClick={onCreateConstellation}
            size="lg"
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Constellation
          </Button>
        )}
      </div>
    </motion.div>
  );
};
