import { motion } from 'framer-motion';
import { Memory, Mood } from '@/types/memory';

interface StarProps {
  memory: Memory;
  onClick: () => void;
  index: number;
}

const getMoodColors = (mood: Mood): { fill: string; glow: string; shadow: string } => {
  switch (mood) {
    case 'happy':
      return { 
        fill: '#FFD700', 
        glow: 'drop-shadow(0 0 12px #FFD700) drop-shadow(0 0 24px #FFA500)',
        shadow: '0 0 20px #FFD700, 0 0 40px #FFA500, 0 0 60px #FF8C00'
      };
    case 'calm':
      return { 
        fill: '#00BFFF', 
        glow: 'drop-shadow(0 0 12px #00BFFF) drop-shadow(0 0 24px #1E90FF)',
        shadow: '0 0 20px #00BFFF, 0 0 40px #1E90FF, 0 0 60px #4169E1'
      };
    case 'nostalgic':
      return { 
        fill: '#DA70D6', 
        glow: 'drop-shadow(0 0 12px #DA70D6) drop-shadow(0 0 24px #BA55D3)',
        shadow: '0 0 20px #DA70D6, 0 0 40px #BA55D3, 0 0 60px #9932CC'
      };
    default:
      return { 
        fill: '#FFFFFF', 
        glow: 'drop-shadow(0 0 8px #FFFFFF)',
        shadow: '0 0 15px #FFFFFF'
      };
  }
};

// Generate varied sizes based on index
const getStarSize = (index: number): number => {
  const sizes = [28, 32, 24, 36, 30, 40, 26, 34, 38, 22];
  return sizes[index % sizes.length];
};

export const Star = ({ memory, onClick, index }: StarProps) => {
  const colors = getMoodColors(memory.mood);
  const size = getStarSize(index);
  const twinkleDelay = (index * 0.5) % 3;

  return (
    <motion.button
      className="absolute cursor-pointer group"
      style={{
        left: memory.position.x,
        top: memory.position.y,
        filter: colors.glow,
      }}
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: index * 0.08,
      }}
      whileHover={{ 
        scale: 1.4,
        filter: colors.glow + ' brightness(1.3)',
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.fill}40 0%, transparent 70%)`,
          width: size * 2.5,
          height: size * 2.5,
          left: -size * 0.75,
          top: -size * 0.75,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2 + twinkleDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Main star */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={colors.fill}
        style={{ 
          filter: 'brightness(1.2)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3 + twinkleDelay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: twinkleDelay,
        }}
      >
        <path d="M12 2L14.09 8.26L20.18 9.27L15.54 13.14L16.81 19.73L12 16.77L7.19 19.73L8.46 13.14L3.82 9.27L9.91 8.26L12 2Z" />
      </motion.svg>

      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: 'white',
          width: size * 0.25,
          height: size * 0.25,
          left: size * 0.375,
          top: size * 0.3,
          boxShadow: `0 0 ${size * 0.3}px white`,
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: twinkleDelay * 0.5,
        }}
      />
      
      {/* Hover tooltip */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover/95 backdrop-blur-sm rounded-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10"
        style={{ top: -size - 16 }}
        initial={{ y: 5 }}
        whileHover={{ y: 0 }}
      >
        <span className="text-sm font-medium text-foreground">{memory.title}</span>
      </motion.div>
    </motion.button>
  );
};
