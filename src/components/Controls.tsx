import { motion } from 'framer-motion';
import { Plus, List, Heart, Box, Square, Image, Palette, Camera, BarChart3, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DownloadPosterButton } from '@/components/DownloadPosterButton';
import { Memory } from '@/types/memory';

interface ControlsProps {
  view: 'constellation' | 'constellation3d' | 'timeline' | 'emotions' | 'stats';
  onViewChange: (view: 'constellation' | 'constellation3d' | 'timeline' | 'emotions' | 'stats') => void;
  onAddClick: () => void;
  onPhotoBoothClick: () => void;
  onGameClick: () => void;
  memoryCount: number;
  hasActiveConstellation: boolean;
  backgroundStyle: 'gradient' | 'nebula';
  onBackgroundStyleChange: (style: 'gradient' | 'nebula') => void;
  memories: Memory[];
  constellationName?: string;
}

export const Controls = ({ 
  view, 
  onViewChange, 
  onAddClick, 
  onPhotoBoothClick,
  onGameClick,
  memoryCount,
  hasActiveConstellation,
  backgroundStyle,
  onBackgroundStyleChange,
  memories,
  constellationName
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
            title="2D View"
          >
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">2D</span>
          </button>
          <button
            onClick={() => onViewChange('constellation3d')}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'constellation3d'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="3D View"
          >
            <Box className="w-4 h-4" />
            <span className="hidden sm:inline">3D</span>
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
          <button
            onClick={() => onViewChange('stats')}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'stats'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Stats</span>
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-border/50" />

        {/* Background Toggle */}
        <div className="flex items-center bg-secondary/50 rounded-full p-1">
          <button
            onClick={() => onBackgroundStyleChange('gradient')}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              backgroundStyle === 'gradient'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Gradient Background"
          >
            <Palette className="w-4 h-4" />
          </button>
          <button
            onClick={() => onBackgroundStyleChange('nebula')}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              backgroundStyle === 'nebula'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Nebula Background"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-border/50" />

        {/* Photo Booth Button */}
        <Button
          onClick={onPhotoBoothClick}
          variant="outline"
          className="rounded-full gap-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
          size="default"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Photo</span>
        </Button>

        {/* Game Button */}
        <Button
          onClick={onGameClick}
          variant="outline"
          className="rounded-full gap-2 border-green-500/50 text-green-300 hover:bg-green-500/20"
          size="default"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="hidden sm:inline">Game</span>
        </Button>

        {/* Download Poster Button */}
        <DownloadPosterButton memories={memories} constellationName={constellationName} />

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
