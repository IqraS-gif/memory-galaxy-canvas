import { useState, useEffect, useCallback } from 'react';
import { Memory, Mood, Constellation, ConstellationPattern } from '@/types/memory';
import { toast } from 'sonner';

const MEMORIES_KEY = 'stellar-memories';
const CONSTELLATIONS_KEY = 'stellar-constellations';
const ACTIVE_CONSTELLATION_KEY = 'stellar-active-constellation';

// Compress image to reduce storage size
const compressImage = (dataUrl: string, maxWidth: number = 400): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Compress to JPEG with lower quality
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

const generateUniquePosition = (existingPositions: { x: number; y: number }[]): { x: number; y: number } => {
  const padding = 120;
  const minDistance = 100;
  
  let attempts = 0;
  let position: { x: number; y: number };
  
  do {
    position = {
      x: padding + Math.random() * (window.innerWidth - padding * 2),
      y: padding + Math.random() * (window.innerHeight - padding * 2),
    };
    attempts++;
  } while (
    attempts < 50 &&
    existingPositions.some(
      (p) => Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) < minDistance
    )
  );
  
  return position;
};

const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      toast.error('Storage limit reached. Please delete some memories to add more.');
      return false;
    }
    console.error('Storage error:', e);
    return false;
  }
};

// Clear corrupted data on first load if needed
const clearCorruptedData = () => {
  try {
    const memories = localStorage.getItem(MEMORIES_KEY);
    if (memories) {
      JSON.parse(memories);
    }
  } catch {
    console.warn('Clearing corrupted localStorage data');
    localStorage.removeItem(MEMORIES_KEY);
    localStorage.removeItem(CONSTELLATIONS_KEY);
    localStorage.removeItem(ACTIVE_CONSTELLATION_KEY);
  }
};

// Initialize
clearCorruptedData();

// Default constellations with sample data
const DEFAULT_CONSTELLATIONS: Constellation[] = [
  {
    id: 'beach-2025',
    name: 'Beach 2025',
    pattern: 'aquarius',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'friendship-day-2025',
    name: 'Friendship Day 2025',
    pattern: 'gemini',
    createdAt: new Date('2025-08-03'),
  },
];

const DEFAULT_MEMORIES: Memory[] = [
  // Beach 2025 memories - wave pattern centered on screen
  {
    id: 'beach-1',
    title: 'Sunrise at the shore',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    mood: 'calm',
    createdAt: new Date('2025-01-15T06:30:00'),
    position: { x: 180, y: 180 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-2',
    title: 'Beach bonfire night',
    imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-01-15T20:00:00'),
    position: { x: 320, y: 140 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-3',
    title: 'Sandcastle fun',
    imageUrl: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&h=300&fit=crop',
    mood: 'nostalgic',
    createdAt: new Date('2025-01-16T14:00:00'),
    position: { x: 480, y: 200 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-4',
    title: 'Ocean waves',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
    mood: 'calm',
    createdAt: new Date('2025-01-16T10:00:00'),
    position: { x: 640, y: 150 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-5',
    title: 'Sunset paradise',
    imageUrl: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-01-17T18:30:00'),
    position: { x: 800, y: 220 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-6',
    title: 'Seashell collection',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=300&fit=crop',
    mood: 'calm',
    createdAt: new Date('2025-01-17T11:00:00'),
    position: { x: 950, y: 160 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-7',
    title: 'Palm tree vibes',
    imageUrl: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-01-18T15:00:00'),
    position: { x: 400, y: 320 },
    constellationId: 'beach-2025',
  },
  {
    id: 'beach-8',
    title: 'Beach hammock',
    imageUrl: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=400&h=300&fit=crop',
    mood: 'calm',
    createdAt: new Date('2025-01-18T16:00:00'),
    position: { x: 720, y: 340 },
    constellationId: 'beach-2025',
  },
  // Friendship Day 2025 memories - heart shape centered
  {
    id: 'friends-1',
    title: 'Best friends forever',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-08-03T12:00:00'),
    position: { x: 560, y: 120 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-2',
    title: 'Squad goals',
    imageUrl: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-08-03T14:00:00'),
    position: { x: 400, y: 180 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-3',
    title: 'Hugs and smiles',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400&h=300&fit=crop',
    mood: 'calm',
    createdAt: new Date('2025-08-03T16:00:00'),
    position: { x: 720, y: 180 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-4',
    title: 'Coffee dates',
    imageUrl: 'https://images.unsplash.com/photo-1524601500432-1e1a4c71d692?w=400&h=300&fit=crop',
    mood: 'nostalgic',
    createdAt: new Date('2025-08-03T18:00:00'),
    position: { x: 280, y: 260 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-5',
    title: 'Adventure time',
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-08-03T21:00:00'),
    position: { x: 840, y: 260 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-6',
    title: 'Sunset walks',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    mood: 'calm',
    createdAt: new Date('2025-08-03T19:00:00'),
    position: { x: 340, y: 350 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-7',
    title: 'Road trip crew',
    imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-08-04T10:00:00'),
    position: { x: 780, y: 350 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-8',
    title: 'Picnic memories',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
    mood: 'nostalgic',
    createdAt: new Date('2025-08-04T12:00:00'),
    position: { x: 440, y: 420 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-9',
    title: 'Dance party',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&h=300&fit=crop',
    mood: 'happy',
    createdAt: new Date('2025-08-04T22:00:00'),
    position: { x: 680, y: 420 },
    constellationId: 'friendship-day-2025',
  },
  {
    id: 'friends-10',
    title: 'Forever grateful',
    imageUrl: 'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=400&h=300&fit=crop',
    mood: 'nostalgic',
    createdAt: new Date('2025-08-04T23:00:00'),
    position: { x: 560, y: 500 },
    constellationId: 'friendship-day-2025',
  },
];

export const useConstellations = () => {
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeConstellationId, setActiveConstellationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage or use defaults
  useEffect(() => {
    const storedConstellations = localStorage.getItem(CONSTELLATIONS_KEY);
    const storedMemories = localStorage.getItem(MEMORIES_KEY);
    const storedActiveId = localStorage.getItem(ACTIVE_CONSTELLATION_KEY);
    
    let loadedConstellations: Constellation[] = [];
    let loadedMemories: Memory[] = [];
    
    if (storedConstellations) {
      try {
        const parsed = JSON.parse(storedConstellations);
        loadedConstellations = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
      } catch (e) {
        console.error('Failed to parse constellations:', e);
        localStorage.removeItem(CONSTELLATIONS_KEY);
      }
    }
    
    if (storedMemories) {
      try {
        const parsed = JSON.parse(storedMemories);
        loadedMemories = parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        }));
      } catch (e) {
        console.error('Failed to parse memories:', e);
        localStorage.removeItem(MEMORIES_KEY);
      }
    }
    
    // Add default constellations if they don't exist
    const hasBeach = loadedConstellations.some(c => c.id === 'beach-2025');
    const hasFriendship = loadedConstellations.some(c => c.id === 'friendship-day-2025');
    
    if (!hasBeach) {
      loadedConstellations.push(DEFAULT_CONSTELLATIONS[0]);
      loadedMemories.push(...DEFAULT_MEMORIES.filter(m => m.constellationId === 'beach-2025'));
    }
    
    if (!hasFriendship) {
      loadedConstellations.push(DEFAULT_CONSTELLATIONS[1]);
      loadedMemories.push(...DEFAULT_MEMORIES.filter(m => m.constellationId === 'friendship-day-2025'));
    }
    
    setConstellations(loadedConstellations);
    setMemories(loadedMemories);
    
    if (storedActiveId && loadedConstellations.some(c => c.id === storedActiveId)) {
      setActiveConstellationId(storedActiveId);
    } else if (loadedConstellations.length > 0) {
      setActiveConstellationId(loadedConstellations[0].id);
    }
    
    setIsLoading(false);
  }, []);

  // Save constellations
  useEffect(() => {
    if (!isLoading) {
      safeSetItem(CONSTELLATIONS_KEY, JSON.stringify(constellations));
    }
  }, [constellations, isLoading]);

  // Save memories
  useEffect(() => {
    if (!isLoading) {
      safeSetItem(MEMORIES_KEY, JSON.stringify(memories));
    }
  }, [memories, isLoading]);

  // Save active constellation
  useEffect(() => {
    if (!isLoading && activeConstellationId) {
      safeSetItem(ACTIVE_CONSTELLATION_KEY, activeConstellationId);
    }
  }, [activeConstellationId, isLoading]);

  const activeConstellation = constellations.find(c => c.id === activeConstellationId) || null;
  const activeMemories = memories.filter(m => m.constellationId === activeConstellationId);

  const createConstellation = useCallback((name: string, pattern: ConstellationPattern) => {
    const newConstellation: Constellation = {
      id: crypto.randomUUID(),
      name,
      pattern,
      createdAt: new Date(),
    };
    
    setConstellations(prev => [...prev, newConstellation]);
    setActiveConstellationId(newConstellation.id);
    return newConstellation;
  }, []);

  const updateConstellationName = useCallback((id: string, name: string) => {
    setConstellations(prev => prev.map(c => 
      c.id === id ? { ...c, name } : c
    ));
  }, []);

  const deleteConstellation = useCallback((id: string) => {
    setConstellations(prev => prev.filter(c => c.id !== id));
    setMemories(prev => prev.filter(m => m.constellationId !== id));
    if (activeConstellationId === id) {
      const remaining = constellations.filter(c => c.id !== id);
      setActiveConstellationId(remaining.length > 0 ? remaining[0].id : null);
    }
  }, [activeConstellationId, constellations]);

  const addMemory = useCallback(async (title: string, imageUrl: string, mood: Mood, constellationId: string) => {
    // Compress image before storing
    const compressedImage = await compressImage(imageUrl);
    
    const existingPositions = memories
      .filter(m => m.constellationId === constellationId)
      .map(m => m.position);
    const position = generateUniquePosition(existingPositions);
    
    const newMemory: Memory = {
      id: crypto.randomUUID(),
      title,
      imageUrl: compressedImage,
      mood,
      createdAt: new Date(),
      position,
      constellationId,
    };
    
    setMemories(prev => [...prev, newMemory]);
    return newMemory;
  }, [memories]);

  const removeMemory = useCallback((id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.removeItem(MEMORIES_KEY);
    localStorage.removeItem(CONSTELLATIONS_KEY);
    localStorage.removeItem(ACTIVE_CONSTELLATION_KEY);
    setMemories([]);
    setConstellations([]);
    setActiveConstellationId(null);
    toast.success('All data cleared');
  }, []);

  const getMemoriesByMood = useCallback((mood: Mood) => {
    return activeMemories.filter(m => m.mood === mood);
  }, [activeMemories]);

  return {
    constellations,
    memories: activeMemories,
    allMemories: memories,
    activeConstellation,
    activeConstellationId,
    isLoading,
    setActiveConstellationId,
    createConstellation,
    updateConstellationName,
    deleteConstellation,
    addMemory,
    removeMemory,
    getMemoriesByMood,
    clearAllData,
  };
};
