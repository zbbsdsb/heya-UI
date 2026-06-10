import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Layers, 
  Cpu, 
  Sparkles, 
  Activity, 
  Shield, 
  Globe, 
  RefreshCw, 
  Copy, 
  Terminal, 
  Check, 
  Lightbulb, 
  FileText, 
  Bookmark, 
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  User,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NodeData, ChecklistItem, NodeType } from '../types';

interface ProjectSpaceProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  language?: 'en' | 'zh';
}

export default function ProjectSpace({ 
  nodes, 
  setNodes, 
  language = 'en' 
}: ProjectSpaceProps) {
  const isEn = language === 'en';
  
  // Dashboard Interactive States
  const [activeCategory, setActiveCategory] = useState<NodeType | 'all'>('all');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeType, setNewNodeType] = useState<NodeType>('todo');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // Oermos Packet Terminal simulator states
  const [diagnosticLogs, setDiagnosticLogs] = useState<{ id: string; msg: string; time: string; type: 'sync' | 'peer' | 'system' }[]>([
    { id: '1', msg: 'WebRTC P2P mesh cluster synced: [Zurich.Master.0]', time: '23:14:02', type: 'peer' },
    { id: '2', msg: 'Fowler-No-Vo FNV-1a cryptographic parity aligns.', time: '23:14:03', type: 'sync' },
    { id: '3', msg: 'Hearth background spatial coordinates calibrated.', time: '23:15:10', type: 'system' }
  ]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activePeerCount, setActivePeerCount] = useState(48);

  // Time Aware User Greeting
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(isEn ? 'Good morning' : '上午好');
    } else if (hour < 18) {
      setGreeting(isEn ? 'Good afternoon' : '下午好');
    } else {
      setGreeting(isEn ? 'Good evening' : '晚上好');
    }
  }, [isEn]);

  // Periodic visual tick: alternate latency slightly to show live simulation
  const [simulatedLatency, setSimulatedLatency] = useState(8);
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLatency(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 3 ? 3 : next > 14 ? 14 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- DETERMINISTIC CRYPTOGRAPHIC DOMAIN HASH GENERATION ---
  // (Identical algorithm to FieldMapCanvas to achieve total state integration)
  const getDomainHash = (bId: string, nodeType: string) => {
    const domainNodes = nodes.filter(n => n.type === nodeType);
    if (domainNodes.length === 0) {
      return `oermos://swarm-${bId.slice(0, 3).toLowerCase()}-f83e2910`;
    }
    const sortedAttrStr = domainNodes
      .map(n => `${n.id}:${n.version || 1}:${Math.round(n.x)},${Math.round(n.y)}:${n.progress}:${n.title}`)
      .sort()
      .join('|');
    
    let hash = 0x811c9dc5;
    for (let i = 0; i < sortedAttrStr.length; i++) {
      hash ^= sortedAttrStr.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
    return `oermos://swarm-${bId.slice(0, 3).toLowerCase()}-${hashHex}`;
  };

  // Static domains matching FieldMap boundaries
  const boundaryCatalogs = [
    { id: 'core', name: isEn ? 'Core Planning' : '瑞士规划核心', nodeType: 'project', color: 'text-indigo-500 bg-indigo-50' },
    { id: 'opportunity', name: isEn ? 'Opportunity Slices' : '突触商机池', nodeType: 'muse', color: 'text-purple-500 bg-purple-50' },
    { id: 'execution', name: isEn ? 'Execution Engine' : '任务落地极', nodeType: 'todo', color: 'text-emerald-500 bg-emerald-50' },
    { id: 'future', name: isEn ? 'Future Horizon' : '瑞士演进前瞻', nodeType: 'agent', color: 'text-teal-500 bg-teal-50' },
    { id: 'assets', name: isEn ? 'Central Shared Assets' : '资产知识枢纽', nodeType: 'resource', color: 'text-amber-500 bg-amber-50' }
  ];

  // Actions
  const handleAddNewNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeTitle.trim()) return;

    // Place randomly close to the center coordinates on fieldmap
    const newId = `${newNodeType}-${Date.now()}`;
    const newMapNode: NodeData = {
      id: newId,
      type: newNodeType,
      title: newNodeTitle.trim(),
      description: '',
      x: 350 + (Math.random() - 0.5) * 160,
      y: 350 + (Math.random() - 0.5) * 160,
      progress: 0,
      members: [],
      checklist: [],
      tags: ['Local', 'UserCreated'],
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };

    setNodes(prev => [...prev, newMapNode]);
    setNewNodeTitle('');
    
    // Dispatch chime audio & local toast
    (window as any).playTactileChime?.('click');
    window.dispatchEvent(new CustomEvent('heya-toast', { 
      detail: { message: isEn ? `Node "${newNodeTitle}" successfully deployed to Field Map!` : `新节点 "${newNodeTitle}" 已成功投放至地图拓扑！` } 
    }));

    // Append log
    setDiagnosticLogs(prev => [
      {
        id: Date.now().toString(),
        msg: `SYSTEM: Client node [${newMapNode.id.toUpperCase()}] spawned physically. Realizing topology boundaries.`,
        time: new Date().toLocaleTimeString(),
        type: 'system'
      },
      ...prev
    ]);
  };

  const handleUpdateNodeTitle = (id: string) => {
    if (!editingTitle.trim()) return;
    setNodes(prev => prev.map(n => n.id === id ? { ...n, title: editingTitle.trim(), version: (n.version || 1) + 1 } : n));
    setEditingNodeId(null);
    setEditingTitle('');
    (window as any).playTactileChime?.('click');
    
    setDiagnosticLogs(prev => [
      {
        id: Date.now().toString(),
        msg: `SYNC: Master version updated for node ${id} to v${(nodes.find(n => n.id === id)?.version || 1) + 1}. FNV-1a re-hashed.`,
        time: new Date().toLocaleTimeString(),
        type: 'sync'
      },
      ...prev
    ]);
  };

  const handleDeleteNode = (id: string, name: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    (window as any).playTactileChime?.('click');
    window.dispatchEvent(new CustomEvent('heya-toast', { 
      detail: { message: isEn ? `Successfully pruned node: ${name}` : `已裁剪剥离节点: ${name}` } 
    }));

    setDiagnosticLogs(prev => [
      {
        id: Date.now().toString(),
        msg: `SYSTEM: Severed and pruned component [${id.toUpperCase()}]. Disengaging P2P links.`,
        time: new Date().toLocaleTimeString(),
        type: 'system'
      },
      ...prev
    ]);
  };

  const handleTriggerGossipSweep = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    (window as any).playTactileChime?.('click');
    
    setDiagnosticLogs(prev => [
      {
        id: `audit-${Date.now()}-1`,
        msg: '📡 Swarm Gossip state sweep initiated. Synchronizing 5 global slices...',
        time: new Date().toLocaleTimeString(),
        type: 'sync'
      },
      ...prev
    ]);

    setTimeout(() => {
      setIsAuditing(false);
      setActivePeerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      (window as any).playTactileChime?.('success');
      
      setDiagnosticLogs(prev => [
        {
          id: `audit-${Date.now()}-2`,
          msg: `✓ Swarm healthy. All Swiss subfield hashes align perfectly. Latency: ${simulatedLatency}ms.`,
          time: new Date().toLocaleTimeString(),
          type: 'sync'
        },
        ...prev
      ]);

      window.dispatchEvent(new CustomEvent('heya-toast', { 
        detail: { message: isEn ? 'Local Swiss consensus audit complete! 100% telemetry alignment.' : '本地去中心共识审计完成！100%全息对齐。' } 
      }));
    }, 1200);
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    (window as any).playTactileChime?.('click');
    window.dispatchEvent(new CustomEvent('heya-toast', { 
      detail: { message: isEn ? 'Unified domain address copied!' : '物理域全球统一地址已复制！' } 
    }));
  };

  // Node metrics calculation
  const projectNodes = nodes.filter(n => n.type === 'project');
  const agentNodes = nodes.filter(n => n.type === 'agent');
  const museNodes = nodes.filter(n => n.type === 'muse');
  const totalCompleted = nodes.filter(n => n.progress === 100).length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafbfc] p-6 lg:p-8 font-sans transition-colors duration-300">
      
      {/* 1. Header welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-600 px-2 py-0.5 rounded-full font-mono font-bold tracking-widest uppercase">
              OERMOS CORE PLATFORM
            </span>
            <span className="flex items-center gap-1 text-[10.5px] text-emerald-600 font-bold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SWISS_P2P_MESH_OK
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>{greeting}, ceaserzhao!</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed max-w-xl">
            {isEn 
              ? "This is your multi-dimensional project workspace. Any structural tweaks you publish here calibrate the Field Map canvas, sync core metrics, and update decentralized consensus addresses instantly." 
              : "这是您的多维分布式主权控制台。在此修改的任何微架构都将立即同步至 Field Map 节点星盘，并自动为您重新校验去中心共识。"}
          </p>
        </div>

        {/* Global Gossip Audit Button */}
        <button
          onClick={handleTriggerGossipSweep}
          disabled={isAuditing}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-sans shadow-md border hover:shadow transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer ${
            isAuditing 
              ? 'bg-slate-50 border-slate-200 text-slate-400 animate-pulse' 
              : 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-200 hover:text-indigo-600'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isEn ? 'Consensus Audit Flow' : '共识自校验审计'}</span>
        </button>
      </div>

      {/* 2. Hero Interactive Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Core Node Count */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
              {isEn ? 'Sovereign Slices' : '主权物理分片'}
            </span>
            <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{nodes.length}</span>
            <span className="text-[9px] font-mono text-emerald-600 font-extrabold">Active</span>
          </div>
          <div className="text-[9.5px] text-slate-400 font-medium font-mono mt-1.5 border-t border-slate-50 pt-1 flex justify-between">
            <span>{projectNodes.length} Projects</span>
            <span>{agentNodes.length} Agents</span>
          </div>
        </div>

        {/* WebRTC Handshake Peers */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
              {isEn ? 'Active P2P Swarm' : 'WebRTC 对等节点数'}
            </span>
            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight">{activePeerCount}</span>
            <span className="text-[9px] font-mono text-slate-500 font-extrabold">Swiss.Master</span>
          </div>
          <div className="text-[9.5px] text-slate-400 font-medium font-mono mt-1.5 border-t border-slate-50 pt-1 flex justify-between">
            <span>Lag ~{simulatedLatency}ms</span>
            <span>Est. Stability: 99.8%</span>
          </div>
        </div>

        {/* Progress Rate */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-purple-100 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
              {isEn ? 'Task Verification' : '交付自验证比率'}
            </span>
            <div className="p-1 rounded-lg bg-purple-50 text-purple-600">
              <Plus className="w-4 h-4 text-purple-500 rotate-45" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 tracking-tight">
              {nodes.length > 0 ? Math.round((totalCompleted / nodes.length) * 100) : 0}%
            </span>
            <span className="text-[9px] font-mono text-purple-600 font-extrabold">Processed</span>
          </div>
          <div className="text-[9.5px] text-slate-400 font-medium font-mono mt-1.5 border-t border-slate-50 pt-1 flex justify-between">
            <span>{totalCompleted} Completed</span>
            <span>{nodes.length - totalCompleted} Pending</span>
          </div>
        </div>

        {/* Dynamic Hash Signature */}
        <div className="bg-white border border-[#eef2f6] rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-100 transition-colors">
          <div className="flex justify-between items-start">
            <span className="text-[9.5px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
              {isEn ? 'Global Consensus' : '全球共识验证状态'}
            </span>
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <Shield className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-850 tracking-tight font-mono select-all">
              {nodes.length > 0 ? `SWARM_${getDomainHash('master', 'project').split('-').pop()}` : 'SECURE_IDLE'}
            </span>
          </div>
          <div className="text-[9.5px] text-slate-400 font-medium font-mono mt-2.5 border-t border-slate-50 pt-1 flex justify-between">
            <span>Zurich TLS 1.3</span>
            <span className="text-amber-600 font-bold">100% Matching</span>
          </div>
        </div>
      </div>

      {/* 3. Redesigned Workspace Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SWISS NODE MANAGER REGISTRY (Spans 7 columns) */}
        <div className="lg:col-span-7 bg-white border border-[#eef2f6] rounded-3xl p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {isEn ? 'Physical Components Registry' : '物理节点网格编目'}
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {isEn ? 'Create, delete and configure physical nodes instantly.' : '管理与定义您的去中心物理节点星盘。'}
              </p>
            </div>

            {/* Category selection pill sliders */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              {(['all', 'project', 'todo', 'agent', 'muse', 'resource'] as const).map(cat => {
                const label = cat === 'all' ? (isEn ? 'All' : '全部')
                            : cat === 'project' ? (isEn ? 'Proj' : '项目')
                            : cat === 'todo' ? (isEn ? 'Todo' : '任务')
                            : cat === 'agent' ? (isEn ? 'Agent' : '代理')
                            : cat === 'muse' ? (isEn ? 'Muse' : '灵思')
                            : (isEn ? 'Res' : '资产');
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      (window as any).playTactileChime?.('click');
                    }}
                    className={`px-2 py-0.8 rounded-lg text-[10px] font-mono font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Node Quick Launcher Box */}
          <form onSubmit={handleAddNewNode} className="bg-slate-50/50 p-4 border border-slate-200/50 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1 flex gap-2">
              <select
                value={newNodeType}
                onChange={(e) => {
                  setNewNodeType(e.target.value as NodeType);
                  (window as any).playTactileChime?.('click');
                }}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="project">📁 GRID PROJ</option>
                <option value="todo">✓ TASKS NODE</option>
                <option value="agent">🤖 HEURISTIC AGT</option>
                <option value="muse">💡 MIND SPORE</option>
                <option value="resource">📄 DOC VAULT</option>
              </select>

              <input
                type="text"
                value={newNodeTitle}
                onChange={(e) => setNewNodeTitle(e.target.value)}
                placeholder={isEn ? "E.G. Zurich WebRTC buffer pool..." : "输入新节点标题，例如 Zurich 传输阻抗器"}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={!newNodeTitle.trim()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                newNodeTitle.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Deploy' : '投放部署'}</span>
            </button>
          </form>

          {/* List Of Filtered Nodes */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {nodes.filter(n => activeCategory === 'all' || n.type === activeCategory).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium font-mono">
                {isEn ? 'No matching nodes registered in this category.' : '该类别下暂未注册任何物理节点。'}
              </div>
            ) : (
              nodes
                .filter(n => activeCategory === 'all' || n.type === activeCategory)
                .map(node => {
                  const isEditing = editingNodeId === node.id;
                  
                  // Compute micro custom hashing sign for node
                  const nodeHashStr = `${node.id}:${node.version || 1}`;
                  let innerNodeHash = 0;
                  for (let i = 0; i < nodeHashStr.length; i++) {
                    innerNodeHash += nodeHashStr.charCodeAt(i);
                  }
                  const briefHash = `0x${Math.abs(innerNodeHash * 179).toString(16).slice(0, 4).toUpperCase()}`;

                  return (
                    <div 
                      key={node.id} 
                      className="group border border-slate-150 hover:border-slate-200 hover:shadow-xs transition-all bg-white p-3.5 rounded-2xl flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Custom visual emblem */}
                        <div className={`p-2 rounded-xl shrink-0 ${
                          node.type === 'project' ? 'bg-indigo-50 text-indigo-500'
                          : node.type === 'agent' ? 'bg-teal-50 text-teal-600'
                          : node.type === 'muse' ? 'bg-purple-50 text-purple-600'
                          : node.type === 'resource' ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {node.type === 'project' ? <Database className="w-3.5 h-3.5" />
                          : node.type === 'agent' ? <Cpu className="w-3.5 h-3.5" />
                          : node.type === 'muse' ? <Lightbulb className="w-3.5 h-3.5" />
                          : node.type === 'resource' ? <FileText className="w-3.5 h-3.5" />
                          : <Check className="w-3.5 h-3.5" />}
                        </div>

                        {/* Title text */}
                        <div className="min-w-0">
                          {isEditing ? (
                            <div className="flex gap-1.5 items-center">
                              <input 
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateNodeTitle(node.id)}
                                className="bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-bold focus:outline-none"
                              />
                              <button 
                                onClick={() => handleUpdateNodeTitle(node.id)}
                                className="p-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-150 text-[10px] font-bold"
                              >
                                {isEn ? 'Save' : '保存'}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span 
                                onClick={() => {
                                  setEditingNodeId(node.id);
                                  setEditingTitle(node.title);
                                }}
                                title={isEn ? "Double click/Click to edit" : "点击编辑"}
                                className="text-xs font-extrabold text-slate-700 tracking-tight truncate max-w-[190px] cursor-pointer hover:text-indigo-600 hover:underline"
                              >
                                {node.title}
                              </span>
                              <span className="text-[7.5px] font-mono text-slate-400 font-bold tracking-tight bg-slate-100 px-1 rounded">
                                v{node.version || 1}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8.5px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                              COORD: {Math.round(node.x)}, {Math.round(node.y)}
                            </span>
                            <span className="text-slate-200">•</span>
                            <span className="text-[8.5px] font-mono text-indigo-500 font-bold">
                              {briefHash}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Slider of Progress inside node */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex flex-col items-end gap-1 font-mono text-[9px]">
                          <span className="text-slate-400 font-bold">
                            {isEn ? 'PROGRESS' : '进度'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="range"
                              min="0"
                              max="100"
                              step="20"
                              value={node.progress || 0}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setNodes(prev => prev.map(n => n.id === node.id ? { ...n, progress: val } : n));
                              }}
                              className="w-12 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer focus:outline-none accent-indigo-600"
                            />
                            <span className={`font-black ${node.progress === 100 ? 'text-emerald-500' : 'text-slate-650'}`}>
                              {node.progress || 0}%
                            </span>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteNode(node.id, node.title)}
                          title={isEn ? "Severe Node Connections" : "裁剪此节点连接"}
                          className="p-1 px-1.5 text-slate-350 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 active:scale-95 transition-all text-xs cursor-pointer inline-flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: OERMOS GLOBAL CONSENSUS EXPONENT + LIVE STREAM (Spans 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* A. Unified Oermos Domain Consensus Ledger */}
          <div className="bg-white border border-[#eef2f6] rounded-3xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono">
                {isEn ? 'Oermos Swarm Boundaries Address' : 'Oermos 去中心共识域视图'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">
                {isEn ? 'These values dynamically re-calculate as map nodes adjust.' : '全球统一共识哈希地址，在地图节点发生偏移或添加删除时自动洗牌。'}
              </p>
            </div>

            <div className="space-y-3">
              {boundaryCatalogs.map(b => {
                const domainHash = getDomainHash(b.id, b.nodeType);
                const shortHash = domainHash.split('-').pop() || 'f83e2910';
                const hasInvolvedNodes = nodes.filter(n => n.type === b.nodeType).length;

                return (
                  <div key={b.id} className="border border-slate-100 bg-slate-50/50 p-2.5 rounded-2xl flex flex-col gap-1.5 transition-all hover:bg-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                      <span className="font-extrabold text-slate-700">{b.name}</span>
                      <span className={`text-[8.5px] font-black px-1.5 rounded font-mono ${hasInvolvedNodes ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
                        {hasInvolvedNodes ? `${hasInvolvedNodes} Nodes` : 'STAGNANT'}
                      </span>
                    </div>

                    <div className="bg-white/90 border border-slate-150 rounded-xl px-2 py-1.5 text-[8.5px] font-mono text-slate-600 flex items-center justify-between select-all group">
                      <span className="truncate mr-3 tracking-tight font-semibold">{domainHash}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyHashToClipboard(domainHash)}
                          className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer rounded hover:bg-slate-100 transition-colors"
                          title="Copy Address"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Live WebRTC Packet Diagnostics Output Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-[10px] font-mono shadow-xl text-white/95 space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none select-none">
              <Terminal className="w-24 h-24" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  HEARTH COLD_LINK PORT // TERMINAL
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDiagnosticLogs([]);
                  (window as any).playTactileChime?.('click');
                }}
                className="text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-0.5 rounded transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[8px] text-slate-400 leading-relaxed max-h-[160px] overflow-y-auto pr-1 relative z-10 select-text">
              {diagnosticLogs.length === 0 ? (
                <div className="text-slate-600 italic py-6 text-center select-none">
                  Console buffering empty. Dispatch some node edits to trigger activity stream...
                </div>
              ) : (
                diagnosticLogs.map(log => {
                  let badge = 'text-indigo-400';
                  if (log.type === 'peer') badge = 'text-emerald-400';
                  else if (log.type === 'system') badge = 'text-slate-500';
                  return (
                    <div key={log.id} className="border-b border-slate-850/30 pb-1 last:border-none">
                      <div className="flex justify-between text-[7px] text-slate-600 font-semibold mb-0.5 select-none">
                        <span>OERMOS_PROPAGATION_PROTOCOL</span>
                        <span>{log.time}</span>
                      </div>
                      <div className="break-all font-semibold">
                        <span className={`mr-1 font-black ${badge}`}>[{log.type.toUpperCase()}]</span> 
                        <span className="text-slate-350">{log.msg}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
