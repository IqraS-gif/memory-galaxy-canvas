import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useConstellations } from '@/hooks/useConstellations';
import { Memory, Mood } from '@/types/memory';
import { MemoryModal } from '@/components/MemoryModal';
import { UploadModal } from '@/components/UploadModal';
import { TimelineView } from '@/components/TimelineView';
import { EmotionTimeline } from '@/components/EmotionTimeline';
import { BackgroundStars } from '@/components/BackgroundStars';
import { Controls } from '@/components/Controls';
import { AmbientSound } from '@/components/AmbientSound';
import { ConstellationCanvas } from '@/components/ConstellationCanvas';
import { Constellation3DView } from '@/components/Constellation3DView';
import { ConstellationSwitcher } from '@/components/ConstellationSwitcher';
import { CreateConstellationModal } from '@/components/CreateConstellationModal';
import { EmptyState } from '@/components/EmptyState';
import { PhotoBooth } from '@/components/PhotoBooth';
import { StatsView } from '@/components/StatsView';
import { AsteroidDodgeGame } from '@/components/AsteroidDodgeGame';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    constellations,
    memories,
    allMemories,
    activeConstellation,
    activeConstellationId,
    setActiveConstellationId,
    createConstellation,
    updateConstellationName,
    deleteConstellation,
    addMemory,
    removeMemory,
  } = useConstellations();
  
  const [backgroundStyle, setBackgroundStyle] = useState<'gradient' | 'nebula'>('gradient');

  const [view, setView] = useState<'constellation' | 'constellation3d' | 'timeline' | 'emotions' | 'stats'>('constellation');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateConstellationOpen, setIsCreateConstellationOpen] = useState(false);
  const [isPhotoBoothOpen, setIsPhotoBoothOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const handlePhotoBoothAddToConstellation = (imageUrl: string, mood: Mood) => {
    if (activeConstellationId) {
      addMemory('Photo Booth Memory', imageUrl, mood, activeConstellationId);
    }
  };

  const handleStarClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsMemoryModalOpen(true);
  };

  const handleUpload = (title: string, imageUrl: string, mood: Mood) => {
    if (activeConstellationId) {
      addMemory(title, imageUrl, mood, activeConstellationId);
    }
  };

  const handleBulkUpload = (images: { title: string; imageUrl: string; mood: Mood }[]) => {
    if (activeConstellationId) {
      images.forEach((img) => {
        addMemory(img.title, img.imageUrl, img.mood, activeConstellationId);
      });
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
    <div className={`fixed inset-0 overflow-hidden ${backgroundStyle === 'gradient' ? 'cosmic-bg' : 'nebula-bg'}`}>
      {/* Background stars */}
      <BackgroundStars />

      {/* Ambient sound toggle */}
      <AmbientSound />

      {/* Home button */}
      <Link to="/" className="fixed top-6 right-6 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-card/60 backdrop-blur-xl border border-border/50 hover:bg-card/80 hover:border-primary/30 transition-all"
        >
          <Home className="w-5 h-5 text-muted-foreground" />
        </Button>
      </Link>

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
            groupByMood={false}
            onStarClick={handleStarClick}
            constellationName={activeConstellation?.name}
          />
        ) : view === 'constellation3d' ? (
          <Constellation3DView
            key="constellation3d"
            memories={memories}
            onStarClick={handleStarClick}
          />
        ) : view === 'timeline' ? (
          <TimelineView
            key="timeline"
            memories={memories}
            onMemoryClick={handleStarClick}
          />
        ) : view === 'emotions' ? (
          <EmotionTimeline
            key="emotions"
            memories={memories}
            onMemoryClick={handleStarClick}
          />
        ) : (
          <StatsView
            key="stats"
            memories={memories}
            constellationName={activeConstellation?.name}
          />
        )}
      </AnimatePresence>

      {/* Controls */}
      <Controls
        view={view}
        onViewChange={setView}
        onAddClick={() => setIsUploadModalOpen(true)}
        onPhotoBoothClick={() => setIsPhotoBoothOpen(true)}
        onGameClick={() => setIsGameOpen(true)}
        memoryCount={memories.length}
        hasActiveConstellation={!!activeConstellation}
        backgroundStyle={backgroundStyle}
        onBackgroundStyleChange={setBackgroundStyle}
        memories={memories}
        constellationName={activeConstellation?.name}
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
        onBulkUpload={handleBulkUpload}
      />

      {/* Create constellation modal */}
      <CreateConstellationModal
        isOpen={isCreateConstellationOpen}
        onClose={() => setIsCreateConstellationOpen(false)}
        onCreate={handleCreateConstellation}
      />

      {/* Photo Booth */}
      <PhotoBooth
        isOpen={isPhotoBoothOpen}
        onClose={() => setIsPhotoBoothOpen(false)}
        onAddToConstellation={handlePhotoBoothAddToConstellation}
        hasActiveConstellation={!!activeConstellation}
      />

      {/* Asteroid Dodge Game */}
      <AsteroidDodgeGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />
    </div>
  );
};

export default Index;
