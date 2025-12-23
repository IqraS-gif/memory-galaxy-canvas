import { useState, useEffect, useCallback } from 'react';
import { Memory, Mood, Constellation, ConstellationPattern } from '@/types/memory';

const MEMORIES_KEY = 'stellar-memories';
const CONSTELLATIONS_KEY = 'stellar-constellations';
const ACTIVE_CONSTELLATION_KEY = 'stellar-active-constellation';

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

export const useConstellations = () => {
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeConstellationId, setActiveConstellationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const storedConstellations = localStorage.getItem(CONSTELLATIONS_KEY);
    const storedMemories = localStorage.getItem(MEMORIES_KEY);
    const storedActiveId = localStorage.getItem(ACTIVE_CONSTELLATION_KEY);
    
    if (storedConstellations) {
      try {
        const parsed = JSON.parse(storedConstellations);
        setConstellations(parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })));
      } catch (e) {
        console.error('Failed to parse constellations:', e);
      }
    }
    
    if (storedMemories) {
      try {
        const parsed = JSON.parse(storedMemories);
        setMemories(parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        })));
      } catch (e) {
        console.error('Failed to parse memories:', e);
      }
    }
    
    if (storedActiveId) {
      setActiveConstellationId(storedActiveId);
    }
    
    setIsLoading(false);
  }, []);

  // Save constellations
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CONSTELLATIONS_KEY, JSON.stringify(constellations));
    }
  }, [constellations, isLoading]);

  // Save memories
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
    }
  }, [memories, isLoading]);

  // Save active constellation
  useEffect(() => {
    if (!isLoading && activeConstellationId) {
      localStorage.setItem(ACTIVE_CONSTELLATION_KEY, activeConstellationId);
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

  const addMemory = useCallback((title: string, imageUrl: string, mood: Mood, constellationId: string) => {
    const existingPositions = memories
      .filter(m => m.constellationId === constellationId)
      .map(m => m.position);
    const position = generateUniquePosition(existingPositions);
    
    const newMemory: Memory = {
      id: crypto.randomUUID(),
      title,
      imageUrl,
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
  };
};
