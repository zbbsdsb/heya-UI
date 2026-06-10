/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Compass, 
  Target, 
  Clock, 
  Cpu, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  UserPlus, 
  Star, 
  Activity, 
  Link2, 
  Layers, 
  RefreshCw, 
  Eye, 
  Shield, 
  Terminal, 
  X, 
  CheckSquare, 
  SlidersHorizontal,
  ChevronRight,
  Code
} from 'lucide-react';
import { NodeData, NodeType, ChecklistItem } from '../types';

interface HearthComponentRegistryProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  language?: 'en' | 'zh';
  selectedIdFromMain?: string;
  onNavigateToNode?: (nodeId: string) => void;
}

const localT = {
  en: {
    title: "Hearth Topology Component Registry",
    desc: "A cybernetic operational workbench. Interact with live-rendered widgets representing your nodes, wiring relations & shifting coordinates directly on a spatial digital-blueprint layout.",
    gridMapTitle: "Digital-Blueprint Spatial Coordinates Matrix",
    gridMapDesc: "Select coordinates, shift positions using arrows, and wire topological paths.",
    widgetTitle: "Operational-Component Simulator Frame",
    widgetDesc: "Interact with the real, live-simulated functional applet corresponding to your node status.",
    nodeType: "Node Class",
    coordinates: "Blueprint Spatial Coordinates",
    addNode: "Register New Matrix Node",
    deleteNode: "Unregister Component",
    connectTo: "Establish Vector Link Path",
    connectedLinks: "Active Handshake Connections",
    logicalOperator: "Logical Ingress Gate",
    members: "Assigned Task Members",
    tags: "Component Tags",
    hashBtn: "Compute Security Fingerprint",
    hashProgress: "Computing SHA-256 Registry Hash...",
    hashActive: "SHA-256 Secure Fingerprint",
    agentLogs: "Agent Cognitive Log Shell",
    agentRun: "Trigger Memory Scan Probe",
    milestones: "Milestone Execution Checks",
    addMilestone: "Add Milestone",
    milestonePlaceholder: "e.g., Deliver WebRTC handshake module proof",
    progressSlider: "Pipeline Execution Completeness",
    divergenceCoef: "Cognitive Rebellion Factor",
    quickPrompt: "Sandbox Fleeting Draft Prompt",
    castSpark: "Spawn Idea Spark",
    noNodeSelected: "No component selected. Click any node pin on the blueprint grid to activate its live operational widget!",
    shiftUp: "Shift Node North (-15px)",
    shiftDown: "Shift Node South (+15px)",
    shiftLeft: "Shift Node West (-15px)",
    shiftRight: "Shift Node East (+15px)",
    createdText: "Component registered into local memory successfully.",
    deletedText: "Component unregistered from registry matrix."
  },
  zh: {
    title: "赫斯拓扑组件注册与真态虚拟空间",
    desc: "网络协同控制台。在左侧空间坐标图谱与右侧高保真组件运行沙盒之间实时双向绑定。在这里，每一个节点都是一个真正可与之互动的响应式应用组件。",
    gridMapTitle: "数字化空间矩阵蓝图 (交互拓扑图)",
    gridMapDesc: "直观审视节点坐标，用物理方向键盘微调相对位置，建立连线路径。",
    widgetTitle: "核心组件真实运转模拟舱 (Simulator)",
    widgetDesc: "交互模拟运行该级节点相对应的真实功能。每一次点击和进度调整均将实时更新拓扑网。 ",
    nodeType: "拓扑节点类目",
    coordinates: "空间物理坐标系定位",
    addNode: "注册全新拓扑节点",
    deleteNode: "注销此注册组件",
    connectTo: "构建空间逻辑通道连线",
    connectedLinks: "已激活的下游握手节点对",
    logicalOperator: "逻辑网关拦截算符",
    members: "已指派的工坊协作成员",
    tags: "组件特性标签",
    hashBtn: "计算物理防篡改哈希指纹码",
    hashProgress: "正在校验本地物料生成 SHA-256 注册特征值...",
    hashActive: "SHA-256 复合安全验证签名",
    agentLogs: "AGI 主权代理思考决策日志沙漏",
    agentRun: "探询代理空间特征语义区",
    milestones: "节点周期里程碑校验清单",
    addMilestone: "新增里程碑",
    milestonePlaceholder: "例如：交付 WebRTC 握手广播模块原型",
    progressSlider: "流水线执行深度 (手动微调进度分值)",
    divergenceCoef: "反常识发散偏差指数 (叛逆度系数)",
    quickPrompt: "灵感沙盒内容即刻编写",
    castSpark: "向思想池播撒灵感碎屑",
    noNodeSelected: "暂未选中组件。请点击左侧数字矩阵中的任意节点圆点，便可立刻拉进对应的真态运行面板！",
    shiftUp: "向北偏移相对空间 (-15px)",
    shiftDown: "向南偏移相对空间 (+15px)",
    shiftLeft: "向西偏移相对空间 (-15px)",
    shiftRight: "向东偏移相对空间 (+15px)",
    createdText: "新拓扑组件已注册至底层核心，矩阵自适应扩张。",
    deletedText: "注销组件成功，该节点已从所有的拓扑路径中剥落。"
  }
};

export default function HearthComponentRegistry({
  nodes,
  setNodes,
  language = 'en',
  selectedIdFromMain,
  onNavigateToNode
}: HearthComponentRegistryProps) {
  const lVal = localT[language];
  
  // Track selected node ID
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    if (selectedIdFromMain) return selectedIdFromMain;
    return nodes.length > 0 ? nodes[0].id : null;
  });

  // Sync state update when prop changes
  useEffect(() => {
    if (selectedIdFromMain) {
      setSelectedNodeId(selectedIdFromMain);
    }
  }, [selectedIdFromMain]);

  // Handle selected Node data helper
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // New Node Registration modal / states
  const [isNewNodeFormOpen, setIsNewNodeFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<NodeType>('todo');
  const [newX, setNewX] = useState(400);
  const [newY, setNewY] = useState(300);

  // Simulation interactive internal states (resets on node change)
  const [computingHash, setComputingHash] = useState(false);
  const [computedHashCode, setComputedHashCode] = useState<string | null>(null);
  
  // Agent prompt logs simulation
  const [agentTriggerCount, setAgentTriggerCount] = useState(0);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [horizonProtocol, setHorizonProtocol] = useState('Heuristic Gravity');
  
  // Muse simulator controls
  const [divergenceVal, setDivergenceVal] = useState(72);
  const [musePromptText, setMusePromptText] = useState('');

  // Interactive milestone input state
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Auto load simulated logs whenever an Agent node is selected
  useEffect(() => {
    if (selectedNode && selectedNode.type === 'agent') {
      const initLogs = [
        `[HEARTH-AGENT] Registered as sovereign system task daemon for node: [${selectedNode.id}]`,
        `[HEARTH-AGENT] Parsing target network path correlations...`,
        `[HEARTH-AGENT] Listening to local clock handshakes. Sync state: [synced]`
      ];
      setAgentLogs(initLogs);
      setComputedHashCode(null);
    } else {
      setAgentLogs([]);
      setComputedHashCode(null);
    }
  }, [selectedNodeId, selectedNode?.id]);

  // Trigger agent memory simulation
  const handleAgentScan = () => {
    if (!selectedNode) return;
    (window as any).playTactileChime?.('click');
    setAgentTriggerCount(prev => prev + 1);
    
    const thoughts = [
      `[CRITICAL CORRELATION] Analyzed Node connections to downstreams: ${selectedNode.connections.join(' & ') || 'none'}`,
      `[ANOMALY SCAN] Checked memory clusters for associated context files... 98%-confidence of zero-friction performance.`,
      `[DAEMON RESPOND] Tone set to rebellious. Evaluating against Swiss Typography directives.`
    ];
    
    setAgentLogs(prev => [...prev, ...thoughts]);
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' 
          ? 'Agent tactical scan completed. Logs updated.' 
          : '主权 Agent 特征扫描完成。语义关联值更新。', 
        type: 'info' 
      }
    }));
  };

  // Trigger mock hash calculations
  const calculateShaRegistry = () => {
    if (!selectedNode) return;
    (window as any).playTactileChime?.('click');
    setComputingHash(true);
    setTimeout(() => {
      const generated = 'SHA-256_' + Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      setComputedHashCode(generated);
      setComputingHash(false);
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: language === 'en' 
            ? 'Cryptographic integrity signature committed to Hearth database.' 
            : '组件物理防篡改哈希成功写入。安全性校验完成！', 
          type: 'success' 
        }
      }));
    }, 1200);
  };

  // Node registration form trigger
  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    (window as any).playTactileChime?.('click');

    const freshNode: NodeData = {
      id: `registry-node-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim() || 'No explicit system descriptor.',
      x: Math.round(newX),
      y: Math.round(newY),
      progress: 0,
      members: ['ceaserzhao'],
      checklist: [],
      tags: ['Sovereign-Registry'],
      connections: [],
      createdAt: '2026/06/10',
      updatedAt: '2026/06/10',
      status: 'active',
      syncStatus: 'synced',
      authorId: 'ceaserzhao',
      version: 1,
      star: false,
    };

    setNodes(prev => [...prev, freshNode]);
    setSelectedNodeId(freshNode.id);

    // reset fields
    setNewTitle('');
    setNewDesc('');
    setIsNewNodeFormOpen(false);

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { message: lVal.createdText, type: 'success' }
    }));
  };

  // Shifting the coordinates via direction arrow dials
  const handleShiftCoordinate = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedNode) return;
    (window as any).playTactileChime?.('click');

    const offset = 15;
    let dx = 0;
    let dy = 0;

    if (direction === 'up') dy = -offset;
    if (direction === 'down') dy = offset;
    if (direction === 'left') dx = -offset;
    if (direction === 'right') dx = offset;

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          x: Math.max(80, Math.min(1000, n.x + dx)),
          y: Math.max(80, Math.min(800, n.y + dy)),
          updatedAt: '22026/06/10'
        };
      }
      return n;
    }));
  };

  // Adding Milestone checklist items to direct interactive widget
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode || !newMilestoneText.trim()) return;
    (window as any).playTactileChime?.('click');

    const freshMilestone: ChecklistItem = {
      id: `milestone-${Date.now()}`,
      text: newMilestoneText.trim(),
      done: false
    };

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const nextChecklist = [...n.checklist, freshMilestone];
        // Auto calculate percentage
        const finishedCount = nextChecklist.filter(item => item.done).length;
        const progressVal = Math.round((finishedCount / nextChecklist.length) * 100);

        return {
          ...n,
          checklist: nextChecklist,
          progress: progressVal,
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));

    setNewMilestoneText('');
  };

  // Toggle milestone completion inside state
  const toggleMilestoneComplete = (milestoneId: string) => {
    if (!selectedNode) return;
    (window as any).playTactileChime?.('click');

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const nextChecklist = n.checklist.map(item => {
          if (item.id === milestoneId) {
            return { ...item, done: !item.done };
          }
          return item;
        });

        const finishedCount = nextChecklist.filter(item => item.done).length;
        const progressVal = Math.round((finishedCount / nextChecklist.length) * 100);

        return {
          ...n,
          checklist: nextChecklist,
          progress: progressVal,
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));
  };

  // Remove a milestone
  const deleteMilestone = (milestoneId: string) => {
    if (!selectedNode) return;
    (window as any).playTactileChime?.('click');

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const nextChecklist = n.checklist.filter(item => item.id !== milestoneId);
        const finishedCount = nextChecklist.length > 0 ? nextChecklist.filter(item => item.done).length : 0;
        const progressVal = nextChecklist.length > 0 ? Math.round((finishedCount / nextChecklist.length) * 100) : n.progress;

        return {
          ...n,
          checklist: nextChecklist,
          progress: progressVal,
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));
  };

  // Drag simulation / Slider adjustment handler for todo pipelines
  const handleProgressSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedNode) return;
    const nextVal = parseInt(e.target.value);
    
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          progress: nextVal,
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));
  };

  // Wire or sever a connection link between nodes
  const toggleNodeConnection = (targetId: string) => {
    if (!selectedNode || targetId === selectedNode.id) return;
    (window as any).playTactileChime?.('click');

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const exists = n.connections.includes(targetId);
        const nextConnections = exists 
          ? n.connections.filter(id => id !== targetId)
          : [...n.connections, targetId];
        
        return {
          ...n,
          connections: nextConnections,
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));
  };

  // Edit status, logical operators and descriptive tags
  const handleUpdateNodeStringField = (field: 'title' | 'description' | 'status' | 'logicalOperator', val: any) => {
    if (!selectedNode) return;
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          [field]: val,
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));
  };

  // Delete node from local database registry
  const handleDeleteNodeRegistry = () => {
    if (!selectedNode) return;
    if (!confirm(language === 'en' ? `Are you sure you want to completely unregister component [${selectedNode.title}]?` : `确定要将拓扑宿主组件 [${selectedNode.title}] 逻辑彻底物理注销吗？`)) return;

    (window as any).playTactileChime?.('alert');
    const deleteId = selectedNode.id;

    setNodes(prev => prev
      .filter(n => n.id !== deleteId)
      .map(n => ({
        ...n,
        connections: n.connections.filter(connId => connId !== deleteId)
      }))
    );

    // Pivot selection
    const remainingNodes = nodes.filter(n => n.id !== deleteId);
    setSelectedNodeId(remainingNodes.length > 0 ? remainingNodes[0].id : null);

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { message: lVal.deletedText, type: 'warn' }
    }));
  };

  // Trigger quick local spark sowing inside simulator
  const handleLocalMuseCast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musePromptText.trim() || !selectedNode) return;
    (window as any).playTactileChime?.('click');

    const newIdea = {
      id: `muse-${Date.now()}`,
      content: musePromptText.trim(),
      title: `${selectedNode.title} Spark`,
      createdAt: language === 'en' ? 'Sown via Matrix' : '来自蓝图矩阵',
      category: 'Divergence Sandbox',
      suggestedConnections: [selectedNode.id]
    };

    // Dispatch update or emit standard registry response
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Fleet spark sown successfully. Go to Muse tab to checkout.' : '灵感火羽已撒在沙盒中！随时可在 Muse 栏触发生长。', 
        type: 'success' 
      }
    }));

    setMusePromptText('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] p-10 space-y-8 animate-in fade-in-20 duration-300">
      
      {/* 1. Header Display Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-200">
              <Code className="w-5 h-5 text-indigo-500 fill-indigo-200/30" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
                {lVal.title}
              </h2>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5 max-w-xl leading-relaxed">
                {lVal.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Action Header controls */}
        <button 
          onClick={() => {
            (window as any).playTactileChime?.('click');
            setIsNewNodeFormOpen(!isNewNodeFormOpen);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{lVal.addNode}</span>
        </button>
      </div>

      {/* New Node Pop-up Drawer (Blueprint Style) */}
      {isNewNodeFormOpen && (
        <form onSubmit={handleRegisterNode} className="p-6 bg-white border-2 border-dashed border-indigo-200 rounded-2xl space-y-4 max-w-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <Grid className="w-4 h-4 animate-spin" />
              <span>{lVal.addNode}</span>
            </h4>
            <button 
              type="button" 
              onClick={() => setIsNewNodeFormOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Component Technical Title</span>
              <input 
                type="text" 
                placeholder="e.g., Gossip Protocol Tunnel" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-501 rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{lVal.nodeType}</span>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value as NodeType)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
              >
                <option value="project">Project Target Suite (Cluster Planning)</option>
                <option value="todo">Execution Pipeline Vector (Checked Milestones)</option>
                <option value="agent">Autonomous Strategy Controller (AI Logs Daemon)</option>
                <option value="muse font-bold">Inspiration Deck (Divergent Sparks Sandbox)</option>
                <option value="resource">Registry Base Network Asset (Static Code Modules)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Component Registry Functional Description</span>
            <textarea 
              rows={2} 
              placeholder="Describe core duties and parameters embedded in this topological component..." 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-501 font-semibold leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Coordinates Grid X (80 - 1000)</span>
              <input 
                type="number" 
                min={80} 
                max={1000} 
                value={newX}
                onChange={(e) => setNewX(parseInt(e.target.value) || 400)}
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-250 rounded-xl font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Coordinates Grid Y (80 - 800)</span>
              <input 
                type="number" 
                min={80} 
                max={800} 
                value={newY}
                onChange={(e) => setNewY(parseInt(e.target.value) || 300)}
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-250 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button 
              type="button" 
              onClick={() => setIsNewNodeFormOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-sm"
            >
              Register Component Matrix
            </button>
          </div>
        </form>
      )}

      {/* 2. Double-Hand Workspace Matrix Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT 5 COLS: INTERACTIVE BLUEPRINT MAP ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute left-6 bottom-6 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div>
                <h3 className="text-xs font-black text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>{lVal.gridMapTitle}</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 max-w-sm">
                  {lVal.gridMapDesc}
                </p>
              </div>

              {/* Blueprint Interactive Vector Canvas Board */}
              <div className="w-full h-[320px] bg-[#020205] border border-indigo-950/80 rounded-2xl relative overflow-hidden flex items-center justify-center">
                {/* Simulated coordinate background dots */}
                <div className="absolute inset-0 select-none pointer-events-none opacity-[0.06]" style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />

                {/* Simulated center coordinate rule tags */}
                <div className="absolute left-3 top-3 font-mono text-[8px] text-slate-600 leading-none">
                  SOVEREIGN RANGING: 1000 x 800 GRID
                </div>

                {/* Vector SVG path calculations */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {nodes.map((n) => {
                    // Map nodes internal x,y coordinates into simulated canvas matrix proportions
                    // Canvas scale maps width mapping: x / 1000 -> canvas px, height: y / 800 -> canvas px
                    const scaledX1 = (n.x / 1000) * 100 + '%';
                    const scaledY1 = (n.y / 800) * 100 + '%';

                    return n.connections.map((targetId) => {
                      const tNode = nodes.find(target => target.id === targetId);
                      if (!tNode) return null;
                      const scaledX2 = (tNode.x / 1000) * 100 + '%';
                      const scaledY2 = (tNode.y / 800) * 100 + '%';

                      const isHighlighted = selectedNodeId === n.id || selectedNodeId === tNode.id;

                      return (
                        <line 
                          key={`${n.id}-${targetId}`}
                          x1={scaledX1}
                          y1={scaledY1}
                          x2={scaledX2}
                          y2={scaledY2}
                          stroke={isHighlighted ? '#f59e0b' : '#334155'}
                          strokeWidth={isHighlighted ? 1.5 : 0.75}
                          strokeDasharray={isHighlighted ? "4 2" : "none"}
                          className="transition-all duration-300"
                        />
                      );
                    });
                  })}
                </svg>

                {/* Nodes rendering as selectable coordinate pins */}
                {nodes.map((n) => {
                  const percentX = (n.x / 1000) * 100;
                  const percentY = (n.y / 800) * 100;
                  const isSelected = selectedNodeId === n.id;

                  const typeColor = 
                    n.type === 'project' ? 'bg-[#4f46e5]/90 ring-[#4f46e5]/40' 
                    : n.type === 'todo' ? 'bg-[#10b981]/90 ring-[#10b981]/40'
                    : n.type === 'agent' ? 'bg-[#8b5cf6]/90 ring-[#8b5cf6]/40'
                    : n.type === 'muse' ? 'bg-[#ec4899]/90 ring-[#ec4899]/40'
                    : 'bg-[#f59e0b]/90 ring-[#f59e0b]/40';

                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        (window as any).playTactileChime?.('click');
                        setSelectedNodeId(n.id);
                      }}
                      className="absolute translate-x-[-50%] translate-y-[-50%] transition-all duration-300 group z-20 cursor-pointer"
                      style={{ left: `${percentX}%`, top: `${percentY}%` }}
                      title={`${n.title} (X: ${n.x}, Y: ${n.y})`}
                    >
                      <span className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full ${typeColor} ring-4 transition-all duration-300 hover:scale-135 leading-none shadow-md ${
                        isSelected ? 'ring-amber-500/80 scale-125' : ''
                      }`}>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute" />
                        )}
                      </span>

                      {/* Floating dynamic tag hover overlays */}
                      <span className="pointer-events-none absolute left-5 top-0 transform -translate-y-1/2 bg-slate-950 border border-slate-800 text-[8.5px] font-black text-slate-300 rounded px-1.5 py-0.5 tracking-tight font-mono opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {n.title} ({n.x},{n.y})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Coordinates Control & Direction Arrow Console */}
              {selectedNode && (
                <div className="bg-[#121320] border border-slate-900/60 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-950/50">
                    <div className="font-mono text-[10px] text-indigo-400 font-extrabold uppercase">
                      ⚓ Anchor Location Telemetry
                    </div>
                    <span className="px-2 py-0.5 bg-slate-900 text-indigo-300 rounded font-mono text-[9px] font-bold">
                      X: {selectedNode.x}px | Y: {selectedNode.y}px
                    </span>
                  </div>

                  {/* High fidelity arrows panel pad (Tactile shift mechanics) */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    
                    {/* Console arrows container on left */}
                    <div className="col-span-6 flex justify-center py-2 relative">
                      <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-slate-800/80 p-0.5 relative flex items-center justify-center">
                        <button 
                          onClick={() => handleShiftCoordinate('up')}
                          className="absolute top-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90"
                          title={lVal.shiftUp}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleShiftCoordinate('down')}
                          className="absolute bottom-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90"
                          title={lVal.shiftDown}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleShiftCoordinate('left')}
                          className="absolute left-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90"
                          title={lVal.shiftLeft}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleShiftCoordinate('right')}
                          className="absolute right-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90"
                          title={lVal.shiftRight}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        
                        <div className="w-6 h-6 rounded-full bg-[#080914] border border-slate-800 shadow shadow-inner" />
                      </div>
                    </div>

                    {/* Quick navigation and jump handles on right */}
                    <div className="col-span-6 space-y-2">
                      <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                        Global Teleport Control
                      </span>
                      <button
                        onClick={() => {
                          (window as any).playTactileChime?.('success');
                          if (onNavigateToNode) {
                            onNavigateToNode(selectedNode.id);
                          }
                        }}
                        className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/40 border-2 border-indigo-500/20 text-indigo-300 font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Locate on Field Map</span>
                      </button>

                      <button
                        onClick={handleDeleteNodeRegistry}
                        className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-rose-400/90 font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Unregister Component</span>
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* Connections wire mapper list */}
              {selectedNode && (
                <div className="bg-[#121320] border border-slate-900/60 rounded-2xl p-5 space-y-3">
                  <div className="font-mono text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lVal.connectTo}</span>
                  </div>

                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-2 custom-scroll">
                    {nodes.filter(n => n.id !== selectedNode.id).map((on) => {
                      const isConnected = selectedNode.connections.includes(on.id);
                      return (
                        <button
                          key={on.id}
                          onClick={() => toggleNodeConnection(on.id)}
                          className={`w-full p-2 rounded-xl text-left font-semibold text-[11px] font-mono border transition-all flex items-center justify-between ${
                            isConnected 
                              ? 'bg-slate-900 border-indigo-600/80 text-amber-300' 
                              : 'bg-slate-950/80 border-slate-900 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <span className="truncate">📍 {on.title}</span>
                          <span className="text-[9px] font-bold">
                            {isConnected ? '✓ Connected' : '+ Wire Link'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ================= RIGHT 7 COLS: COMPONENT ACTION SIMULATOR ================= */}
        <div className="lg:col-span-7">
          {selectedNode ? (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-7 shadow-sm space-y-6 relative overflow-hidden">
              
              {/* Telemetry Indicator ribbons */}
              <div className="absolute top-0 left-8 transform -translate-y-1/2 flex items-center gap-2">
                <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-md shadow-sm">
                  {lVal.widgetTitle}
                </span>
                
                <span className="px-3.5 py-1 text-[9px] font-black font-mono uppercase tracking-widest bg-amber-500 text-white rounded-md shadow-sm">
                  ACTIVE MATRIX ID: {selectedNode.id}
                </span>
              </div>

              {/* Node standard structural fields editor panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3">
                <div className="md:col-span-6 space-y-1">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Component Active Host Label</span>
                  <input 
                    type="text" 
                    value={selectedNode.title}
                    onChange={(e) => handleUpdateNodeStringField('title', e.target.value)}
                    className="w-full text-sm font-black text-[#0f172a] px-3.5 py-2 border border-slate-200 focus:border-indigo-505 focus:outline-none rounded-xl"
                  />
                </div>

                <div className="md:col-span-3 space-y-1">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Runtime Status</span>
                  <select
                    value={selectedNode.status || 'active'}
                    onChange={(e) => handleUpdateNodeStringField('status', e.target.value)}
                    className="w-full text-xs font-bold px-2 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="draft">📁 Draft Component</option>
                    <option value="active">🟢 Active Matrix</option>
                    <option value="completed">🏆 Finished Module</option>
                    <option value="archived">📦 Compressed Archive</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Logical Ingress Gate</span>
                  <select
                    value={selectedNode.logicalOperator || 'AND'}
                    onChange={(e) => handleUpdateNodeStringField('logicalOperator', e.target.value)}
                    className="w-full text-xs font-bold px-2 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="AND">AND GATE</option>
                    <option value="OR">OR GATE</option>
                    <option value="NOT">NOT GATE</option>
                    <option value="XOR">XOR GATE</option>
                    <option value="INPUT">RAW SEED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Functional Capabilities Decriptor</span>
                <textarea 
                  rows={2}
                  value={selectedNode.description}
                  onChange={(e) => handleUpdateNodeStringField('description', e.target.value)}
                  className="w-full text-xs font-medium leading-relaxed px-3.5 py-2 border border-slate-200 focus:border-indigo-505 focus:outline-none rounded-xl"
                />
              </div>

              {/* ================= TYPE-SPECIFIC ACTIVE LIVE APPLET SIMULATORS ================= */}
              
              {/* CASE A: project typology */}
              {selectedNode.type === 'project' && (
                <div className="p-6 bg-slate-50/75 border border-slate-200/60 rounded-2xl space-y-5 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h5 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 font-mono">
                      <Target className="w-4 h-4 text-indigo-500 fill-indigo-500/20 animate-pulse" />
                      <span>{lVal.milestones}</span>
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Module Complete: {selectedNode.progress}%
                    </span>
                  </div>

                  {/* Milestones checklists map */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {selectedNode.checklist.length === 0 ? (
                      <p className="text-[10.5px] text-slate-400 font-bold py-4 text-center border border-dashed rounded-xl">
                        Zero check milestones assigned. Fill in the field below to spawn downstreams.
                      </p>
                    ) : (
                      selectedNode.checklist.map((item) => (
                        <div key={item.id} className="p-2.5 bg-white border rounded-xl flex items-center justify-between shadow-sm">
                          <button
                            onClick={() => toggleMilestoneComplete(item.id)}
                            className="flex items-center gap-2.5 text-left text-xs font-bold text-slate-700 select-none cursor-pointer"
                          >
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              item.done 
                                ? 'bg-indigo-600 border-indigo-700 text-white' 
                                : 'border-slate-300 hover:border-indigo-500'
                            }`}>
                              {item.done && <span className="text-[9px] font-black">✓</span>}
                            </span>
                            <span className={item.done ? 'line-through text-slate-400' : ''}>
                              {item.text}
                            </span>
                          </button>

                          <button 
                            onClick={() => deleteMilestone(item.id)}
                            className="p-1 hover:bg-rose-50 text-slate-350 hover:text-red-500 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add checkpoint inline */}
                  <form onSubmit={handleAddMilestone} className="flex gap-2.5">
                    <input 
                      type="text" 
                      placeholder={lVal.milestonePlaceholder}
                      value={newMilestoneText}
                      onChange={(e) => setNewMilestoneText(e.target.value)}
                      required
                      className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-501 font-semibold"
                    />
                    <button 
                      type="submit"
                      className="px-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl flex items-center gap-1.5 shadow"
                    >
                      <span>{lVal.addMilestone}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* CASE B: todo typology */}
              {selectedNode.type === 'todo' && (
                <div className="p-6 bg-emerald-50/15 border border-emerald-100 rounded-2xl space-y-5 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h5 className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5 font-mono">
                      <Clock className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>{lVal.progressSlider}</span>
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100/40 px-2 py-0.5 rounded">
                      {selectedNode.progress}% Done
                    </span>
                  </div>

                  <div className="space-y-3 py-2">
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={selectedNode.progress} 
                      onChange={handleProgressSliderChange}
                      className="w-full h-2.5 bg-emerald-100/50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-400 font-mono">
                      <span>0% DISPATCHED</span>
                      <span>50% INGRESS PIPELINE</span>
                      <span>100% AUDITED MASTER</span>
                    </div>
                  </div>

                  {/* Standard checklist simulation as checkpoints list */}
                  <div className="p-4 bg-white border rounded-xl border-emerald-150 space-y-2">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block font-mono">
                      Pipeline Sanity Assertions Check
                    </span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Source codes fully integrated in Hearth registry bundle</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Logical Gates passed without structural circular dependencies</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE C: resource typology */}
              {selectedNode.type === 'resource' && (
                <div className="p-6 bg-slate-50/75 border border-slate-200/60 rounded-2xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <h5 className="text-xs font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5 font-mono">
                      <SlidersHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Workspace Module Reference Link Code</span>
                    </h5>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Module Class: static
                    </span>
                  </div>

                  {/* Registry simulated codebase snippet block */}
                  <div className="p-4 bg-slate-900 border border-slate-950 rounded-xl space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="text-[8.5px] font-mono font-bold text-indigo-400 uppercase tracking-tight">
                        Import Code snippet
                      </span>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                    <pre className="text-[10.5px] font-mono text-slate-300 font-medium overflow-x-auto select-all leading-relaxed leading-5">
                      <code>
{`import { HearthKernel } from '@hearth/core';

// Anchor dependency handle references
const registryHandle = HearthKernel.locate('${selectedNode.id}');
console.log('[System Engine] Binding status: ', registryHandle.status);
console.log('[Coordinate Node] Space vector: ', [${selectedNode.x}, ${selectedNode.y}]);`}
                      </code>
                    </pre>
                  </div>

                  {/* Hash calculations */}
                  <div className="pt-2">
                    {computedHashCode ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-250 rounded-xl space-y-1">
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-700 font-mono block">
                          {lVal.hashActive}
                        </span>
                        <p className="text-[10px] text-slate-600 font-mono font-semibold break-all">
                          🔒 {computedHashCode}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={calculateShaRegistry}
                        disabled={computingHash}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                      >
                        <Shield className="w-4 h-4 text-amber-300" />
                        <span>{computingHash ? lVal.hashProgress : lVal.hashBtn}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CASE D: agent typology */}
              {selectedNode.type === 'agent' && (
                <div className="p-6 bg-purple-50/15 border border-purple-100 rounded-2xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-purple-100/40">
                    <h5 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5 font-mono">
                      <Terminal className="w-4 h-4 text-purple-500 animate-pulse" />
                      <span>{lVal.agentLogs}</span>
                    </h5>
                    
                    <span className="text-[9px] font-mono font-black text-purple-500 px-1.5 py-0.5 bg-purple-50 rounded">
                      DAEMON HEALTHY
                    </span>
                  </div>

                  {/* Console logs display */}
                  <div className="p-4 bg-[#0a0a14] border border-slate-900 rounded-xl max-h-[140px] overflow-y-auto space-y-1.5 custom-scroll">
                    {agentLogs.map((log, idx) => (
                      <div key={idx} className="font-mono text-[9.5px] text-zinc-300 leading-relaxed font-medium">
                        {log}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono">
                        FOCUS HORIZON STRATEGY
                      </span>
                      <select 
                        value={horizonProtocol}
                        onChange={(e) => setHorizonProtocol(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border rounded-xl font-bold focus:outline-none"
                      >
                        <option value="Heuristic Gravity">Heuristic Gravity Align</option>
                        <option value="Logical Sieve">Sub-Logical Task Sieve</option>
                        <option value="Swiss Deselect Pro">Swiss Minimal Deselection Core</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleAgentScan}
                        className="w-full py-2 bg-[#09090f] hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow flex items-center justify-center gap-1.5 border border-slate-800"
                      >
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lVal.agentRun}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE E: muse typology */}
              {selectedNode.type === 'muse' && (
                <div className="p-6 bg-pink-50/15 border border-pink-100 rounded-2xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2 border-b border-pink-100/40">
                    <h5 className="text-xs font-black uppercase text-pink-700 tracking-wider flex items-center gap-1.5 font-mono">
                      <Compass className="w-4 h-4 text-pink-500 fill-pink-500/10 animate-spin" style={{ animationDuration: '10s' }} />
                      <span>{language === 'en' ? 'Inspiration Sandbox Simulator' : '逆向思维发散沙盒模拟舱'}</span>
                    </h5>
                    
                    <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-100/40 px-2.5 py-0.5 rounded">
                      Sparks active
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-505">
                      <span>{lVal.divergenceCoef}</span>
                      <span className="font-mono">{divergenceVal}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={120} 
                      value={divergenceVal} 
                      onChange={(e) => setDivergenceVal(parseInt(e.target.value))}
                      className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  {/* Sowing seed input directly */}
                  <form onSubmit={handleLocalMuseCast} className="space-y-2">
                    <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400 font-mono block">
                      {lVal.quickPrompt}
                    </span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? 'Jot down unorthodox feature concepts...' : '草拟一项离经叛道的创新设想...'} 
                        value={musePromptText}
                        onChange={(e) => setMusePromptText(e.target.value)}
                        required
                        className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-pink-400 font-bold"
                      />
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-[#1c0812] text-pink-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>{lVal.castSpark}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Metadata tags list wrapper */}
              <div className="space-y-1.5 border-t pt-4">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">
                  {lVal.tags}
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black font-mono rounded"
                    >
                      #{tag}
                    </span>
                  ))}

                  <button 
                    onClick={() => {
                      (window as any).playTactileChime?.('click');
                      const freshTag = prompt(language === 'en' ? 'Enter tag string:' : '输入新特性标签字符串:');
                      if (freshTag && freshTag.trim()) {
                        setNodes(prev => prev.map(n => {
                          if (n.id === selectedNode.id) {
                            return { ...n, tags: [...n.tags, freshTag.trim()] };
                          }
                          return n;
                        }));
                      }
                    }}
                    className="px-2.5 py-1 border border-dashed border-slate-350 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-[10px] font-black font-mono rounded transition-colors"
                  >
                    + NEW TAG
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-20 text-center rounded-3xl bg-white border border-slate-200/50 text-slate-400 space-y-4">
              <Compass className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
              <p className="text-xs font-bold font-mono max-w-sm mx-auto leading-relaxed">
                {lVal.noNodeSelected}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
