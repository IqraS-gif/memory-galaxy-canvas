import { motion } from 'framer-motion';
import { Memory, Mood } from '@/types/memory';
import { Heart, Sun, Moon } from 'lucide-react';

interface EmotionTimelineProps {
  memories: Memory[];
  onMemoryClick: (memory: Memory) => void;
}

const moodConfig: Record<Mood, { label: string; icon: typeof Sun; color: string; bgColor: string }> = {
  happy: { 
    label: 'Happy Moments', 
    icon: Sun, 
    color: 'text-mood-happy',
    bgColor: 'bg-mood-happy/10 border-mood-happy/30'
  },
  calm: { 
    label: 'Calm Memories', 
    icon: Moon, 
    color: 'text-mood-calm',
    bgColor: 'bg-mood-calm/10 border-mood-calm/30'
  },
  nostalgic: { 
    label: 'Nostalgic Feelings', 
    icon: Heart, 
    color: 'text-mood-nostalgic',
    bgColor: 'bg-mood-nostalgic/10 border-mood-nostalgic/30'
  },
};

const moods: Mood[] = ['happy', 'calm', 'nostalgic'];

export const EmotionTimeline = ({ memories, onMemoryClick }: EmotionTimelineProps) => {
  const groupedMemories = moods.reduce((acc, mood) => {
    acc[mood] = memories
      .filter(m => m.mood === mood)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return acc;
  }, {} as Record<Mood, Memory[]>);

  const hasAnyMemories = memories.length > 0;

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-glow">
          Emotions Timeline
        </h2>
        <p className="text-muted-foreground mb-8">Your memories grouped by how they made you feel</p>

        {!hasAnyMemories ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No memories yet. Add your first star!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {moods.map((mood, moodIndex) => {
              const config = moodConfig[mood];
              const moodMemories = groupedMemories[mood];
              const Icon = config.icon;

              if (moodMemories.length === 0) return null;

              return (
                <motion.div
                  key={mood}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moodIndex * 0.1 }}
                  className={`rounded-2xl border p-6 ${config.bgColor}`}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-lg bg-background/50 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-display font-semibold ${config.color}`}>
                        {config.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {moodMemories.length} {moodMemories.length === 1 ? 'memory' : 'memories'}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Scroll Timeline */}
                  <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                      {moodMemories.map((memory, index) => (
                        <motion.button
                          key={memory.id}
                          onClick={() => onMemoryClick(memory)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex-shrink-0 w-40 glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all group"
                          whileHover={{ scale: 1.05, y: -4 }}
                        >
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={memory.imageUrl}
                              alt={memory.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm truncate text-foreground">
                              {memory.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(memory.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
