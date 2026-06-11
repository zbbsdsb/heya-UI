/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  ArrowUpRight,
  Mail,
  Send,
  Inbox,
  Sparkles,
  ChevronRight,
  Trash2,
  Terminal,
  MousePointer,
  Maximize2
} from 'lucide-react';
import { OermosNode } from '../types';
import { translations } from '../locales';

interface OermosNetworkProps {
  language?: 'en' | 'zh';
}

interface DecryptedEmail {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  isOutgoing: boolean;
  transitPeer?: string;
  signature: string;
}

export default function OermosNetwork({ language = 'en' }: OermosNetworkProps) {
  const isEn = language === 'en';
  const tVal = translations[language].oermos;
  
  // Right sidebar tab toggle
  const [activeRightTab, setActiveRightTab] = useState<'diagnostics' | 'mailbox'>('mailbox');

  // Core Oermos Nodes
  const [nodes, setNodes] = useState<OermosNode[]>([
    { id: '1', name: 'Zurich Secure Gateway', status: 'connected', latency: 45, ip: '192.168.12.1', lastMessage: 'Transport session verified via ECDSA rsa-sha256.' },
    { id: '2', name: 'Tokyo Research Core', status: 'handshaking', latency: 180, ip: '10.0.4.88', lastMessage: 'Negotiating oermos session token v1.0.' },
    { id: '3', name: 'Local Host Station (Your PC)', status: 'connected', latency: 2, ip: '127.0.0.1', lastMessage: 'IPC socket channel synchronized locally.' },
    { id: '4', name: 'Dallas Relational Tunnel', status: 'idle', latency: 98, ip: '172.16.8.14', lastMessage: 'Standby mode activated. Standing by for handshakes.' },
    { id: '5', name: 'Seoul Distributed Boundary', status: 'disconnected', latency: 0, ip: '192.168.30.2', lastMessage: 'Channel timeout. Out of alignment.' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('3');

  // --- MAP DRAG & PAN STATES ---
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // --- CRYPTOGRAPHIC EMAIL DATABASE STATE ---
  const [emails, setEmails] = useState<DecryptedEmail[]>([
    { 
      id: 'mail-1', 
      sender: 'zurich-gateway@oermos.peer', 
      recipient: 'local-host@hearth.peer',
      subject: 'ADR-007 Consensus Handshake Signature', 
      body: 'Decentralized state verification is successful. Fowler-No-Vo FNV-1a master cryptography aligns across 4 active Swiss chunks beautifully.',
      timestamp: '23:14:02', 
      read: false,
      isOutgoing: false,
      transitPeer: 'Dallas Relational Tunnel',
      signature: '0x8f29ea10bc49'
    },
    { 
      id: 'mail-2', 
      sender: 'tokyo-core@oermos.peer', 
      recipient: 'local-host@hearth.peer',
      subject: 'Spatial Coordinate Buffer Calibrations', 
      body: 'Observed subtle 14ms timing drift in physical layout matrices. Calibrated bezier anchors to protect 100% telemetry alignment.',
      timestamp: '23:02:11', 
      read: true,
      isOutgoing: false,
      transitPeer: 'Japan Telecom Link',
      signature: '0xa0ef39cc129b'
    },
    { 
      id: 'mail-3', 
      sender: 'dallas-tunnel@oermos.peer', 
      recipient: 'local-host@hearth.peer',
      subject: 'NAT Traversal Socket Verified', 
      body: 'Stun network mappings successfully calculated. Decentralized WebRTC hole-punching holds secure in under 8ms.',
      timestamp: '22:45:19', 
      read: true,
      isOutgoing: false,
      transitPeer: 'Zurich Secure Gateway',
      signature: '0xb23e8f8101a9'
    }
  ]);
  const [selectedEmailId, setSelectedEmailId] = useState<string>('mail-1');

  // Composition Forms State
  const [composeTo, setComposeTo] = useState<string>('1'); // Node ID recipient
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');
  
  // Real-time animation packet states
  const [packetTransit, setPacketTransit] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    progress: number; // 0 to 1
    active: boolean;
    subject: string;
  } | null>(null);

  // Fluctuations of Latency Ping
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
    }, 4000);
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
            lastMessage: isEn 
              ? 'Oermos handshake established successfully.' 
              : 'Oermos 握手通信连通协议建立成功。'
          };
        }
        if (node.id === '4') {
          return { 
            ...node, 
            status: 'handshaking', 
            latency: 82, 
            lastMessage: isEn
              ? 'Initiating alternative transport wire sequence.'
              : '正在初始化对等备用信道传输序列。'
          };
        }
        return node;
      }));
      (window as any).playTactileChime?.('success');
      window.dispatchEvent(new CustomEvent('heya-toast', { 
        detail: { message: isEn ? 'Swarm topology recalculated! Syncing routing table.' : '对等网络拓扑已更新！正在重设动态选路表。' } 
      }));
      setIsLoading(false);
    }, 1200);
  };

  const getStatusStyle = (status: OermosNode['status']) => {
    switch (status) {
      case 'connected':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-250',
          dot: 'bg-emerald-500',
          lineColor: '#10b981',
          label: tVal.connected
        };
      case 'handshaking':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-250',
          dot: 'bg-indigo-500 animate-pulse',
          lineColor: '#6366f1',
          label: tVal.handshaking
        };
      case 'disconnected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-250',
          dot: 'bg-rose-500',
          lineColor: '#ef4444',
          label: tVal.disconnected
        };
      case 'idle':
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-250',
          dot: 'bg-slate-400',
          lineColor: '#94a3b8',
          label: tVal.standby
        };
    }
  };

  // Wire Map Coordinates
  const nodeCoords: Record<string, { x: number; y: number }> = {
    '1': { x: 100, y: 100 },  // Zurich Secure Gateway
    '2': { x: 400, y: 100 },  // Tokyo Research Core
    '3': { x: 250, y: 320 },  // Local Host Station (PC)
    '4': { x: 80, y: 250 },   // Dallas Relational Tunnel
    '5': { x: 420, y: 250 },   // Seoul Distributed Boundary
  };

  const centerCoord = nodeCoords['3']; // Local Host Station PC serves as central orchestrator

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[2];

  // --- DRAG / PAN HANDLING ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest('button') || 
      (e.target as HTMLElement).closest('.interactive-node') ||
      (e.target as HTMLElement).closest('input') ||
      (e.target as HTMLElement).closest('textarea') ||
      (e.target as HTMLElement).closest('select')
    ) {
      return; // Skip if clicking form, buttons or selectable nodes
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest('button') || 
      (e.target as HTMLElement).closest('.interactive-node')
    ) {
      return;
    }
    const touch = e.touches[0];
    setIsPanning(true);
    setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - panStart.x,
      y: touch.clientY - panStart.y
    });
  };

  // --- COMPOSE SECURE SMTP P2P ENCRYPTED MAIL AND ANIMATE WIRE PACKET ---
  const handleSendP2PMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    const recipientNode = nodes.find(n => n.id === composeTo);
    if (!recipientNode) return;

    // Get source position and target position
    const startPos = centerCoord; // Sent from PC/Local host (Peer 3)
    const endPos = nodeCoords[composeTo] || centerCoord;

    // Trigger local audio click
    (window as any).playTactileChime?.('click');

    // Trigger the packet physical flight telemetry sequence!
    setPacketTransit({
      startX: startPos.x,
      startY: startPos.y,
      endX: endPos.x,
      endY: endPos.y,
      progress: 0,
      active: true,
      subject: composeSubject
    });

    // Create unique cryptographic sign
    const microSign = '0x' + Math.abs(Math.random() * 0xfffffff | 0).toString(16).slice(0, 12);
    
    // Animate the flying envelope across the wire!
    let currentProgress = 0;
    const intervalTime = 40; // Step speed
    const duration = 1200; // ms total
    const totalSteps = duration / intervalTime;
    const stepIncr = 1 / totalSteps;

    const animTimer = setInterval(() => {
      currentProgress += stepIncr;
      if (currentProgress >= 1) {
        clearInterval(animTimer);
        setPacketTransit(null);

        // Deliver Mail into local state
        const newMail: DecryptedEmail = {
          id: `mail-outgoing-${Date.now()}`,
          sender: 'local-host@hearth.peer',
          recipient: recipientNode.name.toLowerCase().replace(/\s+/g, '-') + '@oermos.peer',
          subject: composeSubject.trim(),
          body: composeBody.trim(),
          timestamp: new Date().toLocaleTimeString(),
          read: true,
          isOutgoing: true,
          transitPeer: 'Dallas Relational Tunnel',
          signature: microSign
        };

        setEmails(prev => [newMail, ...prev]);
        setSelectedEmailId(newMail.id);
        
        // Reset compose form
        setComposeSubject('');
        setComposeBody('');

        // Trigger Success telemetry events
        (window as any).playTactileChime?.('success');
        window.dispatchEvent(new CustomEvent('heya-toast', { 
          detail: { 
            message: isEn 
              ? `Cryptographic smtp mail transmitted to [${recipientNode.name}] successfully! Transit verified.` 
              : `对等加密信件已成功投递至 [${recipientNode.name}]！防篡改哈希签名：${microSign}`
          } 
        }));
      } else {
        setPacketTransit(prev => prev ? { ...prev, progress: currentProgress } : null);
      }
    }, intervalTime);
  };

  const handleDeleteEmail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(prev => prev.filter(m => m.id !== id));
    (window as any).playTactileChime?.('click');
    if (selectedEmailId === id) {
      setSelectedEmailId(emails[0]?.id || '');
    }
  };

  const selectedEmail = emails.find(m => m.id === selectedEmailId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-[#f8fafc] font-sans">
      
      {/* 1. Header action strip */}
      <div className="px-8 py-5 bg-white border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-[#0f172a] tracking-tight">{tVal.title}</h2>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-widest">
              {isEn ? 'DECENTRALIZED WORKSPACE SWARM v1.2' : '去中心对等拓扑 SDK v1.2'}
            </span>
          </div>
          <p className="text-[11.5px] text-slate-500 font-semibold mt-1 max-w-2xl leading-relaxed">
            {isEn 
              ? 'Calibrate secure WebRTC browser coordinate routing, review cryptographic parity rules, or route decentralized P2P mail packets across the swarm mesh.'
              : '本模块负责管理去中心 WebRTC 无服务器对等通信、审查 FNV-1a Parity 哈希安全协议，并允许通过网络分片进行多跳加密 P2P 邮件投递测试。'}
          </p>
        </div>

        <button 
          onClick={handleSimulateSync}
          disabled={isLoading}
          className="flex items-center gap-2 px-4.5 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/15 self-stretch md:self-auto justify-center cursor-pointer font-sans"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? (isEn ? 'Aligning Swarm...' : '正在对齐共识...') : (isEn ? 'Force Recalibration' : '强制重构校验')}</span>
        </button>
      </div>

      {/* 2. Main split interactive grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Topological Mesh SVG visualizer (DRAGGABLE & WITH EMAIL WIRE TELEMETRY) */}
        <div 
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="flex-1 min-h-[380px] lg:min-h-0 bg-white relative overflow-hidden flex flex-col p-8 select-none"
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          
          <div className="flex items-center justify-between z-10 pointer-events-none">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-slate-400 font-black uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Oermos Multicast Coordinate Mesh</span>
              </div>
              <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-mono font-bold select-none shrink-0 self-start">
                ↕ {isEn ? 'Click & Drag Background to pan across coordinate system' : '按住鼠标左键即可拖动查看视口星盘'}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 px-3.5 py-2 rounded-xl text-[9.5px] font-mono text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-bold">SWARM ACTIVE</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <span className="font-bold">ECDSA SECRET SIGNING</span>
            </div>
          </div>

          {/* Draggable canvas viewport resetting control */}
          { (panOffset.x !== 0 || panOffset.y !== 0) && (
            <div className="absolute left-8 bottom-24 z-10">
              <button 
                onClick={() => setPanOffset({ x: 0, y: 0 })}
                className="px-3.5 py-2 bg-indigo-50 border border-indigo-150 text-indigo-650 rounded-xl text-[10px] font-mono font-black flex items-center gap-1.5 hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer pointer-events-auto"
              >
                <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'RESET PAN VIEWPORT' : '重设物理视窗口'}</span>
              </button>
            </div>
          )}

          {/* SVG Map Container (TRANSLATED BY panOffset) */}
          <div 
            className="flex-1 relative flex items-center justify-center p-4 transition-transform duration-75"
            style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
          >
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

              {/* Grid Background Lines */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v-${i}`} x1={50 + i * 50} y1={20} x2={50 + i * 50} y2={380} stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h-${i}`} x1={20} y1={50 + i * 50} x2={480} y2={50 + i * 50} stroke="#f1f5f9" strokeWidth="1" />
              ))}

              {/* Concentric Circle Ranges */}
              <circle cx={centerCoord.x} cy={centerCoord.y} r="80" stroke="#f1f5f9" fill="none" strokeWidth="1" strokeDasharray="4,4" />
              <circle cx={centerCoord.x} cy={centerCoord.y} r="140" stroke="#f1f5f9" fill="none" strokeWidth="1" strokeDasharray="6,6" />

              {/* Draw Wire Connections and animated states */}
              {nodes.map(node => {
                const target = nodeCoords[node.id];
                if (!target || node.id === '3') return null; // Connection wire to external satellite
                const style = getStatusStyle(node.status);
                const isSelected = node.id === selectedNodeId;

                return (
                  <g key={`wire-${node.id}`} className="transition-all duration-300">
                    {/* Pulsing indicator aura */}
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
                    
                    {/* The copper wire vector pathway */}
                    <line 
                      x1={centerCoord.x} 
                      y1={centerCoord.y} 
                      x2={target.x} 
                      y2={target.y} 
                      stroke={style.lineColor}
                      strokeWidth={isSelected ? 2 : 1.25}
                      strokeDasharray={node.status === 'handshaking' ? '6,6' : 'none'}
                      opacity={node.status === 'disconnected' ? 0.2 : 0.7}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}

              {/* LIVE PHYISCAL FLIGHT ENVELOPE / APERATIVE COMM WIRE LOGIC */}
              {packetTransit && packetTransit.active && (() => {
                // Compute linear interpolation coordinate
                const curX = packetTransit.startX + (packetTransit.endX - packetTransit.startX) * packetTransit.progress;
                const curY = packetTransit.startY + (packetTransit.endY - packetTransit.startY) * packetTransit.progress;
                
                return (
                  <g key="flying-packet" className="transition-all">
                    {/* Ripple background ring */}
                    <circle cx={curX} cy={curY} r="12" fill="#6366f1" opacity={0.15} className="animate-ping" style={{ animationDuration: '0.8s' }} />
                    <circle cx={curX} cy={curY} r="6" fill="#6366f1" />
                    <circle cx={curX} cy={curY} r="3" fill="#ffffff" />
                    {/* Tiny text identifier floating on map during transit */}
                    <text x={curX + 10} y={curY + 4} fill="#6366f1" fontSize="7" fontFamily="monospace" fontWeight="bold">
                      SMTP_RELAYING...
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Absolute Coordinate Overlays (Translate in line with parent space) */}
            <div className="absolute w-[500px] h-[400px] pointer-events-none">
              
              {/* Central Station PC Node */}
              <div 
                className="absolute z-25 p-0.5 rounded-xl bg-[#0f172a] shadow-xl text-center group transition-all duration-300 interactive-node pointer-events-auto"
                style={{
                  left: `${centerCoord.x}px`,
                  top: `${centerCoord.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div 
                  onClick={() => setSelectedNodeId('3')}
                  className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 cursor-pointer select-none"
                >
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
                  </div>
                  <span className="text-white text-[10px] font-black font-mono tracking-widest uppercase">HEARTH LOCAL_PC</span>
                </div>
              </div>

              {/* Map Nodes Layer */}
              {nodes.map(node => {
                if (node.id === '3') return null; // Already rendered Central Core
                const coord = nodeCoords[node.id];
                if (!coord) return null;
                const style = getStatusStyle(node.status);
                const isSelected = node.id === selectedNodeId;

                return (
                  <div
                    key={`map-overlay-${node.id}`}
                    className={`absolute z-20 flex flex-col items-center transition-transform duration-300 interactive-node pointer-events-auto ${
                      isSelected ? 'scale-105' : 'hover:scale-102 font-medium'
                    }`}
                    style={{
                      left: `${coord.x}px`,
                      top: `${coord.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Node Server Box Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNodeId(node.id);
                        (window as any).playTactileChime?.('click');
                      }}
                      className={`p-2.5 rounded-2xl bg-white border shadow-md flex items-center justify-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-500 ring-4 ring-indigo-500/10' 
                          : 'border-slate-200/80 hover:border-slate-350'
                      }`}
                    >
                      <Server className={`w-4 h-4 ${
                        node.status === 'connected' 
                          ? 'text-emerald-500' 
                          : node.status === 'handshaking' 
                            ? 'text-indigo-505 animate-pulse' 
                            : 'text-slate-400'
                      }`} />
                    </button>

                    {/* Small tag floating with ip latency details */}
                    <div className="mt-2 flex flex-col items-center">
                      <div className="text-[10px] font-black text-slate-800 bg-white border border-slate-150 px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap">
                        {node.name.split(' ')[0]}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                        <span className="text-[7.5px] font-mono text-slate-400 font-extrabold uppercase">
                          {node.latency > 0 ? `${node.latency}ms` : 'DISCONNECTED'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>

          {/* Metric Dashboard Footer info */}
          <div className="mt-auto grid grid-cols-3 gap-6 pt-5 border-t border-slate-100 pointer-events-none">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">{isEn ? 'Mesh Security' : '安控加密密钥'}</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-slate-800">ECDSA-256 PARITY</span>
              </div>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">{isEn ? 'Active Handshakes' : '激活握手信道'}</span>
              <div className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  {nodes.filter(n => n.status === 'connected').length} / {nodes.length} Tunnels
                </span>
              </div>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-3.5 space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">{isEn ? 'Symmetric Latency' : '整体拓扑平均迟延'}</span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  {Math.round(nodes.filter(n => n.latency > 0).reduce((acc, curr) => acc + curr.latency, 0) / nodes.filter(n => n.latency > 0).length || 0)} ms
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Column Switcher: Terminal Diagnostics vs Cryptographic P2P Email Mailbox */}
        <div className="w-full lg:w-[410px] bg-slate-50 p-6 shrink-0 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 border-slate-150">
          
          <div className="space-y-4">
            
            {/* Interactive Tab switches */}
            <div className="flex bg-slate-200/70 p-1 rounded-2xl border border-slate-300/30 gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveRightTab('mailbox');
                  (window as any).playTactileChime?.('click');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRightTab === 'mailbox'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isEn ? 'Encrypted Mailbox' : '加密信箱 (SMTP)'}</span>
                {emails.filter(m => !m.read).length > 0 && (
                  <span className="bg-rose-500 text-white font-mono text-[8px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {emails.filter(m => !m.read).length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRightTab('diagnostics');
                  (window as any).playTactileChime?.('click');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRightTab === 'diagnostics'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isEn ? 'Node Telemetry' : '节点控制台'}</span>
              </button>
            </div>

            {/* TAB CONTENT: DECENTRALIZED P2P SMTP MAILBOX */}
            {activeRightTab === 'mailbox' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 tracking-wider font-mono">
                    {isEn ? 'DECENTRALIZED ENVELOPE LEDGER' : '物理域对等安全传输信件库'}
                  </span>
                  <Inbox className="w-4 h-4 text-slate-400" />
                </div>

                {/* Email Senders List */}
                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                  {emails.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-mono text-[10px]">
                      {isEn ? 'SMTP Mailbox completely cleared.' : '星盘加密邮件库空空如也。'}
                    </div>
                  ) : (
                    emails.map(mail => {
                      const isSelected = selectedEmailId === mail.id;
                      return (
                        <div
                          key={mail.id}
                          onClick={() => {
                            setSelectedEmailId(mail.id);
                            // Set to read
                            setEmails(prev => prev.map(m => m.id === mail.id ? { ...m, read: true } : m));
                            (window as any).playTactileChime?.('click');
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                            isSelected
                              ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-50'
                              : 'bg-white hover:bg-slate-50 border-slate-200/60'
                          }`}
                        >
                          {/* Unread indicator bullet */}
                          {!mail.read && (
                            <span className="absolute left-2.5 top-3.5 w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" />
                          )}

                          <div className="flex justify-between items-start gap-1 pb-1">
                            <span className={`text-[10px] font-mono truncate tracking-tight max-w-[170px] ${!mail.read ? 'font-black text-slate-800' : 'text-slate-450'}`}>
                              {mail.isOutgoing ? '📤 OUT: ' + mail.recipient : '📥 IN: ' + mail.sender}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400">{mail.timestamp}</span>
                          </div>

                          <div className="text-[10.5px] font-extrabold text-slate-700 tracking-tight leading-snug line-clamp-1">
                            {mail.subject}
                          </div>

                          <div className="text-[9px] text-slate-450 mt-1 line-clamp-1 italic font-semibold leading-relaxed">
                            {mail.body}
                          </div>

                          {/* Trigger delete button */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteEmail(mail.id, e)}
                            className="absolute right-2.5 bottom-2.5 p-1 rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 hidden group-hover:block transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Selected Email Detailed Deck / Decryptor */}
                {selectedEmail && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-xs">
                    <div className="border-b border-rose-100/50 pb-2.5 space-y-1">
                      <div className="flex justify-between items-center text-[8px] font-mono">
                        <span className="text-slate-400 uppercase tracking-widest font-bold">CRYPTO SHIELD ENVELOPE:</span>
                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-black">{selectedEmail.signature}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 tracking-tight leading-tight mt-1">{selectedEmail.subject}</h4>
                    </div>

                    <div className="space-y-1.5 text-[10.5px] font-semibold leading-relaxed text-slate-650 font-sans">
                      <div className="flex justify-between font-mono text-[9px] text-slate-405">
                        <span>{isEn ? 'From' : '寄件对等端'}: {selectedEmail.sender}</span>
                      </div>
                      <div className="p-3 bg-slate-900 border border-slate-800 text-[#34d399] font-mono text-[9.5px] rounded-xl leading-relaxed break-all select-all font-semibold">
                        {selectedEmail.body}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono border-t border-slate-100 pt-2 font-black uppercase">
                      <span>SMTP PEER: {selectedEmail.transitPeer || 'Direct Socket Connect'}</span>
                      <span className="text-indigo-600">✓ SECURED VIA WEBRTC PROTOCOL</span>
                    </div>
                  </div>
                )}

                {/* COMPOSE SECURE P2P SMTP EMAIL BOX FORM */}
                <form onSubmit={handleSendP2PMail} className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1 text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider">
                    <Send className="w-3.5 h-3.5 text-indigo-505" />
                    <span>{isEn ? 'Compose Secure P2P Letter' : '向其他对等端投递机密封包'}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        className="bg-white border border-slate-250 rounded-xl px-2.5 py-1.5 text-[10.5px] font-mono font-bold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        {nodes.filter(n => n.id !== '3').map(n => (
                          <option key={n.id} value={n.id}>
                            📡 {n.name.split(' ')[0]}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder={isEn ? "Email Subject Header..." : "主题, 如 v1.02 端同步反馈签名"}
                        className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-550 font-semibold"
                        required
                      />
                    </div>

                    <textarea
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      placeholder={isEn ? "Encode your raw P2P message lines here..." : "在此输入需要进行对等节点安全投递的密文报文..."}
                      className="w-full bg-white border border-slate-250 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-550 font-semibold h-16 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!composeSubject.trim() || !composeBody.trim()}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                      composeSubject.trim() && composeBody.trim()
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-600/10'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/30'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Transmit Secure Mail' : '对等网络广播加密邮件'}</span>
                  </button>
                </form>

              </div>
            )}

            {/* TAB CONTENT: ORIGINAL DIRECT telemetries */}
            {activeRightTab === 'diagnostics' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {tVal.cacheTitle}
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                    LOCAL STORAGE
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {nodes.map((node) => {
                    const ui = getStatusStyle(node.status);
                    const isSelected = node.id === selectedNodeId;
                    
                    return (
                      <div 
                        key={node.id} 
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${
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
                                <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono uppercase font-black">YOU</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">IP: {node.ip}</div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-mono font-black border shrink-0 ${ui.bg}`}>
                            {ui.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] text-slate-505 font-semibold">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Activity className="w-3.5 h-3.5 text-slate-400" />
                            <span>Latency: {node.latency > 0 ? `${node.latency} ms` : '∞'}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-bold">
                            <span>{isEn ? 'Diagnostics' : '诊断'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Terminal Inspector Console for Selected Node */}
                <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    <span>{isEn ? 'Symmetric Node Encrypted Audits' : 'ECDSA 对等节点指令审查器'}</span>
                  </div>

                  <div className="bg-[#0f172a] rounded-2xl p-4 font-mono text-[10px] text-[#e2e8f0] border border-slate-800 space-y-2 leading-relaxed">
                    <div className="flex items-center justify-between text-[8px] text-slate-500 border-b border-slate-800 pb-1.5">
                      <span>INSPECT_HOST_CLI: id_0{selectedNode.id}</span>
                      <span className="text-[#10b981] font-bold">TUNNEL SECURED</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500">&gt; oermos-cli link-status --node={selectedNode.id}</p>
                      <p><span className="text-indigo-400">peer_identity:</span> {selectedNode.name}</p>
                      <p><span className="text-[#38bdf8] font-bold">handshake_vector:</span> SHA256_{selectedNode.ip.replace(/\./g, '')}</p>
                      <div className="p-2 py-1.5 rounded bg-slate-905 border border-slate-800 text-[9px] text-[#34d399] leading-relaxed break-all font-semibold">
                        {selectedEmail ? `Decrypted SMTP Mail: "${selectedEmail.subject}" in local memory buffers.` : selectedNode.lastMessage}
                      </div>
                    </div>
                  </div>

                  {/* Local Security Shield Notice */}
                  <div className="bg-slate-100 border border-slate-200/60 p-3.5 rounded-xl flex gap-2.5 items-start">
                    <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      <strong>{tVal.securityHeader}</strong> {tVal.securityDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
