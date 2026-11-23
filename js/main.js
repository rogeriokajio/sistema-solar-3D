import { SOLAR_SYSTEM_BODIES, TOUR_STEPS } from './data/solarSystemData.js';
import { generateAllPlanetaryTextures } from './graphics/proceduralTextures.js';
import { SolarSystemScene } from './scene/SolarSystemScene.js';
import { AstroAssistant } from './ai/astroAssistant.js';
import { SpaceAudioController } from './audio/spaceAudio.js';

/**
 * Controlador Principal do Observatório COSMOS 3D
 * Orquestra o motor 3D, HUD de telemetria, dock planetário, inspetor em 3 abas,
 * comparador lado a lado, calculadora de viagem, tour guiado, áudio espacial e AstroIA.
 */

class CosmosApp {
  constructor() {
    this.scene3D = null;
    this.audio = new SpaceAudioController();
    this.assistant = new AstroAssistant((cmd) => this.handleAICommand(cmd));

    this.currentBody = SOLAR_SYSTEM_BODIES.find((b) => b.id === 'earth');
    this.tourActive = false;
    this.tourIndex = 0;

    this.init();
  }

  async init() {
    const loadingBar = document.getElementById('loading-bar');
    const loadingStatus = document.getElementById('loading-status');
    const loadingScreen = document.getElementById('loading-screen');

    // 1. Gera texturas procedurais PBR de alta definição com barra de progresso
    const textures = await generateAllPlanetaryTextures((pct, msg) => {
      if (loadingBar) loadingBar.style.width = `${pct}%`;
      if (loadingStatus) loadingStatus.textContent = msg;
    });

    // 2. Inicializa a cena Three.js
    const canvasContainer = document.getElementById('canvas-container');
    const labelsContainer = document.getElementById('labels-container');

    this.scene3D = new SolarSystemScene(canvasContainer, labelsContainer, textures, {
      onBodyFocused: (bodyRecord, focusedId) => this.onBodyFocused(bodyRecord, focusedId),
      onBodyUnfocused: () => this.onBodyUnfocused()
    });

    // 3. Constrói elementos dinâmicos da interface HUD
    this.buildPlanetDock();
    this.populateModalSelects();
    this.bindUIEvents();
    this.bindKeyboardShortcuts();
    this.initAIAssistantGreeting();

    // 4. Remove tela de carregamento suavemente
    setTimeout(() => {
      loadingScreen?.classList.add('fade-out');
    }, 220);

    // 5. Inicia loop de renderização e telemetria
    this.lastTelemetryUpdate = 0;
    this.animate();
  }

  /**
   * Constrói o Dock Inferior com todos os astros do Sistema Solar
   */
  buildPlanetDock() {
    const dock = document.getElementById('planet-dock');
    if (!dock) return;
    dock.innerHTML = '';

    SOLAR_SYSTEM_BODIES.forEach((body) => {
      const btn = document.createElement('button');
      btn.className = 'dock-item';
      btn.dataset.id = body.id;
      const distLabel =
        body.semiMajorAxisAU === 0 ? 'Estrela' : `${body.semiMajorAxisAU.toFixed(2)} UA`;

      btn.innerHTML = `
        <div class="dock-orb ${body.hasRings ? 'has-ring' : ''}" style="background: ${body.accentGradient};"></div>
        <span class="dock-name">${body.name}</span>
        <span class="dock-dist">${distLabel}</span>
      `;

      btn.addEventListener('click', () => {
        this.audio.playChime(620, 0.08);
        this.scene3D.focusOnBody(body.id, true);
      });

      dock.appendChild(btn);
    });
  }

  /**
   * Callback disparado quando um planeta ou lua é focado na cena 3D
   */
  onBodyFocused(bodyRecord, focusedId) {
    if (!bodyRecord) return;
    this.currentBody = bodyRecord;
    this.assistant.setFocusedBody(bodyRecord);

    // Atualiza badge superior
    const focusedBadge = document.getElementById('focused-badge');
    const isMoonFocus = focusedId !== bodyRecord.id;
    const moonObj = isMoonFocus
      ? bodyRecord.moons?.find((m) => m.id === focusedId)
      : null;

    if (focusedBadge) {
      focusedBadge.textContent = moonObj
        ? `${moonObj.name} (Lua de ${bodyRecord.name})`
        : `${bodyRecord.name} (${bodyRecord.orderLabel})`;
    }

    const aiContextBadge = document.getElementById('ai-context-badge');
    if (aiContextBadge) {
      aiContextBadge.textContent = `Contexto: ${bodyRecord.name}`;
    }

    // Destaca item no dock inferior
    document.querySelectorAll('.dock-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.id === bodyRecord.id);
    });

    // Abre e popula o painel Inspetor Direito
    this.populateInspector(bodyRecord, moonObj);
    document.getElementById('inspector-panel')?.classList.remove('hidden');

    // Atualiza estado do botão Corte Interno 3D
    const cutawayBtn = document.getElementById('btn-toggle-cutaway');
    cutawayBtn?.classList.toggle('active', this.scene3D.cutawayActive);
  }

  onBodyUnfocused() {
    const focusedBadge = document.getElementById('focused-badge');
    if (focusedBadge) {
      focusedBadge.textContent = 'Sistema Solar (Visão Livre)';
    }
    document.querySelectorAll('.dock-item').forEach((el) => el.classList.remove('active'));
    document.getElementById('inspector-panel')?.classList.add('hidden');
  }

  /**
   * Preenche todas as 3 abas do Inspetor Direito com os dados do astro selecionado
   */
  populateInspector(body, focusedMoon = null) {
    const earth = SOLAR_SYSTEM_BODIES.find((b) => b.id === 'earth');

    document.getElementById('insp-category').textContent = body.category;
    document.getElementById('insp-order').textContent = body.orderLabel;
    document.getElementById('insp-name').textContent = focusedMoon
      ? `${focusedMoon.name} • ${body.name}`
      : body.name;
    document.getElementById('insp-tagline').textContent = focusedMoon
      ? focusedMoon.description
      : body.tagline;
    document.getElementById('insp-description').textContent = body.description;

    // Métricas físicas
    const diamRatio = (body.realDiameterKm / earth.realDiameterKm).toFixed(2);
    document.getElementById('stat-diameter').textContent = `${body.realDiameterKm.toLocaleString('pt-BR')} km`;
    document.getElementById('stat-diameter-rel').textContent = `${diamRatio.replace('.', ',')}x Terra`;

    document.getElementById('stat-mass').textContent = body.massKg;
    document.getElementById('stat-mass-rel').textContent = `${body.massEarthRatio.toLocaleString('pt-BR')}x Terra`;

    const gRatio = (body.gravityMs2 / 9.81).toFixed(2).replace('.', ',');
    document.getElementById('stat-gravity').textContent = `${body.gravityMs2.toString().replace('.', ',')} m/s²`;
    document.getElementById('stat-gravity-rel').textContent = `${gRatio} G`;

    document.getElementById('stat-temp').textContent = `${body.meanTempC} °C`;
    document.getElementById('stat-temp-range').textContent = body.tempRangeLabel;

    document.getElementById('stat-day').textContent = body.rotationPeriodLabel;
    document.getElementById('stat-tilt').textContent = `Inclinação: ${body.axialTiltDeg.toString().replace('.', ',')}°`;

    document.getElementById('stat-year').textContent = body.orbitalPeriodLabel;
    document.getElementById('stat-ecc').textContent = `Excentricidade: ${body.eccentricity.toString().replace('.', ',')}`;

    // Lista de Luas clicáveis
    const moonsSection = document.getElementById('moons-section');
    const moonsList = document.getElementById('moons-list');
    const moonsCount = document.getElementById('stat-moons-count');

    if (body.moons && body.moons.length > 0) {
      moonsSection.classList.remove('hidden');
      moonsCount.textContent = `${body.moons.length} ${body.moons.length === 1 ? 'lua principal' : 'luas principais'}`;
      moonsList.innerHTML = '';

      body.moons.forEach((m) => {
        const chip = document.createElement('button');
        chip.className = 'moon-chip';
        chip.title = `${m.description} (Diâmetro: ${m.realDiameterKm} km)`;
        chip.innerHTML = `
          <span class="moon-chip-dot" style="background:${m.color};"></span>
          <span>${m.name}</span>
          <span class="mono" style="font-size:0.65rem;color:var(--text-muted)">${m.realDiameterKm} km</span>
        `;
        chip.addEventListener('click', () => {
          this.audio.playChime(740, 0.08);
          this.scene3D.focusOnBody(m.id, true);
        });
        moonsList.appendChild(chip);
      });
    } else {
      moonsSection.classList.add('hidden');
    }

    // ABA 2: Estrutura Interna (Diagrama concêntrico 2D + Legenda)
    const diagram = document.getElementById('layers-diagram');
    const layersList = document.getElementById('layers-list');
    diagram.innerHTML = '';
    layersList.innerHTML = '';

    const totalLayers = body.layers.length;
    // Desenha da camada externa para a interna
    body.layers
      .slice()
      .reverse()
      .forEach((layer, idx) => {
        const sizePct = 100 - idx * (74 / totalLayers);
        const circle = document.createElement('div');
        circle.className = 'layer-circle';
        circle.style.width = `${sizePct}%`;
        circle.style.height = `${sizePct}%`;
        circle.style.background = layer.color;
        circle.title = `${layer.name}: ${layer.detail}`;
        diagram.appendChild(circle);
      });

    body.layers.forEach((layer) => {
      const item = document.createElement('div');
      item.className = 'layer-item';
      item.innerHTML = `
        <div class="layer-item-left">
          <span class="layer-swatch" style="background:${layer.color};"></span>
          <div>
            <strong>${layer.name}</strong>
            <div style="font-size:0.67rem;color:var(--text-secondary)">${layer.detail}</div>
          </div>
        </div>
        <span class="mono" style="color:var(--accent-cyan)">${layer.pct}%</span>
      `;
      layersList.appendChild(item);
    });

    // Composição Atmosférica
    document.getElementById('atmo-pressure').textContent = `Ambiente: ${body.atmospherePressure}`;
    const atmoBars = document.getElementById('atmosphere-bars');
    atmoBars.innerHTML = '';
    body.atmosphere.forEach((a) => {
      const row = document.createElement('div');
      row.className = 'atmo-row';
      row.innerHTML = `
        <div class="atmo-row-top">
          <span>${a.gas}</span>
          <span class="mono">${a.pct}%</span>
        </div>
        <div class="atmo-bar-bg">
          <div class="atmo-bar-fill" style="width:${Math.max(4, Math.min(100, a.pct))}%;"></div>
        </div>
      `;
      atmoBars.appendChild(row);
    });

    // Missões Espaciais
    const missionsList = document.getElementById('missions-list');
    missionsList.innerHTML = '';
    body.missions.forEach((m) => {
      const card = document.createElement('div');
      card.className = 'mission-card';
      card.innerHTML = `<strong>${m.name}</strong> <span class="mono">(${m.year})</span><div style="margin-top:3px;color:var(--text-secondary)">${m.note}</div>`;
      missionsList.appendChild(card);
    });

    // ABA 3: Simulador Gravitacional & Curiosidades
    this.updateHumanLaboratory();

    const factsList = document.getElementById('facts-list');
    factsList.innerHTML = '';
    body.facts.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      factsList.appendChild(li);
    });

    this.updateLiveInspectorTelemetry();
  }

  /**
   * Calcula peso, idade orbital e altura de pulo do usuário no planeta selecionado
   */
  updateHumanLaboratory() {
    const body = this.currentBody;
    if (!body) return;

    const weightEarth = parseFloat(document.getElementById('input-earth-weight')?.value) || 70;
    const ageEarth = parseFloat(document.getElementById('input-earth-age')?.value) || 25;

    const gFactor = body.gravityMs2 / 9.81;
    const localWeight = weightEarth * gFactor;
    const jumpCm = gFactor > 0 ? (50 / gFactor) : 0;

    const localAge =
      body.orbitalPeriodDays > 0
        ? (ageEarth * 365.256) / body.orbitalPeriodDays
        : 0;

    document.getElementById('res-planet-weight').textContent = `${localWeight.toFixed(1).replace('.', ',')} kg`;
    document.getElementById('res-planet-age').textContent =
      localAge > 0 ? `${localAge.toFixed(2).replace('.', ',')} anos` : 'N/A (Estrela)';
    document.getElementById('res-planet-jump').textContent =
      jumpCm > 1000
        ? `${(jumpCm / 100).toFixed(1).replace('.', ',')} m`
        : `${jumpCm.toFixed(0)} cm`;
    document.getElementById('res-escape-vel').textContent = `${body.escapeVelocityKms.toString().replace('.', ',')} km/s`;
  }

  /**
   * Atualiza os números de telemetria orbital em tempo real no topo e no inspetor
   */
  updateLiveInspectorTelemetry() {
    if (!this.scene3D) return;

    // Data estelar simulada
    const simDate = this.scene3D.getSimulatedDate();
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const dd = String(simDate.getUTCDate()).padStart(2, '0');
    const mm = months[simDate.getUTCMonth()];
    const yyyy = simDate.getUTCFullYear();
    const hh = String(simDate.getUTCHours()).padStart(2, '0');
    const min = String(simDate.getUTCMinutes()).padStart(2, '0');
    const dateEl = document.getElementById('sim-date');
    if (dateEl) {
      dateEl.textContent = `${dd} ${mm} ${yyyy} • ${hh}:${min} UTC`;
    }

    if (!this.currentBody) return;
    const tele = this.scene3D.getLiveTelemetry(this.currentBody.id);
    if (!tele) return;

    document.getElementById('live-dist-sun').textContent = `${tele.distSunAU.toFixed(3).replace('.', ',')} UA`;
    document.getElementById('live-dist-earth').textContent = `${tele.distEarthAU.toFixed(3).replace('.', ',')} UA`;
    document.getElementById('live-orb-speed').textContent = `${tele.orbitalSpeedKms.toFixed(2).replace('.', ',')} km/s`;
    document.getElementById('live-light-time').textContent = tele.lightTimeLabel;
  }

  /**
   * Popula os <select> dos modais de Comparação e Calculadora de Viagem
   */
  populateModalSelects() {
    const selectA = document.getElementById('compare-select-a');
    const selectB = document.getElementById('compare-select-b');
    const originSel = document.getElementById('travel-select-origin');
    const destSel = document.getElementById('travel-select-dest');

    [selectA, selectB, originSel, destSel].forEach((sel) => {
      if (!sel) return;
      sel.innerHTML = '';
      SOLAR_SYSTEM_BODIES.forEach((b) => {
        const opt = document.createElement('option');
        opt.value = b.id;
        opt.textContent = `${b.name} (${b.orderLabel})`;
        sel.appendChild(opt);
      });
    });

    if (selectA) selectA.value = 'earth';
    if (selectB) selectB.value = 'jupiter';
    if (originSel) originSel.value = 'earth';
    if (destSel) destSel.value = 'mars';

    this.updateComparisonModal();
    this.updateDistanceModal();
  }

  /**
   * Atualiza o Comparador Planetário Lado a Lado
   */
  updateComparisonModal() {
    const idA = document.getElementById('compare-select-a')?.value || 'earth';
    const idB = document.getElementById('compare-select-b')?.value || 'jupiter';
    const bodyA = SOLAR_SYSTEM_BODIES.find((b) => b.id === idA);
    const bodyB = SOLAR_SYSTEM_BODIES.find((b) => b.id === idB);
    if (!bodyA || !bodyB) return;

    // Esferas proporcionais visuais (máximo 118px, mínimo 14px)
    const maxDiam = Math.max(bodyA.realDiameterKm, bodyB.realDiameterKm);
    const sizeA = Math.max(14, Math.round((bodyA.realDiameterKm / maxDiam) * 116));
    const sizeB = Math.max(14, Math.round((bodyB.realDiameterKm / maxDiam) * 116));

    const sphereA = document.getElementById('comp-sphere-a');
    const sphereB = document.getElementById('comp-sphere-b');
    sphereA.style.width = `${sizeA}px`;
    sphereA.style.height = `${sizeA}px`;
    sphereA.style.background = bodyA.accentGradient;

    sphereB.style.width = `${sizeB}px`;
    sphereB.style.height = `${sizeB}px`;
    sphereB.style.background = bodyB.accentGradient;

    document.getElementById('comp-name-a').textContent = bodyA.name;
    document.getElementById('comp-diam-a').textContent = `${bodyA.realDiameterKm.toLocaleString('pt-BR')} km`;
    document.getElementById('comp-name-b').textContent = bodyB.name;
    document.getElementById('comp-diam-b').textContent = `${bodyB.realDiameterKm.toLocaleString('pt-BR')} km`;

    const bigger = bodyA.realDiameterKm >= bodyB.realDiameterKm ? bodyA : bodyB;
    const smaller = bigger === bodyA ? bodyB : bodyA;
    const ratio = (bigger.realDiameterKm / smaller.realDiameterKm).toFixed(1).replace('.', ',');
    const volRatio = Math.pow(bigger.realDiameterKm / smaller.realDiameterKm, 3);
    const volText =
      volRatio > 1000
        ? Math.round(volRatio).toLocaleString('pt-BR')
        : volRatio.toFixed(1).replace('.', ',');

    document.getElementById('compare-summary-text').innerHTML =
      bigger.id === smaller.id
        ? `Você selecionou **${bigger.name}** em ambos os lados. Escolha outro astro para comparar proporções volumétricas e gravitacionais!`
        : `<strong>${bigger.name}</strong> possui um diâmetro <strong>${ratio}x maior</strong> que <strong>${smaller.name}</strong>. Em termos de volume tridimensional, caberiam cerca de <strong>${volText} ${smaller.name}s</strong> dentro de ${bigger.name}!`;

    const rows = [
      ['Categoria', bodyA.category, bodyB.category],
      ['Diâmetro Equatorial', `${bodyA.realDiameterKm.toLocaleString('pt-BR')} km`, `${bodyB.realDiameterKm.toLocaleString('pt-BR')} km`],
      ['Massa (vs Terra)', `${bodyA.massEarthRatio}x`, `${bodyB.massEarthRatio}x`],
      ['Gravidade Superficial', `${bodyA.gravityMs2} m/s²`, `${bodyB.gravityMs2} m/s²`],
      ['Velocidade de Escape', `${bodyA.escapeVelocityKms} km/s`, `${bodyB.escapeVelocityKms} km/s`],
      ['Temperatura Média', `${bodyA.meanTempC} °C`, `${bodyB.meanTempC} °C`],
      ['Duração do Dia', bodyA.rotationPeriodLabel, bodyB.rotationPeriodLabel],
      ['Período Orbital (Ano)', bodyA.orbitalPeriodLabel, bodyB.orbitalPeriodLabel],
      ['Distância ao Sol', `${bodyA.semiMajorAxisAU} UA`, `${bodyB.semiMajorAxisAU} UA`]
    ];

    const table = document.getElementById('compare-table');
    table.innerHTML = '';
    rows.forEach(([label, valA, valB]) => {
      const r = document.createElement('div');
      r.className = 'comp-row';
      r.innerHTML = `
        <span class="comp-row-val-a">${valA}</span>
        <span class="comp-row-label">${label}</span>
        <span class="comp-row-val-b">${valB}</span>
      `;
      table.appendChild(r);
    });
  }

  /**
   * Atualiza a Calculadora de Distância e Tempo de Viagem Espacial
   */
  updateDistanceModal() {
    const idOrigin = document.getElementById('travel-select-origin')?.value || 'earth';
    const idDest = document.getElementById('travel-select-dest')?.value || 'mars';

    const dist = this.scene3D
      ? this.scene3D.getDistanceBetweenBodiesAU(idOrigin, idDest)
      : { liveAU: 1.5, minAU: 0.52 };

    const liveKmMillions = dist.liveAU * 149.59787;
    const minKmMillions = dist.minAU * 149.59787;

    document.getElementById('travel-live-au').textContent = `${dist.liveAU.toFixed(3).replace('.', ',')} UA`;
    document.getElementById('travel-live-km').textContent = `${liveKmMillions.toFixed(1).replace('.', ',')} milhões de km`;
    document.getElementById('travel-min-au').textContent = `${dist.minAU.toFixed(3).replace('.', ',')} UA`;
    document.getElementById('travel-min-km').textContent = `${minKmMillions.toFixed(1).replace('.', ',')} milhões de km`;

    const totalKm = liveKmMillions * 1e6;

    const vehicles = [
      {
        name: 'Fóton na Velocidade da Luz (c)',
        desc: '299.792 km/s (Comunicação de Rádio / Laser)',
        speedKmh: 299792.458 * 3600
      },
      {
        name: 'Sonda Parker Solar Probe (NASA)',
        desc: '692.000 km/h (Objeto humano mais veloz)',
        speedKmh: 692000
      },
      {
        name: 'Sonda Interplanetária Voyager 1',
        desc: '61.500 km/h (Velocidade de escape do Sistema Solar)',
        speedKmh: 61500
      },
      {
        name: 'Nave Tripulada (Cruzeiro Interplanetário)',
        desc: '39.600 km/h (Velocidade típica Apollo / Starship)',
        speedKmh: 39600
      },
      {
        name: 'Jato Comercial Boeing / Airbus',
        desc: '900 km/h (Comparação em escala terrestre)',
        speedKmh: 900
      }
    ];

    const formatDuration = (hours) => {
      if (hours <= 0) return '0 s';
      const seconds = hours * 3600;
      if (seconds < 60) return `${seconds.toFixed(1)} segundos`;
      const minutes = seconds / 60;
      if (minutes < 60) return `${Math.floor(minutes)}m ${Math.round(seconds % 60)}s`;
      if (hours < 48) return `${hours.toFixed(1).replace('.', ',')} horas`;
      const days = hours / 24;
      if (days < 365.25) return `${Math.round(days)} dias (${(days / 30.4).toFixed(1).replace('.', ',')} meses)`;
      const years = days / 365.25;
      return `${years.toFixed(1).replace('.', ',')} anos`;
    };

    const listEl = document.getElementById('travel-vehicles-list');
    listEl.innerHTML = '';
    vehicles.forEach((v) => {
      const hours = totalKm / v.speedKmh;
      const row = document.createElement('div');
      row.className = 'vehicle-row';
      row.innerHTML = `
        <div class="vehicle-info">
          <strong>${v.name}</strong>
          <span>${v.desc}</span>
        </div>
        <span class="vehicle-time">${formatDuration(hours)}</span>
      `;
      listEl.appendChild(row);
    });
  }

  /**
   * Gerencia o Tour Cinematográfico Guiado de 12 Paradas
   */
  startGuidedTour() {
    this.tourActive = true;
    this.tourIndex = 0;
    document.getElementById('tour-banner')?.classList.remove('hidden');
    document.getElementById('btn-tour')?.classList.add('active');
    this.renderTourStep();
  }

  stopGuidedTour() {
    this.tourActive = false;
    document.getElementById('tour-banner')?.classList.add('hidden');
    document.getElementById('btn-tour')?.classList.remove('active');
  }

  renderTourStep() {
    const step = TOUR_STEPS[this.tourIndex];
    if (!step) return;

    document.getElementById('tour-step-counter').textContent = `PARADA ${this.tourIndex + 1} DE ${TOUR_STEPS.length}`;
    document.getElementById('tour-step-title').textContent = step.title;
    document.getElementById('tour-step-text').textContent = step.text;

    this.audio.playChime(580 + this.tourIndex * 22, 0.1);
    this.scene3D.focusOnBody(step.bodyId, true);
  }

  /**
   * Inicializa e gerencia o chat do Assistente AstroIA
   */
  initAIAssistantGreeting() {
    this.appendAIMessage(
      'assistant',
      'Olá! Sou a **AstroIA**, sua copiloto astrofísica no **COSMOS 3D**. Clique em qualquer astro ou pergunte sobre órbitas, camadas internas, luas, gravidade ou peça *"leve-me a Saturno"*!'
    );

    const keyInput = document.getElementById('gemini-api-key-input');
    if (keyInput && this.assistant.apiKey) {
      keyInput.value = this.assistant.apiKey;
    }
  }

  appendAIMessage(role, htmlText) {
    const container = document.getElementById('ai-messages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `ai-msg ${role}`;
    msg.innerHTML = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  async submitAIPrompt(promptText) {
    const text = promptText.trim();
    if (!text) return;

    this.appendAIMessage('user', text);
    const reply = await this.assistant.ask(text);
    this.appendAIMessage('assistant', reply);
  }

  handleAICommand(cmd) {
    if (!cmd || !this.scene3D) return;
    if (cmd.type === 'focus' && cmd.bodyId) {
      this.scene3D.focusOnBody(cmd.bodyId, true);
    } else if (cmd.type === 'cutaway') {
      if (!this.scene3D.focusedId) {
        this.scene3D.focusOnBody(this.currentBody.id, true);
      }
      const active = this.scene3D.setCutawayMode(true);
      document.getElementById('btn-toggle-cutaway')?.classList.toggle('active', active);
    }
  }

  /**
   * Atualiza os rótulos de velocidade da simulação
   */
  updateSpeedLabels(daysPerSec) {
    let label = `${daysPerSec.toFixed(1).replace('.', ',')} dias/s`;
    if (daysPerSec < 0.001) label = 'Tempo Real';
    else if (daysPerSec < 0.5) label = `${(daysPerSec * 24).toFixed(0)}h/s`;
    else if (daysPerSec >= 360) label = `${(daysPerSec / 365.25).toFixed(1).replace('.', ',')} ano/s`;
    else label = `${Math.round(daysPerSec)} dias/s`;

    const prefix = this.scene3D.timeDirection < 0 ? '-' : '';
    const text = this.scene3D.isPlaying ? `${prefix}${label}` : 'PAUSADO';

    document.getElementById('speed-label').textContent = text;
    document.getElementById('top-speed-readout').textContent = text;
  }

  /**
   * Vincula todos os botões, sliders, abas e modais da interface
   */
  bindUIEvents() {
    // Alternar painel esquerdo
    document.getElementById('btn-toggle-left')?.addEventListener('click', () => {
      document.getElementById('left-controls')?.classList.toggle('collapsed');
    });

    // Logo Home -> Resetar visão geral
    document.getElementById('btn-home-reset')?.addEventListener('click', () => {
      this.stopGuidedTour();
      this.scene3D.resetCameraView('overview');
    });

    // Controle Temporal: Play / Pause / Reverse / Reset
    const playPauseBtn = document.getElementById('btn-play-pause');
    playPauseBtn?.addEventListener('click', () => {
      this.togglePlayPause();
    });

    document.getElementById('btn-reverse')?.addEventListener('click', (e) => {
      this.scene3D.timeDirection *= -1;
      e.currentTarget.classList.toggle('active', this.scene3D.timeDirection < 0);
      this.updateSpeedLabels(this.scene3D.daysPerSecond);
    });

    document.getElementById('btn-reset-time')?.addEventListener('click', () => {
      this.scene3D.simDaysElapsed = 0;
      this.scene3D.timeDirection = 1;
      document.getElementById('btn-reverse')?.classList.remove('active');
      this.updateLiveInspectorTelemetry();
    });

    // Slider de velocidade exponencial
    const slider = document.getElementById('time-speed-slider');
    slider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      // Mapeia 0..100 exponencialmente de 0.01 dias/s até 365.25 dias/s
      const days = val === 0 ? 0 : Math.pow(val / 100, 2.6) * 365.25;
      this.scene3D.daysPerSecond = days;
      document.querySelectorAll('.speed-preset').forEach((b) => b.classList.remove('active'));
      this.updateSpeedLabels(days);
    });

    // Presets de velocidade
    document.querySelectorAll('.speed-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const days = parseFloat(btn.dataset.days);
        this.scene3D.daysPerSecond = days;
        document.querySelectorAll('.speed-preset').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        if (slider) {
          const norm = Math.pow(Math.min(1, days / 365.25), 1 / 2.6) * 100;
          slider.value = Math.round(norm);
        }
        this.updateSpeedLabels(days);
      });
    });

    // Modo de Escala (Exploratória vs Proporcional)
    document.querySelectorAll('.scale-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scale-mode-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.scene3D.setScaleMode(btn.dataset.scale);
      });
    });

    // Câmeras predefinidas
    document.getElementById('cam-overview')?.addEventListener('click', () => {
      this.scene3D.resetCameraView('overview');
    });
    document.getElementById('cam-top')?.addEventListener('click', () => {
      this.scene3D.resetCameraView('top');
    });
    document.getElementById('cam-ecliptic')?.addEventListener('click', () => {
      this.scene3D.resetCameraView('ecliptic');
    });
    document.getElementById('cam-cinematic')?.addEventListener('click', (e) => {
      this.scene3D.resetCameraView('overview');
      this.scene3D.autoOrbitCamera = !this.scene3D.autoOrbitCamera;
      e.currentTarget.classList.toggle('active', this.scene3D.autoOrbitCamera);
    });

    // Toggles de Camadas Visuais
    document.getElementById('toggle-orbits')?.addEventListener('change', (e) => {
      const checked = e.target.checked;
      this.scene3D.showOrbits = checked;
      this.scene3D.bodyNodes.forEach((n) => {
        if (n.orbitLine) n.orbitLine.visible = checked && (n.id !== 'halley' || this.scene3D.showComet);
      });
    });

    document.getElementById('toggle-kepler')?.addEventListener('change', (e) => {
      this.scene3D.useKeplerOrbits = e.target.checked;
      this.scene3D.rebuildAllOrbitLines();
      this.scene3D.updateAllPositions(0);
    });

    document.getElementById('toggle-labels')?.addEventListener('change', (e) => {
      this.scene3D.showLabels = e.target.checked;
    });

    document.getElementById('toggle-moons')?.addEventListener('change', (e) => {
      this.scene3D.showMoons = e.target.checked;
    });

    document.getElementById('toggle-asteroids')?.addEventListener('change', (e) => {
      this.scene3D.showAsteroids = e.target.checked;
      if (this.scene3D.asteroidsGroup) {
        this.scene3D.asteroidsGroup.visible = e.target.checked;
      }
    });

    document.getElementById('toggle-comet')?.addEventListener('change', (e) => {
      const checked = e.target.checked;
      this.scene3D.showComet = checked;
      const halleyNode = this.scene3D.bodyNodes.get('halley');
      if (halleyNode) {
        halleyNode.rootGroup.visible = checked;
        if (halleyNode.orbitLine) halleyNode.orbitLine.visible = checked && this.scene3D.showOrbits;
      }
    });

    document.getElementById('toggle-habitable')?.addEventListener('change', (e) => {
      this.scene3D.showHabitableZone = e.target.checked;
      if (this.scene3D.habitableZoneMesh) {
        this.scene3D.habitableZoneMesh.visible = e.target.checked;
      }
    });

    document.getElementById('toggle-axes')?.addEventListener('change', (e) => {
      this.scene3D.showAxes = e.target.checked;
      this.scene3D.bodyNodes.forEach((n) => {
        if (n.axisLine) n.axisLine.visible = e.target.checked;
      });
    });

    // Inspetor Direito: Abas e Botões Rápidos
    document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
      this.scene3D.resetCameraView('overview');
    });

    document.getElementById('btn-focus-close')?.addEventListener('click', () => {
      if (this.currentBody) {
        this.scene3D.focusOnBody(this.currentBody.id, true);
      }
    });

    document.getElementById('btn-toggle-cutaway')?.addEventListener('click', (e) => {
      const active = this.scene3D.toggleCutawayMode();
      e.currentTarget.classList.toggle('active', active);
      this.audio.playChime(active ? 820 : 480, 0.1);
    });

    document.getElementById('btn-ask-ai-about')?.addEventListener('click', () => {
      document.getElementById('ai-panel')?.classList.remove('hidden');
      document.getElementById('btn-ai-toggle')?.classList.add('active');
      if (this.currentBody) {
        this.submitAIPrompt(`Explique o astro ${this.currentBody.name} e suas principais características.`);
      }
    });

    document.querySelectorAll('.insp-tab').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        document.querySelectorAll('.insp-tab').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.insp-tab-content').forEach((c) => c.classList.remove('active'));
        tabBtn.classList.add('active');
        document.getElementById(tabBtn.dataset.tab)?.classList.add('active');
      });
    });

    // Inputs do Laboratório Humano
    document.getElementById('input-earth-weight')?.addEventListener('input', () => this.updateHumanLaboratory());
    document.getElementById('input-earth-age')?.addEventListener('input', () => this.updateHumanLaboratory());

    // Tour Guiado
    document.getElementById('btn-tour')?.addEventListener('click', () => {
      if (this.tourActive) this.stopGuidedTour();
      else this.startGuidedTour();
    });
    document.getElementById('btn-tour-prev')?.addEventListener('click', () => {
      this.tourIndex = (this.tourIndex - 1 + TOUR_STEPS.length) % TOUR_STEPS.length;
      this.renderTourStep();
    });
    document.getElementById('btn-tour-next')?.addEventListener('click', () => {
      this.tourIndex = (this.tourIndex + 1) % TOUR_STEPS.length;
      this.renderTourStep();
    });
    document.getElementById('btn-tour-exit')?.addEventListener('click', () => {
      this.stopGuidedTour();
    });

    // Modais: Comparar, Viagem e Ajuda
    document.getElementById('btn-compare')?.addEventListener('click', () => {
      if (this.currentBody && this.currentBody.id !== 'earth') {
        const selB = document.getElementById('compare-select-b');
        if (selB) selB.value = this.currentBody.id;
      }
      this.updateComparisonModal();
      document.getElementById('compare-modal')?.classList.remove('hidden');
    });
    document.getElementById('btn-close-compare')?.addEventListener('click', () => {
      document.getElementById('compare-modal')?.classList.add('hidden');
    });
    document.getElementById('compare-select-a')?.addEventListener('change', () => this.updateComparisonModal());
    document.getElementById('compare-select-b')?.addEventListener('change', () => this.updateComparisonModal());

    document.getElementById('btn-distance')?.addEventListener('click', () => {
      if (this.currentBody && this.currentBody.id !== 'earth') {
        const selDest = document.getElementById('travel-select-dest');
        if (selDest) selDest.value = this.currentBody.id;
      }
      this.updateDistanceModal();
      document.getElementById('distance-modal')?.classList.remove('hidden');
    });
    document.getElementById('btn-close-distance')?.addEventListener('click', () => {
      document.getElementById('distance-modal')?.classList.add('hidden');
    });
    document.getElementById('travel-select-origin')?.addEventListener('change', () => this.updateDistanceModal());
    document.getElementById('travel-select-dest')?.addEventListener('change', () => this.updateDistanceModal());

    document.getElementById('btn-help')?.addEventListener('click', () => {
      document.getElementById('help-modal')?.classList.remove('hidden');
    });
    document.getElementById('btn-close-help')?.addEventListener('click', () => {
      document.getElementById('help-modal')?.classList.add('hidden');
    });

    // Fechar modais ao clicar no backdrop escuro
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.add('hidden');
      });
    });

    // Áudio Espacial Ambiente
    document.getElementById('btn-audio')?.addEventListener('click', (e) => {
      const isPlayingAudio = this.audio.toggle();
      e.currentTarget.classList.toggle('active', isPlayingAudio);
      document.getElementById('icon-audio-off')?.classList.toggle('hidden', isPlayingAudio);
      document.getElementById('icon-audio-on')?.classList.toggle('hidden', !isPlayingAudio);
    });

    // Assistente AstroIA
    document.getElementById('btn-ai-toggle')?.addEventListener('click', (e) => {
      const panel = document.getElementById('ai-panel');
      panel?.classList.toggle('hidden');
      e.currentTarget.classList.toggle('active', !panel?.classList.contains('hidden'));
    });

    document.getElementById('btn-close-ai')?.addEventListener('click', () => {
      document.getElementById('ai-panel')?.classList.add('hidden');
      document.getElementById('btn-ai-toggle')?.classList.remove('active');
    });

    document.getElementById('btn-ai-key')?.addEventListener('click', () => {
      document.getElementById('ai-key-box')?.classList.toggle('hidden');
    });

    document.getElementById('btn-save-api-key')?.addEventListener('click', () => {
      const key = document.getElementById('gemini-api-key-input')?.value || '';
      this.assistant.setApiKey(key);
      document.getElementById('ai-key-box')?.classList.add('hidden');
      this.appendAIMessage(
        'assistant',
        key
          ? 'Chave da API Google Gemini salva com sucesso!'
          : 'Usando o motor astrofísico local offline.'
      );
    });

    document.querySelectorAll('.ai-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        this.submitAIPrompt(chip.dataset.prompt);
      });
    });

    document.getElementById('ai-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('ai-input');
      if (input && input.value.trim()) {
        this.submitAIPrompt(input.value);
        input.value = '';
      }
    });
  }

  togglePlayPause() {
    this.scene3D.isPlaying = !this.scene3D.isPlaying;
    const playing = this.scene3D.isPlaying;
    document.getElementById('icon-pause')?.classList.toggle('hidden', !playing);
    document.getElementById('icon-play')?.classList.toggle('hidden', playing);
    const txt = document.getElementById('play-pause-text');
    if (txt) txt.textContent = playing ? 'Pausar' : 'Continuar';
    this.updateSpeedLabels(this.scene3D.daysPerSecond);
  }

  /**
   * Atalhos de teclado rápidos para controle do observatório
   */
  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignora atalhos quando o usuário está digitando em um input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.add('hidden'));
        this.stopGuidedTour();
      } else if (e.key.toLowerCase() === 'r') {
        this.scene3D.resetCameraView('overview');
      } else if (e.key.toLowerCase() === 'o') {
        const cb = document.getElementById('toggle-orbits');
        if (cb) {
          cb.checked = !cb.checked;
          cb.dispatchEvent(new Event('change'));
        }
      } else if (e.key.toLowerCase() === 'l') {
        const cb = document.getElementById('toggle-labels');
        if (cb) {
          cb.checked = !cb.checked;
          cb.dispatchEvent(new Event('change'));
        }
      } else if (e.key.toLowerCase() === 'c') {
        const active = this.scene3D.toggleCutawayMode();
        document.getElementById('btn-toggle-cutaway')?.classList.toggle('active', active);
      } else if (e.key.toLowerCase() === 'i') {
        document.getElementById('btn-ai-toggle')?.click();
      } else if (e.key >= '0' && e.key <= '9') {
        const body = SOLAR_SYSTEM_BODIES.find((b) => b.shortcutKey === e.key);
        if (body) {
          this.scene3D.focusOnBody(body.id, true);
        }
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.scene3D) {
      this.scene3D.update();
    }

    const now = performance.now();
    if (now - this.lastTelemetryUpdate > 150) {
      this.updateLiveInspectorTelemetry();
      this.lastTelemetryUpdate = now;
    }
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.cosmosApp = new CosmosApp();
  });
} else {
  window.cosmosApp = new CosmosApp();
}

