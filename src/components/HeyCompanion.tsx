/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Zap, 
  Settings, 
  MessageSquare, 
  ShieldAlert, 
  BookOpen, 
  RefreshCw,
  Check,
  UserCheck,
  Activity,
  Sliders,
  Send,
  Database,
  ArrowRight,
  Smile,
  Shield,
  Eye,
  GitMerge
} from 'lucide-react';
import { NodeData, NodeType } from '../types';
import { translations } from '../locales';

interface HeyCompanionProps {
  nodes?: NodeData[];
  setNodes?: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setSelectedNodeId?: (id: string | null) => void;
  setActiveTab?: (tab: string) => void;
  language?: 'en' | 'zh';
}

interface DialogueMessage {
  id: string;
  sender: 'user' | 'hey';
  text: string;
  timestamp: string;
  actionNode?: {
    title: string;
    type: NodeType;
    description: string;
    tags: string[];
  };
}

export default function HeyCompanion({ 
  nodes = [], 
  setNodes, 
  setSelectedNodeId, 
  setActiveTab,
  language = 'en'
}: HeyCompanionProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'attributes' | 'journal' | 'boundaries'>('attributes');

  const tVal = translations[language].hey;

  // Personality sliders
  const [analyticalDepth, setAnalyticalDepth] = useState(85);
  const [warmthProximity, setWarmthProximity] = useState(70);
  const [rebelRatio, setRebelRatio] = useState(90);
  const [obsFrequency, setObsFrequency] = useState(65);

  // Companion state
  const [companionName, setCompanionName] = useState('Hey');
  const [companionRole, setCompanionRole] = useState<'Mentor' | 'Rebel Co-founder' | 'Scholar' | 'Tactician'>('Rebel Co-founder');
  const [trustLevel, setTrustLevel] = useState(78);
  const [familiarityLevel, setFamiliarityLevel] = useState(3);
  const [worldviewStr, setWorldviewStr] = useState(
    language === 'en' 
      ? 'Decentralized sovereignty, Swiss minimalistic interfaces, peer-to-peer data replication via Oermos, seed-before-fire development philosophies.'
      : 'Decentralized sovereignty, Swiss minimalistic interfaces, peer-to-peer data replication via Oermos, seed-before-fire development philosophies.'
  );

  // Dialogue inside Hey panel
  const [localChatInput, setLocalChatInput] = useState('');
  const [dialogues, setDialogues] = useState<DialogueMessage[]>([
    {
      id: 'd-1',
      sender: 'hey',
      text: '你好 ceaserzhao。我刚刚重新计算了我们的 Hearth 拓扑关系链。我注意到 Project A 还是 62% 的完成度，Oasis 公司的接口对齐还没有完全启动。或许我们需要在 Field Map 上额外补充一波 [竞品分析拆解]？我这里有一些准备好的反思。',
      timestamp: '11:45'
    },
    {
      id: 'd-2',
      sender: 'user',
      text: '可以，你有什么具体的切入方向建议吗？',
      timestamp: '11:47'
    },
    {
      id: 'd-3',
      sender: 'hey',
      text: '我建议围绕瑞士极简主义和 P2P 网格设计展开分析。我已经把这两个维度的研究想法写在我的 Reflections 反思日志里了。你可以进入 “Hey Reflections Journal” 选项卡，点击一键“具象化为地图节点 (Materialize as Node)”，它会自动飞入我们的 Hearth 主空间！',
      timestamp: '11:48'
    }
  ]);

  // Preloaded Reflections list which CAN be materialized onto the real Hearth map
  const [reflections, setReflections] = useState([
    {
      id: 'ref-1',
      time: '12:05 今日最新',
      title: '关于 Oasis 接口边界的过渡组件提案',
      text: '为了完美对齐 Oasis 公司的对接规范，我们需要一个轻量、低耦合的安全代理节点。这个代理可以拦截外部不可信的 WebRTC 握手机制。',
      nodeTitle: 'Oasis Security Proxy',
      nodeType: 'agent' as NodeType,
      nodeTags: ['Agent', '安全网桥', 'Oasis'],
      materialized: false
    },
    {
      id: 'ref-2',
      time: '昨日 19:40',
      title: 'P2P 通讯底座 (Oermos) 安全边界思考与反思',
      text: '当前的 Zurich Gateway 连接很流畅，但本地广播在极端网络下可能由于包溢出而闪耀。建议在 Canvas 侧加入一个 WebRTC 缓冲限流机制节点。',
      nodeTitle: 'WebRTC Flow Limiter',
      nodeType: 'resource' as NodeType,
      nodeTags: ['网络协议', '资源缓冲', '瑞士规范'],
      materialized: false
    },
    {
      id: 'ref-3',
      time: '前天 11:12',
      title: '关于 ceaserzhao 本周创意流动率的元诊断',
      text: '统计显示，由于我们在 Muse 中频繁捕获微光碎片，目前的构思质量极高。建议将去中心化元数据直接广播的构思，迅速进化为 Hearth 的活动产品域。',
      nodeTitle: 'Decentralized Broadcast',
      nodeType: 'project' as NodeType,
      nodeTags: ['创意', '广播底模', '网络协议'],
      materialized: false
    }
  ]);

  // Quick Seed prompt lists for interaction
  const chatSeeds = language === 'en' ? [
    { text: 'Propose a Swiss-minimalist typography node', type: 'design' },
    { text: 'Audit high-load handshake latency filters', type: 'p2p' },
    { text: 'Architectural diagnostic review on Project A', type: 'architecture' }
  ] : [
    { text: '提出一个极简主义界面的优化节点', type: 'design' },
    { text: '检查 Zurich P2P 握手网关的瓶颈', type: 'p2p' },
    { text: '我想对 Project A 进行架构反思', type: 'architecture' }
  ];

  // Action handlers
  const handleModifyNameRole = (role: typeof companionRole) => {
    setCompanionRole(role);
    setTrustLevel(prev => Math.min(100, prev + 5));
    // Provide autonomous instant reaction
    const systemPromptReply = `[Seed Bond Reset] 我的设定已成功迁移为 [${role}]。我的分析视角将据此对齐。当前感知世界观深度：${analyticalDepth}%。`;
    setDialogues(prev => [...prev, {
      id: `sys-${Date.now()}`,
      sender: 'hey',
      text: systemPromptReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSendDialogue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localChatInput.trim()) return;

    const userMsg: DialogueMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: localChatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDialogues(prev => [...prev, userMsg]);
    const typedText = localChatInput;
    setLocalChatInput('');

    // Simulated local sovereign engine response, reading Hearth node counts for context
    setTimeout(() => {
      let responseText = '';
      let actionSuggestion: DialogueMessage['actionNode'] = undefined;

      responseText = language === 'en'
        ? `Received, ceaserzhao. I have audited our active ${nodes.length} Hearth cards. Guided by my [${companionRole}] mindset, I suggest we continue evolving our topology by materializing thoughts from our Reflections Journal.`
        : `收到，ceaserzhao。我读取了当前已激活的 ${nodes.length} 个 Hearth 卡片组件。结合我的角色 [${companionRole}]，我建议继续丰富我们的拓扑。我们可以通过把 “Reflections Journal” 中的心流建议直接物质化为项目节点，来激活下一步协作链路。`;

      setDialogues(prev => [...prev, {
        id: `h-${Date.now()}`,
        sender: 'hey',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionNode: actionSuggestion
      }]);
      setTrustLevel(prev => Math.min(100, prev + 2));
    }, 600);
  };

  // True physical sprouting handler - materialize a node inside the app nodes state!
  const handleMaterializeNode = (id: string, title: string, type: NodeType, desc: string, tags: string[]) => {
    if (!setNodes || !setSelectedNodeId || !setActiveTab) {
      alert('Hearth state controller failed to load.');
      return;
    }

    // Materialize in nodes state
    const randomOffsetOfCoords = 120;
    const freshId = `node-hey-${Date.now()}`;
    const spawnedNode: NodeData = {
      id: freshId,
      type,
      title,
      description: desc,
      x: 350 + Math.floor(Math.random() * randomOffsetOfCoords),
      y: 280 + Math.floor(Math.random() * randomOffsetOfCoords),
      progress: 0,
      members: ['ceaserzhao', 'Agent Spark'],
      checklist: [{ id: `item-inner-${freshId}`, text: language === 'en' ? 'Align metrics with Hey thoughts' : '根据 Hey 的元自省建议对齐指标', done: false }],
      tags: [...tags, 'Hey-Catalyzed'],
      connections: ['project-a', 'todo-list'],
      createdAt: '25/05/30',
      updatedAt: '25/05/30'
    };

    setNodes(prev => [...prev, spawnedNode]);
    setSelectedNodeId(freshId);

    // Update reflections list UI status
    setReflections(prev => prev.map(r => r.id === id ? { ...r, materialized: true } : r));

    // Instant switch to workspace map for rich interactive feedback
    setActiveTab('fieldmap');
  };

  // Dialogue prompt seed click
  const handleSeedClick = (text: string) => {
    setLocalChatInput(text);
  };

  const handleBondingInteraction = () => {
    setTrustLevel(prev => Math.min(100, prev + 3));
    if (trustLevel >= 95 && familiarityLevel < 5) {
      setFamiliarityLevel(prev => prev + 1);
    }

    const feedbacks = language === 'en' ? [
      "Great to hear your voice ceaserzhao. I am updating synchronization arrays on our Oermos node structures.",
      "A resonance pulse triggered! Synchronized handshake bandwidth efficiency boosted by 4.2% on our Zurich node.",
      "As your Sovereign Companion, your thought privacy remains my absolute standard. Our Hearth environment protects your work offline.",
      "Our workspace alignment index is higher than 98% of conventional organizations. We are ready to execute Swiss design rules."
    ] : [
      "很高兴听到你的声音。我正对当前拓扑中 4 个未完成的子任务做语义归一。呼唤我将随时帮助你投射构思。",
      "刚才我们触发了一次心流共振！我们在 Oermos 网络节点上的信道同步效率提升了 4.2%。",
      "作为你的 Sovereign Companion，你的主权边界总是我的首要准则。我们的 Hearth 基地保持百分百的本地隔离。",
      "我认为，我们现在的对齐模式已经超过了 98% 的传统协作组。我们可以开始下一阶段的极简主义重构。"
    ];

    const randomFeed = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    setDialogues(prev => [...prev, {
      id: `sys-${Date.now()}`,
      sender: 'hey',
      text: `[${tVal.bondedResonance}] “${randomFeed}”`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 bg-[#fafafa] space-y-8 animate-in fade-in-20 duration-300">
      
      {/* 1. Header with dynamic states */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
              {tVal.headerTitle} {companionName}
            </h2>
            <div className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-extrabold rounded-md font-mono uppercase tracking-widest animate-pulse">
              hey.core.v1
            </div>
          </div>
          <p className="text-xs text-slate-500 font-bold mt-1 max-w-2xl leading-relaxed">
            {tVal.headerDesc}
          </p>
        </div>

        {/* Dynamic State Bar */}
        <div className="flex items-center gap-3 bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-sm">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-75" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-black text-slate-400 font-mono tracking-wider uppercase leading-none">
              {tVal.p2pSeed}
            </div>
            <div className="text-xs font-extrabold text-[#0f172a] mt-0.5 font-mono">
              {tVal.bonded}
            </div>
          </div>
        </div>
      </div>



      {/* 2. Main interactive workspace layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT CARD (Grid Size 4): Personality Radar, Bond Levels, Fluid Blob Anim */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-40 group-hover:scale-125 transition-all" />

          {/* Interactive Fluid State Blob */}
          <div className="text-center space-y-4 pt-4 relative">
            <div className="relative w-32 h-32 mx-auto cursor-pointer group" onClick={handleBondingInteraction} title="点击与 Hey 互动、触发心灵共振（Bonding Check）">
              
              {/* Outer decorative orbit radar */}
              <div className="absolute inset-0 border border-slate-200 border-dashed rounded-full animate-spin-slow duration-10000" />
              <div className="absolute -inset-2 border border-indigo-100/30 rounded-full animate-pulse" />

              {/* Dynamic Aura color shifts depending on current analytical slides */}
              <div className="w-full h-full bg-gradient-to-tr from-[#6366f1] via-[#d946ef] to-[#3b82f6] rounded-[38px] p-1 shadow-lg transform active:scale-95 transition-all aspect-square flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[34px] flex items-center justify-center relative overflow-hidden">
                  
                  {/* Glowing core particles */}
                  <span className="text-4xl text-white select-none animate-bounce duration-3000 font-mono">⬢</span>
                  
                  {/* Pulsing scanner ray overlay */}
                  <div className="absolute inset-0 bg-indigo-500/10 mix-blend-color-dodge animate-pulse" />
                  
                  {/* Subtle vector indicator labels */}
                  <div className="absolute bottom-2 text-[8px] font-mono text-indigo-300/60 uppercase tracking-widest">
                    seed: {analyticalDepth}/{rebelRatio}
                  </div>
                </div>
              </div>

              {/* Float heart status badge */}
              <div className="absolute -bottom-1 -right-1 bg-white hover:bg-rose-50 border border-slate-200 text-rose-500 self-center w-9 h-9 flex items-center justify-center rounded-xl shadow-md cursor-pointer transition-all hover:scale-105 active:scale-90" title="Bonding Heart Check">
                <Heart className="w-4 h-4 fill-rose-500 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#0f172a]">{companionName}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-bold text-indigo-600 font-mono uppercase tracking-widest leading-none">
                  {companionRole}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Metrics Panel */}
          <div className="space-y-4 bg-[#f8fafc]/90 border border-slate-200/50 rounded-2xl p-4 relative">
            
            {/* Trust Meter */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {tVal.trustIndex}
                </span>
                <span className="font-mono text-xs font-black">{trustLevel}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${trustLevel}%` }}
                />
              </div>
            </div>

            {/* Familiarity Tier */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-t border-slate-200/50 pt-3">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                {tVal.relationshipLevel}
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-mono text-[10px] uppercase font-black tracking-wider shadow-sm border border-indigo-100">
                Tier {familiarityLevel} {tVal.bondedSec}
              </span>
            </div>

            {/* Hearth Sync stats */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-t border-slate-200/50 pt-3">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                {tVal.engineMode}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {tVal.sovereignReasoning}
              </span>
            </div>
          </div>

          {/* Core Prompt Rules Warning */}
          <div className="text-[11px] text-slate-400 font-bold leading-relaxed border-t border-slate-100 pt-4 flex gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{tVal.hearthSecurityWarning}</span>
          </div>

          {/* Interactive Bonding Trigger Button */}
          <button 
            type="button"
            onClick={handleBondingInteraction}
            className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>{tVal.bondingButton}</span>
          </button>
        </div>


        {/* RIGHT COMPLEX PANEL (Grid Size 8): Sub Tabs, Persona Calibration, Reflections, Real Dialogue Platform */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm min-h-[580px]">
          
          <div>
            {/* Top segment control selector */}
            <div className="flex flex-wrap gap-1.5 bg-[#f1f5f9]/80 border p-1 rounded-2xl mb-6">
              <button 
                onClick={() => setActiveSubTab('attributes')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeSubTab === 'attributes' 
                    ? 'bg-white text-[#0f172a] shadow-sm font-extrabold border' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{tVal.tabPersonality}</span>
              </button>

              <button 
                onClick={() => setActiveSubTab('journal')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all relative ${
                  activeSubTab === 'journal' 
                    ? 'bg-white text-[#0f172a] shadow-sm font-extrabold border' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{tVal.tabReflections}</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-4 animate-ping" />
              </button>

              <button 
                onClick={() => setActiveSubTab('boundaries')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeSubTab === 'boundaries' 
                    ? 'bg-white text-[#0f172a] shadow-sm font-extrabold border' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{tVal.tabBoundaries}</span>
              </button>
            </div>


            {/* TAB 1 CONTENT: Companion Personality Sliders and Paradigm presets */}
            {activeSubTab === 'attributes' && (
              <div className="space-y-6">
                
                {/* Paradigm Preset Buttons */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <span>{tVal.activeParadigm}</span>
                    <span className="font-mono text-[9px] text-[#6366f1]">(Click to auto-calibrate sliders)</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {([
                      { name: 'Rebel Co-founder', label: '核心合伙人', desc: '富于挑战、探索、推进WebRTC', analytical: 88, warmth: 75, rebel: 94, obs: 60 },
                      { name: 'Mentor', label: '学术导师', desc: '深度学术洞察、逻辑框架诊断', analytical: 95, warmth: 50, rebel: 40, obs: 80 },
                      { name: 'Scholar', label: '隐世学者', desc: '极简背景自省、少打扰无噪音', analytical: 92, warmth: 30, rebel: 25, obs: 90 },
                      { name: 'Tactician', label: '高产战术官', desc: '务实整理、极速推进待办完成', analytical: 80, warmth: 85, rebel: 60, obs: 50 }
                    ]).map((role) => {
                      const isActive = companionRole === role.name;
                      return (
                        <button
                          key={role.name}
                          onClick={() => {
                            handleModifyNameRole(role.name as any);
                            setAnalyticalDepth(role.analytical);
                            setWarmthProximity(role.warmth);
                            setRebelRatio(role.rebel);
                            setObsFrequency(role.obs);
                          }}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all select-none cursor-pointer ${
                            isActive 
                              ? 'border-indigo-500 bg-indigo-50/30' 
                              : 'border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <span className={`text-xs font-extrabold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                              {role.name}
                            </span>
                            <div className="text-[10px] text-slate-400 font-bold mt-0.5 leading-tight">
                              {role.label}
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-400 mt-2 font-semibold leading-relaxed">
                            {role.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Persona Slide Bars (Truly Interactive Sliders) */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    {tVal.fineCharacter}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8fafc]/70 border border-slate-200/50 rounded-2xl p-5">
                    
                    {/* Slider 1 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>{tVal.analyticalDepth}</span>
                        <span className="font-mono text-indigo-600 font-black">{analyticalDepth}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        value={analyticalDepth} 
                        onChange={(e) => setAnalyticalDepth(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <p className="text-[9px] text-slate-400 font-semibold">{tVal.analyticalDesc}</p>
                    </div>

                    {/* Slider 2 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>{tVal.warmthProximity}</span>
                        <span className="font-mono text-indigo-600 font-black">{warmthProximity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={warmthProximity} 
                        onChange={(e) => setWarmthProximity(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <p className="text-[9px] text-slate-400 font-semibold">{tVal.warmthDesc}</p>
                    </div>

                    {/* Slider 3 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>{tVal.rebelRatio}</span>
                        <span className="font-mono text-indigo-600 font-black">{rebelRatio}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={rebelRatio} 
                        onChange={(e) => setRebelRatio(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <p className="text-[9px] text-slate-400 font-semibold">{tVal.rebelDesc}</p>
                    </div>

                    {/* Slider 4 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>{tVal.obsFrequency}</span>
                        <span className="font-mono text-indigo-600 font-black">{obsFrequency}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={obsFrequency} 
                        onChange={(e) => setObsFrequency(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      <p className="text-[9px] text-slate-400 font-semibold">{tVal.obsDesc}</p>
                    </div>

                  </div>
                </div>

                {/* Worldview Config */}
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    <span>{tVal.customWorldview}</span>
                  </h4>
                  <textarea 
                    rows={2}
                    value={worldviewStr}
                    onChange={(e) => setWorldviewStr(e.target.value)}
                    className="w-full text-xs p-3.5 border rounded-2xl focus:ring-1 focus:ring-indigo-500 font-bold text-slate-800 leading-relaxed placeholder-slate-400"
                    placeholder={tVal.worldviewPlaceholder}
                  />
                  <p className="text-[10px] text-slate-400 font-bold mt-1 leading-normal">
                    {tVal.customWorldviewDesc}
                  </p>
                </div>

              </div>
            )}


            {/* TAB 2 CONTENT: Hey Reflections Journal & Sproutable Materializer */}
            {activeSubTab === 'journal' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-500 bg-[#f8fafc]/90 p-4 rounded-2xl border border-slate-200/60 shadow-sm leading-relaxed">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    {language === 'en' 
                      ? "Based on your daily interactions inside your Hearth space, Hey has crystallized 3 reflective entries:"
                      : "根据您在 Hearth 地图上对组件的日常操作，Hey 的自省引擎独立凝练了 3 份研究反思："
                    }
                  </span>
                  <button 
                    onClick={() => {
                      alert(language === 'en' ? 'Aura Refreshed! Hey is running semantics categorization checking...' : 'Aura Refreshed! Hey 正在进行语义关系对齐归一检查...');
                    }}
                    className="flex items-center gap-1 hover:text-[#0f172a] font-mono text-xs uppercase px-2.5 py-1 bg-white border rounded-xl hover:shadow-sm"
                  >
                    <RefreshCw className="w-3 h-3 text-indigo-500 animate-spin" />
                    <span>{tVal.syncInsightsBtn}</span>
                  </button>
                </div>

                {/* Scrollable Journal list. EACH row allows direct materialization back onto Hearth canvas */}
                <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
                  {reflections.map((r) => {
                    // Localized string matching
                    let displayTime = r.time;
                    let displayTitle = r.title;
                    let displayText = r.text;
                    let displayTags = r.nodeTags;

                    if (language === 'en') {
                      if (r.id === 'ref-1') {
                        displayTime = '12:05 Today';
                        displayTitle = 'Draft Proposal on Oasis Interface Boundaries';
                        displayText = 'To perfectly align with the Oasis interface specs, we need a lightweight, low-coupling security proxy node that intercepts untrusted WebRTC handshake requests.';
                        displayTags = ['Agent', 'Security', 'Oasis'];
                      } else if (r.id === 'ref-2') {
                        displayTime = 'Yesterday 19:40';
                        displayTitle = 'Security Boundaries & Self-diagnostics for Oermos P2P Mesh';
                        displayText = 'Current Zurich network handshakes are smooth, but local broadcasts can choke on data overflow in extreme latency conditions. Implementing a WebRTC buffer limiter node is highly recommended.';
                        displayTags = ['Mesh', 'Resource', 'SwissDesign'];
                      } else if (r.id === 'ref-3') {
                        displayTime = '2 days ago';
                        displayTitle = 'Workspace Idea-Velocity Meta-Diagnostics';
                        displayText = 'Analysis indicates that our Muse workflow shows peak creative efficacy. We should solidify the decentralized broadcast idea into an active Hearth segment card right away.';
                        displayTags = ['Inspiration', 'Broadcast', 'P2P'];
                      }
                    }

                    return (
                      <div 
                        key={r.id} 
                        className="p-5 bg-white border border-slate-200 hover:border-indigo-200 rounded-3xl transition-all shadow-sm flex flex-col md:flex-row justify-between items-start gap-4 relative overflow-hidden group"
                      >
                        {/* Left color bar depending on type */}
                        <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                          r.nodeType === 'agent' ? 'bg-emerald-500' :
                          r.nodeType === 'resource' ? 'bg-pink-500' : 'bg-indigo-500'
                        }`} />

                        <div className="space-y-2 flex-1 pl-4">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 font-extrabold uppercase tracking-widest">
                            <span>{displayTime}</span>
                            <span>•</span>
                            <span className={`${
                              r.nodeType === 'agent' ? 'text-emerald-600' :
                              r.nodeType === 'resource' ? 'text-pink-600' : 'text-indigo-600'
                            }`}>{r.nodeType.toUpperCase()} PARADIGM THOUGHT</span>
                          </div>

                          <h5 className="text-sm font-black text-[#0f172a]">{displayTitle}</h5>
                          
                          <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            {displayText}
                          </p>

                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {displayTags.map((tg, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-[#f8fafc] text-indigo-600 text-[9px] font-black rounded-md border border-slate-100">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* True Real-time Materialization Trigger Button */}
                        <div className="shrink-0 self-center">
                          {r.materialized ? (
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-100/50 text-slate-400 px-3 py-2 rounded-xl text-xs font-black font-mono">
                              <Check className="w-3.5 h-3.5" />
                              <span>{tVal.materializedLabel}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMaterializeNode(r.id, r.nodeTitle, r.nodeType, displayText, displayTags)}
                              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-black transition-all hover:scale-[1.02] shadow shadow-indigo-500/10 cursor-pointer"
                            >
                              <span>{tVal.materializeBtn}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


            {/* TAB 3 CONTENT: Sovereign Gating Boundaries & Sandbox Security */}
            {activeSubTab === 'boundaries' && (
              <div className="space-y-5">
                
                {/* Visual warning */}
                <div className="p-4 bg-orange-50 text-orange-900 border border-orange-200 rounded-3xl flex gap-3.5 leading-relaxed">
                  <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase tracking-wider text-orange-950">
                      {tVal.boundariesAlertHeader}
                    </div>
                    <p className="text-xs font-bold text-orange-900/80">
                      {tVal.boundariesAlertDesc}
                    </p>
                  </div>
                </div>

                {/* Config boundaries */}
                <div className="space-y-3.5 pt-2">
                  <div className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl transition-all flex justify-between items-center gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h5 className="text-xs font-extrabold text-[#0f172a]">{tVal.boundaryDirectPathTitle}</h5>
                      <span className="text-[10px] text-slate-400 font-bold leading-normal block">
                        {tVal.boundaryDirectPathDesc}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl transition-all flex justify-between items-center gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h5 className="text-xs font-extrabold text-[#0f172a]">{tVal.boundaryAestheticTitle}</h5>
                      <span className="text-[10px] text-slate-400 font-bold leading-normal block">
                        {tVal.boundaryAestheticDesc}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked={false} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl transition-all flex justify-between items-center gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h5 className="text-xs font-extrabold text-[#0f172a]">{tVal.boundaryP2pTitle}</h5>
                      <span className="text-[10px] text-slate-400 font-bold leading-normal block">
                        {tVal.boundaryP2pDesc}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                {/* Additional diagnostic sandbox summary fields */}
                <div className="bg-[#f8fafc]/80 border rounded-2xl p-4 flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-500 font-bold uppercase">{tVal.tokenLabel}</span>
                  <span className="text-indigo-600 font-black">ACTIVE_SOVEREIGNTY_CHECK_SUCCESS // 0x4a7e93</span>
                </div>

              </div>
            )}

            
            {/* 3. DYNAMIC CO-CREATION STRATEGY CHAT BOX */}
            <hr className="border-slate-100 my-6" />

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{tVal.jointStrategySession}</span>
              </h4>

              {/* Chat Message Lists */}
              <div className="bg-[#f8fafc] border border-slate-200/60 rounded-2xl p-4 h-[180px] overflow-y-auto space-y-3.5">
                {dialogues.map((msg) => {
                  const isHey = msg.sender === 'hey';
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 max-w-[85%] ${isHey ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      {/* Mini Avatar */}
                      <div className={`w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs shadow-sm select-none ${
                        isHey ? 'bg-black text-white' : 'bg-[#eef2ff] text-indigo-700 border border-indigo-200'
                      }`}>
                        {isHey ? '⬢' : 'Z'}
                      </div>

                      <div className="space-y-1.5">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-bold border transition-all ${
                          isHey 
                            ? 'bg-white text-slate-800 border-slate-100 shadow-sm' 
                            : 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        }`}>
                          <p>{msg.text}</p>
                          
                          {/* Inside chat materializer trigger if Hey returns an action suggestion */}
                          {isHey && msg.actionNode && (
                            <div className="mt-3 p-3 bg-slate-50/90 border rounded-xl space-y-2 text-slate-700">
                              <div className="flex justify-between items-center">
                                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  {msg.actionNode.type} Suggested
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono">Aura Catalyzed</span>
                              </div>
                              <h5 className="font-extrabold text-[#0f172a] text-xs">{msg.actionNode.title}</h5>
                              <p className="text-[10px] text-slate-500 leading-normal">{msg.actionNode.description}</p>
                              
                              <button
                                type="button"
                                onClick={() => handleMaterializeNode(
                                  `chat-action-${Date.now()}`,
                                  msg.actionNode!.title,
                                  msg.actionNode!.type,
                                  msg.actionNode!.description,
                                  msg.actionNode!.tags
                                )}
                                className="w-full py-1.5 bg-black hover:bg-neutral-800 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-300" />
                                <span>{tVal.sproutBtnLabel}</span>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className={`text-[9px] text-slate-400 font-bold font-mono ${isHey ? 'text-left' : 'text-right'}`}>
                          {isHey ? 'Hey Companion' : 'ceaserzhao'} • {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seed selection chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mr-1">
                  Prompt Seeds:
                </span>
                {chatSeeds.map((seed, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSeedClick(seed.text)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-extrabold text-slate-600 transition-all active:scale-95 cursor-pointer shadow-sm hover:border-slate-300"
                  >
                    🌱 {seed.text}
                  </button>
                ))}
              </div>

              {/* Message send form bar */}
              <form onSubmit={handleSendDialogue} className="flex gap-2">
                <input 
                  type="text"
                  placeholder={tVal.strategyPlaceholder}
                  value={localChatInput}
                  onChange={(e) => setLocalChatInput(e.target.value)}
                  className="flex-1 text-xs px-4 py-3 border border-slate-200 focus:border-indigo-500 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-slate-800 bg-white shadow-inner placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 bg-indigo-600 hover:bg-indigo-750 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-[1.01] active:transform active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
                  title={language === 'en' ? 'Send' : '发送'}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          <hr className="border-slate-100 my-4" />

          {/* Bottom active seed state */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3.5 pt-1.5">
            <span className="text-[11px] font-black text-slate-400 font-mono tracking-widest uppercase">
              HEYA2U-HEY // CO-CREATION CO-FOUNDER CONFIGURED
            </span>
            <button 
              type="button"
              onClick={() => {
                alert(language === 'en' ? 'World parameters initialized. Seeds successfully bound to vector memory engines.' : '世界状态参数成功初始化，对齐关系链已成功绑定本地检索向量内存引擎。');
              }}
              className="px-5 py-2.5 bg-[#0f172a] hover:bg-neutral-800 text-white rounded-xl text-xs font-black border hover:shadow-sm active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
            >
              {tVal.initCompanionBtn}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
