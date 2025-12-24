import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw, Trophy, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AsteroidDodgeGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Asteroid {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const AsteroidDodgeGame = ({ isOpen, onClose }: AsteroidDodgeGameProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('asteroidDodgeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [shipPosition, setShipPosition] = useState({ x: 50, y: 80 });
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const asteroidIdRef = useRef(0);
  const difficultyRef = useRef(1);

  // Generate background stars
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
      });
    }
    setStars(newStars);
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setShipPosition({ x: 50, y: 80 });
    difficultyRef.current = 1;
    asteroidIdRef.current = 0;
    
    // Spawn initial asteroids immediately
    const initialAsteroids: Asteroid[] = [];
    for (let i = 0; i < 5; i++) {
      initialAsteroids.push({
        id: asteroidIdRef.current++,
        x: Math.random() * 90 + 5,
        y: Math.random() * 40 - 20, // Start above and in the top portion
        size: Math.random() * 6 + 4,
        speed: Math.random() * 0.3 + 0.3,
        rotation: Math.random() * 360,
      });
    }
    setAsteroids(initialAsteroids);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  const endGame = useCallback(() => {
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('asteroidDodgeHighScore', score.toString());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [score, highScore]);

  // Handle mouse/touch movement
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (gameState !== 'playing' || !gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setShipPosition({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    });
  }, [gameState]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleMove]);

  // Check collision
  const checkCollision = useCallback((asteroid: Asteroid) => {
    const shipSize = 4;
    const dx = Math.abs(asteroid.x - shipPosition.x);
    const dy = Math.abs(asteroid.y - shipPosition.y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const collisionDistance = (asteroid.size / 2) + shipSize;
    
    return distance < collisionDistance;
  }, [shipPosition]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      
      if (deltaTime > 16) { // ~60fps
        lastTimeRef.current = timestamp;
        
        // Increase difficulty over time
        difficultyRef.current = 1 + Math.floor(score / 100) * 0.2;
        
        // Spawn asteroids
        if (Math.random() < 0.02 * difficultyRef.current) {
          const newAsteroid: Asteroid = {
            id: asteroidIdRef.current++,
            x: Math.random() * 90 + 5,
            y: -10,
            size: Math.random() * 6 + 4,
            speed: (Math.random() * 0.3 + 0.2) * difficultyRef.current,
            rotation: Math.random() * 360,
          };
          setAsteroids(prev => [...prev, newAsteroid]);
        }
        
        // Update asteroids
        setAsteroids(prev => {
          const updated = prev
            .map(asteroid => ({
              ...asteroid,
              y: asteroid.y + asteroid.speed,
              rotation: asteroid.rotation + asteroid.speed * 2,
            }))
            .filter(asteroid => asteroid.y < 110);
          
          // Check collisions
          for (const asteroid of updated) {
            if (checkCollision(asteroid)) {
              endGame();
              return prev;
            }
          }
          
          return updated;
        });
        
        // Update score
        setScore(prev => prev + 1);
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, checkCollision, endGame, score]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setGameState('menu');
      resetGame();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isOpen, resetGame]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg aspect-[3/4] bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Background stars */}
            <div className="absolute inset-0 overflow-hidden">
              {stars.map(star => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>

            {/* Game area */}
            <div
              ref={gameRef}
              className="absolute inset-0 cursor-none"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Asteroids */}
              {asteroids.map(asteroid => (
                <motion.div
                  key={asteroid.id}
                  className="absolute"
                  style={{
                    left: `${asteroid.x}%`,
                    top: `${asteroid.y}%`,
                    width: `${asteroid.size}%`,
                    height: `${asteroid.size}%`,
                    transform: `translate(-50%, -50%) rotate(${asteroid.rotation}deg)`,
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                    <polygon
                      points="50,5 80,25 95,55 75,90 40,95 10,70 5,40 25,15"
                      fill="#6b7280"
                      stroke="#9ca3af"
                      strokeWidth="3"
                    />
                    <circle cx="35" cy="40" r="8" fill="#4b5563" />
                    <circle cx="60" cy="55" r="6" fill="#4b5563" />
                    <circle cx="45" cy="70" r="5" fill="#4b5563" />
                  </svg>
                </motion.div>
              ))}

              {/* Spaceship */}
              {gameState === 'playing' && (
                <motion.div
                  className="absolute w-10 h-12 pointer-events-none"
                  style={{
                    left: `${shipPosition.x}%`,
                    top: `${shipPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                  }}
                >
                  {/* Rocket ship */}
                  <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                    {/* Flame */}
                    <motion.ellipse
                      cx="20"
                      cy="48"
                      rx="6"
                      ry="8"
                      fill="url(#flameGradient)"
                      animate={{
                        ry: [8, 12, 8],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 0.15,
                        repeat: Infinity,
                      }}
                    />
                    <defs>
                      <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    {/* Body */}
                    <path
                      d="M20 2 L32 35 L26 40 L14 40 L8 35 Z"
                      fill="url(#rocketGradient)"
                      stroke="#a78bfa"
                      strokeWidth="1"
                    />
                    <defs>
                      <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                    {/* Window */}
                    <circle cx="20" cy="18" r="6" fill="#87CEEB" stroke="#60a5fa" strokeWidth="1" />
                    <circle cx="18" cy="16" r="2" fill="white" opacity="0.6" />
                    {/* Fins */}
                    <path d="M8 35 L2 42 L8 40 Z" fill="#c084fc" />
                    <path d="M32 35 L38 42 L32 40 Z" fill="#c084fc" />
                  </svg>
                </motion.div>
              )}

              {/* Score display */}
              {gameState === 'playing' && (
                <div className="absolute top-4 left-4 text-white">
                  <p className="text-2xl font-bold font-display">{score}</p>
                  <p className="text-xs text-white/60">SCORE</p>
                </div>
              )}

              {/* Menu screen */}
              {gameState === 'menu' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="mb-6"
                  >
                    <Rocket className="w-20 h-20 text-purple-400" />
                  </motion.div>
                  
                  <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">
                    Asteroid Dodge
                  </h1>
                  <p className="text-white/60 text-sm mb-8 text-center">
                    Move your ship to avoid the asteroids!
                  </p>
                  
                  {highScore > 0 && (
                    <div className="flex items-center gap-2 text-yellow-400 mb-6">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold">High Score: {highScore}</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={startGame}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-6 text-lg"
                  >
                    <Play className="w-5 h-5" />
                    Play
                  </Button>
                  
                  <p className="text-white/40 text-xs mt-6 text-center">
                    Use mouse or touch to control
                  </p>
                </motion.div>
              )}

              {/* Game over screen */}
              {gameState === 'gameover' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/50"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <div className="text-6xl">💥</div>
                  </motion.div>
                  
                  <h2 className="text-3xl font-display font-bold text-white mb-2">
                    Game Over!
                  </h2>
                  
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-purple-400 mb-1">{score}</p>
                    <p className="text-white/60 text-sm">FINAL SCORE</p>
                  </div>
                  
                  {score >= highScore && score > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 text-yellow-400 mb-6"
                    >
                      <Trophy className="w-6 h-6" />
                      <span className="font-bold text-lg">New High Score!</span>
                    </motion.div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={startGame}
                      className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Play Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Exit
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
