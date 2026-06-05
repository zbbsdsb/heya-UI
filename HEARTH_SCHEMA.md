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
