import { useState, useCallback, useRef, useEffect } from 'react';

interface Transform {
  scale: number;
  x: number;
  y: number;
}

interface UseZoomPanOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

export const useZoomPan = (options: UseZoomPanOptions = {}) => {
  const { minScale = 0.5, maxScale = 3, initialScale = 1 } = options;
  
  const [transform, setTransform] = useState<Transform>({
    scale: initialScale,
    x: 0,
    y: 0,
  });
  
  const isPanning = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    
    setTransform((prev) => {
      const newScale = Math.min(maxScale, Math.max(minScale, prev.scale * delta));
      
      // Zoom towards cursor position
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { ...prev, scale: newScale };
      
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      
      const scaleChange = newScale / prev.scale;
      const newX = cursorX - (cursorX - prev.x) * scaleChange;
      const newY = cursorY - (cursorY - prev.y) * scaleChange;
      
      return { scale: newScale, x: newX, y: newY };
    });
  }, [maxScale, minScale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    isPanning.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
    
    setTransform((prev) => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Touch support for mobile
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      lastTouchDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchCenter.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    } else if (e.touches.length === 1) {
      isPanning.current = true;
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const delta = distance / lastTouchDistance.current;
      lastTouchDistance.current = distance;
      
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      setTransform((prev) => {
        const newScale = Math.min(maxScale, Math.max(minScale, prev.scale * delta));
        
        // Also handle panning during pinch
        const panX = lastTouchCenter.current ? centerX - lastTouchCenter.current.x : 0;
        const panY = lastTouchCenter.current ? centerY - lastTouchCenter.current.y : 0;
        
        lastTouchCenter.current = { x: centerX, y: centerY };
        
        return {
          scale: newScale,
          x: prev.x + panX,
          y: prev.y + panY,
        };
      });
    } else if (e.touches.length === 1 && isPanning.current) {
      const deltaX = e.touches[0].clientX - lastPosition.current.x;
      const deltaY = e.touches[0].clientY - lastPosition.current.y;
      
      lastPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      
      setTransform((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    }
  }, [maxScale, minScale]);

  const handleTouchEnd = useCallback(() => {
    isPanning.current = false;
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
  }, []);

  const resetTransform = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(maxScale, prev.scale * 1.2),
    }));
  }, [maxScale]);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(minScale, prev.scale * 0.8),
    }));
  }, [minScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    transform,
    containerRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    resetTransform,
    zoomIn,
    zoomOut,
  };
};
