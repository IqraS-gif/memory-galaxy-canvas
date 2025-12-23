export type Mood = 'happy' | 'calm' | 'nostalgic';

export type ConstellationPattern = 
  | 'auto' 
  | 'aries' 
  | 'taurus' 
  | 'gemini' 
  | 'cancer' 
  | 'leo' 
  | 'virgo' 
  | 'libra' 
  | 'scorpio' 
  | 'sagittarius' 
  | 'capricorn' 
  | 'aquarius' 
  | 'pisces'
  | 'orion'
  | 'ursa-major'
  | 'ursa-minor';

export interface Memory {
  id: string;
  title: string;
  imageUrl: string;
  mood: Mood;
  createdAt: Date;
  position: {
    x: number;
    y: number;
  };
  constellationId: string;
}

export interface Constellation {
  id: string;
  name: string;
  pattern: ConstellationPattern;
  createdAt: Date;
}
