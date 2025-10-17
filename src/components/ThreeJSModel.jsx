import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows, Html, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Phoenix Bird Component
function Phoenix({ url }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, mixer, names } = useAnimations(animations, groupRef);

  // Start all animations when loaded
  React.useEffect(() => {
    if (!animations || animations.length === 0) return;
    animations.forEach((clip) => {
      const action = actions[clip.name];
      if (action) {
        action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();
        action.clampWhenFinished = false;
      }
    });
    return () => {
      if (mixer) mixer.stopAllAction();
    };
  }, [animations, actions, mixer]);

  // GSAP timeline: fly in from left, then toward camera
  React.useEffect(() => {
    if (!groupRef.current) return;
    const ctx = gsap.context(() => {
      const group = groupRef.current;
      // Initial state
      gsap.set(group.position, { x: -30, y: 20, z: -3 });
      gsap.set(group.rotation, { y: 0 });
      gsap.set(group.scale, { x: 1, y: 1, z: 1 });

      const faceZ = -Math.PI * 0.8;

      const tl = gsap.timeline({
       ease: 'power3.inOut',   
        smoothChildTiming: true
      });

      // Use parallel keyframes starting at time 0 to avoid any stop
      tl.to(group.position, {
        keyframes: [
          { x: 1,  y: -1, z: -1.2, duration: 3.0 },
          {               z: 1.5, duration: 1.6 },
          { x: -30,        z: 20, duration: 1.6 }
        ]
      }, 0)
      .to(group.rotation, {
        keyframes: [
          { y: 0,        duration: 3.0 },
          { y: faceZ,    duration: 1.6 },
          { y: faceZ,    duration: 1.6 }
        ]
      }, '<-0.1')
      .to(group.scale, {
        // Depth effect: small -> normal during the first leg, then big when approaching
        ease: 'sine.inOut',
        keyframes: [
          { x: 0.5, y: 1, z: 1, duration: 0.8 },     // shrink more at the very start
          { x: 1.0, y: 0.5, z: 0.5, duration: 2.2 },     // back to baseline by end of first leg (total ~3.0s)
          { x: 1.6, y: 1.6, z: 1.6, duration: 1.6 },     // grow as it moves toward camera
          { x: 1.6, y: 1.6, z: 1.6, duration: 1.6 }      // hold while sweeping out
        ]
      }, 0);

      // Optional: tl.timeScale(1.0)
    }, groupRef);
    return () => ctx.revert();
  }, []);

  // Debug: Log when model loads
  React.useEffect(() => {
    if (scene) {
      console.log('Phoenix model loaded:', scene, 'clips:', names);
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene, names]);

  useFrame((state) => {
    if (groupRef.current) {
      // Keep only a gentle roll so it doesn't fight GSAP's position
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  if (!scene) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={[0.005, 0.005, 0.005]} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

// Preload the model for faster subsequent loads
useGLTF.preload('/phoenix_bird/scene.gltf');

// Main ThreeJS Model Component
const ThreeJSModel = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1
    }}>
      <Canvas
        camera={{ 
          position: [0, 0, 3], 
          fov: 100 
        }}
        shadows
        gl={{ 
          antialias: true,
          alpha: true
        }}
        onCreated={({ camera, scene }) => {
          console.log('Canvas created, camera:', camera.position);
          console.log('Scene:', scene);
        }}
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 3, 0]} color="#4a90e2" intensity={0.5} />
        <hemisphereLight 
          skyColor="#87ceeb" 
          groundColor="#8b4513" 
          intensity={0.3} 
        />

        {/* Environment and Shadows */}
        <Environment preset="sunset" />
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4.5} 
        />

        {/* Phoenix Bird Model */}
        <Suspense fallback={
          <Html center>
            <div style={{ color: 'white', fontSize: '20px' }}>Loading Phoenix...</div>
          </Html>
        }>
          <Phoenix url="/phoenix_bird/scene.gltf" />
        </Suspense>

        {/* Orbit Controls for interaction */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={6}
        />
      </Canvas>
    </div>
  );
};

export default ThreeJSModel;
