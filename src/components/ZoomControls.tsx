import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
}

export const ZoomControls = ({ onZoomIn, onZoomOut, onReset, scale }: ZoomControlsProps) => {
  return (
    <motion.div
      className="fixed left-4 bottom-24 z-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="glass-card rounded-xl p-1.5 flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          className="p-2 rounded-lg hover:bg-secondary/50 transition-all text-muted-foreground hover:text-foreground"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        
        <div className="text-xs text-center text-muted-foreground py-1 font-mono">
          {Math.round(scale * 100)}%
        </div>
        
        <button
          onClick={onZoomOut}
          className="p-2 rounded-lg hover:bg-secondary/50 transition-all text-muted-foreground hover:text-foreground"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        
        <div className="w-full h-px bg-border/50 my-1" />
        
        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-secondary/50 transition-all text-muted-foreground hover:text-foreground"
          title="Reset view"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
