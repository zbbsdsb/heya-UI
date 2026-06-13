/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Code, 
  Terminal, 
  GitBranch, 
  Database, 
  Layers, 
  CheckCircle2, 
  Link2, 
  Navigation, 
  Compass, 
  Settings, 
  Activity, 
  HelpCircle,
  Clock,
  Plus,
  Trash2,
  Cpu,
  RefreshCw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon,
  Play,
  RotateCcw,
  Zap,
  Globe,
  Sliders,
  ChevronDown,
  ChevronUp,
  Boxes
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NodeData, NodeType, ChecklistItem, Binder } from '../types';
import HearthFolderExplorer from './HearthFolderExplorer';
import HearthComponentSimulator from './HearthComponentSimulator';
import HearthBinderHub from './HearthBinderHub';

interface ComponentSpaceViewProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  selectedNodeId: string;
  setSelectedNodeId: (id: string | null) => void;
  language: 'en' | 'zh';
  setActiveTab: (tab: string) => void;
}

export default function ComponentSpaceView({
  nodes,
  setNodes,
  selectedNodeId,
  setSelectedNodeId,
  language,
  setActiveTab
}: ComponentSpaceViewProps) {
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Collapsible component selector menu state
  const [isComponentSelectorOpen, setIsComponentSelectorOpen] = useState(true);

  // Icon mapper helper
  const getSubNodeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Layers className="w-3.5 h-3.5 text-indigo-505" />;
      case 'todo': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-505" />;
      case 'agent': return <Cpu className="w-3.5 h-3.5 text-purple-505" />;
      case 'muse': return <Sparkles className="w-3.5 h-3.5 text-pink-505" />;
      default: return <Database className="w-3.5 h-3.5 text-amber-505" />;
    }
  };

  // Global view presentation mode: Cockpit (Integrated Split Columns) vs Classic (Separated Full Screen Tabs)
  const [isCockpitView, setIsCockpitView] = useState(true);

  // Define active sub-tab for the classic view (or the interactive sub-tab inside Cockpit's right lane)
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'simulator' | 'milestones' | 'infrastructure'>('code');

  // Simulated states for HearthComponentSimulator inside this workspace
  const [computingHash, setComputingHash] = useState(false);
  const [computedHashCode, setComputedHashCode] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [horizonProtocol, setHorizonProtocol] = useState('Heuristic Gravity');
  const [divergenceVal, setDivergenceVal] = useState(50);
  const [musePromptText, setMusePromptText] = useState('');
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // COCKPIT EXCLUSIVE PIPELINE SIMULATOR STATES
  const [simStep, setSimStep] = useState<'idle' | 'ingress' | 'compile' | 'cognitive' | 'dispatch'>('idle');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(-1);
  const [simPayload, setSimPayload] = useState('{"query": "Validate decentralized telemetry sync", "entropy_factor": 0.85}');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [gateInputs, setGateInputs] = useState<boolean[]>([true, true, false]);
  const [simPerformance, setSimPerformance] = useState<{
    latency: number;
    tokens: number;
    cpu: string;
    gateResult: boolean;
  }>({
    latency: 0,
    tokens: 0,
    cpu: "0.2%",
    gateResult: true
  });

  // Calculate logic gate result live
  const getGateOutcome = () => {
    const op = selectedNode?.logicalOperator || 'AND';
    if (op === 'AND') return gateInputs.every(v => v);
    if (op === 'OR') return gateInputs.some(v => v);
    if (op === 'XOR') {
      const trueCount = gateInputs.filter(v => v).length;
      return trueCount === 1; // standard multibit XOR or parity odd
    }
    if (op === 'NOT') return !gateInputs[0];
    return true; // default raw input
  };

  const gatePassed = getGateOutcome();

  // Localization for the workspace
  const textLocal = {
    en: {
      backBtn: "Dashboard",
      tabCode: "Sovereign IDE",
      tabSim: "Manual Sim Inputs",
      tabMilestones: "Target Checklist",
      tabInfra: "Hardware Bindings",
      classLabel: "Class",
      statusLabel: "Status",
      completed: "Completed",
      active: "Active",
      archived: "Archived",
      draft: "Draft",
      syncLabel: "Sync Status",
      progress: "Sprints Completion",
      coordinates: "Physical Coordinates Calibration",
      crossPipeline: "Cross-Pipeline Signal Route Linkage",
      connectBtn: "+ Wire Link",
      connectedBtn: "✓ Connected",
      shiftUp: "Shift North (+Y)",
      shiftDown: "Shift South (-Y)",
      shiftLeft: "Shift West (-X)",
      shiftRight: "Shift East (+X)",
      milestonePlaceholder: "Define logical checkpoint for this component...",
      milestonesHeader: "Operational Checkpoints",
      addMilestoneBtn: "Commit Milestone",
      emptyMilestones: "No checkpoint milestones established for this component.",
      deleteNode: "Retire Component",
      deleteConfirm: "Are you sure you want to completely unregister and discharge this component from the system?",
      unregistered: "Component permanently retired from central index.",
      cockpitTitle: "Sovereign Pipeline Cockpit",
      cockpitSubtitle: "Coordinated sandbox orchestrating live visual telemetry, logic gates, code editors, and AI cognitive traces side-by-side.",
      classicTitle: "Tabbed Workstation Panels",
      classicSubtitle: "Isolated individual panels focusing cleanly on individual data structures of this node."
    },
    zh: {
      backBtn: "返回主看板",
      tabCode: "编译环境 IDE",
      tabSim: "参数底层微调",
      tabMilestones: "断言保障清单",
      tabInfra: "物理与云端绑定",
      classLabel: "架构类别",
      statusLabel: "生命周期状态",
      completed: "已完成",
      active: "运行中",
      archived: "已归档",
      draft: "草稿",
      syncLabel: "物理同步",
      progress: "管线达成度",
      coordinates: "物理信标坐标微调",
      crossPipeline: "下行物理管路信号路由",
      connectBtn: "+ 绑定链路",
      connectedBtn: "✓ 链路已建立",
      shiftUp: "信标偏北 (+Y)",
      shiftDown: "信标偏南 (-Y)",
      shiftLeft: "信标偏西 (-X)",
      shiftRight: "信标偏东 (+X)",
      milestonePlaceholder: "拟定本组件的物理或逻辑校验断言...",
      milestonesHeader: "系统检查点审计",
      addMilestoneBtn: "提交检查断言",
      emptyMilestones: "当前组件下暂未制定核心物理检查项。",
      deleteNode: "安全注销组件",
      deleteConfirm: "确定要将此拓扑单元物理注销并从核心矩阵中断开吗？",
      unregistered: "组件拓扑宿主单元已被永久注销。",
      cockpitTitle: "Hearth 战术动力协同驾驶舱",
      cockpitSubtitle: "高精度、一体化协同开发台，将输入信号门、动态管线拓扑、IDE源码、自主AI侧翼及输出模拟日志融合在统一视界下运行。",
      classicTitle: "分离式微操仪表盘",
      classicSubtitle: "传统页签切换视图，对单体组件的各项物理定义参数进行独立管理。"
    }
  };

  const currentText = textLocal[language];

  // Set internal action flows dynamically based on selected component type
  const getInternalFlowSteps = (type: NodeType) => {
    switch (type) {
      case 'project':
        return [
          { label: "Ingress Gate Check", desc: "Verifies logic operator status pins", file: "RegistryCanvas.tsx" },
          { label: "Active Engine Core", desc: "Syncs physical matrix boundaries", file: "HearthSovereignHub.tsx" },
          { label: "Micro-Kernel Host", desc: "Fires localized telemetry containers", file: "main.tsx" },
          { label: "Signal Proxy Relay", desc: "Spreads packets to connected downlinks", file: "signal_relay.go" }
        ];
      case 'todo':
        return [
          { label: "Ingress Criteria Check", desc: "Parses target trigger properties", file: "01_validate.rs" },
          { label: "Crypto-Sign Guard", desc: "Runs SHA security bundle hashes", file: "02_cryptosign.rs" },
          { label: "Sandbox Isolated Exec", desc: "Launches code in test isolation process", file: "03_sandbox_exec.rs" },
          { label: "Milestone Constraint audit", desc: "Auto-reconciles checklist assertions", file: "04_assertions.rs" }
        ];
      case 'agent':
        return [
          { label: "Ingress Entropy Gate", desc: "Filters command injection scripts", file: "system_seed_inst.md" },
          { label: "Autonomous Brain Seed", desc: "Binds model weight coefficients", file: "agent_brain_node.py" },
          { label: "Semantic Cognitive Loop", desc: "Drives recursive thought trace schemas", file: "reflexive_thinking.json" },
          { label: "Neural Handshake Broadcast", desc: "Fires contextual output packet streams", file: "scheduler_cron.py" }
        ];
      case 'muse':
        return [
          { label: "Inbound Chaos Seed", desc: "Injects dynamic entropy weight vectors", file: "creative_outbreak.canvas" },
          { label: "Entropy Weight Vector", desc: "Spawns rebellious concept weights", file: "divergence_factor.bin" },
          { label: "Matrix Concept Map", desc: "Arranges multi-node brainstorming vectors", file: "unstructured_draft.txt" },
          { label: "Fleeting Spark Capture", desc: "Discharges findings to idea library", file: "spark_discharge.rs" }
        ];
      default:
        return [
          { label: "Sensor Signal Input", desc: "Evaluates inbound physical pins state", file: "v001_initial_schema.sql" },
          { label: "Database Relational Seeder", desc: "Runs safe structural coordinate migrations", file: "v002_seeding_data.sql" },
          { label: "SHA-255 Registry Cipher", desc: "Flashes code fingerprint signature bytes", file: "sha_registry.lock" },
          { label: "Cloudflare R2 Bucket Sync", desc: "Offloads static asset backups", file: "r2_bucket_config.json" }
        ];
    }
  };

  const internalFlowSteps = getInternalFlowSteps(selectedNode?.type || 'project');

  // Load trace console defaults on render
  useEffect(() => {
    if (selectedNode) {
      const initLogs = [
        `[HEARTH-COCKPIT] Unified pipeline cockpit active for target: [${selectedNode.title}]`,
        `[HEARTH-COCKPIT] Ingress Operator configured to [${selectedNode.logicalOperator || 'AND'}] with 3 physical input pins.`,
        `[HEARTH-COCKPIT] Linked downlink connections in registry map: [${selectedNode.connections.join(' , ') || 'none'}].`,
        `[HEARTH-COCKPIT] Command terminal initialized. Type custom payload below and run compiled diagnostics.`
      ];
      setSimLogs(initLogs);
      setSimStep('idle');
      setActivePipelineStep(-1);
    }
  }, [selectedNodeId, selectedNode?.id, selectedNode?.logicalOperator]);

  // Handle simulated diagnostic scans
  const handleAgentScan = () => {
    if (!selectedNode) return;
    (window as any).playTactileChime?.('click');
    const logs = [
      `[DIAGNOSTICS] Commencing telemetry audit on target cluster layout...`,
      `[DIAGNOSTICS] Analyzed cross-pipeline linkages. Connected targets: [${selectedNode.connections.join(', ') || 'none'}]`,
      `[DIAGNOSTICS] Static type integrity verifies: 100% compliant with Switzerland Typographical specifications.`
    ];
    setAgentLogs(prev => [...prev, ...logs]);
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Diagnostic scan complete. Component status normal.' : '主权检测完毕，环境反馈值全绿！', 
        type: 'success' 
      }
    }));
  };

  // Handle simulated hash calculations
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
          message: language === 'en' ? 'Hash fingerprint successfully signed.' : '防篡改加密签名已验证并签署。', 
          type: 'success' 
        }
      }));
    }, 1000);
  };

  // Handle local ideation prompt simulation
  const handleLocalMuseCast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musePromptText.trim()) return;
    (window as any).playTactileChime?.('click');
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' 
          ? 'Ideation seed committed to cluster memory.' 
          : '创新火神灵感已注入到后端簇群！', 
        type: 'info' 
      }
    }));
    setMusePromptText('');
  };

  if (!selectedNode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
        <Compass className="w-12 h-12 text-slate-350 animate-pulse mb-4" />
        <p className="text-sm font-bold text-slate-400 font-mono">
          {language === 'en' ? 'Select an active Component Space from the left sidebar' : '请在左侧折叠侧栏中选择一个组件空间'}
        </p>
      </div>
    );
  }

  // RUN COMPLEX SIMULATOR TELEMETRY FLOWPIPELINE
  const executeCockpitSimulation = async () => {
    if (simStep !== 'idle') return;
    (window as any).playTactileChime?.('route');

    const op = selectedNode.logicalOperator || 'AND';
    const computedGateOutcome = getGateOutcome();

    setSimLogs([
      `[SIMULATOR-SEED] Firing telemetry sequence at ${new Date().toLocaleTimeString()} ...`,
      `[SIMULATOR-SEED] Component Type Target: ${selectedNode.type.toUpperCase()} / UUID: ${selectedNode.id}`,
      `[STAGE 1: INGRESS GATES] Evaluating physical input logical constraints...`,
      `[STAGE 1: INGRESS GATES] Operator parameter: ${op} (${gateInputs.map((b, i) => `Pin-${i+1}: ${b ? 'HIGH' : 'LOW'}`).join(', ')})`
    ]);

    setSimStep('ingress');
    setActivePipelineStep(0);

    // Step 1: Ingress Logic Evaluation
    await new Promise(r => setTimeout(r, 900));
    setSimPerformance({
      latency: 18,
      tokens: 0,
      cpu: "1.4%",
      gateResult: computedGateOutcome
    });

    if (!computedGateOutcome) {
      setSimLogs(prev => [
        ...prev,
        `[STAGE 1: HALT] ❌ Ingress Logical conform check FAILED! Flow packet rejected at gate [${op}].`,
        `[STAGE 1: ERROR] Execution pipeline aborted due to unfulfilled coordinate trigger pins. Status set to Offline/Idle.`
      ]);
      setSimStep('idle');
      setActivePipelineStep(-1);
      (window as any).playTactileChime?.('alert');
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: language === 'en' ? 'Ingress Logical Gate conform checks failed!' : '物理输入逻辑门校验失败！管线已安全自动熔断。', 
          type: 'warn' 
        }
      }));
      return;
    }

    setSimLogs(prev => [
      ...prev,
      `[STAGE 1: SUCCESS] ✓ Ingress conform test passed successfully. Gate output evaluates to HIGH.`,
      `[STAGE 2: COMPILER] Initializing physical code safety compiler for target source file: "${internalFlowSteps[1].file}"...`,
      `[STAGE 2: COMPILER] Commenced full static analysis scan & syntax compliance tests.`
    ]);
    (window as any).playTactileChime?.('success');
    setSimStep('compile');
    setActivePipelineStep(1);

    // Step 2: Compiler and Crypto digest calculation
    await new Promise(r => setTimeout(r, 1200));
    const randomHash = 'SHA-256_' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
    
    setSimLogs(prev => [
      ...prev,
      `[STAGE 2: COMPILER] Dynamic compilation completed in 242ms. Zero syntax anomalies found.`,
      `[STAGE 2: INTEGRITY] Computed safe physical file signature bundle digest: [${randomHash}]`,
      `[STAGE 2: INTEGRITY] Verified target physical size: ${(12 + Math.random() * 85).toFixed(2)} KB.`,
      `[STAGE 3: COGNITIVE RETAINER] Loading associate seed instruction instructions: "${internalFlowSteps[2].file}"`,
      `[STAGE 3: COGNITIVE RETAINER] Harnessing local context parameters. Rebellion Coefficient set to ${divergenceVal}%.`
    ]);
    setSimPerformance(prev => ({
      ...prev,
      latency: 110,
      cpu: "8.4%"
    }));
    setSimStep('cognitive');
    setActivePipelineStep(2);

    // Step 3: Cognitive Loop/Logic execution (for Agent class, output LLM style. For others, do typical logic processing)
    await new Promise(r => setTimeout(r, 1500));
    
    let associativeResponse = "";
    if (selectedNode.type === 'agent') {
      associativeResponse = `[STAGE 3: AGITATOR DISPATCH] Outputting Autonomous feedback stream:\n\n` + 
        `======================= SYSTEM DELEGATE RESPONSE =======================\n` +
        `● [Cognitive Core] Resolved command sequence query: "${simPayload.slice(0, 60)}..."\n` +
        `● [Divergence Weights] Evaluated contextual graph mappings. Autonomic system triggers intact.\n` +
        `● [Solution Matrix] "Ingress pipeline conforms to design boundaries. High-accuracy sync deployed. Initiating down-channel routing signals."\n` +
        `========================================================================`;
    } else {
      associativeResponse = `[STAGE 3: LOGIAL UNIT] Integrated successfully with target logic loop files.\n` +
        `[STAGE 3: LOGIAL UNIT] Evaluated properties: ${selectedNode.tags.join(', #') || 'none'}\n` +
        `[STAGE 3: LOGIAL UNIT] Output execution payload: { "system_health": "stable", "entropy_loss": "${(Math.random() * 0.05).toFixed(4)}", "checksum_conformance": true }`;
    }

    setSimLogs(prev => [
      ...prev,
      `[STAGE 3: PROCESSING] Driving internal associate matrix loop triggers...`,
      `[THINKING] <thought> Processing input token size: ${simPayload.length}. Connection mappings indexed: ${selectedNode.connections.length}. Solving user query against sandbox configuration parameters... </thought>`,
      associativeResponse,
      `[STAGE 4: OUTBOUND RELAY] Initiating dynamic downstream telemetry relays ...`,
      `[STAGE 4: OUTBOUND RELAY] Sync status of connected channels: ${selectedNode.syncStatus || 'synced'}`
    ]);

    setSimPerformance(prev => ({
      ...prev,
      latency: 480,
      tokens: Math.round(180 + Math.random() * 320),
      cpu: "14.2%"
    }));
    setSimStep('dispatch');
    setActivePipelineStep(3);

    // Step 4: Outbound Link dispatching
    await new Promise(r => setTimeout(r, 1100));

    if (selectedNode.connections.length > 0) {
      setSimLogs(prev => [
        ...prev,
        `[STAGE 4: TRANSMIT] ✓ Discharged physical handshake bytes standard broadcast to linked downlink nodes: [${selectedNode.connections.join(' & ')}]`,
        `[STAGE 4: COOPERATION] Auto-incremented connected components' progress thresholds (+4% performance increments) due to dataflow stimulus.`
      ]);

      // MUTATE connected nodes progress slightly on the fly, proving live interconnectedness!
      setNodes(prev => prev.map(n => {
        if (selectedNode.connections.includes(n.id)) {
          const newProg = Math.min(100, (n.progress || 0) + 4);
          return { ...n, progress: newProg, updatedAt: '2026/06/12' };
        }
        return n;
      }));

      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: language === 'en' 
            ? `Telemetry payload dispatched downstream! Connected nodes updated.` 
            : `管线拓扑数据流触发成功！以下游连通节点已接收信号刺激。`, 
          type: 'success' 
        }
      }));
    } else {
      setSimLogs(prev => [
        ...prev,
        `[STAGE 4: LISTEN] Zero active outbound couplings registered. Port listening standard broadcast.`
      ]);
    }

    const totalLatency = Math.round(580 + Math.random() * 110);
    setSimLogs(prev => [
      ...prev,
      `[STAGE 4: FINAL] Unified diagnostics simulation completed at ${new Date().toLocaleTimeString()} with code 0.`,
      `[STAGE 4: SYSTEM] SUMMARY - Latency: ${totalLatency}ms | Thread load: STABLE | System alignment: PERFECT COMPLIANT.`
    ]);

    setSimPerformance(prev => ({
      ...prev,
      latency: totalLatency,
      cpu: "0.1%"
    }));

    (window as any).playTactileChime?.('success');
    setSimStep('idle');
    setActivePipelineStep(-1);
  };

  // Change numerical attributes
  const handleUpdateNodeField = (field: 'title' | 'description' | 'status' | 'logicalOperator', val: any) => {
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        return { ...n, [field]: val, updatedAt: '2026/06/12' };
      }
      return n;
    }));
  };

  // Handle shift coordinate micro adjustments
  const handleShiftCoordinate = (direction: 'up' | 'down' | 'left' | 'right') => {
    (window as any).playTactileChime?.('click');
    const offset = 10;
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
          x: Math.max(50, Math.min(950, n.x + dx)),
          y: Math.max(50, Math.min(750, n.y + dy)),
          updatedAt: '2026/06/12'
        };
      }
      return n;
    }));
  };

  // Wire or sever cross connections
  const toggleNodeConnection = (targetId: string) => {
    (window as any).playTactileChime?.('click');
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const isConnected = n.connections.includes(targetId);
        const nextConns = isConnected 
          ? n.connections.filter(id => id !== targetId)
          : [...n.connections, targetId];
        return { ...n, connections: nextConns, updatedAt: '2026/06/12' };
      }
      return n;
    }));
  };

  // Add milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;
    (window as any).playTactileChime?.('click');

    const newItem: ChecklistItem = {
      id: `m-space-${Date.now()}`,
      text: newMilestoneText.trim(),
      done: false
    };

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const nextChecklist = [...(n.checklist || []), newItem];
        const doneCount = nextChecklist.filter(item => item.done).length;
        const progressVal = Math.round((doneCount / nextChecklist.length) * 100);
        return {
          ...n,
          checklist: nextChecklist,
          progress: progressVal,
          updatedAt: '2026/06/12'
        };
      }
      return n;
    }));
    setNewMilestoneText('');
  };

  // Toggle milestone checkbox status
  const toggleMilestoneComplete = (id: string) => {
    (window as any).playTactileChime?.('click');
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const nextChecklist = n.checklist.map(item => {
          if (item.id === id) {
            return { ...item, done: !item.done };
          }
          return item;
        });
        const doneCount = nextChecklist.filter(item => item.done).length;
        const progressVal = Math.round((doneCount / nextChecklist.length) * 100);
        return {
          ...n,
          checklist: nextChecklist,
          progress: progressVal,
          updatedAt: '2026/06/12'
        };
      }
      return n;
    }));
  };

  // Delete milestone checklist
  const deleteMilestone = (id: string) => {
    (window as any).playTactileChime?.('click');
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const nextChecklist = n.checklist.filter(item => item.id !== id);
        const doneCount = nextChecklist.length > 0 ? nextChecklist.filter(item => item.done).length : 0;
        const progressVal = nextChecklist.length > 0 ? Math.round((doneCount / nextChecklist.length) * 100) : 0;
        return {
          ...n,
          checklist: nextChecklist,
          progress: progressVal,
          updatedAt: '2026/06/12'
        };
      }
      return n;
    }));
  };

  // Delete node from memory
  const handleDeleteNodeRegistry = () => {
    if (!confirm(currentText.deleteConfirm)) return;
    (window as any).playTactileChime?.('alert');
    const idToDelete = selectedNode.id;
    setNodes(prev => prev.filter(n => n.id !== idToDelete).map(n => ({
      ...n,
      connections: n.connections.filter(c => c !== idToDelete)
    })));
    setSelectedNodeId(null);
    setActiveTab('fieldmap');
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { message: currentText.unregistered, type: 'warn' }
    }));
  };

  const getSovereignColor = (type: string) => {
    switch (type) {
      case 'project': return 'text-indigo-600 border-indigo-200 bg-indigo-50/70';
      case 'todo': return 'text-emerald-700 border-emerald-250 bg-emerald-50/70';
      case 'agent': return 'text-purple-700 border-purple-255 bg-purple-50/70';
      case 'muse': return 'text-pink-700 border-pink-250 bg-pink-50/70';
      default: return 'text-amber-700 border-amber-250 bg-amber-50/70';
    }
  };

  const getSovereignBackground = (type: string) => {
    switch (type) {
      case 'project': return 'bg-indigo-600';
      case 'todo': return 'bg-emerald-600';
      case 'agent': return 'bg-purple-600';
      case 'muse': return 'bg-pink-600';
      default: return 'bg-amber-500';
    }
  };

  return (
    <div id="component-space-container" className="flex-1 overflow-y-auto bg-[#fafafa] p-6 lg:p-10 space-y-6 animate-in fade-in-25 duration-300">
      
      {/* Collapsible Component Space Navigator (Moved from Sidebar to Top) */}
      <div id="top-component-selector-suite" className="bg-white border border-slate-200 rounded-3xl p-4.5 shadow-sm space-y-3">
        <button
          type="button"
          onClick={() => {
            (window as any).playTactileChime?.('click');
            setIsComponentSelectorOpen(!isComponentSelectorOpen);
          }}
          className="w-full flex items-center justify-between text-left focus:outline-none rounded-2xl p-1"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
              <Boxes className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                {language === 'en' ? 'Sovereign Spaces Suite' : '项目独立组件空间'}
              </span>
              <span className="text-xs lg:text-sm font-black text-slate-800 tracking-tight">
                {language === 'en' 
                  ? `Select Component Space (${nodes.length} registered units)` 
                  : `切换物理组件空间 (${nodes.length} 个运行子节点)`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black font-mono text-indigo-600 bg-indigo-50 border border-indigo-100/55 px-2 py-0.5 rounded-lg uppercase tracking-wider">
              {language === 'en' ? 'QUICK SWITCH' : '快捷重定向'}
            </span>
            <div className={`w-8 h-8 rounded-xl bg-slate-50 border border-slate-150 text-slate-500 flex items-center justify-center transition-transform ${
              isComponentSelectorOpen ? 'rotate-180' : ''
            }`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isComponentSelectorOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {nodes.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-2xl">
                    {language === 'en' ? 'No active components configured.' : '暂无注册任何独立拓扑组件。'}
                  </div>
                ) : (
                  nodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          (window as any).playTactileChime?.('click');
                          setSelectedNodeId(node.id);
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/10 shadow-xs'
                            : 'border-slate-150 hover:border-slate-250 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                              {getSubNodeIcon(node.type)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                {node.title}
                              </h4>
                              <span className="text-[9px] text-slate-400 font-bold font-mono uppercase tracking-wider block">
                                {node.type}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`w-2 h-2 rounded-full shrink-0 ${
                            node.status === 'active' ? 'bg-emerald-500' :
                            node.status === 'completed' ? 'bg-indigo-500' :
                            node.status === 'archived' ? 'bg-slate-350' : 'bg-amber-450'
                          }`} />
                        </div>

                        <div className="mt-3.5 space-y-1">
                          <div className="flex justify-between items-center text-[9.5px] font-bold font-mono text-slate-450">
                            <span>Sprints Done</span>
                            <span>{node.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                isSelected ? 'bg-indigo-600' : 'bg-slate-300'
                              }`}
                              style={{ width: `${node.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 1. Upper Breadcrumb / Context header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            id="back-to-dashboard-btn"
            onClick={() => {
              (window as any).playTactileChime?.('click');
              setActiveTab('fieldmap');
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 text-slate-500 border border-slate-150 transition-all hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
            title={currentText.backBtn}
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-lg border ${getSovereignColor(selectedNode.type)}`}>
                {selectedNode.type}
              </span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                #{selectedNode.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight mt-1">
              {selectedNode.title}
            </h2>
          </div>
        </div>

        {/* Global presentation mode switcher */}
        <div className="flex items-center gap-4 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          <button 
            type="button"
            onClick={() => {
              (window as any).playTactileChime?.('click');
              setIsCockpitView(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isCockpitView 
                ? 'bg-slate-900 text-white font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Sovereign Cockpit' : '协同驾驶舱 (一体)'}</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              (window as any).playTactileChime?.('click');
              setIsCockpitView(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              !isCockpitView 
                ? 'bg-slate-900 text-white font-extrabold' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Separated panels' : '微操仪表盘 (旧版)'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-xs font-semibold text-slate-500 mr-2">
            Status:
          </span>
          <select
            id="component-state-selector"
            value={selectedNode.status || 'active'}
            onChange={(e) => handleUpdateNodeField('status', e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all cursor-pointer"
          >
            <option value="active">🟢 {currentText.active}</option>
            <option value="completed">🔵 {currentText.completed}</option>
            <option value="draft">🟡 {currentText.draft}</option>
            <option value="archived">⚪ {currentText.archived}</option>
          </select>

          <button
            id="retire-component-btn"
            onClick={handleDeleteNodeRegistry}
            className="px-3.5 py-2 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-extrabold text-xs tracking-wide rounded-xl transition-all cursor-pointer"
          >
            {currentText.deleteNode}
          </button>
        </div>
      </div>

      {/* Description / Subtitle header block description */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center gap-4 relative overflow-hidden">
        <div className={`w-1 h-12 rounded-full ${getSovereignBackground(selectedNode.type)}`} />
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-650 font-mono flex items-center gap-1.5 leading-none">
            {isCockpitView ? <Zap className="w-3.5 h-3.5 text-amber-500" /> : <Sliders className="w-3.5 h-3.5 text-indigo-505" />}
            <span>{isCockpitView ? currentText.cockpitTitle : currentText.classicTitle}</span>
          </h4>
          <p className="text-[11.5px] text-slate-505 font-medium leading-relaxed mt-1 max-w-4xl">
            {isCockpitView ? currentText.cockpitSubtitle : currentText.classicSubtitle}
          </p>
        </div>
      </div>

      {/* ========================================================== */}
      {/* PERSPECTIVE SWITCH: COCKPIT COWORK INTERACTIVE VIEW        */}
      {/* ========================================================== */}
      {isCockpitView ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: VISUAL COMPONENT PIPELINE, GATES & SANDBOX RUN TEST (Col Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD 1: INTERNAL ACTION BLUEPRINT PIPELINE (The Inner Topology Flow!) */}
            <div id="visual-architecture-blueprints" className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Layers className="w-4.5 h-4.5 text-indigo-550 fill-indigo-100/30" />
                  <span>{language === 'en' ? 'Component Inner Topology Blueprint' : '组件内部拓扑逻辑管网图'}</span>
                </h3>
                <span className="text-[9px] font-mono font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 uppercase">
                  {selectedNode.type} FLow
                </span>
              </div>

              {/* Dynamic Step visual track map representation */}
              <div className="space-y-3 pt-1">
                {internalFlowSteps.map((step, idx) => {
                  const isActiveStep = activePipelineStep === idx;
                  const isFinishedStep = activePipelineStep > idx;
                  
                  return (
                    <div key={idx} className="relative group">
                      {/* Connection wire line linking components */}
                      {idx < internalFlowSteps.length - 1 && (
                        <div className="absolute left-[19px] top-[38px] bottom-[-16px] w-[2px] bg-slate-200 z-0">
                          {isActiveStep && (
                            <div className="w-full h-1/2 bg-indigo-500 animate-pulse" />
                          )}
                        </div>
                      )}

                      <div className={`p-3 rounded-2xl border-2 transition-all relative z-10 flex items-start gap-3 bg-white ${
                        isActiveStep 
                          ? 'border-amber-500 shadow-md bg-amber-50/20 scale-[1.02]' 
                          : isFinishedStep 
                            ? 'border-emerald-500 bg-emerald-50/5' 
                            : 'border-slate-150 hover:border-slate-300'
                      }`}>
                        {/* Number bullet badge indicator */}
                        <div className={`w-8 h-8 rounded-xl shrink-0 font-mono text-[11px] font-black flex items-center justify-center border transition-all ${
                          isActiveStep 
                            ? 'bg-amber-500 border-amber-600 text-white animate-pulse' 
                            : isFinishedStep 
                              ? 'bg-emerald-600 border-emerald-700 text-white' 
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {isFinishedStep ? "✓" : idx + 1}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-start flex-wrap gap-1">
                            <h5 className="text-xs font-black text-[#0f172a] tracking-tight">{step.label}</h5>
                            <span className="text-[10px] font-mono font-bold text-slate-400 font-medium group-hover:text-indigo-600 transition-colors select-none">
                              ⚙️ {step.file}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-450 font-bold leading-normal">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 2: PHYSICAL INBOUND TELEMETRY GATE CONFIG */}
            <div id="physical-inbound-operators" className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <GitBranch className="w-4.5 h-4.5 text-emerald-600" />
                  <span>{language === 'en' ? 'Ingress Logic Gate & Trigger Pins' : '本源入站逻辑信标及操作门'}</span>
                </h3>

                <select
                  value={selectedNode.logicalOperator || 'AND'}
                  onChange={(e) => handleUpdateNodeField('logicalOperator', e.target.value)}
                  className="text-[10.5px] font-black border border-slate-200 rounded-xl px-2 py-1 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="AND">AND GATE</option>
                  <option value="OR">OR GATE</option>
                  <option value="XOR">XOR GATE</option>
                  <option value="NOT">NOT GATE</option>
                  <option value="INPUT">RAW SEED</option>
                </select>
              </div>

              {/* Physical Interactive Trigger Pins layout */}
              <div className="p-3.5 bg-[#f8fafc] border rounded-2xl space-y-3 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black font-mono text-slate-400 uppercase tracking-widest block">Input Pin Aligners</span>
                  <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                    gatePassed 
                      ? 'bg-emerald-500 border-emerald-600 text-white animate-pulse' 
                      : 'bg-amber-100 border-amber-250 text-amber-700'
                  }`}>
                    {gatePassed ? "● Conforms / 热导通" : "▲ Blocked / 冷熔断"}
                  </span>
                </div>

                {/* Gate wire switches rendering */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Pin Alpha (True)", value: gateInputs[0], index: 0 },
                    { label: "Pin Beta (True)", value: gateInputs[1], index: 1 },
                    { label: "Pin Gamma (False)", value: gateInputs[2], index: 2 }
                  ].map((pin) => (
                    <button
                      key={pin.index}
                      type="button"
                      onClick={() => {
                        (window as any).playTactileChime?.('click');
                        setGateInputs(prev => {
                          const copy = [...prev];
                          copy[pin.index] = !copy[pin.index];
                          return copy;
                        });
                      }}
                      className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center select-none cursor-pointer ${
                        pin.value 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800' 
                          : 'border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-black">X-{pin.index + 1}</span>
                      <span className="text-[9px] font-extrabold uppercase mt-1">
                        {pin.value ? "HIGH (1)" : "LOW (0)"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 3: DYNAMIC SIMULATOR INPUT ACTION TERMINAL */}
            <div id="dynamic-simulation-launcher" className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block font-mono">
                  Input Parameter Trigger Payload
                </span>
                <textarea 
                  rows={2}
                  disabled={simStep !== 'idle'}
                  value={simPayload}
                  onChange={(e) => setSimPayload(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold leading-relaxed"
                  placeholder='{"query": "Type prompt sequence trigger..."}'
                />
              </div>

              <div className="pt-1">
                <button
                  onClick={executeCockpitSimulation}
                  disabled={simStep !== 'idle'}
                  className={`w-full py-3 bg-[#0a0a14] text-white text-[10.5px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer ${
                    simStep !== 'idle' ? 'opacity-50' : 'hover:scale-[1.01] active:scale-[0.99] hover:bg-black'
                  }`}
                >
                  <Play className={`w-4.5 h-4.5 text-amber-400 group-hover:scale-110 transition-transform ${
                    simStep !== 'idle' ? 'animate-spin' : ''
                  }`} />
                  <span>
                    {simStep !== 'idle' 
                      ? `${language === 'en' ? 'Executing Pipeline Trace...' : '系统正进行管路极温仿真...'}` 
                      : `${language === 'en' ? '⚡ Execute Sovereign Pipeline Run' : '⚡ 运行系统整链逻辑仿真'}`
                    }
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SOVEREIGN IDE & ATOMIC PROPERTIES TABS (Col Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-2 shadow-sm overflow-hidden flex flex-col justify-between">
              
              {/* Internal Tab selectors for the right workflow panel */}
              <div className="flex border-b border-slate-100 p-2 gap-1 overflow-x-auto scrollbar-none pb-2.5">
                {[
                  { id: 'code', label: currentText.tabCode, icon: Code },
                  { id: 'simulator', label: currentText.tabSim, icon: Sliders },
                  { id: 'milestones', label: currentText.tabMilestones, icon: CheckCircle2 },
                  { id: 'infrastructure', label: currentText.tabInfra, icon: Navigation }
                ].map((tab) => {
                  const isSelect = activeSubTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        (window as any).playTactileChime?.('click');
                        setActiveSubTab(tab.id as any);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 text-[10.5px] font-black uppercase tracking-wide rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        isSelect 
                          ? 'bg-slate-900 text-white font-black' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Internal content switch rendering based on sub-tab inside split view */}
              <div className="p-3 min-h-[500px] bg-slate-50/50 rounded-2xl relative">
                <AnimatePresence mode="wait">
                  
                  {/* COCKPIT COMPACT IDE SUB-PLANE */}
                  {activeSubTab === 'code' && (
                    <motion.div
                      key="cp-code"
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                      className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden p-1 shadow-inner h-full font-sans"
                    >
                      <HearthFolderExplorer 
                        nodeType={selectedNode.type}
                        nodeTitle={selectedNode.title}
                        language={language}
                      />
                    </motion.div>
                  )}

                  {/* COCKPIT COMPACT SIM TUNER */}
                  {activeSubTab === 'simulator' && (
                    <motion.div
                      key="cp-sim"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
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
                        handleProgressSliderChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, progress: val, updatedAt: '2026/06/12' } : n));
                        }}
                        handleUpdateNodeStringField={handleUpdateNodeField}
                      />
                    </motion.div>
                  )}

                  {/* COCKPIT MILESTONES ACTIONS */}
                  {activeSubTab === 'milestones' && (
                    <motion.div
                      key="cp-milestone"
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                        <div>
                          <h3 className="text-xs font-black text-slate-850 tracking-tight flex items-center gap-1.5 uppercase font-mono">
                            <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500" />
                            <span>{currentText.milestonesHeader}</span>
                          </h3>
                        </div>

                        <div className="bg-slate-50 px-3 py-1 rounded-xl text-center border font-mono">
                          <span className="text-[10px] text-slate-700 font-extrabold">{selectedNode.progress}% Sprints Done</span>
                        </div>
                      </div>

                      <form onSubmit={handleAddMilestone} className="flex gap-2.5">
                        <input
                          type="text"
                          placeholder={currentText.milestonePlaceholder}
                          value={newMilestoneText}
                          onChange={(e) => setNewMilestoneText(e.target.value)}
                          className="flex-1 text-xs px-3.5 py-2 px-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl font-semibold"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wide rounded-xl shadow-md cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>

                      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {selectedNode.checklist && selectedNode.checklist.length > 0 ? (
                          selectedNode.checklist.map((item) => (
                            <div
                              key={item.id}
                              className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                                item.done 
                                  ? 'bg-indigo-50/20 border-indigo-100/50 text-slate-400' 
                                  : 'bg-[#f8fafc]/50 border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-white'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => toggleMilestoneComplete(item.id)}
                                className="flex items-center gap-2.5 flex-1 text-left cursor-pointer font-bold text-xs"
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  item.done 
                                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                                    : 'border-slate-300 hover:border-indigo-500'
                                }`}>
                                  {item.done && <CheckCircle2 className="w-3 h-3 text-white stroke-3" />}
                                </div>
                                <span className={item.done ? 'line-through decoration-slate-300 text-xs' : 'text-xs'}>
                                  {item.text}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteMilestone(item.id)}
                                className="p-1 hover:bg-slate-100 text-slate-405 hover:text-red-500 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center border border-dashed border-slate-200 rounded-2xl space-y-2">
                            <Clock className="w-7 h-7 text-slate-300 mx-auto animate-pulse" />
                            <p className="text-[10px] font-bold text-slate-400 font-mono">
                              {currentText.emptyMilestones}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* COCKPIT HARDWARE & NETWORKING BINDINGS */}
                  {activeSubTab === 'infrastructure' && (
                    <motion.div
                      key="cp-infra"
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 gap-4"
                    >
                      {/* Coordinates dials card */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                        <div className="font-mono text-[9px] text-[#4f46e5] font-black uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                          <Navigation className="w-4 h-4 text-indigo-500" />
                          <span>{currentText.coordinates}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 py-1">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold font-mono">GRID COORDINATES</span>
                            <span className="text-[11px] font-black text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded-lg mt-1 inline-block">
                              X: {selectedNode.x}px | Y: {selectedNode.y}px
                            </span>
                          </div>

                          <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 p-0.5 relative flex items-center justify-center shadow-lg">
                            <button 
                              type="button"
                              onClick={() => handleShiftCoordinate('up')}
                              className="absolute top-0.5 p-1 text-indigo-400 hover:text-white rounded transition active:scale-90"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleShiftCoordinate('down')}
                              className="absolute bottom-0.5 p-1 text-indigo-400 hover:text-white rounded transition active:scale-90"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleShiftCoordinate('left')}
                              className="absolute left-0.5 p-1 text-indigo-400 hover:text-white rounded transition active:scale-90"
                            >
                              <ArrowLeftIcon className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleShiftCoordinate('right')}
                              className="absolute right-0.5 p-1 text-indigo-400 hover:text-white rounded transition active:scale-90"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Connections routing links */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                        <div className="font-mono text-[9px] text-[#4f46e5] font-black uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                          <Link2 className="w-4 h-4 text-indigo-500" />
                          <span>{currentText.crossPipeline}</span>
                        </div>

                        <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 custom-scroll">
                          {nodes.filter(n => n.id !== selectedNode.id).map((on) => {
                            const isConnected = selectedNode.connections.includes(on.id);
                            return (
                              <button
                                key={on.id}
                                type="button"
                                onClick={() => toggleNodeConnection(on.id)}
                                className={`w-full p-2 rounded-xl text-left font-bold text-xs font-mono border transition flex items-center justify-between cursor-pointer ${
                                  isConnected 
                                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700' 
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350 hover:bg-white'
                                }`}
                              >
                                <span className="truncate">📁 {on.title}</span>
                                <span className="text-[8.5px] font-black shrink-0 uppercase tracking-wide">
                                  {isConnected ? currentText.connectedBtn : currentText.connectBtn}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Core Binders controller */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-2.5 shadow-sm">
                        <HearthBinderHub
                          selectedNode={selectedNode}
                          nodes={nodes}
                          setNodes={setNodes}
                          language={language}
                        />
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* BOTTOM COLUMN: CONSOLIDATED REAL-TIME SIMULATED EXECUTION CONSOLE (Full Width) */}
          <div className="lg:col-span-12">
            <div className="bg-[#030307] border-2 border-slate-900 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4">
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 font-mono">
                    Hearth Autonomous Matrix Execution Console (Live Diagnostics Trace)
                  </h4>
                </div>

                {/* Performance live indicators */}
                <div className="flex items-center gap-4 text-[9.5px] font-mono text-slate-500">
                  <span>LATENCY: <strong className="text-amber-400 font-black">{simPerformance.latency}ms</strong></span>
                  <span>CPU THROTTLE: <strong className="text-indigo-400 font-black">{simPerformance.cpu}</strong></span>
                  {simPerformance.tokens > 0 && (
                    <span>TOKENS DISPATCHED: <strong className="text-purple-400 font-black">{simPerformance.tokens}</strong></span>
                  )}
                  <button 
                    type="button"
                    onClick={() => {
                      (window as any).playTactileChime?.('click');
                      setSimLogs([
                        `[HEARTH-COCKPIT] Unified pipeline cockpit active for target: [${selectedNode.title}]`,
                        `[HEARTH-COCKPIT] Command terminal logs and performance metrics flushed.`
                      ]);
                      setSimPerformance({ latency: 0, tokens: 0, cpu: "0.1%", gateResult: true });
                    }}
                    className="p-1 hover:bg-slate-900 text-slate-400 hover:text-white rounded transition"
                    title="Flush stack trace logs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pitch black command scrolling terminal */}
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto select-all p-3 bg-[#010103] border border-slate-950 rounded-2xl font-mono text-[9.5px] leading-relaxed tracking-tight select-all custom-scroll">
                {simLogs.map((log, idx) => {
                  let logColor = "text-zinc-300";
                  if (log.includes("[OK]") || log.includes("✓")) logColor = "text-emerald-400 font-bold";
                  if (log.includes("❌") || log.includes("[HALT]") || log.includes("[STAGE 1: ERROR]")) logColor = "text-rose-500 font-bold";
                  if (log.includes("[STAGE")) logColor = "text-amber-400 font-black";
                  if (log.includes("<thought>")) logColor = "text-purple-400 italic";
                  if (log.includes("=======================")) logColor = "text-[#6366f1] font-black";
                  
                  return (
                    <div key={idx} className={`${logColor} break-all select-all`}>
                      {log}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* ========================================================== */
        /* PERSPECTIVE SWITCH: CLASSIC SEPARATED WORKSTATION TABS     */
        /* ========================================================== */
        <div className="min-h-[460px] relative">
          
          <div className="flex border-b border-slate-250/50 gap-1 overflow-x-auto scrollbar-none pb-0.5 mb-6">
            {[
              { id: 'code', label: currentText.tabCode, icon: Code },
              { id: 'simulator', label: currentText.tabSim, icon: Terminal },
              { id: 'milestones', label: currentText.tabMilestones, icon: CheckCircle2 },
              { id: 'infrastructure', label: currentText.tabInfra, icon: Database }
            ].map((tab) => {
              const isActive = activeSubTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`component-subtab-${tab.id}`}
                  onClick={() => {
                    (window as any).playTactileChime?.('click');
                    setActiveSubTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold tracking-wide rounded-t-xl transition-all relative border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'border-indigo-600 text-indigo-600 bg-white font-black' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeSubTabIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            
            {/* TAB 1: CODE WORKSPACE */}
            {activeSubTab === 'code' && (
              <motion.div
                key="code-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="w-full bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm p-1.5"
              >
                <HearthFolderExplorer 
                  nodeType={selectedNode.type}
                  nodeTitle={selectedNode.title}
                  language={language}
                />
              </motion.div>
            )}

            {/* TAB 2: DIAGNOSTICS & SIMULATOR */}
            {activeSubTab === 'simulator' && (
              <motion.div
                key="sim-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 gap-6"
              >
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
                  handleProgressSliderChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, progress: val, updatedAt: '2026/06/12' } : n));
                  }}
                  handleUpdateNodeStringField={handleUpdateNodeField}
                />
              </motion.div>
            )}

            {/* TAB 3: MILESTONES CHECKLIST */}
            {activeSubTab === 'milestones' && (
              <motion.div
                key="milestone-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5 uppercase font-mono">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      <span>{currentText.milestonesHeader}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold leading-normal mt-1">
                      {language === 'en' 
                        ? 'Establish static assertions, integration criteria or milestones. Audit pipeline stages incrementally.' 
                        : '为此拓扑单元设定逻辑边界检查或开发里程碑，随着断言逐步闭环，管线健康值将自动同步增长。'}
                    </p>
                  </div>

                  <div className="bg-[#f8fafc] px-4 py-2 rounded-xl text-center border border-slate-150 shrink-0 font-mono">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Completion Rate</span>
                    <span className="text-base font-black text-slate-800">{selectedNode.progress}%</span>
                  </div>
                </div>

                {/* Add checklist item */}
                <form onSubmit={handleAddMilestone} className="flex gap-2.5">
                  <input
                    id="new-milestone-input"
                    type="text"
                    placeholder={currentText.milestonePlaceholder}
                    value={newMilestoneText}
                    onChange={(e) => setNewMilestoneText(e.target.value)}
                    className="flex-1 text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none rounded-xl font-semibold"
                  />
                  <button
                    id="add-milestone-btn"
                    type="submit"
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wide rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{currentText.addMilestoneBtn}</span>
                  </button>
                </form>

                {/* Checklist feed */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedNode.checklist && selectedNode.checklist.length > 0 ? (
                    selectedNode.checklist.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                          item.done 
                            ? 'bg-indigo-50/20 border-indigo-100/50 text-slate-400' 
                            : 'bg-[#f8fafc]/50 border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleMilestoneComplete(item.id)}
                          className="flex items-center gap-3.5 flex-1 text-left cursor-pointer font-bold text-xs"
                        >
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                            item.done 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'border-slate-300 hover:border-indigo-500'
                          }`}>
                            {item.done && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-3" />}
                          </div>
                          <span className={item.done ? 'line-through decoration-slate-300' : ''}>
                            {item.text}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteMilestone(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-105 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl space-y-3">
                      <Clock className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                      <p className="text-xs font-bold text-slate-400 font-mono">
                        {currentText.emptyMilestones}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 4: EXTERNAL INFRASTRUCTURE BINDINGS & SIGNAL ROUTING */}
            {activeSubTab === 'infrastructure' && (
              <motion.div
                key="infra-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                {/* Coordinates Alignment and Downstream routing panel (cols 5) */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                  
                  {/* Coordinates calibrations card */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="font-mono text-[9px] text-[#4f46e5] font-black uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <Navigation className="w-4 h-4 text-indigo-500" />
                      <span>{currentText.coordinates}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                      <div className="text-center sm:text-left">
                        <span className="text-[10px] text-slate-400 block font-bold font-mono">MAP POSITION</span>
                        <span className="text-sm font-black text-slate-800 font-mono bg-slate-100 px-3 py-1 rounded-lg mt-1 inline-block">
                          X: {selectedNode.x}px | Y: {selectedNode.y}px
                        </span>
                      </div>

                      <div className="w-24 h-24 rounded-full bg-slate-950 border border-slate-800 p-0.5 relative flex items-center justify-center shadow-lg">
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('up')}
                          className="absolute top-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition active:scale-90 flex items-center justify-center cursor-pointer"
                          title={currentText.shiftUp}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('down')}
                          className="absolute bottom-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition active:scale-90 flex items-center justify-center cursor-pointer"
                          title={currentText.shiftDown}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('left')}
                          className="absolute left-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition active:scale-90 flex items-center justify-center cursor-pointer"
                          title={currentText.shiftLeft}
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleShiftCoordinate('right')}
                          className="absolute right-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition active:scale-90 flex items-center justify-center cursor-pointer"
                          title={currentText.shiftRight}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Downstream Connections Linkages */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="font-mono text-[9px] text-[#4f46e5] font-black uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <Link2 className="w-4 h-4 text-indigo-500" />
                      <span>{currentText.crossPipeline}</span>
                    </div>

                    <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scroll">
                      {nodes.filter(n => n.id !== selectedNode.id).map((on) => {
                        const isConnected = selectedNode.connections.includes(on.id);
                        return (
                          <button
                            key={on.id}
                            type="button"
                            onClick={() => toggleNodeConnection(on.id)}
                            className={`w-full p-2.5 rounded-xl text-left font-bold text-xs font-mono border transition flex items-center justify-between cursor-pointer ${
                              isConnected 
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700' 
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-350 hover:bg-white'
                            }`}
                          >
                            <span className="truncate">📁 {on.title}</span>
                            <span className="text-[9px] font-black shrink-0 uppercase tracking-wide">
                              {isConnected ? currentText.connectedBtn : currentText.connectBtn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Binders Mapping Card (cols 7) */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-2.5 shadow-sm">
                  <HearthBinderHub
                    selectedNode={selectedNode}
                    nodes={nodes}
                    setNodes={setNodes}
                    language={language}
                  />
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
