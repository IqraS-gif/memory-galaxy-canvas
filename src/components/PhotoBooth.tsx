import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Download, RotateCcw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoBoothProps {
  isOpen: boolean;
  onClose: () => void;
}

type SpaceFrame = 'none' | 'kawaii-space' | 'alien-friends' | 'starry-dream' | 'rocket-bears';
type SpaceFilter = 'none' | 'soft-pink' | 'dreamy' | 'pastel' | 'lavender';

const frames: { id: SpaceFrame; name: string; emoji: string }[] = [
  { id: 'none', name: 'None', emoji: '✕' },
  { id: 'kawaii-space', name: 'Space', emoji: '🪐' },
  { id: 'alien-friends', name: 'Aliens', emoji: '👽' },
  { id: 'starry-dream', name: 'Stars', emoji: '⭐' },
  { id: 'rocket-bears', name: 'Bears', emoji: '🧸' },
];

const filters: { id: SpaceFilter; name: string; style: string }[] = [
  { id: 'none', name: 'None', style: '' },
  { id: 'soft-pink', name: 'Pink', style: 'brightness(1.05) saturate(1.1)' },
  { id: 'dreamy', name: 'Dreamy', style: 'brightness(1.1) contrast(0.95) saturate(0.9)' },
  { id: 'pastel', name: 'Pastel', style: 'brightness(1.15) saturate(0.85)' },
  { id: 'lavender', name: 'Lavender', style: 'hue-rotate(20deg) brightness(1.05) saturate(0.9)' },
];

// SVG string generators for canvas drawing
const getSvgAstronaut = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80">
  <ellipse cx="30" cy="30" rx="22" ry="24" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
  <ellipse cx="30" cy="28" rx="16" ry="17" fill="#87CEEB" opacity="0.6"/>
  <circle cx="24" cy="26" r="4" fill="#333"/>
  <circle cx="36" cy="26" r="4" fill="#333"/>
  <circle cx="25" cy="25" r="1.5" fill="white"/>
  <circle cx="37" cy="25" r="1.5" fill="white"/>
  <ellipse cx="30" cy="34" rx="3" ry="2" fill="#FFB6C1"/>
  <path d="M26 38 Q30 42 34 38" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="20" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.5"/>
  <ellipse cx="40" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.5"/>
  <rect x="22" y="54" rx="8" ry="8" width="16" height="20" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
  <ellipse cx="14" cy="62" rx="6" ry="4" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
  <ellipse cx="46" cy="62" rx="6" ry="4" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
</svg>`;

const getSvgPlanet = (color = '#E6B3FF') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <circle cx="25" cy="25" r="18" fill="${color}"/>
  <ellipse cx="25" cy="25" rx="28" ry="6" fill="none" stroke="${color}" stroke-width="3" opacity="0.7" transform="rotate(-20 25 25)"/>
  <circle cx="18" cy="20" r="3" fill="white" opacity="0.4"/>
  <circle cx="30" cy="30" r="4" fill="white" opacity="0.3"/>
  <circle cx="20" cy="22" r="2.5" fill="#333"/>
  <circle cx="30" cy="22" r="2.5" fill="#333"/>
  <circle cx="21" cy="21" r="1" fill="white"/>
  <circle cx="31" cy="21" r="1" fill="white"/>
  <path d="M23 28 Q25 31 27 28" fill="none" stroke="#333" stroke-width="1.2" stroke-linecap="round"/>
  <ellipse cx="16" cy="26" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.5"/>
  <ellipse cx="34" cy="26" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.5"/>
</svg>`;

const getSvgAlien = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
  <ellipse cx="25" cy="30" rx="18" ry="22" fill="#98FB98"/>
  <ellipse cx="15" cy="12" rx="4" ry="8" fill="#98FB98"/>
  <ellipse cx="35" cy="12" rx="4" ry="8" fill="#98FB98"/>
  <circle cx="15" cy="6" r="4" fill="#FFD700"/>
  <circle cx="35" cy="6" r="4" fill="#FFD700"/>
  <ellipse cx="18" cy="26" rx="5" ry="6" fill="#333"/>
  <ellipse cx="32" cy="26" rx="5" ry="6" fill="#333"/>
  <ellipse cx="19" cy="24" rx="2" ry="3" fill="white"/>
  <ellipse cx="33" cy="24" rx="2" ry="3" fill="white"/>
  <path d="M22 38 Q25 42 28 38" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="14" cy="32" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.6"/>
  <ellipse cx="36" cy="32" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.6"/>
</svg>`;

const getSvgRocket = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 70">
  <path d="M20 5 Q30 20 30 45 L10 45 Q10 20 20 5" fill="#FF6B6B"/>
  <ellipse cx="20" cy="35" rx="8" ry="10" fill="#87CEEB"/>
  <circle cx="20" cy="33" r="4" fill="#333"/>
  <circle cx="18" cy="31" r="1.5" fill="white"/>
  <path d="M10 45 L5 60 L12 50" fill="#FFD93D"/>
  <path d="M30 45 L35 60 L28 50" fill="#FFD93D"/>
  <ellipse cx="20" cy="60" rx="6" ry="10" fill="#FF9F43" opacity="0.8"/>
  <ellipse cx="20" cy="62" rx="4" ry="6" fill="#FFD93D"/>
</svg>`;

const getSvgStar = (color = '#FFD700') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <path d="M20 2 L24 14 L37 14 L27 22 L31 35 L20 27 L9 35 L13 22 L3 14 L16 14 Z" fill="${color}"/>
  <circle cx="16" cy="18" r="2" fill="#333"/>
  <circle cx="24" cy="18" r="2" fill="#333"/>
  <circle cx="17" cy="17" r="0.8" fill="white"/>
  <circle cx="25" cy="17" r="0.8" fill="white"/>
  <path d="M18 23 Q20 25 22 23" fill="none" stroke="#333" stroke-width="1" stroke-linecap="round"/>
</svg>`;

const getSvgBear = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 55">
  <circle cx="12" cy="12" r="8" fill="#D2691E"/>
  <circle cx="38" cy="12" r="8" fill="#D2691E"/>
  <circle cx="12" cy="12" r="4" fill="#8B4513"/>
  <circle cx="38" cy="12" r="4" fill="#8B4513"/>
  <circle cx="25" cy="30" r="20" fill="#D2691E"/>
  <circle cx="18" cy="26" r="3" fill="#333"/>
  <circle cx="32" cy="26" r="3" fill="#333"/>
  <circle cx="19" cy="25" r="1" fill="white"/>
  <circle cx="33" cy="25" r="1" fill="white"/>
  <ellipse cx="25" cy="34" rx="5" ry="4" fill="#8B4513"/>
  <ellipse cx="25" cy="33" rx="2" ry="1.5" fill="#333"/>
  <path d="M23 37 Q25 39 27 37" fill="none" stroke="#333" stroke-width="1" stroke-linecap="round"/>
  <ellipse cx="14" cy="30" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
  <ellipse cx="36" cy="30" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
</svg>`;

const getSvgHeart = (color = '#FF69B4') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28">
  <path d="M15 26 C5 18 0 12 0 7 C0 3 3 0 7 0 C10 0 13 2 15 5 C17 2 20 0 23 0 C27 0 30 3 30 7 C30 12 25 18 15 26" fill="${color}"/>
</svg>`;

// Helper to convert SVG string to image
const svgToImage = (svgString: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
};

// React components for live preview
const CuteAstronaut = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 60 80" className={className}>
    <ellipse cx="30" cy="30" rx="22" ry="24" fill="#f0f0f0" stroke="#ddd" strokeWidth="2"/>
    <ellipse cx="30" cy="28" rx="16" ry="17" fill="#87CEEB" opacity="0.6"/>
    <circle cx="24" cy="26" r="4" fill="#333"/>
    <circle cx="36" cy="26" r="4" fill="#333"/>
    <circle cx="25" cy="25" r="1.5" fill="white"/>
    <circle cx="37" cy="25" r="1.5" fill="white"/>
    <ellipse cx="30" cy="34" rx="3" ry="2" fill="#FFB6C1"/>
    <path d="M26 38 Q30 42 34 38" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="20" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.5"/>
    <ellipse cx="40" cy="32" rx="3" ry="2" fill="#FFB6C1" opacity="0.5"/>
    <rect x="22" y="54" rx="8" ry="8" width="16" height="20" fill="#f0f0f0" stroke="#ddd" strokeWidth="2"/>
    <ellipse cx="14" cy="62" rx="6" ry="4" fill="#f0f0f0" stroke="#ddd" strokeWidth="2"/>
    <ellipse cx="46" cy="62" rx="6" ry="4" fill="#f0f0f0" stroke="#ddd" strokeWidth="2"/>
  </svg>
);

const CutePlanet = ({ className = '', color = '#E6B3FF' }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 50 50" className={className}>
    <circle cx="25" cy="25" r="18" fill={color}/>
    <ellipse cx="25" cy="25" rx="28" ry="6" fill="none" stroke={color} strokeWidth="3" opacity="0.7" transform="rotate(-20 25 25)"/>
    <circle cx="18" cy="20" r="3" fill="white" opacity="0.4"/>
    <circle cx="30" cy="30" r="4" fill="white" opacity="0.3"/>
    <circle cx="20" cy="22" r="2.5" fill="#333"/>
    <circle cx="30" cy="22" r="2.5" fill="#333"/>
    <circle cx="21" cy="21" r="1" fill="white"/>
    <circle cx="31" cy="21" r="1" fill="white"/>
    <path d="M23 28 Q25 31 27 28" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="16" cy="26" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.5"/>
    <ellipse cx="34" cy="26" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.5"/>
  </svg>
);

const CuteAlien = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 50 60" className={className}>
    <ellipse cx="25" cy="30" rx="18" ry="22" fill="#98FB98"/>
    <ellipse cx="15" cy="12" rx="4" ry="8" fill="#98FB98"/>
    <ellipse cx="35" cy="12" rx="4" ry="8" fill="#98FB98"/>
    <circle cx="15" cy="6" r="4" fill="#FFD700"/>
    <circle cx="35" cy="6" r="4" fill="#FFD700"/>
    <ellipse cx="18" cy="26" rx="5" ry="6" fill="#333"/>
    <ellipse cx="32" cy="26" rx="5" ry="6" fill="#333"/>
    <ellipse cx="19" cy="24" rx="2" ry="3" fill="white"/>
    <ellipse cx="33" cy="24" rx="2" ry="3" fill="white"/>
    <path d="M22 38 Q25 42 28 38" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="14" cy="32" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.6"/>
    <ellipse cx="36" cy="32" rx="2" ry="1.5" fill="#FFB6C1" opacity="0.6"/>
  </svg>
);

const CuteRocket = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 40 70" className={className}>
    <path d="M20 5 Q30 20 30 45 L10 45 Q10 20 20 5" fill="#FF6B6B"/>
    <ellipse cx="20" cy="35" rx="8" ry="10" fill="#87CEEB"/>
    <circle cx="20" cy="33" r="4" fill="#333"/>
    <circle cx="18" cy="31" r="1.5" fill="white"/>
    <path d="M10 45 L5 60 L12 50" fill="#FFD93D"/>
    <path d="M30 45 L35 60 L28 50" fill="#FFD93D"/>
    <ellipse cx="20" cy="60" rx="6" ry="10" fill="#FF9F43" opacity="0.8"/>
    <ellipse cx="20" cy="62" rx="4" ry="6" fill="#FFD93D"/>
  </svg>
);

const CuteStar = ({ className = '', color = '#FFD700' }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <path d="M20 2 L24 14 L37 14 L27 22 L31 35 L20 27 L9 35 L13 22 L3 14 L16 14 Z" fill={color}/>
    <circle cx="16" cy="18" r="2" fill="#333"/>
    <circle cx="24" cy="18" r="2" fill="#333"/>
    <circle cx="17" cy="17" r="0.8" fill="white"/>
    <circle cx="25" cy="17" r="0.8" fill="white"/>
    <path d="M18 23 Q20 25 22 23" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const CuteBear = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 50 55" className={className}>
    <circle cx="12" cy="12" r="8" fill="#D2691E"/>
    <circle cx="38" cy="12" r="8" fill="#D2691E"/>
    <circle cx="12" cy="12" r="4" fill="#8B4513"/>
    <circle cx="38" cy="12" r="4" fill="#8B4513"/>
    <circle cx="25" cy="30" r="20" fill="#D2691E"/>
    <circle cx="18" cy="26" r="3" fill="#333"/>
    <circle cx="32" cy="26" r="3" fill="#333"/>
    <circle cx="19" cy="25" r="1" fill="white"/>
    <circle cx="33" cy="25" r="1" fill="white"/>
    <ellipse cx="25" cy="34" rx="5" ry="4" fill="#8B4513"/>
    <ellipse cx="25" cy="33" rx="2" ry="1.5" fill="#333"/>
    <path d="M23 37 Q25 39 27 37" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round"/>
    <ellipse cx="14" cy="30" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
    <ellipse cx="36" cy="30" rx="3" ry="2" fill="#FFB6C1" opacity="0.6"/>
  </svg>
);

const CuteHeart = ({ className = '', color = '#FF69B4' }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 30 28" className={className}>
    <path d="M15 26 C5 18 0 12 0 7 C0 3 3 0 7 0 C10 0 13 2 15 5 C17 2 20 0 23 0 C27 0 30 3 30 7 C30 12 25 18 15 26" fill={color}/>
  </svg>
);

export const PhotoBooth = ({ isOpen, onClose }: PhotoBoothProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const collageCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [collageImage, setCollageImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<SpaceFrame>('kawaii-space');
  const [selectedFilter, setSelectedFilter] = useState<SpaceFilter>('none');
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [photoCount, setPhotoCount] = useState(0);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImages([]);
      setCollageImage(null);
      setPhotoCount(0);
    }
    return () => stopCamera();
  }, [isOpen]);

  const capturePhoto = useCallback(async () => {
    if (collageImage) return; // Already have collage
    
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setTimeout(async () => {
            setIsCapturing(true);
            setTimeout(async () => {
              if (videoRef.current && canvasRef.current) {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  // Apply filter
                  const filter = filters.find(f => f.id === selectedFilter);
                  if (filter?.style) {
                    ctx.filter = filter.style;
                  }
                  // Draw video frame
                  ctx.drawImage(video, 0, 0);
                  ctx.filter = 'none';
                  
                  // Draw frame overlay on the captured photo
                  await drawFrameOnCanvas(ctx, canvas.width, canvas.height);
                  
                  const newImage = canvas.toDataURL('image/png');
                  const newImages = [...capturedImages, newImage];
                  setCapturedImages(newImages);
                  setPhotoCount(prev => prev + 1);
                  
                  // If we have 3 photos, create collage
                  if (newImages.length >= 3) {
                    createCollage(newImages);
                  }
                }
              }
              setIsCapturing(false);
            }, 100);
          }, 0);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  }, [selectedFilter, capturedImages, collageImage, selectedFrame]);

  // Draw the selected frame overlay onto a canvas
  const drawFrameOnCanvas = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (selectedFrame === 'none') return;

    type StickerDef = { svg: string; x: number; y: number; w: number; h: number };
    
    const getFrameStickerPositions = (): StickerDef[] => {
      // Scale positions based on canvas size
      const scaleX = width / 640;
      const scaleY = height / 480;
      
      switch (selectedFrame) {
        case 'kawaii-space':
          return [
            { svg: getSvgAstronaut(), x: 10 * scaleX, y: 10 * scaleY, w: 60 * scaleX, h: 75 * scaleY },
            { svg: getSvgPlanet('#E6B3FF'), x: (width - 70 * scaleX), y: 10 * scaleY, w: 55 * scaleX, h: 55 * scaleY },
            { svg: getSvgPlanet('#87CEEB'), x: 15 * scaleX, y: (height - 90 * scaleY), w: 45 * scaleX, h: 45 * scaleY },
            { svg: getSvgRocket(), x: (width - 55 * scaleX), y: (height - 100 * scaleY), w: 45 * scaleX, h: 70 * scaleY },
            { svg: getSvgStar('#FFD700'), x: (width - 80 * scaleX), y: 100 * scaleY, w: 35 * scaleX, h: 35 * scaleY },
            { svg: getSvgStar('#FFB6C1'), x: 15 * scaleX, y: (height / 2), w: 30 * scaleX, h: 30 * scaleY },
            { svg: getSvgHeart('#FF69B4'), x: (width / 3), y: 15 * scaleY, w: 30 * scaleX, h: 28 * scaleY },
            { svg: getSvgHeart('#FFB6C1'), x: (width - 100 * scaleX), y: (height - 150 * scaleY), w: 25 * scaleX, h: 23 * scaleY },
          ];
        case 'alien-friends':
          return [
            { svg: getSvgAlien(), x: 10 * scaleX, y: 10 * scaleY, w: 55 * scaleX, h: 65 * scaleY },
            { svg: getSvgAlien(), x: (width - 65 * scaleX), y: 10 * scaleY, w: 50 * scaleX, h: 60 * scaleY },
            { svg: getSvgAlien(), x: 15 * scaleX, y: (height - 85 * scaleY), w: 45 * scaleX, h: 55 * scaleY },
            { svg: getSvgPlanet('#98FB98'), x: (width - 70 * scaleX), y: 120 * scaleY, w: 50 * scaleX, h: 50 * scaleY },
            { svg: getSvgPlanet('#B3E0FF'), x: 10 * scaleX, y: (height / 2 - 30 * scaleY), w: 45 * scaleX, h: 45 * scaleY },
            { svg: getSvgStar('#FFD700'), x: (width / 3), y: 20 * scaleY, w: 30 * scaleX, h: 30 * scaleY },
            { svg: getSvgStar('#FFD700'), x: (width - 90 * scaleX), y: (height - 70 * scaleY), w: 35 * scaleX, h: 35 * scaleY },
            { svg: getSvgHeart('#98FB98'), x: (width / 2 - 15 * scaleX), y: (height - 50 * scaleY), w: 28 * scaleX, h: 26 * scaleY },
          ];
        case 'starry-dream':
          return [
            { svg: getSvgStar('#FFD700'), x: 10 * scaleX, y: 10 * scaleY, w: 50 * scaleX, h: 50 * scaleY },
            { svg: getSvgStar('#FFB6C1'), x: (width - 60 * scaleX), y: 15 * scaleY, w: 50 * scaleX, h: 50 * scaleY },
            { svg: getSvgStar('#87CEEB'), x: 15 * scaleX, y: (height - 70 * scaleY), w: 45 * scaleX, h: 45 * scaleY },
            { svg: getSvgStar('#FFD700'), x: (width - 60 * scaleX), y: (height - 65 * scaleY), w: 50 * scaleX, h: 50 * scaleY },
            { svg: getSvgStar('#E6B3FF'), x: 10 * scaleX, y: (height / 2), w: 40 * scaleX, h: 40 * scaleY },
            { svg: getSvgStar('#FFB6C1'), x: (width - 55 * scaleX), y: (height / 2 - 20 * scaleY), w: 40 * scaleX, h: 40 * scaleY },
            { svg: getSvgStar('#FFD700'), x: (width / 3 - 20 * scaleX), y: (height - 60 * scaleY), w: 35 * scaleX, h: 35 * scaleY },
            { svg: getSvgHeart('#FF69B4'), x: (width / 2), y: 20 * scaleY, w: 30 * scaleX, h: 28 * scaleY },
            { svg: getSvgHeart('#FFB6C1'), x: (width - 100 * scaleX), y: (height - 130 * scaleY), w: 28 * scaleX, h: 26 * scaleY },
            { svg: getSvgAstronaut(), x: (width - 70 * scaleX), y: (height - 180 * scaleY), w: 55 * scaleX, h: 70 * scaleY },
          ];
        case 'rocket-bears':
          return [
            { svg: getSvgBear(), x: 10 * scaleX, y: 10 * scaleY, w: 55 * scaleX, h: 60 * scaleY },
            { svg: getSvgBear(), x: (width - 65 * scaleX), y: 15 * scaleY, w: 50 * scaleX, h: 55 * scaleY },
            { svg: getSvgBear(), x: 15 * scaleX, y: (height - 80 * scaleY), w: 50 * scaleX, h: 55 * scaleY },
            { svg: getSvgRocket(), x: (width - 55 * scaleX), y: 100 * scaleY, w: 40 * scaleX, h: 65 * scaleY },
            { svg: getSvgRocket(), x: (width - 55 * scaleX), y: (height - 100 * scaleY), w: 40 * scaleX, h: 65 * scaleY },
            { svg: getSvgRocket(), x: 15 * scaleX, y: (height / 2 - 30 * scaleY), w: 35 * scaleX, h: 55 * scaleY },
            { svg: getSvgStar('#FFD700'), x: (width / 3), y: 25 * scaleY, w: 30 * scaleX, h: 30 * scaleY },
            { svg: getSvgHeart('#FF69B4'), x: (width / 2 + 20 * scaleX), y: (height - 55 * scaleY), w: 30 * scaleX, h: 28 * scaleY },
            { svg: getSvgHeart('#FFB6C1'), x: (width - 100 * scaleX), y: (height - 160 * scaleY), w: 28 * scaleX, h: 26 * scaleY },
          ];
        default:
          return [];
      }
    };

    // Draw pastel border
    const borderWidth = 16;
    const borderColors: Record<SpaceFrame, [string, string, string]> = {
      'none': ['#E6B3FF', '#FFB3D9', '#B3E0FF'],
      'kawaii-space': ['#E6B3FF', '#FFB3D9', '#B3E0FF'],
      'alien-friends': ['#98FB98', '#B3E0FF', '#E6B3FF'],
      'starry-dream': ['#FFD700', '#FFB6C1', '#87CEEB'],
      'rocket-bears': ['#D2691E', '#FFB6C1', '#FF6B6B'],
    };
    
    const colors = borderColors[selectedFrame];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    
    // Draw border (outside frame)
    ctx.strokeStyle = gradient;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
    
    // Inner white glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(borderWidth + 2, borderWidth + 2, width - borderWidth * 2 - 4, height - borderWidth * 2 - 4);

    const positions = getFrameStickerPositions();
    
    // Load and draw all stickers
    const stickerImages = await Promise.all(
      positions.map(pos => svgToImage(pos.svg))
    );

    stickerImages.forEach((img, i) => {
      const pos = positions[i];
      ctx.drawImage(img, pos.x, pos.y, pos.w, pos.h);
    });

    // Draw bottom label
    const labelY = height - 25;
    ctx.fillStyle = 'rgba(255, 182, 193, 0.8)';
    const labelWidth = 180;
    const labelHeight = 28;
    ctx.beginPath();
    ctx.roundRect(width / 2 - labelWidth / 2, labelY - labelHeight / 2 - 5, labelWidth, labelHeight, 14);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getFrameLabel(), width / 2, labelY + 3);
  };

  const createCollage = useCallback(async (images: string[]) => {
    const collageCanvas = collageCanvasRef.current;
    if (!collageCanvas) return;

    const ctx = collageCanvas.getContext('2d');
    if (!ctx) return;

    // Set collage size - photos already have frames baked in
    const photoWidth = 320;
    const photoHeight = 240;
    const padding = 15;
    const borderWidth = 30;
    
    collageCanvas.width = photoWidth + borderWidth * 2;
    collageCanvas.height = (photoHeight * 3) + (padding * 2) + borderWidth * 2 + 50;

    // Create pastel gradient background based on selected frame
    const gradients: Record<SpaceFrame, [string, string, string]> = {
      'none': ['#E6B3FF', '#FFB3D9', '#B3E0FF'],
      'kawaii-space': ['#E6B3FF', '#FFB3D9', '#B3E0FF'],
      'alien-friends': ['#98FB98', '#B3E0FF', '#E6B3FF'],
      'starry-dream': ['#FFE4B5', '#FFB6C1', '#B3E0FF'],
      'rocket-bears': ['#FFDAB9', '#FFB6C1', '#E6B3FF'],
    };
    
    const colors = gradients[selectedFrame] || gradients['kawaii-space'];
    const gradient = ctx.createLinearGradient(0, 0, collageCanvas.width, collageCanvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, collageCanvas.width, collageCanvas.height);

    // Add sparkle pattern to background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * collageCanvas.width;
      const y = Math.random() * collageCanvas.height;
      const size = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Load photo images (they already have frames baked in)
    const imageElements: HTMLImageElement[] = await Promise.all(
      images.slice(0, 3).map(src => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    // Draw all photos - frames are already part of the images
    imageElements.forEach((imgEl, i) => {
      const x = borderWidth;
      const y = borderWidth + i * (photoHeight + padding);
      
      // Draw image (frame is already baked in)
      ctx.drawImage(imgEl, x, y, photoWidth, photoHeight);
    });

    // Add cute text at bottom
    ctx.fillStyle = 'rgba(255, 182, 193, 0.9)';
    const labelWidth = 200;
    const labelHeight = 30;
    ctx.beginPath();
    ctx.roundRect(collageCanvas.width / 2 - labelWidth / 2, collageCanvas.height - 45, labelWidth, labelHeight, 15);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getFrameLabel(), collageCanvas.width / 2, collageCanvas.height - 25);

    setCollageImage(collageCanvas.toDataURL('image/png'));
  }, [selectedFrame]);

  const getFrameLabel = () => {
    switch (selectedFrame) {
      case 'kawaii-space': return '✨ CUTE SPACE BOOTH ✨';
      case 'alien-friends': return '👽 ALIEN FRIENDS 👽';
      case 'starry-dream': return '⭐ STARRY DREAM ⭐';
      case 'rocket-bears': return '🧸 ROCKET BEARS 🚀';
      default: return '✨ SPACE BOOTH ✨';
    }
  };


  const downloadPhoto = useCallback(() => {
    const imageToDownload = collageImage || (capturedImages.length > 0 ? capturedImages[capturedImages.length - 1] : null);
    if (!imageToDownload) return;
    const link = document.createElement('a');
    link.download = `space-booth-${Date.now()}.png`;
    link.href = imageToDownload;
    link.click();
    toast.success('Photo saved to downloads!');
  }, [collageImage, capturedImages]);

  const retake = useCallback(() => {
    setCapturedImages([]);
    setCollageImage(null);
    setPhotoCount(0);
  }, []);

  const getFrameOverlay = () => {
    const baseFrameStyle = "absolute inset-0 pointer-events-none";
    
    switch (selectedFrame) {
      case 'kawaii-space':
        return (
          <div className={baseFrameStyle}>
            {/* Pastel gradient border */}
            <div className="absolute inset-0 border-[16px] rounded-lg" 
                 style={{ borderImage: 'linear-gradient(135deg, #E6B3FF, #FFB3D9, #B3E0FF, #E6B3FF) 1' }} />
            <div className="absolute inset-2 border-4 border-white/30 rounded-lg" />
            
            {/* Stickers */}
            <CuteAstronaut className="absolute top-2 left-2 w-16 h-20" />
            <CutePlanet className="absolute top-4 right-4 w-14 h-14" color="#E6B3FF" />
            <CutePlanet className="absolute bottom-16 left-4 w-10 h-10" color="#87CEEB" />
            <CuteRocket className="absolute bottom-4 right-4 w-10 h-16" />
            <CuteStar className="absolute top-1/4 right-2 w-8 h-8" color="#FFD700" />
            <CuteStar className="absolute bottom-1/3 left-2 w-6 h-6" color="#FFB6C1" />
            <CuteHeart className="absolute top-8 left-1/3 w-6 h-6" color="#FF69B4" />
            <CuteHeart className="absolute bottom-20 right-1/4 w-5 h-5" color="#FFB6C1" />
            
            {/* Bottom label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-300 to-pink-300 px-4 py-1 rounded-full">
              <span className="text-xs font-bold text-white drop-shadow">✨ CUTE SPACE BOOTH ✨</span>
            </div>
          </div>
        );
      case 'alien-friends':
        return (
          <div className={baseFrameStyle}>
            <div className="absolute inset-0 border-[16px] rounded-lg" 
                 style={{ borderImage: 'linear-gradient(135deg, #98FB98, #B3E0FF, #E6B3FF, #98FB98) 1' }} />
            
            <CuteAlien className="absolute top-2 left-2 w-14 h-16" />
            <CuteAlien className="absolute top-2 right-2 w-12 h-14" />
            <CuteAlien className="absolute bottom-4 left-4 w-10 h-12" />
            <CutePlanet className="absolute top-1/4 right-4 w-12 h-12" color="#98FB98" />
            <CutePlanet className="absolute bottom-1/4 left-2 w-10 h-10" color="#B3E0FF" />
            <CuteStar className="absolute top-12 left-1/3 w-6 h-6" color="#FFD700" />
            <CuteStar className="absolute bottom-16 right-1/3 w-7 h-7" color="#FFD700" />
            <CuteHeart className="absolute top-1/2 right-2 w-5 h-5" color="#FF69B4" />
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-300 to-cyan-300 px-4 py-1 rounded-full">
              <span className="text-xs font-bold text-white drop-shadow">👽 ALIEN FRIENDS 👽</span>
            </div>
          </div>
        );
      case 'starry-dream':
        return (
          <div className={baseFrameStyle}>
            <div className="absolute inset-0 border-[16px] rounded-lg" 
                 style={{ borderImage: 'linear-gradient(135deg, #FFD700, #FFB6C1, #87CEEB, #FFD700) 1' }} />
            
            {/* Many cute stars */}
            <CuteStar className="absolute top-2 left-2 w-12 h-12" color="#FFD700" />
            <CuteStar className="absolute top-4 right-4 w-14 h-14" color="#FFB6C1" />
            <CuteStar className="absolute bottom-4 left-4 w-10 h-10" color="#87CEEB" />
            <CuteStar className="absolute bottom-8 right-2 w-12 h-12" color="#FFD700" />
            <CuteStar className="absolute top-1/3 left-1 w-8 h-8" color="#E6B3FF" />
            <CuteStar className="absolute top-1/2 right-1 w-8 h-8" color="#FFB6C1" />
            <CuteStar className="absolute bottom-1/3 left-2 w-7 h-7" color="#FFD700" />
            <CuteHeart className="absolute top-16 left-1/4 w-5 h-5" color="#FF69B4" />
            <CuteHeart className="absolute bottom-20 right-1/4 w-6 h-6" color="#FFB6C1" />
            <CuteAstronaut className="absolute bottom-2 right-2 w-12 h-16" />
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-300 to-pink-300 px-4 py-1 rounded-full">
              <span className="text-xs font-bold text-white drop-shadow">⭐ STARRY DREAM ⭐</span>
            </div>
          </div>
        );
      case 'rocket-bears':
        return (
          <div className={baseFrameStyle}>
            <div className="absolute inset-0 border-[16px] rounded-lg" 
                 style={{ borderImage: 'linear-gradient(135deg, #D2691E, #FFB6C1, #FF6B6B, #D2691E) 1' }} />
            
            <CuteBear className="absolute top-2 left-2 w-14 h-16" />
            <CuteBear className="absolute top-4 right-4 w-12 h-14" />
            <CuteBear className="absolute bottom-16 left-4 w-10 h-12" />
            <CuteRocket className="absolute top-1/4 right-2 w-10 h-16" />
            <CuteRocket className="absolute bottom-4 right-4 w-8 h-14" />
            <CuteRocket className="absolute bottom-1/3 left-1 w-8 h-12" />
            <CuteStar className="absolute top-12 left-1/3 w-6 h-6" color="#FFD700" />
            <CuteHeart className="absolute top-1/2 right-1/4 w-6 h-6" color="#FF69B4" />
            <CuteHeart className="absolute bottom-24 left-1/3 w-5 h-5" color="#FFB6C1" />
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-300 to-pink-300 px-4 py-1 rounded-full">
              <span className="text-xs font-bold text-white drop-shadow">🧸 ROCKET BEARS 🚀</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Space Photo Booth</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Camera View */}
          <div className="relative aspect-[4/3] bg-black overflow-hidden">
            {collageImage ? (
              <img 
                src={collageImage} 
                alt="Collage" 
                className="w-full h-full object-contain bg-gradient-to-br from-purple-200 to-pink-200"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ 
                  filter: filters.find(f => f.id === selectedFilter)?.style || '',
                  transform: 'scaleX(-1)'
                }}
              />
            )}
            
            {/* Frame Overlay - only show when not showing collage */}
            {!collageImage && getFrameOverlay()}

            {/* Photo count indicator */}
            {!collageImage && capturedImages.length > 0 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-pink-500/80 px-4 py-1 rounded-full">
                <span className="text-white text-sm font-medium">
                  📸 {capturedImages.length}/3
                </span>
              </div>
            )}

            {/* Countdown */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50"
                >
                  <span className="text-8xl font-bold text-white drop-shadow-lg">{countdown}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flash Effect */}
            <AnimatePresence>
              {isCapturing && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white"
                />
              )}
            </AnimatePresence>

            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={collageCanvasRef} className="hidden" />
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4">
            {/* Frames */}
            <div>
              <p className="text-xs text-white/60 mb-2">Frames</p>
              <div className="flex gap-2 flex-wrap">
                {frames.map(frame => (
                  <Button
                    key={frame.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`flex items-center gap-1.5 ${
                      selectedFrame === frame.id 
                        ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span>{frame.emoji}</span>
                    <span className="text-xs">{frame.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <p className="text-xs text-white/60 mb-2">Filters</p>
              <div className="flex gap-2 flex-wrap">
                {filters.map(filter => (
                  <Button
                    key={filter.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`text-xs ${
                      selectedFilter === filter.id 
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              {collageImage ? (
                <>
                  <Button
                    variant="outline"
                    onClick={retake}
                    className="gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                  </Button>
                  <Button
                    onClick={downloadPhoto}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Download className="w-4 h-4" />
                    Save Collage
                  </Button>
                </>
              ) : (
                <Button
                  onClick={capturePhoto}
                  disabled={countdown !== null}
                  className="gap-2 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 px-8"
                >
                  <Camera className="w-4 h-4" />
                  {capturedImages.length === 0 ? 'Take 3 Photos' : `Photo ${capturedImages.length + 1} of 3`}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
