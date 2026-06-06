# 🌊 Heya // Hearth Topology Engine & Sovereign Workspace

> An infinite Field Map, collaborative project network, and autonomous agent customizer prototype designed around Liquid Light and Swiss Minimal themes.

---

## 🎨 Design Philosophy & Aesthetic Ethos
Heya is a radical departure from traditional grid-locked dashboard interfaces. It is framed around **Hearth Topology Design Rules (ADR-109)**, expressing functional systems modules as floating solar nodes inside organic fluidic domains.

*   **Swiss Minimal Elegance**: Extreme negative space, high typographic contrast, and absolute technical honesty.
*   **Liquid Light Theme**: Subtle ambient hues and glowing pulse states that react in real-time to connection anchors and canvas pan/drag operations.
*   **Organic Fluid Boundaries**: The workspace calculates dynamic SVG hulls using closed Cubic Bezier curves to enclose categories of active nodes seamlessly.
*   **No Technical Larping**: Replaced legacy product metaphors (like checkboxes, mock-backlogs, and raw todo lists) with clean, high-density systems telemetries (`0x[ID] // SYS_COMP`).

---

## 🏗️ Core Architecture & Node Typologies

Each document or workstation unit coordinates as a floating component:

| Category | Technical Persona | System Label | Active Hue |
| :--- | :--- | :--- | :--- |
| **Project** | Cluster planning hub | `Project Suite` | `Indigo / Royal` |
| **Todo** | Execution pipeline vector | `Execution Pipeline` | `Emerald / Forest` |
| **Agent** | Cognitive strategy assistant | `Autonomous Agent` | `Purple / Violet` |
| **Muse** | Spark of raw system inspiration | `Inspiration Deck` | `Pink / Velvet` |
| **Resource** | System data registry | `Registry Base` | `Amber / Ochre` |

---

## 🌊 Mathematical Formulation of Fluid Hulls

To draw organic fluid boundaries instead of rectangular bounding cards, the system utilizes a custom Bezier generator with automatic sinusoidal offsets based on the coordinate extrema of grouped nodes:

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

## 🛠️ Project Structure

```bash
├── HEARTH_SCHEMA.md      # Detailed PostgreSQL / Firestore data schemas
├── README.md             # High-level architecture & design documentation
├── metadata.json         # Workspace capabilities & permissions manifest
├── package.json          # Node dependencies & execution commands
├── src/
│   ├── App.tsx           # Primary orchestrator component & layout
│   ├── types.ts          # Shared TypeScript type signatures & interfaces
│   ├── locales.ts        # Dynamic English / Chinese system localization dictionaries
│   ├── components/
│   │   ├── FieldMapCanvas.tsx # Infinite canvas viewport, panning/zooming & SVG anchor-lines
│   │   ├── HeyCompanion.tsx   # Strategical Agent console overlay & customizer
│   │   └── Toolbar.tsx        # Command bar & visual tool toggles
│   └── index.css         # Global stylesheet importing tailwind & Google Fonts
```

---

## 🚀 Running the Applet

To launch the simulation server locally:

```bash
# 1. Install workspace dependencies
npm install

# 2. Boot dev server on Port 3000
npm run dev

# 3. Create a compiled production build optimized for distribution
npm run build
```

---

## 🛡️ Sovereign Security Gateway compliance (ADR-007)
*   State synchronization operates on an **Optimistic Client-first Loop** backed by atomic WebRTC handshake capabilities.
*   Security configurations are sandboxed statically so that no third-party integrations compromise local or relational records.
