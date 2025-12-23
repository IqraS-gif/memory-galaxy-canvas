import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Memory, Mood } from '@/types/memory';
import { Button } from '@/components/ui/button';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const getMoodLabel = (mood: Mood): string => {
  switch (mood) {
    case 'happy':
      return '☀️ Happy';
    case 'calm':
      return '🌊 Calm';
    case 'nostalgic':
      return '💜 Nostalgic';
    default:
      return mood;
  }
};

const getMoodBorderColor = (mood: Mood): string => {
  switch (mood) {
    case 'happy':
      return 'border-mood-happy/50';
    case 'calm':
      return 'border-mood-calm/50';
    case 'nostalgic':
      return 'border-mood-nostalgic/50';
    default:
      return 'border-border';
  }
};

export const MemoryModal = ({ memory, isOpen, onClose, onDelete }: MemoryModalProps) => {
  if (!memory) return null;

  const handleDelete = () => {
    onDelete(memory.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`glass-card rounded-2xl overflow-hidden max-w-lg w-full ${getMoodBorderColor(memory.mood)} border-2`}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Image */}
              <div className="relative aspect-video">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm hover:bg-background/70"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {memory.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(memory.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-secondary/50 text-secondary-foreground">
                    {getMoodLabel(memory.mood)}
                  </span>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Memory
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
