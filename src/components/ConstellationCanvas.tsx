import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Memory, ConstellationPattern, Constellation } from '@/types/memory';
import { Star } from '@/components/Star';
import { AnimatedConstellationLines } from '@/components/AnimatedConstellationLines';
import { ZoomControls } from '@/components/ZoomControls';
import { useZoomPan } from '@/hooks/useZoomPan';

interface ConstellationCanvasProps {
  memories: Memory[];
  constellations: Constellation[];
  activeConstellationId: string | null;
  pattern: ConstellationPattern;
  groupByMood: boolean;
  onStarClick: (memory: Memory) => void;
}

export const ConstellationCanvas = ({
  memories,
  constellations,
  activeConstellationId,
  pattern,
  groupByMood,
  onStarClick,
}: ConstellationCanvasProps) => {
  const { transform, containerRef, handlers, resetTransform, zoomIn, zoomOut } = useZoomPan();

  // Group memories by constellation
  const memoriesByConstellation = useMemo(() => {
    const grouped: Record<string, Memory[]> = {};
    memories.forEach(memory => {
      if (!grouped[memory.constellationId]) {
        grouped[memory.constellationId] = [];
      }
      grouped[memory.constellationId].push(memory);
    });
    return grouped;
  }, [memories]);

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
          {/* Render all constellations */}
          {constellations.map(constellation => {
            const constellationMemories = memoriesByConstellation[constellation.id] || [];
            const isActive = constellation.id === activeConstellationId;
            
            return (
              <div 
                key={constellation.id}
                style={{ opacity: isActive ? 1 : 0.4 }}
                className="transition-opacity duration-300"
              >
                {/* Animated constellation lines */}
                <AnimatedConstellationLines
                  memories={constellationMemories}
                  pattern={constellation.pattern || 'auto'}
                  groupByMood={groupByMood}
                />

                {/* Stars */}
                {constellationMemories.map((memory, index) => (
                  <Star
                    key={memory.id}
                    memory={memory}
                    onClick={() => onStarClick(memory)}
                    index={index}
                  />
                ))}
              </div>
            );
          })}
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
