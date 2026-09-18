import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, TorusKnot, Box, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// INDIVIDUAL 3D SHAPES (GOAT fintech aesthetic)
// ============================================================================

function GlassSphere({ position, scale = 1, color = '#FF7A29' }: { position: [number, number, number]; scale?: number; color?: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      mesh.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 64, 64]} position={position} scale={scale}>
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={0.5}
        chromaticAberration={0.2}
        anisotropy={0.3}
        distortion={0.2}
        distortionScale={0.3}
        temporalDistortion={0.1}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        color={color}
        transmission={0.95}
        roughness={0.05}
        ior={1.5}
      />
    </Sphere>
  );
}

function GlossyTorus({ position, scale = 1, color = '#FF5C00' }: { position: [number, number, number]; scale?: number; color?: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <Torus ref={mesh} args={[1, 0.4, 32, 64]} position={position} scale={scale}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.1}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
        envMapIntensity={1}
      />
    </Torus>
  );
}

function ClayBlob({ position, scale = 1, color = '#F59E0B' }: { position: [number, number, number]; scale?: number; color?: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1, 32, 32]} position={position} scale={scale}>
        <MeshWobbleMaterial
          factor={0.3}
          speed={2}
          color={color}
        />
      </Sphere>
    </Float>
  );
}

function GlowingCore({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      mesh.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <Sphere ref={mesh} args={[0.5, 32, 32]} position={position} scale={scale}>
      <meshBasicMaterial color="#FFD700" toneMapped={false} />
    </Sphere>
  );
}

function OrbitRing({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Torus ref={mesh} args={[2, 0.02, 16, 100]} position={position} scale={scale}>
      <meshBasicMaterial color="#FF7A29" transparent opacity={0.6} toneMapped={false} />
    </Torus>
  );
}

// ============================================================================
// MAIN 3D SCENE
// ============================================================================

function Scene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#FF7A29" />
      <pointLight position={[0, 0, 5]} intensity={2} color="#FFD700" distance={10} />
      <pointLight position={[-5, 5, 0]} intensity={1} color="#FF5C00" distance={15} />
      
      {/* Central Glass Sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <GlassSphere position={[0, 0, 0]} scale={1.8} color="#FF7A29" />
      </Float>

      {/* Inner Glowing Core */}
      <GlowingCore position={[0, 0, 0]} scale={0.8} />

      {/* Orbit Ring */}
      <OrbitRing position={[0, 0, 0]} scale={1} />

      {/* Floating Clay Blobs */}
      <ClayBlob position={[-3, 1.5, -1]} scale={0.6} color="#EC4899" />
      <ClayBlob position={[3, -1, 1]} scale={0.5} color="#8B5CF6" />
      <ClayBlob position={[-2, -2, 2]} scale={0.4} color="#3B82F6" />
      <ClayBlob position={[2.5, 2, -2]} scale={0.35} color="#10B981" />

      {/* Glossy Torus */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.8}>
        <GlossyTorus position={[2.5, 0.5, 1]} scale={0.8} color="#FF5C00" />
      </Float>

      {/* Small floating spheres */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.15, 16, 16]} position={[-1.5, 2, 1]}>
          <meshPhysicalMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Sphere>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
        <Sphere args={[0.1, 16, 16]} position={[1.8, -1.5, 0.5]}>
          <meshPhysicalMaterial color="#FF7A29" metalness={0.8} roughness={0.2} />
        </Sphere>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.12, 16, 16]} position={[-2.5, -0.5, 1.5]}>
          <meshPhysicalMaterial color="#EC4899" metalness={0.8} roughness={0.2} />
        </Sphere>
      </Float>
    </>
  );
}

// ============================================================================
// EXPORTED COMPONENT
// ============================================================================

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
}
