import { useRef } from 'react';
import { Mesh } from 'three';

const TattooChair3D = () => {
  const chairRef = useRef<Mesh>(null);

  return (
    <group position={[0, -1, 0]}>
      {/* Chair base */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hydraulic lift */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Seat base */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.15, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Seat cushion */}
      <mesh ref={chairRef} position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.2, 0.3, 1.0]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Backrest support */}
      <mesh position={[0, 1.6, -0.4]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 1.0, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 2.0, -0.5]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 1.2, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Armrests */}
      <mesh position={[0.7, 1.4, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.7, 1.4, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Gold accent strips */}
      <mesh position={[0, 1.25, 0.51]}>
        <boxGeometry args={[1.1, 0.05, 0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} emissive="#d4af37" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.0, -0.36]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.05]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} emissive="#d4af37" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

export default TattooChair3D;
