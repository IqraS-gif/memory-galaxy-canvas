import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMemories } from '@/hooks/useMemories';
import { Memory, Mood } from '@/types/memory';
import { Star } from '@/components/Star';
import { ConstellationLines } from '@/components/ConstellationLines';
import { MemoryModal } from '@/components/MemoryModal';
import { UploadModal } from '@/components/UploadModal';
import { TimelineView } from '@/components/TimelineView';
import { BackgroundStars } from '@/components/BackgroundStars';
import { ConstellationName } from '@/components/ConstellationName';
import { Controls } from '@/components/Controls';
import { EmptyState } from '@/components/EmptyState';

const Index = () => {
  const {
    memories,
    constellationName,
    addMemory,
    removeMemory,
    updateConstellationName,
  } = useMemories();

  const [view, setView] = useState<'constellation' | 'timeline'>('constellation');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleStarClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsMemoryModalOpen(true);
  };

  const handleUpload = (title: string, imageUrl: string, mood: Mood) => {
    addMemory(title, imageUrl, mood);
  };

  const handleDelete = (id: string) => {
    removeMemory(id);
  };

  return (
    <div className="fixed inset-0 cosmic-bg overflow-hidden">
      {/* Background stars */}
      <BackgroundStars />

      {/* Constellation name */}
      <ConstellationName name={constellationName} onNameChange={updateConstellationName} />

      {/* Main content area */}
      <AnimatePresence mode="wait">
        {view === 'constellation' ? (
          <div key="constellation" className="absolute inset-0">
            {/* Constellation lines */}
            <ConstellationLines memories={memories} />

            {/* Stars */}
            {memories.map((memory, index) => (
              <Star
                key={memory.id}
                memory={memory}
                onClick={() => handleStarClick(memory)}
                index={index}
              />
            ))}

            {/* Empty state */}
            {memories.length === 0 && <EmptyState />}
          </div>
        ) : (
          <TimelineView
            key="timeline"
            memories={memories}
            onMemoryClick={handleStarClick}
          />
        )}
      </AnimatePresence>

      {/* Controls */}
      <Controls
        view={view}
        onViewChange={setView}
        onAddClick={() => setIsUploadModalOpen(true)}
        memoryCount={memories.length}
      />

      {/* Memory detail modal */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={isMemoryModalOpen}
        onClose={() => {
          setIsMemoryModalOpen(false);
          setSelectedMemory(null);
        }}
        onDelete={handleDelete}
      />

      {/* Upload modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Index;
