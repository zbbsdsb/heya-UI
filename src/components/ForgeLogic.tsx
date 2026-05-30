/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Database, 
  Cpu, 
  GitBranch, 
  Layers, 
  Activity, 
  Play, 
  CheckCircle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ForgeAgent } from '../types';

export default function ForgeLogic() {
  const [agents, setAgents] = useState<ForgeAgent[]>([
    {
      id: 'agent-1',
      name: 'User Research Companion (访谈代理)',
      description: 'Captures and processes unstructured feedback from opportunity domain interviews.',
      skeleton: 'heya-agent-v1.0-socrates',
      memoryEngine: 'vector',
      graphNodes: [
        { id: 'start', label: 'User Query', type: 'trigger', x: 40, y: 150 },
        { id: 'retrieve', label: 'Vector Memory Search', type: 'retrieve', x: 220, y: 80 },
        { id: 'constraint', label: 'Instruction Boundary Gate', type: 'gate', x: 220, y: 220 },
        { id: 'synthesis', label: 'Response Compiler', type: 'process', x: 420, y: 150 }
      ],
      graphEdges: [
        { source: 'start', target: 'retrieve' },
        { source: 'start', target: 'constraint' },
        { source: 'retrieve', target: 'synthesis' },
        { source: 'constraint', target: 'synthesis' }
      ]
    },
    {
      id: 'agent-2',
      name: 'Design System Forge Engine (设计引擎)',
      description: 'Generates atom system guidelines and pushes JSON assets directly into Hearth.',
      skeleton: 'heya-agent-v1.0-forge',
      memoryEngine: 'json',
      graphNodes: [
        { id: 'start', label: 'Forge Stimulus', type: 'trigger', x: 50, y: 150 },
        { id: 'schema', label: 'JSON Schema Validation', type: 'process', x: 240, y: 150 },
        { id: 'emit', label: 'Hearth Sprout Catalyst', type: 'emit', x: 430, y: 150 }
      ],
      graphEdges: [
        { source: 'start', target: 'schema' },
        { source: 'schema', target: 'emit' }
      ]
    }
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-1');
  const [testConsole, setTestConsole] = useState<string[]>(['[System]: Forge Agent Engine Initialized. Ready to simulate workflows.']);
  const [isSimulating, setIsSimulating] = useState(false);

  // Selected agent helpers
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleToggleMemory = () => {
    setAgents(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        const nextEngine = a.memoryEngine === 'json' ? 'vector' : 'json';
        setTestConsole(c => [...c, `[Forge]: Switched memory engine for "${a.name}" to [${nextEngine.toUpperCase()}]`]);
        return {
          ...a,
          memoryEngine: nextEngine
        };
      }
      return a;
    }));
  };

  const handleSimulateExecution = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setTestConsole(c => [...c, `[Simulation]: Initiating verification pipeline for "${selectedAgent.name}"...`]);

    const steps = [
      `[Trigger]: Input stimuli localized inside Hearth boundaries.`,
      `[Memory]: Querying index database [${selectedAgent.memoryEngine.toUpperCase()}] ... 12 matches found.`,
      selectedAgent.memoryEngine === 'vector' 
        ? `[Vector]: Calculated semantic proximity cosine distance = 0.89` 
        : `[JSON]: Successfully validated schema templates against ADR-007 schema constraints.`,
      `[Boundary]: Executing compliance check. No prohibited boundaries penetrated. Status: PASSED`,
      `[Success]: Compiled output sprout emitted into "Hearth Field" successfully.`
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setTestConsole(c => [...c, step]);
        if (index === steps.length - 1) {
          setIsSimulating(false);
          setTestConsole(c => [...c, `[Simulation]: Done. 0 errors, pipeline complete.`]);
        }
      }, (index + 1) * 600);
    });
  };

  const handleAddGraphNode = () => {
    const freshId = `step-${Date.now()}`;
    setAgents(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        const nodeCount = a.graphNodes.length;
        const newNode = {
          id: freshId,
          label: `Logical Node-${nodeCount + 1}`,
          type: 'process',
          x: 260 + Math.random() * 50,
          y: 110 + Math.random() * 105
        };
        
        // Connect automatically to the last node
        const lastNode = a.graphNodes[a.graphNodes.length - 1];
        const newEdge = lastNode ? { source: lastNode.id, target: freshId } : null;

        return {
          ...a,
          graphNodes: [...a.graphNodes, newNode],
          graphEdges: newEdge ? [...a.graphEdges, newEdge] : a.graphEdges
        };
      }
      return a;
    }));
    setTestConsole(c => [...c, `[Forge]: Added new logical block to "${selectedAgent.name}"`]);
  };

  const clearConsole = () => {
    setTestConsole(['[Console]: Cleared. Ready.']);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-[#fafafa]">
      
      {/* Top action header info */}
      <div className="p-6 bg-white border-b border-slate-200/60 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-[#0f172a] flex items-center gap-2">
            <span>The Forge — Agent Skeletal Configurator</span>
            <span className="p-1 rounded-md bg-[#6366f1]/10 text-indigo-700 text-[10px] font-extrabold leading-none uppercase tracking-wide">
              AGENT DESIGN STUDIO
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Build specialized secondary agents, structure their decision-making topologies, and select deep memory integration methods.
          </p>
        </div>

        <button 
          onClick={handleSimulateExecution}
          disabled={isSimulating}
          className={`flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow ${
            isSimulating ? 'animate-pulse' : ''
          }`}
        >
          <Play className="w-4.5 h-4.5 fill-white" />
          <span>{isSimulating ? 'Running Verification...' : 'Test Run Sandbox'}</span>
        </button>
      </div>

      {/* Main split dashboard pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left pane: Agent Lists & configs */}
        <div className="w-[300px] bg-white border-r border-slate-200/60 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
              Specialized Agents (子代理)
            </h3>
            
            <div className="space-y-2">
              {agents.map((agt) => {
                const active = agt.id === selectedAgentId;
                return (
                  <button 
                    key={agt.id}
                    onClick={() => setSelectedAgentId(agt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      active 
                        ? 'border-indigo-500 bg-indigo-50/30' 
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="text-xs font-extrabold text-[#0f172a]">{agt.name}</div>
                    <p className="text-[10px] font-medium text-slate-400 leading-normal line-clamp-2">
                      {agt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Engine Parameters */}
          <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4.5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Memory Integrator</span>
              <button 
                onClick={handleToggleMemory}
                className="text-[10px] font-extrabold uppercase px-2 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>{selectedAgent.memoryEngine.toUpperCase()} ENGINE</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Engine Details</div>
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                {selectedAgent.memoryEngine === 'vector' 
                  ? 'Highly semantic cosine vector database. Resolves raw user utterances to match ADRs.' 
                  : 'Predictable structural local key-value JSON schema. Ideal for deterministic state emitters.'}
              </p>
            </div>
          </div>

        </div>

        {/* Center/Right pane: Visual graph flow editor & output terminal logs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Section 1: Visual Decision Topology Canvas (Simplified node flow) */}
          <div className="flex-1 relative bg-white border-b border-slate-200/50 dot-grid overflow-hidden">
            
            <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
              <span className="text-[11px] font-extrabold text-slate-400 font-mono uppercase tracking-wider">
                Logical Graph: {selectedAgent.name}
              </span>
              <button 
                onClick={handleAddGraphNode}
                className="px-2 py-1 bg-[#6366f1]/10 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-50 hover:scale-105 transition-all text-[10px] font-extrabold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Node Block</span>
              </button>
            </div>

            {/* Drawing links using canvas representation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {selectedAgent.graphEdges.map((edge, i) => {
                const source = selectedAgent.graphNodes.find(n => n.id === edge.source);
                const target = selectedAgent.graphNodes.find(n => n.id === edge.target);
                if (!source || !target) return null;

                const sx = source.x + 85; 
                const sy = source.y + 24;
                const tx = target.x;
                const ty = target.y + 24;

                return (
                  <g key={i}>
                    <path 
                      d={`M ${sx} ${sy} C ${sx + 50} ${sy}, ${tx - 50} ${ty}, ${tx} ${ty}`}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                    <polygon 
                      points={`${tx},${ty} ${tx-6},${ty-4} ${tx-6},${ty+4}`}
                      fill="#cbd5e1"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Simulated interactive drag blocks */}
            {selectedAgent.graphNodes.map((n) => {
              const bgClass = n.type === 'trigger' 
                ? 'from-emerald-50 to-teal-50/50 border-emerald-200 text-emerald-800'
                : n.type === 'retrieve'
                  ? 'from-blue-50 to-indigo-50/50 border-blue-200 text-blue-850'
                  : n.type === 'gate'
                    ? 'from-orange-50 to-red-50/50 border-orange-200 text-orange-950'
                    : 'from-purple-50 to-pink-50/50 border-purple-200 text-purple-800';

              const indicatorDot = n.type === 'trigger' 
                ? 'bg-emerald-500' 
                : n.type === 'gate' 
                  ? 'bg-orange-500' 
                  : 'bg-indigo-500';

              return (
                <div 
                  key={n.id}
                  className={`absolute w-[170px] bg-gradient-to-tr border p-3.5 rounded-2xl shadow-sm backdrop-blur-sm select-none transition-shadow hover:shadow ${bgClass}`}
                  style={{ left: n.x, top: n.y }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${indicatorDot}`} />
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{n.type}</span>
                  </div>
                  <h4 className="text-xs font-extrabold tracking-tight leading-tight truncate">{n.label}</h4>
                </div>
              );
            })}

          </div>

          {/* Section 2: Sandbox console terminal stream logs */}
          <div className="h-[200px] bg-[#1e293b] flex flex-col border-t border-slate-800 shrink-0 select-text">
            
            {/* Console meta info header */}
            <div className="flex justify-between items-center px-6 py-2 bg-[#0f172a] border-b border-slate-800/60 text-[10px] font-extrabold text-slate-400 font-mono shrink-0 select-none">
              <span className="flex items-center gap-1.5 uppercase">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>SANDBOX SYSTEM CONSOLE LOGS</span>
              </span>
              <button onClick={clearConsole} className="hover:text-white transition-all">
                CLEAR OUTPUT
              </button>
            </div>

            {/* Console logs output */}
            <div className="flex-1 p-5 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-300">
              {testConsole.map((msg, idx) => {
                const isSystem = msg.includes('[System]');
                const isError = msg.includes('[Error]');
                const isSuccess = msg.includes('[Success]');

                let color = 'text-slate-300';
                if (isSystem) color = 'text-indigo-300';
                if (isError) color = 'text-red-400';
                if (isSuccess) color = 'text-emerald-400 font-bold';

                return (
                  <div key={idx} className={`${color} leading-relaxed font-medium`}>
                    {msg}
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
