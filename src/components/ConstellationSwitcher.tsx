import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2, Star } from 'lucide-react';
import { useState } from 'react';
import { Constellation } from '@/types/memory';
import { Button } from '@/components/ui/button';

interface ConstellationSwitcherProps {
  constellations: Constellation[];
  activeConstellation: Constellation | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onNameChange: (id: string, name: string) => void;
}

export const ConstellationSwitcher = ({
  constellations,
  activeConstellation,
  onSelect,
  onCreateNew,
  onDelete,
  onNameChange,
}: ConstellationSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (constellation: Constellation) => {
    setEditingId(constellation.id);
    setEditValue(constellation.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      onNameChange(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 glass-card rounded-full px-4 py-2 hover:bg-secondary/50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Star className="w-4 h-4 text-primary" />
        <span className="font-display font-semibold text-sm max-w-[150px] truncate">
          {activeConstellation?.name || 'Select Constellation'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="absolute top-full left-0 mt-2 w-64 glass-card rounded-xl overflow-hidden z-40"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-2 max-h-60 overflow-y-auto">
                {constellations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No constellations yet
                  </p>
                ) : (
                  constellations.map((constellation) => (
                    <div
                      key={constellation.id}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors group ${
                        activeConstellation?.id === constellation.id
                          ? 'bg-primary/20'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      {editingId === constellation.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="flex-1 bg-background/50 rounded px-2 py-1 text-sm outline-none border border-primary"
                          autoFocus
                        />
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              onSelect(constellation.id);
                              setIsOpen(false);
                            }}
                            className="flex-1 text-left"
                          >
                            <span className="text-sm font-medium truncate block">
                              {constellation.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {constellation.pattern === 'auto' ? 'Auto' : constellation.pattern}
                            </span>
                          </button>
                          <button
                            onClick={() => handleStartEdit(constellation)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-secondary rounded transition-all"
                            title="Rename"
                          >
                            <span className="text-xs">✏️</span>
                          </button>
                          <button
                            onClick={() => onDelete(constellation.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t border-border/50 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onCreateNew();
                    setIsOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  New Constellation
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
