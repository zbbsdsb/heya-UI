# 🛡️ Hearth Sovereign Nodes — System Schema & Integration Contract (ADR-007)

This document updates the architecture schema and provides concrete specifications for mapping the Hearth Sovereign Node Workspace and "Hey Cognitive Companions" to custom production databases (Firestore / Relational SQL) and backend endpoints.

---

## 1. Core Document Structure (`NodeData` Interface)
Every active card/node on the Hearth Field Map is structured as an autonomous document container. The following TypeScript schema highlights standard metadata controls inserted to support cloud synchronization, offline caching, and user attribution:

```typescript
export type NodeType = 'project' | 'todo' | 'agent' | 'muse' | 'resource';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
}

export interface NodeData {
  // Identity & Geometry
  id: string;                  // Primary Key in database (UUID or unique string seed)
  type: NodeType;              // Category bucket for layout grouping
  title: string;               // Localized title or custom user label
  description: string;         // Short subtitle detail string
  x: number;                   // Horizontal grid coordinates [0 - 1500]
  y: number;                   // Vertical grid coordinates [0 - 1000]
  
  // Progress & Collaborators
  progress: number;            // Current completion indicator [percentage 0 - 100]
  members: string[];           // List of associated teammate handle strings
  checklist: ChecklistItem[];  // Sub-items list array
  tags: string[];              // Dynamic taxonomy filters
  connections: string[];       // Graph Adjacency List: Target node ID paths
  star?: boolean;              // Boolean marking active spotlight status
  
  // Real-world Sync Metadata
  status?: 'draft' | 'active' | 'archived' | 'completed'; // System lifespan status
  syncStatus?: 'synced' | 'pending' | 'offline';          // Cloud handshaking health
  authorId?: string;           // Original creator identifier
  createdAt: string;           // Date string (YYYY/MM/DD)
  updatedAt: string;           // Latest modification timestamp
  version?: number;            // Optimistic concurrency locking index
}
```

---

## 2. Relational Database Mapping Example (Drizzle - PostgreSQL)
For custom relational SQL backends (e.g., Google Cloud SQL), the following schema definitions serve as the exact mapping blueprint:

```typescript
import { pgTable, text, integer, boolean, doublePrecision, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const hearth_nodes = pgTable('hearth_nodes', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // 'project' | 'todo' | 'agent' ...
  title: text('title').notNull(),
  description: text('description'),
  x: doublePrecision('x').notNull().default(300.0),
  y: doublePrecision('y').notNull().default(300.0),
  progress: integer('progress').notNull().default(0),
  members: jsonb('members').notNull().default([]), // string[] of handles
  checklist: jsonb('checklist').notNull().default([]), // ChecklistItem[] JSON
  tags: jsonb('tags').notNull().default([]), // string[] index
  connections: jsonb('connections').notNull().default([]), // ID array
  star: boolean('star').default(false),
  status: text('status').default('active'),
  sync_status: text('sync_status').default('synced'),
  author_id: text('author_id'),
  version: integer('version').default(1),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});
```

---

## 3. Distributed Peer-to-Peer & Client Sync Architecture
To preserve client autonomy and privacy during decentralized Oermos WebRTC handshakes and local sessions:
1. **Local Isolation First**: Workspace changes mutate local React state and write automatically to `localStorage` key indices (`hearth_nodes` and `hearth_ideas`).
2. **Optimistic Sync Engine**:
   - Updates trigger a status pulse check. The sync indicator next to the card category badge renders **Synced (Green Dot)** indicating parity with `localStorage` and server logs.
   - During latency surges or network hops, nodes will render **Pending (Yellow Pulse)**, awaiting state alignment checks.
3. **Collision Resolution**: Standard `version` keys trigger optimistic checks. Transactions conflict-resolve by prioritizing the latest client-side `updatedAt` timestamps unless overrides are issued.

---

## 4. Sovereignty Gateway Security Directives (ADR-007 Compliance)
*   **Decentralized Sandboxing**: No automated layout parameters, AI agent spawns, or file system adjustments can happen without a joint handshake or a valid SHA-256 session token configured inside the **Sovereignty Gating Protocol** tab.
*   **ECDSA Validation Keys**: Communication packets and backup sync states run local asymmetric signing verification to secure intermediate states without routing information through unnecessary third-party brokers.

---

## 5. 🌊 Fluidic Boundaries & Systems Architecture Contract (ADR-109 Upgrade)

To elevate canvas aesthetics beyond legacy grid rectangles, domain areas are drawn as dynamic, self-morphing fluid polygons. 

### A. Mathematical Formulation
Rather than drawing raw bounding-box rectangles, the system computes an organic hull via a closed Cubic Bezier loop. Using a dynamic padding radius ($\Delta_{\text{pad}} = 36\text{px}$) around the clustered nodes of each type, we generate eight control points:

```typescript
const getOrganicFluidPath = (x: number, y: number, w: number, h: number, id: string) => {
  const seed = id === 'opportunity' ? 1 : id === 'execution' ? 2 : id === 'core' ? 3 : id === 'future' ? 4 : 5;
  const o1 = Math.sin(seed * 11) * 14;
  const o2 = Math.cos(seed * 7) * 14;
  const o3 = Math.sin(seed * 3) * 16;
  const o4 = Math.cos(seed * 9) * 16;
  
  const pad = 36;
  const x1 = x - pad, y1 = y - pad;
  const x2 = x + w + pad, y2 = y + h + pad;
  const midX = x1 + (x2 - x1) / 2, midY = y1 + (y2 - y1) / 2;
  
  // Bezier controls
  const cpTop = { x: midX + o1, y: y1 + o2 };
  const cpRight = { x: x2 + o3, y: midY + o4 };
  const cpBottom = { x: midX - o2, y: y2 - o1 };
  const cpLeft = { x: x1 - o4, y: midY - o3 };
  const cTL = { x: x1 - o4, y: y1 + o3 }, cTR = { x: x2 + o1, y: y1 - o2 };
  const cBR = { x: x2 - o3, y: y2 + o4 }, cBL = { x: x1 + o2, y: y2 - o1 };
  
  return `M ${cpLeft.x} ${cpLeft.y} 
          C ${cTL.x} ${cTL.y}, ${cTL.x + 35} ${cTL.y - 35}, ${cpTop.x} ${cpTop.y} 
          C ${cTR.x - 35} ${cTR.y - 35}, ${cTR.x} ${cTR.y}, ${cpRight.x} ${cpRight.y} 
          C ${cBR.x} ${cBR.y}, ${cBR.x - 35} ${cBR.y + 35}, ${cpBottom.x} ${cpBottom.y} 
          C ${cBL.x + 35} ${cBL.y + 35}, ${cBL.x} ${cBL.y}, ${cpLeft.x} ${cpLeft.y} Z`;
};
```

### B. Architectural Refinement Guidelines
*   **Deprecation of Mock-data attributes**: Legacy, product-centric attributes such as `TODO`, checklist tasks, and specific descriptive hashtags (e.g., `#待办`) have been completely deprecated to avoid low-end visual noise.
*   **Aesthetic Telemetry**: All components are designated as pristine systems modules identified by automatic hexadecimal markers `0x[ID] // SYS_COMP` alongside their coordinates, conforming strictly to high-contrast Swiss-style design assertions.
*   **Boundary Integration**: Floating HUD badge nodes are overlaid independently across the organic path corners to supply responsive telemetry metadata while maintaining background flow states.
