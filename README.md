# 🌌 COSMOS 3D — Simulador Interativo do Sistema Solar & AstroIA

Observatório astrofísico interativo em 3D construído com **Three.js**, **geração procedural de texturas PBR (ruído fractal 3D esférico sem costura)**, **shaders GLSL de espalhamento atmosférico**, **mecânica orbital kepleriana** e a copiloto científica **AstroIA**.

---

## ✨ Principais Recursos

- **Motor 3D Completo (Three.js + Post-Processing)**:
  - Iluminação solar central, `ACESFilmicToneMapping` e `UnrealBloomPass`.
  - Texturas planetárias geradas proceduralmente em alta definição (albedo, relevo *bump*, especularidade oceânica da Terra, nuvens dinâmicas e anéis de Saturno/Urano com transparência e Divisão de Cassini).
  - **Corte Interno 3D (*Cutaway*)**: abra qualquer planeta ou o Sol ao meio no espaço 3D para inspecionar núcleo, manto e crosta em tempo real.
- **Astros Incluídos**:
  - **Sol**, **Mercúrio**, **Vênus**, **Terra** (+ Lua), **Marte** (+ Fobos e Deimos), **Ceres** (+ Cinturão de Asteroides), **Júpiter** (+ Io, Europa, Ganimedes e Calisto), **Saturno** (+ Encélado e Titã), **Urano** (+ Titânia e Oberon), **Netuno** (+ Tritão), **Plutão** (+ Caronte e Cinturão de Kuiper) e **Cometa Halley** (com cauda de íons dinâmica orientada pelo vento solar).
- **Ferramentas Científicas**:
  - **Inspetor de Telemetria em 3 Abas**: Telemetria orbital em tempo real, diagrama de estrutura interna & composição atmosférica, e laboratório gravitacional humano (peso, altura de pulo e idade orbital).
  - **Comparador Planetário Lado a Lado**: compare proporções volumétricas e métricas físicas entre quaisquer dois astros.
  - **Calculadora de Viagem Interplanetária**: distância atual em UA/km e tempo de travessia na velocidade da luz, Parker Solar Probe, Voyager 1, Starship e jato comercial.
  - **Tour Guiado Cinematográfico**: jornada narrada de 12 paradas pelo Sistema Solar.
  - **AstroIA**: assistente de IA astronômica contextual (funciona 100% offline ou integrado à API Google Gemini).
  - **Áudio Espacial Procedural**: sintetizador ambiente via Web Audio API.

---

## 🚀 Como Executar

1. **No GitHub Pages ou Servidor Local**:
   Basta hospedar a pasta raiz ou executar um servidor estático na pasta do projeto.
2. **Direto no Navegador (`file://`)**:
   Dê dois cliques em `index.html` — o projeto inclui suporte híbrido (`js/cosmos.standalone.js`) que funciona mesmo sem servidor local.

---

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
| :--- | :--- |
| `Espaço` | Pausar / Continuar simulação |
| `0` a `9` | Focar Sol (`0`) ou Planetas (`1` a `9`) |
| `C` | Alternar **Corte Interno 3D** do astro focado |
| `O` | Mostrar / Ocultar linhas de órbita |
| `L` | Mostrar / Ocultar rótulos 3D |
| `I` | Abrir / Fechar assistente **AstroIA** |
| `R` | Resetar câmera para Visão Geral |

