import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, ChevronUp } from 'lucide-react';

type SoundType = 'space' | 'ocean' | 'fairy' | 'love' | 'cosmic';

interface SoundOption {
  id: SoundType;
  label: string;
  emoji: string;
  description: string;
  url: string;
}

const soundOptions: SoundOption[] = [
  {
    id: 'space',
    label: 'Deep Space',
    emoji: '🌌',
    description: 'Cosmic ambient drone',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
  },
  {
    id: 'ocean',
    label: 'Ocean Calm',
    emoji: '🌊',
    description: 'Peaceful sea waves',
    url: 'https://cdn.pixabay.com/audio/2024/11/11/audio_2d53cb5754.mp3',
  },
  {
    id: 'fairy',
    label: 'Fairy Forest',
    emoji: '🧚',
    description: 'Magical forest sounds',
    url: 'https://cdn.pixabay.com/audio/2022/03/09/audio_c610232c26.mp3',
  },
  {
    id: 'love',
    label: 'Love Melody',
    emoji: '💕',
    description: 'Romantic soft piano',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
  },
  {
    id: 'cosmic',
    label: 'Cosmic Dreams',
    emoji: '✨',
    description: 'Ethereal space music',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
];

export const AmbientSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundType>('space');
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedSound = localStorage.getItem('stellar-ambient-sound');
    const savedVolume = localStorage.getItem('stellar-ambient-volume');
    if (savedSound) setCurrentSound(savedSound as SoundType);
    if (savedVolume) setVolume(parseFloat(savedVolume));
  }, []);

  useEffect(() => {
    localStorage.setItem('stellar-ambient-sound', currentSound);
    localStorage.setItem('stellar-ambient-volume', volume.toString());
  }, [currentSound, volume]);

  const getCurrentSoundUrl = () => {
    return soundOptions.find((s) => s.id === currentSound)?.url || soundOptions[0].url;
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(getCurrentSoundUrl());
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = getCurrentSoundUrl();
      audioRef.current.play().catch(() => {
        // Auto-play might be blocked
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSoundChange = (soundId: SoundType) => {
    setCurrentSound(soundId);
    if (audioRef.current && isPlaying) {
      audioRef.current.src = soundOptions.find((s) => s.id === soundId)?.url || '';
      audioRef.current.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const currentSoundOption = soundOptions.find((s) => s.id === currentSound);

  return (
    <motion.div
      className="fixed top-4 right-4 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Expanded Menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border/50"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Music className="w-4 h-4" />
                  <span>Ambient Sounds</span>
                </div>

                {/* Sound Options */}
                <div className="space-y-2">
                  {soundOptions.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundChange(sound.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                        currentSound === sound.id
                          ? 'bg-primary/20 border border-primary/50'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <span className="text-xl">{sound.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{sound.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{sound.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Volume Slider */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-primary h-1 bg-secondary rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Bar */}
        <div className="flex items-center gap-2 p-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-all"
          >
            <span className="text-lg">{currentSoundOption?.emoji}</span>
            <span className="text-sm font-medium hidden sm:inline">{currentSoundOption?.label}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          <div className="w-px h-6 bg-border/50" />

          <motion.button
            onClick={togglePlay}
            className={`p-2.5 rounded-full transition-all ${
              isPlaying
                ? 'bg-primary/20 text-primary'
                : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause ambient sound' : 'Play ambient sound'}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
