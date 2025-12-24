import { motion } from 'framer-motion';
import { Memory, Mood } from '@/types/memory';
import { BarChart3, Calendar, Heart, Sparkles, TrendingUp, Star } from 'lucide-react';

interface StatsViewProps {
  memories: Memory[];
  constellationName?: string;
}

const moodColors: Record<Mood, string> = {
  happy: '#FFD700',
  calm: '#87CEEB',
  nostalgic: '#DDA0DD',
};

const moodEmojis: Record<Mood, string> = {
  happy: '☀️',
  calm: '🌊',
  nostalgic: '🌸',
};

export const StatsView = ({ memories, constellationName }: StatsViewProps) => {
  // Calculate stats
  const totalMemories = memories.length;
  
  const moodCounts = memories.reduce((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {} as Record<Mood, number>);
  
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as Mood | undefined;
  
  // Get memories by month
  const memoriesByMonth = memories.reduce((acc, m) => {
    const date = new Date(m.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostActiveMonth = Object.entries(memoriesByMonth).sort((a, b) => b[1] - a[1])[0];
  
  // Get first and last memory dates
  const sortedByDate = [...memories].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const firstMemory = sortedByDate[0];
  const lastMemory = sortedByDate[sortedByDate.length - 1];
  
  // Calculate streak (days between first and last memory)
  const daysBetween = firstMemory && lastMemory 
    ? Math.ceil((new Date(lastMemory.createdAt).getTime() - new Date(firstMemory.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatMonthYear = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subtext,
    color = 'purple'
  }: { 
    icon: typeof Star; 
    label: string; 
    value: string | number; 
    subtext?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className={`w-12 h-12 rounded-full bg-${color}-500/20 flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-display font-bold text-foreground">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </motion.div>
  );

  if (totalMemories === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-12 rounded-3xl max-w-md"
        >
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-display font-bold mb-2">No Stats Yet</h2>
          <p className="text-muted-foreground">
            Add some memories to your constellation to see your stats!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-auto p-8 pt-24"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {constellationName || 'Your'} Stats
          </h1>
          <p className="text-muted-foreground">A look at your memory constellation</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Star}
            label="Total Memories"
            value={totalMemories}
            subtext="stars in your constellation"
            color="yellow"
          />
          <StatCard
            icon={Heart}
            label="Dominant Mood"
            value={dominantMood ? `${moodEmojis[dominantMood]} ${dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1)}` : 'N/A'}
            subtext={dominantMood ? `${moodCounts[dominantMood]} memories` : undefined}
            color="pink"
          />
          <StatCard
            icon={Calendar}
            label="Memory Journey"
            value={`${daysBetween} days`}
            subtext="between first and last memory"
            color="blue"
          />
        </div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-3xl mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-display font-bold">Mood Distribution</h2>
          </div>
          
          <div className="space-y-4">
            {(['happy', 'calm', 'nostalgic'] as Mood[]).map((mood) => {
              const count = moodCounts[mood] || 0;
              const percentage = totalMemories > 0 ? (count / totalMemories) * 100 : 0;
              
              return (
                <div key={mood} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span>{moodEmojis[mood]}</span>
                      <span className="capitalize">{mood}</span>
                    </span>
                    <span className="text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: moodColors[mood] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        {Object.keys(memoriesByMonth).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-display font-bold">Activity Over Time</h2>
            </div>
            
            <div className="space-y-3">
              {Object.entries(memoriesByMonth)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([month, count]) => {
                  const maxCount = Math.max(...Object.values(memoriesByMonth));
                  const percentage = (count / maxCount) * 100;
                  
                  return (
                    <div key={month} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-32 shrink-0">
                        {formatMonthYear(month)}
                      </span>
                      <div className="flex-1 h-6 bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end pr-2"
                        >
                          <span className="text-xs font-medium text-white">{count}</span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {mostActiveMonth && (
              <p className="text-sm text-muted-foreground mt-6">
                🏆 Most active: <span className="text-foreground font-medium">{formatMonthYear(mostActiveMonth[0])}</span> with {mostActiveMonth[1]} memories
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
