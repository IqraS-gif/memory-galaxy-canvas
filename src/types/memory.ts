export type Mood = 'happy' | 'calm' | 'nostalgic';

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
}

export interface Constellation {
  id: string;
  name: string;
  memories: Memory[];
  createdAt: Date;
}
