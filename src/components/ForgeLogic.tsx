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
  RefreshCw,
  User,
  Tag,
  Sliders,
  X,
  Check,
  CheckSquare,
  Square,
  Compass,
  BookOpen
} from 'lucide-react';
import { ForgeAgent, NodeData, NodeType, ChecklistItem } from '../types';
import { translations } from '../locales';

interface ForgeLogicProps {
  nodes?: NodeData[];
  setNodes?: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setActiveTab?: (tab: string) => void;
  setSelectedNodeId?: (id: string | null) => void;
  language?: 'en' | 'zh';
}

const COLLABORATORS = [
  { name: 'ceaserzhao', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop&sat=-100' },
  { name: 'Ying', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop' },
  { name: 'Alex', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop' },
  { name: 'David', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop' },
  { name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128&auto=format&fit=crop' }
];

const PRESET_TAGS = [
  'P2P-Mesh', 'WebRTC', 'Aesthetic-Asserted', 'Swiss-Min', 'Local-Gated', 'ECDSA-Secured', 'Hearth-Process'
];

export default function ForgeLogic({
  nodes = [],
  setNodes,
  setActiveTab,
  setSelectedNodeId,
  language = 'en'
}: ForgeLogicProps) {
  // Localization dictionary helper
  const isEn = language === 'en';
  const tGlobal = translations[language];
  const tVal = tGlobal.forge;

  // Root Sub-tabs
  // 'sprout' -> Formal Custom Creation Studio
  // 'sandbox' -> Specialized Agent Workflow sandbox
  const [subTab, setSubTab] = useState<'sprout' | 'sandbox'>('sprout');

  // FORM STATES (Sprout Center)
  const [nodeType, setNodeType] = useState<NodeType>('todo');
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeDesc, setNodeDesc] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedOwners, setSelectedOwners] = useState<string[]>(['ceaserzhao']);
  const [customTags, setCustomTags] = useState<string[]>(['P2P-Mesh']);
  const [newTagInput, setNewTagInput] = useState('');
  const [checklist, setChecklist] = useState<string[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [targetZone, setTargetZone] = useState<'opportunity' | 'execution' | 'core' | 'future'>('opportunity');
  const [isCopilotGenerating, setIsCopilotGenerating] = useState(false);

  // ORIGINAL AGENTS/SANDBOX STATES
  const [agents, setAgents] = useState<ForgeAgent[]>([
    {
      id: 'agent-1',
      name: isEn ? 'User Research Companion (访谈代理)' : 'User Research Companion (访谈代理)',
      description: isEn 
        ? 'Captures and processes unstructured feedback from opportunity domain interviews.' 
        : '自动抽取并提炼机会域研究访谈中的不规则非结构化反馈信息。',
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
      name: isEn ? 'Design System Forge Engine (设计引擎)' : 'Design System Forge Engine (设计引擎)',
      description: isEn 
        ? 'Generates atom system guidelines and pushes JSON assets directly into Hearth.'
        : '实时生产并维护原子设计规范底盘，并通过 JSON 实体数据直推 Hearth 表盘。',
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
  const [testConsole, setTestConsole] = useState<string[]>([
    isEn 
      ? '[System]: Forge Agent Engine Initialized. Ready to simulate workflows.'
      : '[System]: 仿真铸模中心初始化就绪。随时可执行沙盒验证。'
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Selected agent helpers
  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleToggleMemory = () => {
    setAgents(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        const nextEngine = a.memoryEngine === 'json' ? 'vector' : 'json';
        setTestConsole(c => [
          ...c, 
          isEn 
            ? `[Forge]: Switched memory engine for "${a.name}" to [${nextEngine.toUpperCase()}] ENGINE`
            : `[Forge]: 已把 "${a.name}" 的底层检索机制换装为 [${nextEngine.toUpperCase()}] 自研引擎`
        ]);
        return { ...a, memoryEngine: nextEngine };
      }
      return a;
    }));
  };

  const handleSimulateExecution = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setTestConsole(c => [
      ...c, 
      isEn 
        ? `[Simulation]: Initiating verification pipeline for "${selectedAgent.name}"...`
        : `[仿真探针]: 正在拉起 "${selectedAgent.name}" 特质专化代理验证流...`
    ]);

    const steps = [
      isEn ? '[Trigger]: Input stimuli localized inside Hearth boundaries.' : '[触发极]: 接收来自 Hearth 画布的感知信令。',
      isEn ? `[Memory]: Querying index database [${selectedAgent.memoryEngine.toUpperCase()}] ... 12 matches found.` : `[记忆体]: 精细扫描 [${selectedAgent.memoryEngine.toUpperCase()}] 本地对齐库 ... 共检索到 12 次历史拟合度。`,
      selectedAgent.memoryEngine === 'vector' 
        ? (isEn ? `[Vector]: Calculated semantic proximity cosine distance = 0.89` : `[向量余弦]: 计算语义临近向量夹角 Cosine Proximity = 0.89`) 
        : (isEn ? `[JSON]: Successfully validated schema templates against ADR-007 schema constraints.` : `[JSON 树]: 语义元树成功跑通 ADR-007 标准契约校验。`),
      isEn ? `[Boundary]: Executing compliance check. No prohibited boundaries penetrated. Status: PASSED` : `[主流闸]: 边界防御模块复查机制。0次违规刺穿，状态：PASSED`,
      isEn ? `[Success]: Compiled output sprout emitted into "Hearth Field" successfully.` : `[实体化成果]: 编译完成的实体化决策节点已被成功注入 Hearth 主空间画布！`
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setTestConsole(c => [...c, step]);
        if (index === steps.length - 1) {
          setIsSimulating(false);
          setTestConsole(c => [...c, isEn ? `[Simulation]: Done. 0 errors, pipeline complete.` : `[仿真状态]: 完成。无异常退出码，流水线检验正常。`]);
        }
      }, (index + 1) * 550);
    });
  };

  const handleAddGraphNode = () => {
    const freshId = `step-${Date.now()}`;
    setAgents(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        const nodeCount = a.graphNodes.length;
        const newNode = {
          id: freshId,
          label: isEn ? `Logical Node-${nodeCount + 1}` : `逻辑微进程-${nodeCount + 1}`,
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
    setTestConsole(c => [...c, isEn ? `[Forge]: Added new logical block to "${selectedAgent.name}"` : `[Forge]: 已在 "${selectedAgent.name}" 中增加一个微决策逻辑层`]);
  };

  const clearConsole = () => {
    setTestConsole([isEn ? '[Console]: Cleared. Ready.' : '[日志控制台]: 清空完成，待命中。']);
  };

  // DESIGN FORM INTERACTION CRITICAL LOGIC
  const handleToggleOwner = (name: string) => {
    setSelectedOwners(prev => 
      prev.includes(name) ? prev.filter(o => o !== name) : [...prev, name]
    );
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !customTags.includes(newTagInput.trim())) {
      setCustomTags(prev => [...prev, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddChecklist = () => {
    if (newCheckItem.trim() && !checklist.includes(newCheckItem.trim())) {
      setChecklist(prev => [...prev, newCheckItem.trim()]);
      setNewCheckItem('');
    }
  };

  const handleRemoveCheckItem = (idx: number) => {
    setChecklist(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAiCopilotOptimize = () => {
    if (!nodeTitle.trim()) {
      alert(isEn ? 'Please provide a title first!' : '请先分配一个正式标题！');
      return;
    }
    setIsCopilotGenerating(true);

    // Dynamic semantic mock generator based on title - extremely realistic and high-end Swiss styling
    setTimeout(() => {
      const polishedTitles: Record<string, string> = {
        en: `Comprehensive strategy mapping layer to audit raw telemetry datasets with high-fidelity Swiss minimalist alignments.`,
        zh: `高完备度节点资产栈：用以深度对准与审计非结构化 P2P 网格延迟指标，落实严格的瑞士美学设计控制。`
      };

      const suggestion = polishedTitles[language] + ` (Enhanced via Hey Agentic Copilot v1.0).`;
      setNodeDesc(suggestion);
      
      // Auto-populate checklist with realistic subtasks
      const defaultTasks = isEn 
        ? ['Verify ECDSA RSA handshake signatures', 'Establish Oermos socket keep-alive pulse', 'Render localized fallback state containers']
        : ['验证对等 ECDSA 数字信标安全签名', '跑通 Oermos 信道保持周期脉搏', '渲染局部安全沙盒回置状态机'];
      
      setChecklist(defaultTasks);

      // Auto add tags
      if (!customTags.includes('AI-Catalyzed')) {
        setCustomTags(t => [...t, 'AI-Catalyzed', 'Aesthetic-Asserted']);
      }

      setIsCopilotGenerating(false);
    }, 1100);
  };

  // ACTION: Forge and Sprout Node Button Click
  const handleBuildAndSprout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeTitle.trim()) return;

    if (!setNodes || !setActiveTab || !setSelectedNodeId) {
      alert('Local space context invalid for sprouting.');
      return;
    }

    // Determine viewport coordinate mapping center based on chosen target zone
    // Avoid coordinate stacking by adding micro randomization jitter!
    let bx = 300, by = 280;
    if (targetZone === 'opportunity') {
      bx = 160 + Math.random() * 80;
      by = 160 + Math.random() * 80;
    } else if (targetZone === 'execution') {
      bx = 480 + Math.random() * 80;
      by = 160 + Math.random() * 80;
    } else if (targetZone === 'core') {
      bx = 160 + Math.random() * 80;
      by = 480 + Math.random() * 80;
    } else if (targetZone === 'future') {
      bx = 480 + Math.random() * 80;
      by = 480 + Math.random() * 80;
    }

    const freshId = `node-grown-${Date.now()}`;
    const generatedChecklist: ChecklistItem[] = checklist.map((text, i) => ({
      id: `check-${freshId}-${i}`,
      text,
      done: false
    }));

    const sproutedNode: NodeData = {
      id: freshId,
      type: nodeType,
      title: nodeTitle,
      description: nodeDesc || (isEn ? 'Sprouted via Hearth Creation Center.' : '源自 Hearth 创意工坊。'),
      x: bx,
      y: by,
      progress: progress,
      members: selectedOwners,
      checklist: generatedChecklist,
      tags: customTags.length > 0 ? customTags : ['Custom'],
      connections: ['project-a'], // default link connection anchor to main Core project node
      createdAt: '25/05/31',
      updatedAt: '25/05/31'
    };

    setNodes(prev => [...prev, sproutedNode]);
    setSelectedNodeId(freshId);
    
    // Redirect user to the Field Map Canvas and focus on their masterpiece!
    setActiveTab('fieldmap');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-[#f8fafc]">
      
      {/* Action Header Banner */}
      <div className="px-8 py-5 bg-white border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-[#0f172a] tracking-tight">
              {isEn ? 'Universal Hearth Creator & Forge' : 'Hearth 核心创意工坊 · 实体化工作台'}
            </h2>
            <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-extrabold tracking-widest uppercase">
              ADR-007 CERTIFIED
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 max-w-3xl leading-relaxed">
            {isEn 
              ? 'This is the official decentralized workspace creator portal. Forge high-resolution component coordinates, instantiate specialized logical agents, and sprout them raw onto your Active Field Map.' 
              : '此为系统级官方主权创建门户。在此您可以对进入 Hearth 地图的数据节点、任务、常驻代理和资源进行精细化属性调配，一键将其以最高物理规格实体化注入画布空间。'}
          </p>
        </div>

        {/* Dynamic workspace sub-tab switch */}
        <div className="flex bg-slate-150/60 p-1 rounded-xl border border-slate-200/40 self-stretch md:self-auto shrink-0 select-none">
          <button 
            onClick={() => setSubTab('sprout')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'sprout' 
                ? 'bg-[#0f172a] text-white shadow shadow-slate-950/20' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Official Creation Studio' : '正式节点实体化中心'}</span>
          </button>
          
          <button 
            onClick={() => setSubTab('sandbox')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'sandbox' 
                ? 'bg-[#0f172a] text-white shadow shadow-slate-950/20' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isEn ? 'Agent Schematics' : '子代理自主测试沙盒'}</span>
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC SUB-TABS BODY */}
      <div className="flex-1 overflow-hidden">
        
        {/* SUBTAB 1: HIGH FIDELITY DESIGN / SPROUT CREATOR FORM */}
        {subTab === 'sprout' && (
          <div className="h-full overflow-y-auto p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in-30 duration-300">
            
            <form onSubmit={handleBuildAndSprout} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Form side (2 cols) */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Section A: Category selection */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isEn ? '1. Core Component Aggregate Class' : '1. 声明要素的物理特征（大类）'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(['todo', 'project', 'agent', 'muse', 'resource'] as NodeType[]).map((type) => {
                      const isSelected = nodeType === type;
                      const label = isEn ? type.toUpperCase() : tGlobal.fieldmap[type];
                      
                      const style = {
                        todo: 'border-emerald-200 hover:border-emerald-300 text-emerald-800 bg-emerald-50/20 checked:bg-emerald-500',
                        project: 'border-indigo-200 hover:border-indigo-300 text-indigo-800 bg-indigo-50/20',
                        agent: 'border-blue-200 hover:border-blue-300 text-blue-800 bg-blue-50/20',
                        muse: 'border-amber-200 hover:border-amber-300 text-amber-800 bg-amber-50/20',
                        resource: 'border-slate-200 hover:border-slate-300 text-slate-800 bg-slate-50/20'
                      }[type];

                      const activeStyle = {
                        todo: 'bg-emerald-600 border-emerald-600 text-white shadow shadow-emerald-600/10 hover:border-emerald-600 hover:bg-emerald-600',
                        project: 'bg-indigo-600 border-indigo-600 text-white shadow shadow-indigo-600/10 hover:border-indigo-600 hover:bg-indigo-600',
                        agent: 'bg-blue-600 border-blue-600 text-white shadow shadow-blue-600/10 hover:border-blue-600 hover:bg-blue-600',
                        muse: 'bg-amber-600 border-amber-600 text-white shadow shadow-amber-600/10 hover:border-amber-600 hover:bg-amber-600',
                        resource: 'bg-slate-850 border-slate-850 text-white shadow shadow-slate-850/10 hover:border-slate-850 hover:bg-slate-850'
                      }[type];

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNodeType(type)}
                          className={`py-3 px-1 text-center text-[11px] font-black tracking-wide rounded-xl border transition-all ${
                            isSelected ? activeStyle : `bg-white ${style}`
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section B: Meta input fields */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isEn ? '2. Naming & Theoretical Description' : '2. 分配高精标识及行动大纲'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        {isEn ? 'Sovereign Title / Hub Name' : '该要素在当前维度的注册标题'}
                      </label>
                      <input 
                        type="text"
                        placeholder={isEn ? 'e.g., Swiss Grid Aesthetic Layout Standards...' : '例如：瑞制设计网格资产验证套件...'}
                        value={nodeTitle}
                        onChange={(e) => setNodeTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-205/65 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 relative">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">
                          {isEn ? 'Functional Strategy Description' : '规划细则与技术指标陈述'}
                        </label>
                        
                        <button
                          type="button"
                          onClick={handleAiCopilotOptimize}
                          disabled={isCopilotGenerating}
                          className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/50 px-2 py-1 rounded-lg font-bold flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          title={isEn ? 'Populate polished details using Hey AI' : '使用 Hey AI 智能补全和精细化'}
                        >
                          <Sparkles className={`w-3 h-3 ${isCopilotGenerating ? 'animate-spin' : ''}`} />
                          <span>{isCopilotGenerating ? (isEn ? 'Analyzing...' : '研判中...') : (isEn ? 'Hey AI Assist' : 'Hey 创意自动补全')}</span>
                        </button>
                      </div>

                      <textarea 
                        rows={3}
                        placeholder={isEn ? 'Write detailed architectural instructions or milestones...' : '阐述该项目的边界定位、涉及数据类型、和希望实现的技术指标成果...'}
                        value={nodeDesc}
                        onChange={(e) => setNodeDesc(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-205/65 rounded-xl text-xs font-semibold leading-relaxed text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Sprint tasks checklist dynamic generator */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isEn ? '3. Component Checklist & Deliverables' : '3. 分阶段细分目标 / Checklist 指针'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      {isEn 
                        ? 'Deconstruct this component or node into modular deliverable tasks. These synchronize as active checkboxes inside the map nodes.'
                        : '将此行动要素拆解为具体可追踪的里程碑分支。实体化后，可在画布卡片中直接进行勾选、核验及累加。'}
                    </p>

                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder={isEn ? '+ Define branch task item...' : '+ 追加子目标、微指令或分支任务...'}
                        value={newCheckItem}
                        onChange={(e) => setNewCheckItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklist())}
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-150 rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddChecklist}
                        className="px-4 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors active:scale-95 shrink-0"
                      >
                        {isEn ? 'Append' : '追加子任务'}
                      </button>
                    </div>

                    {/* Display checklist items */}
                    {checklist.length > 0 ? (
                      <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden bg-slate-50/50">
                        {checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 text-xs font-semibold text-slate-700">
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-md border border-slate-300 text-slate-400 flex items-center justify-center font-mono text-[9px] font-bold select-none">
                                {idx + 1}
                              </span>
                              <span>{item}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCheckItem(idx)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Delete item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center border border-dashed border-slate-205 rounded-xl text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white">
                        {isEn ? 'NO BRANCH TASKS REGISTERED YET' : '暂未追加任何阶段性子任务'}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Sidebar Form configurations (1 col) */}
              <div className="space-y-6">
                
                {/* Section D: Sprout location zone */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isEn ? '4. Boundary Space Positioning' : '4. 空间落域 / 象限锚定'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      {isEn 
                        ? 'Select the core quadrant cluster where the new sprouted card element will crystallize.'
                        : '决定该物理卡片在 Hearth 主空间上将直接物质化降落在哪个战略象限。'}
                    </p>

                    <div className="space-y-2">
                      {[
                        { id: 'opportunity', label: isEn ? 'Opportunity Domain' : '第一象限 · 机会域探究' },
                        { id: 'execution', label: isEn ? 'Lattice Process Matrix' : '第二象限 · 本地进程执行规矩阵' },
                        { id: 'core', label: isEn ? 'Core Planning Territory' : '第三象限 · 核心路线总策划区' },
                        { id: 'future', label: isEn ? 'Future Trajectory Workspace' : '第四象限 · 未来增效演进矩阵' }
                      ].map((zone) => {
                        const active = targetZone === zone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => setTargetZone(zone.id as any)}
                            className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center justify-between ${
                              active 
                                ? 'bg-indigo-50/50 border-indigo-500 text-indigo-950 font-bold' 
                                : 'bg-white hover:bg-slate-50/60 border-slate-100 text-slate-600 font-semibold'
                            }`}
                          >
                            <span className="text-[11px] truncate">{zone.label}</span>
                            {active && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section E: Owner Assignee */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isEn ? '5. Sovereignty Delegation' : '5. 确立主权所有者'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      {isEn 
                        ? 'Select team coordinators delegated responsible oversight of this node.'
                        : '将此节点的所有权授予相关主权协同人员，头像直接显示于卡片侧。'}
                    </p>

                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {COLLABORATORS.map((collab) => {
                        const chosen = selectedOwners.includes(collab.name);
                        return (
                          <div 
                            key={collab.name}
                            onClick={() => handleToggleOwner(collab.name)}
                            className="flex items-center justify-between p-2 rounded-xl border border-slate-100 bg-[#fbfcfd]/50 hover:bg-[#f1f5f9] cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={collab.avatar} 
                                alt={collab.name} 
                                className="w-6 h-6 rounded-full border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-xs font-bold text-slate-700">{collab.name}</span>
                            </div>
                            <span className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              chosen ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                            }`}>
                              {chosen && <Check className="w-3 h-3" />}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section F: Initial parameters custom tags & progress info */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-indigo-500" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isEn ? '6. Metric Initializers & Scope' : '6. 初始性能指标'}
                    </h3>
                  </div>

                  {/* Progress slide */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{isEn ? 'Design Completeness Index' : '基准指标完备度'}</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Dynamic Tags */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      {isEn ? 'Strategic Tags / Labels' : '关联领域标签组'}
                    </label>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {customTags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-150/40 rounded text-[9.5px] font-bold flex items-center gap-1.2"
                        >
                          <span>{tag}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTag(tag)}
                            className="bg-indigo-200/50 hover:bg-rose-100 hover:text-rose-600 w-3 h-3 rounded-full flex items-center justify-center text-[8.5px] ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-1.5 mt-2">
                      <input 
                        type="text"
                        placeholder={isEn ? '+ custom tag' : '+ 标签'}
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 text-[10px] px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 bg-slate-100 hover:bg-[#0f172a] hover:text-white border text-[10px] font-bold rounded-lg transition-colors"
                      >
                        {isEn ? 'Add' : '加'}
                      </button>
                    </div>

                    {/* Presets cloud */}
                    <div className="pt-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">{isEn ? 'Presets Cloud' : '推荐标签库'}</div>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_TAGS.map((tag) => {
                        const selected = customTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (!selected) {
                                setCustomTags(prev => [...prev, tag]);
                              } else {
                                handleRemoveTag(tag);
                              }
                            }}
                            className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold border transition-colors ${
                              selected 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* BUILD MAIN ACTION SPROUT */}
                <button
                  type="submit"
                  disabled={!nodeTitle.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 hover:from-blue-800 hover:via-indigo-800 hover:to-violet-800 disabled:from-slate-300 disabled:to-slate-350 disabled:cursor-not-allowed text-white text-xs font-black tracking-widest uppercase rounded-2xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 animate-pulse fill-white" />
                  <span>{isEn ? 'Forge & Sprout Component' : '熔铸高精指标并实体化 Sprout'}</span>
                </button>

              </div>

            </form>

          </div>
        )}

        {/* SUBTAB 2: ORIGINAL INTERACTIVE AGENT WORKFLOW DESIGNER SANDBOX */}
        {subTab === 'sandbox' && (
          <div className="flex h-full overflow-hidden">
            
            {/* Left lists */}
            <div className="w-[300px] bg-white border-r border-slate-101 p-4 shrink-0 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {isEn ? 'Specialized Agents (子代理)' : '专职常驻决策代理'}
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
                            ? 'border-indigo-500 bg-[#eef2ff]/30' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-[#f8fafc]/50'
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

              {/* Engine configuration details */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{isEn ? 'Memory Integrator' : '底册记忆检索结构'}</span>
                  <button 
                    onClick={handleToggleMemory}
                    className="text-[9.5px] font-extrabold uppercase px-2 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{selectedAgent.memoryEngine.toUpperCase()} ENGINE</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">{isEn ? 'Engine Technical Specs' : '引擎技术特性说明'}</div>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {selectedAgent.memoryEngine === 'vector' 
                      ? (isEn ? 'Highly semantic cosine vector database. Resolves raw user utterances to match ADRs.' : '自适应余弦相量存储体系。擅长对齐散放的客户口语叙断并匹配 ADR 文件句柄。')
                      : (isEn ? 'Predictable structural local key-value JSON schema. Ideal for deterministic state emitters.' : '高容断一阶 key-value 系统约束。更推荐服务于具备可预测特征的结构体广播。')}
                  </p>
                </div>
              </div>
            </div>

            {/* Visual canvas + Console outputs */}
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Visual flow canvas */}
              <div className="flex-1 relative bg-white border-b border-slate-100 dot-grid overflow-hidden">
                <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
                  <span className="text-[11px] font-extrabold text-slate-400 font-mono uppercase tracking-wider">
                    {isEn ? `Logical Graph: ${selectedAgent.name}` : `微决策计算图流: ${selectedAgent.name}`}
                  </span>
                  <button 
                    onClick={handleAddGraphNode}
                    className="px-2 py-1 bg-[#6366f1]/10 text-indigo-700 border border-indigo-100 rounded-lg hover:bg-indigo-50 hover:scale-105 transition-all text-[10px] font-extrabold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Add Node Block' : '追加计算层级'}</span>
                  </button>
                </div>

                {/* Simulated test trigger button */}
                <div className="absolute top-4 right-6 z-10">
                  <button 
                    onClick={handleSimulateExecution}
                    disabled={isSimulating}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-bold rounded-xl transition-all shadow flex items-center gap-1 active:scale-95 disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? (isEn ? 'Simulating...' : '验证管线校核中...') : (isEn ? 'Trigger Process Test' : '仿真跑通测试')}</span>
                  </button>
                </div>

                {/* SVG lines */}
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

                {/* Draggable workflow cards */}
                {selectedAgent.graphNodes.map((n) => {
                  const bgClass = n.type === 'trigger' 
                    ? 'from-emerald-50 to-teal-50/50 border-emerald-200 text-emerald-800'
                    : n.type === 'retrieve'
                      ? 'from-blue-50 to-indigo-50/50 border-blue-200 text-blue-850'
                      : n.type === 'gate'
                        ? 'from-orange-50 to-red-50/50 border-orange-200 text-orange-950'
                        : 'from-purple-50 to-pink-50/50 border-purple-200 text-purple-800';

                  return (
                    <div 
                      key={n.id}
                      className={`absolute w-[170px] bg-gradient-to-tr border p-3.5 rounded-2xl shadow-sm backdrop-blur-sm select-none transition-shadow hover:shadow ${bgClass}`}
                      style={{ left: n.x, top: n.y }}
                    >
                      <div className="flex items-center gap-2 mb-1 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span className="text-[8.5px] uppercase font-bold text-slate-400 font-mono tracking-wider">{n.type}</span>
                      </div>
                      <h4 className="text-xs font-extrabold tracking-tight leading-tight truncate pointer-events-none">{n.label}</h4>
                    </div>
                  );
                })}
              </div>

              {/* Console log footer */}
              <div className="h-[200px] bg-[#1e293b] flex flex-col border-t border-slate-850 shrink-0 select-text">
                <div className="flex justify-between items-center px-6 py-2 bg-[#0f172a] border-b border-slate-800/60 text-[9.5px] font-extrabold text-slate-400 font-mono shrink-0 select-none">
                  <span className="flex items-center gap-1.5 uppercase">
                    <Activity className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isEn ? 'SANDBOX SYSTEM INTERPRETATION CONSOLE' : '沙盒集成控制中心实时数据日志'}</span>
                  </span>
                  <button onClick={clearConsole} className="hover:text-white transition-all text-[8.5px]">
                    {isEn ? 'CLEAR OUTPUT' : '清除全部输出'}
                  </button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-1.5 font-mono text-xs text-slate-350">
                  {testConsole.map((msg, idx) => {
                    const isSystem = msg.includes('[System]');
                    const isError = msg.includes('[Error]') || msg.includes('[仿真探针]');
                    const isSuccess = msg.includes('[Success]') || msg.includes('[实体化成果]');

                    let color = 'text-slate-300';
                    if (isSystem) color = 'text-indigo-400';
                    if (isError) color = 'text-sky-300 font-semibold';
                    if (isSuccess) color = 'text-emerald-400 font-bold';

                    return (
                      <div key={idx} className={`${color} leading-relaxed`}>
                        {msg}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
