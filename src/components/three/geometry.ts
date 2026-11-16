import * as THREE from 'three';

// All geometries are authored here: this is a real, editable 3D mesh system,
// not image planes or primitive cylinders stacked to imitate food.
const TAU = Math.PI * 2;
const hash = (x: number) => {
  const y = Math.sin(x * 127.1 + 17.17) * 43758.5453123;
  return y - Math.floor(y);
};
const wave = (t: number, seed: number) =>
  Math.sin(t * 5 + seed) * 0.018 +
  Math.sin(t * 11 - seed * 3) * 0.013 +
  Math.cos(t * 23 + seed * 2) * 0.009;

type Ring = [radius: number, y: number];
function radialMesh(rings: Ring[], segments: number, colorAt: (r: number, angle: number, i: number) => THREE.Color, seed: number) {
  const positions: number[] = [];
  const colors: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  rings.forEach(([radius, y], ring) => {
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const theta = t * TAU;
      const r = Math.max(0.001, radius * (1 + wave(theta, seed) * (0.2 + radius)));
      const micro = radius > 0.03 ? (hash(i * 7.7 + ring * 19.2 + seed) - 0.5) * 0.013 : 0;
      positions.push(Math.cos(theta) * (r + micro), y + micro * 0.32, Math.sin(theta) * (r + micro));
      const c = colorAt(radius, theta, ring);
      colors.push(c.r, c.g, c.b);
      uv.push(t, ring / Math.max(1, rings.length - 1));
    }
  });
  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let i = 0; i < segments; i++) {
      const a = ring * (segments + 1) + i;
      const b = a + 1;
      const c = a + segments + 1;
      indices.push(a, b, c, b, c + 1, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function bunGeometry(top: boolean) {
  const rings: Ring[] = top
    ? [[0, .37], [.18, .37], [.38, .34], [.56, .31], [.74, .25], [.9, .17], [1, .075], [1.025, -.005], [1, -.075], [.83, -.105], [.5, -.11], [0, -.11]]
    : [[0, .125], [.27, .126], [.55, .125], [.8, .12], [.98, .087], [1.035, .02], [1.01, -.16], [.96, -.27], [.73, -.30], [.38, -.31], [0, -.31]];
  return radialMesh(rings, 96, (r, a, i) => {
    const inner = i > rings.length - 4;
    const c = new THREE.Color(inner ? '#e9be77' : '#c87832');
    const freckles = (hash(a * 97 + i * 29) - 0.5) * 0.24 + Math.sin(a * 13 + r * 19) * 0.035;
    c.multiplyScalar(inner ? 1 + freckles * .4 : 1 + freckles - r * .085);
    return c;
  }, top ? 3 : 5);
}
export function pattyGeometry() {
  const rings: Ring[] = [[0, .145], [.25, .16], [.48, .15], [.7, .13], [.91, .095], [1.035, .025], [1.06, -.06], [1.03, -.14], [.94, -.17], [.7, -.18], [.35, -.18], [0, -.18]];
  return radialMesh(rings, 112, (r, a, i) => {
    const burnt = hash(a * 88 + i * 7.4) * .26;
    const grill = Math.pow(Math.max(0, Math.sin(a * 8 + r * 15)), 10) * .1;
    return new THREE.Color('#63321f').multiplyScalar(.72 + burnt - grill + Math.sin(a * 17 + i * 4) * .065);
  }, 13);
}
export function lettuceGeometry(seed: number) {
  const segments = 100;
  const rings = 14;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    for (let i = 0; i <= segments; i++) {
      const a = i / segments * TAU;
      const ridge = 1 + Math.sin(a * 9 + seed) * .055 + Math.cos(a * 17 - seed) * .04;
      const r = v * (1.03 + .1 * Math.sin(a * 3 + seed)) * ridge;
      const crinkle = Math.pow(v, 3) * (Math.sin(a * 14 + seed) * .105 + Math.cos(a * 26) * .035);
      const y = Math.sin(v * Math.PI) * .052 + crinkle;
      positions.push(Math.cos(a) * r, y, Math.sin(a) * r * .83);
      const vein = Math.pow(Math.max(0, Math.cos(a * 11 + seed)), 20) * .10;
      const col = new THREE.Color('#6a9a35').multiplyScalar(0.75 + .29 * v + vein + .09 * Math.sin(a * 19 + seed));
      colors.push(col.r, col.g, col.b);
      if (j < rings && i < segments) {
        const n = j * (segments + 1) + i;
        indices.push(n, n + 1, n + segments + 1, n + 1, n + segments + 2, n + segments + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
export function tomatoGeometry() {
  const rings: Ring[] = [[0, .048], [.3, .052], [.63, .052], [.84, .046], [.93, .025], [.96, -.024], [.82, -.047], [.4, -.052], [0, -.052]];
  return radialMesh(rings, 72, (r, a, i) => {
    const c = new THREE.Color(r > .84 ? '#bd241c' : '#ed4a2e');
    const pocket = Math.pow(Math.abs(Math.sin(a * 4)), 5) * .14;
    c.multiplyScalar(.91 + .08 * Math.cos(a * 13) - (r < .85 ? pocket : 0) - (i > 5 ? .1 : 0));
    return c;
  }, 19);
}
export function cheeseGeometry() {
  const segments = 96;
  const rings = 21;
  const pos: number[] = [], cols: number[] = [], indices: number[] = [];
  for (let j = 0; j <= rings; j++) {
    const v = j / rings;
    for (let i = 0; i <= segments; i++) {
      const a = i / segments * TAU;
      const scallop = 1.02 + .1 * Math.cos(4 * a + .45) + .07 * Math.sin(7 * a - 1);
      const r = v * scallop;
      const drip = Math.pow(v, 10) * (.15 + .12 * Math.pow(Math.max(0, Math.sin(a * 7 + 1)), 8));
      pos.push(Math.cos(a) * r, -.01 - drip, Math.sin(a) * r * .96);
      const c = new THREE.Color('#f5a524').multiplyScalar(1 - v * .12 + .06 * Math.cos(a * 9));
      cols.push(c.r, c.g, c.b);
      if (j < rings && i < segments) {
        const n = j * (segments + 1) + i;
        indices.push(n, n + 1, n + segments + 1, n + 1, n + segments + 2, n + segments + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
export function baconGeometry(seed: number) {
  const length = 38, width = 9;
  const pos: number[] = [], cols: number[] = [], inds: number[] = [];
  for (let j = 0; j <= length; j++) {
    const u = j / length;
    for (let k = 0; k <= width; k++) {
      const v = k / width;
      const x = (u - .5) * 2.0;
      const z = (v - .5) * .37 + .12 * Math.sin(u * 9 + seed);
      const y = .07 * Math.sin(u * 14 + seed) + .04 * Math.cos(v * 10 + u * 24);
      pos.push(x, y, z);
      const fat = Math.sin(v * 15 + Math.sin(u * 17 + seed) * 2.3) > .35;
      const col = new THREE.Color(fat ? '#e4a16d' : '#8e2c1d');
      col.multiplyScalar(.84 + .19 * Math.sin(u * 31 + v * 8) + .10 * hash(k * 14 + j * 8));
      cols.push(col.r, col.g, col.b);
      if (j < length && k < width) {
        const n = j * (width + 1) + k;
        inds.push(n, n + 1, n + width + 1, n + 1, n + width + 2, n + width + 1);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  geo.setIndex(inds);
  geo.computeVertexNormals();
  return geo;
}
export function sauceGeometry() {
  const rings: Ring[] = [[0, .055], [.35, .061], [.63, .065], [.86, .06], [.97, .02], [1, -.015], [.85, -.04], [0, -.045]];
  return radialMesh(rings, 80, (r, a) => {
    return new THREE.Color('#df8243').multiplyScalar(.96 + .06 * Math.sin(a * 11 + r * 12));
  }, 34);
}
export function seedPositions(count = 105) {
  const result: { position: [number, number, number]; rotation: [number, number, number]; scale: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = hash(i * 12 + 8) * TAU;
    const radius = Math.sqrt(hash(i * 31 + 5)) * .82;
    const y = .375 - .21 * Math.pow(radius / .99, 2);
    result.push({
      position: [Math.cos(angle) * radius, y + .011, Math.sin(angle) * radius],
      rotation: [0.15 + (hash(i * 13) - .5) * .5, angle, (hash(i * 29) - .5) * 1.6],
      scale: .56 + hash(i * 9) * .55
    });
  }
  return result;
}
