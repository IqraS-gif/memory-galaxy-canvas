import { useState, useEffect, useCallback } from 'react';
import { Memory, Mood, Constellation } from '@/types/memory';

const STORAGE_KEY = 'stellar-memories';
const CONSTELLATION_KEY = 'stellar-constellation';

const generateUniquePosition = (existingPositions: { x: number; y: number }[]): { x: number; y: number } => {
  const padding = 80;
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

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [constellationName, setConstellationName] = useState<string>('My Constellation');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedName = localStorage.getItem(CONSTELLATION_KEY);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMemories(parsed.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        })));
      } catch (e) {
        console.error('Failed to parse memories:', e);
      }
    }
    
    if (storedName) {
      setConstellationName(storedName);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    }
  }, [memories, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CONSTELLATION_KEY, constellationName);
    }
  }, [constellationName, isLoading]);

  const addMemory = useCallback((title: string, imageUrl: string, mood: Mood) => {
    const existingPositions = memories.map((m) => m.position);
    const position = generateUniquePosition(existingPositions);
    
    const newMemory: Memory = {
      id: crypto.randomUUID(),
      title,
      imageUrl,
      mood,
      createdAt: new Date(),
      position,
    };
    
    setMemories((prev) => [...prev, newMemory]);
    return newMemory;
  }, [memories]);

  const removeMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateConstellationName = useCallback((name: string) => {
    setConstellationName(name);
  }, []);

  return {
    memories,
    constellationName,
    isLoading,
    addMemory,
    removeMemory,
    updateConstellationName,
  };
};
