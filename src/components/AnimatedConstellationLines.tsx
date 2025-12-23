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
  const particlesRef = useRef<{ x: number; y: number; progress: number; lineIndex: number }[]>([]);

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

    // Initialize progress for each line (staggered animation)
    progressRef.current = newLines.map(() => 0);
    particlesRef.current = newLines.map((_, i) => ({
      x: 0,
      y: 0,
      progress: 0,
      lineIndex: i,
    }));
    setLines(newLines);
  }, [memories, pattern, groupByMood]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      glowPhaseRef.current += 0.02;

      // Draw cluster labels and boundaries when grouping by mood
      if (groupByMood) {
        const clusters = groupMemoriesByMood(memories);
        clusters.forEach((cluster) => {
          if (cluster.memories.length < 1) return;
          
          const moodColor = getMoodColor(cluster.mood);
          const pulseIntensity = 0.15 + Math.sin(glowPhaseRef.current * 0.5) * 0.05;
          
          // Draw cluster boundary
          if (cluster.memories.length >= 2) {
            const positions = cluster.memories.map(m => ({ x: m.position.x + 12, y: m.position.y + 12 }));
            const minX = Math.min(...positions.map(p => p.x)) - 50;
            const maxX = Math.max(...positions.map(p => p.x)) + 50;
            const minY = Math.min(...positions.map(p => p.y)) - 50;
            const maxY = Math.max(...positions.map(p => p.y)) + 50;
            
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const radiusX = (maxX - minX) / 2 + 30;
            const radiusY = (maxY - minY) / 2 + 30;

            // Gradient background for cluster
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(radiusX, radiusY));
            gradient.addColorStop(0, `rgba(${moodColor}, ${pulseIntensity * 0.2})`);
            gradient.addColorStop(0.7, `rgba(${moodColor}, ${pulseIntensity * 0.05})`);
            gradient.addColorStop(1, `rgba(${moodColor}, 0)`);
            
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.fill();

            // Dotted boundary
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${moodColor}, ${pulseIntensity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([8, 12]);
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Cluster label
            ctx.font = '14px "Space Grotesk", sans-serif';
            ctx.fillStyle = `rgba(${moodColor}, 0.7)`;
            ctx.textAlign = 'center';
            ctx.fillText(cluster.label, centerX, minY - 15);
          }
        });
      }

      lines.forEach((line, index) => {
        // Staggered line animation
        const lineDelay = index * 300; // 300ms delay between each line
        const lineElapsed = elapsed - lineDelay;
        
        if (lineElapsed < 0) return;
        
        const progress = Math.min(1, lineElapsed / 1000); // 1 second per line
        progressRef.current[index] = progress;

        if (progress <= 0) return;

        const moodColor = getMoodColor(line.mood);
        const glowIntensity = 0.4 + Math.sin(glowPhaseRef.current + index * 0.5) * 0.3;

        // Calculate current end point based on progress
        const currentX = line.from.x + (line.to.x - line.from.x) * progress;
        const currentY = line.from.y + (line.to.y - line.from.y) * progress;

        // Draw outer glow (strongest)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${moodColor}, ${glowIntensity * 0.2})`;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${moodColor}, ${glowIntensity})`;
        ctx.shadowBlur = 30;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw middle glow
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${moodColor}, ${glowIntensity * 0.4})`;
        ctx.lineWidth = 6;
        ctx.shadowBlur = 20;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw main line
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${moodColor}, ${0.7 + glowIntensity * 0.3})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw core bright line
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Animated energy particle traveling along line (while forming)
        if (progress < 1) {
          // Leading particle
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
          ctx.shadowColor = `rgba(${moodColor}, 1)`;
          ctx.shadowBlur = 25;
          ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Inner glow
          ctx.beginPath();
          ctx.fillStyle = `rgba(${moodColor}, 0.8)`;
          ctx.shadowBlur = 15;
          ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Trailing sparkles
          for (let i = 1; i <= 3; i++) {
            const trailProgress = Math.max(0, progress - (i * 0.05));
            const trailX = line.from.x + (line.to.x - line.from.x) * trailProgress;
            const trailY = line.from.y + (line.to.y - line.from.y) * trailProgress;
            const trailOpacity = 0.6 - (i * 0.15);
            const trailSize = 3 - (i * 0.5);

            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
            ctx.shadowBlur = 10;
            ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Reset shadow for next iteration
        ctx.shadowBlur = 0;
      });

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
