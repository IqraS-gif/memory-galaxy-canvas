import { useEffect, useRef, useState } from 'react';
import { Memory, Mood } from '@/types/memory';
import { ConstellationPattern } from '@/components/ConstellationPatternSelector';
import { getConnectionsForPattern, getMoodColor, groupMemoriesByMood } from '@/utils/constellationPatterns';

interface AnimatedConstellationLinesProps {
  memories: Memory[];
  pattern: ConstellationPattern;
  groupByMood: boolean;
}

interface AnimatedLine {
  from: { x: number; y: number };
  to: { x: number; y: number };
  mood: Mood;
  progress: number;
  glowIntensity: number;
}

export const AnimatedConstellationLines = ({
  memories,
  pattern,
  groupByMood,
}: AnimatedConstellationLinesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [lines, setLines] = useState<AnimatedLine[]>([]);
  const progressRef = useRef<number[]>([]);
  const glowPhaseRef = useRef<number>(0);

  // Update lines when memories or pattern changes
  useEffect(() => {
    const connections = getConnectionsForPattern(pattern, memories, groupByMood);
    
    const newLines = connections.map((conn) => ({
      from: { x: conn.from.position.x + 12, y: conn.from.position.y + 12 },
      to: { x: conn.to.position.x + 12, y: conn.to.position.y + 12 },
      mood: conn.from.mood,
      progress: 0,
      glowIntensity: 0.5,
    }));

    // Initialize progress for each line
    progressRef.current = newLines.map((_, i) => Math.min(1, (Date.now() - i * 100) / 1000));
    setLines(newLines);
  }, [memories, pattern, groupByMood]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      glowPhaseRef.current += 0.02;

      lines.forEach((line, index) => {
        // Animate progress
        if (progressRef.current[index] < 1) {
          progressRef.current[index] = Math.min(1, progressRef.current[index] + 0.02);
        }

        const progress = progressRef.current[index];
        if (progress <= 0) return;

        const moodColor = getMoodColor(line.mood);
        const glowIntensity = 0.3 + Math.sin(glowPhaseRef.current + index * 0.5) * 0.2;

        // Calculate current end point based on progress
        const currentX = line.from.x + (line.to.x - line.from.x) * progress;
        const currentY = line.from.y + (line.to.y - line.from.y) * progress;

        // Draw outer glow
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${moodColor}, ${glowIntensity * 0.3})`;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${moodColor}, ${glowIntensity})`;
        ctx.shadowBlur = 20;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw middle glow
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${moodColor}, ${glowIntensity * 0.5})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw main line
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${moodColor}, ${0.6 + glowIntensity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw core bright line
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw animated particles along the line if still forming
        if (progress < 1) {
          const particleX = currentX;
          const particleY = currentY;
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${0.8})`;
          ctx.shadowColor = `rgba(${moodColor}, 1)`;
          ctx.shadowBlur = 15;
          ctx.arc(particleX, particleY, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Reset shadow for next iteration
        ctx.shadowBlur = 0;
      });

      // Draw cluster boundaries if grouping by mood
      if (groupByMood) {
        const clusters = groupMemoriesByMood(memories);
        clusters.forEach((cluster) => {
          if (cluster.memories.length < 2) return;
          
          const moodColor = getMoodColor(cluster.mood);
          const glowIntensity = 0.1 + Math.sin(glowPhaseRef.current * 0.5) * 0.05;
          
          // Draw subtle cluster boundary
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${moodColor}, ${glowIntensity})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 10]);
          
          // Simple bounding ellipse around cluster centroid
          const maxDist = Math.max(
            ...cluster.memories.map(m => 
              Math.sqrt(
                Math.pow(m.position.x + 12 - cluster.centroid.x - 12, 2) + 
                Math.pow(m.position.y + 12 - cluster.centroid.y - 12, 2)
              )
            )
          ) + 40;
          
          ctx.ellipse(
            cluster.centroid.x + 12,
            cluster.centroid.y + 12,
            maxDist,
            maxDist * 0.8,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lines, memories, groupByMood]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
};
