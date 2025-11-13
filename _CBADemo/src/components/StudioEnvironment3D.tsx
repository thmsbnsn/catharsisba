const StudioEnvironment3D = () => {
  return (
    <group>
      {/* Concrete floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      {/* Back wall - red accent */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#8b2e2e" 
          metalness={0.1} 
          roughness={0.8}
        />
      </mesh>

      {/* Left wall - concrete */}
      <mesh position={[-10, 3, 4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#4a4a4a" 
          metalness={0.1} 
          roughness={0.9}
        />
      </mesh>

      {/* Right wall - beige accent */}
      <mesh position={[10, 3, 4]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#9a8b7a" 
          metalness={0.1} 
          roughness={0.8}
        />
      </mesh>

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Main key light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light */}
      <directionalLight
        position={[-5, 5, 3]}
        intensity={0.5}
      />

      {/* Gold accent spotlight */}
      <spotLight
        position={[0, 6, 2]}
        angle={0.3}
        penumbra={0.5}
        intensity={0.8}
        color="#d4af37"
        castShadow
      />

      {/* Rim light */}
      <pointLight
        position={[0, 4, -4]}
        intensity={0.6}
        color="#ff4444"
      />
    </group>
  );
};

export default StudioEnvironment3D;
