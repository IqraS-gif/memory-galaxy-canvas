import { motion } from 'framer-motion';
import { Memory, ConstellationPattern } from '@/types/memory';
import { Star } from '@/components/Star';
import { AnimatedConstellationLines } from '@/components/AnimatedConstellationLines';
import { ZoomControls } from '@/components/ZoomControls';
import { useZoomPan } from '@/hooks/useZoomPan';

interface ConstellationCanvasProps {
  memories: Memory[];
  pattern: ConstellationPattern;
  groupByMood: boolean;
  onStarClick: (memory: Memory) => void;
  constellationName?: string;
}

export const ConstellationCanvas = ({
  memories,
  pattern,
  groupByMood,
  onStarClick,
  constellationName,
}: ConstellationCanvasProps) => {
  const { transform, containerRef, handlers, resetTransform, zoomIn, zoomOut } = useZoomPan();

  return (
    <>
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
        {...handlers}
      >
        <motion.div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {/* Animated constellation lines */}
          <AnimatedConstellationLines
            memories={memories}
            pattern={pattern}
            groupByMood={groupByMood}
          />

          {/* Stars */}
          {memories.map((memory, index) => (
            <Star
              key={memory.id}
              memory={memory}
              onClick={() => onStarClick(memory)}
              index={index}
            />
          ))}

          {/* Constellation name label */}
          {constellationName && memories.length > 0 && (
            <div 
              className="absolute pointer-events-none"
              style={{
                left: `${Math.min(...memories.map(m => m.position.x)) - 5}%`,
                top: `${Math.min(...memories.map(m => m.position.y)) - 8}%`,
              }}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
                <span className="text-white/80 text-sm font-medium tracking-wide">
                  ✦ {constellationName}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Zoom Controls */}
      {memories.length > 0 && (
        <ZoomControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetTransform}
          scale={transform.scale}
        />
      )}
    </>
  );
};
