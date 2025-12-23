import { Memory, Mood, ConstellationPattern } from '@/types/memory';

// Constellation patterns defined as relative connections
export const patternConnections: Record<ConstellationPattern, number[][]> = {
  auto: [], // Dynamic based on creation order
  capricorn: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [3, 8], [8, 9]],
  aries: [[0, 1], [1, 2], [2, 3]],
  taurus: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6]],
  gemini: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 6], [6, 7]],
  cancer: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]],
  leo: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [3, 7], [7, 8]],
  virgo: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [3, 7], [7, 8], [8, 9]],
  libra: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 4], [4, 5]],
  scorpio: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  sagittarius: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [6, 7], [5, 8]],
  aquarius: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
  pisces: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5], [5, 6], [6, 7], [7, 8], [8, 5]],
  orion: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5], [5, 6], [2, 7], [7, 8]],
  'ursa-major': [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  'ursa-minor': [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
};

// Mood cluster region definitions (areas of the screen for each mood)
const moodRegions: Record<Mood, { centerX: number; centerY: number; radius: number }> = {
  happy: { centerX: 0.25, centerY: 0.35, radius: 0.25 },
  calm: { centerX: 0.75, centerY: 0.35, radius: 0.25 },
  nostalgic: { centerX: 0.5, centerY: 0.7, radius: 0.25 },
};

export interface MemoryCluster {
  mood: Mood;
  memories: Memory[];
  centroid: { x: number; y: number };
  label: string;
}

const moodLabels: Record<Mood, string> = {
  happy: '☀️ Happy Memories',
  calm: '🌊 Calm Moments',
  nostalgic: '💜 Nostalgic Times',
};

export const groupMemoriesByMood = (memories: Memory[]): MemoryCluster[] => {
  const moodGroups: Record<Mood, Memory[]> = {
    happy: [],
    calm: [],
    nostalgic: [],
  };

  memories.forEach((memory) => {
    moodGroups[memory.mood].push(memory);
  });

  return Object.entries(moodGroups)
    .filter(([, mems]) => mems.length > 0)
    .map(([mood, mems]) => {
      // Calculate actual centroid from memory positions
      const centroid = {
        x: mems.reduce((sum, m) => sum + m.position.x, 0) / mems.length,
        y: mems.reduce((sum, m) => sum + m.position.y, 0) / mems.length,
      };
      return {
        mood: mood as Mood,
        memories: mems,
        centroid,
        label: moodLabels[mood as Mood],
      };
    });
};

// Get position for a memory when grouping by mood
export const getClusteredPosition = (
  mood: Mood,
  index: number,
  total: number
): { x: number; y: number } => {
  const region = moodRegions[mood];
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  // Spiral arrangement within cluster
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + (index * 0.5);
  const distance = 60 + (index * 30) % 100;
  
  return {
    x: region.centerX * width + Math.cos(angle) * distance,
    y: region.centerY * height + Math.sin(angle) * distance,
  };
};

export const getConnectionsForPattern = (
  pattern: ConstellationPattern,
  memories: Memory[],
  groupByMood: boolean
): { from: Memory; to: Memory }[] => {
  const connections: { from: Memory; to: Memory }[] = [];

  if (groupByMood) {
    // Group by mood and create mini-constellations
    const clusters = groupMemoriesByMood(memories);
    
    clusters.forEach((cluster) => {
      const clusterMemories = [...cluster.memories].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (pattern === 'auto') {
        // Auto: connect in creation order within each mood cluster
        for (let i = 0; i < clusterMemories.length - 1; i++) {
          connections.push({
            from: clusterMemories[i],
            to: clusterMemories[i + 1],
          });
        }
        // Close the loop if enough memories
        if (clusterMemories.length >= 3) {
          connections.push({
            from: clusterMemories[clusterMemories.length - 1],
            to: clusterMemories[0],
          });
        }
      } else {
        // Use pattern connections within cluster
        const patternConns = patternConnections[pattern];
        patternConns.forEach(([fromIdx, toIdx]) => {
          if (fromIdx < clusterMemories.length && toIdx < clusterMemories.length) {
            connections.push({
              from: clusterMemories[fromIdx],
              to: clusterMemories[toIdx],
            });
          }
        });
      }
    });
  } else {
    // No grouping - treat all memories as one constellation
    const sortedMemories = [...memories].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (pattern === 'auto') {
      for (let i = 0; i < sortedMemories.length - 1; i++) {
        connections.push({
          from: sortedMemories[i],
          to: sortedMemories[i + 1],
        });
      }
    } else {
      const patternConns = patternConnections[pattern];
      patternConns.forEach(([fromIdx, toIdx]) => {
        if (fromIdx < sortedMemories.length && toIdx < sortedMemories.length) {
          connections.push({
            from: sortedMemories[fromIdx],
            to: sortedMemories[toIdx],
          });
        }
      });
    }
  }

  return connections;
};

export const getMoodColor = (mood: Mood): string => {
  const colors: Record<Mood, string> = {
    happy: '255, 215, 0', // Golden yellow
    calm: '100, 149, 237', // Cornflower blue
    nostalgic: '186, 85, 211', // Medium orchid
  };
  return colors[mood];
};
