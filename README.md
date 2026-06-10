# 🌊 Heya // Hearth Topology Engine & Sovereign Workspace

<div align="center">

[![License](https://img.shields.io/badge/License-Apache_2.0-indigo.svg?style=for-the-badge&logo=apache)](https://opensource.org/licenses/Apache-2.0)
[![React](https://img.shields.io/badge/Framework-React_18-emerald.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Style-Tailwind_CSS_v4-06B6D4.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Sovereign UX](https://img.shields.io/badge/UX-Sovereign_Swiss_Minimalist-amber.svg?style=for-the-badge)](https://en.wikipedia.org/wiki/International_Typographic_Style)

<h3>
  <a href="https://ais-pre-jbqh7wb3cajibvdidggqjr-749644888311.asia-southeast1.run.app">🚀 🔗 一键打开高保真网页实时演示沙盒 (One-Click Live Demo)</a>
</h3>

*An infinite Field Map, collaborative project network, and autonomous agents customizer designed around Liquid Light and Swiss Minimal themes.*

</div>

---

## 🌌 Project Vision & Open-Source Objective

**Heya** is designed to demonstrate how AI-orchestrated workspaces can evolve past rigid, grid-locked, enterprise dashboard structures. 

Instead of treating cards and tasks as stagnant grid rows, Heya leverages **Hearth Topology Design Rules (ADR-109)** to represent functional nodes as interactive stars within adaptive, organic, mathematical fluid boundaries.

Our goal is to make this repository highly interactive, easy to deploy, and visually stunning so it can serve as a prime **vision and UI blueprint** for sovereign personal computing.

---

## 🎯 4 Core Interactive Differentiators for Showcasing

To capture developers, investors, and communities, the repository highlights these four unique mechanics:

### 1. ⚡ One-Click High-Fidelity Sandbox Seeder
To prevent the "cold-start" empty-canvas problem, we integrated a **Sandbox Restorer** directly in the setup modal.
* **Effect**: Instantly clears stale states and loads a beautifully grouped arrangement of interlocking node groups (Project Suite, Execution Pipeline, Autonomous Agent, Muse Inspiration, Registry Base) with pre-populated downstream handshakes.
* **How to Trigger**: Open `Sovereign Workspace Settings (系统设置)` inside the app and press **`一键恢复官方高保真演示星态 (Reset to High-Fidelity Demo Canvas)`**.

### 2. 🧠 Muse: Divergent Cognitive Lab (Grounding Specs)
The newly developed Muse architecture shows how autonomous AI can digest raw context specifications together with active canvas topologies to produce anti-conformist ideas.
* **True Grounding**: Users upload custom Markdown/text specifications (e.g. competitors' specs, system regulations) in their local memory.
* **Cognitive Sparking**: Choose a thought paradigm (e.g., *Disruptive P2P Protocols*, *Swiss UX Deselection*) and click **Spark Cognitive Divergence** to generate 3 mind-bending, highly technical proposals complete with their contra-assumptions and structural connection coordinates.

### 3. 🎨 Visual Brutalism: Swiss Design Grid Toggle
Users can toggle the interface from the ambient, colorful, glowing *Liquid Light Theme* into a rigid, highly-disciplined, monochrome **Swiss Typographic Layout**.
* **Design Honesty**: Eliminates circular cards, soft shadows, and color gradients, substituting 2px rough solid borders, generous negative space, strict spacing metrics, and pure monospaced typography (`JetBrains Mono`).

### 4. 🔊 Tactile Chime Web Synthesizer
A zero-dependency custom Web Audio API synthesizer is baked into the browser context. It creates pristine, clear sine-wave clicks and C-Major arpeggios that play on node drags, settings toggles, and successful node generation, creating immediate haptic pleasure.

---

## 🏗️ Node Typology & Architectural Alignment

| Category | Technical Persona | System Label | Active Hue | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Project** | Cluster planning hub | `Project Suite` | `Indigo / Royal` | Central coordinators governing sub-targets and code pathways. |
| **Todo** | Execution pipeline vector | `Execution Pipeline` | `Emerald / Forest` | Tasks and checkpoints with interactive progress gauges. |
| **Agent** | Cognitive strategy helper | `Autonomous Agent` | `Purple / Violet` | Micro-agents with specific parameters and focus realms. |
| **Muse** | Spark of raw system inspiration | `Inspiration Deck` | `Pink / Velvet` | Conceptual ideas sprouted manually or generated via AI. |
| **Resource** | System data registry | `Registry Base` | `Amber / Ochre` | Core methodology anchors and static configurations. |

---

## 🌊 Mathematical Formulation of Fluid Hulls

Instead of rendering square box categories, the system utilizes raw coordinate extrema to dynamically draft smooth SVG boundary hulls behind grouping nodes, modifying margins with sinusoidal organic offsets to keep the layout feeling alive:

$$\Delta_{\text{pad}} = 36\text{px}$$

```typescript
const getOrganicFluidPath = (x: number, y: number, w: number, h: number, id: string) => {
  const seed = id === 'opportunity' ? 1 : id === 'execution' ? 2 : id === 'core' ? 3 : id === 'future' ? 4 : 5;
  const o1 = Math.sin(seed * 11) * 14;
  const o2 = Math.cos(seed * 7) * 14;
  
  const pad = 36;
  const x1 = x - pad, y1 = y - pad;
  const x2 = x + w + pad, y2 = y + h + pad;
  // Closed loop via Cubic Splines enclosing standard node groups
};
```

---

## 🛠️ Repository File Tree

```bash
├── HEARTH_SCHEMA.md      # Detailed PostgreSQL schema configurations for DB persistence
├── README.md             # Visually rich project index, live links, and features walkthrough
├── metadata.json         # Sandbox permissions, applet details, and permissions declarations
├── package.json          # Node dependencies, build compilation & scripts
├── server.ts             # Express + Vite server proxy and Gemini model API integrations
├── src/
│   ├── App.tsx           # Application frame orchestrator, modals & settings
│   ├── types.ts          # Shared TypeScript type signatures & interfaces
│   ├── locales.ts        # English/Chinese dynamic translation dictionaries
│   ├── components/
│   │   ├── FieldMapCanvas.tsx # Panning, zooming infinite map viewport with dynamic Bezier hulls
│   │   ├── MuseIdeation.tsx   # Unstructured document uploader & AI cognitive divergence lab
│   │   ├── HeyCompanion.tsx   # Left overlay panel for chat, node generators & agents
│   │   ├── OermosNetwork.tsx  # Interactive WebRTC P2P mesh network mapping simulator
│   │   └── RelationsTopology.tsx # Structural gravity and cascade dependencies analyzer
│   └── index.css         # Strict custom typography rules (Inter, Space Grotesk) & Tailwind CSS
```

---

## 🚀 Speeding Up Local Development

Get this environment running on your machine in under a minute:

```bash
# 1. Clone the repository and navigate into workspace
git clone <your-repository-url>
cd heya-hearth

# 2. Install required high-contrast libraries
npm install

# 3. Spin up full-stack Express + Vite environment
npm run dev

# 4. Generate local production-grade, bundle-optimized files
npm run build
```

---

## 🛡️ Sovereign Compliance Policies
* **Dynamic Local Sync**: Reaches 100% data durability using sandboxed client-side `localStorage`.
* **Zero Trust Relays**: State routing behaves on an optimistic model prepared for WebRTC direct browser signaling.
