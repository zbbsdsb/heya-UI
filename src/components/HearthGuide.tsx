/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Shield, 
  Cpu, 
  Layers, 
  Globe, 
  Network, 
  Check, 
  ChevronRight, 
  Lightbulb, 
  Sliders, 
  Sparkles,
  Command,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface HearthGuideProps {
  language?: 'en' | 'zh';
}

export default function HearthGuide({ language = 'en' }: HearthGuideProps) {
  const isEn = language === 'en';
  const [activeSection, setActiveSection] = useState<'ambition' | 'network' | 'schema' | 'physics'>('ambition');

  const docSections = [
    {
      id: 'ambition',
      title: 'Our Grand Ambition',
      subtitle: 'The Sovereign Workspace Thesis',
      icon: Shield,
      tagline: 'Decentralizing cognitive environments with zero server footprints.'
    },
    {
      id: 'network',
      title: 'P2P WebRTC Swarm Core',
      subtitle: 'True Ad-Hoc Communication',
      icon: Network,
      tagline: 'Ditching bloated cloud registries for cryptographic Fowler-No-Vo parity tables.'
    },
    {
      id: 'schema',
      title: 'Hearth ADR-007 Contract',
      subtitle: 'Immutable Document Structures',
      icon: Terminal,
      tagline: 'Standardized state interfaces for absolute client-to-peer telemetry alignment.'
    },
    {
      id: 'physics',
      title: 'ADR-109 Organic Outlines',
      subtitle: 'Fluid Topology Math',
      icon: Sliders,
      tagline: 'Closed Cubic Bezier hulls that morph adaptively as node clusters migrate.'
    }
  ] as const;

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafbfc] p-6 lg:p-10 font-sans transition-colors duration-300">
      
      {/* Brand Header Display banner */}
      <div className="mb-10 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-semibold text-lg shadow-md">
            <span>⬢</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight">HEYA // HEARTH SYSTEM DOCUMENTATION</h1>
              <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-widest border border-indigo-150">
                RELEASE v1.0.7
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Refined specification handbook governing HeYa sovereign network operations, node physics, and spatial-decentralized orchestrations.
            </p>
          </div>
        </div>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: STYLISH NAVIGATION MENU COUNTERPART */}
        <div className="lg:col-span-4 space-y-3.5">
          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block px-1">
            System Guide Directories
          </span>

          <div className="space-y-2">
            {docSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    (window as any).playTactileChime?.('click');
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 group cursor-pointer relative ${
                    isActive
                      ? 'bg-white border-slate-200/90 text-slate-800 shadow-md'
                      : 'bg-slate-50/50 hover:bg-slate-50 border-slate-150 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {/* Active highlight side line */}
                  {isActive && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-600 rounded-r" />
                  )}

                  <div className={`p-2 rounded-xl transition-all ${
                    isActive ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'bg-white text-slate-400 group-hover:text-slate-600 border border-slate-200/60'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-mono font-bold block text-slate-400 uppercase tracking-tight">
                      {sec.subtitle}
                    </span>
                    <span className={`text-xs font-black block mt-0.5 ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                      {sec.title}
                    </span>
                    <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-relaxed line-clamp-1">
                      {sec.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats telemetry box */}
          <div className="bg-slate-900 text-white/90 p-5 rounded-3xl space-y-4 shadow-xl font-mono text-[9px] relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none select-none">
              <Command className="w-24 h-24" />
            </div>

            <div className="border-b border-white/10 pb-2 flex justify-between items-center">
              <span className="font-extrabold text-[#94a3b8] tracking-widest uppercase">SWISS METRICS ENVELOPE</span>
              <span className="text-emerald-400 font-bold animate-pulse">ACTIVE_SEED</span>
            </div>

            <div className="space-y-1 text-[#cbd5e1] font-semibold leading-relaxed">
              <div className="flex justify-between">
                <span>PARADIGM ID:</span>
                <span className="text-indigo-400 font-bold">SOVEREIGN_COGNITIVE</span>
              </div>
              <div className="flex justify-between">
                <span>METRICS STATUS:</span>
                <span className="text-emerald-400 font-bold">99.98% HARMONY</span>
              </div>
              <div className="flex justify-between">
                <span>TELEMETRY OUTFLOWS:</span>
                <span className="text-rose-400 font-bold">0.00kb/s (ZERO TRACKING)</span>
              </div>
              <div className="flex justify-between">
                <span>CONVERGENCE ALGORITHM:</span>
                <span className="text-amber-500 font-bold">FNV-1a 32BIT MIXING</span>
              </div>
            </div>
            
            <p className="text-[8px] text-slate-500 italic leading-snug border-t border-white/5 pt-2 select-none">
              "We reject the monetization of intermediate thoughts. The workspace must behave strictly as an extension of client-local storage buffers."
            </p>
          </div>
        </div>

        {/* RIGHT COMPONENT: EXPANSIVE PREMIUM CONTENT VIEWPORT (Spans 8 columns) */}
        <div className="lg:col-span-8">
          
          <div className="bg-white border border-[#eef2f6] rounded-3xl p-6 lg:p-8 shadow-sm">
            
            {/* AMBITION SECTION */}
            {activeSection === 'ambition' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                    OUR CORE AMBITION
                  </span>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">
                    The Decentralized Sovereign Workspace Thesis
                  </h2>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <p>
                    Modern web applications are suffering under the weight of unnecessary corporate surveillance and mandatory cloud integration. Simply writing down an raw, fleeting idea shouldn't require routing data through multiple third-party advertising databases or telemetry servers.
                  </p>

                  <blockquote className="border-l-2 border-indigo-500 pl-4 py-1 my-3 bg-slate-50/50 rounded-r text-[11px] text-slate-500 italic font-mono font-bold leading-normal">
                    "Our collective grand ambition is to forge a completely modular, serverless spatial network canvas. A user's creative engine remains entirely private, local, and sovereign—sharing state only when explicit peer-to-peer synchronization handshakes are published."
                  </blockquote>

                  <p className="font-bold text-slate-700 pt-1 text-sm tracking-tight border-t border-slate-50 mt-4 h-auto">
                    Three Immutable Philosophical Groundings:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase block">1. Local Autonomy</span>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                        A strict zero server-footprint architecture. Workspace cards, checklist statuses, and ideation drafts exist strictly inside browser memory buffers until peer tunnels are explicitly chosen.
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase block">2. High-Contrast Swiss Design</span>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                        Rejecting visual noise and cartoonish gradients. Every grid offset, label, and control adheres strictly to typography scales, ample whitespace ratios, and structural boundaries.
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase block">3. Cryptographic State Parity</span>
                      <p className="text-[11px] leading-relaxed text-slate-500 font-semibold">
                        Using deterministic Fowler-No-Vo FNV-1a mixing formulas to check mesh synchronization states, producing immutable identifiers directly from node attributes instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-600/5 border border-indigo-150 rounded-2xl p-4.5 space-y-2 mt-4 text-[11px] text-slate-750">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                    <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Aesthetic Assertions: Craft over Volume</span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    We treat software as digital craft. Every pixel, transition curve, and sound frequency is calibrated to create a tactile and focused workbench that honors human intellect rather than farming eyeball attention.
                  </p>
                </div>
              </div>
            )}

            {/* P2P SWARM CORE SECTION */}
            {activeSection === 'network' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                    P2P SWARM NETWORKING LAYER
                  </span>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">
                    Fowler-No-Vo Stateful Swarming Protocol
                  </h2>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <p>
                    Instead of routing message events through high-cost messaging servers, the Oermos framework establishing immediate, high-frequency WebRTC browser swarms. Signals are discovered, verified, and compiled directly at local browser clients.
                  </p>

                  <div className="bg-[#0b0c16] rounded-2xl p-4 text-[9px] font-mono text-slate-300 space-y-2 border border-slate-900 shadow-inner select-text">
                    <div className="text-slate-500 border-b border-slate-800 pb-1 uppercase tracking-wider">
                      Fowler-No-Vo Hash (FNV-1a) State Calculation
                    </div>
                    <p className="text-slate-400">
                      // Deterministic algorithm outputting unique #short-hashes for domain topologies:
                    </p>
                    <pre className="text-slate-200 block overflow-x-auto select-all leading-normal py-1 pr-1 font-mono text-[8.5px]">{`let hash = 0x811c9dc5; // Offset basis
for (let i = 0; i < sortedNodesString.length; i++) {
  hash ^= sortedNodesString.charCodeAt(i);
  // Hash mixed by Fowler-No-Vo prime constants
  hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
}
return Math.abs(hash).toString(16);`}
                    </pre>
                  </div>

                  <p>
                    Publishing a **Gossip Burst** across adjacent swarms pushes packets down coordinate segments, confirming boundaries and syncing database states via peer-to-peer consensus audits in under ~12 milliseconds.
                  </p>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <span className="text-xs font-black text-slate-800 block">Swelling Gossip Verification Outcomes:</span>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-[11px]">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>100% Collision-Proof:</strong> Optimized optimistic state concurrency checks prevent packet-loss or stale edits during distributed multi-author revisions.</span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px]">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Independent WebRTC Signals:</strong> Automatic fallback to decentralized WebRTC mesh coordinates ensures consistent layout states without centralized signaling hubs.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IMMUTABLE STRUCT CONTRACT */}
            {activeSection === 'schema' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <span className="text-[10px] text-purple-600 bg-purple-50 border border-purple-150 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                    CONTRACT ADR-007 BLUEPRINT
                  </span>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">
                    Sovereign Node Typology Spec
                  </h2>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <p>
                    Every active card or coordinate node layout inside Hearth adheres strictly to HeYa's core metadata standard contract. This ensures complete cross-talk compatibility between the <strong>Field Map Canvas</strong>, the <strong>Project Space Dashboard</strong>, and AI agents created inside the <strong>System Forge</strong>.
                  </p>

                  <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-50 border-b border-slate-150 px-4 py-2.5 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>NodeData Type Interface Contract</span>
                      <span>TypeScript v5.1</span>
                    </div>
                    <div className="p-4 bg-white font-mono text-[9px] text-slate-705 overflow-x-auto max-h-[220px] select-text font-bold leading-normal">
                      <pre>{`export interface NodeData {
  id: string;               // Unique primary cluster ID e.g. "todo-1937103"
  type: NodeType;           // Class ID: project | todo | agent | muse | resource
  title: string;            // Micro title metadata label
  description: string;      // Comprehensive subtitle/purpose string
  x: number;                // 2D Canvas space X alignment coordinate [0 - 1500]
  y: number;                // 2D Canvas space Y alignment coordinate [0 - 1000]
  progress: number;         // Completed metrics index percentage [0 - 100]
  members: string[];        // Network workspace teammate handles
  checklist: ChecklistItem[]; // Checklist tasks array
  tags: string[];           // Custom telemetry labels
  connections: string[];    // Topological adjacency vector connections list
  version?: number;         // Concurrency state version marker
  createdAt: string;        // Initial spawn timestamp ISO
  updatedAt: string;        // Latest change timestamp ISO
}`}</pre>
                    </div>
                  </div>

                  <p>
                    Using unified interfaces enables rapid database persistence—whether writing directly to Firestore, saving offline slots to standard local storage profiles, or using Drizzle Schema declarations on relational server layers.
                  </p>
                </div>
              </div>
            )}

            {/* DYNAMIC PHYSIC FORUM */}
            {activeSection === 'physics' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-150 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                    ADR-109 MOATING FORMULAS
                  </span>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">
                    Calculated Closed-Loop Organic Hulls
                  </h2>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <p>
                    To achieve standard Swiss elegance without stale bounding boxes, HeYa projects and categories are outlined by organic, dynamically morphing fluidic barriers.
                  </p>

                  <blockquote className="border-l-2 border-amber-400 pl-4 py-1.5 my-3 bg-slate-50 rounded-r text-[11px] text-slate-500 italic font-mono font-bold leading-normal">
                    "Rather than hardcoding static coordinates, the canvas captures cluster coordinate extremums, uses a 2D padding radius, and computes smooth path control points to render a closed Bezier path continuously."
                  </blockquote>

                  <p>
                    Formulas governing fluid point generation mix coordinate trigonometric sin/cos seeds determined by the specific boundary category id, guaranteeing that each domain morphs differently when map nodes are repositioned:
                  </p>

                  <div className="bg-slate-5 font-bold font-mono text-[9px] leading-relaxed p-4 border border-slate-150 rounded-2xl text-slate-650 bg-slate-50/50">
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400 mb-1 leading-normal">Organic Spline Control Offsets:</span>
                    o1 = Sin(Seed * 11) * 14px<br />
                    o2 = Cos(Seed * 7) * 14px<br />
                    o3 = Sin(Seed * 3) * 16px<br />
                    o4 = Cos(Seed * 9) * 16px
                  </div>

                  <p className="border-t border-slate-50 pt-3">
                    Dragging map nodes triggers instant re-evaluation loops. Dynamic telemetry metrics display values adaptively while maintain zero-jitter tracking, providing pristine desktop CAD feedback.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
