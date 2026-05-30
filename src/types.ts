/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NodeType = 'project' | 'todo' | 'muse' | 'agent' | 'resource';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
}

export interface NodeData {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  x: number;
  y: number;
  progress: number;
  members: string[]; // member names
  checklist: ChecklistItem[];
  tags: string[];
  connections: string[]; // other node IDs
  subFieldId?: string;
  createdAt: string;
  updatedAt: string;
  star?: boolean;
}

export interface SubFieldData {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colorClass: string; // Tailwind border styling
}

export interface MuseIdea {
  id: string;
  content: string;
  createdAt: string;
  convertedToNodeId?: string;
}

export interface ForgeAgent {
  id: string;
  name: string;
  description: string;
  skeleton: string;
  memoryEngine: 'json' | 'vector';
  graphNodes: { id: string; label: string; type: string; x: number; y: number }[];
  graphEdges: { source: string; target: string }[];
}

export interface OermosNode {
  id: string;
  name: string;
  status: 'handshaking' | 'connected' | 'idle' | 'disconnected';
  latency: number; // in ms
  ip: string;
  lastMessage?: string;
}
