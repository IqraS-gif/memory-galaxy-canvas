import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Heart, Camera, Gamepad2, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface FloatingStar {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Landing() {
  const [stars, setStars] = useState<FloatingStar[]>([]);

  useEffect(() => {
    const newStars: FloatingStar[] = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      });
    }
    setStars(newStars);
  }, []);

  const features = [
    {
      icon: Star,
      title: 'Memory Stars',
      description: 'Each photo becomes a glowing star in your personal constellation',
    },
    {
      icon: Heart,
      title: 'Emotional Mapping',
      description: 'Tag your memories with emotions and watch patterns emerge',
    },
    {
      icon: Camera,
      title: 'Photo Booth',
      description: 'Capture new moments directly into your cosmic collection',
    },
    {
      icon: Gamepad2,
      title: 'Mini Games',
      description: 'Play Asteroid Dodge while exploring your memory galaxy',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
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
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo/Icon */}
            <motion.div
              className="mb-8 inline-flex"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="relative">
                <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-primary blur-md" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-glow">
              <span className="text-foreground">Memory</span>
              <br />
              <span className="text-primary">Constellation</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-muted-foreground text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Transform your precious memories into a stunning cosmic map. 
              Watch your photos become stars in your personal galaxy.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/app">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary via-yellow-400 to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-all duration-300 text-primary-foreground font-semibold px-8 py-6 text-lg"
                >
                  <Play className="w-5 h-5" />
                  Explore Your Stars
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-border/50 hover:bg-secondary/50 px-8 py-6 text-lg"
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Your Memories, <span className="text-primary">Reimagined</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience your photo collection like never before with these cosmic features
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300">
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
              
              <div className="relative z-10">
                <motion.div
                  className="mb-6 inline-flex"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Star className="w-12 h-12 text-primary" />
                </motion.div>
                
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Ready to Map Your Memories?
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                  Start creating your personal constellation today and see your memories shine like never before.
                </p>
                
                <Link to="/app">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-purple-500 via-primary to-pink-500 hover:shadow-[0_0_40px_hsl(var(--primary)/0.4)] transition-all duration-300 text-primary-foreground font-semibold px-10 py-6 text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border/30">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground text-sm">
              Memory Constellation • Transform memories into stars
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
