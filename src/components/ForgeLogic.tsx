/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  Check, 
  Sliders, 
  Compass, 
  Zap, 
  Eye, 
  Activity, 
  Radio, 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  RefreshCw,
  Clock,
  Layout,
  BookOpen,
  RotateCcw,
  Plus,
  Trash2,
  Play,
  Terminal,
  Save,
  Shield,
  Workflow,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { NodeData, NodeType, ChecklistItem, ForgeAgent } from '../types';
import { translations } from '../locales';

interface ForgeLogicProps {
  nodes?: NodeData[];
  setNodes?: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setActiveTab?: (tab: string) => void;
  setSelectedNodeId?: (id: string | null) => void;
  language?: 'en' | 'zh';
}

const DEFAULT_AGENTS: ForgeAgent[] = [
  {
    id: 'agent-feedback',
    name: 'User Feedback Semantic Analyzer',
    description: 'Decodes user sentiments and clusters qualitative design concerns into actionable Hearth nodes.',
    skeleton: 'react-loop',
    memoryEngine: 'vector',
    graphNodes: [
      { id: 'in', label: 'Feedback Input Gate', type: 'input', x: 20, y: 110 },
      { id: 'pn', label: 'Semantic Clusterer', type: 'tool', x: 170, y: 50 },
      { id: 'llm', label: 'Gemini Intent Decoder', type: 'llm', x: 170, y: 170 },
      { id: 'out', label: 'Hearth Sprout Sink', type: 'storage', x: 320, y: 110 }
    ],
    graphEdges: [
      { source: 'in', target: 'pn' },
      { source: 'in', target: 'llm' },
      { source: 'pn', target: 'out' },
      { source: 'llm', target: 'out' }
    ]
  },
  {
    id: 'agent-watcher',
    name: 'Oermos P2P Handshake Watchdog',
    description: 'Actively monitors Zurich networking channel latency and automatically spins alternative WebRTC tunnels.',
    skeleton: 'simple-reflector',
    memoryEngine: 'json',
    graphNodes: [
      { id: 'in', label: 'Oermos Ping Gate', type: 'input', x: 30, y: 110 },
      { id: 'check', label: 'Latency Analyzer', type: 'tool', x: 175, y: 110 },
      { id: 'out', label: 'Tunnel Re-router', type: 'storage', x: 320, y: 110 }
    ],
    graphEdges: [
      { source: 'in', target: 'check' },
      { source: 'check', target: 'out' }
    ]
  },
  {
    id: 'agent-auditor',
    name: 'Swiss Grid Graphic Auditor',
    description: 'Validates code layout parameters against rigid Swiss typographic norms (monospace, solid lines, flat panels).',
    skeleton: 'socratic-critique',
    memoryEngine: 'vector',
    graphNodes: [
      { id: 'in', label: 'JSX Grid Stream', type: 'input', x: 20, y: 50 },
      { id: 'rules', label: 'Aesthetics Standard DB', type: 'storage', x: 170, y: 110 },
      { id: 'audit', label: 'Socratic Grid Audit', type: 'llm', x: 20, y: 170 },
      { id: 'out', label: 'Format Fix Gate', type: 'validator', x: 320, y: 110 }
    ],
    graphEdges: [
      { source: 'in', target: 'rules' },
      { source: 'in', target: 'audit' },
      { source: 'rules', target: 'out' },
      { source: 'audit', target: 'out' }
    ]
  }
];

export default function ForgeLogic({
  nodes = [],
  setNodes,
  setActiveTab,
  setSelectedNodeId,
  language = 'en'
}: ForgeLogicProps) {
  const isEn = language === 'en';
  const tVal = translations[language].forge;

  // Forge Agents List State
  const [agents, setAgents] = useState<ForgeAgent[]>(() => {
    const saved = localStorage.getItem('hearth_forge_agents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_forge_agents', e);
      }
    }
    return DEFAULT_AGENTS;
  });

  const [activeAgentId, setActiveAgentId] = useState<string>(DEFAULT_AGENTS[0].id);

  // Active configure state handles
  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0] || DEFAULT_AGENTS[0];

  // Forms binding (for active agent)
  const [agentName, setAgentName] = useState(activeAgent.name);
  const [agentDesc, setAgentDesc] = useState(activeAgent.description);
  const [agentSkeleton, setAgentSkeleton] = useState(activeAgent.skeleton);
  const [agentMemory, setAgentMemory] = useState<any>(activeAgent.memoryEngine);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    isEn 
      ? `Act as an autonomous agent configured inside the Hearth workspace. Enforce systemic criteria and coordinate deliverables.`
      : `作为部署在赫斯协作底盘的自主常驻计算代理。负责处理拓扑计算、提供高安校验、保障系统演进。`
  );
  const [llmBackbone, setLlmBackbone] = useState<'flash' | 'pro'>('flash');

  // Interactive graph builder node handles
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Creation formulas for new nodes inside active graph
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'input' | 'llm' | 'tool' | 'validator' | 'storage'>('llm');

  // Simulator state handles
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simTaskText, setSimTaskText] = useState(
    isEn 
      ? 'Verify Swiss style alignment borders' 
      : '校验瑞士美学极简界面边框字距参数'
  );
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [simStep, setSimStep] = useState<number>(0);

  // Sync back local updates whenever properties drift
  useEffect(() => {
    localStorage.setItem('hearth_forge_agents', JSON.stringify(agents));
  }, [agents]);

  // Sync form inputs when switching active agent
  useEffect(() => {
    if (activeAgent) {
      setAgentName(activeAgent.name);
      setAgentDesc(activeAgent.description);
      setAgentSkeleton(activeAgent.skeleton);
      setAgentMemory(activeAgent.memoryEngine);
    }
  }, [activeAgentId]);

  // Handler to mutate properties on the active agent
  const handleUpdateActiveAgent = (updates: Partial<ForgeAgent>) => {
    setAgents(prev => prev.map(a => {
      if (a.id === activeAgentId) {
        return { ...a, ...updates };
      }
      return a;
    }));
  };

  // Create a brand new agent framework skele
  const handleCreateNewAgent = () => {
    const freshId = `agent-custom-${Date.now()}`;
    const newAgent: ForgeAgent = {
      id: freshId,
      name: isEn ? 'New Custom Agent Core' : '未命名新决策代理框架',
      description: isEn 
        ? 'Custom configured multi-agent workflow for sovereign computing.' 
        : '自主规划的主权计算流，执行特定高安性及审美审计逻辑。',
      skeleton: 'react-loop',
      memoryEngine: 'vector',
      graphNodes: [
        { id: 'in', label: 'Input Sink', type: 'input', x: 40, y: 110 },
        { id: 'proc', label: 'Decision Logic', type: 'llm', x: 180, y: 110 },
        { id: 'out', label: 'Output Sink', type: 'storage', x: 320, y: 110 }
      ],
      graphEdges: [
        { source: 'in', target: 'proc' },
        { source: 'proc', target: 'out' }
      ]
    };

    setAgents(prev => [...prev, newAgent]);
    setActiveAgentId(freshId);
    setNewNodeName('');
  };

  // Node actions inside visual graph
  const handleAddGraphNode = () => {
    if (!newNodeName.trim()) return;
    const nodeId = `node-${Date.now().toString().slice(-4)}`;
    const freshNode = {
      id: nodeId,
      label: newNodeName.trim(),
      type: newNodeType,
      x: 150 + Math.random() * 40,
      y: 80 + Math.random() * 40
    };

    handleUpdateActiveAgent({
      graphNodes: [...activeAgent.graphNodes, freshNode]
    });
    setNewNodeName('');
    setSelectedGraphNodeId(nodeId);
  };

  const handleRemoveGraphNode = (nodeId: string) => {
    const filteredNodes = activeAgent.graphNodes.filter(n => n.id !== nodeId);
    const filteredEdges = activeAgent.graphEdges.filter(e => e.source !== nodeId && e.target !== nodeId);
    
    handleUpdateActiveAgent({
      graphNodes: filteredNodes,
      graphEdges: filteredEdges
    });
    if (selectedGraphNodeId === nodeId) {
      setSelectedGraphNodeId(null);
    }
  };

  // Connect two nodes
  const handleToggleEdge = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const exists = activeAgent.graphEdges.some(e => e.source === sourceId && e.target === targetId);

    let updatedEdges;
    if (exists) {
      updatedEdges = activeAgent.graphEdges.filter(e => !(e.source === sourceId && e.target === targetId));
    } else {
      updatedEdges = [...activeAgent.graphEdges, { source: sourceId, target: targetId }];
    }

    handleUpdateActiveAgent({
      graphEdges: updatedEdges
    });
  };

  // Drag handlers in local workspace coordinate space
  const handleGraphNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGraphNodeId(nodeId);
    setDraggingNodeId(nodeId);

    const node = activeAgent.graphNodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      };
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    let nextX = e.clientX - rect.left - dragOffset.current.x;
    let nextY = e.clientY - rect.top - dragOffset.current.y;

    // Boundaries constraints
    nextX = Math.max(10, Math.min(410, nextX));
    nextY = Math.max(10, Math.min(235, nextY));

    handleUpdateActiveAgent({
      graphNodes: activeAgent.graphNodes.map(n => 
        n.id === draggingNodeId ? { ...n, x: Math.round(nextX), y: Math.round(nextY) } : n
      )
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Trigger high-tempo Sandbox simulations
  const handleTriggerSandboxRun = () => {
    setIsSimulating(true);
    setSimStep(0);
    setConsoleLogs([
      `[SYS]: Seeding telemetry workspace for model [${activeAgent.name.toUpperCase()}]`,
      `[INIT]: Mounting model skeleton [${agentSkeleton.toUpperCase()}] onto cognitive sandbox...`,
      `[COMPILER]: Backbone model assigned -> Gemini 2.5 ${llmBackbone === 'flash' ? 'COMPUTE-FLASH-SPEED' : 'REASONING-PRO-ENGINE'}`,
      `[MEMORY]: Synchronizing memory routing vectors: [${agentMemory.toUpperCase()}] integration locked.`,
      `[INPUT]: Trial payload: "${simTaskText}"`
    ]);

    const logTiers = [
      () => isEn 
        ? `[PLANNING]: Decomposing prompt. Decoupled 5 core pipeline constraints based on "${simTaskText}"` 
        : `[思考规划]: 解析决策条件。根据测试负载 "${simTaskText}" 解构5个核心约束条件。`,
      () => isEn
        ? `[RETRIEVAL]: Querying long-term memory engine [${agentMemory.toUpperCase()}]. Retrieved 14 similar architectural compliance patterns.`
        : `[记忆提取]: 正在加载深层记忆引擎 [${agentMemory.toUpperCase()}]。成功对齐检索到 14 项相似架构指标历史。`,
      () => {
        const inputNodes = activeAgent.graphNodes.filter(n => n.type === 'input');
        return isEn
          ? `[GRAPH]: Feeding input tokens stream through pipeline entry block [${inputNodes[0]?.label || 'Input'}].`
          : `[拓扑流转]: 输入元数据流成功注入计算图入口节点 [${inputNodes[0]?.label || 'Input Gate'}]。`;
      },
      () => {
        const toolNodes = activeAgent.graphNodes.filter(n => n.type === 'tool' || n.type === 'validator');
        const activeTool = toolNodes[0]?.label || (isEn ? 'Semantic Evaluator' : '系统语义审计器');
        return isEn
          ? `[TOOL RUN]: Invoking pipeline functional gate [${activeTool}]. Validating input bounds against Swiss alignment rules.`
          : `[工具调用]: 调用拓扑处理节点 [${activeTool}]。开始校验输入内容是否对齐瑞士极简排版规则。`;
      },
      () => {
        const llmNodes = activeAgent.graphNodes.filter(n => n.type === 'llm');
        const activeLlm = llmNodes[0]?.label || (isEn ? 'Gemini Auditor Core' : 'Gemini 大模型核心控制器');
        return isEn
          ? `[BACKBONE REASONING]: [${activeLlm}] evaluating results... Decision: 100% compliance checked. Zero design overlaps or socket packets delays detected.`
          : `[核心模型决策]: [${activeLlm}] 执行自省校验。得出结论：100% 对齐规范，零元素重叠或信道包冲突。`;
      },
      () => isEn
        ? `[SINK]: Syncing results to DB storage sink. Telemetry sandbox pipeline finished execution successfully.`
        : `[写入归档]: 输出状态已更新保存至输出数据端。沙盒管道仿真测试成功终结，管线完全正常。`
    ];

    let step = 0;
    const timer = setInterval(() => {
      if (step < logTiers.length) {
        setConsoleLogs(prev => [...prev, logTiers[step]()]);
        setSimStep(step + 1);
        step++;
      } else {
        clearInterval(timer);
        setIsSimulating(false);
      }
    }, 900);
  };

  // Deploy custom constructed agent to overall application list
  const handleDeployToHearth = () => {
    if (!setNodes || !setActiveTab || !setSelectedNodeId) {
      alert('Workspace engine failed to load parent scope hooks.');
      return;
    }

    const freshNodeId = `agent-node-${Date.now()}`;
    
    // Convert graph nodes/edges into sub tasks in node checklist
    const checklistItems: ChecklistItem[] = activeAgent.graphNodes.map((n, i) => ({
      id: `task-${freshNodeId}-${i}`,
      text: isEn 
        ? `Verify pipeline stage: ${n.label} (${n.type.toUpperCase()})` 
        : `核验管线节点: ${n.label} [类型: ${n.type.toUpperCase()}]`,
      done: false
    }));

    const deployedNode: NodeData = {
      id: freshNodeId,
      type: 'agent',
      title: activeAgent.name,
      description: isEn 
        ? `${activeAgent.description} [Arch: ${agentSkeleton.toUpperCase()}]. Executed on Gemini ${llmBackbone === 'flash' ? 'Flash' : 'Pro'}.` 
        : `${activeAgent.description} [决策架构: ${agentSkeleton.toUpperCase()}]。依托模型: Gemini ${llmBackbone === 'flash' ? 'Flash' : 'Pro'}。`,
      x: 480 + Math.random() * 120,
      y: 280 + Math.random() * 120,
      progress: 0,
      members: ['ceaserzhao', activeAgent.name],
      checklist: [
        { id: `init-${freshNodeId}`, text: isEn ? 'Verify connection topology and tools input gating' : '核准计算拓扑及首端输入门道', done: true },
        ...checklistItems
      ],
      tags: ['Agent', agentSkeleton, agentMemory === 'vector' ? 'Vector-RAG' : 'JSON-DB'],
      connections: ['project-a', 'user-research'],
      star: false,
      createdAt: new Date().toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' }),
      updatedAt: new Date().toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' }),
      status: 'active',
      syncStatus: 'synced',
      authorId: 'ceaserzhao',
      version: 1
    };

    setNodes(prev => [...prev, deployedNode]);
    setSelectedNodeId(freshNodeId);

    // Prompt user and switch active view
    setActiveTab('fieldmap');
  };

  // Delete an entire agent profile
  const handleDeleteAgent = (idToDelete: string) => {
    if (agents.length <= 1) {
      alert(isEn ? 'Cannot delete last remaining agent core. Hearth needs at least one builder skeleton!' : '不能移除最后一个代理骨架。赫斯生态需要至少保留一台代理基础模型。');
      return;
    }
    const rem = agents.filter(a => a.id !== idToDelete);
    setAgents(rem);
    if (activeAgentId === idToDelete) {
      setActiveAgentId(rem[0].id);
    }
  };

  return (
    <div id="agent-skeleton-forge-studio" className="flex-1 flex flex-col h-full bg-[#fafafa] text-slate-800 overflow-hidden relative font-sans select-none">
      
      {/* Visual top border styling */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-600/10 to-transparent" />

      {/* HEADER STATUS */}
      <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between z-10 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-widest text-[9.5px] uppercase text-indigo-600 font-mono">
              {tVal.subLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-[9px] text-[#22c55e] font-mono font-bold tracking-wider">
              PIPELINE DESIGNS (ADR-007 MODE)
            </span>
          </div>
          <h1 className="text-base font-black text-[#0f172a] uppercase tracking-tight leading-none mt-1">
            {tVal.title}
          </h1>
        </div>

        <div className="flex gap-2">
          {/* Create agent button */}
          <button
            onClick={handleCreateNewAgent}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? "New Agent Framework" : "自主雕琢新代理解析器"}</span>
          </button>
        </div>
      </div>

      {/* THREE LAYOUT COLUMNS GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PANEL A: AGENT DIRECTORY & SKELETON TREE (Grid size 3 equivalent) */}
        <div className="w-[280px] border-r border-slate-100 bg-[#f8fafc]/90 flex flex-col justify-between shrink-0 overflow-y-auto p-5 space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{tVal.specializedAgents} ({agents.length})</span>
            </h4>

            {/* List of available agents config */}
            <div className="space-y-2.5">
              {agents.map((ag) => {
                const isActive = ag.id === activeAgentId;
                return (
                  <div
                    key={ag.id}
                    onClick={() => setActiveAgentId(ag.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all select-none relative group ${
                      isActive 
                        ? 'border-indigo-600 bg-white shadow-sm' 
                        : 'border-slate-200/50 bg-[#fafafa]/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-black truncate max-w-[150px] block ${isActive ? 'text-indigo-600' : 'text-slate-800'}`}>
                          {ag.name}
                        </span>
                        
                        <button
                          title={isEn ? "Prune framework" : "裁剪此骨架方案"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAgent(ag.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-300 transition-opacity p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 font-bold leading-normal mt-1 line-clamp-1">
                        {ag.description}
                      </p>
                    </div>

                    <div className="flex gap-1.5 mt-2.5.5 border-t border-slate-100/60 pt-2 flex-wrap text-[8.5px] font-mono leading-none">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-semibold uppercase">
                        {ag.skeleton}
                      </span>
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-semibold uppercase">
                        {ag.memoryEngine}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guide tip box */}
          <div className="p-4 bg-white border border-slate-200/60 rounded-2xl space-y-1.5 text-[10.5px] font-bold text-slate-400 leading-normal">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <p>
              {isEn 
                ? "Agent configurations build workflows that autonomously process, analyze and check rules inside Project Space, running decoupled from Hey Companion."
                : "在此构建的决策代理将作为专职的管线节点，在您的大盘、项目面板及各边界工作区内协助跑代码、核验协议，属于多代理系统的自主业务层，不受主体 companion Hey 人格变迁的干预。"}
            </p>
          </div>
        </div>


        {/* PANEL B: WORKBENCH & GRAPH DESIGNER (Middle Column - Flexible space) */}
        <div className="flex-1 border-r border-slate-100 flex flex-col justify-between overflow-y-auto p-6 bg-white space-y-6">
          
          {/* Agent core meta parameters form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">
                {isEn ? "Agent Identity Label" : "代理注册标识名称"}
              </label>
              <input 
                type="text"
                value={agentName}
                onChange={(e) => {
                  setAgentName(e.target.value);
                  handleUpdateActiveAgent({ name: e.target.value });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="Data Aggregator Core..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">
                {isEn ? "Agent Executive Purpose" : "自主执行职责提炼"}
              </label>
              <input 
                type="text"
                value={agentDesc}
                onChange={(e) => {
                  setAgentDesc(e.target.value);
                  handleUpdateActiveAgent({ description: e.target.value });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
                placeholder="Identify bottlenecks inside pipeline..."
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Interactive Topology Graph Canvas */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-indigo-600" />
                <span className="text-[10.5px] font-black uppercase text-indigo-900 font-mono tracking-wider">
                  {tVal.logicalGraph}
                </span>
                <span className="text-[9.5px] text-slate-400 font-semibold">
                  {isEn ? "(Drag nodes to reposition; select a node to configure or connect)" : "(拖拽节点调整物理等宽对齐网格; 点击首节点并在右边点击完成连接)"}
                </span>
              </div>

              {selectedGraphNodeId && (
                <button
                  type="button"
                  onClick={() => handleRemoveGraphNode(selectedGraphNodeId)}
                  className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 transition-colors"
                >
                  {isEn ? "Delete Selected Node" : "裁剪选中的计算块"}
                </button>
              )}
            </div>

            {/* Simulated Interactive SVG Canvas Area */}
            <div
              ref={canvasRef}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className="relative w-full h-[255px] bg-[#0c0d19] border border-slate-900 rounded-2xl overflow-hidden shadow-inner cursor-crosshair select-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 1.2px, transparent 1.2px)',
                backgroundSize: '16px 16px'
              }}
            >
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <defs>
                  <marker
                    id="arrow-forge"
                    viewBox="0 0 10 10"
                    refX="18"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
                  </marker>
                </defs>

                {/* Render Directed Connecting Pathways */}
                {activeAgent.graphEdges.map((edge, index) => {
                  const sourceNode = activeAgent.graphNodes.find(n => n.id === edge.source);
                  const targetNode = activeAgent.graphNodes.find(n => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const x1 = sourceNode.x + 60;
                  const y1 = sourceNode.y + 20;
                  const x2 = targetNode.x + 60;
                  const y2 = targetNode.y + 20;

                  return (
                    <g key={`edge-${index}`}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#6366f1"
                        strokeWidth="3"
                        strokeOpacity="0.12"
                      />
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={selectedGraphNodeId === edge.source ? '#818cf8' : '#4f46e5'}
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                        markerEnd="url(#arrow-forge)"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Display individual drag nodes */}
              {activeAgent.graphNodes.map((node) => {
                const isSelected = selectedGraphNodeId === node.id;
                
                let themeClasses = "";
                switch(node.type) {
                  case 'input':
                    themeClasses = "bg-[#0b162a]/95 border-blue-500/80 text-blue-100 hover:border-blue-400";
                    break;
                  case 'llm':
                    themeClasses = "bg-[#180a22]/95 border-purple-500/80 text-purple-100 hover:border-purple-400";
                    break;
                  case 'tool':
                    themeClasses = "bg-[#0a1e1b]/95 border-emerald-500/80 text-emerald-100 hover:border-emerald-400";
                    break;
                  case 'validator':
                    themeClasses = "bg-[#1e190a]/95 border-amber-500/80 text-amber-100 hover:border-amber-400";
                    break;
                  case 'storage':
                    themeClasses = "bg-[#0a1d20]/95 border-cyan-500/80 text-cyan-100 hover:border-cyan-400";
                    break;
                }

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleGraphNodeMouseDown(node.id, e)}
                    className={`absolute w-[120px] rounded-xl border p-2 text-left cursor-grab active:cursor-grabbing transition-shadow duration-150 select-none ${themeClasses} ${
                      isSelected ? 'ring-2 ring-indigo-500/70 scale-[1.03] shadow-[0_4px_12px_rgba(99,102,241,0.3)] border-indigo-400' : 'shadow-sm'
                    }`}
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className="flex justify-between items-start mb-0.5 pointer-events-none">
                      <span className="text-[9.5px] font-black tracking-wide font-sans truncate pr-1">
                        {node.label}
                      </span>
                      <span className="text-[7.5px] font-mono font-black uppercase tracking-widest shrink-0 opacity-80">
                        {node.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/40 text-[7px] font-mono leading-none opacity-60">
                      <span>#{node.id}</span>
                      {selectedGraphNodeId && selectedGraphNodeId !== node.id && (
                        <button
                          type="button"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => handleToggleEdge(selectedGraphNodeId, node.id)}
                          className="text-xs text-indigo-400 font-bold hover:text-white px-1"
                          title={isEn ? "Toggle targeted linkage" : "切换与此节点的连线"}
                        >
                          → link
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Graph Node Spawner Toolbar */}
            <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center gap-3">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase whitespace-nowrap">
                {tVal.addBlock}:
              </span>
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder={isEn ? "E.g., CSS Monospace Parser" : "比如: 等等宽布局识别器"}
                className="flex-1 bg-white border border-slate-250 rounded-lg px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
              />
              <select
                value={newNodeType}
                onChange={(e: any) => setNewNodeType(e.target.value)}
                className="bg-white border border-slate-250 text-slate-600 rounded-lg px-2 py-1 text-[10.5px] focus:outline-none font-bold"
              >
                <option value="input">Input Gate</option>
                <option value="llm">LLM Reasoning</option>
                <option value="tool">Wrench Tool</option>
                <option value="validator">Aesthetic Validator</option>
                <option value="storage">DB Sink</option>
              </select>
              <button
                type="button"
                onClick={handleAddGraphNode}
                disabled={!newNodeName.trim()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-[10.5px] font-bold disabled:opacity-40 transition-colors whitespace-nowrap"
              >
                {isEn ? "Inject Block" : "加入拓扑"}
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Prompt logic configurations */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider block">
                {isEn ? "Agent Primary Role Guidelines / Base prompt instructions" : "常驻代理核心系统提示语设定 (System Prompts Guidelines)"}
              </label>
              <span className="text-[9.5px] text-[#22c55e] font-mono flex items-center gap-1">
                <Check className="w-3 h-3 text-[#22c55e]" /> DECOUPLED SANITY SIGNED
              </span>
            </div>

            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder={isEn ? "Prefix the exact system rules guiding this agent skeleton run..." : "在此输入驱动大模型的底层系统指令 guidelines..."}
              className="w-full text-xs p-3.5 border rounded-2xl bg-[#fcfeff] text-slate-800 leading-relaxed font-bold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>

        </div>


        {/* PANEL C: RUN TESTS SIMULATOR & DEPLOY GATEWAY (Right Column - Grid size 4 equivalent) */}
        <div className="w-[340px] bg-slate-950 text-slate-200 border-l border-slate-900 flex flex-col justify-between shrink-0 overflow-y-auto p-5 space-y-6">
          
          {/* Settings Segment panel */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{tVal.engineDetails}</span>
            </h4>

            {/* Backbone Selection buttons */}
            <div className="space-y-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div>
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">
                  BACKBONE MODEL LAYER
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLlmBackbone('flash')}
                    className={`flex-1 py-1 px-2.5 rounded text-[10px] font-bold border transition-all ${
                      llmBackbone === 'flash'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold'
                        : 'border-slate-800 text-slate-400 bg-slate-950/40 hover:text-slate-200'
                    }`}
                  >
                    Gemini 2.5 Flash
                  </button>
                  <button
                    onClick={() => setLlmBackbone('pro')}
                    className={`flex-1 py-1 px-2.5 rounded text-[10px] font-bold border transition-all ${
                      llmBackbone === 'pro'
                        ? 'bg-violet-600/20 border-violet-500 text-violet-400 font-extrabold'
                        : 'border-slate-800 text-slate-400 bg-slate-950/40 hover:text-slate-200'
                    }`}
                  >
                    Gemini 2.5 Pro
                  </button>
                </div>
              </div>

              {/* Layout Skeleton */}
              <div>
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">
                  PLAN SKELETON ARCHITECTURE
                </label>
                <select
                  value={agentSkeleton}
                  onChange={(e) => {
                    setAgentSkeleton(e.target.value);
                    handleUpdateActiveAgent({ skeleton: e.target.value });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                >
                  <option value="react-loop">ReAct Plan-Action Loop</option>
                  <option value="simple-reflector">Simple Reflector Stream</option>
                  <option value="socratic-critique">Socratic Critical Audit</option>
                  <option value="orchestrator-swarm">Swarm Orchestrator Cluster</option>
                </select>
              </div>

              {/* Memory mode */}
              <div>
                <label className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-wider block mb-1">
                  {tVal.memoryIntegrator}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAgentMemory('vector');
                      handleUpdateActiveAgent({ memoryEngine: 'vector' });
                    }}
                    className={`flex-1 py-1 px-2 text-[9.5px] rounded border transition-all ${
                      agentMemory === 'vector'
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-extrabold'
                        : 'border-slate-800 text-slate-400 bg-slate-950/40'
                    }`}
                  >
                    Vector Embeds RAG
                  </button>
                  <button
                    onClick={() => {
                      setAgentMemory('json');
                      handleUpdateActiveAgent({ memoryEngine: 'json' });
                    }}
                    className={`flex-1 py-1 px-2 text-[9.5px] rounded border transition-all ${
                      agentMemory === 'json'
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-extrabold'
                        : 'border-slate-800 text-slate-400 bg-slate-950/40'
                    }`}
                  >
                    Deterministic JSON DB
                  </button>
                </div>
                <span className="text-[8.5px] text-slate-500 block leading-normal mt-1.5 font-sans font-semibold">
                  {agentMemory === 'vector' ? tVal.vectorDetails : tVal.jsonDetails}
                </span>
              </div>
            </div>
          </div>

          {/* SIMULATOR TEST TRIAL BOX */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{tVal.runSandbox}</span>
            </h4>

            <div className="space-y-3">
              <input
                type="text"
                value={simTaskText}
                onChange={(e) => setSimTaskText(e.target.value)}
                placeholder={isEn ? "E.g., Parse competitive files" : "例如：提炼 Oasis 公司的对接规范文件..."}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
              />

              {/* Simulation button */}
              <button
                type="button"
                onClick={handleTriggerSandboxRun}
                disabled={isSimulating}
                className="w-full py-2.5 bg-white hover:bg-[#eef2ff] hover:text-indigo-600 disabled:opacity-40 text-slate-900 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                {isSimulating ? (
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                )}
                <span>{isSimulating ? tVal.simulating : tVal.runSandbox}</span>
              </button>
            </div>

            {/* Simulation console terminal logs */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono font-black text-slate-400 block uppercase">
                {tVal.consoleTitle}
              </span>
              <div className="w-full h-[150px] bg-black border border-slate-900 rounded-2xl p-4 font-mono text-[9px] text-[#22c55e] leading-relaxed overflow-y-auto space-y-1 scrollbar-none shadow-inner border-t border-t-slate-800/40">
                {consoleLogs.map((log, index) => (
                  <p key={index} className="transition-all duration-300">
                    {log}
                  </p>
                ))}

                {consoleLogs.length === 0 && (
                  <div className="text-center text-slate-600 py-10 font-bold">
                    [CONSOLE EMPTY. READY TO TRAIN AND CALIBRATE]
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-950" />

          {/* SINK SPROUT DEDEPLOYMENT GATE */}
          <div className="space-y-3.5">
            <button
              onClick={handleDeployToHearth}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-extrabold text-xs tracking-widest uppercase rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-97 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 animate-spin-slow" />
              <span>{isEn ? "Deploy Agent framework to Canvas" : "部署此代理架至 Field Map 大屏大屏"}</span>
            </button>
            <p className="text-[9px] text-slate-500 font-semibold leading-normal font-sans text-center">
              {isEn 
                ? "Physical model deployment wraps selected skeletal components, emitting a custom micro-intelligence node with interactive checklist processes onto Field Map."
                : "一键部署会将该精心校准的计算代理编译发布，在大局画布 Field Map 上快速唤生一颗带独立算法校验、工具流程连线的微智能卡块节点。"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
