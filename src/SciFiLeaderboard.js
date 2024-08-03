import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Sparkles, Zap, Flame, Wind, Droplets, Award, ChevronDown, Star, X, Scroll, Trophy, Target, Calendar, CheckCircle, Milestone } from 'lucide-react';
import * as THREE from 'three';

// Particle System
const ParticleSystem = () => {
  const particlesRef = useRef();
  const { viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particlesRef.current.rotation.y = time * 0.05;
    particlesRef.current.rotation.x = time * 0.03;
  });

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const colors = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    return [positions, colors];
  }, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors />
    </points>
  );
};

// Interactive Background
const InteractiveBackground = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ParticleSystem />
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

// Holographic Display
const HolographicDisplay = ({ children }) => {
  return (
    <motion.div
      className="relative bg-blue-500 bg-opacity-10 rounded-xl p-6 backdrop-filter backdrop-blur-sm border border-blue-300 border-opacity-30 shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-10 rounded-xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Player Card
const PlayerCard = ({ player, rank }) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 mb-4 relative overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="flex items-center">
        <div className="mr-4 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {rank}
          </div>
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Trophy size={16} />
          </motion.div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{player.name}</h3>
          <p className="text-blue-300">{player.character}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold text-yellow-400">{player.score}</p>
          <p className="text-sm text-gray-400">points</p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Leaderboard Component
const SciFiLeaderboard = ({ players }) => {
  const [sortedPlayers, setSortedPlayers] = useState([]);

  useEffect(() => {
    setSortedPlayers([...players].sort((a, b) => b.score - a.score));
  }, [players]);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <InteractiveBackground />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-12">
        <HolographicDisplay>
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Galactic Leaderboard
          </h1>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <PlayerCard key={player.id} player={player} rank={index + 1} />
            ))}
          </div>
        </HolographicDisplay>
      </div>
    </div>
  );
};
export { InteractiveBackground };
export default SciFiLeaderboard;