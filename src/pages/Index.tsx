import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useConstellations } from '@/hooks/useConstellations';
import { useConstellationSettings } from '@/hooks/useConstellationSettings';
import { Memory, Mood } from '@/types/memory';
import { MemoryModal } from '@/components/MemoryModal';
import { UploadModal } from '@/components/UploadModal';
import { TimelineView } from '@/components/TimelineView';
import { EmotionTimeline } from '@/components/EmotionTimeline';
import { BackgroundStars } from '@/components/BackgroundStars';
import { Controls } from '@/components/Controls';
import { AmbientSound } from '@/components/AmbientSound';
import { ConstellationCanvas } from '@/components/ConstellationCanvas';
import { ConstellationSwitcher } from '@/components/ConstellationSwitcher';
import { CreateConstellationModal } from '@/components/CreateConstellationModal';
import { EmptyState } from '@/components/EmptyState';

const Index = () => {
  const {
    constellations,
    memories,
    activeConstellation,
    activeConstellationId,
    setActiveConstellationId,
    createConstellation,
    updateConstellationName,
    deleteConstellation,
    addMemory,
    removeMemory,
  } = useConstellations();

  const { groupByMood, setGroupByMood } = useConstellationSettings();

  const [view, setView] = useState<'constellation' | 'timeline' | 'emotions'>('constellation');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateConstellationOpen, setIsCreateConstellationOpen] = useState(false);

  const handleStarClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsMemoryModalOpen(true);
  };

  const handleUpload = (title: string, imageUrl: string, mood: Mood) => {
    if (activeConstellationId) {
      addMemory(title, imageUrl, mood, activeConstellationId);
    }
  };

  const handleDelete = (id: string) => {
    removeMemory(id);
  };

  const handleCreateConstellation = (name: string, pattern: any) => {
    createConstellation(name, pattern);
  };

  const pattern = activeConstellation?.pattern || 'auto';

  return (
    <div className="fixed inset-0 cosmic-bg overflow-hidden">
      {/* Background stars */}
      <BackgroundStars />

      {/* Ambient sound toggle */}
      <AmbientSound />

      {/* Constellation Switcher */}
      <div className="fixed top-6 left-6 z-30">
        <ConstellationSwitcher
          constellations={constellations}
          activeConstellation={activeConstellation}
          onSelect={setActiveConstellationId}
          onCreateNew={() => setIsCreateConstellationOpen(true)}
          onDelete={deleteConstellation}
          onNameChange={updateConstellationName}
        />
      </div>

      {/* Main content area */}
      <AnimatePresence mode="wait">
        {!activeConstellation ? (
          <EmptyState 
            key="empty"
            onCreateConstellation={() => setIsCreateConstellationOpen(true)} 
          />
        ) : view === 'constellation' ? (
          <ConstellationCanvas
            key="constellation"
            memories={memories}
            pattern={pattern}
            groupByMood={groupByMood}
            onStarClick={handleStarClick}
          />
        ) : view === 'timeline' ? (
          <TimelineView
            key="timeline"
            memories={memories}
            onMemoryClick={handleStarClick}
          />
        ) : (
          <EmotionTimeline
            key="emotions"
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
        onToggleClusters={() => setGroupByMood(!groupByMood)}
        groupByMood={groupByMood}
        memoryCount={memories.length}
        hasActiveConstellation={!!activeConstellation}
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

      {/* Create constellation modal */}
      <CreateConstellationModal
        isOpen={isCreateConstellationOpen}
        onClose={() => setIsCreateConstellationOpen(false)}
        onCreate={handleCreateConstellation}
      />
    </div>
  );
};

export default Index;
