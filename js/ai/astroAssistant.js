import { SOLAR_SYSTEM_BODIES } from '../data/solarSystemData.js';

/**
 * Assistente de Inteligência Artificial Astronômica (AstroIA)
 * Possui um motor de conhecimento científico contextual completo (100% funcional offline)
 * que analisa perguntas em linguagem natural em português, executa comandos na cena 3D
 * (ex: "leve-me a Saturno", "mostre o interior da Terra") e opcionalmente integra com a API Gemini.
 */

export class AstroAssistant {
  constructor(onCommandCallback) {
    this.onCommand = onCommandCallback;
    this.apiKey = localStorage.getItem('cosmos3d_gemini_key') || '';
    this.focusedBody = SOLAR_SYSTEM_BODIES.find((b) => b.id === 'earth');
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem('cosmos3d_gemini_key', this.apiKey);
    } else {
      localStorage.removeItem('cosmos3d_gemini_key');
    }
  }

  setFocusedBody(body) {
    if (body) {
      this.focusedBody = body;
    }
  }

  /**
   * Processa a pergunta do usuário: usa Gemini API se configurada ou o Motor Astrofísico Local
   */
  async ask(questionText) {
    const q = questionText.trim();
    if (!q) return '';

    // Verifica se o usuário pediu para navegar ou focar em algum astro específico
    const navAction = this.detectNavigationCommand(q);
    if (navAction) {
      this.onCommand?.(navAction);
    }

    if (this.apiKey) {
      try {
        const apiReply = await this.callGeminiAPI(q);
        if (apiReply) return apiReply;
      } catch (err) {
        console.warn('Fallback para motor AstroIA local:', err);
      }
    }

    return this.generateLocalScientificAnswer(q);
  }

  detectNavigationCommand(query) {
    const norm = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Detecta pedido de corte interno / raio-x
    if (norm.includes('corte') || norm.includes('raio-x') || norm.includes('abrir interior')) {
      return { type: 'cutaway' };
    }

    // Verifica se mencionou o nome de algum astro para focar
    const nameMap = {
      sol: 'sun',
      mercurio: 'mercury',
      venus: 'venus',
      terra: 'earth',
      marte: 'mars',
      ceres: 'ceres',
      jupiter: 'jupiter',
      saturno: 'saturn',
      urano: 'uranus',
      netuno: 'neptune',
      plutao: 'pluto',
      halley: 'halley',
      cometa: 'halley'
    };

    for (const [ptName, id] of Object.entries(nameMap)) {
      if (norm.includes(ptName)) {
        const body = SOLAR_SYSTEM_BODIES.find((b) => b.id === id);
        if (body) {
          this.focusedBody = body;
          return { type: 'focus', bodyId: id };
        }
      }
    }

    return null;
  }

  generateLocalScientificAnswer(query) {
    const norm = query
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const b = this.focusedBody || SOLAR_SYSTEM_BODIES[3];
    const earth = SOLAR_SYSTEM_BODIES.find((x) => x.id === 'earth');

    // 1. Estrutura interna, núcleo, camadas ou atmosfera
    if (
      norm.includes('interior') ||
      norm.includes('interna') ||
      norm.includes('camada') ||
      norm.includes('nucleo') ||
      norm.includes('atmosfera')
    ) {
      const layersSummary = b.layers
        .map((l) => `• **${l.name}** (${l.pct}%): ${l.detail}`)
        .join('<br>');
      const atmoSummary = b.atmosphere
        .map((a) => `${a.gas} (${a.pct}%)`)
        .join(', ');
      return `A estrutura interna de **${b.name}** é dividida em:<br>${layersSummary}<br><br>**Atmosfera (${b.atmospherePressure}):** composta principalmente por ${atmoSummary}.<br>💡 *Dica:* Clique em **"Corte Interno 3D"** no painel direito para abrir o astro ao meio e ver essas camadas em 3D!`;
    }

    // 2. Habitabilidade / Vida humana / Sobrevivência
    if (
      norm.includes('vida') ||
      norm.includes('viver') ||
      norm.includes('habitab') ||
      norm.includes('sobreviver') ||
      norm.includes('humano')
    ) {
      if (b.id === 'earth') {
        return `**A Terra** é nosso único refúgio confirmado com biosfera ativa! Situada no coração da **Zona Habitável (Goldilocks)**, possui pressão de 1 atm, 21% de oxigênio, água líquida abundante e um escudo magnético gerado pelo núcleo externo líquido que bloqueia a radiação solar letal.`;
      }
      if (b.id === 'mars') {
        return `**Marte** é o principal candidato para futuras bases humanas, mas exige habitats pressurizados: sua atmosfera tem menos de 1% da pressão da Terra (95% CO₂), a temperatura média é de **-63 °C** e a gravidade é de **0,38 G** (${b.gravityMs2} m/s²). Contudo, há vastas reservas de gelo de água subterrâneo!`;
      }
      if (b.id === 'jupiter' || b.id === 'saturn') {
        return `Como **${b.name}** é um **Gigante Gasoso**, não há superfície sólida para pousar — uma nave afundaria em pressões esmagadoras de hidrogênio metálico. Porém, suas luas oceânicas geladas (**Europa** em Júpiter, e **Encélado** e **Titã** em Saturno) são os lugares mais promissores do Sistema Solar para encontrar vida microbiana extraterrestre!`;
      }
      return `A sobrevivência humana direta em **${b.name}** é impossível com a tecnologia atual: a temperatura média é de **${b.meanTempC} °C** (${b.tempRangeLabel}), com gravidade de **${b.gravityMs2} m/s²** e ambiente de **${b.atmospherePressure}**.`;
    }

    // 3. Comparação com a Terra
    if (norm.includes('compar') || norm.includes('diferenca') || norm.includes('maior')) {
      const diamRatio = (b.realDiameterKm / earth.realDiameterKm).toFixed(2);
      const gravRatio = (b.gravityMs2 / earth.gravityMs2).toFixed(2);
      return `Comparando **${b.name}** com a **Terra**:<br>• **Diâmetro:** ${b.realDiameterKm.toLocaleString('pt-BR')} km (**${diamRatio}x** o diâmetro terrestre)<br>• **Massa:** **${b.massEarthRatio}x** a massa da Terra<br>• **Gravidade:** ${b.gravityMs2} m/s² (**${gravRatio} G**) — uma pessoa de 70 kg na Terra pesaria **${(70 * (b.gravityMs2 / 9.81)).toFixed(1)} kg** lá.<br>• **Ano Orbital:** ${b.orbitalPeriodLabel} vs 365,25 dias na Terra.`;
    }

    // 4. Mecânica orbital / Leis de Kepler / Órbita
    if (norm.includes('kepler') || norm.includes('orbita') || norm.includes('velocidade') || norm.includes('ano')) {
      return `**Mecânica Orbital de ${b.name}:**<br>• **Distância Média ao Sol:** ${b.semiMajorAxisAU} UA (${(b.semiMajorAxisAU * 149.6).toFixed(1)} milhões de km)<br>• **Velocidade Orbital Média:** ${b.orbitalVelocityKms} km/s<br>• **Excentricidade ($e$):** ${b.eccentricity} e **Inclinação ($i$):** ${b.orbitalInclinationDeg}°<br><br>Pelas **Leis de Kepler**, quanto mais próximo do Sol um astro está, maior é sua velocidade orbital. Por isso Mercúrio voa a 47,4 km/s enquanto Netuno viaja a 5,4 km/s!`;
    }

    // 5. Curiosidades
    if (norm.includes('curiosidade') || norm.includes('interessante') || norm.includes('fato') || norm.includes('surpreendente')) {
      const factsHtml = b.facts.map((f) => `• ${f}`).join('<br><br>');
      return `Aqui estão 3 fatos científicos fascinantes sobre **${b.name}**:<br><br>${factsHtml}`;
    }

    // 6. Missões espaciais / Sondas
    if (norm.includes('missao') || norm.includes('missoes') || norm.includes('sonda') || norm.includes('visit')) {
      const mHtml = b.missions
        .map((m) => `• **${m.name}** (${m.year}): ${m.note}`)
        .join('<br>');
      return `**Exploração Espacial de ${b.name}:**<br>${mHtml}`;
    }

    // 7. Explicação geral detalhada do astro selecionado
    const moonsText =
      b.moons && b.moons.length > 0
        ? `Destacam-se em seu sistema lunar: **${b.moons.map((m) => m.name).join(', ')}**.`
        : 'Não possui luas naturais principais.';

    return `**${b.name}** — *${b.category} (${b.orderLabel})*<br><br>${b.description}<br><br>• **Diâmetro:** ${b.realDiameterKm.toLocaleString('pt-BR')} km | **Gravidade:** ${b.gravityMs2} m/s²<br>• **Temperatura:** ${b.tempRangeLabel}<br>• **Rotação (Dia):** ${b.rotationPeriodLabel} | **Translação (Ano):** ${b.orbitalPeriodLabel}<br>• ${moonsText}<br><br>💡 *Curiosidade:* ${b.facts[0]}`;
  }

  async callGeminiAPI(promptText) {
    const b = this.focusedBody || SOLAR_SYSTEM_BODIES[3];
    const systemInstruction = `Você é a AstroIA, copiloto astrofísica do simulador COSMOS 3D. Responda em português (pt-BR) de forma concisa, didática e cientificamente precisa (máximo 140 palavras). O astro atualmente selecionado pelo usuário no simulador 3D é: ${b.name} (${b.category}, diâmetro ${b.realDiameterKm} km, gravidade ${b.gravityMs2} m/s²). Use negrito (**texto**) para destacar dados importantes.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(this.apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    return raw
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }
}

