import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Memory, Mood } from '@/types/memory';

interface Constellation3DViewProps {
  memories: Memory[];
  onStarClick: (memory: Memory) => void;
}

const getMoodColor = (mood: Mood): string => {
  switch (mood) {
    case 'happy': return '#FFD700';
    case 'calm': return '#00BFFF';
    case 'nostalgic': return '#DA70D6';
    default: return '#FFFFFF';
  }
};

// 3D Star component
const Star3D = ({ 
  memory, 
  position, 
  onClick,
  index 
}: { 
  memory: Memory; 
  position: [number, number, number]; 
  onClick: () => void;
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = getMoodColor(memory.mood);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      const glowScale = 1.5 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.3;
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group position={position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      
      {/* Main star */}
      <mesh 
        ref={meshRef} 
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Label */}
      <Html
        position={[0, 0.5, 0]}
        center
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-foreground border border-border/50">
          {memory.title}
        </div>
      </Html>
    </group>
  );
};

// Constellation lines
const ConstellationLines = ({ memories }: { memories: Memory[] }) => {
  const sortedMemories = useMemo(() => 
    [...memories].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ), [memories]);

  const positions = useMemo(() => 
    sortedMemories.map((m) => {
      const x = ((m.position.x / window.innerWidth) - 0.5) * 10;
      const y = ((1 - m.position.y / window.innerHeight) - 0.5) * 6;
      const z = (Math.random() - 0.5) * 2;
      return [x, y, z] as [number, number, number];
    }), [sortedMemories]);

  if (positions.length < 2) return null;

  return (
    <>
      {positions.slice(0, -1).map((pos, i) => (
        <Line
          key={i}
          points={[pos, positions[i + 1]]}
          color={getMoodColor(sortedMemories[i].mood)}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </>
  );
};

// Floating particles
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#88ccff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const Constellation3DView = ({ memories, onStarClick }: Constellation3DViewProps) => {
  const positions = useMemo(() => 
    memories.map((m) => {
      const x = ((m.position.x / window.innerWidth) - 0.5) * 10;
      const y = ((1 - m.position.y / window.innerHeight) - 0.5) * 6;
      const z = (Math.random() - 0.5) * 2;
      return [x, y, z] as [number, number, number];
    }), [memories]);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#4488ff" />
        
        {/* Background stars */}
        <Stars 
          radius={100} 
          depth={50} 
          count={3000} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={0.5}
        />
        
        {/* Floating particles */}
        <Particles />
        
        {/* Constellation lines */}
        <ConstellationLines memories={memories} />
        
        {/* Memory stars */}
        {memories.map((memory, index) => (
          <Star3D
            key={memory.id}
            memory={memory}
            position={positions[index]}
            onClick={() => onStarClick(memory)}
            index={index}
          />
        ))}
        
        {/* Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
