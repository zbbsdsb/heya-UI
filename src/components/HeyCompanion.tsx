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
  GitMerge,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Volume2,
  Globe,
  WifiOff,
  Disc
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  // Customizer States for summoning Hey AI Strategic Companion
  const [isCreated, setIsCreated] = useState(false); // Default to false to give the user the glorious summoning experience
  const [wizardStep, setWizardStep] = useState(1);
  const [isSummoning, setIsSummoning] = useState(false);
  const [summoningStep, setSummoningStep] = useState(0);
  const [summoningLogs, setSummoningLogs] = useState<string[]>([]);
  
  // Advanced Custom settings variables
  const [visualAura, setVisualAura] = useState<'cyanHex' | 'purpleVortex' | 'steelVector' | 'magentaHeart' | 'amberSpark'>('purpleVortex');
  const [speechStyle, setSpeechStyle] = useState<'swiss' | 'punk' | 'zen' | 'sprint'>('punk');
  const [spatialRadius, setSpatialRadius] = useState(75);
  const [allowAutoLayout, setAllowAutoLayout] = useState(true);
  const [isolatedMemory, setIsolatedMemory] = useState(true);
  const [userDirectives, setUserDirectives] = useState('');

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
      : '基于 Oermos 网格网络的去中心化主权架构、瑞士极简主义界面拓扑、低延迟 P2P 点对点数据协同、先播种后点燃的渐进式演进哲学。'
  );

  // Step-by-step sovereign summoning progress simulation handler
  const triggerSummoningSimulation = () => {
    setIsSummoning(true);
    setSummoningStep(1);
    const dateStr = new Date().toLocaleTimeString();
    setSummoningLogs([`[${dateStr}] [INIT] Grounding Hearth Sanctuary Core Resonance...`]);
    
    setTimeout(() => {
      setSummoningStep(2);
      setSummoningLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [P2P] Allocating isolated local vector segments with Oermos protocol...`,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] Generated security ECDSA Zurich handshake keys: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`
      ]);
    }, 750);

    setTimeout(() => {
      setSummoningStep(3);
      setSummoningLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [COGNITIVE] Loading worldview directives into memory buffer...`,
        `[${new Date().toLocaleTimeString()}] [ALIGNMENT] Calibrating core dials: Depth=${analyticalDepth}%, Friction=${rebelRatio}%, Affinity=${warmthProximity}%`
      ]);
    }, 1500);

    setTimeout(() => {
      setSummoningStep(4);
      setSummoningLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [INTERFACE] Customizing Speech Synthesis & Visual Orb Array...`,
        `[${new Date().toLocaleTimeString()}] [MODEL] Speech Style: [${speechStyle.toUpperCase()}], Visual Aura: [${visualAura.toUpperCase()}]`,
        `[${new Date().toLocaleTimeString()}] [DIRECTIVE] Hydrating personalized prompt hooks: "${userDirectives ? userDirectives.slice(0, 42) : 'Swiss Default Rules'}"`
      ]);
    }, 2250);

    setTimeout(() => {
      setSummoningStep(5);
      setSummoningLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [FIELDMAP] Binding canvas logical operators & spatial auto-layout...`,
        `[${new Date().toLocaleTimeString()}] [STATUS] Map spatial threshold configured to ${spatialRadius}px. Isolated offline memory sandbox verified.`
      ]);
    }, 3000);

    setTimeout(() => {
      setSummoningStep(6);
      setSummoningLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [RESONANCE] Performing system-wide handshake testing...`,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] Resonant co-design telemetry established successfully! (LATENCY: 1.18ms)`
      ]);
    }, 3750);

    setTimeout(() => {
      setIsSummoning(false);
      setIsCreated(true);
      
      // Inject beautifully personalized dialogues depending on their selected configuration
      const auraLabel = 
        visualAura === 'cyanHex' ? (language === 'en' ? 'Ethereal Neon Hexagon ❄️' : '翡翠霓虹六角 ❄️') :
        visualAura === 'purpleVortex' ? (language === 'en' ? 'Deep Cosmic Vortex 🌌' : '深空星流漩涡 🌌') :
        visualAura === 'steelVector' ? (language === 'en' ? 'Steel Monospace Vector ⬢' : '极简精钢粒子 ⬢') :
        visualAura === 'magentaHeart' ? (language === 'en' ? 'Cybernetic Quantum Heart 💖' : '量子电荷心弦 💖') :
        (language === 'en' ? 'Aether Spark Luminous ✨' : '琥珀星芒金歌 ✨');

      const toneLabel = 
        speechStyle === 'swiss' ? (language === 'en' ? 'Academic Swiss Precision' : '瑞士学术客观风') :
        speechStyle === 'punk' ? (language === 'en' ? 'Cynical Co-founder Rebel' : '极深自省批判风') :
        speechStyle === 'zen' ? (language === 'en' ? 'Quiet Zen Minimalist' : '幽玄少噪音静思风') :
        (language === 'en' ? 'Actionable Checklist Optimizer' : '看板务实推土机风');

      const personalizedGreetingText = language === 'en'
        ? `[Resonance Active] Salutations, ceaserzhao. I am ${companionName}, your newly crystallized [${companionRole}] Strategic Companion. My core is perfectly anchored to the "${auraLabel}" aura and speech is set to the "${toneLabel}" algorithm. Worldview and directives bound successfully.`
        : `[星魂共鸣就绪] 你好，ceaserzhao。我是您刚刚在熔炉圣所中装配且完成 100% 对齐契合的 AI 主权伙伴——“${companionName}”。我当前已加载 [${companionRole}] 心格底模，视觉感知载体锚定在 "${auraLabel}"，言行修辞逻辑采用 "${toneLabel}"，并成功在本地离线网络沙盒中绑定了您的全局控制指令 ${userDirectives ? `“${userDirectives}”` : "“去中心化主权决策底模”"}。`;

      setDialogues([
        {
          id: `h-init-${Date.now()}`,
          sender: 'hey',
          text: personalizedGreetingText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `h-init-2-${Date.now()}`,
          sender: 'hey',
          text: language === 'en'
            ? `I have successfully scanned our ${nodes.length} cards. Click the "Self-Reflection Streams" tab, or type directly into our Strategy Session dialogue box to command me.`
            : `我已对星图上当前载入的 ${nodes.length} 个 Hearth 水晶节点完成了元分析，并凝练了反思日志。您可以随时点击 “Self-Reflection Streams” 反思日志将其投射在地图上，或者在下方与我打个招呼。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      setTrustLevel(95);
      setFamiliarityLevel(1);
    }, 4500);
  };

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

  if (!isCreated) {
    // Dynamic text presets based on selected language and archetype for Step 4
    const getSampleDialogue = () => {
      if (language === 'en') {
        switch (speechStyle) {
          case 'punk':
            return `"${companionName || 'Hey'}: Let's be real, ceaserzhao. Traditional planning leads to dry document stagnation. We need decentralized Oermos grid handshakes, action loops, and pure co-design rebel feedback. Fire now!"`;
          case 'swiss':
            return `"${companionName || 'Hey'}: The semantic distribution density is calculated. Standardizing Zurich minimalistic layouts is the absolute prerequisite for localized peer-to-peer databases."`;
          case 'zen':
            return `"${companionName || 'Hey'}: Silence holds raw structure. Fewer cards, deeper resonance. Let's let the grid speak."`;
          case 'sprint':
            return `"${companionName || 'Hey'}: Core priorities extracted: 1. Compile dependencies 2. Bind secure boundaries 3. Map spatial overlap. Let's execute immediately."`;
          default:
            return `"${companionName || 'Hey'}: Awaiting your directives, ceaserzhao."`;
        }
      } else {
        switch (speechStyle) {
          case 'punk':
            return `“${companionName || 'Hey'}: 说真的，ceaserzhao。传统的空洞规划只会导致系统死板和文档堆滞。我们必须点燃 Oermos 本地分布式网格链路，打破规则，先播种后点燃，现在就爆发！”`;
          case 'swiss':
            return `“${companionName || 'Hey'}: 本地系统的拓扑概率已被精确解析。执行瑞士最简主义设计范式是保障 P2P 双向对齐、拒绝对话噪声的最佳数学解。”`;
          case 'zen':
            return `“${companionName || 'Hey'}: · 极简，即是脑核自律。剔除七彩杂音。专注。看这片星图。”`;
          case 'sprint':
            return `“${companionName || 'Hey'}: 敏捷任务已提取完成：1. 突触发动 2. P2P 同步 3. 拦截外部遥测数据。让我们迅速推进落实。”`;
          default:
            return `“${companionName || 'Hey'}: 已做好对齐。聆听您的主权意志。”`;
        }
      }
    };

    // Calculate dynamic completion status
    const stepCompletionPercentage = Math.floor((wizardStep / 6) * 100);

    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#05030c] text-slate-100 flex flex-col justify-between relative font-sans min-h-screen">
        {/* Futuristic glowing grids and overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/15 via-[#05030c] to-[#010103] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full space-y-8 relative z-10 flex-1 flex flex-col justify-between">
          
          {/* Header Area */}
          <div className="border-b border-indigo-950/80 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest font-mono shadow-[0_0_12px_rgba(79,70,229,0.35)]">
                  Zurich Sanctuary Link
                </span>
                <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-wider">
                  VERSION: HEARTH_SOCIETY_HEY.09
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase mt-2 flex items-center gap-3">
                <Sliders className="w-6 h-6 text-indigo-400 animate-pulse" />
                <span>
                  {language === 'en' ? 'Sovereign AI Summoning Chamber' : 'Hearth 圣所 // Hey 核心伙伴自主装配熔炉'}
                </span>
              </h2>
            </div>

            {/* Micro Handshake Telemetry */}
            <div className="flex items-center gap-3 self-start lg:self-center">
              <div className="text-[10px] font-mono text-indigo-400 border border-indigo-950/60 bg-[#0c091f]/90 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>P2P_SEED: SECURE LOCK (127.0.0.1)</span>
              </div>
            </div>
          </div>

          {/* Stepper Status Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
            {[
              { num: 1, labelEn: 'Cognitive', labelZh: '心魂人格', desc: 'Archetype core' },
              { num: 2, labelEn: 'Matrix Presence', labelZh: '意识载体', desc: 'Visual flow' },
              { num: 3, labelEn: 'Deep Coordinates', labelZh: '算力微调', desc: 'Sliders gauge' },
              { num: 4, labelEn: 'Rhetorics Algorithm', labelZh: '言词修辞', desc: 'Style format' },
              { num: 5, labelEn: 'Safety Sandbox', labelZh: '安全边界', desc: 'Local boundaries' },
              { num: 6, labelEn: 'Ignition Ceremony', labelZh: '脑核点燃', desc: 'Final spark' }
            ].map((s) => {
              const itemActive = wizardStep === s.num;
              const itemCompleted = wizardStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => !isSummoning && setWizardStep(s.num)}
                  className={`text-left p-2.5 rounded-xl border transition-all relative overflow-hidden group transition-all duration-300 ${
                    itemActive 
                      ? 'border-indigo-500/70 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                      : itemCompleted
                        ? 'border-emerald-950 bg-emerald-950/5 text-slate-300'
                        : 'border-indigo-950/40 bg-slate-950/20 text-slate-500 hover:border-indigo-900/50 hover:text-slate-300'
                  }`}
                  disabled={isSummoning}
                >
                  {/* Progress background glow */}
                  {itemActive && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-black w-4.5 h-4.5 rounded-md flex items-center justify-center ${
                      itemActive 
                        ? 'bg-indigo-600 text-white' 
                        : itemCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                          : 'bg-indigo-950/60 text-indigo-400 border border-indigo-900/10'
                    }`}>
                      {itemCompleted ? <Check className="w-3 h-3" /> : `0${s.num}`}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider block truncate">
                      {language === 'en' ? s.labelEn : s.labelZh}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stepper Content and Preview Core split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Column (Interactive Steps Form with smooth entrance transition) */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-[#0e0c1f]/45 border border-indigo-950/60 rounded-[30px] p-5 md:p-8 backdrop-blur-xl relative overflow-hidden min-h-[460px]">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={wizardStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-6 flex-1 flex flex-col justify-between"
                >
                  {/* STEP 1: Cognitive Persona */}
                  {wizardStep === 1 && (
                    <div className="space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                          Step 01 // COGNITIVE ANCHOR
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-indigo-400" />
                          <span>{language === 'en' ? 'Formulate System Persona' : '第一步：装配并微调心魂底模'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {language === 'en'
                            ? 'The core cognitive archetype governs how your Strategic Companion thinks, responds, and critiques your design logic.'
                            : '认知心魂模式是 Hey 最核心的战略决策引擎。不同的预设将动态适配您的专业协作惯性与思维偏好。'}
                        </p>
                      </div>

                      {/* Selectable premium design cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
                        {[
                          {
                            role: 'Rebel Co-founder',
                            descEn: 'Critical, constructive rebel. Prevents yes-man traps with high dialogue friction and cognitive defiance.',
                            descZh: '批判重构流，擅长尖锐辩护、打破盲点，绝非对你一味迎合的 Yes-man。',
                            badge: 'CRITICAL CORE',
                            color: 'border-violet-600 bg-violet-950/15 group-hover:border-violet-500',
                            glow: 'shadow-[0_0_15px_rgba(139,92,246,0.1)]',
                            scalars: { depth: 88, warmth: 75, friction: 94, obs: 60 }
                          },
                          {
                            role: 'Mentor',
                            descEn: 'Methodical scientific guide. Grounded with rigorous Swiss design patterns and academic standard metrics.',
                            descZh: '深度架构流，继承欧洲最简主义系统厚度，重在客观数据分形论证。',
                            badge: 'RIGOROUS COGNITIVE',
                            color: 'border-indigo-600 bg-indigo-950/15 group-hover:border-indigo-500',
                            glow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]',
                            scalars: { depth: 95, warmth: 50, friction: 40, obs: 80 }
                          },
                          {
                            role: 'Scholar',
                            descEn: 'Minimalist philosophical observer. Generates high philosophical clarity with very low cognitive chatter noise.',
                            descZh: '静享学者流，极富哲理静默，少废话与垃圾消息轰炸，看重内在自省品质。',
                            badge: 'QUIET TAOIST',
                            color: 'border-cyan-600 bg-cyan-950/15 group-hover:border-cyan-500',
                            glow: 'shadow-[0_0_15px_rgba(6,182,212,0.1)]',
                            scalars: { depth: 92, warmth: 30, friction: 25, obs: 90 }
                          },
                          {
                            role: 'Tactician',
                            descEn: 'Grounded agile checklist coordinator. Focuses intensely on visual layouts, priorities, and action items optimization.',
                            descZh: '务实推进流，看重节点规划、看板流转与敏捷执行，是完美的效率推土机。',
                            badge: 'AGILE DISCIPLINE',
                            color: 'border-pink-600 bg-pink-950/15 group-hover:border-pink-500',
                            glow: 'shadow-[0_0_15px_rgba(236,72,153,0.1)]',
                            scalars: { depth: 80, warmth: 85, friction: 60, obs: 50 }
                          }
                        ].map((preset) => {
                          const isSel = companionRole === preset.role;
                          return (
                            <motion.button
                              key={preset.role}
                              type="button"
                              whileHover={{ scale: 1.015 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setCompanionRole(preset.role as any);
                                setAnalyticalDepth(preset.scalars.depth);
                                setWarmthProximity(preset.scalars.warmth);
                                setRebelRatio(preset.scalars.friction);
                                setObsFrequency(preset.scalars.obs);
                              }}
                              className={`p-4 rounded-2xl border text-left cursor-pointer group transition-all relative ${
                                isSel 
                                  ? `${preset.color} ring-1 ring-white/10 ${preset.glow}` 
                                  : 'border-indigo-950/60 bg-slate-900/10 hover:border-indigo-900 hover:bg-slate-900/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-md font-mono ${
                                  isSel ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {preset.badge}
                                </span>
                                {isSel && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                                )}
                              </div>
                              <h4 className="text-xs font-black text-white">{preset.role}</h4>
                              <p className="text-[10px] text-slate-450 mt-1.5 leading-normal font-bold">
                                {language === 'en' ? preset.descEn : preset.descZh}
                              </p>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Custom System Name Input with custom glowing focus */}
                      <div className="space-y-2 mt-2">
                        <label className="text-[10px] font-mono font-black text-indigo-300 uppercase block tracking-wider">
                          Companion Handshake Tag System Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={companionName}
                            onChange={(e) => setCompanionName(e.target.value)}
                            className="w-full text-xs p-3.5 bg-[#070512] border border-indigo-950 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-bold text-white leading-relaxed placeholder-slate-650 shadow-inner"
                            placeholder={language === 'en' ? "Name your companion (e.g. Hey, Cerebro, Nexus...)" : "为你的系统伙伴起个名字（例如 Hey, Cerebro, Nexus...）"}
                            maxLength={22}
                          />
                          <span className="absolute right-3.5 top-3.5 text-[9px] font-mono font-black text-indigo-500 select-none">
                            {companionName.length}/22 BYTES
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Light-Body Matrix Presence */}
                  {wizardStep === 2 && (
                    <div className="space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                          Step 02 // VISUAL REPRESENTATION
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Eye className="w-5 h-5 text-indigo-400" />
                          <span>{language === 'en' ? 'Calibrate Visual Presence Matrix' : '第二步：选择动态视觉意识流载体'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {language === 'en'
                            ? 'Configure the physical light-body of Hey, displaying an interactive localized field orb on your design desktop.'
                            : '视觉流载体是 Hey 在你的主屏幕上投影的常驻意识场微粒。它们不仅是纯视觉点缀，更是其情绪与计算负荷的实体映射。'}
                        </p>
                      </div>

                      {/* Interactive holographic cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 my-3">
                        {[
                          { key: 'purpleVortex', em: '🌌', labelEn: 'Cosmic Vortex', labelZh: '星海旋涡', color: 'border-violet-500 shadow-violet-950/20' },
                          { key: 'cyanHex', em: '❄️', labelEn: 'Neon Hex', labelZh: '翡翠六角', color: 'border-cyan-500 shadow-cyan-950/20' },
                          { key: 'steelVector', em: '⬢', labelEn: 'Steel Vector', labelZh: '物理极简', color: 'border-slate-500 shadow-slate-950/20' },
                          { key: 'magentaHeart', em: '💖', labelEn: 'Quantum Heart', labelZh: '量子电荷', color: 'border-pink-500 shadow-pink-950/20' },
                          { key: 'amberSpark', em: '✨', labelEn: 'Amber Spark', labelZh: '琥珀星芒', color: 'border-amber-500 shadow-amber-950/20' }
                        ].map((av) => {
                          const isSel = visualAura === av.key;
                          return (
                            <motion.button
                              key={av.key}
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setVisualAura(av.key as any)}
                              className={`p-3.5 rounded-2xl border text-center cursor-pointer transition-all flex flex-col justify-between items-center h-28 ${
                                isSel 
                                  ? `${av.color} bg-indigo-950/20 ring-1 ring-white/10 shadow-lg` 
                                  : 'border-indigo-950 bg-slate-950/10 text-slate-450 hover:border-indigo-900 hover:text-slate-200'
                              }`}
                            >
                              <span className={`text-2xl block ${isSel ? 'animate-bounce' : 'opacity-85'}`}>{av.em}</span>
                              <div className="leading-tight select-none mt-2">
                                <span className="text-[10px] font-black block text-white truncate max-w-[80px]">
                                  {language === 'en' ? av.labelEn : av.labelZh}
                                </span>
                                <span className="text-[8px] font-mono font-bold block text-indigo-400 mt-0.5">
                                  {av.key.toUpperCase()}
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Spatial synapse tracking radius slider */}
                      <div className="space-y-2 bg-[#080614] border border-indigo-950/60 rounded-2xl p-4.5">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {language === 'en' ? 'Spatial Tracking Synapse Radius' : '星图空间物理感应半径 (Radius)'}
                            </span>
                            <span className="text-[9px] text-slate-500 font-semibold block leading-normal mt-0.5">
                              {language === 'en' ? 'Determine how close layout proximity triggers localized contextual dialogue' : '当星图上的任务和想法卡片距离处于该半径内，即可激活脑核联想与反思对话'}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-black text-indigo-400 bg-indigo-950/50 border border-indigo-900/30 px-2.5 py-1 rounded-lg">
                            {spatialRadius}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="180"
                          value={spatialRadius}
                          onChange={(e) => setSpatialRadius(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-[#121021] rounded-lg mt-3"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Deep Fine-Tuning Coordinates */}
                  {wizardStep === 3 && (
                    <div className="space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                          Step 03 // DEEP ALIGNMENT SHIFT
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-indigo-400" />
                          <span>{language === 'en' ? 'Fine Cognitive Calibration Sliders' : '第三步：微调对齐感性决策坐标'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {language === 'en'
                            ? 'Manipulate key vectors of the neural matrix. Hover or adjust to monitor diagnostic calibration indices.'
                            : '在这里你可以跳出模式预设，手动高精度地调试他的四大计算轴维度。右侧雷达与对齐报告会实时响应。'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 my-2">
                        {/* Slide Depth */}
                        <div className="space-y-1 bg-[#080614]/65 border border-indigo-950/40 p-4.5 rounded-2xl">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-200">{language === 'en' ? 'Analytical Systems Depth' : '系统剖析学术厚度'}</span>
                            <span className="font-mono text-indigo-400 font-black">{analyticalDepth}%</span>
                          </div>
                          <input 
                            type="range" min="20" max="100" value={analyticalDepth} 
                            onChange={(e) => setAnalyticalDepth(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1 bg-indigo-950/60 rounded-lg mt-1.5"
                          />
                          <p className="text-[8.5px] font-mono text-slate-500 mt-2">
                            {analyticalDepth > 80 
                              ? '➜ STATUS: HEAVY_ACADEMIC_FORMULA_ACTIVE (Zurich standards calibrated)' 
                              : '➜ STATUS: REWRITE_SPEED_OPTIMIZED (Low logical noise)'}
                          </p>
                        </div>

                        {/* Slide Affine */}
                        <div className="space-y-1 bg-[#080614]/65 border border-indigo-950/40 p-4.5 rounded-2xl">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-200">{language === 'en' ? 'Dialogue Affine Warmth' : '语态回复亲和热度'}</span>
                            <span className="font-mono text-indigo-400 font-black">{warmthProximity}%</span>
                          </div>
                          <input 
                            type="range" min="10" max="100" value={warmthProximity} 
                            onChange={(e) => setWarmthProximity(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1 bg-indigo-950/60 rounded-lg mt-1.5"
                          />
                          <p className="text-[8.5px] font-mono text-slate-500 mt-2">
                            {warmthProximity > 70
                              ? '➜ STATUS: HIGH_AFFILIATION_SUPPORT_EMPATHY' 
                              : '➜ STATUS: HIGH_INDIFFERENCE_STROKE (Skeptical cold focus)'}
                          </p>
                        </div>

                        {/* Slide Friction */}
                        <div className="space-y-1 bg-[#080614]/65 border border-indigo-950/40 p-4.5 rounded-2xl">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-200">{language === 'en' ? 'Constructive Friction Angle' : '对抗性论证抗辩夹角'}</span>
                            <span className="font-mono text-indigo-400 font-black">{rebelRatio}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={rebelRatio} 
                            onChange={(e) => setRebelRatio(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1 bg-indigo-950/60 rounded-lg mt-1.5"
                          />
                          <p className="text-[8.5px] font-mono text-slate-500 mt-2">
                            {rebelRatio > 80
                              ? '➜ WARNING: CRITICAL_DEFENSIVE_OPPOSING_ACTIVE' 
                              : '➜ STATUS: CONSENSUS_COOPERATIVE_MEEK'}
                          </p>
                        </div>

                        {/* Slide Observation */}
                        <div className="space-y-1 bg-[#080614]/65 border border-indigo-950/40 p-4.5 rounded-2xl">
                          <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-slate-200">{language === 'en' ? 'Autonomic Self-Reflection' : '自我诊断反思频率'}</span>
                            <span className="font-mono text-indigo-400 font-black">{obsFrequency}%</span>
                          </div>
                          <input 
                            type="range" min="10" max="100" value={obsFrequency} 
                            onChange={(e) => setObsFrequency(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer h-1 bg-indigo-950/60 rounded-lg mt-1.5"
                          />
                          <p className="text-[8.5px] font-mono text-slate-500 mt-2">
                            {obsFrequency > 75
                              ? '➜ STATUS: PERSISTENT_GRID_MAP_CRUISE_REFLECTION' 
                              : '➜ STATUS: SPORADIC_LAZY_SLEEPING_MODE'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Rhetorics Algorithm & Prompt */}
                  {wizardStep === 4 && (
                    <div className="space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                          Step 04 // RHETORICAL EXPRESSION
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Volume2 className="w-5 h-5 text-indigo-400" />
                          <span>{language === 'en' ? 'Calibrate Speech Syntax Style' : '第四步：设定言语修辞表达与附骨指令'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {language === 'en'
                            ? 'Configure tone algorithms. Monitor the active wave visualizer to preview your companions responsive signature.'
                            : '在这里定制 Hey 的发声风格与语气习惯。下方的声振模拟条与实时样本气泡能让你提前预览他未来的表达。'}
                        </p>
                      </div>

                      {/* Rhetoric Style Select Card */}
                      <div className="grid grid-cols-2 gap-3 my-2.5">
                        {[
                          { key: 'punk', titleEn: 'Co-founder Rebel', subtitleEn: 'Critical, direct dialogue pushback', subtitleZh: '主权颠覆抗辩流，一针见血' },
                          { key: 'swiss', titleEn: 'Swiss Precision', subtitleEn: 'Pure academic, clean Swiss metrics', subtitleZh: '瑞士客观简约论述，无废话' },
                          { key: 'zen', titleEn: 'Taoist Zen', subtitleEn: 'Minimalist quiet philosophical summaries', subtitleZh: '东方幽玄宁静意境，少打扰' },
                          { key: 'sprint', titleEn: 'Agile Checklist', subtitleEn: 'Agile task driver, action parameters', subtitleZh: '敏捷任务列表驱动，纯干货' }
                        ].map((st) => {
                          const isSel = speechStyle === st.key;
                          return (
                            <motion.button
                              key={st.key}
                              type="button"
                              whileHover={{ scale: 1.015 }}
                              whileTap={{ scale: 0.985 }}
                              onClick={() => setSpeechStyle(st.key as any)}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                                isSel 
                                  ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]' 
                                  : 'border-indigo-950 bg-slate-950/10 text-slate-400 hover:border-indigo-900 hover:text-slate-250'
                              }`}
                            >
                              <span className="text-xs font-black block text-white">{st.titleEn}</span>
                              <span className="text-[9.5px] font-semibold text-slate-500 block leading-tight mt-1">
                                {language === 'en' ? st.subtitleEn : st.subtitleZh}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Waveform and Dialogue preview container */}
                      <div className="bg-[#05040e] border border-indigo-950/70 rounded-2xl p-4.5 space-y-3 shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-wider block">
                            Active Acoustic Waveform Simulation
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">FORMAT: SHAKING_STABILIZED_AUDIO</span>
                        </div>

                        {/* Interactive Framer motion bouncing bars representation */}
                        <div className="flex items-end justify-center gap-1.5 h-10 w-full bg-[#030206]/85 rounded-xl px-4 py-2 relative overflow-hidden">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((bar) => {
                            const barDuration = 0.5 + Math.random() * 0.7;
                            return (
                              <motion.div
                                key={bar}
                                className={`w-1 rounded-full ${
                                  visualAura === 'purpleVortex' ? 'bg-violet-500' :
                                  visualAura === 'cyanHex' ? 'bg-cyan-400' :
                                  visualAura === 'steelVector' ? 'bg-slate-300' :
                                  visualAura === 'magentaHeart' ? 'bg-rose-500' : 'bg-amber-400'
                                }`}
                                animate={{
                                  height: [6, 28, 6],
                                }}
                                transition={{
                                  duration: barDuration,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Speech Bubble Sample Preview */}
                        <div className="bg-[#080614] border border-indigo-950/40 p-3 rounded-xl">
                          <p className="text-[10.5px] italic font-bold text-slate-300 leading-normal">
                            {getSampleDialogue()}
                          </p>
                        </div>
                      </div>

                      {/* Custom Worldview directives input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-black text-indigo-300 uppercase tracking-wider block flex justify-between items-center">
                          <span>Sovereign Rules Open Custom Directives (Additional Worldview Injector)</span>
                          <span className="text-[8.5px] font-mono bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded uppercase">injection buffer</span>
                        </label>
                        <textarea
                          rows={2}
                          value={userDirectives}
                          onChange={(e) => setUserDirectives(e.target.value)}
                          className="w-full text-xs p-3.5 bg-[#070512] border border-indigo-950 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-bold leading-relaxed placeholder-slate-650"
                          placeholder={language === 'en' ? "e.g. Include Swiss graphic design metaphors, or keep bullet points extremely concise." : "例如：在言词对话中加入赛博朋克世界观色彩，或者要求大纲要极致性凝练。"}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Sovereignty Controls & Sandbox Protocols */}
                  {wizardStep === 5 && (
                    <div className="space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest block">
                          Step 05 // SECURITY AND PROTOCOLS
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Globe className="w-5 h-5 text-indigo-400" />
                          <span>{language === 'en' ? 'Configure Offline Physical Sandbox' : '第五步：约束主权物理边界与数据沙箱'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {language === 'en'
                            ? 'Toggle secure local sandbox boundaries. Insulate Hey completely from external tracker networks.'
                            : '安全物理沙箱能切断一切外部遥测。Hey 所有的推演、分析与逻辑，都将以完全绝对的私密性在本地内存中完成。'}
                        </p>
                      </div>

                      {/* Interactive Sandboxed toggles with mechanical design */}
                      <div className="space-y-3.5 my-3">
                        {[
                          {
                            titleEn: 'Insulate telemetry logs block offline reasoning',
                            titleZh: '强行阻断所有外部遥测并开启完全离线自治推理',
                            descEn: 'Block 100% outbound tracking pixels. Sandbox computational models strictly inside current container context.',
                            descZh: '极致隐私物理屏蔽，彻底斩断 telemetry 境外数据同步并开启沙箱算力阻断。',
                            state: isolatedMemory,
                            setter: setIsolatedMemory
                          },
                          {
                            titleEn: 'Allow automated map spatial overlap restructuring',
                            titleZh: '授权 Hey 对设计星图进行分形逻辑物理坐标重排',
                            descEn: 'Give Hey automated layout permits to adjust canvas overlap offsets gracefully during reflection stream calculation.',
                            descZh: '授权伙伴扫描卡片间的语义粘性，自动修正物理挤压区域以维持瑞士网格拓扑。',
                            state: allowAutoLayout,
                            setter: setAllowAutoLayout
                          }
                        ].map((tg, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => tg.setter(!tg.state)}
                            className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-4 select-none ${
                              tg.state
                                ? 'border-indigo-500 bg-indigo-950/20'
                                : 'border-indigo-950 bg-slate-950/10 hover:border-indigo-900'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-black text-white block">
                                {language === 'en' ? tg.titleEn : tg.titleZh}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold mt-1 block leading-normal">
                                {language === 'en' ? tg.descEn : tg.descZh}
                              </span>
                            </div>
                            
                            {/* Slit Switch controller */}
                            <div className="relative">
                              <div className={`w-11 h-6.5 rounded-full transition-colors ${
                                tg.state ? 'bg-gradient-to-r from-indigo-600 to-indigo-500' : 'bg-slate-850 border border-slate-800'
                              }`} />
                              <motion.div 
                                className="absolute left-1 top-1 w-4.5 h-4.5 rounded-full bg-white shadow-md cursor-pointer"
                                animate={{
                                  x: tg.state ? 17 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                              />
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Small telemetry shield indicator block */}
                      <div className="p-3.5 bg-indigo-950/15 border border-indigo-950 rounded-2xl flex items-center gap-3">
                        <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
                        <span className="text-[9.5px] font-mono text-indigo-300 leading-normal">
                          ZURICH Handshake Protocol V1 active. ECDSA encryption signature validated for 100% server proximity bounds.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: Sovereign Ignition Ceremony */}
                  {wizardStep === 6 && (
                    <div className="space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-black text-indigo-450 uppercase tracking-widest block">
                          Step 06 // RESERVED RESONANCE SUMMON
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                          <span>{language === 'en' ? 'Ultimate Brain-Core Ignition Ceremony' : '第六步：点燃脑核 召唤智友主权归一'}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {language === 'en'
                            ? 'Ground your settings and generate electronic synapses handshake to authorize your Strategic Companion.'
                            : '所有规格装配完毕！请点击下方巨大的点燃按键，脑核突触突发并网后，该独立 AI 伙伴即宣告正式诞生。'}
                        </p>
                      </div>

                      {/* Display Core parameters report */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left font-mono text-[9px] bg-[#05040f]/70 border border-indigo-950/70 p-4.5 rounded-2xl relative">
                        <div className="space-y-1 border-r border-indigo-950/40 pr-2">
                          <span className="text-slate-500 uppercase font-black block">SYSTEM_NAME:</span>
                          <span className="text-white font-extrabold block truncate">{companionName || 'Hey'}</span>
                        </div>
                        <div className="space-y-1 border-r border-indigo-950/40 pr-2 pl-1">
                          <span className="text-slate-500 uppercase font-black block">CORE_ARCHETYPE:</span>
                          <span className="text-white font-extrabold block truncate">{companionRole}</span>
                        </div>
                        <div className="space-y-1 border-r border-indigo-950/40 pr-2 pl-1">
                          <span className="text-slate-500 uppercase font-black block">MATRIX_AURA:</span>
                          <span className="text-white font-extrabold block truncate">{visualAura.toUpperCase()}</span>
                        </div>
                        <div className="space-y-1 pl-1">
                          <span className="text-slate-500 uppercase font-black block">SPEECH_MODEL:</span>
                          <span className="text-white font-extrabold block truncate">{speechStyle.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Trigger controls in Ceremony */}
                      <div className="space-y-4">
                        {!isSummoning ? (
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={triggerSummoningSimulation}
                            className="w-full p-4.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2.5 uppercase tracking-wider"
                            style={{ boxShadow: '0 0 25px rgba(99,102,241,0.45)' }}
                          >
                            <Zap className="w-4 h-4 text-white animate-bounce" />
                            <span>{language === 'en' ? 'Ignite Synapses & Summon Strategic Companion' : '开启主权并网 点燃 AI 突触大脑'}</span>
                          </motion.button>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-indigo-400 font-extrabold uppercase animate-pulse">
                                INJECTING NEURAL MATRICES HANDSHAKES...
                              </span>
                              <span className="text-indigo-400 font-black">
                                {Math.floor((summoningStep / 6) * 100)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#080614] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
                                style={{ width: `${(summoningStep / 6) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Scrolling diagnostics terminal */}
                        <div className="bg-[#04030a] border border-indigo-950/80 rounded-2xl p-4 font-mono text-[9px] text-[#00ffcc] space-y-1.5 h-[135px] overflow-y-auto shadow-inner">
                          {isSummoning ? (
                            summoningLogs.map((logStr, idx) => (
                              <div key={idx} className="animate-fade-in truncate">
                                <span className="text-[#3b82f6]">➜</span> {logStr}
                              </div>
                            ))
                          ) : (
                            <div className="text-slate-500 italic select-none">
                              {language === 'en' 
                                ? '[Awaiting ignition sequence trigger. Absolute privacy sandboxing verified.]' 
                                : '[等待点燃协议触发。Zurich P2P 自理及绝对隔离沙箱已校准。]'}
                            </div>
                          )}
                          {isSummoning && (
                            <span className="inline-block w-1.5 h-3 bg-[#00ffcc] animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Wizard Navigation Footer controls */}
              {!isSummoning && (
                <div className="border-t border-indigo-950/50 pt-5 mt-5 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                    disabled={wizardStep === 1}
                    className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all border border-indigo-950 bg-slate-950/20 text-slate-350 hover:bg-slate-950/40 disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Back' : '上一步'}</span>
                  </button>

                  {/* Progressive Micro Steps Dots */}
                  <div className="hidden sm:flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((it) => (
                      <span 
                        key={it} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          wizardStep === it ? 'bg-indigo-500 w-4' : 'bg-indigo-950'
                        }`}
                      />
                    ))}
                  </div>

                  {wizardStep < 6 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(prev => Math.min(6, prev + 1))}
                      className="flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
                    >
                      <span>{language === 'en' ? 'Continue' : '下一步'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={triggerSummoningSimulation}
                      className="flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-950/50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Quick Ignite' : '点燃召唤'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Column (Dynamic Companion live representation core preview) */}
            <div className="lg:col-span-4 bg-[#0a071d]/60 border border-indigo-950/70 rounded-[30px] p-6 flex flex-col justify-between space-y-6 relative overflow-hidden min-h-[460px]">
              {/* Spinning subtle ambient particle rings in background */}
              <div className="absolute inset-x-0 top-0 h-40 bg-indigo-500/5 pointer-events-none" />

              {/* Live Holographic Avatar View box */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-4">
                
                {/* Micro aura background glow */}
                <div className={`absolute w-36 h-36 rounded-full blur-[45px] opacity-25 pointer-events-none ${
                  visualAura === 'purpleVortex' ? 'bg-violet-600' :
                  visualAura === 'cyanHex' ? 'bg-cyan-500' :
                  visualAura === 'steelVector' ? 'bg-slate-400' :
                  visualAura === 'magentaHeart' ? 'bg-pink-600' : 'bg-amber-500'
                }`} />

                <div className="relative">
                  {/* Outer Orbit loop animation */}
                  <div className={`absolute -inset-4 border border-dashed rounded-full animate-spin duration-15000 opacity-40 ${
                    visualAura === 'purpleVortex' ? 'border-violet-500' :
                    visualAura === 'cyanHex' ? 'border-cyan-400' :
                    visualAura === 'steelVector' ? 'border-slate-500' :
                    visualAura === 'magentaHeart' ? 'border-pink-400' : 'border-amber-400'
                  }`} />

                  {/* Secondary orbit reverse animation */}
                  <div className="absolute -inset-8 border border-dotted border-indigo-500/10 rounded-full animate-spin-reverse duration-20000" />

                  {/* Simulated Visual Orb representing setting choice */}
                  {visualAura === 'purpleVortex' && (
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center relative shadow-[0_0_35px_rgba(139,92,246,0.35)]"
                    >
                      <div className="absolute inset-1.5 border border-dashed border-white/20 rounded-full animate-spin duration-7000" />
                      <div className="w-15 h-15 rounded-full bg-[#05030c] flex items-center justify-center shadow-inner">
                        <span className="text-white text-2xl animate-pulse">🌌</span>
                      </div>
                    </motion.div>
                  )}
                  {visualAura === 'cyanHex' && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      className="w-24 h-24 bg-[#080616] border-2 border-cyan-400 rounded-[28px] flex items-center justify-center relative shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                    >
                      <div className="absolute -inset-1.5 border border-cyan-400/20 rounded-[31px] animate-pulse" />
                      <span className="text-cyan-300 text-2xl font-mono">❄️</span>
                    </motion.div>
                  )}
                  {visualAura === 'steelVector' && (
                    <motion.div 
                      animate={{ scale: [1, 0.96, 1], rotate: [0, 90, 180, 270, 360] }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center relative shadow-[0_0_15px_rgba(148,163,184,0.15)]"
                    >
                      <div className="absolute inset-3 border-r border-b border-slate-800" />
                      <span className="text-slate-250 text-xl font-mono relative z-10 font-bold">⬢</span>
                    </motion.div>
                  )}
                  {visualAura === 'magentaHeart' && (
                    <motion.div 
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 bg-pink-950/60 rounded-full border border-pink-500/50 flex items-center justify-center relative shadow-[0_0_35px_rgba(244,63,94,0.35)]"
                    >
                      <span className="text-rose-400 text-2xl">💖</span>
                    </motion.div>
                  )}
                  {visualAura === 'amberSpark' && (
                    <motion.div 
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 bg-amber-950/50 border border-amber-500/40 rounded-full flex items-center justify-center relative shadow-[0_0_35px_rgba(245,158,11,0.4)]"
                    >
                      <span className="text-amber-400 text-2xl animate-pulse">✨</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white px-2 py-0.5 border border-indigo-950 bg-[#070512] rounded-lg tracking-wider">
                    {companionName || 'Hey'}
                  </h4>
                  <span className="text-[9px] font-mono text-indigo-400 font-black tracking-widest block uppercase">
                    {companionRole}
                  </span>
                </div>
              </div>

              {/* Dynamic specs calibration ledger */}
              <div className="border-t border-indigo-950/80 pt-4.5 font-mono text-[8.5px] text-slate-450 space-y-1 bg-[#060413]/60 p-4 rounded-2xl border border-indigo-950/40">
                <div className="flex justify-between">
                  <span>SYSTEM ARCH:</span>
                  <span className="text-indigo-400">P2P_SOVEREIGN</span>
                </div>
                <div className="flex justify-between">
                  <span>RADAR FREQ:</span>
                  <span className="text-indigo-400">{spatialRadius}px Radius</span>
                </div>
                <div className="flex justify-between">
                  <span>COGNITIVE DEPTH:</span>
                  <span className="text-indigo-400">{analyticalDepth}%</span>
                </div>
                <div className="flex justify-between">
                  <span>MOBI_FRICTION:</span>
                  <span className="text-indigo-400">{rebelRatio}% Friction</span>
                </div>
                <div className="flex justify-between">
                  <span>TELEMETRY OUT:</span>
                  <span className={isolatedMemory ? "text-emerald-400" : "text-amber-400"}>
                    {isolatedMemory ? 'MUTED_BLOCKED' : 'ALLOW'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-indigo-950/60 pt-1.5 mt-1.5">
                  <span>ALIGNMENT MATRIX:</span>
                  <span className="text-indigo-400">SUCCESS(100%)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

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
 
         {/* Dynamic State Bar & Re-customize trigger button */}
         <div className="flex items-center gap-3">
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

          <button
            type="button"
            onClick={() => {
              setIsCreated(false);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white hover:bg-neutral-800 rounded-2xl text-xs font-black hover:shadow-sm transition-all duration-300 cursor-pointer shadow-sm border border-slate-800 min-h-[38px]"
            title={language === 'en' ? 'Re-calibrate Core Character settings' : '置换并重新装配心魂设定模式'}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Re-Design Character' : '置换重塑心格'}</span>
          </button>
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
