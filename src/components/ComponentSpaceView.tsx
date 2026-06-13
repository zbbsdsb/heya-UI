/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
  ArrowLeft as ArrowLeftIcon
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

  // Define tab state
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'simulator' | 'milestones' | 'infrastructure'>('code');

  // Simulated states for HearthComponentSimulator inside this workspace
  const [computingHash, setComputingHash] = useState(false);
  const [computedHashCode, setComputedHashCode] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [horizonProtocol, setHorizonProtocol] = useState('Heuristic Gravity');
  const [divergenceVal, setDivergenceVal] = useState(50);
  const [musePromptText, setMusePromptText] = useState('');
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Localization for the workspace
  const textLocal = {
    en: {
      backBtn: "Back to Dashboard",
      tabCode: "Source Code & IDE",
      tabSim: "Diagnostics & Sim",
      tabMilestones: "Milestones Checklist",
      tabInfra: "Physical Bindings & Routing",
      properties: "Component Properties",
      classLabel: "Class",
      statusLabel: "System Status",
      completed: "Completed",
      active: "Active",
      archived: "Archived",
      draft: "Draft",
      syncLabel: "Sync Status",
      progress: "Sprints Completion",
      tags: "Metadata Attributes",
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
      unregistered: "Component permanently retired from central index."
    },
    zh: {
      backBtn: "返回主看板",
      tabCode: "源代码工程 (IDE)",
      tabSim: "诊断与仿真 (Sim)",
      tabMilestones: "达成断言 checklist",
      tabInfra: "物理绑定与信号路由 (Bindings)",
      properties: "组件元数特征",
      classLabel: "架构类别",
      statusLabel: "生命周期状态",
      completed: "已完成",
      active: "运行中",
      archived: "已归档",
      draft: "草稿",
      syncLabel: "物理同步",
      progress: "管线达成度",
      tags: "元数据检索标签",
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
      unregistered: "组件拓扑宿主单元已被永久注销。"
    }
  };

  const currentText = textLocal[language];

  // Auto load simulated logs whenever active component changes
  useEffect(() => {
    if (selectedNode) {
      const initLogs = [
        `[HEARTH-AGENT-ENV] Initiating sandboxed micro-kernel environment for [${selectedNode.title}]`,
        `[HEARTH-AGENT-ENV] Sub-state routing established. Binding references synced.`,
        `[HEARTH-AGENT-ENV] Listening to cluster activity. Status: [${selectedNode.status || 'active'}]`
      ];
      setAgentLogs(initLogs);
      setComputedHashCode(null);
    }
  }, [selectedNodeId]);

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

  // Handle simulated diagnostic scans
  const handleAgentScan = () => {
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
        const nextChecklist = [...n.checklist, newItem];
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
      case 'project': return 'text-indigo-550 border-indigo-220 bg-indigo-50/50';
      case 'todo': return 'text-emerald-600 border-emerald-250 bg-emerald-50/50';
      case 'agent': return 'text-purple-600 border-purple-250 bg-purple-50/50';
      case 'muse': return 'text-pink-600 border-pink-250 bg-pink-50/50';
      default: return 'text-amber-600 border-amber-250 bg-amber-50/50';
    }
  };

  return (
    <div id="component-space-container" className="flex-1 overflow-y-auto bg-[#fafafa] p-6 lg:p-10 space-y-6 animate-in fade-in-25 duration-300">
      
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
                #{selectedNode.id.slice(-6)}
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight mt-1">
              {selectedNode.title}
            </h2>
          </div>
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

      {/* Description / System parameters quick bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-8 space-y-1.5 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-5">
          <span className="text-[9.5px] font-extrabold text-indigo-500 uppercase tracking-wider font-mono">
            {language === 'en' ? 'System Descriptor' : '系统物理及逻辑描述'}
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            {selectedNode.description}
          </p>
        </div>
        
        <div className="md:col-span-4 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-mono">
              {currentText.progress}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden block">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${selectedNode.progress}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-slate-700 font-mono">
                {selectedNode.progress}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[8.5px] font-extrabold text-slate-400 block font-mono uppercase">
              {language === 'en' ? 'RESTORED KEY' : '唯一特征校验'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              V {selectedNode.version || 1}.0 // {selectedNode.syncStatus || 'synced'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TABBED SEGMENT NAVIGATION */}
      <div className="flex border-b border-slate-250/50 gap-1 overflow-x-auto scrollbar-none pb-0.5">
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

      {/* 3. DYNAMIC CONTENT AREAS */}
      <div className="min-h-[460px] relative">
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
                  className="flex-1 text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl font-semibold"
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
              <div className="lg:col-span-5 space-y-6">
                
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
                        className="absolute top-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-colors active:scale-90 flex items-center justify-center cursor-pointer"
                        title={currentText.shiftUp}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleShiftCoordinate('down')}
                        className="absolute bottom-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-colors active:scale-90 flex items-center justify-center cursor-pointer"
                        title={currentText.shiftDown}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleShiftCoordinate('left')}
                        className="absolute left-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-colors active:scale-90 flex items-center justify-center cursor-pointer"
                        title={currentText.shiftLeft}
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleShiftCoordinate('right')}
                        className="absolute right-1 p-1 hover:bg-slate-800 text-indigo-400 hover:text-white rounded transition-colors active:scale-90 flex items-center justify-center cursor-pointer"
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
                          className={`w-full p-2.5 rounded-xl text-left font-bold text-xs font-mono border transition-all flex items-center justify-between cursor-pointer ${
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
              <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-2.5 shadow-sm">
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
  );
}
