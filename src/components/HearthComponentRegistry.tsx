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
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Activity, 
  Link2, 
  Eye, 
  X, 
  Code,
  Share2,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { NodeData, NodeType, ChecklistItem, Binder, BinderType } from '../types';
import HearthNavigatorSidebar from './HearthNavigatorSidebar';
import HearthBinderHub from './HearthBinderHub';
import HearthComponentSimulator from './HearthComponentSimulator';
import HearthFolderExplorer from './HearthFolderExplorer';

interface HearthComponentRegistryProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  selectedIdFromMain?: string;
  language: 'en' | 'zh';
  onNavigateToNode?: (nodeId: string) => void;
}

export default function HearthComponentRegistry({
  nodes,
  setNodes,
  selectedIdFromMain,
  language,
  onNavigateToNode
}: HearthComponentRegistryProps) {
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(selectedIdFromMain || null);

  useEffect(() => {
    if (selectedIdFromMain) {
      setSelectedNodeId(selectedIdFromMain);
    }
  }, [selectedIdFromMain]);

  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // Drag handles for tactile physical nodes in 1000x800 container
  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime('click');
    }

    const canvasContainer = e.currentTarget.parentElement;
    if (!canvasContainer) return;

    const handleDragMove = (moveEvent: MouseEvent) => {
      const rect = canvasContainer.getBoundingClientRect();
      const rawX = ((moveEvent.clientX - rect.left) / rect.width) * 1000;
      const rawY = ((moveEvent.clientY - rect.top) / rect.height) * 800;

      // Restrict coordinate range to fit beautifully inside board bounds
      const clampedX = Math.round(Math.max(40, Math.min(960, rawX)));
      const clampedY = Math.round(Math.max(40, Math.min(760, rawY)));

      setNodes(prev => prev.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            x: clampedX,
            y: clampedY,
            updatedAt: '2026/06/10'
          };
        }
        return n;
      }));
    };

    const handleDragEnd = () => {
      setDraggingNodeId(null);
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleNodeTouchStart = (e: React.TouchEvent, nodeId: string) => {
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const canvasContainer = e.currentTarget.parentElement;
    if (!canvasContainer) return;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 0) return;
      const touch = moveEvent.touches[0];
      const rect = canvasContainer.getBoundingClientRect();
      const rawX = ((touch.clientX - rect.left) / rect.width) * 1000;
      const rawY = ((touch.clientY - rect.top) / rect.height) * 800;

      const clampedX = Math.round(Math.max(40, Math.min(960, rawX)));
      const clampedY = Math.round(Math.max(40, Math.min(760, rawY)));

      setNodes(prev => prev.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            x: clampedX,
            y: clampedY,
            updatedAt: '2026/06/10'
          };
        }
        return n;
      }));
    };

    const handleTouchEnd = () => {
      setDraggingNodeId(null);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // Dictionary localization map
  const loc = {
    en: {
      title: 'Hearth Component Registry',
      desc: 'Sovereign hardware, database references, and virtual runtimes registry map. Bind clouds, local file directories, and cloud storage targets directly to logical coordinate endpoints.',
      registerBtn: 'Sow Component Spark',
      gridMapTitle: 'Spatial Blueprint Grid Canvas',
      gridMapDesc: 'Coordinate nodes connected by physical routing links on a 1000x800 topology layer.',
      addNode: 'Sow New Component Element',
      noNodeSelected: 'Select or register a component from the left navigator folder to project onto workspace.',
      createdText: 'Sovereign node successfully sowed to logical coordinate workspace.',
      deletedText: 'Component telemetry successfully purged from topology database.',
      syncSuccess: 'State synchronized with hardware binder successfully.',

      shiftUp: 'Shift anchor north-pole (+Y)',
      shiftDown: 'Shift anchor south-pole (-Y)',
      shiftLeft: 'Shift anchor west-gate (-X)',
      shiftRight: 'Shift anchor east-gate (+X)',
      connectTo: 'Cross-Pipeline Signal Route Linkage',
      milestones: 'Operational Milestone Directives',
      progressSlider: 'Pipeline Stage Completion Meter',
      addMilestone: '+ DIRECTIVE',
      milestonePlaceholder: 'Define logical checkpoint...',
      hashBtn: '🔐 Compute Crypto Hash',
      hashActive: '🔐 Cryptographic Integrity Signature',
      hashProgress: 'Calculating SHA-256 signature...',
      agentLogs: 'Autonomic Daemon Runtime Stack',
      agentRun: '⚡ Execute Scan',
      divergenceCoef: 'Divergent Creativity Index',
      quickPrompt: 'Formulate Orthodox Seed Spark',
      castSpark: 'Sow Spark',
      tags: 'COMPILING SYSTEM META-TAGS / PROPERTIES'
    },
    zh: {
      title: 'Hearth 物理与虚拟拓扑注册中心',
      desc: '专有应用、离线文件夹、Cloudflare R2 存储与边缘计算组件。将现实世界硬件与多端端点，通过高精控制线对齐投影在逻辑平面。',
      registerBtn: '播种全新引擎粒子',
      gridMapTitle: '空间蓝图拓扑网格',
      gridMapDesc: '在 1000x800 的二维粒子场上，微调物理拓扑并自由连接各个管线。',
      addNode: '注册注册拓扑宿主节点',
      noNodeSelected: '请在侧栏文件夹选中任何组件，或点击右上角播种新组件以启动调试网格。',
      createdText: '新拓扑单元播种至蓝图逻辑节点。',
      deletedText: '该组件对应的所有逻辑通路与映射均已安全移除。',
      syncSuccess: '已完成单链物理健康探测及状态拉取。',

      shiftUp: '逻辑轴向北偏置 (+Y)',
      shiftDown: '逻辑轴向南偏置 (-Y)',
      shiftLeft: '逻辑轴向西偏置 (-X)',
      shiftRight: '逻辑轴向东偏置 (+X)',
      connectTo: '信号路由及下行物理管路绑定',
      milestones: '逻辑达成与断言清单',
      progressSlider: '管线阶段性审计进度',
      addMilestone: '+ 核心检查项',
      milestonePlaceholder: '拟定系统物理或逻辑检查断言...',
      hashBtn: '🔐 验证加密物理指纹',
      hashActive: '🔐 唯一组件硬件完整性指纹',
      hashProgress: '正在生成 SHA-256 位防篡改摘要...',
      agentLogs: '自治 Daemon 内部追踪堆栈',
      agentRun: '⚡ 启动诊断',
      divergenceCoef: '灵感创意散度系数',
      quickPrompt: '草拟打破桎梏的灵感设想',
      castSpark: '投放火种',
      tags: '当前已编译元数据标签与物理特征集'
    }
  };

  const lVal = loc[language];

  // Forms and actions states
  const [isNewNodeFormOpen, setIsNewNodeFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<NodeType>('project');
  const [newDesc, setNewDesc] = useState('');
  const [newX, setNewX] = useState(150);
  const [newY, setNewY] = useState(150);
  const [isEditing, setIsEditing] = useState(false);

  // Reset isEditing to false if selectedNodeId becomes null
  useEffect(() => {
    if (!selectedNodeId) {
      setIsEditing(false);
    }
  }, [selectedNodeId]);

  // Computing and AI-simulation states
  const [computingHash, setComputingHash] = useState(false);
  const [computedHashCode, setComputedHashCode] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [agentTriggerCount, setAgentTriggerCount] = useState(0);
  const [horizonProtocol, setHorizonProtocol] = useState('Heuristic Gravity');
  const [divergenceVal, setDivergenceVal] = useState(50);
  const [musePromptText, setMusePromptText] = useState('');

  // Navigator search and filter states
  const [navSearch, setNavSearch] = useState('');
  const [navTypeFilter, setNavTypeFilter] = useState<string>('all');

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

  // Auto load initialized high-fidelity binder examples if empty or undefined
  useEffect(() => {
    if (selectedNode && selectedNode.binders === undefined) {
      setNodes(prev => prev.map(n => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            binders: [
              {
                id: `binder-local-${n.id}`,
                type: 'local_folder',
                name: language === 'en' ? 'Local Component Directory' : '本端工程源码目录',
                path: `~/Workspace/blueprint/nodes/${n.type}/${n.id.slice(-6)}`,
                status: 'synced',
                lastSyncedAt: '08:44:18'
              },
              {
                id: `binder-r2-${n.id}`,
                type: 'cloudflare_r2',
                name: language === 'en' ? 'Cloudflare R2 Bucket Assets' : 'Cloudflare R2 云端媒体桶',
                path: `r2://hearth-assets/bucket-${n.id.slice(-6)}`,
                status: 'active',
                lastSyncedAt: '08:44:18'
              }
            ]
          };
        }
        return n;
      }));
    }
  }, [selectedNodeId, selectedNode?.id, setNodes, language]);

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
      detail: { message: language === 'en' ? 'Sovereign node successfully sowed.' : '新拓扑单元播种至蓝图逻辑节点。', type: 'success' }
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
          updatedAt: '2026/06/10'
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
      detail: { message: language === 'en' ? 'Sovereign components successfully unregistered.' : '拓扑架构组件已完成物理注销。', type: 'warn' }
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

  // Define dynamic column spans to support a gorgeous 4-column layout when a node is selected!
  const col1Class = isNavCollapsed ? 'lg:col-span-1' : 'lg:col-span-3';

  const col2Class = isEditing && selectedNode 
    ? (isNavCollapsed ? 'lg:col-span-4' : 'lg:col-span-3') 
    : (isNavCollapsed ? 'lg:col-span-11' : 'lg:col-span-9');

  const col3Class = selectedNode
    ? (isNavCollapsed ? 'lg:col-span-4' : 'lg:col-span-3')
    : 'lg:col-span-4';

  const col4Class = 'lg:col-span-3 animate-in slide-in-from-right-4 duration-300';

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
              <p className="text-[11px] text-slate-505 font-bold mt-0.5 max-w-xl leading-relaxed">
                {lVal.desc}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            (window as any).playTactileChime?.('click');
            setIsNewNodeFormOpen(true);
          }}
          className="px-5 py-3 h-11 bg-indigo-600 hover:bg-indigo-700 hover:scale-101 active:scale-99 text-white font-extrabold text-xs tracking-wide rounded-xl shadow-lg shadow-indigo-600/10 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Share2 className="w-4 h-4 text-indigo-200 fill-indigo-100/10" />
          <span>{lVal.registerBtn}</span>
        </button>
      </div>

      {/* New Node Pop-up Drawer */}
      {isNewNodeFormOpen && (
        <form 
          onSubmit={handleRegisterNode}
          className="bg-white border-2 border-indigo-600 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden animate-in zoom-in-95 duration-200"
        >
          <div className="absolute top-0 right-0 p-4">
            <button 
              type="button" 
              onClick={() => setIsNewNodeFormOpen(false)}
              className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Grid className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#0f172a] uppercase tracking-wide">
                {lVal.addNode}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Component Technical Title</span>
              <input 
                type="text" 
                placeholder="e.g., Gossip Protocol Tunnel" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:outline-none rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Component Archetype Class</span>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value as NodeType)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl font-semibold"
              >
                <option value="project">📁 Project Module Directory</option>
                <option value="todo">🟢 Active Pipeline Task</option>
                <option value="resource">📦 Resource Database</option>
                <option value="agent">🤖 Sovereign Agent</option>
                <option value="muse">💡 Inspiration Sandbox</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Canvas Horiz Alignment (X Coordinate: 50~950)</span>
              <input 
                type="number" 
                min={50}
                max={950}
                value={newX}
                onChange={(e) => setNewX(parseInt(e.target.value) || 120)}
                required
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Canvas Vert Alignment (Y Coordinate: 50~750)</span>
              <input 
                type="number" 
                min={50}
                max={750}
                value={newY}
                onChange={(e) => setNewY(parseInt(e.target.value) || 120)}
                required
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">System Capability Description</span>
            <textarea 
              rows={2}
              placeholder="System parameters, interfaces or functional descriptions..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl font-semibold leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={() => setIsNewNodeFormOpen(false)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold text-[11px] rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl shadow-lg shadow-indigo-600/10 transition-all"
            >
              Confirm Sowing
            </button>
          </div>
        </form>
      )}

      {/* 2. Three-Column Workspace Studio Redesign */}
      {/* Dynamic Column widths based on sidebar state */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= COLUMN 1: COMPONENTS DIRECTORY SIDEBAR ================= */}
        <div className={`${col1Class} h-full transition-all duration-300 relative`}>
          {isNavCollapsed ? (
            <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-3 shadow-sm h-full flex flex-col items-center justify-between min-h-[400px] animate-in slide-in-from-left-4 duration-300">
              <div className="flex flex-col items-center gap-6">
                {/* Expand button */}
                <button
                  type="button"
                  onClick={() => {
                    (window as any).playTactileChime?.('click');
                    setIsNavCollapsed(false);
                  }}
                  className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all border border-indigo-200 hover:text-indigo-700 active:scale-95 text-[10px] font-black font-mono flex items-center justify-center gap-1 cursor-pointer"
                  title={language === 'en' ? 'Click to expand directory' : '展开左侧面板'}
                >
                  <ChevronsRight className="w-5 h-5 animate-pulse" />
                </button>

                {/* Tiny Icon representation */}
                <div className="flex flex-col gap-5 text-center mt-6">
                  <div className="flex flex-col items-center gap-1" title="Clusters">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/50 flex items-center justify-center">
                      <Grid className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-black font-mono text-slate-400">
                      {nodes.filter(n => n.type === 'project').length}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1" title="Pipelines">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black font-mono text-slate-400">
                      {nodes.filter(n => n.type === 'todo').length}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1" title="Agents">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200/50 flex items-center justify-center font-mono">
                      🤖
                    </div>
                    <span className="text-[10px] font-black font-mono text-slate-400">
                      {nodes.filter(n => n.type === 'agent').length}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1" title="Sandboxes">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-200/50 flex items-center justify-center">
                      <Compass className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="text-[10px] font-black font-mono text-slate-400">
                      {nodes.filter(n => n.type === 'muse').length}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1" title="Assets">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center">
                      <Code className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-black font-mono text-slate-400">
                      {nodes.filter(n => n.type === 'resource').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[8px] font-black text-indigo-400 font-mono rotate-90 uppercase py-6 whitespace-nowrap tracking-widest leading-none select-none">
                H-CORE DIRECTORY
              </div>
            </div>
          ) : (
            <div className="relative animate-in slide-in-from-left-4 duration-300">
              {/* Collapse button inside the fully expanded sidebar */}
              <button
                type="button"
                onClick={() => {
                  (window as any).playTactileChime?.('click');
                  setIsNavCollapsed(true);
                }}
                className="absolute right-4 top-4 p-1 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-slate-200/70 z-30 cursor-pointer active:scale-90"
                title={language === 'en' ? 'Click to collapse directory' : '收起左侧面板'}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <HearthNavigatorSidebar
                nodes={nodes}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
                language={language}
                onAddNodeClick={() => {
                  (window as any).playTactileChime?.('click');
                  setIsNewNodeFormOpen(true);
                }}
                onDoubleClickNode={(id) => {
                  setSelectedNodeId(id);
                  setIsEditing(true);
                  (window as any).playTactileChime?.('success');
                }}
              />
            </div>
          )}
        </div>

        {/* ================= COLUMN 2: SPATIAL CANVAS BLUEPRINT & BINDING HUB ================= */}
        <div className={`${col2Class} space-y-6 transition-all duration-300 animate-in fade-in-30`}>
          <div className="bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute left-6 bottom-6 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-indigo-950/30">
                <div>
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest flex items-center gap-1.5 flex-wrap">
                    <Grid className="w-4 h-4 text-indigo-400" />
                    <span>{lVal.gridMapTitle}</span>
                    {isEditing ? (
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-550/30 text-indigo-300 font-mono text-[8px] uppercase tracking-wider font-bold rounded">
                        ● EDITING COMPONENT / 编辑视角
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-amber-400 font-mono text-[8px] uppercase tracking-wider font-bold rounded animate-pulse">
                        ● GRAPH CANVAS LIVE / 核心大画布
                      </span>
                    )}
                  </h3>
                  <p className="text-[10.5px] text-slate-450 font-bold mt-1 max-w-xl leading-relaxed">
                    {isEditing 
                      ? (language === 'en' 
                          ? "🛠️ Operational systems diagnostics. Click 'Exit Editor' to restore the giant blueprint canvas."
                          : "🛠️ 正在对组件进行功能仿真。点击“退出编辑”可随时返回核心大画布。")
                      : (language === 'en' 
                          ? "⚡ Double-click any component node on the grid below to load code workspace & simulated client."
                          : "⚡ 在画布中双击任意组件节点，即可精细加载该节点的真实源码模块与沙盒交互。")}
                  </p>
                </div>

                {selectedNode && (
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 select-none">
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => {
                          (window as any).playTactileChime?.('click');
                          setIsEditing(false);
                        }}
                        className="px-3 py-1.5 bg-[#020205] border border-slate-805 hover:border-slate-700 hover:bg-slate-900 text-slate-350 hover:text-white font-mono text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-95"
                      >
                        ← {language === 'en' ? 'Exit Editor' : '返回大画布'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          (window as any).playTactileChime?.('success');
                          setIsEditing(true);
                        }}
                        className="px-4.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                      >
                        ⚡ {language === 'en' ? 'Open Workspace (DF)' : '进入工作区 (双击)'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Blueprint Interactive Vector Canvas Board */}
              <div className={`w-full bg-[#020205] border border-indigo-950/85 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-lg cursor-crosshair transition-all duration-300 ${
                isEditing ? 'h-[280px]' : 'h-[520px]'
              }`}>
                <div className="absolute inset-0 select-none pointer-events-none opacity-[0.06]" style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />

                <div className="absolute left-3 top-3 font-mono text-[8px] text-slate-550 leading-none">
                  GRID PRODUCER SCALE: 1000x800 | INTERACTIVE DRAG-LOCK
                </div>

                {/* Horizontal & Vertical Crosshair alignment wires during active dragging */}
                {draggingNodeId && (() => {
                  const dNode = nodes.find(n => n.id === draggingNodeId);
                  if (!dNode) return null;
                  const percentX = (dNode.x / 1000) * 100 + '%';
                  const percentY = (dNode.y / 800) * 100 + '%';
                  return (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                      {/* X aligning wire */}
                      <line x1="0" y1={percentY} x2="100%" y2={percentY} stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
                      {/* Y aligning wire */}
                      <line x1={percentX} y1="0" x2={percentX} y2="100%" stroke="#f59e0b" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
                    </svg>
                  );
                })()}

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {nodes.map((n) => {
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
                      type="button"
                      onMouseDown={(e) => handleNodeDragStart(e, n.id)}
                      onTouchStart={(e) => handleNodeTouchStart(e, n.id)}
                      onClick={() => {
                        (window as any).playTactileChime?.('click');
                        setSelectedNodeId(n.id);
                      }}
                      onDoubleClick={() => {
                        (window as any).playTactileChime?.('success');
                        setSelectedNodeId(n.id);
                        setIsEditing(true);
                      }}
                      className={`absolute translate-x-[-50%] translate-y-[-50%] transition-transform duration-75 group z-20 cursor-move ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                      }`}
                      style={{ left: `${percentX}%`, top: `${percentY}%` }}
                      title={`${n.title} (X: ${n.x}, Y: ${n.y}) - Drag directly to re-position`}
                    >
                      <span className={`relative flex h-4 w-4 items-center justify-center rounded-full ${typeColor} ring-4 transition-all duration-300 leading-none shadow-md ${
                        isSelected ? 'ring-amber-500/80' : ''
                      }`}>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute" />
                        )}
                      </span>

                      <span className="pointer-events-none absolute left-5 top-0 transform -translate-y-1/2 bg-slate-950 border border-slate-800 text-[8.5px] font-black text-slate-300 rounded px-1.5 py-0.5 tracking-tight font-mono opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {n.title} ({n.x},{n.y})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Coordinates Control & Direction Arrow Console */}
              {selectedNode && (
                <div className="bg-[#121320] border border-slate-900/60 rounded-2xl p-4 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center pb-1.5 border-b border-indigo-950/50">
                    <div className="font-mono text-[9px] text-indigo-400 font-extrabold uppercase tracking-wider">
                      ⚓ Anchor Location Telemetry (Try Dragging Nodes!)
                    </div>
                    <span className="px-2 py-0.5 bg-slate-900 text-indigo-300 rounded font-mono text-[8.5px] font-bold">
                      X: {selectedNode.x}px | Y: {selectedNode.y}px
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Console arrows container on left */}
                    <div className="col-span-6 flex justify-center py-1">
                      <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-slate-800/80 p-0.5 relative flex items-center justify-center shadow-inner">
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('up')}
                          className="absolute top-0.5 p-1 hover:bg-slate-8 w-6 h-6 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                          title={lVal.shiftUp}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('down')}
                          className="absolute bottom-0.5 p-1 hover:bg-slate-8 w-6 h-6 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                          title={lVal.shiftDown}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('left')}
                          className="absolute left-0.5 p-1 hover:bg-slate-8 w-6 h-6 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                          title={lVal.shiftLeft}
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('right')}
                          className="absolute right-0.5 p-1 hover:bg-slate-8 w-6 h-6 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                          title={lVal.shiftRight}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-5 h-5 rounded-full bg-[#080914] border border-slate-800 shadow shadow-inner" />
                      </div>
                    </div>

                    {/* Navigation controllers */}
                    <div className="col-span-6 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          (window as any).playTactileChime?.('success');
                          if (onNavigateToNode) {
                            onNavigateToNode(selectedNode.id);
                          }
                        }}
                        className="w-full py-1.5 bg-indigo-600/30 hover:bg-indigo-600/45 border border-indigo-505/20 text-indigo-300 font-extrabold text-[9.5px] rounded-xl flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Locate on Field</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteNodeRegistry}
                        className="w-full py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-rose-450 font-extrabold text-[9.5px] rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Unregister Node</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Downstream Path Connections */}
              {selectedNode && (
                <div className="bg-[#121320] border border-slate-900/60 rounded-2xl p-4 space-y-2">
                  <div className="font-mono text-[9px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{lVal.connectTo}</span>
                  </div>

                  <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1.5 custom-scroll">
                    {nodes.filter(n => n.id !== selectedNode.id).map((on) => {
                      const isConnected = selectedNode.connections.includes(on.id);
                      return (
                        <button
                          key={on.id}
                          type="button"
                          onClick={() => toggleNodeConnection(on.id)}
                          className={`w-full p-2 rounded-xl text-left font-semibold text-[10px] font-mono border transition-all flex items-center justify-between cursor-pointer ${
                            isConnected 
                              ? 'bg-slate-900 border-indigo-600/80 text-amber-300' 
                              : 'bg-slate-950/80 border-slate-900 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <span className="truncate flex items-center">📍 {on.title}</span>
                          <span className="text-[8.5px] font-bold shrink-0">
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

          {/* Physically Bridged Binders Hub */}
          {selectedNode && (
            <HearthBinderHub
              selectedNode={selectedNode}
              nodes={nodes}
              setNodes={setNodes}
              language={language}
            />
          )}
        </div>

        {/* ================= COLUMN 3: PERFORMANCE DIGITAL-TWIN SIMULATOR ================= */}
        {isEditing && (
          <div className={`${col3Class} h-full`}>
            {selectedNode ? (
              <HearthComponentSimulator
                selectedNode={selectedNode}
                language={language}
                setNodes={setNodes}
                computingHash={computingHash}
                computedHashCode={computedHashCode}
                calculateShaRegistry={calculateShaRegistry}
                agentLogs={agentLogs}
                horizonProtocol={horizonProtocol}
                setHorizonProtocol={setHorizonProtocol}
                handleAgentScan={handleAgentScan}
                divergenceVal={divergenceVal}
                setDivergenceVal={setDivergenceVal}
                musePromptText={musePromptText}
                setMusePromptText={setMusePromptText}
                handleLocalMuseCast={handleLocalMuseCast}
                newMilestoneText={newMilestoneText}
                setNewMilestoneText={setNewMilestoneText}
                handleAddMilestone={handleAddMilestone}
                toggleMilestoneComplete={toggleMilestoneComplete}
                deleteMilestone={deleteMilestone}
                handleProgressSliderChange={handleProgressSliderChange}
                handleUpdateNodeStringField={handleUpdateNodeStringField}
              />
            ) : (
              <div className="p-16 text-center rounded-3xl bg-white border border-slate-200/60 text-slate-450 space-y-4">
                <Compass className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs font-bold font-mono max-w-[200px] mx-auto leading-relaxed text-slate-400">
                  {lVal.noNodeSelected}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= COLUMN 4: ACTIVE COMPONENT CODE MODULE & FILESYSTEM ================= */}
        {isEditing && selectedNode && (
          <div className={`${col4Class}`}>
            <HearthFolderExplorer 
              nodeType={selectedNode.type}
              nodeTitle={selectedNode.title}
              language={language}
            />
          </div>
        )}

      </div>

    </div>
  );
}
