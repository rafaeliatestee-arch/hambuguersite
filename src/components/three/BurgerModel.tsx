import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { foodSurface } from './materials';
import * as THREE from 'three';
import {
  bunGeometry, pattyGeometry, lettuceGeometry, tomatoGeometry,
  cheeseGeometry, baconGeometry, sauceGeometry, seedPositions
} from './geometry';

type LayerName = 'base' | 'sauce' | 'lettuce' | 'tomato' | 'onion' | 'patty' | 'cheese' | 'bacon' | 'top';
type Layer = {
  name: LayerName;
  start: number;
  end: number;
  offset: [number, number, number];
  spin: [number, number, number];
};

const layers: Layer[] = [
  { name: 'base', start: 0, end: .13, offset: [0, -5.4, -2.2], spin: [-.38, 1.9, .25] },
  { name: 'sauce', start: .13, end: .21, offset: [-4.2, -1.6, 1], spin: [.1, -1.7, .6] },
  { name: 'lettuce', start: .17, end: .28, offset: [-4.8, .8, -1.1], spin: [.55, -2, -.6] },
  { name: 'tomato', start: .28, end: .38, offset: [4.3, 2.2, 1.2], spin: [-.8, 2.7, 1.3] },
  { name: 'onion', start: .33, end: .42, offset: [-4, 2.9, -2.5], spin: [1.3, -1.4, .6] },
  { name: 'patty', start: .42, end: .59, offset: [0, .8, -7], spin: [.7, -2.8, -.3] },
  { name: 'cheese', start: .59, end: .72, offset: [-1.3, 5.2, 2], spin: [1.5, .9, -.9] },
  { name: 'bacon', start: .72, end: .85, offset: [4.5, .5, 1.8], spin: [-.9, 2.5, 1.1] },
  { name: 'top', start: .85, end: 1, offset: [.4, 5.5, -3.4], spin: [1.1, -2.2, -.4] },
];
const yPositions: Record<LayerName, number> = {
  base: -.89, sauce: -.65, lettuce: -.56, tomato: -.42,
  onion: -.31, patty: -.08, cheese: .13, bacon: .27, top: .58,
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoother = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };

function Sesame() {
  const positions = useMemo(() => seedPositions(125), []);
  const instanced = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 9, 7), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffe2a8', roughness: .76 }), []);
  useLayoutEffect(() => {
    if (!instanced.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach((s, i) => {
      dummy.position.set(...s.position);
      dummy.rotation.set(...s.rotation);
      dummy.scale.set(.028 * s.scale, .016 * s.scale, .061 * s.scale);
      dummy.updateMatrix();
      instanced.current!.setMatrixAt(i, dummy.matrix);
    });
    instanced.current.instanceMatrix.needsUpdate = true;
  }, [positions]);
  return <instancedMesh ref={instanced} args={[geometry, material, positions.length]} castShadow />;
}

function BaseBun() {
  const geometry = useMemo(() => bunGeometry(false), []);
  const surface = useMemo(() => foodSurface('bread'), []);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors roughness={.87} metalness={0} side={THREE.DoubleSide} map={surface.albedo} normalMap={surface.normal} roughnessMap={surface.roughness} normalScale={new THREE.Vector2(.42, .42)} />
    </mesh>
  );
}
function TopBun() {
  const geometry = useMemo(() => bunGeometry(true), []);
  const surface = useMemo(() => foodSurface('bread'), []);
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={.67} metalness={.015} side={THREE.DoubleSide} map={surface.albedo} normalMap={surface.normal} roughnessMap={surface.roughness} normalScale={new THREE.Vector2(.42, .42)} />
      </mesh>
      <Sesame />
    </group>
  );
}
function Patty() {
  const geometry = useMemo(() => pattyGeometry(), []);
  const surface = useMemo(() => foodSurface('beef'), []);
  const flecks = useMemo(() => Array.from({ length: 80 }, (_, i) => {
    const theta = i * 2.39996;
    const r = Math.sqrt((i + .5) / 80) * .95;
    return { pos: [Math.cos(theta) * r, .154 + Math.sin(i * 2.7) * .009, Math.sin(theta) * r] as [number, number, number], scale: .011 + (i % 5) * .004 };
  }), []);
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={.83} metalness={.025} side={THREE.DoubleSide} map={surface.albedo} normalMap={surface.normal} roughnessMap={surface.roughness} normalScale={new THREE.Vector2(.7, .7)} />
      </mesh>
      <group>
        {flecks.map((f, i) => (
          <mesh key={i} position={f.pos} scale={[f.scale * 2, f.scale * .5, f.scale]} rotation={[0, i, 0]}>
            <sphereGeometry args={[1, 5, 4]} />
            <meshStandardMaterial color={i % 4 === 0 ? '#b2794b' : '#2a160e'} roughness={.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function Lettuce() {
  const a = useMemo(() => lettuceGeometry(2), []);
  const b = useMemo(() => lettuceGeometry(5), []);
  return (
    <group>
      <mesh geometry={a} rotation={[.08, .3, -.06]} position={[-.17, 0, .05]} castShadow>
        <meshStandardMaterial vertexColors roughness={.74} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={b} rotation={[-.12, 2, .09]} position={[.17, .015, -.09]} castShadow>
        <meshStandardMaterial vertexColors roughness={.76} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
function Tomato() {
  const geo = useMemo(() => tomatoGeometry(), []);
  return (
    <group>
      {[[-.34, 0, -.02], [.34, .055, .1]].map((p, j) => (
        <group key={j} position={p as [number, number, number]} scale={.72} rotation={[.03 * j, j * 1.1, 0]}>
          <mesh geometry={geo} castShadow receiveShadow>
            <meshStandardMaterial vertexColors roughness={.38} metalness={.01} side={THREE.DoubleSide} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => {
            const a = i / 8 * Math.PI * 2 + .18;
            return (
              <mesh key={i} position={[Math.cos(a) * .44, .055, Math.sin(a) * .44]} rotation={[0, a, 0]} scale={[.07, .012, .036]}>
                <sphereGeometry args={[1, 8, 6]} />
                <meshStandardMaterial color="#f2bf68" roughness={.65} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
function Onion() {
  return (
    <group>
      {[[.29, -.34, .02], [-.2, .19, 0], [.07, .02, .05]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2 + .1 * i, .2 * i, 0]}>
          <torusGeometry args={[.39 - i * .025, .036, 9, 64]} />
          <meshPhysicalMaterial color="#aa728a" roughness={.42} transmission={.08} thickness={.1} />
        </mesh>
      ))}
    </group>
  );
}
function Cheese() {
  const geo = useMemo(() => cheeseGeometry(), []);
  return (
    <mesh geometry={geo} castShadow receiveShadow rotation={[.06, .33, -.06]}>
      <meshStandardMaterial vertexColors roughness={.43} metalness={.01} side={THREE.DoubleSide} />
    </mesh>
  );
}
function Bacon() {
  const geo1 = useMemo(() => baconGeometry(1.5), []);
  const geo2 = useMemo(() => baconGeometry(4.2), []);
  const geo3 = useMemo(() => baconGeometry(6.5), []);
  return (
    <group>
      {([geo1, geo2, geo3] as THREE.BufferGeometry[]).map((geo, i) => (
        <mesh key={i} geometry={geo} rotation={[.02, i * 1.03 + .1, .03]} position={[0, .02 * i, 0]} castShadow>
          <meshStandardMaterial vertexColors roughness={.49} metalness={.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
function Sauce() {
  const geo = useMemo(() => sauceGeometry(), []);
  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial vertexColors roughness={.3} metalness={.03} side={THREE.DoubleSide} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[Math.cos(i * 1.63) * .83, -.055 - .025 * (i % 3), Math.sin(i * 1.63) * .83]} scale={[.09, .08 + i % 2 * .03, .085]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#e29350" roughness={.35} />
        </mesh>
      ))}
    </group>
  );
}
function Ingredient({ name }: { name: LayerName }) {
  switch (name) {
    case 'base': return <BaseBun />;
    case 'sauce': return <Sauce />;
    case 'lettuce': return <Lettuce />;
    case 'tomato': return <Tomato />;
    case 'onion': return <Onion />;
    case 'patty': return <Patty />;
    case 'cheese': return <Cheese />;
    case 'bacon': return <Bacon />;
    case 'top': return <TopBun />;
  }
}

export function BurgerModel({ progressRef, reducedMotion }: { progressRef: React.RefObject<number>; reducedMotion: boolean }) {
  const roots = useRef<(THREE.Group | null)[]>([]);
  const burgerGroup = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  useFrame(({ clock }, delta) => {
    const p = clamp01(progressRef.current);
    const assemblyP = clamp01((p - .20) / .78);
    const heroMix = smoother((p - .13) / .07);
    const compress = smoother((assemblyP - .94) / .06);
    const mobile = size.width < 720;
    const ease = reducedMotion ? 1 : 1 - Math.exp(-Math.min(delta, .05) * 12);
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i], group = roots.current[i];
      if (!group) continue;
      const inPlace = smoother((assemblyP - layer.start) / (layer.end - layer.start));
      const distance = heroMix * (1 - inPlace);
      const wobble = (1 - inPlace) * heroMix * .025 * Math.sin(clock.elapsedTime * 1.2 + i);
      const x = layer.offset[0] * distance;
      const y = yPositions[layer.name] + layer.offset[1] * distance -
        (layer.name === 'top' ? .045 : .009) * compress + wobble;
      const z = layer.offset[2] * distance;
      group.position.lerp(new THREE.Vector3(x, y, z), ease);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, layer.spin[0] * distance, ease);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, layer.spin[1] * distance, ease);
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, layer.spin[2] * distance, ease);
      const scale = 1 - distance * (layer.name === 'patty' ? .29 : .1);
      group.scale.lerp(new THREE.Vector3(scale, scale, scale), ease);
    }
    if (burgerGroup.current) {
      const heroX = mobile ? 0 : 1.15;
      const heroY = mobile ? -.38 : -.06;
      const x = THREE.MathUtils.lerp(heroX, 0, heroMix);
      burgerGroup.current.position.x = THREE.MathUtils.lerp(burgerGroup.current.position.x, x, ease);
      burgerGroup.current.position.y = THREE.MathUtils.lerp(burgerGroup.current.position.y, heroY * (1 - heroMix), ease);
      const targetRot = .18 + Math.sin(clock.elapsedTime * .32) * (reducedMotion ? 0 : .055)
        + Math.sin(assemblyP * Math.PI) * .18 + compress * .34;
      burgerGroup.current.rotation.y = THREE.MathUtils.lerp(burgerGroup.current.rotation.y, targetRot, ease);
      const targetScale = mobile ? (1 - heroMix) * .86 + heroMix * .79 : 1.0 + (1 - heroMix) * .21;
      burgerGroup.current.scale.setScalar(THREE.MathUtils.lerp(burgerGroup.current.scale.x, targetScale, ease));
    }
    const zoom = 6.5 - Math.sin(assemblyP * Math.PI) * .53 + compress * .52;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, mobile ? zoom + 1.5 : zoom, ease);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, .12 + .13 * Math.sin(assemblyP * Math.PI), ease);
    camera.lookAt(0, mobile && !heroMix ? -.15 : 0, 0);
  });
  return (
    <group ref={burgerGroup}>
      {layers.map((layer, i) => (
        <group
          key={layer.name}
          ref={node => { roots.current[i] = node; }}
          position={[0, yPositions[layer.name], 0]}
        >
          <Ingredient name={layer.name} />
        </group>
      ))}
    </group>
  );
}
