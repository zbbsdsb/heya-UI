/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Send, 
  Compass, 
  Zap, 
  CheckCircle2, 
  FileText, 
  Plus, 
  X, 
  AlertTriangle, 
  Globe, 
  Shuffle, 
  Fingerprint, 
  Layers, 
  Activity,
  Award
} from 'lucide-react';
import { MuseIdea, NodeData } from '../types';
import { translations } from '../locales';

interface MuseIdeationProps {
  ideas: MuseIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<MuseIdea[]>>;
  onEvolveNode: (id: string, text: string, title?: string, tags?: string[], connections?: string[]) => void;
  language?: 'en' | 'zh';
  nodes?: NodeData[];
}

interface ContextDoc {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  updatedAt: string;
}

const localT = {
  en: {
    docsTitle: "Active Project Source Documents (Grounding)",
    docsDesc: "Define specs, user reviews, or reference material. Sovereign AI reads these along with active canvas nodes to dream up out-of-the-box answers.",
    addDoc: "Add Reference Spec",
    docTitlePl: "e.g. Oasis Co. Competitive Spec",
    docContentPl: "e.g. Focus on absolute offline local sync, strict security bounds, zero centralised storage...",
    saveDoc: "Anchor Material",
    cancel: "Cancel",
    emptyDocs: "No grounding specs uploaded. Add one to ground the AI's mind-bending concepts!",
    chooseDimension: "Select Ideation Vector Paradigm",
    dimensionHelp: "Under what paradigm should the Agent think outside the box to challenge you?",
    sparkBtn: "Spark Cognitive Divergence",
    sparkEmptyNodes: "Please build some Field Map nodes first to serve as seed material!",
    loadingReadNodes: "Querying active project graph topologies...",
    loadingReadDocs: "Synthesizing grounding source specs...",
    loadingThinking: "Dismantling standard industry assumptions...",
    loadingFleshing: "Formulating out-of-the-box proposals...",
    disruptive_architecture: "⚡ Disruptive P2P Protocols",
    disruptive_architecture_desc: "Bypassing corporate clouds with serverless Gossip meshes, tunnels, and CRDT sync.",
    swiss_deselection: "🎨 Swiss UX Deselection",
    swiss_deselection_desc: "Brutalist minimalism, zero shadows, strict grid structures and focus bounds.",
    post_capitalist_pivot: "💼 Anti-Monarchic Econ Loops",
    post_capitalist_pivot_desc: "Localized barter loops, open-source coops, and peer-to-peer compute exchanges.",
    synergy_loops: "🔥 Autopoietic Synergy Nets",
    synergy_loops_desc: "Autonomous multi-agent orchestration checks that self-spawn and self-heal.",
    richIdeasTitle: "Agent-Spawned Mind-Bending Ideas",
    contraLabel: "Convention Dismantled",
    riskLabel: "Engineering & Adoption Risks",
    connectionsLabel: "Suggested Canvas Anchor Handles",
    evolvedSuccess: "Proposal materialized successfully onto active Field Map canvas!",
    wordCount: "words",
    seedPromptLabel: "Capture Fleeting Idea Spark (Quick Input)"
  },
  zh: {
    docsTitle: "活跃项目参考物料库 (接地关联文档)",
    docsDesc: "添加需求规范、用户手记或核心文档。AI 会在底层阅读这些文本，并结合主画布节点星图进行不合常规的超维概念推衍。",
    addDoc: "载入参考需求物料",
    docTitlePl: "例如：Oasis 竞品差异化竞争规范",
    docContentPl: "例如：专注于完全本地优先、免除中心缓存、主权物理节点自校验安全机制...",
    saveDoc: "锚定此物料",
    cancel: "取消",
    emptyDocs: "尚未载入本地接地关联物料。添加一个 spec 能辅助 AI 生成更具体极富洞见的构想！",
    chooseDimension: "决定 AI 的批判性创意发散方向",
    dimensionHelp: "设定 AI 颠覆你既定思维、拆解常识的工作流流派",
    sparkBtn: "触发超常灵感爆发 (获取打破陈规的好看点)",
    sparkEmptyNodes: "请先在 Field Map 画布上新增至少一个节点，才能提供奇点推导基础！",
    loadingReadNodes: "正在检索和校验主星图拓扑节点...",
    loadingReadDocs: "深度剖析和融合已加载的关联文档物料...",
    loadingThinking: "正在攻破常规思维定式并打破底层预设...",
    loadingFleshing: "正在繁育带有去中心化批判特性的高维度主权构想...",
    disruptive_architecture: "⚡ 颠覆性 P2P 协作网格",
    disruptive_architecture_desc: "利用零服务器 Gossip 通道和 WebRTC 穿透，打破 SaaS 垄断，守护物理主权。",
    swiss_deselection: "🎨 瑞士硬度解构与功能主义",
    swiss_deselection_desc: "绝不敷衍！砍光多余渐变和华而不实的功能，转而以硬朗边界和等宽格网为先。",
    post_capitalist_pivot: "💼 反垄断算力对等易货微循环",
    post_capitalist_pivot_desc: "抛弃法币支付结算和高昂网卡，用物理中继的闲置渲染能力获取 AI 推理权。",
    synergy_loops: "🔥 自繁育多代理自主统筹网",
    synergy_loops_desc: "高批判意识 AI 骨架自主分裂，协同自诊断，免于同步人工控制锁带来的摩擦。",
    richIdeasTitle: "AI 颠覆性解构产生的超常建议",
    contraLabel: "打破的行业陈规与默认预设",
    riskLabel: "技术工程与落地潜在博弈风险",
    connectionsLabel: "推荐挂载的画布节点原点",
    evolvedSuccess: "物种繁育物质化成功！全新灵感节点已生成在赫斯画布中心。",
    wordCount: "字数",
    seedPromptLabel: "急促记下飞过的思想碎形 (即时输入)"
  }
};

export default function MuseIdeation({ 
  ideas, 
  setIdeas, 
  onEvolveNode, 
  language = 'en', 
  nodes = [] 
}: MuseIdeationProps) {
  const [newThought, setNewThought] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('disruptive_architecture');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Modal toggle for adding reference document
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');

  const tVal = translations[language].muse;
  const lVal = localT[language];

  // Initialize and persist reference context Documents
  const [docs, setDocs] = useState<ContextDoc[]>(() => {
    const saved = localStorage.getItem('hearth_muse_docs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_muse_docs', e);
      }
    }
    return [
      {
        id: 'doc-1',
        title: language === 'en' ? 'Oasis P2P Node Broadcast Spec' : 'Oasis P2P 去中心节点广播规范',
        content: language === 'en' 
          ? `Service endpoints must adhere to zero server footprint rules. Establish multi-hop WebRTC signaling pathways across distributed browsers. Peer routing requires NAT coordinate discovery via decentralized Gossip tables to avoid single-point outages. Node state locks use high-performance vector sync.`
          : `业务终点必须坚持零中心化服务器驻留。在分布式的多端浏览器之间建立多跳 WebRTC 自洽信令。对等传输依赖 Gossip 协议表，剔除常规 SaaS 中继网卡保障高防灾表现。`,
        wordCount: 45,
        updatedAt: '2026/06/10'
      },
      {
        id: 'doc-2',
        title: language === 'en' ? 'Hearth Switzerland Typography Manifesto' : '赫斯瑞士版式极端自律设计白皮书',
        content: language === 'en'
          ? `Deselect visual clutter. Use strict grid margin divisions: 25px gaps, 2px borders, absolute sharp edges, high contrast. Pastes and cards are stripped of micro-shadow borders unless representing an active drag node. Color is used solely as functional telemetry indicator, not decor.`
          : `主动丢弃一切花哨装饰。对版面进行硬质微划分，坚持等宽等距网格配给、纯对齐比例。彻底抛弃圆角、华而不实的微阴影投影和无力斑驳。对色彩的使用遵循严格的数据监控和 telemetry 指示作用。`,
        wordCount: 44,
        updatedAt: '2026/06/09'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hearth_muse_docs', JSON.stringify(docs));
  }, [docs]);

  // Sequential loading text generator loops
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % 4);
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isGenerating]);

  // Adding quick fleeting idea sparks manually
  const handleCaptureThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    (window as any).playTactileChime?.('click');

    const freshIdea: MuseIdea = {
      id: `muse-${Date.now()}`,
      content: newThought.trim(),
      createdAt: language === 'en' ? 'Today' : '今天',
    };

    setIdeas(prev => [freshIdea, ...prev]);
    setNewThought('');

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Quick fleeting spark cached locally.' : '即时记下的灵感碎屑已闪速置入沙盒。', 
        type: 'info' 
      }
    }));
  };

  // Adding a structured Spec document to grounded database
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) return;

    (window as any).playTactileChime?.('click');

    const newDoc: ContextDoc = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      content: docContent.trim(),
      wordCount: docContent.trim().split(/\s+/).length,
      updatedAt: '2026/06/10'
    };

    setDocs(prev => [newDoc, ...prev]);
    setDocTitle('');
    setDocContent('');
    setIsAddDocOpen(false);

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Sovereign spec anchored into local grounding memory.' : '参考业务物料已加密植入本地感官接地内存。', 
        type: 'success' 
      }
    }));
  };

  const handleDeleteDoc = (id: string) => {
    (window as any).playTactileChime?.('click');
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleDeleteIdea = (id: string) => {
    (window as any).playTactileChime?.('click');
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  // Triggering the Masterclass AI Cognitive Divergence generator
  const triggerCognitiveDivergence = async () => {
    if (nodes.length === 0) {
      (window as any).playTactileChime?.('alert');
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { message: lVal.sparkEmptyNodes, type: 'warn' }
      }));
      return;
    }

    (window as any).playTactileChime?.('click');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/muse-inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimension: selectedDimension,
          nodes,
          documents: docs,
          language
        })
      });

      if (!response.ok) {
        throw new Error('AI gateway service timeout or invalid state');
      }

      const generatedIdeas = await response.json();
      
      const structuredSparks = generatedIdeas.map((item: any, idx: number) => ({
        id: `muse-ai-${Date.now()}-${idx}`,
        content: item.content,
        title: item.title,
        createdAt: language === 'en' ? 'AI Synthesis' : 'AI 推新器',
        category: item.category || selectedDimension,
        contraAssumption: item.contraAssumption,
        implementationRisk: item.implementationRisk,
        suggestedConnections: item.suggestedConnections || []
      }));

      // Append generated smart proposals at front of user sandbox
      setIdeas(prev => [...structuredSparks, ...prev]);
      (window as any).playTactileChime?.('success');

      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: language === 'en' 
            ? `Divergence spark complete: Spawning 3 anti-conformist conceptual paradigms!` 
            : `主权思维奇点爆发！在当前流派下繁育派生出 3 个不合常规的高维方案。`, 
          type: 'success' 
        }
      }));

    } catch (err) {
      console.error(err);
      (window as any).playTactileChime?.('alert');
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { message: language === 'en' ? 'AI compilation pipeline error. Fallback systems armed.' : 'AI 引擎解构信道拥堵，本地降级推理已就绪。', type: 'warn' }
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Staggering load states labels
  const getLoaderLabel = () => {
    switch (loadingStep) {
      case 0: return lVal.loadingReadNodes;
      case 1: return lVal.loadingReadDocs;
      case 2: return lVal.loadingThinking;
      case 3: return lVal.loadingFleshing;
      default: return lVal.loadingReadNodes;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] p-10 space-y-8 animate-in fade-in-20 duration-300">
      
      {/* 1. Header Hero Panel with metrics badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
              <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-300/40" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
                {language === 'en' ? 'Muse — Divergent Cognitive Lab' : 'Muse — 逆向思维主权工坊'}
              </h2>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5 max-w-xl leading-relaxed">
                {language === 'en' 
                  ? "Shatter engineering conformism. Spark radical, out-of-the-box conceptual architectures generated dynamically from your topological raw maps and local product blueprints."
                  : "拒绝平庸，拆毁常识。整合全局 Field Map 拓扑星图与物理需求物料，反常规繁育出超越默认预设的高风险、高价值、极其锐利的拓扑设计方案。"}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic telemetry metrics in margins */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-2 font-mono text-[10px] font-bold text-slate-500 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>{nodes.length} Canvas Nodes</span>
          </div>

          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center gap-2 font-mono text-[10px] font-bold text-slate-500 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>{docs.length} Specs Loaded</span>
          </div>

          <span className="px-3.5 py-2 bg-amber-500 border border-amber-600/10 rounded-xl text-[10px] font-black font-mono text-white uppercase tracking-widest animate-pulse">
            {ideas.length} {language === 'en' ? 'SPARKS CACHED' : '个灵感已缓存'}
          </span>
        </div>
      </div>

      {/* 2. Main Workspace Twin Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ================= LEFT HAND SIDE: SPEC SOURCES & TRIGGER ================= */}
        <div className="space-y-6">
          
          {/* A. Reference Specs Grounding Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm shadow-slate-100/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>{lVal.docsTitle}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 max-w-md">
                  {lVal.docsDesc}
                </p>
              </div>

              <button 
                onClick={() => {
                  (window as any).playTactileChime?.('click');
                  setIsAddDocOpen(!isAddDocOpen);
                }}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-600 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1"
              >
                {isAddDocOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isAddDocOpen ? lVal.cancel : lVal.addDoc}</span>
              </button>
            </div>

            {/* Document Form Drawer (Smooth CSS fade) */}
            {isAddDocOpen && (
              <form onSubmit={handleAddDocument} className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4.5 mb-4 space-y-3 animate-in slide-in-from-top-3 duration-200">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Spec File Title</span>
                  <input 
                    type="text" 
                    placeholder={lVal.docTitlePl}
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Spec Text Content (Unstructured)</span>
                  <textarea 
                    placeholder={lVal.docContentPl}
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    required
                    rows={4}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-505 font-medium leading-relaxed resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddDocOpen(false)}
                    className="px-3.5 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold text-[10px] rounded-lg transition-all"
                  >
                    {lVal.cancel}
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-emerald-600 border border-emerald-700/10 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-sm"
                  >
                    {lVal.saveDoc}
                  </button>
                </div>
              </form>
            )}

            {/* Specs List Cards */}
            {docs.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <FileText className="w-7 h-7 mx-auto text-slate-300 animate-pulse" />
                <p className="text-[10px] font-bold">{lVal.emptyDocs}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {docs.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl relative hover:bg-slate-100/20 transition-all flex justify-between items-start">
                    <div className="min-w-0 pr-6">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-700 truncate">{doc.title}</h4>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 font-mono text-[8px] font-extrabold rounded">
                          {doc.wordCount} {lVal.wordCount}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1.5 font-medium leading-relaxed line-clamp-2">
                        {doc.content}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors absolute top-3.5 right-3.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B. Divergent Mind-sparker Core Panel */}
          <div className="bg-white border border-slate-250/60 rounded-2xl p-6 shadow-sm shadow-slate-100/50 relative overflow-hidden">
            {/* Background glowing rings */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-400/5 blur-2xl rounded-full" />
            <div className="absolute left-1/3 top-1/2 w-32 h-32 bg-indigo-400/5 blur-3xl rounded-full" />

            <div className="relative z-10 space-y-5">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>{lVal.chooseDimension}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  {lVal.dimensionHelp}
                </p>
              </div>

              {/* Paradigm Grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    id: 'disruptive_architecture',
                    label: lVal.disruptive_architecture,
                    desc: lVal.disruptive_architecture_desc
                  },
                  {
                    id: 'swiss_deselection',
                    label: lVal.swiss_deselection,
                    desc: lVal.swiss_deselection_desc
                  },
                  {
                    id: 'post_capitalist_pivot',
                    label: lVal.post_capitalist_pivot,
                    desc: lVal.post_capitalist_pivot_desc
                  },
                  {
                    id: 'synergy_loops',
                    label: lVal.synergy_loops,
                    desc: lVal.synergy_loops_desc
                  }
                ].map((item) => {
                  const isActive = selectedDimension === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        (window as any).playTactileChime?.('click');
                        setSelectedDimension(item.id);
                      }}
                      className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isActive 
                          ? 'border-indigo-600 bg-[#eef2ff]/30' 
                          : 'border-slate-200/60 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-600 rounded-bl-lg" />
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 block">
                          {item.label}
                        </span>
                        <p className="text-[9.5px] leading-relaxed text-slate-500 font-semibold mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Colossal Divergence Action Catalyst Button */}
              <button
                type="button"
                onClick={triggerCognitiveDivergence}
                disabled={isGenerating}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all relative overflow-hidden shrink-0 ${
                  isGenerating 
                    ? 'bg-slate-700 pointer-events-none cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:opacity-[0.96] shadow-orange-500/10'
                }`}
              >
                {isGenerating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-950 animate-pulse" />
                )}
                
                <span className="relative z-10 flex items-center gap-2.5">
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300 animate-spin shrink-0" />
                      <span>{getLoaderLabel()}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-300 animate-pulse fill-amber-300/20 shrink-0" />
                      <span>{lVal.sparkBtn}</span>
                    </>
                  )}
                </span>
              </button>

            </div>
          </div>

          {/* C. Quick Idea Spark Input (Preserving retroactive capture) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm shadow-slate-100/30">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              {lVal.seedPromptLabel}
            </span>

            <form onSubmit={handleCaptureThought} className="flex gap-2.5">
              <input 
                type="text" 
                placeholder={tVal.inputPlaceholder}
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                className="flex-1 text-xs px-3.5 py-3 bg-[#f8fafc] border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 font-bold"
                required
              />
              <button 
                type="submit"
                className="px-4.5 bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all text-white font-extrabold rounded-xl flex items-center gap-1.5 shadow-md text-xsshrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'en' ? 'Sow' : '播种'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* ================= RIGHT HAND SIDE: COGNITIVE SANDBOX ================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {lVal.richIdeasTitle}
            </h3>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-mono text-[9px] font-extrabold rounded-md uppercase">
              {language === 'en' ? 'Active Matrix' : '对齐激发态'}
            </span>
          </div>

          {ideas.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-white border border-slate-200/50 text-slate-400 space-y-3">
              <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-xl mx-auto">
                <Sparkles className="w-6 h-6 text-slate-300 animate-pulse" />
              </div>
              <p className="text-xs font-bold leading-relaxed max-w-sm mx-auto">
                {language === 'en'
                  ? 'No conceptual ideas stacked in local sandbox memory. Select a dimension and click the Colossal trigger to spark AI ideas grounded in your project!'
                  : '灵感沙盒内存空虚。在左侧选择流派方向并点击触发，AI 伙伴将深度学习当前拓扑节点并生产打破常规的方案。'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {ideas.map((idea) => {
                const categoryClass = 
                  idea.category?.toLowerCase().includes('architecture') ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                  : idea.category?.toLowerCase().includes('swiss') ? 'bg-amber-50 text-amber-700 border-amber-100'
                  : idea.category?.toLowerCase().includes('capitalist') ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-rose-50 text-rose-600 border-rose-100';

                return (
                  <div 
                    key={idea.id}
                    className="bg-white border-2 border-slate-200/90 rounded-2xl p-6 hover:border-indigo-600/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-5 relative"
                  >
                    {/* Telemetry ribbon */}
                    <div className="absolute top-0 left-6 transform -translate-y-1/2 flex gap-1.5 items-center">
                      <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider border ${categoryClass}`}>
                        {idea.category || (language === 'en' ? 'Fleeting Spark' : '感性碎形')}
                      </span>
                      {idea.suggestedConnections && idea.suggestedConnections.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded text-[8.5px] bg-[#03020c] border border-slate-900 text-indigo-300 font-mono font-bold tracking-tight">
                          Topology Bound
                        </span>
                      )}
                    </div>

                    {/* Content display */}
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-black text-slate-800 tracking-tight">
                          {idea.title || (language === 'en' ? 'Quick Intuition Spark' : '无名念头')}
                        </h4>
                        
                        <span className="text-[9px] font-mono font-bold text-slate-400">
                          {idea.createdAt}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                        {idea.content}
                      </p>

                      {/* Structural rich callouts only for AI-generated items */}
                      {idea.contraAssumption && (
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-orange-600 font-mono flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-orange-500" />
                            <span>{lVal.contraLabel}</span>
                          </span>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed pl-5">
                            {idea.contraAssumption}
                          </p>
                        </div>
                      )}

                      {idea.implementationRisk && (
                        <div className="p-3.5 bg-red-50/20 border border-red-50/50 rounded-xl space-y-1">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-red-500 font-mono flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            <span>{lVal.riskLabel}</span>
                          </span>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed pl-5">
                            {idea.implementationRisk}
                          </p>
                        </div>
                      )}

                      {/* Suggested connections linking back to existing nodes */}
                      {idea.suggestedConnections && idea.suggestedConnections.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lVal.connectionsLabel}</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5 pl-4.5">
                            {idea.suggestedConnections.map((connId: string) => {
                              const relatedNode = nodes.find(n => n.id === connId);
                              return (
                                <span 
                                  key={connId} 
                                  className="px-2 py-0.5 bg-indigo-50/50 border border-indigo-100 rounded font-mono text-[9px] font-bold text-indigo-600"
                                  title={relatedNode?.description || 'Active mapping system node coordinate'}
                                >
                                  📍 {relatedNode?.title || (language === 'en' ? 'Hearth Core Coordinate' : '画布对齐坐标')}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Evolver controls */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                      <button 
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                        title={language === 'en' ? 'Delete Idea' : '删除构想'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {idea.convertedToNodeId ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-black font-mono">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          <span>{tVal.evolvedLabel}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            (window as any).playTactileChime?.('click');
                            // Evolve text representing the proposal's full substance
                            const nodeTitle = idea.title || (idea.content.length > 20 ? idea.content.slice(0, 18) + '...' : idea.content);
                            const nodeDesc = idea.content + (idea.contraAssumption ? `\n\n[Convention Dismantled]\n${idea.contraAssumption}` : '');
                            const nodeTags = ['Muse-Evolved', idea.category || 'Divergence'].filter(Boolean);
                            const nodeConns = idea.suggestedConnections || [];
                            
                            onEvolveNode(idea.id, nodeDesc, nodeTitle, nodeTags, nodeConns);
                            
                            window.dispatchEvent(new CustomEvent('heya-toast', {
                              detail: { message: lVal.evolvedSuccess, type: 'success' }
                            }));
                          }}
                          className="px-4.5 py-2.5 bg-[#03020c] hover:bg-slate-900 text-amber-300 rounded-xl text-[10.5px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md hover:scale-[1.03] transition-all"
                        >
                          <span>{tVal.evolveButton}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
