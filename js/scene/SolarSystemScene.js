import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SOLAR_SYSTEM_BODIES } from '../data/solarSystemData.js';
import { generateGlowTexture } from '../graphics/proceduralTextures.js';

/**
 * Motor Gráfico 3D do Sistema Solar (COSMOS 3D)
 * Gerencia cena Three.js, iluminação, shaders de atmosfera, anéis UV radiais,
 * órbitas keplerianas, cinturão de asteroides instanciado, cometa com cauda dinâmica,
 * corte interno 3D (cutaway) e projeção de rótulos interativos.
 */
export class SolarSystemScene {
  constructor(containerEl, labelsContainerEl, textures, callbacks = {}) {
    this.container = containerEl;
    this.labelsContainer = labelsContainerEl;
    this.textures = textures;
    this.callbacks = callbacks;

    this.bodiesData = SOLAR_SYSTEM_BODIES;
    this.bodyNodes = new Map(); // id -> objeto de estado e meshes
    this.moonNodes = new Map(); // moonId -> objeto de estado da lua
    this.clickableMeshes = [];

    // Estado da simulação
    this.isPlaying = true;
    this.timeDirection = 1;
    this.daysPerSecond = 10; // Padrão: 10 dias simulados por segundo real
    this.simDaysElapsed = 0;
    this.baseDate = new Date('2026-11-22T20:50:00Z');

    // Modos de visualização
    this.scaleMode = 'exploratory'; // 'exploratory' | 'proportional'
    this.showOrbits = true;
    this.useKeplerOrbits = true;
    this.showLabels = true;
    this.showMoons = true;
    this.showAsteroids = true;
    this.showComet = true;
    this.showHabitableZone = false;
    this.showAxes = false;
    this.autoOrbitCamera = false;
    this.cutawayActive = false;

    // Estado de foco da câmera
    this.focusedId = null; // id do planeta ou lua
    this.cameraTransition = null;
    this.lastFocusedWorldPos = new THREE.Vector3();

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerDownPos = new THREE.Vector2();

    this.initScene();
    this.buildStarfield();
    this.buildHabitableZone();
    this.buildCelestialBodies();
    this.buildAsteroidBelts();
    this.bindEvents();
  }

  initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02040a);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4500);
    this.camera.position.set(0, 88, 175);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Pós-processamento com Bloom suave para o Sol e estrelas
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.75, // strength
      0.55, // radius
      0.72  // threshold
    );
    this.composer.addPass(this.bloomPass);

    // Controles orbitais amortecidos
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxDistance = 1400;
    this.controls.minDistance = 0.8;
    this.controls.target.set(0, 0, 0);

    // Iluminação Solar Central + Luz de preenchimento galáctica
    this.sunLight = new THREE.PointLight(0xfff6e5, 3.4, 0, 0.0);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    const hemiLight = new THREE.HemisphereLight(0x4b6cb7, 0x0f172a, 0.42);
    this.scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.55);
    this.scene.add(ambientLight);
  }

  /**
   * Cria fundo estelar profundo com múltiplas camadas de estrelas coloridas e faixa da Via Láctea
   */
  buildStarfield() {
    this.starfieldGroup = new THREE.Group();
    const starCount = 7500;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const spectralPalette = [
      new THREE.Color(0x9bb8ff), // Azul O/B
      new THREE.Color(0xcad8ff), // Branco-azulado A
      new THREE.Color(0xf8f7ff), // Branco F
      new THREE.Color(0xfff4ea), // Amarelo G
      new THREE.Color(0xffd2a1), // Laranja K
      new THREE.Color(0xffcc6f)  // Vermelho-alaranjado M
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 650 + Math.random() * 1400;
      const theta = Math.random() * Math.PI * 2;
      // Concentra ~35% das estrelas próximas ao plano galáctico inclinado
      const isGalacticBand = i < starCount * 0.35;
      const phi = isGalacticBand
        ? Math.PI * 0.5 + (Math.random() - 0.5) * 0.32
        : Math.acos(2 * Math.random() - 1);

      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.cos(phi);
      let z = r * Math.sin(phi) * Math.sin(theta);

      if (isGalacticBand) {
        // Inclina a faixa da Via Láctea em 60 graus em relação à eclíptica
        const tilt = 1.05;
        const ny = y * Math.cos(tilt) - z * Math.sin(tilt);
        const nz = y * Math.sin(tilt) + z * Math.cos(tilt);
        y = ny;
        z = nz;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = spectralPalette[Math.floor(Math.random() * spectralPalette.length)];
      const brightness = 0.55 + Math.random() * 0.45;
      colors[i * 3] = c.r * brightness;
      colors[i * 3 + 1] = c.g * brightness;
      colors[i * 3 + 2] = c.b * brightness;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false
    });

    this.starfieldGroup.add(new THREE.Points(starGeo, starMat));
    this.scene.add(this.starfieldGroup);
  }

  /**
   * Cria disco translúcido da Zona Habitável (Goldilocks Zone) entre Vênus, Terra e Marte
   */
  buildHabitableZone() {
    // Na escala exploratória, Vênus = 25, Terra = 35, Marte = 46 -> Zona Habitável ~ 31 a 44
    const geo = new THREE.RingGeometry(30.5, 43.5, 96, 1);
    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.13,
      depthWrite: false
    });

    this.habitableZoneMesh = new THREE.Mesh(geo, mat);
    this.habitableZoneMesh.visible = this.showHabitableZone;
    this.scene.add(this.habitableZoneMesh);
  }

  /**
   * Cria Shader Fresnel de Atmosfera Planetária
   */
  createAtmosphereMesh(radius, hexColor, intensity = 0.65) {
    const geo = new THREE.SphereGeometry(radius * 1.045, 48, 48);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(hexColor) },
        intensity: { value: intensity }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.8);
          gl_FragColor = vec4(glowColor, fresnel * intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false
    });
    return new THREE.Mesh(geo, mat);
  }

  /**
   * Cria Geometria de Anel com UVs Radiais Corrigidos
   */
  createRadialRingMesh(innerRadius, outerRadius, ringTexture) {
    const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;
    const v3 = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const dist = v3.length();
      const u = (dist - innerRadius) / (outerRadius - innerRadius);
      uvs.setXY(i, u, 0.5);
    }

    geo.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshStandardMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      roughness: 0.75,
      metalness: 0.05,
      depthWrite: false
    });

    return new THREE.Mesh(geo, mat);
  }

  /**
   * Cria o modelo 3D em corte das camadas internas (Cutaway 3D) de um planeta
   */
  createCutawayGroup(bodyData) {
    const group = new THREE.Group();
    const layers = bodyData.layers || [];
    const totalLayers = layers.length;

    // Empilha esferas concêntricas abertas + discos planos na seção de corte
    let cumulativeRadius = 1.0;
    const radii = [1.0, 0.76, 0.48, 0.24];

    layers.slice().reverse().forEach((layer, idx) => {
      const r = radii[idx] || Math.max(0.15, 1.0 - idx * (0.85 / totalLayers));
      const color = new THREE.Color(layer.color);

      // Casca esférica de 270 graus (deixa 90 graus abertos para ver o interior)
      const shellGeo = new THREE.SphereGeometry(
        r * 0.995,
        36,
        36,
        Math.PI * 0.5,
        Math.PI * 1.5
      );
      const shellMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.1,
        emissive: color,
        emissiveIntensity: idx === totalLayers - 1 ? 0.55 : 0.16,
        side: THREE.DoubleSide
      });
      group.add(new THREE.Mesh(shellGeo, shellMat));

      // Duas faces planas semicirculares para fechar a parede do corte com a cor da camada
      const capGeo = new THREE.CircleGeometry(r * 0.994, 32, -Math.PI / 2, Math.PI);
      const capMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -idx
      });

      const cap1 = new THREE.Mesh(capGeo, capMat);
      cap1.rotation.y = Math.PI * 0.5;
      group.add(cap1);

      const cap2 = new THREE.Mesh(capGeo, capMat);
      cap2.rotation.y = 0;
      group.add(cap2);
    });

    group.visible = false;
    return group;
  }

  /**
   * Constrói todos os planetas, o Sol, luas, órbitas e rótulos HTML
   */
  buildCelestialBodies() {
    const sphereGeo = new THREE.SphereGeometry(1, 64, 64);

    this.bodiesData.forEach((body, index) => {
      const rootGroup = new THREE.Group();
      this.scene.add(rootGroup);

      // Grupo de inclinação axial
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = THREE.MathUtils.degToRad(body.axialTiltDeg || 0);
      rootGroup.add(tiltGroup);

      // Grupo de escala do astro (facilita alternar entre escala exploratória e proporcional)
      const scaleGroup = new THREE.Group();
      const initRadius = body.exploratoryRadius;
      scaleGroup.scale.setScalar(initRadius);
      tiltGroup.add(scaleGroup);

      const texBundle = this.textures[body.id] || {};
      let mainMesh;

      if (body.id === 'sun') {
        const sunMat = new THREE.MeshBasicMaterial({
          map: texBundle.map
        });
        mainMesh = new THREE.Mesh(sphereGeo, sunMat);
        scaleGroup.add(mainMesh);

        // Coroa Solar Volumétrica (Sprites aditivos em múltiplas escalas)
        const coronaTex1 = generateGlowTexture(
          'rgba(255, 250, 210, 0.95)',
          'rgba(251, 146, 60, 0.42)',
          'rgba(234, 88, 12, 0)'
        );
        const coronaMat1 = new THREE.SpriteMaterial({
          map: coronaTex1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true
        });
        const coronaSprite1 = new THREE.Sprite(coronaMat1);
        coronaSprite1.scale.set(3.4, 3.4, 1);
        scaleGroup.add(coronaSprite1);
      } else {
        const mat = new THREE.MeshStandardMaterial({
          map: texBundle.map || null,
          bumpMap: texBundle.bumpMap || null,
          bumpScale: texBundle.bumpMap ? 0.035 : 0,
          roughnessMap: texBundle.roughnessMap || null,
          roughness: body.id === 'earth' ? 0.72 : 0.85,
          metalness: 0.05
        });
        mainMesh = new THREE.Mesh(sphereGeo, mat);
        scaleGroup.add(mainMesh);
      }

      mainMesh.userData = { bodyId: body.id, isMoon: false };
      this.clickableMeshes.push(mainMesh);

      // Camada de nuvens da Terra
      let cloudsMesh = null;
      if (body.id === 'earth' && texBundle.cloudsMap) {
        const cloudsGeo = new THREE.SphereGeometry(1.016, 48, 48);
        const cloudsMat = new THREE.MeshStandardMaterial({
          map: texBundle.cloudsMap,
          transparent: true,
          opacity: 0.88,
          depthWrite: false,
          roughness: 1.0
        });
        cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
        scaleGroup.add(cloudsMesh);
      }

      // Brilho Atmosférico Fresnel
      const atmoColors = {
        venus: [0xf59e0b, 0.55],
        earth: [0x38bdf8, 0.75],
        mars: [0xf97316, 0.35],
        jupiter: [0xfbbf24, 0.32],
        saturn: [0xfde047, 0.3],
        uranus: [0x22d3ee, 0.5],
        neptune: [0x3b82f6, 0.6]
      };
      if (atmoColors[body.id]) {
        const [hex, intensity] = atmoColors[body.id];
        const atmoMesh = this.createAtmosphereMesh(1.0, hex, intensity);
        scaleGroup.add(atmoMesh);
      }

      // Anéis Planetários (Saturno e Urano)
      let ringMesh = null;
      if (body.hasRings && texBundle.ringMap) {
        const innerR = body.id === 'saturn' ? 1.32 : 1.45;
        const outerR = body.id === 'saturn' ? 2.45 : 1.95;
        ringMesh = this.createRadialRingMesh(innerR, outerR, texBundle.ringMap);
        scaleGroup.add(ringMesh);
      }

      // Corte Interno 3D (Cutaway)
      const cutawayGroup = this.createCutawayGroup(body);
      scaleGroup.add(cutawayGroup);

      // Eixo de Rotação Polar (visível quando #toggle-axes está ativo)
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -1.65, 0),
        new THREE.Vector3(0, 1.65, 0)
      ]);
      const axisMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(body.color),
        transparent: true,
        opacity: 0.85
      });
      const axisLine = new THREE.Line(axisGeo, axisMat);
      axisLine.visible = this.showAxes;
      scaleGroup.add(axisLine);

      // Cauda Dinâmica do Cometa Halley
      let cometTailGroup = null;
      if (body.id === 'halley') {
        cometTailGroup = this.createCometTail();
        rootGroup.add(cometTailGroup);
      }

      // Linha de Órbita
      let orbitLine = null;
      if (body.exploratoryDistance > 0) {
        orbitLine = this.createOrbitLine(body);
        this.scene.add(orbitLine);
      }

      // Rótulo Flutuante HTML 3D
      const labelEl = this.createFloatingLabel(body.id, body.name, body.color, false);

      // Ângulo orbital inicial distribuído harmoniosamente
      const initialMeanAnomaly = index * 1.15 + 0.4;

      const node = {
        id: body.id,
        data: body,
        rootGroup,
        tiltGroup,
        scaleGroup,
        mainMesh,
        cloudsMesh,
        ringMesh,
        cutawayGroup,
        axisLine,
        cometTailGroup,
        orbitLine,
        labelEl,
        meanAnomaly: initialMeanAnomaly,
        moons: []
      };

      // Construir Luas Principais
      if (body.moons && body.moons.length > 0) {
        body.moons.forEach((moonData, mIdx) => {
          const moonNode = this.buildMoon(moonData, node, mIdx);
          node.moons.push(moonNode);
          this.moonNodes.set(moonData.id, moonNode);
        });
      }

      this.bodyNodes.set(body.id, node);
    });

    this.updateAllPositions(0);
  }

  /**
   * Cria cauda dupla (íons azuis + poeira brilhante) para o Cometa Halley
   */
  createCometTail() {
    const group = new THREE.Group();

    // Coma brilhante ao redor do núcleo
    const comaTex = generateGlowTexture(
      'rgba(224, 242, 254, 0.95)',
      'rgba(56, 189, 248, 0.45)',
      'rgba(14, 165, 233, 0)'
    );
    const comaSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: comaTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
      })
    );
    comaSprite.scale.set(3.2, 3.2, 1);
    group.add(comaSprite);

    // Cone translúcido da cauda de íons (apontando para +Z local do grupo)
    const tailLen = 18;
    const coneGeo = new THREE.ConeGeometry(1.9, tailLen, 24, 1, true);
    coneGeo.translate(0, -tailLen / 2, 0);
    coneGeo.rotateX(-Math.PI / 2); // Vértice na origem (núcleo), base expandindo para +Z

    const ionMat = new THREE.ShaderMaterial({
      uniforms: {
        tailColor: { value: new THREE.Color(0x38bdf8) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 tailColor;
        varying vec2 vUv;
        void main() {
          float fade = pow(vUv.y, 1.8) * (1.0 - vUv.y);
          gl_FragColor = vec4(tailColor, fade * 0.65);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const ionCone = new THREE.Mesh(coneGeo, ionMat);
    group.add(ionCone);

    return group;
  }

  /**
   * Constrói uma lua orbitando seu planeta-mãe
   */
  buildMoon(moonData, parentNode, mIdx) {
    const moonPivot = new THREE.Group();
    // Pequena inclinação orbital para variedade natural
    moonPivot.rotation.z = THREE.MathUtils.degToRad((mIdx % 2 === 0 ? 1 : -1) * (1.5 + mIdx * 0.8));
    parentNode.rootGroup.add(moonPivot);

    const moonGeo = new THREE.SphereGeometry(moonData.radius, 32, 32);
    const moonTex = this.textures.moon?.map || null;
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      color: new THREE.Color(moonData.color),
      roughness: 0.85,
      metalness: 0.05
    });

    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.userData = {
      bodyId: moonData.id,
      parentId: parentNode.id,
      isMoon: true
    };
    this.clickableMeshes.push(moonMesh);
    moonPivot.add(moonMesh);

    // Trilha orbital da lua ao redor do planeta
    const points = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * moonData.distance, 0, Math.sin(a) * moonData.distance));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(moonData.color),
      transparent: true,
      opacity: 0.22
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    moonPivot.add(orbitLine);

    const labelEl = this.createFloatingLabel(moonData.id, moonData.name, moonData.color, true);

    return {
      id: moonData.id,
      parentId: parentNode.id,
      data: moonData,
      pivot: moonPivot,
      mesh: moonMesh,
      orbitLine,
      labelEl,
      angle: mIdx * 2.1
    };
  }

  /**
   * Calcula posição 3D de um astro dado sua anomalia média M
   */
  computeOrbitalPosition(body, meanAnomaly) {
    const a = body.exploratoryDistance;
    if (a === 0) return new THREE.Vector3(0, 0, 0);

    if (!this.useKeplerOrbits) {
      return new THREE.Vector3(Math.cos(meanAnomaly) * a, 0, Math.sin(meanAnomaly) * a);
    }

    // Equação de Kepler: M = E - e * sin(E)
    const e = body.eccentricity || 0;
    let E = meanAnomaly;
    for (let i = 0; i < 4; i++) {
      E = E - (E - e * Math.sin(E) - meanAnomaly) / (1 - e * Math.cos(E));
    }

    const xOrb = a * (Math.cos(E) - e);
    const zOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

    // Aplica inclinação orbital i
    const inc = THREE.MathUtils.degToRad(body.orbitalInclinationDeg || 0);
    const x = xOrb * Math.cos(inc);
    const y = xOrb * Math.sin(inc);
    const z = zOrb;

    return new THREE.Vector3(x, y, z);
  }

  /**
   * Cria ou atualiza a linha da trajetória orbital de um planeta/cometa
   */
  createOrbitLine(body) {
    const segments = 180;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const M = (i / segments) * Math.PI * 2;
      points.push(this.computeOrbitalPosition(body, M));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(body.color),
      transparent: true,
      opacity: body.id === 'halley' ? 0.45 : 0.32
    });
    return new THREE.Line(geo, mat);
  }

  rebuildAllOrbitLines() {
    this.bodyNodes.forEach((node) => {
      if (!node.orbitLine) return;
      const segments = 180;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const M = (i / segments) * Math.PI * 2;
        points.push(this.computeOrbitalPosition(node.data, M));
      }
      node.orbitLine.geometry.setFromPoints(points);
    });
  }

  /**
   * Cria Cinturão Principal de Asteroides (Marte-Júpiter) e Cinturão de Kuiper (Pós-Netuno)
   */
  buildAsteroidBelts() {
    this.asteroidsGroup = new THREE.Group();
    const rockGeo = new THREE.DodecahedronGeometry(0.24, 0);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
      metalness: 0.1
    });

    // 1. Cinturão Principal (raio visual 53 a 63) + Cinturão de Kuiper (raio visual 146 a 172)
    const totalCount = 2200;
    this.asteroidInstanced = new THREE.InstancedMesh(rockGeo, rockMat, totalCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < totalCount; i++) {
      const isKuiper = i >= 1450;
      const minR = isKuiper ? 146 : 53;
      const maxR = isKuiper ? 174 : 63;
      const r = minR + Math.random() * (maxR - minR);
      const angle = Math.random() * Math.PI * 2;
      const ySpread = isKuiper ? 6.5 : 2.6;
      const y = (Math.random() - 0.5) * ySpread;

      dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = (isKuiper ? 0.7 : 0.55) + Math.random() * 1.35;
      dummy.scale.set(s, s * (0.6 + Math.random() * 0.6), s);
      dummy.updateMatrix();
      this.asteroidInstanced.setMatrixAt(i, dummy.matrix);
    }

    this.asteroidsGroup.add(this.asteroidInstanced);
    this.scene.add(this.asteroidsGroup);
  }

  /**
   * Cria um elemento HTML de rótulo 3D projetado
   */
  createFloatingLabel(id, name, color, isMoon = false) {
    const el = document.createElement('button');
    el.className = `space-label ${isMoon ? 'is-moon' : ''}`;
    el.dataset.id = id;
    el.innerHTML = `
      <span class="label-dot" style="background:${color}; box-shadow: 0 0 6px ${color}"></span>
      <span class="label-name">${name}</span>
    `;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.focusOnBody(id);
    });
    this.labelsContainer.appendChild(el);
    return el;
  }

  /**
   * Atualiza posições orbitais e rotações de todos os astros
   */
  updateAllPositions(deltaDays) {
    this.simDaysElapsed += deltaDays;

    // Gira suavemente o cinturão de asteroides
    if (this.asteroidsGroup) {
      this.asteroidsGroup.rotation.y += deltaDays * 0.00045;
    }

    this.bodyNodes.forEach((node) => {
      const b = node.data;

      // Translada planeta na órbita
      if (b.orbitalPeriodDays > 0) {
        const angularSpeed = (Math.PI * 2) / b.orbitalPeriodDays;
        node.meanAnomaly = (node.meanAnomaly + angularSpeed * deltaDays) % (Math.PI * 2);
        const pos = this.computeOrbitalPosition(b, node.meanAnomaly);
        node.rootGroup.position.copy(pos);
      }

      // Rotação axial do planeta
      if (b.rotationPeriodHours !== 0) {
        const rotDays = b.rotationPeriodHours / 24;
        const rotAngle = ((Math.PI * 2) / rotDays) * deltaDays * 0.035; // Suavizado visualmente
        node.mainMesh.rotation.y += rotAngle;
        if (node.cloudsMesh) {
          node.cloudsMesh.rotation.y += rotAngle * 1.18;
        }
      }

      // Orienta a cauda do Cometa Halley sempre na direção OPOSTA ao Sol
      if (node.cometTailGroup) {
        node.cometTailGroup.visible = this.showComet;
        const cometPos = node.rootGroup.position;
        const distToSun = cometPos.length();
        if (distToSun > 0.01) {
          const awayTarget = cometPos.clone().multiplyScalar(2);
          node.cometTailGroup.lookAt(awayTarget);
          // Cauda cresce quando o cometa está próximo ao periélio
          const intensityScale = THREE.MathUtils.clamp(90 / Math.max(22, distToSun), 0.55, 2.2);
          node.cometTailGroup.scale.set(1, 1, intensityScale);
        }
      }

      // Atualiza Luas
      node.moons.forEach((mNode) => {
        mNode.pivot.visible = this.showMoons;
        const mPeriod = mNode.data.periodDays || 5;
        const mSpeed = (Math.PI * 2) / mPeriod;
        mNode.angle += mSpeed * deltaDays * 0.25;
        const dist = mNode.data.distance;
        mNode.mesh.position.set(Math.cos(mNode.angle) * dist, 0, Math.sin(mNode.angle) * dist);
        mNode.mesh.rotation.y += deltaDays * 0.05;
      });
    });
  }

  /**
   * Foca a câmera em qualquer planeta ou lua com transição suave
   */
  focusOnBody(id, closeZoom = true) {
    let targetObj = null;
    let targetRadius = 2.0;
    let bodyRecord = null;
    let parentRecord = null;

    if (this.bodyNodes.has(id)) {
      const node = this.bodyNodes.get(id);
      targetObj = node.rootGroup;
      targetRadius = this.scaleMode === 'proportional' ? node.data.proportionalRadius : node.data.exploratoryRadius;
      bodyRecord = node.data;
    } else if (this.moonNodes.has(id)) {
      const mNode = this.moonNodes.get(id);
      targetObj = mNode.mesh;
      targetRadius = mNode.data.radius * 1.4;
      parentRecord = this.bodyNodes.get(mNode.parentId)?.data;
      bodyRecord = parentRecord;
    }

    if (!targetObj) return;

    // Se mudou de planeta, desativa o corte 3D do planeta anterior
    if (this.focusedId !== id) {
      this.setCutawayMode(false);
    }

    this.focusedId = id;
    this.autoOrbitCamera = false;

    const worldPos = new THREE.Vector3();
    targetObj.getWorldPosition(worldPos);
    this.lastFocusedWorldPos.copy(worldPos);

    const distMult = closeZoom ? (id === 'saturn' ? 4.8 : 3.8) : 7.5;
    const viewDist = Math.max(2.2, targetRadius * distMult);

    // Calcula offset elegante olhando o lado iluminado pelo Sol
    const dirFromSun = worldPos.lengthSq() > 1
      ? worldPos.clone().normalize()
      : new THREE.Vector3(0, 0.2, 1).normalize();
    const sideVec = new THREE.Vector3(-dirFromSun.z, 0.38, dirFromSun.x).normalize();
    const desiredCamPos = worldPos
      .clone()
      .addScaledVector(dirFromSun, -viewDist * 0.55)
      .addScaledVector(sideVec, viewDist * 0.85)
      .add(new THREE.Vector3(0, viewDist * 0.35, 0));

    this.cameraTransition = {
      startCamPos: this.camera.position.clone(),
      startTarget: this.controls.target.clone(),
      endCamOffset: desiredCamPos.sub(worldPos),
      progress: 0,
      duration: 1.05
    };

    // Destaca rótulo focado
    this.bodyNodes.forEach((n) => n.labelEl.classList.toggle('is-focused', n.id === id));
    this.moonNodes.forEach((m) => m.labelEl.classList.toggle('is-focused', m.id === id));

    this.callbacks.onBodyFocused?.(bodyRecord, id);
  }

  /**
   * Volta para a visão geral do Sistema Solar
   */
  resetCameraView(mode = 'overview') {
    this.setCutawayMode(false);
    this.focusedId = null;
    this.bodyNodes.forEach((n) => n.labelEl.classList.remove('is-focused'));
    this.moonNodes.forEach((m) => m.labelEl.classList.remove('is-focused'));

    let targetCamPos = new THREE.Vector3(0, 88, 175);
    if (mode === 'top') {
      targetCamPos.set(0, 265, 0.1);
    } else if (mode === 'ecliptic') {
      targetCamPos.set(0, 8, 210);
    }

    this.cameraTransition = {
      startCamPos: this.camera.position.clone(),
      startTarget: this.controls.target.clone(),
      fixedEndPos: targetCamPos,
      fixedEndTarget: new THREE.Vector3(0, 0, 0),
      progress: 0,
      duration: 1.15
    };

    this.callbacks.onBodyUnfocused?.();
  }

  /**
   * Alterna entre Escala Exploratória e Escala Proporcional Real
   */
  setScaleMode(mode) {
    this.scaleMode = mode;
    this.bodyNodes.forEach((node) => {
      const targetScale =
        mode === 'proportional' ? node.data.proportionalRadius : node.data.exploratoryRadius;
      node.scaleGroup.scale.setScalar(targetScale);
    });
    if (this.focusedId) {
      this.focusOnBody(this.focusedId, true);
    }
  }

  /**
   * Ativa/Desativa o Corte Interno 3D (Raio-X) no astro focado
   */
  setCutawayMode(enabled) {
    this.cutawayActive = enabled;
    this.bodyNodes.forEach((node) => {
      const isTarget = enabled && (node.id === this.focusedId || node.moons.some((m) => m.id === this.focusedId));
      node.cutawayGroup.visible = isTarget;
      node.mainMesh.visible = !isTarget;
      if (node.cloudsMesh) node.cloudsMesh.visible = !isTarget;
    });
    return this.cutawayActive;
  }

  toggleCutawayMode() {
    if (!this.focusedId) return false;
    return this.setCutawayMode(!this.cutawayActive);
  }

  /**
   * Retorna telemetria em tempo real entre o astro selecionado, o Sol e a Terra
   */
  getLiveTelemetry(bodyId) {
    const targetId = this.bodyNodes.has(bodyId)
      ? bodyId
      : this.moonNodes.get(bodyId)?.parentId || 'earth';
    const node = this.bodyNodes.get(targetId);
    const earthNode = this.bodyNodes.get('earth');
    if (!node || !earthNode) return null;

    const pos = node.rootGroup.position;
    const earthPos = earthNode.rootGroup.position;

    // Converte distância visual para Unidades Astronômicas (UA) reais equivalentes
    const baseAU = node.data.semiMajorAxisAU || 0;
    let currentAU = baseAU;
    if (node.data.exploratoryDistance > 0) {
      const ratio = pos.length() / node.data.exploratoryDistance;
      currentAU = baseAU * ratio;
    }

    // Distância em UA até a Terra usando a lei dos cossenos no ângulo atual
    const angleDiff = pos.angleTo(earthPos);
    const earthAU = 1.0;
    const distToEarthAU =
      targetId === 'earth'
        ? 0
        : Math.sqrt(Math.max(0, currentAU * currentAU + earthAU * earthAU - 2 * currentAU * earthAU * Math.cos(angleDiff)));

    // Tempo de luz solar (1 UA = 499,005 segundos)
    const lightSeconds = currentAU * 499.005;
    const mins = Math.floor(lightSeconds / 60);
    const secs = Math.floor(lightSeconds % 60);
    const lightTimeLabel =
      targetId === 'sun'
        ? '0s (Fonte)'
        : mins > 60
        ? `${Math.floor(mins / 60)}h ${mins % 60}m`
        : `${mins}m ${secs}s`;

    // Velocidade orbital instantânea (Vis-Viva aproximada)
    const vMean = node.data.orbitalVelocityKms;
    const vInst =
      node.data.exploratoryDistance > 0
        ? vMean * (node.data.exploratoryDistance / Math.max(1, pos.length()))
        : vMean;

    return {
      distSunAU: currentAU,
      distEarthAU: distToEarthAU,
      orbitalSpeedKms: vInst,
      lightTimeLabel
    };
  }

  /**
   * Calcula distância atual em UA entre quaisquer dois astros
   */
  getDistanceBetweenBodiesAU(idA, idB) {
    if (idA === idB) return { liveAU: 0, minAU: 0 };
    const nodeA = this.bodyNodes.get(idA);
    const nodeB = this.bodyNodes.get(idB);
    if (!nodeA || !nodeB) return { liveAU: 1, minAU: 1 };

    const auA = nodeA.data.semiMajorAxisAU;
    const auB = nodeB.data.semiMajorAxisAU;
    const angle = nodeA.rootGroup.position.angleTo(nodeB.rootGroup.position) || 0;
    const liveAU = Math.sqrt(Math.max(0, auA * auA + auB * auB - 2 * auA * auB * Math.cos(angle)));
    const minAU = Math.abs(auA - auB);
    return { liveAU, minAU };
  }

  /**
   * Atualiza projeção 2D dos rótulos flutuantes HTML
   */
  updateFloatingLabels() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const tempV = new THREE.Vector3();

    const projectNode = (worldObj, labelEl, radiusOffset, isVisibleToggle) => {
      if (!this.showLabels || !isVisibleToggle) {
        labelEl.style.display = 'none';
        return;
      }

      worldObj.getWorldPosition(tempV);
      tempV.y += radiusOffset;
      const distToCam = this.camera.position.distanceTo(tempV);

      tempV.project(this.camera);

      // Verifica se está atrás da câmera
      if (tempV.z > 1.0) {
        labelEl.style.display = 'none';
        return;
      }

      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (-(tempV.y * 0.5) + 0.5) * height;

      labelEl.style.display = 'inline-flex';
      labelEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;

      // Esconde rótulos de luas quando a câmera está muito distante, a menos que o planeta-mãe esteja focado
      if (labelEl.classList.contains('is-moon')) {
        const showMoonLabel = distToCam < 55;
        labelEl.style.display = showMoonLabel ? 'inline-flex' : 'none';
      }
    };

    this.bodyNodes.forEach((node) => {
      const r =
        this.scaleMode === 'proportional' ? node.data.proportionalRadius : node.data.exploratoryRadius;
      const visible = node.id !== 'halley' || this.showComet;
      projectNode(node.rootGroup, node.labelEl, r * 1.15, visible);

      node.moons.forEach((mNode) => {
        projectNode(mNode.mesh, mNode.labelEl, mNode.data.radius * 1.3, this.showMoons);
      });
    });
  }

  /**
   * Loop principal de animação (chamado via requestAnimationFrame)
   */
  update() {
    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Avança física orbital se não estiver pausado
    if (this.isPlaying) {
      const deltaDays = dt * this.daysPerSecond * this.timeDirection;
      this.updateAllPositions(deltaDays);
    }

    // Se houver um astro focado, acompanha o movimento orbital dele
    let currentFocusWorldPos = null;
    if (this.focusedId) {
      const targetObj =
        this.bodyNodes.get(this.focusedId)?.rootGroup ||
        this.moonNodes.get(this.focusedId)?.mesh;
      if (targetObj) {
        currentFocusWorldPos = new THREE.Vector3();
        targetObj.getWorldPosition(currentFocusWorldPos);
      }
    }

    // Interpolação suave de transição de câmera
    if (this.cameraTransition) {
      const tr = this.cameraTransition;
      tr.progress += dt / tr.duration;
      const t = Math.min(1, tr.progress);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);

      if (tr.fixedEndPos) {
        this.camera.position.lerpVectors(tr.startCamPos, tr.fixedEndPos, ease);
        this.controls.target.lerpVectors(tr.startTarget, tr.fixedEndTarget, ease);
      } else if (currentFocusWorldPos) {
        const endCamPos = currentFocusWorldPos.clone().add(tr.endCamOffset);
        this.camera.position.lerpVectors(tr.startCamPos, endCamPos, ease);
        this.controls.target.lerpVectors(tr.startTarget, currentFocusWorldPos, ease);
        this.lastFocusedWorldPos.copy(currentFocusWorldPos);
      }

      if (t >= 1) {
        this.cameraTransition = null;
      }
    } else if (currentFocusWorldPos) {
      // Mantém câmera presa ao astro em movimento enquanto permite orbitar livremente
      const deltaMove = currentFocusWorldPos.clone().sub(this.lastFocusedWorldPos);
      this.camera.position.add(deltaMove);
      this.controls.target.add(deltaMove);
      this.lastFocusedWorldPos.copy(currentFocusWorldPos);
    } else if (this.autoOrbitCamera) {
      // Rotação panorâmica cinematográfica suave
      const angle = dt * 0.12;
      const x = this.camera.position.x;
      const z = this.camera.position.z;
      this.camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
      this.camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
    }

    this.controls.update();
    this.updateFloatingLabels();
    this.composer.render();
  }

  getSimulatedDate() {
    const ms = this.baseDate.getTime() + this.simDaysElapsed * 86400000;
    return new Date(ms);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.composer.setSize(w, h);
    });

    // Raycasting para clique nos planetas/luas 3D (ignorando arrastes de câmera)
    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', (e) => {
      this.pointerDownPos.set(e.clientX, e.clientY);
    });

    dom.addEventListener('pointerup', (e) => {
      const moveDist = Math.hypot(
        e.clientX - this.pointerDownPos.x,
        e.clientY - this.pointerDownPos.y
      );
      if (moveDist > 5) return; // Foi um arraste de órbita da câmera

      const rect = dom.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.clickableMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData?.bodyId) {
          this.focusOnBody(hit.userData.bodyId);
        }
      }
    });
  }
}

