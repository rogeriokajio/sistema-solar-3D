(function() {
"use strict";
window.__startCosmosStandalone = function(deps) {
const { THREE, OrbitControls, EffectComposer, RenderPass, UnrealBloomPass } = deps;

// === js/data/solarSystemData.js ===
/**
 * Base de Dados Astrofísica Completa do Sistema Solar (COSMOS 3D)
 * Inclui parâmetros físicos reais, parâmetros visuais para escalas 3D,
 * luas principais, camadas internas, atmosfera, missões e curiosidades.
 */

const SOLAR_SYSTEM_BODIES = [
  {
    id: 'sun',
    name: 'Sol',
    category: 'Estrela Anã Amarela (G2V)',
    orderLabel: 'Centro do Sistema',
    tagline: 'A fornalha termonuclear que concentra 99,86% de toda a massa do Sistema Solar',
    color: '#fbbf24',
    accentGradient: 'radial-gradient(circle at 35% 35%, #fff7cc, #fbbf24 55%, #ea580c)',
    shortcutKey: '0',
    // Raios e distâncias na escala exploratória vs proporcional
    exploratoryRadius: 8.5,
    proportionalRadius: 24.0,
    realDiameterKm: 1392700,
    massKg: '1,989 × 10³⁰ kg',
    massEarthRatio: 333000,
    gravityMs2: 274.0,
    escapeVelocityKms: 617.7,
    meanTempC: 5505,
    tempRangeLabel: '5.505 °C (Fotosfera) a 15.000.000 °C (Núcleo)',
    semiMajorAxisAU: 0,
    exploratoryDistance: 0,
    orbitalPeriodDays: 0,
    orbitalPeriodLabel: '225 milhões de anos (Galáxia)',
    rotationPeriodHours: 609.12, // ~25.38 dias no equador
    rotationPeriodLabel: '25,4 dias (equador)',
    orbitalVelocityKms: 220.0,
    axialTiltDeg: 7.25,
    eccentricity: 0,
    orbitalInclinationDeg: 0,
    atmospherePressure: 'Plasma estelar em convecção magnética',
    description:
      'O Sol é uma esfera quase perfeita de plasma incandescente movida pela fusão nuclear de hidrogênio em hélio em seu núcleo. A cada segundo, converte cerca de 600 milhões de toneladas de hidrogênio, irradiando a energia que sustenta o clima e a vida na Terra.',
    layers: [
      { name: 'Núcleo Termonuclear', pct: 25, color: '#ffffff', detail: 'Fusão a 15 milhões de °C' },
      { name: 'Zona Radiativa', pct: 45, color: '#fde047', detail: 'Fótons levam até 100 mil anos para atravessar' },
      { name: 'Zona Convectiva', pct: 28, color: '#f97316', detail: 'Correntes gigantes de plasma em ebulição' },
      { name: 'Fotosfera & Coroa', pct: 2, color: '#dc2626', detail: 'Superfície visível e ejeções solares' }
    ],
    atmosphere: [
      { gas: 'Hidrogênio (H₂)', pct: 73.46 },
      { gas: 'Hélio (He)', pct: 24.85 },
      { gas: 'Oxigênio, Carbono, Ferro e Neônio', pct: 1.69 }
    ],
    missions: [
      { name: 'Parker Solar Probe (NASA)', year: '2018–Presente', note: 'Objeto mais rápido feito pelo homem; mergulhou na coroa solar.' },
      { name: 'Solar Orbiter (ESA/NASA)', year: '2020–Presente', note: 'Imagens inéditas de alta resolução dos polos solares.' },
      { name: 'SOHO', year: '1995–Presente', note: 'Monitoramento contínuo de tempestades solares e cometas.' }
    ],
    facts: [
      'A luz do Sol leva cerca de 8 minutos e 19 segundos para chegar à Terra, mas um fóton gerado no núcleo pode levar 100.000 anos até atingir a superfície.',
      'Cabem aproximadamente 1,3 milhão de planetas Terra dentro do volume do Sol.',
      'A coroa solar (atmosfera externa) é misteriosamente centenas de vezes mais quente que a superfície visível, ultrapassando 1 milhão de graus Celsius.'
    ],
    moons: []
  },
  {
    id: 'mercury',
    name: 'Mercúrio',
    category: 'Planeta Rochoso (Telúrico)',
    orderLabel: '1º Planeta',
    tagline: 'O mundo dos extremos térmicos e da órbita mais veloz ao redor do Sol',
    color: '#9ca3af',
    accentGradient: 'radial-gradient(circle at 35% 35%, #e5e7eb, #9ca3af 60%, #4b5563)',
    shortcutKey: '1',
    exploratoryRadius: 1.05,
    proportionalRadius: 0.48,
    realDiameterKm: 4879,
    massKg: '3,301 × 10²³ kg',
    massEarthRatio: 0.055,
    gravityMs2: 3.7,
    escapeVelocityKms: 4.25,
    meanTempC: 167,
    tempRangeLabel: '-180 °C (noite) a +430 °C (dia)',
    semiMajorAxisAU: 0.387,
    exploratoryDistance: 17,
    orbitalPeriodDays: 87.97,
    orbitalPeriodLabel: '88 dias terrestres',
    rotationPeriodHours: 1407.6,
    rotationPeriodLabel: '58,6 dias terrestres',
    orbitalVelocityKms: 47.36,
    axialTiltDeg: 0.03,
    eccentricity: 0.2056,
    orbitalInclinationDeg: 7.0,
    atmospherePressure: 'Exosfera ultratênue (~10⁻¹⁴ atm)',
    description:
      'Mercúrio é o menor e mais interno planeta do Sistema Solar. Sem uma atmosfera densa para reter calor, sua superfície crivada de crateras sofre a maior variação térmica de todos os planetas, enquanto seu interior abriga um núcleo metálico colossal.',
    layers: [
      { name: 'Núcleo Interno Sólido', pct: 42, color: '#fbbf24', detail: 'Ferro sólido sob alta pressão' },
      { name: 'Núcleo Externo Líquido', pct: 40, color: '#d97706', detail: 'Compõe ~85% do raio do planeta!' },
      { name: 'Manto de Silicatos', pct: 15, color: '#78716c', detail: 'Camada rochosa relativamente fina' },
      { name: 'Crosta Craterizada', pct: 3, color: '#a8a29e', detail: 'Escarpes de falha e Bacia Caloris' }
    ],
    atmosphere: [
      { gas: 'Oxigênio atômico (O)', pct: 42.0 },
      { gas: 'Sódio (Na)', pct: 29.0 },
      { gas: 'Hidrogênio (H₂) e Hélio (He)', pct: 28.0 },
      { gas: 'Potássio e outros traços', pct: 1.0 }
    ],
    missions: [
      { name: 'Mariner 10 (NASA)', year: '1974–1975', note: 'Primeira sonda a mapear 45% da superfície de Mercúrio.' },
      { name: 'MESSENGER (NASA)', year: '2011–2015', note: 'Mapeou 100% do planeta e confirmou gelo de água nos polos.' },
      { name: 'BepiColombo (ESA/JAXA)', year: 'Em trânsito', note: 'Missão dupla para estudar o campo magnético e núcleo.' }
    ],
    facts: [
      'Apesar de ser o planeta mais próximo do Sol, Mercúrio não é o mais quente (Vênus é), pois não possui atmosfera para criar efeito estufa.',
      'Nas profundezas das crateras polares onde a luz solar nunca entra, existe gelo de água pura preservado a -180 °C.',
      'Devido à sua ressonância spin-órbita 3:2, um dia solar completo em Mercúrio (do nascer ao pôr do Sol) dura 176 dias terrestres — o dobro do seu ano!'
    ],
    moons: []
  },
  {
    id: 'venus',
    name: 'Vênus',
    category: 'Planeta Rochoso (Telúrico)',
    orderLabel: '2º Planeta',
    tagline: 'O gêmeo escaldante da Terra envolto em nuvens densas de ácido sulfúrico',
    color: '#f59e0b',
    accentGradient: 'radial-gradient(circle at 35% 35%, #fef3c7, #f59e0b 60%, #92400e)',
    shortcutKey: '2',
    exploratoryRadius: 1.75,
    proportionalRadius: 1.18,
    realDiameterKm: 12104,
    massKg: '4,867 × 10²⁴ kg',
    massEarthRatio: 0.815,
    gravityMs2: 8.87,
    escapeVelocityKms: 10.36,
    meanTempC: 464,
    tempRangeLabel: '+464 °C constantes (dia e noite, capaz de derreter chumbo)',
    semiMajorAxisAU: 0.723,
    exploratoryDistance: 25,
    orbitalPeriodDays: 224.7,
    orbitalPeriodLabel: '224,7 dias terrestres',
    rotationPeriodHours: -5832.5, // Rotação retrógrada
    rotationPeriodLabel: '243 dias (Retrógrado)',
    orbitalVelocityKms: 35.02,
    axialTiltDeg: 177.36,
    eccentricity: 0.0067,
    orbitalInclinationDeg: 3.39,
    atmospherePressure: '92 atm (equivalente a 900m de profundidade no oceano)',
    description:
      'Quase do mesmo tamanho e massa da Terra, Vênus sofreu um efeito estufa descontrolado. Sua atmosfera ultradensa de dióxido de carbono aprisiona o calor solar, tornando-o o planeta mais quente do Sistema Solar, além de girar no sentido oposto à maioria dos planetas.',
    layers: [
      { name: 'Núcleo Metálico (Fe-Ni)', pct: 50, color: '#fbbf24', detail: 'Sem dínamo magnético global ativo' },
      { name: 'Manto Rochoso Quente', pct: 46, color: '#ea580c', detail: 'Convecção intensa e vulcanismo' },
      { name: 'Crosta Basáltica', pct: 4, color: '#b45309', detail: 'Mais de 1.600 grandes vulcões mapeados' }
    ],
    atmosphere: [
      { gas: 'Dióxido de Carbono (CO₂)', pct: 96.5 },
      { gas: 'Nitrogênio (N₂)', pct: 3.5 },
      { gas: 'Dióxido de Enxofre (SO₂) e Ácido Sulfúrico', pct: 0.015 }
    ],
    missions: [
      { name: 'Venera 13 (URSS)', year: '1982', note: 'Pousou na superfície e sobreviveu por 127 minutos a 457 °C, enviando fotos coloridas.' },
      { name: 'Magellan (NASA)', year: '1990–1994', note: 'Mapeou 98% da superfície por radar atravessando as nuvens.' },
      { name: 'Akatsuki (JAXA)', year: '2015–Presente', note: 'Estuda a super-rotação das nuvens venusianas.' }
    ],
    facts: [
      'Vênus gira ao contrário (rotação retrógrada): lá, o Sol nasce no oeste e se põe no leste.',
      'Sua rotação é tão lenta que um dia sideral em Vênus (243 dias terrestres) é mais longo do que o seu próprio ano (224,7 dias)!',
      'Embora a superfície seja um inferno de 464 °C, a cerca de 50 km de altitude nas nuvens a pressão e temperatura são semelhantes às da Terra.'
    ],
    moons: []
  },
  {
    id: 'earth',
    name: 'Terra',
    category: 'Planeta Rochoso (Mundo Oceânico)',
    orderLabel: '3º Planeta',
    tagline: 'Nosso oásis cósmico na Zona Habitável com água líquida, placas tectônicas e biosfera',
    color: '#38bdf8',
    accentGradient: 'radial-gradient(circle at 35% 35%, #bae6fd, #0284c7 55%, #15803d)',
    shortcutKey: '3',
    exploratoryRadius: 1.9,
    proportionalRadius: 1.25,
    realDiameterKm: 12756,
    massKg: '5,972 × 10²⁴ kg',
    massEarthRatio: 1.0,
    gravityMs2: 9.81,
    escapeVelocityKms: 11.19,
    meanTempC: 15,
    tempRangeLabel: '-89,2 °C (Antártida) a +56,7 °C (Vale da Morte)',
    semiMajorAxisAU: 1.0,
    exploratoryDistance: 35,
    orbitalPeriodDays: 365.256,
    orbitalPeriodLabel: '365,25 dias (1 ano)',
    rotationPeriodHours: 23.934,
    rotationPeriodLabel: '23h 56m 04s',
    orbitalVelocityKms: 29.78,
    axialTiltDeg: 23.44,
    eccentricity: 0.0167,
    orbitalInclinationDeg: 0.0,
    atmospherePressure: '1,00 atm ao nível do mar (101,325 kPa)',
    description:
      'A Terra é o maior dos quatro planetas rochosos e o único corpo celeste conhecido a abrigar vida. Seu campo magnético global (magnetosfera) protege a atmosfera contra o vento solar, enquanto 71% de sua superfície é coberta por oceanos de água líquida.',
    layers: [
      { name: 'Núcleo Interno Sólido', pct: 19, color: '#fef08a', detail: 'Ferro-níquel cristalino a 5.400 °C' },
      { name: 'Núcleo Externo Líquido', pct: 35, color: '#f97316', detail: 'Gera o campo geomagnético protetor' },
      { name: 'Manto Superior e Inferior', pct: 44, color: '#b91c1c', detail: 'Silicatos que movem as placas tectônicas' },
      { name: 'Crosta Oceânica & Continental', pct: 2, color: '#0284c7', detail: 'De 5 km a 70 km de espessura' }
    ],
    atmosphere: [
      { gas: 'Nitrogênio (N₂)', pct: 78.08 },
      { gas: 'Oxigênio (O₂)', pct: 20.95 },
      { gas: 'Argônio (Ar)', pct: 0.93 },
      { gas: 'Dióxido de Carbono (CO₂) e Vapor d’Água', pct: 0.04 }
    ],
    missions: [
      { name: 'Estação Espacial Internacional (ISS)', year: '1998–Presente', note: 'Laboratório tripulado em órbita baixa a 408 km de altitude.' },
      { name: 'Programa Apollo & Artemis', year: '1969 / Presente', note: 'Exploração humana do sistema Terra-Lua.' },
      { name: 'Frota de Observação Terrestre (Landsat/Sentinel)', year: 'Contínuo', note: 'Monitoramento climático, oceânico e da biosfera.' }
    ],
    facts: [
      'A inclinação axial de 23,44° da Terra — resultado de uma colisão gigantesca há 4,5 bilhões de anos que também formou a Lua — é o que produz as quatro estações do ano.',
      'A Terra não é uma esfera perfeita: devido à força centrífuga da rotação, o diâmetro no equador é 43 km maior que de polo a polo.',
      'A Lua estabiliza a inclinação da Terra e freia gradualmente nossa rotação, afastando-se cerca de 3,8 centímetros por ano.'
    ],
    moons: [
      {
        id: 'moon',
        name: 'Lua',
        color: '#d1d5db',
        radius: 0.52,
        distance: 4.3,
        periodDays: 27.32,
        realDiameterKm: 3474,
        description: 'Quinto maior satélite natural do Sistema Solar; sempre mostra a mesma face para a Terra (rotação sincronizada).'
      }
    ]
  },
  {
    id: 'mars',
    name: 'Marte',
    category: 'Planeta Rochoso (Telúrico)',
    orderLabel: '4º Planeta',
    tagline: 'O Planeta Vermelho dos cânions colossais, do Monte Olimpo e dos antigos rios secos',
    color: '#ef4444',
    accentGradient: 'radial-gradient(circle at 35% 35%, #fca5a5, #dc2626 55%, #7f1d1d)',
    shortcutKey: '4',
    exploratoryRadius: 1.38,
    proportionalRadius: 0.67,
    realDiameterKm: 6792,
    massKg: '6,417 × 10²³ kg',
    massEarthRatio: 0.107,
    gravityMs2: 3.72,
    escapeVelocityKms: 5.03,
    meanTempC: -63,
    tempRangeLabel: '-140 °C (polos no inverno) a +20 °C (equador no verão)',
    semiMajorAxisAU: 1.524,
    exploratoryDistance: 46,
    orbitalPeriodDays: 686.98,
    orbitalPeriodLabel: '687 dias (1,88 ano)',
    rotationPeriodHours: 24.62,
    rotationPeriodLabel: '24h 37m 22s (1 Sol)',
    orbitalVelocityKms: 24.07,
    axialTiltDeg: 25.19,
    eccentricity: 0.0934,
    orbitalInclinationDeg: 1.85,
    atmospherePressure: '0,006 atm (< 1% da pressão terrestre)',
    description:
      'A cor ferruginosa de Marte vem do óxido de ferro que cobre seu solo. No passado remoto, Marte teve rios, deltas e lagos de água líquida. Hoje é o mundo mais explorado por rovers robóticos em busca de bioassinaturas antigas e preparação para missões humanas.',
    layers: [
      { name: 'Núcleo Líquido (Fe-Ni-S)', pct: 48, color: '#f59e0b', detail: 'Rico em enxofre e elementos leves' },
      { name: 'Manto de Silicatos', pct: 47, color: '#b45309', detail: 'Inativo tectonicamente hoje' },
      { name: 'Crosta Rica em Óxido de Ferro', pct: 5, color: '#dc2626', detail: 'Sustenta o Monte Olimpo (21,9 km de altura)' }
    ],
    atmosphere: [
      { gas: 'Dióxido de Carbono (CO₂)', pct: 95.32 },
      { gas: 'Nitrogênio (N₂)', pct: 2.7 },
      { gas: 'Argônio (Ar)', pct: 1.6 },
      { gas: 'Oxigênio e Monóxido de Carbono', pct: 0.38 }
    ],
    missions: [
      { name: 'Perseverance & Ingenuity (NASA)', year: '2021–Presente', note: 'Explora a Cratera Jezero e realizou o primeiro voo motorizado em outro planeta.' },
      { name: 'Curiosity Rover (NASA)', year: '2012–Presente', note: 'Confirmou condições antigas habitáveis na Cratera Gale.' },
      { name: 'InSight', year: '2018–2022', note: 'Mediu sismos marcianos ("marsquakes") e mapeou o tamanho do núcleo.' }
    ],
    facts: [
      'Marte abriga o Monte Olimpo (Olympus Mons), o maior vulcão do Sistema Solar: com 21,9 km de altura, é quase três vezes mais alto que o Monte Everest.',
      'O sistema de cânions Valles Marineris se estende por 4.000 km de comprimento e até 7 km de profundidade — largo o suficiente para cruzar os Estados Unidos inteiros.',
      'O pôr do sol em Marte é azulado, pois a poeira fina rica em ferro espalha a luz azul na direção do Sol.'
    ],
    moons: [
      {
        id: 'phobos',
        name: 'Fobos',
        color: '#a8a29e',
        radius: 0.25,
        distance: 2.6,
        periodDays: 0.318,
        realDiameterKm: 22.2,
        description: 'Orbita tão perto de Marte (6.000 km) que completa 3 voltas por dia; em ~50 milhões de anos se fragmentará formando um anel.'
      },
      {
        id: 'deimos',
        name: 'Deimos',
        color: '#d6d3d1',
        radius: 0.2,
        distance: 3.6,
        periodDays: 1.263,
        realDiameterKm: 12.6,
        description: 'Pequena lua irregular e craterizada que se afasta lentamente de Marte.'
      }
    ]
  },
  {
    id: 'ceres',
    name: 'Ceres',
    category: 'Planeta Anão (Cinturão de Asteroides)',
    orderLabel: 'Cinturão Principal',
    tagline: 'O maior corpo do Cinturão de Asteroides entre Marte e Júpiter, com criovulcões de sal',
    color: '#94a3b8',
    accentGradient: 'radial-gradient(circle at 35% 35%, #cbd5e1, #64748b 60%, #334155)',
    shortcutKey: '5',
    exploratoryRadius: 0.78,
    proportionalRadius: 0.25,
    realDiameterKm: 939,
    massKg: '9,38 × 10²⁰ kg',
    massEarthRatio: 0.00016,
    gravityMs2: 0.28,
    escapeVelocityKms: 0.51,
    meanTempC: -105,
    tempRangeLabel: '-143 °C a -38 °C',
    semiMajorAxisAU: 2.767,
    exploratoryDistance: 58,
    orbitalPeriodDays: 1681.6,
    orbitalPeriodLabel: '4,6 anos terrestres',
    rotationPeriodHours: 9.07,
    rotationPeriodLabel: '9h 04m',
    orbitalVelocityKms: 17.9,
    axialTiltDeg: 4.0,
    eccentricity: 0.0758,
    orbitalInclinationDeg: 10.59,
    atmospherePressure: 'Exosfera transitória de vapor d’água',
    description:
      'Localizado no coração do Cinturão Principal de Asteroides, Ceres concentra um terço de toda a massa do cinturão. É o único planeta anão no Sistema Solar interno e possui reservatórios subterrâneos de salmoura que formam depósitos brilhantes em suas crateras.',
    layers: [
      { name: 'Núcleo Rochoso Hidratado', pct: 65, color: '#64748b', detail: 'Silicatos e argilas antigas' },
      { name: 'Manto de Gelo e Salmoura', pct: 28, color: '#38bdf8', detail: 'Reservatórios líquidos salinos residuais' },
      { name: 'Crosta Escura com Sais Brilhantes', pct: 7, color: '#cbd5e1', detail: 'Carbonato de sódio na Cratera Occator' }
    ],
    atmosphere: [
      { gas: 'Vapor d’Água sublimado (H₂O)', pct: 100.0 }
    ],
    missions: [
      { name: 'Dawn (NASA)', year: '2015–2018', note: 'Primeira sonda a orbitar um planeta anão, revelando as manchas brilhantes da Cratera Occator.' }
    ],
    facts: [
      'Ao contrário do que mostram filmes de ficção científica, os asteroides do cinturão estão separados por milhões de quilômetros de espaço vazio.',
      'Ceres contém mais água doce (em forma de gelo e minerais hidratados) em seu manto do que toda a água doce disponível na superfície da Terra.',
      'O monte Ahuna Mons em Ceres é um criovulcão de 4 km de altura que expele lama gelada e sais em vez de lava derretida.'
    ],
    moons: []
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    category: 'Gigante Gasoso',
    orderLabel: '5º Planeta',
    tagline: 'O colosso soberano dos planetas, com sua Grande Mancha Vermelha e 95 luas',
    color: '#e09f67',
    accentGradient: 'radial-gradient(circle at 35% 35%, #fde68a, #d97706 55%, #7c2d12)',
    shortcutKey: '6',
    exploratoryRadius: 4.5,
    proportionalRadius: 11.2,
    realDiameterKm: 142984,
    massKg: '1,898 × 10²⁷ kg',
    massEarthRatio: 317.8,
    gravityMs2: 24.79,
    escapeVelocityKms: 59.5,
    meanTempC: -110,
    tempRangeLabel: '-145 °C (topo das nuvens) a +24.000 °C (núcleo)',
    semiMajorAxisAU: 5.204,
    exploratoryDistance: 74,
    orbitalPeriodDays: 4332.59,
    orbitalPeriodLabel: '11,86 anos terrestres',
    rotationPeriodHours: 9.925,
    rotationPeriodLabel: '9h 55m 30s',
    orbitalVelocityKms: 13.07,
    axialTiltDeg: 3.13,
    eccentricity: 0.0489,
    orbitalInclinationDeg: 1.3,
    atmospherePressure: 'Sem superfície sólida (transição contínua gás → líquido)',
    description:
      'Júpiter possui duas vezes e meia a massa de todos os outros planetas do Sistema Solar combinados. Sua rotação ultrarrápida de menos de 10 horas estica suas nuvens de amônia em faixas turbulentas e alimenta a Grande Mancha Vermelha, um anticiclone maior que a Terra.',
    layers: [
      { name: 'Núcleo Difuso Rochoso/Metálico', pct: 18, color: '#fef08a', detail: 'Mistura densa a 24.000 °C' },
      { name: 'Hidrogênio Metálico Líquido', pct: 58, color: '#38bdf8', detail: 'Sob pressão extrema, o H₂ conduz eletricidade!' },
      { name: 'Hidrogênio Molecular Líquido', pct: 19, color: '#d97706', detail: 'Oceano profundo de hidrogênio supercrítico' },
      { name: 'Atmosfera de Amônia e Sulfetos', pct: 5, color: '#f59e0b', detail: 'Bandas zonais e Grande Mancha Vermelha' }
    ],
    atmosphere: [
      { gas: 'Hidrogênio (H₂)', pct: 89.8 },
      { gas: 'Hélio (He)', pct: 10.2 },
      { gas: 'Metano, Amônia, Etano e Água (traços)', pct: 0.3 }
    ],
    missions: [
      { name: 'Juno (NASA)', year: '2016–Presente', note: 'Revelou ciclones polares geométricos e a estrutura profunda do núcleo.' },
      { name: 'Galileo (NASA)', year: '1995–2003', note: 'Lançou uma sonda na atmosfera e descobriu o oceano subterrâneo de Europa.' },
      { name: 'Europa Clipper & JUICE', year: '2024–2030s', note: 'Missões dedicadas às luas oceânicas geladas de Júpiter.' }
    ],
    facts: [
      'Júpiter tem o dia mais curto de todos os planetas: apesar de seu tamanho colossal, dá uma volta completa em apenas 9 horas e 55 minutos.',
      'A Grande Mancha Vermelha é uma tempestade com ventos de 640 km/h que dura há pelo menos 350 anos e comporta o planeta Terra inteiro dentro dela.',
      'Sua lua Europa possui um oceano global de água salgada líquida sob sua crosta de gelo com o dobro do volume de todos os oceanos da Terra!'
    ],
    moons: [
      {
        id: 'io',
        name: 'Io',
        color: '#facc15',
        radius: 0.48,
        distance: 6.2,
        periodDays: 1.769,
        realDiameterKm: 3643,
        description: 'Corpo geologicamente mais ativo do Sistema Solar, com mais de 400 vulcões ativos movidos pelas marés gravitacionais de Júpiter.'
      },
      {
        id: 'europa',
        name: 'Europa',
        color: '#bae6fd',
        radius: 0.44,
        distance: 7.6,
        periodDays: 3.551,
        realDiameterKm: 3121,
        description: 'Crosta lisa de gelo d’água sobre um oceano líquido global aquecido por fontes hidrotermais — principal candidata a vida microbiana.'
      },
      {
        id: 'ganymede',
        name: 'Ganimedes',
        color: '#9ca3af',
        radius: 0.62,
        distance: 9.2,
        periodDays: 7.154,
        realDiameterKm: 5268,
        description: 'A maior lua do Sistema Solar (maior que o planeta Mercúrio!) e a única lua com seu próprio campo magnético.'
      },
      {
        id: 'callisto',
        name: 'Calisto',
        color: '#6b7280',
        radius: 0.56,
        distance: 10.9,
        periodDays: 16.689,
        realDiameterKm: 4820,
        description: 'Superfície mais antiga e densamente craterizada do Sistema Solar.'
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturno',
    category: 'Gigante Gasoso',
    orderLabel: '6º Planeta',
    tagline: 'A joia coroada do cosmos, cercada por um sistema monumental de anéis de gelo',
    color: '#eab308',
    accentGradient: 'radial-gradient(circle at 35% 35%, #fef08a, #ca8a04 60%, #713f12)',
    hasRings: true,
    shortcutKey: '7',
    exploratoryRadius: 3.85,
    proportionalRadius: 9.45,
    realDiameterKm: 120536,
    massKg: '5,683 × 10²⁶ kg',
    massEarthRatio: 95.16,
    gravityMs2: 10.44,
    escapeVelocityKms: 35.5,
    meanTempC: -140,
    tempRangeLabel: '-178 °C (nuvens) a +11.700 °C (núcleo)',
    semiMajorAxisAU: 9.582,
    exploratoryDistance: 96,
    orbitalPeriodDays: 10759.22,
    orbitalPeriodLabel: '29,45 anos terrestres',
    rotationPeriodHours: 10.55,
    rotationPeriodLabel: '10h 33m',
    orbitalVelocityKms: 9.68,
    axialTiltDeg: 26.73,
    eccentricity: 0.0565,
    orbitalInclinationDeg: 2.49,
    atmospherePressure: 'Gigante gasoso com densidade média menor que a da água (0,687 g/cm³)',
    description:
      'Saturno é famoso por seu espetacular sistema de anéis, que se estende por 282.000 km de diâmetro mas tem apenas cerca de 10 a 30 metros de espessura! É também o planeta com maior número de luas confirmadas (146), incluindo Titã e Encélado.',
    layers: [
      { name: 'Núcleo Rochoso e de Gelo', pct: 22, color: '#fde047', detail: '9 a 22 vezes a massa da Terra' },
      { name: 'Hidrogênio Metálico Líquido', pct: 43, color: '#38bdf8', detail: 'Gera campo magnético perfeitamente alinhado ao eixo' },
      { name: 'Hidrogênio e Hélio Líquidos', pct: 30, color: '#ca8a04', detail: 'Chuva de hélio nas camadas internas' },
      { name: 'Atmosfera Superior & Hexágono Polar', pct: 5, color: '#fde68a', detail: 'Ventos de até 1.800 km/h' }
    ],
    atmosphere: [
      { gas: 'Hidrogênio (H₂)', pct: 96.3 },
      { gas: 'Hélio (He)', pct: 3.25 },
      { gas: 'Metano, Amônia e Etano', pct: 0.45 }
    ],
    missions: [
      { name: 'Cassini-Huygens (NASA/ESA)', year: '2004–2017', note: 'Orbitou Saturno por 13 anos, pousou a sonda Huygens em Titã e mergulhou entre os anéis.' },
      { name: 'Dragonfly (NASA)', year: 'Lançamento 2028', note: 'Drone nuclear octocóptero para voar pela atmosfera e dunas de Titã.' }
    ],
    facts: [
      'A densidade média de Saturno é de apenas 0,687 g/cm³ — mais leve que a água (1,0 g/cm³). Se existisse um oceano grande o suficiente, Saturno flutuaria!',
      'No polo norte de Saturno existe uma corrente de jato atmosférica em formato de hexágono perfeito com 30.000 km de largura.',
      'Sua lua Titã é o único satélite com atmosfera densa e possui rios, chuvas e mares líquidos — mas feitos de metano e etano líquidos a -179 °C!'
    ],
    moons: [
      {
        id: 'enceladus',
        name: 'Encélado',
        color: '#f0f9ff',
        radius: 0.34,
        distance: 8.8,
        periodDays: 1.37,
        realDiameterKm: 504,
        description: 'Reflete quase 100% da luz solar e dispara gêiseres de água salgada e moléculas orgânicas de seu polo sul para o espaço.'
      },
      {
        id: 'titan',
        name: 'Titã',
        color: '#f59e0b',
        radius: 0.6,
        distance: 10.8,
        periodDays: 15.945,
        realDiameterKm: 5149,
        description: 'Segunda maior lua do Sistema Solar; possui atmosfera de nitrogênio 1,45x mais densa que a da Terra e lagos de hidrocarbonetos.'
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Urano',
    category: 'Gigante de Gelo',
    orderLabel: '7º Planeta',
    tagline: 'O gigante gelado azul-ciano que "rola de lado" em sua órbita com inclinação de 98°',
    color: '#22d3ee',
    accentGradient: 'radial-gradient(circle at 35% 35%, #cffafe, #06b6d4 60%, #164e63)',
    hasRings: true,
    shortcutKey: '8',
    exploratoryRadius: 2.75,
    proportionalRadius: 4.0,
    realDiameterKm: 51118,
    massKg: '8,681 × 10²⁵ kg',
    massEarthRatio: 14.54,
    gravityMs2: 8.69,
    escapeVelocityKms: 21.3,
    meanTempC: -195,
    tempRangeLabel: '-224 °C (atmosfera mais fria do Sistema Solar)',
    semiMajorAxisAU: 19.218,
    exploratoryDistance: 118,
    orbitalPeriodDays: 30688.5,
    orbitalPeriodLabel: '84 anos terrestres',
    rotationPeriodHours: -17.24,
    rotationPeriodLabel: '17h 14m (Retrógrado)',
    orbitalVelocityKms: 6.8,
    axialTiltDeg: 97.77,
    eccentricity: 0.0472,
    orbitalInclinationDeg: 0.77,
    atmospherePressure: 'Gigante de gelo rico em água, amônia e metano supercríticos',
    description:
      'Urano inaugura a classe dos Gigantes de Gelo. Sua cor azul-água serena é causada pelo gás metano na alta atmosfera, que absorve a luz vermelha. Sua característica mais extraordinária é seu eixo de rotação tombado em 97,77°, fazendo com que seus polos fiquem apontados diretamente para o Sol.',
    layers: [
      { name: 'Núcleo Rochoso (Silicatos/Fe-Ni)', pct: 20, color: '#64748b', detail: 'Núcleo relativamente pequeno e frio' },
      { name: 'Manto Fluido de Gelos (H₂O, NH₃, CH₄)', pct: 60, color: '#0284c7', detail: 'Fluido denso sob pressão em que "chove diamante"' },
      { name: 'Atmosfera de H₂, He e Metano', pct: 20, color: '#67e8f9', detail: 'Nevoeiro de metano a -224 °C' }
    ],
    atmosphere: [
      { gas: 'Hidrogênio (H₂)', pct: 82.5 },
      { gas: 'Hélio (He)', pct: 15.2 },
      { gas: 'Metano (CH₄)', pct: 2.3 }
    ],
    missions: [
      { name: 'Voyager 2 (NASA)', year: '1986', note: 'Única espaçonave a visitar Urano de perto, descobrindo 10 novas luas e 2 anéis.' }
    ],
    facts: [
      'Por estar tombado em 98°, cada polo de Urano experimenta 42 anos terrestres ininterruptos de luz solar seguidos por 42 anos de noite polar.',
      'Embora Netuno esteja mais longe do Sol, Urano detém o recorde de temperatura planetária mais fria já registrada (-224 °C), pois quase não irradia calor interno.',
      'As 28 luas de Urano não têm nomes da mitologia greco-romana, mas sim de personagens das obras de William Shakespeare e Alexander Pope (como Titânia, Oberon e Miranda).'
    ],
    moons: [
      {
        id: 'titania',
        name: 'Titânia',
        color: '#cbd5e1',
        radius: 0.36,
        distance: 5.5,
        periodDays: 8.706,
        realDiameterKm: 1578,
        description: 'Maior lua de Urano, marcada por enormes falhas tectônicas e cânions de gelo.'
      },
      {
        id: 'oberon',
        name: 'Oberon',
        color: '#94a3b8',
        radius: 0.34,
        distance: 6.8,
        periodDays: 13.463,
        realDiameterKm: 1522,
        description: 'Segunda maior lua de Urano, rica em gelo de água e material escuro rico em carbono.'
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Netuno',
    category: 'Gigante de Gelo',
    orderLabel: '8º Planeta',
    tagline: 'O mundo azul-cobalto dos ventos supersônicos na fronteira dos planetas principais',
    color: '#3b82f6',
    accentGradient: 'radial-gradient(circle at 35% 35%, #93c5fd, #2563eb 55%, #1e3a8a)',
    shortcutKey: '9',
    exploratoryRadius: 2.65,
    proportionalRadius: 3.88,
    realDiameterKm: 49528,
    massKg: '1,024 × 10²⁶ kg',
    massEarthRatio: 17.15,
    gravityMs2: 11.15,
    escapeVelocityKms: 23.5,
    meanTempC: -200,
    tempRangeLabel: '-218 °C (topo das nuvens)',
    semiMajorAxisAU: 30.07,
    exploratoryDistance: 138,
    orbitalPeriodDays: 60195.0,
    orbitalPeriodLabel: '164,8 anos terrestres',
    rotationPeriodHours: 16.11,
    rotationPeriodLabel: '16h 06m',
    orbitalVelocityKms: 5.43,
    axialTiltDeg: 28.32,
    eccentricity: 0.0086,
    orbitalInclinationDeg: 1.77,
    atmospherePressure: 'Gigante de gelo ativo com os ventos mais rápidos do Sistema Solar',
    description:
      'Netuno foi o primeiro planeta encontrado por previsão matemática antes mesmo de ser visto por telescópio, graças às perturbações gravitacionais na órbita de Urano. Apesar de receber 900 vezes menos luz solar que a Terra, seu calor interno impulsiona ventos supersônicos de 2.100 km/h.',
    layers: [
      { name: 'Núcleo Rochoso (Fe-Ni-Silicatos)', pct: 22, color: '#475569', detail: 'Aproximadamente 1,2x a massa da Terra' },
      { name: 'Manto Quente de Água, Amônia e Metano', pct: 62, color: '#1d4ed8', detail: 'Oceano iônico onde o metano se decompõe em cristais de diamante' },
      { name: 'Atmosfera Azul-Cobalto & Cirros de Metano', pct: 16, color: '#60a5fa', detail: 'Tempestades escuras e ventos de 2.100 km/h' }
    ],
    atmosphere: [
      { gas: 'Hidrogênio (H₂)', pct: 80.0 },
      { gas: 'Hélio (He)', pct: 19.0 },
      { gas: 'Metano (CH₄)', pct: 1.5 }
    ],
    missions: [
      { name: 'Voyager 2 (NASA)', year: '1989', note: 'Sobrevoou a apenas 4.950 km do polo norte de Netuno e descobriu gêiseres ativos na lua Tritão.' }
    ],
    facts: [
      'Descoberto em 1846, Netuno leva 164,8 anos para dar uma volta no Sol: ele completou sua primeira órbita desde a descoberta apenas no ano de 2011!',
      'Os ventos em Netuno atingem 2.100 km/h — os mais velozes do Sistema Solar, superando a velocidade do som.',
      'Sua maior lua, Tritão, gira em órbita retrógrada (sentido contrário à rotação de Netuno), indicando que era um planeta anão do Cinturão de Kuiper capturado pela gravidade netuniana.'
    ],
    moons: [
      {
        id: 'triton',
        name: 'Tritão',
        color: '#e2e8f0',
        radius: 0.42,
        distance: 5.8,
        periodDays: -5.877, // Órbita retrógrada!
        realDiameterKm: 2706,
        description: 'Única grande lua com órbita retrógrada; possui criovulcões que lançam plumas de nitrogênio líquido a 8 km de altura.'
      }
    ]
  },
  {
    id: 'pluto',
    name: 'Plutão',
    category: 'Planeta Anão (Cinturão de Kuiper)',
    orderLabel: 'Cinturão de Kuiper',
    tagline: 'O mundo binário gelado com uma gigantesca geleira de nitrogênio em formato de coração',
    color: '#d6bcfa',
    accentGradient: 'radial-gradient(circle at 35% 35%, #f3e8ff, #c084fc 55%, #581c87)',
    exploratoryRadius: 0.9,
    proportionalRadius: 0.23,
    realDiameterKm: 2376,
    massKg: '1,303 × 10²² kg',
    massEarthRatio: 0.0022,
    gravityMs2: 0.62,
    escapeVelocityKms: 1.21,
    meanTempC: -229,
    tempRangeLabel: '-240 °C a -218 °C',
    semiMajorAxisAU: 39.482,
    exploratoryDistance: 158,
    orbitalPeriodDays: 90560.0,
    orbitalPeriodLabel: '247,9 anos terrestres',
    rotationPeriodHours: -153.29,
    rotationPeriodLabel: '6,38 dias (Retrógrado)',
    orbitalVelocityKms: 4.67,
    axialTiltDeg: 122.53,
    eccentricity: 0.2488,
    orbitalInclinationDeg: 17.16,
    atmospherePressure: '10 microbars (congela e colapsa quando Plutão se afasta do Sol)',
    description:
      'Reclassificado como planeta anão pela UAI em 2006, Plutão surpreendeu a ciência quando a sonda New Horizons o sobrevoou em 2015: em vez de uma rocha morta, revelou montanhas de gelo de água de 3.500 metros, dunas de metano e a planície glacial Tombaugh Regio.',
    layers: [
      { name: 'Núcleo Rochoso de Silicatos', pct: 70, color: '#78716c', detail: '70% do diâmetro total de Plutão' },
      { name: 'Manto de Gelo de Água (e possível oceano)', pct: 25, color: '#38bdf8', detail: 'Isolado por hidratos de gás' },
      { name: 'Crosta de Nitrogênio, Metano e CO congelados', pct: 5, color: '#f3e8ff', detail: 'Geleira Sputnik Planitia (Coração)' }
    ],
    atmosphere: [
      { gas: 'Nitrogênio (N₂)', pct: 99.0 },
      { gas: 'Metano (CH₄)', pct: 0.5 },
      { gas: 'Monóxido de Carbono (CO)', pct: 0.5 }
    ],
    missions: [
      { name: 'New Horizons (NASA)', year: '2015', note: 'Primeiro sobrevoo histórico de Plutão, Caronte e do objeto Arrokoth no Cinturão de Kuiper.' }
    ],
    facts: [
      'A órbita de Plutão é tão elíptica e inclinada (17°) que, durante 20 anos de sua órbita (como ocorreu entre 1979 e 1999), ele fica mais perto do Sol do que Netuno!',
      'Caronte tem metade do diâmetro de Plutão: os dois orbitam um ponto no espaço vazio fora de Plutão, formando um sistema planetário binário.',
      'A superfície de Plutão é menor que a área territorial da Rússia, mas possui montanhas de gelo de água tão duras quanto granito.'
    ],
    moons: [
      {
        id: 'charon',
        name: 'Caronte',
        color: '#9ca3af',
        radius: 0.42,
        distance: 3.2,
        periodDays: 6.387,
        realDiameterKm: 1212,
        description: 'Parceiro binário de Plutão; ambos estão travados gravitacionalmente olhando sempre para o mesmo ponto um do outro.'
      }
    ]
  },
  {
    id: 'halley',
    name: 'Cometa Halley',
    category: 'Cometa Periódico (1P/Halley)',
    orderLabel: 'Órbita Excêntrica',
    tagline: 'O viajante gelado que cruza o Sistema Solar interno a cada 75–76 anos com sua cauda luminosa',
    color: '#67e8f9',
    accentGradient: 'radial-gradient(circle at 35% 35%, #ffffff, #38bdf8 55%, #0369a1)',
    exploratoryRadius: 0.65,
    proportionalRadius: 0.18,
    realDiameterKm: 11,
    massKg: '2,2 × 10¹⁴ kg',
    massEarthRatio: 0.000000000037,
    gravityMs2: 0.0005,
    escapeVelocityKms: 0.002,
    meanTempC: -70,
    tempRangeLabel: '-220 °C (afélio) a +77 °C (periélio)',
    semiMajorAxisAU: 17.834,
    exploratoryDistance: 68, // semieixo visual da elipse
    orbitalPeriodDays: 27503.0,
    orbitalPeriodLabel: '75,3 anos terrestres',
    rotationPeriodHours: 52.8,
    rotationPeriodLabel: '2,2 dias (rotação complexa)',
    orbitalVelocityKms: 54.55,
    axialTiltDeg: 0,
    eccentricity: 0.68, // Alta excentricidade para visualização elíptica clara
    orbitalInclinationDeg: 18.0,
    atmospherePressure: 'Coma (cabeleira) de gás e poeira sublimada pelo vento solar',
    description:
      'O Cometa 1P/Halley é o mais famoso dos cometas periódicos, registrado pela humanidade desde 240 a.C. Quando se aproxima do Sol, seus gelos primordiais sublimam, criando uma coma brilhante e duas caudas (de poeira e de íons ionizados) que apontam sempre na direção oposta ao Sol.',
    layers: [
      { name: 'Núcleo Poroso ("Bola de Neve Suja")', pct: 75, color: '#475569', detail: 'Gelo de água, CO, metano, amônia e silicatos' },
      { name: 'Crosta Escura de Poeira Carbonácea', pct: 15, color: '#1e293b', detail: 'Mais escura que carvão (reflete apenas 4% da luz)' },
      { name: 'Coma & Jatos de Sublimação', pct: 10, color: '#38bdf8', detail: 'Expande-se por mais de 100.000 km perto do Sol' }
    ],
    atmosphere: [
      { gas: 'Vapor d’Água (H₂O)', pct: 80.0 },
      { gas: 'Monóxido de Carbono (CO)', pct: 10.0 },
      { gas: 'Dióxido de Carbono, Metano e Amônia', pct: 10.0 }
    ],
    missions: [
      { name: 'Giotto (ESA)', year: '1986', note: 'Aproximou-se a 596 km do núcleo do Cometa Halley, obtendo as primeiras fotos de um núcleo cometário.' }
    ],
    facts: [
      'A cauda de um cometa não fica necessariamente "para trás" do seu movimento: ela é soprada pela radiação e pelo vento solar, apontando sempre para o lado oposto ao Sol!',
      'A Terra atravessa duas vezes por ano a trilha de detritos deixada pelo Cometa Halley, produzindo as famosas chuvas de meteoros Eta Aquáridas (maio) e Oriônidas (outubro).',
      'Sua última passagem perto do Sol foi em 1986, e seu próximo retorno ao Sistema Solar interno acontecerá em julho de 2061.'
    ],
    moons: []
  }
];

const TOUR_STEPS = [
  {
    bodyId: 'sun',
    title: '1. O Sol — A Fornalha Estelar',
    text: 'Nossa jornada começa no coração do Sistema Solar. O Sol concentra 99,86% de toda a massa do sistema e funde 600 milhões de toneladas de hidrogênio em hélio a cada segundo.'
  },
  {
    bodyId: 'mercury',
    title: '2. Mercúrio — O Mensageiro Veloz',
    text: 'A apenas 0,39 UA do Sol, Mercúrio viaja a 47 km/s. Seu núcleo metálico ocupa 85% do raio do planeta, enquanto sua superfície varia de -180 °C à noite a +430 °C durante o dia.'
  },
  {
    bodyId: 'venus',
    title: '3. Vênus — O Efeito Estufa Extremo',
    text: 'Coberto por nuvens de ácido sulfúrico e uma atmosfera 92 vezes mais densa que a da Terra, Vênus mantém 464 °C constantes e gira em sentido retrógrado.'
  },
  {
    bodyId: 'earth',
    title: '4. Terra & Lua — O Oásis Azul',
    text: 'Na Zona Habitável do Sol, a Terra possui oceanos líquidos, placas tectônicas ativas e uma magnetosfera protetora, acompanhada por nossa Lua estabilizadora.'
  },
  {
    bodyId: 'mars',
    title: '5. Marte — O Mundo dos Rovers e Vulcões Gigantes',
    text: 'O Planeta Vermelho guarda leitos de antigos rios, calotas polares, as luas Fobos e Deimos, e o Monte Olimpo — três vezes mais alto que o Everest.'
  },
  {
    bodyId: 'ceres',
    title: '6. Ceres & Cinturão de Asteroides',
    text: 'Entre Marte e Júpiter orbitam milhões de rochas primordiais. Ceres é o único planeta anão desta região, abrigando reservatórios subterrâneos de água salgada.'
  },
  {
    bodyId: 'jupiter',
    title: '7. Júpiter — O Rei dos Planetas',
    text: 'Com 318 vezes a massa da Terra, Júpiter exibe sua lendária Grande Mancha Vermelha e comanda uma corte de 95 luas, incluindo as luas galileanas Io, Europa, Ganimedes e Calisto.'
  },
  {
    bodyId: 'saturn',
    title: '8. Saturno — O Senhor dos Anéis',
    text: 'Seus anéis de gelo puro se estendem por 282.000 km. Ao seu redor orbitam mundos fascinantes como Titã, com mares de metano líquido, e Encélado, com gêiseres oceânicos.'
  },
  {
    bodyId: 'uranus',
    title: '9. Urano — O Gigante de Gelo Tombado',
    text: 'Com seu eixo inclinado em 97,77°, Urano literalmente rola de lado ao redor do Sol, exibindo uma atmosfera azul-ciano com a temperatura mais fria do Sistema Solar (-224 °C).'
  },
  {
    bodyId: 'neptune',
    title: '10. Netuno — Ventos Supersônicos',
    text: 'A 4,5 bilhões de km do Sol, Netuno é varrido por tempestades de 2.100 km/h e acompanhado pela grande lua gelada Tritão em órbita retrógrada.'
  },
  {
    bodyId: 'pluto',
    title: '11. Plutão & Caronte — A Fronteira de Kuiper',
    text: 'No Cinturão de Kuiper, Plutão exibe a geleira de nitrogênio Tombaugh Regio em forma de coração e dança em órbita binária com sua grande lua Caronte.'
  },
  {
    bodyId: 'halley',
    title: '12. Cometa Halley — O Viajante Elíptico',
    text: 'Encerramos o tour no Cometa Halley: observe como sua cauda luminosa de gás ionizado aponta sempre na direção oposta ao Sol, soprada pelo vento solar!'
  }
];



// === js/graphics/proceduralTextures.js ===

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
function generateRingTexture(isSaturn = true) {
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
function generateGlowTexture(innerColor = 'rgba(255, 240, 180, 1)', midColor = 'rgba(251, 146, 60, 0.45)', outerColor = 'rgba(234, 88, 12, 0)') {
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
async function generateAllPlanetaryTextures(onProgress) {
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



// === js/audio/spaceAudio.js ===
/**
 * Sintetizador Procedural de Áudio Espacial Ambiente (Web Audio API)
 * Não depende de arquivos MP3/WAV externos: gera um drone cósmico binaural
 * suave e efeitos sonoros sutis de telemetria para a interface HUD.
 */

class SpaceAudioController {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.oscillators = [];
  }

  initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0;
    this.masterGain.connect(this.ctx.destination);

    // Filtro passa-baixa para ambiência espacial profunda
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 260;
    filter.connect(this.masterGain);

    // Osciladores harmônicos binaurais (Acorde cósmico suspenso: D2, A2, E3)
    const freqs = [73.42, 73.85, 110.0, 146.83, 220.0];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      gain.gain.value = i < 2 ? 0.14 : 0.045;
      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  toggle() {
    this.initContext();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.35, now, 0.6);

    if (!this.isMuted) {
      this.playChime(528, 0.12);
    }
    return !this.isMuted;
  }

  playChime(freq = 660, duration = 0.09) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + duration);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
}



// === js/scene/SolarSystemScene.js ===







/**
 * Motor Gráfico 3D do Sistema Solar (COSMOS 3D)
 * Gerencia cena Three.js, iluminação, shaders de atmosfera, anéis UV radiais,
 * órbitas keplerianas, cinturão de asteroides instanciado, cometa com cauda dinâmica,
 * corte interno 3D (cutaway) e projeção de rótulos interativos.
 */
class SolarSystemScene {
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



// === js/ai/astroAssistant.js ===

/**
 * Assistente de Inteligência Artificial Astronômica (AstroIA)
 * Possui um motor de conhecimento científico contextual completo (100% funcional offline)
 * que analisa perguntas em linguagem natural em português, executa comandos na cena 3D
 * (ex: "leve-me a Saturno", "mostre o interior da Terra") e opcionalmente integra com a API Gemini.
 */

class AstroAssistant {
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



// === js/main.js ===





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



};
})();
