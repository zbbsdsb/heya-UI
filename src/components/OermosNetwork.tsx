/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wifi, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  Terminal, 
  Globe, 
  Cpu, 
  Grid,
  Zap,
  Radio
} from 'lucide-react';
import { OermosNode } from '../types';

export default function OermosNetwork() {
  const [nodes, setNodes] = useState<OermosNode[]>([
    { id: '1', name: 'Zurich Secure Gateway', status: 'connected', latency: 45, ip: '192.168.12.1' },
    { id: '2', name: 'Tokyo Research Core', status: 'handshaking', latency: 180, ip: '10.0.4.88', lastMessage: 'Negotiating oermos session token v1.0.' },
    { id: '3', name: 'Local Host Station (Your PC)', status: 'connected', latency: 2, ip: '127.0.0.1' },
    { id: '4', name: 'Dallas Relational Tunnel', status: 'idle', latency: 98, ip: '172.16.8.14' },
    { id: '5', name: 'Seoul Distributed Boundary', status: 'disconnected', latency: 0, ip: '192.168.30.2' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSimulateSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNodes(prev => prev.map(node => {
        if (node.id === '2') {
          return { ...node, status: 'connected', latency: 135, lastMessage: 'Oermos handshake established successfully.' };
        }
        if (node.id === '4') {
          return { ...node, status: 'handshaking', latency: 90, lastMessage: 'Performing P2P handshakes.' };
        }
        return {
          ...node,
          latency: node.status === 'connected' ? Math.max(2, node.latency + Math.round((Math.random() * 10) - 5)) : node.latency
        };
      }));
      setIsLoading(false);
    }, 1200);
  };

  const getStatusStyle = (status: OermosNode['status']) => {
    switch (status) {
      case 'connected':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot: 'bg-emerald-500',
          label: 'CONNECTED'
        };
      case 'handshaking':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
          dot: 'bg-indigo-500 animate-pulse',
          label: 'HANDSHAKING'
        };
      case 'disconnected':
        return {
          bg: 'bg-red-50 text-red-750 border-red-100',
          dot: 'bg-red-500',
          label: 'DISCONNECTED'
        };
      case 'idle':
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-100',
          dot: 'bg-slate-400',
          label: 'STANDBY'
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-[#fafafa]">
      
      {/* Upper header action area */}
      <div className="p-6 bg-white border-b border-slate-200/60 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-[#0f172a] flex items-center gap-2">
            <span>Oermos P2P Networking Mesh</span>
            <span className="p-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold leading-none uppercase tracking-wide">
              Secure P2P Broadcast
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Analyze direct Peer-to-Peer connection pathways between decentralized boundaries, and confirm coordinate sync health.
          </p>
        </div>

        <button 
          onClick={handleSimulateSync}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 border text-white text-xs font-bold rounded-xl transition-all shadow"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Rerouting Gateway Nodes...' : 'Synchronize Handshakes (连线连接)'}</span>
        </button>
      </div>

      {/* Split visual layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left pane: Visual graphic display mapping */}
        <div className="flex-1 relative bg-white border-r border-slate-200/60 dot-grid overflow-hidden">
          
          <div className="absolute top-4 left-6 flex items-center gap-1 font-mono text-[10px] text-slate-400 font-extrabold uppercase">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Topological Node Handshake Matrix</span>
          </div>

          {/* Graphical mesh rendering representation */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-80 h-80 border border-slate-150 rounded-full flex items-center justify-center border-dashed">
              <div className="relative w-48 h-48 border border-slate-150 rounded-full flex items-center justify-center border-dashed">
                
                {/* Center Core Node */}
                <div className="w-14 h-14 bg-black rounded-2xl flex flex-col justify-between p-2.5 z-20 shadow-xl border text-center relative overflow-hidden">
                  <span className="text-white text-xs font-bold font-mono">CORE</span>
                  <div className="absolute bottom-1 w-2 h-2 bg-emerald-400 rounded-full left-1/2 -translate-x-1/2 animate-ping" />
                </div>

                {/* Satellite Connected Peers */}
                {nodes.map((node, i) => {
                  const angle = (i * 2 * Math.PI) / nodes.length;
                  const radius = 120; // Distance from center
                  const x = radius * Math.cos(angle);
                  const y = radius * Math.sin(angle);

                  const ui = getStatusStyle(node.status);

                  return (
                    <div 
                      key={node.id}
                      className="absolute z-10 flex flex-col items-center"
                      style={{
                        transform: `translate(${x}px, ${y}px)`
                      }}
                    >
                      {/* Connection Wire back to core */}
                      <svg className="absolute w-[300px] h-[300px] pointer-events-none overflow-visible top-0 left-0" style={{ transform: 'translate(-150px, -150px)', zIndex: -1 }}>
                        <line 
                          x1={150} 
                          y1={150} 
                          x2={150 - x} 
                          y2={150 - y} 
                          stroke={node.status === 'connected' ? 'rgba(16, 185, 129, 0.4)' : node.status === 'handshaking' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(226, 232, 240, 0.5)'}
                          strokeWidth={2}
                          strokeDasharray={node.status === 'handshaking' ? '3,3' : 'none'}
                        />
                      </svg>

                      {/* Satellite Dot */}
                      <div className={`w-8 h-8 rounded-xl bg-white border shadow flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        node.status === 'connected' ? 'border-emerald-200' : 'border-slate-200'
                      }`}>
                        <Radio className={`w-4.5 h-4.5 ${
                          node.status === 'connected' ? 'text-emerald-500' : node.status === 'handshaking' ? 'text-indigo-500' : 'text-slate-400'
                        }`} />
                      </div>

                      {/* Floating Name */}
                      <div className="mt-1.5 bg-black/85 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow max-w-[120px] truncate">
                        {node.name.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

        </div>

        {/* Right pane: List with IP metadata, latency & message logs */}
        <div className="w-[360px] bg-white p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
              Client Nodes Cache (用户终端清单)
            </h3>

            <div className="space-y-2.5">
              {nodes.map((node) => {
                const ui = getStatusStyle(node.status);
                return (
                  <div key={node.id} className="p-3.5 bg-[#f8fafc] border border-slate-100 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{node.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold font-mono mt-0.5 uppercase">IP: {node.ip}</div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-extrabold tracking-wide border ${ui.bg}`}>
                        {ui.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 font-mono">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        <span>Latency: {node.latency > 0 ? `${node.latency} ms` : '∞'}</span>
                      </div>
                    </div>

                    {node.lastMessage && (
                      <div className="bg-[#1e293b] p-2 rounded-xl text-[9px] text-[#34d399] font-mono border border-slate-800 break-words leading-relaxed leading-normal">
                        {node.lastMessage}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secure details tag */}
          <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex gap-2 items-start mt-4">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              <strong>Oermos v1.0 Security Key:</strong> Handshake certificates are verified using local ECDSA algorithms. Data is broadcast directly without middle servers.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
