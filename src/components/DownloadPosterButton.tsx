import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Memory } from '@/types/memory';

interface DownloadPosterButtonProps {
  memories: Memory[];
  constellationName?: string;
}

const moodColors: Record<string, string> = {
  happy: '#FFD700',
  calm: '#87CEEB',
  nostalgic: '#DDA0DD',
};

export const DownloadPosterButton = ({ memories, constellationName }: DownloadPosterButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePoster = async () => {
    if (memories.length === 0) {
      toast.error('Add some memories first!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Poster dimensions (portrait, high quality)
      const width = 1080;
      const height = 1920;
      canvas.width = width;
      canvas.height = height;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.5, '#1a0a2e');
      gradient.addColorStop(1, '#0a1a2a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add scattered small stars in background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Calculate bounds and scale
      const padding = 150;
      const headerHeight = 200;
      const footerHeight = 150;
      const availableHeight = height - headerHeight - footerHeight - padding * 2;
      const availableWidth = width - padding * 2;

      const minX = Math.min(...memories.map(m => m.position.x));
      const maxX = Math.max(...memories.map(m => m.position.x));
      const minY = Math.min(...memories.map(m => m.position.y));
      const maxY = Math.max(...memories.map(m => m.position.y));

      const constellationWidth = maxX - minX || 1;
      const constellationHeight = maxY - minY || 1;

      const scale = Math.min(
        availableWidth / constellationWidth,
        availableHeight / constellationHeight
      ) * 0.8;

      const offsetX = padding + (availableWidth - constellationWidth * scale) / 2;
      const offsetY = headerHeight + padding + (availableHeight - constellationHeight * scale) / 2;

      // Draw constellation lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i < memories.length - 1; i++) {
        const from = memories[i];
        const to = memories[i + 1];
        const fromX = (from.position.x - minX) * scale + offsetX;
        const fromY = (from.position.y - minY) * scale + offsetY;
        const toX = (to.position.x - minX) * scale + offsetX;
        const toY = (to.position.y - minY) * scale + offsetY;
        
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw stars
      memories.forEach((memory, index) => {
        const x = (memory.position.x - minX) * scale + offsetX;
        const y = (memory.position.y - minY) * scale + offsetY;
        const color = moodColors[memory.mood] || '#ffffff';
        const size = 15 + (index % 3) * 5;

        // Glow effect
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        glowGradient.addColorStop(0, color + '80');
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Star shape
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const outerX = x + Math.cos(angle) * size;
          const outerY = y + Math.sin(angle) * size;
          if (i === 0) ctx.moveTo(outerX, outerY);
          else ctx.lineTo(outerX, outerY);
          
          const innerAngle = angle + Math.PI / 5;
          const innerX = x + Math.cos(innerAngle) * (size * 0.4);
          const innerY = y + Math.sin(innerAngle) * (size * 0.4);
          ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();

        // Center glow
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Header with constellation name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(constellationName || 'My Constellation', width / 2, 100);

      // Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '28px system-ui, sans-serif';
      ctx.fillText(`${memories.length} memories`, width / 2, 150);

      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '24px system-ui, sans-serif';
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      ctx.fillText(`Created ${date}`, width / 2, height - 80);

      // Decorative stars in footer
      ctx.fillText('✦', width / 2 - 150, height - 80);
      ctx.fillText('✦', width / 2 + 150, height - 80);

      // Download
      const link = document.createElement('a');
      link.download = `${(constellationName || 'constellation').replace(/\s+/g, '-').toLowerCase()}-poster.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Poster downloaded!');
    } catch (error) {
      console.error('Error generating poster:', error);
      toast.error('Failed to generate poster');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePoster}
      disabled={isGenerating || memories.length === 0}
      variant="outline"
      className="rounded-full gap-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Poster'}</span>
    </Button>
  );
};
