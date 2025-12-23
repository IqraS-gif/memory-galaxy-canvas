import { motion } from 'framer-motion';
import { Memory, Mood } from '@/types/memory';

interface TimelineViewProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

const getMoodColor = (mood: Mood): string => {
  switch (mood) {
    case 'happy':
      return 'bg-mood-happy';
    case 'calm':
      return 'bg-mood-calm';
    case 'nostalgic':
      return 'bg-mood-nostalgic';
    default:
      return 'bg-foreground';
  }
};

export const TimelineView = ({ memories, onMemoryClick }: TimelineViewProps) => {
  const sortedMemories = [...memories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-glow">
          Memory Timeline
        </h2>

        {sortedMemories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No memories yet. Add your first star!</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-mood-calm opacity-30" />

            <div className="space-y-6">
              {sortedMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-2.5 top-4 w-3 h-3 rounded-full ${getMoodColor(memory.mood)} ring-4 ring-background`}
                  />

                  <button
                    onClick={() => onMemoryClick(memory)}
                    className="w-full text-left glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={memory.imageUrl}
                          alt={memory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground truncate">
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
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
