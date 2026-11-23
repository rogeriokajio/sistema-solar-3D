/**
 * Base de Dados Astrofísica Completa do Sistema Solar (COSMOS 3D)
 * Inclui parâmetros físicos reais, parâmetros visuais para escalas 3D,
 * luas principais, camadas internas, atmosfera, missões e curiosidades.
 */

export const SOLAR_SYSTEM_BODIES = [
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

export const TOUR_STEPS = [
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

