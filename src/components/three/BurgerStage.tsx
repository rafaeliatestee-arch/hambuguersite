import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { BurgerModel } from './BurgerModel';

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
export function BurgerStage({ progressRef }: { progressRef: React.RefObject<number> }) {
  const [canRender, setCanRender] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setCanRender(supportsWebGL());
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  if (!canRender) {
    return (
      <div className="webgl-fallback" role="img" aria-label="Hambúrguer artesanal com queijo e vegetais frescos">
        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=85" alt="" />
      </div>
    );
  }
  return (
    <Canvas
      className="burger-canvas"
      shadows
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.5], fov: 35, near: .1, far: 50 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.6;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <ambientLight intensity={.9} color="#ffe5be" />
      <hemisphereLight args={['#ffe1b4', '#2b1007', 1.4]} />
      <spotLight position={[2.7, 5.5, 5.5]} intensity={130} angle={.6} penumbra={.9} color="#ffbf79" castShadow shadow-bias={-.0002} />
      <pointLight position={[-4, 1.4, 2.7]} intensity={65} color="#ffc478" distance={12} />
      <pointLight position={[2, .4, -3]} intensity={100} color="#be4325" distance={10} />
      <pointLight position={[-3, -3, 1]} intensity={22} color="#fff1d3" distance={8} />
      <Suspense fallback={null}>
        <BurgerModel progressRef={progressRef} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
