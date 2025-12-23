import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Mood } from '@/types/memory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, imageUrl: string, mood: Mood) => void;
}

const moods: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'happy', label: 'Happy', emoji: '☀️', color: 'bg-mood-happy/20 border-mood-happy text-mood-happy' },
  { value: 'calm', label: 'Calm', emoji: '🌊', color: 'bg-mood-calm/20 border-mood-calm text-mood-calm' },
  { value: 'nostalgic', label: 'Nostalgic', emoji: '💜', color: 'bg-mood-nostalgic/20 border-mood-nostalgic text-mood-nostalgic' },
];

export const UploadModal = ({ isOpen, onClose, onUpload }: UploadModalProps) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mood, setMood] = useState<Mood>('happy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && imageUrl) {
      onUpload(title.trim(), imageUrl, mood);
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setImageUrl('');
    setImagePreview(null);
    setMood('happy');
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
              className="glass-card rounded-2xl overflow-hidden max-w-md w-full"
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
                  <h2 className="font-display text-xl font-semibold">Add Memory</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Memory Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 bg-secondary/20"
                    >
                      <div className="p-3 rounded-full bg-secondary">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Click to upload an image
                      </span>
                    </button>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Memory Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Late night laughs"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-secondary/30"
                  />
                </div>

                {/* Mood Selection */}
                <div className="space-y-3">
                  <Label>How does this memory feel?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {moods.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMood(m.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          mood === m.value
                            ? m.color
                            : 'border-border/50 bg-secondary/20 hover:bg-secondary/40'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl">{m.emoji}</span>
                          <span className="text-xs font-medium">{m.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={!title.trim() || !imageUrl}
                >
                  <Upload className="w-4 h-4" />
                  Add to Constellation
                </Button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
