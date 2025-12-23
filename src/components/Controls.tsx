import { motion } from 'framer-motion';
import { Plus, Sparkles, List, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControlsProps {
  view: 'constellation' | 'timeline' | 'emotions';
  onViewChange: (view: 'constellation' | 'timeline' | 'emotions') => void;
  onAddClick: () => void;
  memoryCount: number;
  hasActiveConstellation: boolean;
}

export const Controls = ({ 
  view, 
  onViewChange, 
  onAddClick, 
  memoryCount,
  hasActiveConstellation
}: ControlsProps) => {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="glass-card rounded-full px-2 py-2 flex items-center gap-2 flex-wrap justify-center">
        {/* View Toggle */}
        <div className="flex items-center bg-secondary/50 rounded-full p-1">
          <button
            onClick={() => onViewChange('constellation')}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'constellation'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Stars</span>
          </button>
          <button
            onClick={() => onViewChange('timeline')}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'timeline'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </button>
          <button
            onClick={() => onViewChange('emotions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'emotions'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Emotions</span>
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-border/50" />

        {/* Add Button */}
        <Button
          onClick={onAddClick}
          className="rounded-full gap-2 px-6"
          size="default"
          disabled={!hasActiveConstellation}
          title={!hasActiveConstellation ? 'Create a constellation first' : 'Add new stars'}
        >
          <Plus className="w-4 h-4" />
          Add Stars
        </Button>

        {/* Memory Count */}
        {memoryCount > 0 && (
          <>
            <div className="w-px h-8 bg-border/50" />
            <div className="px-4 py-2 text-sm text-muted-foreground">
              <span className="font-display font-semibold text-foreground">{memoryCount}</span>{' '}
              {memoryCount === 1 ? 'star' : 'stars'}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};
