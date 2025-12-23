import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Star } from 'lucide-react';
import { ConstellationPattern } from '@/types/memory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatternOption {
  value: ConstellationPattern;
  label: string;
  emoji: string;
  description: string;
}

const patterns: PatternOption[] = [
  { value: 'auto', label: 'Auto Form', emoji: '✨', description: 'Connect by creation order' },
  { value: 'capricorn', label: 'Capricorn', emoji: '♑', description: 'The sea-goat pattern' },
  { value: 'aries', label: 'Aries', emoji: '♈', description: 'The ram pattern' },
  { value: 'taurus', label: 'Taurus', emoji: '♉', description: 'The bull pattern' },
  { value: 'gemini', label: 'Gemini', emoji: '♊', description: 'The twins pattern' },
  { value: 'cancer', label: 'Cancer', emoji: '♋', description: 'The crab pattern' },
  { value: 'leo', label: 'Leo', emoji: '♌', description: 'The lion pattern' },
  { value: 'virgo', label: 'Virgo', emoji: '♍', description: 'The maiden pattern' },
  { value: 'libra', label: 'Libra', emoji: '♎', description: 'The scales pattern' },
  { value: 'scorpio', label: 'Scorpio', emoji: '♏', description: 'The scorpion pattern' },
  { value: 'sagittarius', label: 'Sagittarius', emoji: '♐', description: 'The archer pattern' },
  { value: 'aquarius', label: 'Aquarius', emoji: '♒', description: 'The water bearer' },
  { value: 'pisces', label: 'Pisces', emoji: '♓', description: 'The fish pattern' },
  { value: 'orion', label: 'Orion', emoji: '🏹', description: 'The hunter pattern' },
  { value: 'ursa-major', label: 'Ursa Major', emoji: '🐻', description: 'The great bear' },
  { value: 'ursa-minor', label: 'Ursa Minor', emoji: '⭐', description: 'The little bear' },
];

interface CreateConstellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, pattern: ConstellationPattern) => void;
}

export const CreateConstellationModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateConstellationModalProps) => {
  const [name, setName] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<ConstellationPattern>('auto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), selectedPattern);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedPattern('auto');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card rounded-2xl overflow-hidden max-w-lg w-full max-h-[85vh] flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold">Create Constellation</h2>
                    <p className="text-sm text-muted-foreground">Name your new star collection</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="constellation-name">Constellation Name</Label>
                    <Input
                      id="constellation-name"
                      placeholder="e.g., Summer Memories"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/30"
                      autoFocus
                    />
                  </div>

                  {/* Pattern Selection */}
                  <div className="space-y-3">
                    <Label>Choose Pattern</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {patterns.map((pattern) => (
                        <motion.button
                          key={pattern.value}
                          type="button"
                          onClick={() => setSelectedPattern(pattern.value)}
                          className={`p-3 rounded-xl border-2 transition-all text-left ${
                            selectedPattern === pattern.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-border'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl mb-1 block">{pattern.emoji}</span>
                          <span className="font-medium text-xs block">{pattern.label}</span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1">{pattern.description}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border/50">
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={!name.trim()}
                  >
                    <Star className="w-4 h-4" />
                    Create Constellation
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
