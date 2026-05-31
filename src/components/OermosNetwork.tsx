/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  Globe, 
  Radio,
  Cpu,
  Server,
  Network,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { OermosNode } from '../types';
import { translations } from '../locales';

interface OermosNetworkProps {
  language?: 'en' | 'zh';
}

export default function OermosNetwork({ language = 'en' }: OermosNetworkProps) {
  const tVal = translations[language].oermos;
  
  const [nodes, setNodes] = useState<OermosNode[]>([
    { id: '1', name: 'Zurich Secure Gateway', status: 'connected', latency: 45, ip: '192.168.12.1', lastMessage: 'Transport session verified via ECDSA rsa-sha256.' },
    { id: '2', name: 'Tokyo Research Core', status: 'handshaking', latency: 180, ip: '10.0.4.88', lastMessage: 'Negotiating oermos session token v1.0.' },
    { id: '3', name: 'Local Host Station (Your PC)', status: 'connected', latency: 2, ip: '127.0.0.1', lastMessage: 'IPC socket channel synchronized locally.' },
    { id: '4', name: 'Dallas Relational Tunnel', status: 'idle', latency: 98, ip: '172.16.8.14', lastMessage: 'Standby mode activated. Standing by for handshakes.' },
    { id: '5', name: 'Seoul Distributed Boundary', status: 'disconnected', latency: 0, ip: '192.168.30.2', lastMessage: 'Channel timeout. Out of alignment.' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('3');

  // Let's generate subtle realistic fluctuating ping latency values
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === 'connected') {
          const delta = Math.round((Math.random() * 4) - 2);
          const nextLat = Math.max(2, node.latency + delta);
          return { ...node, latency: nextLat };
        }
        return node;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNodes(prev => prev.map(node => {
        if (node.id === '2') {
          return { 
            ...node, 
            status: 'connected', 
            latency: 122, 
            lastMessage: language === 'en' 
              ? 'Oermos handshake established successfully.' 
              : 'Oermos 握手通信连通协议建立成功。'
          };
        }
        if (node.id === '4') {
          return { 
            ...node, 
            status: 'handshaking', 
            latency: 82, 
            lastMessage: language === 'en'
              ? 'Initiating alternative transport wire sequence.'
              : '正在初始化对等备用信道传输序列。'
          };
        }
        return node;
      }));
      setIsLoading(false);
    }, 1200);
  };

  const getStatusStyle = (status: OermosNode['status']) => {
    switch (status) {
      case 'connected':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          dot: 'bg-emerald-500',
          lineColor: '#10b981',
          label: tVal.connected
        };
      case 'handshaking':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
          dot: 'bg-indigo-500 animate-pulse',
          lineColor: '#6366f1',
          label: tVal.handshaking
        };
      case 'disconnected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
          dot: 'bg-rose-500',
          lineColor: '#ef4444',
          label: tVal.disconnected
        };
      case 'idle':
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200/60',
          dot: 'bg-slate-400',
          lineColor: '#94a3b8',
          label: tVal.standby
        };
    }
  };

  // Static coordinate layout for beautiful clean SVG wire alignment
  const nodeCoords: Record<string, { x: number; y: number }> = {
    '1': { x: 120, y: 110 },  // Zurich
    '2': { x: 380, y: 110 },  // Tokyo
    '3': { x: 250, y: 340 },  // Local Host PC
    '4': { x: 100, y: 260 },  // Dallas
    '5': { x: 400, y: 260 },  // Seoul
  };

  const centerCoord = { x: 250, y: 200 }; // Hearth Central Coordinate

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[2];

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-[#f8fafc]">
      
      {/* 1. Header action strip */}
      <div className="px-8 py-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-[#0f172a] tracking-tight">{tVal.title}</h2>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider transition-colors">
              {tVal.subLabel}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            {tVal.desc}
          </p>
        </div>

        <button 
          onClick={handleSimulateSync}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? tVal.reroutingBtn : tVal.syncBtn}</span>
        </button>
      </div>

      {/* 2. Main split interactive grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Topological Mesh SVG visualizer */}
        <div className="flex-1 min-h-[350px] lg:min-h-0 bg-white relative overflow-hidden flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 p-8">
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{tVal.matrixTitle}</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>P2P ACTIVE</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <span>ECDSA-256 SECURED</span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            <svg 
              className="absolute w-[500px] h-[400px] pointer-events-none overflow-visible"
              viewBox="0 0 500 400"
            >
              <defs>
                <radialGradient id="glow-emerald" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glow-indigo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Grid Background Lines for Swiss Engineering Feel */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v-${i}`} x1={50 + i * 50} y1={20} x2={50 + i * 50} y2={380} stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h-${i}`} x1={20} y1={50 + i * 50} x2={480} y2={50 + i * 50} stroke="#f1f5f9" strokeWidth="1" />
              ))}

              {/* Concentric Signal Rings from Local Host (PC) */}
              <circle cx={centerCoord.x} cy={centerCoord.y} r="80" stroke="#f1f5f9" fill="none" strokeWidth="1" strokeDasharray="4,4" />
              <circle cx={centerCoord.x} cy={centerCoord.y} r="140" stroke="#f1f5f9" fill="none" strokeWidth="1" strokeDasharray="6,6" />

              {/* Signal wires from Core (Host) to Satellites */}
              {nodes.map(node => {
                const target = nodeCoords[node.id];
                if (!target) return null;
                const style = getStatusStyle(node.status);
                const isSelected = node.id === selectedNodeId;

                return (
                  <g key={`wire-${node.id}`} className="transition-all duration-300">
                    {/* Pulsing glow under selected line */}
                    {isSelected && (
                      <line 
                        x1={centerCoord.x} 
                        y1={centerCoord.y} 
                        x2={target.x} 
                        y2={target.y} 
                        stroke={style.lineColor}
                        strokeWidth={8}
                        strokeLinecap="round"
                        opacity={0.12}
                      />
                    )}
                    {/* Core wire */}
                    <line 
                      x1={centerCoord.x} 
                      y1={centerCoord.y} 
                      x2={target.x} 
                      y2={target.y} 
                      stroke={style.lineColor}
                      strokeWidth={isSelected ? 2 : 1.2}
                      strokeDasharray={node.status === 'handshaking' ? '6,6' : 'none'}
                      opacity={node.status === 'disconnected' ? 0.2 : 0.75}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Overlay Nodes */}
            <div className="absolute w-[500px] h-[400px]">
              
              {/* Central Server Node */}
              <div 
                className="absolute z-20 cursor-pointer p-0.5 rounded-xl bg-[#0f172a] shadow-xl text-center group transition-all duration-300"
                style={{
                  left: `${centerCoord.x}px`,
                  top: `${centerCoord.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                  <div className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
                  </div>
                  <span className="text-white text-[11px] font-black font-mono tracking-widest">HEARTH CORE</span>
                </div>
              </div>

              {/* Satellite nodes */}
              {nodes.map(node => {
                const coord = nodeCoords[node.id];
                if (!coord) return null;
                const style = getStatusStyle(node.status);
                const isSelected = node.id === selectedNodeId;

                return (
                  <button
                    key={`overlay-node-${node.id}`}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`absolute z-10 flex flex-col items-center group focus:outline-none transition-transform duration-300 ${
                      isSelected ? 'scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      left: `${coord.x}px`,
                      top: `${coord.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Node Dot Box */}
                    <div className={`p-2.5 rounded-2xl bg-white border shadow-md flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'border-indigo-500 ring-4 ring-indigo-50' 
                        : 'border-slate-200 hover:border-slate-350'
                    }`}>
                      <Server className={`w-4 h-4 ${
                        node.status === 'connected' 
                          ? 'text-emerald-500' 
                          : node.status === 'handshaking' 
                            ? 'text-indigo-500' 
                            : 'text-slate-400'
                      }`} />
                    </div>

                    {/* Simple Human Readable Tag */}
                    <div className="mt-2 flex flex-col items-center">
                      <div className="text-[9px] font-bold text-slate-800 bg-white/95 border border-slate-150 px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                        {node.name.split(' ')[0]}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                        <span className="text-[7.5px] font-mono text-slate-400 font-extrabold uppercase">{node.latency > 0 ? `${node.latency}ms` : '∞'}</span>
                      </div>
                    </div>
                  </button>
                );
              })}

            </div>

          </div>

          {/* Metric Dashboard Footer Strip */}
          <div className="mt-auto grid grid-cols-3 gap-6 pt-5 border-t border-slate-100">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">{language === 'en' ? 'Mesh Security' : '网格安全机制'}</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-800">ECDSA-256 SECURED</span>
              </div>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">{language === 'en' ? 'Active Handshakes' : '活动握手隧道'}</span>
              <div className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  {nodes.filter(n => n.status === 'connected').length} / {nodes.length} Tunnels
                </span>
              </div>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">{language === 'en' ? 'Avg Network Latency' : '平均反馈延迟'}</span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  {Math.round(nodes.filter(n => n.latency > 0).reduce((acc, curr) => acc + curr.latency, 0) / nodes.filter(n => n.latency > 0).length || 0)} ms
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Detailed Log List Terminal */}
        <div className="w-full lg:w-[380px] bg-slate-50 p-6 shrink-0 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 border-slate-100">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {tVal.cacheTitle}
              </h3>
              <span className="text-[9px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                LOCAL STORAGE
              </span>
            </div>

            {/* List map */}
            <div className="space-y-3">
              {nodes.map((node) => {
                const ui = getStatusStyle(node.status);
                const isSelected = node.id === selectedNodeId;
                
                return (
                  <div 
                    key={node.id} 
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-white border-indigo-400 shadow-md ring-1 ring-indigo-50' 
                        : 'bg-white hover:bg-[#fafafa] border-slate-200/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{node.name}</span>
                          {node.id === '3' && (
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono uppercase">YOU</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">IP: {node.ip}</div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-mono font-bold tracking-wide border shrink-0 ${ui.bg}`}>
                        {ui.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1 font-mono font-semibold">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        <span>Latency: {node.latency > 0 ? `${node.latency} ms` : '∞'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-bold">
                        <span>{language === 'en' ? 'Diagnostics' : '诊断'}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Terminal Inspector Console for Selected Node */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 space-y-4">
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              <span>{language === 'en' ? 'ECDSA Node Token Audits' : 'ECDSA 对等节点指令审查器'}</span>
            </div>

            <div className="bg-[#0f172a] rounded-xl p-4 font-mono text-[10.5px] text-slate-300 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-[9px] text-slate-500 border-b border-slate-800 pb-1.5">
                <span>INSPECT: id_0{selectedNode.id}</span>
                <span className="text-[#10b981]">ACTIVE LINK</span>
              </div>
              <div className="space-y-1.5 leading-relaxed">
                <p className="text-slate-500">&gt; oermos-cli link-status --node={selectedNode.id}</p>
                <p><span className="text-indigo-400">node_identity:</span> {selectedNode.name}</p>
                <p><span className="text-indigo-400">handshake_vector:</span> SHA256_{selectedNode.ip.replace(/\./g, '')}</p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-[#34d399] leading-relaxed break-all">
                  {selectedNode.lastMessage || 'Channel waiting in standby cycle.'}
                </div>
              </div>
            </div>

            {/* Local Security Shield Notice */}
            <div className="bg-slate-100 border border-slate-200/60 p-3.5 rounded-xl flex gap-2.5 items-start">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                <strong>{tVal.securityHeader}</strong> {tVal.securityDesc}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
