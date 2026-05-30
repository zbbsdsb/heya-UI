/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GitMerge, 
  Activity, 
  Layers, 
  Share2, 
  Server, 
  CheckCircle2, 
  Sliders,
  HelpCircle,
  TrendingUp,
  LineChart
} from 'lucide-react';
import { NodeData } from '../types';

interface RelationsTopologyProps {
  nodes: NodeData[];
}

export default function RelationsTopology({ nodes }: RelationsTopologyProps) {
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null);

  // Compute stats based on nodes data
  const totalConnections = nodes.reduce((acc, current) => acc + (current.connections?.length || 0), 0);
  const coreHubs = nodes.filter(n => n.connections && n.connections.length > 1);

  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-8 animate-in fade-in-20 duration-300">
      
      {/* Upper header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] flex items-center gap-2">
            <GitMerge className="w-6 h-6 text-indigo-500" />
            <span>Relational Topography Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Quantify degrees of connections, dependency streams, propagation weights, and systemic gravity values of all components.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Connections</span>
            <span className="text-base font-extrabold text-[#0f172a] tracking-tight">{totalConnections} links</span>
          </div>

          <div className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col justify-between max-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Relational Density</span>
            <span className="text-base font-extrabold text-[#0f172a] tracking-tight">
              {nodes.length > 0 ? (totalConnections / nodes.length).toFixed(1) : 0}x
            </span>
          </div>
        </div>
      </div>

      {/* Main double split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Topological Nodes & Gravity coefficients list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Component Network Density Index (中心度指数)
            </h3>

            <div className="space-y-4">
              {nodes.map((n) => {
                const degree = n.connections?.length || 0;
                // High density rating
                const densityCoefficient = degree * 2.5 + (n.star ? 3.0 : 0) + (n.progress * 0.05);

                return (
                  <div 
                    key={n.id}
                    onClick={() => setSelectedRelationId(n.id)}
                    className={`p-4 bg-slate-50 hover:bg-[#f1f5f9] border rounded-2xl transition-all cursor-pointer flex items-center justify-between ${
                      selectedRelationId === n.id ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-100'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-extrabold text-[#0f172a] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span>{n.title}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Type: {n.type} | Active Connections: {degree}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs font-extrabold text-indigo-700 font-mono">
                        Gravity: {densityCoefficient.toFixed(1)} G
                      </div>
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" 
                          style={{ width: `${Math.min(100, densityCoefficient * 10)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Target Connection propagation analyzer */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-5 shadow-sm min-h-[400px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Propagation Impact (级联影响)
            </h3>

            {selectedRelationId ? (() => {
              const selectedNode = nodes.find(n => n.id === selectedRelationId);
              if (!selectedNode) return null;

              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-mono">Focused Component</h4>
                    <p className="text-sm font-extrabold text-[#0f172a] mt-1">{selectedNode.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-semibold font-mono">COORDINATES: ({selectedNode.x}, {selectedNode.y})</p>
                  </div>

                  {/* Downstream targets */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      Downstream Connections
                    </h4>

                    {selectedNode.connections?.length === 0 ? (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-400 font-semibold italic text-center">
                        This component has 0 outbound dependencies.
                      </div>
                    ) : (
                      selectedNode.connections?.map((targetId) => {
                        const target = nodes.find(n => n.id === targetId);
                        if (!target) return null;

                        return (
                          <div key={targetId} className="p-3 bg-[#f8fafc] border border-slate-100 rounded-xl flex items-center justify-between">
                            <span className="text-xs font-extrabold text-slate-700 truncate">{target.title}</span>
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                              LINK ACTIVE
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 border-t font-semibold leading-relaxed text-[11px] text-slate-400 flex gap-1.5 leading-normal">
                    <Activity className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
                    <span>Any modifications pushed to this hub will cascade and update connecting handshakes model directly via the Hearth-Oermos protocols.</span>
                  </div>
                </div>
              );
            })() : (
              <div className="h-full flex flex-col justify-center items-center text-slate-400 space-y-2 py-16 text-center">
                <Sliders className="w-8 h-8 text-slate-350 animate-bounce" />
                <p className="text-xs font-bold text-slate-500">No relation focused</p>
                <p className="text-[10px] text-slate-400 font-semibold max-w-[180px]">Click any component in the density index list to analyze connection cascade trees.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
