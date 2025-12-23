import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMemories } from '@/hooks/useMemories';
import { useConstellationSettings } from '@/hooks/useConstellationSettings';
import { Memory, Mood } from '@/types/memory';
import { MemoryModal } from '@/components/MemoryModal';
import { UploadModal } from '@/components/UploadModal';
import { TimelineView } from '@/components/TimelineView';
import { BackgroundStars } from '@/components/BackgroundStars';
import { ConstellationName } from '@/components/ConstellationName';
import { Controls } from '@/components/Controls';
import { AmbientSound } from '@/components/AmbientSound';
import { ConstellationPatternSelector } from '@/components/ConstellationPatternSelector';
import { ConstellationCanvas } from '@/components/ConstellationCanvas';

const Index = () => {
  const {
    memories,
    constellationName,
    addMemory,
    removeMemory,
    updateConstellationName,
  } = useMemories();

  const {
    pattern,
    groupByMood,
    setPattern,
    setGroupByMood,
  } = useConstellationSettings();

  const [view, setView] = useState<'constellation' | 'timeline'>('constellation');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPatternSelectorOpen, setIsPatternSelectorOpen] = useState(false);

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

      {/* Ambient sound toggle */}
      <AmbientSound />

      {/* Constellation name */}
      <ConstellationName name={constellationName} onNameChange={updateConstellationName} />

      {/* Main content area */}
      <AnimatePresence mode="wait">
        {view === 'constellation' ? (
          <ConstellationCanvas
            key="constellation"
            memories={memories}
            pattern={pattern}
            groupByMood={groupByMood}
            onStarClick={handleStarClick}
          />
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
        onPatternClick={() => setIsPatternSelectorOpen(true)}
        onToggleClusters={() => setGroupByMood(!groupByMood)}
        groupByMood={groupByMood}
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

      {/* Pattern selector modal */}
      <ConstellationPatternSelector
        isOpen={isPatternSelectorOpen}
        onClose={() => setIsPatternSelectorOpen(false)}
        currentPattern={pattern}
        onPatternSelect={setPattern}
      />
    </div>
  );
};

export default Index;
