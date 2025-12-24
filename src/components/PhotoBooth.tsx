import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Download, RotateCcw, Sparkles, Star, Moon, Rocket, Orbit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PhotoBoothProps {
  isOpen: boolean;
  onClose: () => void;
}

type SpaceFrame = 'none' | 'astronaut' | 'planets' | 'stars' | 'nebula' | 'rocket';
type SpaceFilter = 'none' | 'cosmic' | 'aurora' | 'sunset' | 'midnight' | 'galaxy';

const frames: { id: SpaceFrame; name: string; icon: React.ReactNode }[] = [
  { id: 'none', name: 'None', icon: <X className="w-4 h-4" /> },
  { id: 'astronaut', name: 'Astronaut', icon: <Moon className="w-4 h-4" /> },
  { id: 'planets', name: 'Planets', icon: <Orbit className="w-4 h-4" /> },
  { id: 'stars', name: 'Stars', icon: <Star className="w-4 h-4" /> },
  { id: 'nebula', name: 'Nebula', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'rocket', name: 'Rocket', icon: <Rocket className="w-4 h-4" /> },
];

const filters: { id: SpaceFilter; name: string; style: string }[] = [
  { id: 'none', name: 'None', style: '' },
  { id: 'cosmic', name: 'Cosmic', style: 'hue-rotate(280deg) saturate(1.5)' },
  { id: 'aurora', name: 'Aurora', style: 'hue-rotate(120deg) saturate(1.3) brightness(1.1)' },
  { id: 'sunset', name: 'Sunset', style: 'sepia(0.3) saturate(1.4) hue-rotate(-20deg)' },
  { id: 'midnight', name: 'Midnight', style: 'brightness(0.8) contrast(1.2) saturate(0.8)' },
  { id: 'galaxy', name: 'Galaxy', style: 'hue-rotate(200deg) saturate(1.8) contrast(1.1)' },
];

export const PhotoBooth = ({ isOpen, onClose }: PhotoBoothProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<SpaceFrame>('none');
  const [selectedFilter, setSelectedFilter] = useState<SpaceFilter>('none');
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

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
      setCapturedImage(null);
    }
    return () => stopCamera();
  }, [isOpen]);

  const capturePhoto = useCallback(() => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCapturing(true);
            setTimeout(() => {
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
                  ctx.drawImage(video, 0, 0);
                  ctx.filter = 'none';
                  setCapturedImage(canvas.toDataURL('image/png'));
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
  }, [selectedFilter]);

  const downloadPhoto = useCallback(() => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `space-memory-${Date.now()}.png`;
    link.href = capturedImage;
    link.click();
    toast.success('Photo saved to downloads!');
  }, [capturedImage]);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const getFrameOverlay = () => {
    switch (selectedFrame) {
      case 'astronaut':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-full border-[20px] border-slate-700/80" 
                 style={{ 
                   margin: '5%',
                   boxShadow: 'inset 0 0 60px rgba(100, 200, 255, 0.3), 0 0 40px rgba(0,0,0,0.5)'
                 }} />
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 bg-gradient-to-b from-slate-600 to-slate-800 px-6 py-1 rounded-full text-xs text-cyan-300 font-mono">
              ASTRONAUT MODE
            </div>
          </div>
        );
      case 'planets':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-600 opacity-80" />
            <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-600 opacity-70" />
            <div className="absolute top-1/4 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 opacity-60" />
            <div className="absolute bottom-1/3 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 opacity-70" 
                 style={{ boxShadow: '10px 0 0 rgba(200,150,255,0.3)' }} />
          </div>
        );
      case 'stars':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: '0 0 4px 2px rgba(255,255,255,0.5)',
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            <div className="absolute top-3 right-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              </motion.div>
            </div>
          </div>
        );
      case 'nebula':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />
            <div className="absolute top-0 left-0 w-full h-full"
                 style={{
                   background: 'radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255, 20, 147, 0.25) 0%, transparent 50%)',
                 }} />
            <motion.div 
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        );
      case 'rocket':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute bottom-4 right-4"
              animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket className="w-16 h-16 text-slate-300 -rotate-45" />
              <motion.div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-8"
                style={{ background: 'linear-gradient(to bottom, #ff6b35, #ff4500, transparent)' }}
                animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            </motion.div>
            <div className="absolute bottom-2 left-2 text-xs text-cyan-400 font-mono bg-black/50 px-2 py-1 rounded">
              🚀 LAUNCH MODE
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
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover"
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
            
            {/* Frame Overlay */}
            {getFrameOverlay()}

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
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {frame.icon}
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
              {capturedImage ? (
                <>
                  <Button
                    variant="outline"
                    onClick={retake}
                    className="gap-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake
                  </Button>
                  <Button
                    onClick={downloadPhoto}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Download className="w-4 h-4" />
                    Save Photo
                  </Button>
                </>
              ) : (
                <Button
                  onClick={capturePhoto}
                  disabled={countdown !== null}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8"
                >
                  <Camera className="w-4 h-4" />
                  Capture
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
