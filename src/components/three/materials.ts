import * as THREE from 'three';

// Small, procedural PBR maps: no external textures, CORS, or placeholder cubes.
// Albedo modulates existing vertex colors; normal/roughness add fine food detail.
export type FoodSurface = { albedo: THREE.DataTexture; normal: THREE.DataTexture; roughness: THREE.DataTexture };
const cache = new Map<string, FoodSurface>();
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function hash(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 73.13) * 43758.5453;
  return n - Math.floor(n);
}
function noise(x: number, y: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
  return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
}
function fractal(x: number, y: number, seed: number) {
  return .55 * noise(x * 12, y * 12, seed)
       + .3 * noise(x * 45, y * 45, seed + 2)
       + .15 * noise(x * 112, y * 112, seed + 7);
}
function texture(data: Uint8Array, size: number, color = false) {
  const value = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  value.wrapS = THREE.RepeatWrapping;
  value.wrapT = THREE.RepeatWrapping;
  value.repeat.set(2.4, 2.2);
  value.anisotropy = 4;
  value.generateMipmaps = true;
  value.minFilter = THREE.LinearMipmapLinearFilter;
  if (color) value.colorSpace = THREE.SRGBColorSpace;
  value.needsUpdate = true;
  return value;
}
export function foodSurface(kind: 'bread' | 'beef'): FoodSurface {
  const existing = cache.get(kind);
  if (existing) return existing;
  const size = 256, seed = kind === 'bread' ? 4 : 23;
  const albedo = new Uint8Array(size * size * 4);
  const normal = new Uint8Array(size * size * 4);
  const roughness = new Uint8Array(size * size * 4);
  const bump = (u: number, v: number) => {
    const f = fractal(u, v, seed);
    const pores = noise(u * 230, v * 230, seed + 13);
    return (f - .5) * (kind === 'bread' ? .62 : .95) + (pores - .5) * .18;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const i = (y * size + x) * 4;
      const h = bump(u, v);
      const dx = bump(u + 1 / size, v) - bump(u - 1 / size, v);
      const dy = bump(u, v + 1 / size) - bump(u, v - 1 / size);
      const scale = kind === 'bread' ? 4.8 : 6.2;
      const nx = -dx * scale, ny = -dy * scale, nz = 1;
      const inv = 1 / Math.hypot(nx, ny, nz);
      const shade = clamp(kind === 'bread' ? .89 + h * .22 : .84 + h * .28);
      const value = Math.round(shade * 255);
      albedo[i] = value;
      albedo[i + 1] = kind === 'bread' ? Math.min(255, value + 7) : value;
      albedo[i + 2] = kind === 'bread' ? Math.min(255, value + 13) : value;
      albedo[i + 3] = 255;
      normal[i] = Math.round((nx * inv * .5 + .5) * 255);
      normal[i + 1] = Math.round((ny * inv * .5 + .5) * 255);
      normal[i + 2] = Math.round((nz * inv * .5 + .5) * 255);
      normal[i + 3] = 255;
      const r = Math.round(clamp(kind === 'bread' ? .75 + h * .18 : .76 + h * .36) * 255);
      roughness[i] = r;
      roughness[i + 1] = r;
      roughness[i + 2] = r;
      roughness[i + 3] = 255;
    }
  }
  const maps = { albedo: texture(albedo, size, true), normal: texture(normal, size), roughness: texture(roughness, size) };
  cache.set(kind, maps);
  return maps;
}
