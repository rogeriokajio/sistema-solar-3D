import * as THREE from 'three';

/**
 * Gerador Procedural de Texturas Planetárias PBR (Equiretangular 3D Sem Costura)
 * Gera mapas de cor (albedo), relevo (bump), especularidade, nuvens, anéis e glows
 * usando ruído fractal 3D esférico para eliminar costuras nos meridianos.
 */

class SphericalNoise {
  constructor(seed = 1337) {
    this.p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const tmp = perm[i];
      perm[i] = perm[j];
      perm[j] = tmp;
    }
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise3D(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const p = this.p;
    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;

    return this.lerp(
      w,
      this.lerp(
        v,
        this.lerp(u, this.grad(p[AA], x, y, z), this.grad(p[BA], x - 1, y, z)),
        this.lerp(u, this.grad(p[AB], x, y - 1, z), this.grad(p[BB], x - 1, y - 1, z))
      ),
      this.lerp(
        v,
        this.lerp(u, this.grad(p[AA + 1], x, y, z - 1), this.grad(p[BA + 1], x - 1, y, z - 1)),
        this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))
      )
    );
  }

  fbm(x, y, z, octaves = 4, lacunarity = 2.0, gain = 0.5) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      total += this.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }
    return total / maxValue;
  }
}

const noiseGen = new SphericalNoise(42026);

function clamp(v, min = 0, max = 255) {
  return v < min ? min : v > max ? max : v;
}

function mixColor(c1, c2, t) {
  const k = Math.max(0, Math.min(1, t));
  return [
    c1[0] + (c2[0] - c1[0]) * k,
    c1[1] + (c2[1] - c1[1]) * k,
    c1[2] + (c2[2] - c1[2]) * k
  ];
}

function canvasToTexture(canvas, srgb = true) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Desenha crateras realistas em um canvas de cor e bump
 */
function stampCraters(ctxColor, ctxBump, width, height, count, seedOffset = 1) {
  let s = seedOffset * 98765;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    const x = rand() * width;
    const y = (0.12 + rand() * 0.76) * height;
    const r = Math.pow(rand(), 2.6) * (width * 0.045) + 2.5;

    if (ctxColor) {
      const grad = ctxColor.createRadialGradient(x - r * 0.15, y - r * 0.15, r * 0.1, x, y, r * 1.2);
      grad.addColorStop(0, 'rgba(20, 22, 28, 0.32)');
      grad.addColorStop(0.72, 'rgba(15, 15, 20, 0.42)');
      grad.addColorStop(0.9, 'rgba(235, 240, 250, 0.28)');
      grad.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctxColor.fillStyle = grad;
      ctxColor.beginPath();
      ctxColor.arc(x, y, r * 1.2, 0, Math.PI * 2);
      ctxColor.fill();
    }

    if (ctxBump) {
      const bGrad = ctxBump.createRadialGradient(x, y, r * 0.1, x, y, r * 1.15);
      bGrad.addColorStop(0, 'rgba(35, 35, 35, 0.75)');
      bGrad.addColorStop(0.78, 'rgba(25, 25, 25, 0.8)');
      bGrad.addColorStop(0.92, 'rgba(245, 245, 245, 0.85)');
      bGrad.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctxBump.fillStyle = bGrad;
      ctxBump.beginPath();
      ctxBump.arc(x, y, r * 1.15, 0, Math.PI * 2);
      ctxBump.fill();
    }
  }
}

/**
 * Gera mapa spherical-mapped para qualquer corpo celeste
 */
function renderSphericalMap(width, height, pixelShaderFn) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const cosPhiTable = new Float32Array(width);
  const sinPhiTable = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    const phi = (x / width) * Math.PI * 2;
    cosPhiTable[x] = Math.cos(phi);
    sinPhiTable[x] = Math.sin(phi);
  }

  let idx = 0;
  for (let y = 0; y < height; y++) {
    const v = y / height;
    const theta = v * Math.PI;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let x = 0; x < width; x++) {
      const nx = sinTheta * cosPhiTable[x];
      const ny = cosTheta;
      const nz = sinTheta * sinPhiTable[x];

      const [r, g, b, a = 255] = pixelShaderFn(nx, ny, nz, x / width, v);
      data[idx++] = clamp(r);
      data[idx++] = clamp(g);
      data[idx++] = clamp(b);
      data[idx++] = clamp(a);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return { canvas, ctx };
}

/**
 * Gera Texturas da Terra (Albedo + Bump + Specular + Nuvens)
 */
function generateEarthTextures() {
  const w = 768;
  const h = 384;
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bCtx = bumpCanvas.getContext('2d');
  const bImg = bCtx.createImageData(w, h);
  const bData = bImg.data;

  const specCanvas = document.createElement('canvas');
  specCanvas.width = w;
  specCanvas.height = h;
  const sCtx = specCanvas.getContext('2d');
  const sImg = sCtx.createImageData(w, h);
  const sData = sImg.data;

  let bIdx = 0;
  const { canvas: colorCanvas } = renderSphericalMap(w, h, (nx, ny, nz) => {
    const lat = Math.abs(ny);
    // Continentes com domain warping
    const warp = noiseGen.fbm(nx * 2.1, ny * 2.1, nz * 2.1, 3) * 0.45;
    const elev = noiseGen.fbm((nx + warp) * 1.85, (ny + warp) * 1.85, (nz + warp) * 1.85, 5, 2.1, 0.52);
    const moisture = noiseGen.fbm(nx * 3.5 + 10, ny * 3.5 + 10, nz * 3.5 + 10, 4);

    // Calotas polares
    const polarIce = lat + elev * 0.18 > 0.85;
    let color;
    let bumpVal = 128;
    let roughVal = 200; // 40 para oceano brilhante, 220 para terra fosca

    if (polarIce) {
      color = [242, 248, 255];
      bumpVal = 145;
      roughVal = 150;
    } else if (elev < 0.02) {
      // Oceano
      const depth = Math.max(0, Math.min(1, (0.02 - elev) * 3.2));
      color = mixColor([18, 118, 196], [6, 32, 84], depth);
      bumpVal = 120;
      roughVal = 45; // Água reflete a luz solar
    } else if (elev < 0.045) {
      // Costa / Praia
      color = [214, 198, 148];
      bumpVal = 130;
      roughVal = 190;
    } else if (elev > 0.36) {
      // Cordilheiras e picos nevados
      const snowMix = Math.min(1, (elev - 0.36) * 6);
      color = mixColor([110, 102, 95], [245, 248, 255], snowMix);
      bumpVal = 245;
      roughVal = 220;
    } else {
      // Biomas terrestres (Floresta vs Savana vs Deserto)
      const desertFactor = Math.max(0, 1 - Math.abs(lat - 0.35) * 3.2) * (0.5 - moisture);
      if (desertFactor > 0.12) {
        color = mixColor([65, 130, 58], [212, 174, 112], Math.min(1, desertFactor * 3.2));
      } else {
        color = mixColor([24, 92, 42], [86, 148, 66], (moisture + 0.5));
      }
      bumpVal = 135 + Math.floor(elev * 240);
      roughVal = 215;
    }

    bData[bIdx] = clamp(bumpVal);
    bData[bIdx + 1] = clamp(bumpVal);
    bData[bIdx + 2] = clamp(bumpVal);
    bData[bIdx + 3] = 255;

    sData[bIdx] = roughVal;
    sData[bIdx + 1] = roughVal;
    sData[bIdx + 2] = roughVal;
    sData[bIdx + 3] = 255;
    bIdx += 4;

    return color;
  });

  bCtx.putImageData(bImg, 0, 0);
  sCtx.putImageData(sImg, 0, 0);

  // Camada de nuvens dinâmicas transparentes
  const { canvas: cloudCanvas } = renderSphericalMap(w, h, (nx, ny, nz) => {
    const swirl = noiseGen.fbm(nx * 2.8 + 4, ny * 3.6, nz * 2.8 - 3, 3) * 0.5;
    const c = noiseGen.fbm((nx + swirl) * 3.4, (ny + swirl) * 4.2, (nz + swirl) * 3.4, 5);
    const alpha = clamp((c - 0.02) * 580, 0, 235);
    return [255, 255, 255, alpha];
  });

  return {
    map: canvasToTexture(colorCanvas, true),
    bumpMap: canvasToTexture(bumpCanvas, false),
    roughnessMap: canvasToTexture(specCanvas, false),
    cloudsMap: canvasToTexture(cloudCanvas, true)
  };
}

/**
 * Gera textura de Anéis Planetários (Saturno e Urano) com Divisão de Cassini e Transparência
 */
export function generateRingTexture(isSaturn = true) {
  const width = 1024;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  for (let x = 0; x < width; x++) {
    const t = x / width; // 0 = borda interna, 1 = borda externa
    let r = 225, g = 200, b = 160, alpha = 0;

    if (isSaturn) {
      // Anel D (muito tênue)
      if (t > 0.05 && t <= 0.16) {
        alpha = 0.12 * ((t - 0.05) / 0.11);
        r = 160; g = 145; b = 125;
      }
      // Anel C
      else if (t > 0.16 && t <= 0.33) {
        alpha = 0.35 + 0.15 * Math.sin(t * 190);
        r = 185; g = 166; b = 138;
      }
      // Anel B (mais brilhante e denso)
      else if (t > 0.33 && t <= 0.64) {
        const fine = Math.sin(t * 420) * 0.08 + Math.cos(t * 950) * 0.05;
        alpha = 0.88 + fine;
        r = 242; g = 222; b = 182;
      }
      // Divisão de Cassini (lacuna escura)
      else if (t > 0.64 && t <= 0.70) {
        alpha = 0.05;
        r = 90; g = 80; b = 70;
      }
      // Anel A + Lacuna de Encke
      else if (t > 0.70 && t <= 0.92) {
        if (t > 0.85 && t < 0.868) {
          alpha = 0.08; // Lacuna de Encke
        } else {
          alpha = 0.68 + Math.sin(t * 380) * 0.08;
          r = 216; g = 198; b = 168;
        }
      }
      // Anel F (fino externo)
      else if (t > 0.95 && t <= 0.975) {
        alpha = 0.45;
        r = 230; g = 210; b = 180;
      }
    } else {
      // Anéis tênues de Urano
      const bands = [0.25, 0.38, 0.52, 0.66, 0.85, 0.93];
      for (const center of bands) {
        const dist = Math.abs(t - center);
        if (dist < 0.018) {
          alpha = Math.max(alpha, (1 - dist / 0.018) * 0.38);
        }
      }
      r = 165; g = 225; b = 240;
    }

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
    ctx.fillRect(x, 0, 1, height);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Gera Sprite Radial de Glow (Coroa Solar, Coma do Cometa e Brilho Estelar)
 */
export function generateGlowTexture(innerColor = 'rgba(255, 240, 180, 1)', midColor = 'rgba(251, 146, 60, 0.45)', outerColor = 'rgba(234, 88, 12, 0)') {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(0.32, midColor);
  grad.addColorStop(1, outerColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Gera todas as texturas planetárias com callback de progresso para a tela de loading
 */
export async function generateAllPlanetaryTextures(onProgress) {
  const textures = {};
  const yieldFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

  // 1. SOL (Fotosfera Granulada e Manchas Solares)
  onProgress?.(10, 'Sintetizando plasma fotosférico e coroa do Sol...');
  await yieldFrame();
  {
    const { canvas } = renderSphericalMap(768, 384, (nx, ny, nz) => {
      const n1 = noiseGen.fbm(nx * 6, ny * 6, nz * 6, 4);
      const n2 = noiseGen.fbm(nx * 16 + 5, ny * 16 + 5, nz * 16 + 5, 3);
      const spot = noiseGen.fbm(nx * 3.2 - 2, ny * 3.2, nz * 3.2 + 2, 3);
      let c = mixColor([234, 88, 12], [254, 240, 138], (n1 + 0.45) * 1.1 + n2 * 0.35);
      if (spot < -0.34) {
        c = mixColor(c, [95, 25, 5], Math.min(1, (-0.34 - spot) * 8));
      }
      return c;
    });
    textures.sun = { map: canvasToTexture(canvas, true) };
  }

  // 2. MERCÚRIO
  onProgress?.(22, 'Esculpindo crateras e bacias de impacto de Mercúrio...');
  await yieldFrame();
  {
    const { canvas, ctx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 3.5, ny * 3.5, nz * 3.5, 5);
      const base = 128 + n * 75;
      return [base + 4, base + 2, base];
    });
    const { canvas: bumpCanvas, ctx: bCtx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 4.5, ny * 4.5, nz * 4.5, 4);
      const v = 128 + n * 90;
      return [v, v, v];
    });
    stampCraters(ctx, bCtx, 512, 256, 220, 11);
    textures.mercury = {
      map: canvasToTexture(canvas, true),
      bumpMap: canvasToTexture(bumpCanvas, false)
    };
  }

  // 3. VÊNUS
  onProgress?.(34, 'Modelando super-rotação atmosférica de Vênus...');
  await yieldFrame();
  {
    const { canvas } = renderSphericalMap(512, 256, (nx, ny, nz, u, v) => {
      const chevron = Math.cos((v - 0.5) * Math.PI * 3.5) * 0.35;
      const band = noiseGen.fbm((nx + chevron) * 2.2, ny * 7.5, (nz + chevron) * 2.2, 5);
      return mixColor([180, 105, 32], [253, 224, 145], band + 0.52);
    });
    textures.venus = { map: canvasToTexture(canvas, true) };
  }

  // 4. TERRA & LUA
  onProgress?.(48, 'Gerando continentes, batimetria oceânica e nuvens da Terra...');
  await yieldFrame();
  textures.earth = generateEarthTextures();

  {
    const { canvas, ctx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const mare = noiseGen.fbm(nx * 2.1, ny * 2.1, nz * 2.1, 4);
      const detail = noiseGen.fbm(nx * 9, ny * 9, nz * 9, 3) * 28;
      const base = mare < -0.05 ? 92 + detail : 168 + detail;
      return [base, base, base + 2];
    });
    const { canvas: bCanvas, ctx: bCtx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 5, ny * 5, nz * 5, 4);
      const v = 128 + n * 80;
      return [v, v, v];
    });
    stampCraters(ctx, bCtx, 512, 256, 180, 29);
    textures.moon = {
      map: canvasToTexture(canvas, true),
      bumpMap: canvasToTexture(bCanvas, false)
    };
  }

  // 5. MARTE & CERES
  onProgress?.(60, 'Renderizando óxido de ferro, Valles Marineris e calotas de Marte...');
  await yieldFrame();
  {
    const { canvas, ctx } = renderSphericalMap(768, 384, (nx, ny, nz) => {
      const lat = Math.abs(ny);
      const n = noiseGen.fbm(nx * 2.6, ny * 2.6, nz * 2.6, 5);
      if (lat + n * 0.12 > 0.89) {
        return [245, 242, 240]; // Calotas polares de CO2/H2O
      }
      let c = mixColor([115, 42, 22], [228, 112, 58], n + 0.55);
      // Cânion equatorial Valles Marineris
      if (Math.abs(ny + 0.08) < 0.045 && nx > 0.2 && nx < 0.85) {
        const canyon = 1 - Math.abs(ny + 0.08) / 0.045;
        c = mixColor(c, [58, 20, 12], canyon * 0.7);
      }
      return c;
    });
    const { canvas: bCanvas, ctx: bCtx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 3.5, ny * 3.5, nz * 3.5, 4);
      const v = 128 + n * 110;
      return [v, v, v];
    });
    stampCraters(ctx, bCtx, 768, 384, 95, 44);
    textures.mars = {
      map: canvasToTexture(canvas, true),
      bumpMap: canvasToTexture(bCanvas, false)
    };
  }

  // Ceres
  {
    const { canvas, ctx } = renderSphericalMap(384, 192, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 4, ny * 4, nz * 4, 4);
      const v = 105 + n * 55;
      return [v, v + 3, v + 8];
    });
    stampCraters(ctx, null, 384, 192, 110, 55);
    // Manchas brilhantes de carbonato de sódio (Cratera Occator)
    ctx.fillStyle = 'rgba(240, 250, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(195, 88, 4, 0, Math.PI * 2);
    ctx.arc(202, 90, 2.2, 0, Math.PI * 2);
    ctx.fill();
    textures.ceres = { map: canvasToTexture(canvas, true) };
  }

  // 6. JÚPITER (Bandas Zonais e Grande Mancha Vermelha)
  onProgress?.(74, 'Simulando bandas anticiclônicas e Grande Mancha Vermelha de Júpiter...');
  await yieldFrame();
  {
    const { canvas, ctx } = renderSphericalMap(768, 384, (nx, ny, nz) => {
      const turb = noiseGen.fbm(nx * 4.5, ny * 8.0, nz * 4.5, 4) * 0.08;
      const yBand = ny + turb;
      const stripe = Math.sin(yBand * 22) * 0.5 + Math.cos(yBand * 48) * 0.3;
      const eddy = noiseGen.fbm(nx * 7, ny * 18, nz * 7, 3) * 0.35;
      const t = stripe + eddy;
      if (t > 0.25) return mixColor([228, 196, 156], [248, 236, 214], (t - 0.25) * 1.4);
      if (t > -0.15) return mixColor([188, 118, 68], [228, 196, 156], (t + 0.15) * 2.5);
      return mixColor([124, 62, 32], [188, 118, 68], (t + 0.8) * 1.5);
    });

    // Desenha a Grande Mancha Vermelha no hemisfério sul (~22° S)
    const grsX = 768 * 0.58;
    const grsY = 384 * 0.64;
    ctx.save();
    ctx.translate(grsX, grsY);
    ctx.scale(1.65, 1.0);
    const grsGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 26);
    grsGrad.addColorStop(0, '#b91c1c');
    grsGrad.addColorStop(0.55, '#dc2626');
    grsGrad.addColorStop(0.82, '#f97316');
    grsGrad.addColorStop(0.95, 'rgba(254, 243, 199, 0.65)');
    grsGrad.addColorStop(1, 'rgba(200, 140, 90, 0)');
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    textures.jupiter = { map: canvasToTexture(canvas, true) };
  }

  // 7. SATURNO & ANÉIS
  onProgress?.(86, 'Construindo sistema de anéis de gelo e atmosfera de Saturno...');
  await yieldFrame();
  {
    const { canvas } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const turb = noiseGen.fbm(nx * 3, ny * 10, nz * 3, 3) * 0.04;
      const y = ny + turb;
      const wave = Math.sin(y * 26) * 0.45 + Math.cos(y * 14) * 0.35;
      return mixColor([182, 148, 92], [246, 226, 174], wave * 0.6 + 0.55);
    });
    textures.saturn = {
      map: canvasToTexture(canvas, true),
      ringMap: generateRingTexture(true)
    };
  }

  // 8. URANO, NETUNO E PLUTÃO
  onProgress?.(95, 'Finalizando Gigantes de Gelo, Plutão e Cometa Halley...');
  await yieldFrame();
  {
    const { canvas: uCanvas } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const band = Math.sin(ny * 12) * 0.15 + noiseGen.fbm(nx * 3, ny * 6, nz * 3, 3) * 0.12;
      return mixColor([78, 198, 218], [186, 244, 252], band + 0.5);
    });
    textures.uranus = {
      map: canvasToTexture(uCanvas, true),
      ringMap: generateRingTexture(false)
    };

    const { canvas: nCanvas, ctx: nCtx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const turb = noiseGen.fbm(nx * 4, ny * 10, nz * 4, 4) * 0.25;
      const band = Math.sin(ny * 18) * 0.25 + turb;
      return mixColor([22, 62, 168], [76, 146, 248], band + 0.5);
    });
    // Grande Mancha Escura e cirros brancos de metano em Netuno
    nCtx.save();
    nCtx.translate(220, 150);
    nCtx.scale(1.6, 0.95);
    const gds = nCtx.createRadialGradient(0, 0, 2, 0, 0, 18);
    gds.addColorStop(0, 'rgba(10, 24, 78, 0.85)');
    gds.addColorStop(0.75, 'rgba(18, 42, 120, 0.55)');
    gds.addColorStop(1, 'rgba(40, 90, 210, 0)');
    nCtx.fillStyle = gds;
    nCtx.beginPath();
    nCtx.arc(0, 0, 18, 0, Math.PI * 2);
    nCtx.fill();
    nCtx.restore();
    textures.neptune = { map: canvasToTexture(nCanvas, true) };

    // Plutão com a geleira Tombaugh Regio (Coração)
    const { canvas: pCanvas, ctx: pCtx } = renderSphericalMap(512, 256, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 3.2, ny * 3.2, nz * 3.2, 5);
      return mixColor([98, 62, 54], [218, 198, 184], n + 0.52);
    });
    pCtx.fillStyle = 'rgba(248, 242, 236, 0.78)';
    pCtx.beginPath();
    pCtx.ellipse(250, 132, 28, 34, -0.25, 0, Math.PI * 2);
    pCtx.ellipse(278, 134, 24, 30, 0.3, 0, Math.PI * 2);
    pCtx.fill();
    textures.pluto = { map: canvasToTexture(pCanvas, true) };

    // Cometa Halley
    const { canvas: hCanvas } = renderSphericalMap(256, 128, (nx, ny, nz) => {
      const n = noiseGen.fbm(nx * 5, ny * 5, nz * 5, 4);
      const v = 65 + n * 55;
      return [v, v + 8, v + 18];
    });
    textures.halley = { map: canvasToTexture(hCanvas, true) };
  }

  onProgress?.(100, 'Observatório 3D pronto!');
  return textures;
}

