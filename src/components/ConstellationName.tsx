import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConstellationNameProps {
  name: string;
  onNameChange: (name: string) => void;
}

export const ConstellationName = ({ name, onNameChange }: ConstellationNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  const handleSubmit = () => {
    if (editValue.trim()) {
      onNameChange(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditValue(name);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSubmit}
            autoFocus
            className="bg-transparent border-none text-center font-display text-lg h-8 w-48"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSubmit}>
            <Check className="w-4 h-4 text-primary" />
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="glass-card px-6 py-2 rounded-full flex items-center gap-3 hover:border-primary/50 transition-colors group"
        >
          <h1 className="font-display text-lg font-semibold text-foreground text-glow">
            {name}
          </h1>
          <Pencil className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      )}
    </motion.div>
  );
};
