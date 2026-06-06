/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Share2,
  ChevronRight,
  Settings,
  Bell,
  BookOpen,
  Compass,
  Grid,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  Plus
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import FieldMapCanvas from './components/FieldMapCanvas';
import HeyCompanion from './components/HeyCompanion';
import ForgeLogic from './components/ForgeLogic';
import MuseIdeation from './components/MuseIdeation';
import OermosNetwork from './components/OermosNetwork';
import RelationsTopology from './components/RelationsTopology';
import ProjectSpace from './components/ProjectSpace';

import { NodeData, MuseIdea, NodeType } from './types';
import { translations } from './locales';

// Avatars for online collaboration representations
const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop&sat=-100", // ceaserzhao
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop", // Ying
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop", // Alex
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop", // David
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128&auto=format&fit=crop"  // Emma
];

export default function App() {
  const [activeTab, setActiveTab] = useState('projectspace');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('project-a');
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [swissTheme, setSwissTheme] = useState(false);

  const tVal = translations[language];

  // Hearth core components state (shares across Canvas & Relations)
  const [nodes, setNodes] = useState<NodeData[]>(() => {
    const saved = localStorage.getItem('hearth_nodes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_nodes from localStorage', e);
      }
    }
    return [
      {
        id: 'project-a',
        type: 'project',
        title: 'Project A',
        description: '核心开发，对齐 Oasis 公司对接条件。',
        x: 380,
        y: 350,
        progress: 62,
        members: ['ceaserzhao', 'Ying', 'Alex', 'David'],
        checklist: [
          { id: 'pa-1', text: 'Define system architecture', done: true },
          { id: 'pa-2', text: 'Align styling design norms', done: true },
          { id: 'pa-3', text: 'Coordinate with Oasis Co.', done: false }
        ],
        tags: ['产品', '开发周期'],
        connections: ['project-b', 'todo-list', 'research'],
        star: true,
        createdAt: '2024/05/28',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1
      },
      {
        id: 'project-b',
        type: 'project',
        title: 'Project B',
        description: '重点在 Oermos 协议设计，测试 Zurich 基座握手包。',
        x: 580,
        y: 220,
        progress: 48,
        members: ['ceaserzhao', 'Ying'],
        checklist: [
          { id: 'pb-1', text: 'Implement WebRTC handshake', done: true },
          { id: 'pb-2', text: 'P2P transport validation', done: false }
        ],
        tags: ['核心', '网络协议'],
        connections: ['project-a', 'user-research', 'todo-list'],
        star: false,
        createdAt: '2024/05/20',
        updatedAt: '2024/05/29',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1
      },
      {
        id: 'todo-list',
        type: 'todo',
        title: 'Execution Pipeline',
        description: '系统底层动态微内核与拓扑运算流执行管线。',
        x: 480,
        y: 480,
        progress: 25,
        members: ['ceaserzhao', 'Alex'],
        checklist: [],
        tags: ['Pipeline', 'Core-Flow'],
        connections: ['project-a', 'project-b'],
        star: false,
        createdAt: '2024/05/25',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1
      },
      {
        id: 'design-system',
        type: 'resource',
        title: 'Registry Matrix',
        description: '赫斯全局拓扑网络数据寻址与组件注册控制枢纽。',
        x: 720,
        y: 470,
        progress: 100,
        members: ['Alex', 'David', 'Emma'],
        checklist: [],
        tags: ['Registry', 'Base'],
        connections: ['todo-list'],
        star: false,
        createdAt: '2024/05/18',
        updatedAt: '2024/05/28',
        status: 'completed',
        syncStatus: 'synced',
        authorId: 'Alex',
        version: 1
      },
      {
        id: 'research',
        type: 'muse',
        title: 'Research',
        description: '市场契机 analysis 与用户心流追踪研讨。',
        x: 220,
        y: 280,
        progress: 30,
        members: ['ceaserzhao'],
        checklist: [],
        tags: ['研究', '创意'],
        connections: ['project-a'],
        star: false,
        createdAt: '2024/05/10',
        updatedAt: '2024/05/25',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1
      },
      {
        id: 'user-research',
        type: 'agent',
        title: 'User Research Companion',
        description: '自动分析、提炼并过滤用户反馈。',
        x: 760,
        y: 180,
        progress: 85,
        members: ['Agent Spark'],
        checklist: [],
        tags: ['Agent', 'AI 洞察'],
        connections: ['project-b'],
        star: false,
        createdAt: '2024/05/29',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'system',
        version: 1
      }
    ];
  });

  // Muse original sparks state (shares across Muse & can evolve onto Canvas)
  const [ideas, setIdeas] = useState<MuseIdea[]>(() => {
    const saved = localStorage.getItem('hearth_ideas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_ideas from localStorage', e);
      }
    }
    return [
      { id: 'muse-1', content: '使用 WebRTC 进行去中心化分布式元数据直接广播', createdAt: '今天 09:24' },
      { id: 'muse-2', content: 'Swiss 极简网格排版系统：仅采用黑白对比与粗细线条，零多余圆角', createdAt: '昨天 19:40' },
      { id: 'muse-3', content: '0ms 通讯底座：握手信息通过底层 P2P 网格自动绕过中心式服务器', createdAt: '前天 11:12' }
    ];
  });

  // Sync state variations back to localStorage whenever they mutate
  useEffect(() => {
    localStorage.setItem('hearth_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('hearth_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // AI chat states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  // Ask Hey AI handler
  const handleAskHeya = async (prompt: string) => {
    if (!prompt.trim() || isAiLoading) return;
    setIsAiLoading(true);

    const userMsg = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      // Localized proactive seed generation or server analysis
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          nodesSummary: nodes.map(n => ({ title: n.title, type: n.type }))
        })
      });

      if (!resp.ok) {
        throw new Error('API server unreachable');
      }

      const data = await resp.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.content }]);

      // If action is returned, execute it!
      if (data.action) {
        const type = data.action.type;
        const actData = data.action.data;

        if (type === 'create_node') {
          const freshId = `node-${Date.now()}`;
          const newNode: NodeData = {
            id: freshId,
            type: (actData.type || 'todo') as NodeType,
            title: actData.title || 'Sprouted Node',
            description: actData.description || 'Sprout catalyzed by Hey companion trigger.',
            x: 420 + Math.random() * 80,
            y: 350 + Math.random() * 80,
            progress: 0,
            members: ['Agent Spark'],
            checklist: [],
            tags: ['AI-Catalyzed'],
            connections: ['project-a'],
            createdAt: '2024/05/30',
            updatedAt: '2024/05/30',
            status: 'active',
            syncStatus: 'synced',
            authorId: 'system',
            version: 1
          };
          setNodes(prev => [...prev, newNode]);
          setSelectedNodeId(freshId);
        }
      }

    } catch (err) {
      // Offline smart fallback simulation - perfectly robust
      setTimeout(() => {
        const fallbacks = [
          `我分析了你的 Field Map！你可以尝试将 “User Research Companion” 节点拖拽移动至 机会域，这可以帮助自动捕获访谈信息。同时，我已经帮你将这个建议记入日志。`,
          `建议在 “Todo List” 增加一个子任务 “WebRTC 性能压测”，这能对齐 Project B 要求的 Oermos 协议底座条件！`,
          `已经为你激活了该决策拓扑。你可以点击左侧 "Oermos P2P" 选项卡来检查 Zurich 网关的连线同步状态！`
        ];
        const randomAnswer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: randomAnswer 
        }]);

        // Auto spawn node if user asked for a node
        const promptLower = prompt.toLowerCase();
        if (promptLower.includes('node') || promptLower.includes('节点') || promptLower.includes('任务') || promptLower.includes('task')) {
          const freshId = `node-offline-${Date.now()}`;
          setNodes(prev => [...prev, {
            id: freshId,
            type: 'todo',
            title: 'AI Proposes Node',
            description: '启发式分析建议加入的元数据任务边界。',
            x: 520,
            y: 380,
            progress: 10,
            members: ['ceaserzhao'],
            checklist: [{ id: `item-${freshId}`, text: '分析机会域元数据边界', done: false }],
            tags: ['AI-Proposal'],
            connections: ['todo-list'],
            createdAt: '2024/05/30',
            updatedAt: '2024/05/30',
            status: 'draft',
            syncStatus: 'synced',
            authorId: 'system',
            version: 1
          }]);
          setSelectedNodeId(freshId);
        }
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Evolve unstructured Muse ideation into Hearth active map component
  const handleEvolveNode = (ideaId: string, text: string) => {
    const freshId = `node-evolved-${Date.now()}`;
    const evolvedNode: NodeData = {
      id: freshId,
      type: 'muse',
      title: text.length > 20 ? text.slice(0, 18) + '...' : text,
      description: text,
      x: 320 + Math.random() * 120,
      y: 280 + Math.random() * 100,
      progress: 0,
      members: ['ceaserzhao'],
      checklist: [],
      tags: ['Muse-Evolved'],
      connections: ['project-a'],
      createdAt: '2024/05/30',
      updatedAt: '2024/05/30',
      status: 'active',
      syncStatus: 'synced',
      authorId: 'ceaserzhao',
      version: 1
    };

    setNodes(prev => [...prev, evolvedNode]);
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, convertedToNodeId: freshId } : idea
    ));

    setSelectedNodeId(freshId);
    setActiveTab('fieldmap');
  };

  // Custom tool top bar actions mapping
  const handleAddMapItemDirectly = (title: string, type: string) => {
    const id = `item-direct-${Date.now()}`;
    const newItem: NodeData = {
      id,
      type: type as any,
      title: title || 'Quick Sprout',
      description: 'Hearth creation active node block.',
      x: 430,
      y: 320,
      progress: 0,
      members: ['ceaserzhao'],
      tags: ['Manual'],
      checklist: [],
      connections: [],
      createdAt: '25/05/30',
      updatedAt: '25/05/30',
      status: 'active',
      syncStatus: 'synced',
      authorId: 'ceaserzhao',
      version: 1
    };

    setNodes(prev => [...prev, newItem]);
    setSelectedNodeId(id);
  };

  return (
    <div className={`w-screen h-screen flex bg-[#fafafa] overflow-hidden text-slate-800 text-sm font-sans antialiased select-none ${swissTheme ? 'swiss-grid-active' : ''}`}>
      
      {/* 1. Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAskHeya={handleAskHeya}
        isAiLoading={isAiLoading}
        chatHistory={chatHistory}
        language={language}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main content block routing */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden justify-between border-r">
        
        {/* Nav Header Bar */}
        <header className="h-[72px] shrink-0 border-b border-[#f1f5f9] bg-white px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button 
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-400 border border-slate-100"
                onClick={() => alert(tVal.header.returnBack)}
                title={tVal.header.returnBack}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button 
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-400 border border-slate-100"
                onClick={() => alert(tVal.header.forward)}
                title={tVal.header.forward}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-[#f8fafc]/90 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50 cursor-pointer transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">{tVal.header.mainSpace}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Avatars */}
            <div className="flex items-center -space-x-2">
              {AVATARS.map((url, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm relative cursor-pointer">
                  <img src={url} alt="Collaborator" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 text-slate-500 font-bold text-[10px] flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-100">
                +4
              </div>
            </div>

            {/* Share action */}
            <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow shadow-indigo-500/15">
              <Share2 className="w-3.5 h-3.5" />
              <span>{tVal.header.share}</span>
            </button>

            <button className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100" title={tVal.header.more}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Tab Router */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'projectspace' && (
            <ProjectSpace 
              nodes={nodes}
              setNodes={setNodes}
              language={language}
            />
          )}

          {activeTab === 'fieldmap' && (
            <FieldMapCanvas 
              nodes={nodes}
              setNodes={setNodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              onAddMapItem={handleAddMapItemDirectly}
              language={language}
            />
          )}

          {activeTab === 'hey' && (
            <HeyCompanion 
              nodes={nodes}
              setNodes={setNodes}
              setSelectedNodeId={setSelectedNodeId}
              setActiveTab={setActiveTab}
              language={language}
            />
          )}

          {activeTab === 'forge' && (
            <ForgeLogic 
              nodes={nodes}
              setNodes={setNodes}
              setActiveTab={setActiveTab}
              setSelectedNodeId={setSelectedNodeId}
              language={language}
            />
          )}

          {activeTab === 'muse' && (
            <MuseIdeation 
              ideas={ideas}
              setIdeas={setIdeas}
              onEvolveNode={handleEvolveNode}
              language={language}
            />
          )}

          {activeTab === 'oermos' && (
            <OermosNetwork language={language} />
          )}

          {activeTab === 'relations' && (
            <RelationsTopology 
              nodes={nodes}
              language={language}
            />
          )}

          {/* TAB 3: Component Library listing config */}
          {activeTab === 'component' && (
            <div className="flex-1 overflow-y-auto p-10 space-y-6 animate-in fade-in-20 duration-300">
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">Active Components Index - Hearth Library</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Manage logical structures, descriptions, and tag descriptors for components registered inside your active workspace map.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodes.map((n) => (
                  <div key={n.id} className="bg-white border rounded-2xl p-5 hover:border-indigo-200 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {n.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Progress: {n.progress}%</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#0f172a] mb-1.5">{n.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">{n.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 border-t pt-3">
                      {n.tags.map((tg, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#f8fafc] text-indigo-600 text-[9px] font-extrabold rounded-md border border-slate-100">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Explore (Research, inspiration, and grounding exploration field) */}
          {activeTab === 'explore' && (
            <div className="flex-1 overflow-y-auto p-10 space-y-6 animate-in fade-in-20 duration-300">
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a] flex items-center gap-1.5">
                  <Compass className="w-5.5 h-5.5 text-indigo-500" />
                  <span>Grounding Exploration Field</span>
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Connect academic libraries, evaluate deep research parameters, and seed foundational frameworks (HRDF-1.0).
                </p>
              </div>

              {/* Research index display */}
              <div className="bg-[#f8fafc] border rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 max-w-2xl py-12">
                <BookOpen className="w-12 h-12 text-[#6366f1]/20 animate-pulse" />
                <h3 className="text-base font-extrabold text-[#0f172a]">Academic and Methodology Vault Active</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md">
                  We have loaded 252 academic papers and the HRDF-1.0 (Methodology framework). These are loaded directly inside Hey’s vector reference retrieval layers.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Foundations registered.')}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-all"
                  >
                    Load Papers Deck (252)
                  </button>
                  <button 
                    onClick={() => alert('Retrieving guidelines.')}
                    className="px-4 py-2 border text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    View HRDF-1.0 Methodology
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. Settings Preference Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border text-[#0f172a] rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-6 mx-4">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <span>{tVal.settingsModal.header}</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  {tVal.settingsModal.desc}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              
              {/* Language Selection Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {tVal.settingsModal.languageLabel}
                </label>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      language === 'en' 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow shadow-indigo-600/10' 
                        : 'bg-[#f8fafc] border-slate-200/60 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tVal.settingsModal.langEn}
                  </button>
                  <button 
                    onClick={() => setLanguage('zh')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      language === 'zh' 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow shadow-indigo-600/10' 
                        : 'bg-[#f8fafc] border-slate-200/60 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tVal.settingsModal.langZh}
                  </button>
                </div>
              </div>

              {/* Swiss Theme Toggle */}
              <div className="pt-2 flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-700">{tVal.settingsModal.swissTheme}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                    {tVal.settingsModal.swissThemeDesc}
                  </p>
                </div>
                <button 
                  onClick={() => setSwissTheme(!swissTheme)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    swissTheme ? 'bg-[#10b981]' : 'bg-slate-200'
                  }`}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-205 ${
                    swissTheme ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 bg-[#0f172a] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow transition-all duration-200"
              >
                {tVal.settingsModal.saveBtn}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
