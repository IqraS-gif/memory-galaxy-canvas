import { motion } from 'framer-motion';
import { Memory, Mood } from '@/types/memory';

interface StarProps {
  memory: Memory;
  onClick: () => void;
  index: number;
}

const getMoodColor = (mood: Mood): string => {
  switch (mood) {
    case 'happy':
      return 'text-mood-happy';
    case 'calm':
      return 'text-mood-calm';
    case 'nostalgic':
      return 'text-mood-nostalgic';
    default:
      return 'text-foreground';
  }
};

const getMoodGlow = (mood: Mood): string => {
  switch (mood) {
    case 'happy':
      return 'star-glow-happy';
    case 'calm':
      return 'star-glow-calm';
    case 'nostalgic':
      return 'star-glow-nostalgic';
    default:
      return 'star-glow';
  }
};

export const Star = ({ memory, onClick, index }: StarProps) => {
  const colorClass = getMoodColor(memory.mood);
  const glowClass = getMoodGlow(memory.mood);

  return (
    <motion.button
      className={`absolute cursor-pointer group ${glowClass}`}
      style={{
        left: memory.position.x,
        top: memory.position.y,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${colorClass} animate-twinkle`}
        style={{ animationDelay: `${index * 0.3}s` }}
      >
        <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.81 19.73L12 16.77L7.19 19.73L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" />
      </motion.svg>
      
      {/* Hover tooltip */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 -top-10 px-3 py-1.5 bg-popover/90 backdrop-blur-sm rounded-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10"
        initial={{ y: 5 }}
        whileHover={{ y: 0 }}
      >
        <span className="text-sm font-medium text-foreground">{memory.title}</span>
      </motion.div>
    </motion.button>
  );
};
