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

// Create star shape geometry
const createStarShape = (innerRadius: number, outerRadius: number, points: number): THREE.Shape => {
  const shape = new THREE.Shape();
  const step = Math.PI / points;
  
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
};

// 3D Star component with star shape
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
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const color = getMoodColor(memory.mood);
  
  // Create star geometry
  const starGeometry = useMemo(() => {
    const starShape = createStarShape(0.08, 0.2, 5);
    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2
    };
    return new THREE.ExtrudeGeometry(starShape, extrudeSettings);
  }, []);

  // Vary star size based on index
  const scale = 0.8 + (index % 5) * 0.15;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
      const pulseScale = scale * (1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1);
      meshRef.current.scale.setScalar(pulseScale);
    }
    if (glowRef.current) {
      const glowScale = 2 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.4;
      glowRef.current.scale.setScalar(glowScale);
    }
    if (innerGlowRef.current) {
      const innerScale = 1.3 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
      innerGlowRef.current.scale.setScalar(innerScale);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      
      {/* Inner glow sphere */}
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      
      {/* Main star shape */}
      <mesh 
        ref={meshRef} 
        geometry={starGeometry}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Bright core point */}
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Label */}
      <Html
        position={[0, 0.6, 0]}
        center
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs text-foreground border border-border/50 shadow-lg">
          {memory.title}
        </div>
      </Html>
    </group>
  );
};

// Constellation lines with gradient effect
const ConstellationLines3D = ({ memories }: { memories: Memory[] }) => {
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
          lineWidth={3}
          transparent
          opacity={0.7}
        />
      ))}
    </>
  );
};

// Enhanced floating particles
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(800 * 3);
    const colors = new Float32Array(800 * 3);
    
    for (let i = 0; i < 800; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      
      // Random colors: blue, cyan, purple, white
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i * 3] = 0.3; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.5) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.9;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Nebula cloud effect
const NebulaCloud = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[40, 40]} />
      <meshBasicMaterial 
        color="#1a3a5c" 
        transparent 
        opacity={0.3}
      />
    </mesh>
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
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4488ff" />
        <pointLight position={[0, 10, -5]} intensity={0.4} color="#aa66ff" />
        
        {/* Background stars */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={5} 
          saturation={0.8} 
          fade 
          speed={0.3}
        />
        
        {/* Nebula effect */}
        <NebulaCloud />
        
        {/* Floating particles */}
        <Particles />
        
        {/* Constellation lines */}
        <ConstellationLines3D memories={memories} />
        
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
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.2}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>
    </div>
  );
};
