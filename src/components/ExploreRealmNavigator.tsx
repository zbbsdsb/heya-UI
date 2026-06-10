/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Map, 
  Sparkles, 
  Cpu, 
  Radar, 
  Grid, 
  ArrowUpRight, 
  Activity, 
  Zap, 
  Radio, 
  Globe, 
  Milestone, 
  FolderGit2, 
  BookOpen, 
  Plus, 
  RotateCw,
  Eye
} from 'lucide-react';
import { NodeData, NodeType } from '../types';

interface ExploreRealmNavigatorProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  language?: 'en' | 'zh';
  onWarpToCoordinates: (x: number, y: number, label: string) => void;
}

const localT = {
  en: {
    title: "Public Topological Realms Explorer",
    desc: "Scan and teleport between public coordinate sectors in the infinite Field Map. Discover rogue spatial signals, quantum nodes, or configure precise workspace entry anchors.",
    scanCardTitle: "Quantum Telemetry & Sector Probe",
    scanCardDesc: "Deploy a high-frequency probe to scan deep, unmapped coordinates. Harness localized gravity anomalies or seed modular nodes on a random field.",
    probeBtn: "Probe Cosmic Frequencies",
    scanning: "Sweeping frequencies over micro-ranges...",
    probeSuccess: "Rogue Beacon detected at dynamic coordinates!",
    warpToTarget: "Engage Warp Drive to Coordinate",
    seedHere: "Materialize Matrix Node",
    classicRealms: "Established Sovereign Domains Matrix",
    classicDesc: "Sovereign coordination grids governing standard decentralized operations and test foundations.",
    lat: "Ping Latency",
    sectorCoords: "Sector Coordinate Bounds",
    activeNodes: "Intersecting Elements count",
    warpAction: "Engage Warp Engine",
    probePlaceholder: "Awaiting probe deployment...",
    randomNodeCreated: "Rogue system node successfully seeded at coordinate!",
    randomNodeTitle: "Seeded Quantum Node",
    seedLabel: "Registered via Quantum Shift",
    toastWarp: "Warp coordinates locked. Engaging fold engine drive...",
    unmappedSpace: "Scanned Quantum Sector",
    coordinateRuler: "Blueprint Offset Alignment",
    warpEngaged: "Warp drive coordinates synchronized."
  },
  zh: {
    title: "公开空间拓扑域浏览器",
    desc: "探查并瞬间移动至无限 Field Map 星图中的公有坐标域。捕获未标定的深空噪声、注册星态组件或一键缩放对焦至活跃物理扇区。",
    scanCardTitle: "空间量子雷达与异磁探针",
    scanCardDesc: "发出一束高频扫描探针穿透赫斯底层网格。捕获空旷坐标中的逻辑噪点特征，或将随机类型的实体节点即刻下沉着陆在此域中。",
    probeBtn: "激发量子探针探求信号",
    scanning: "正在过滤底噪声并执行哈希空间映射...",
    probeSuccess: "在自适应边界坐标系内锁定活跃未定节点特征！",
    warpToTarget: "物理折叠此空间（前往该域）",
    seedHere: "在此坐标熔铸全新的物料节点",
    classicRealms: "已登记公开经典拓扑域数据阵列",
    classicDesc: "公开可互动的固定拓扑象限，承载网络协议握手包、核心流水线、逻辑网关规则以及历史测算。 ",
    lat: "网络穿透延迟",
    sectorCoords: "域物理边界象限",
    activeNodes: "覆核元素密度",
    warpAction: "激发跃迁引擎",
    probePlaceholder: "无线探针正处于惰性待命状态...",
    randomNodeCreated: "新维度算子节点已自适应播种并在 Field Map 指法对流！",
    randomNodeTitle: "量子纠缠特征组件",
    seedLabel: "来自探针跃迁播撒",
    toastWarp: "跃迁坐标已锁定，正在折叠多维星图...",
    unmappedSpace: "探测到的异质逻辑象限",
    coordinateRuler: "星迹偏移坐标配给",
    warpEngaged: "跃迁通道搭建完毕，主控台视角锁定。"
  }
};

const CLASSIC_DOMAINS = [
  {
    id: "zurich",
    name_en: "Zurich Core Handshake",
    name_zh: "苏黎世去中心握手基准",
    desc_en: "Zero-latency WebRTC coordinate zone optimized for Gossip signaling handshake logs.",
    desc_zh: "零中继 WebRTC 协作基座，汇聚 Gossip 协议握手、路由自恢复及网络链路监察测试。",
    x: 580,
    y: 220,
    latency: "4ms",
    type: "protocol",
    connectedTags: ["WebRTC", "P2P", "Gossip"],
    borderHue: "border-indigo-200 hover:border-indigo-400 bg-indigo-50/20"
  },
  {
    id: "oasis",
    name_en: "Oasis Pipeline Pipeline",
    name_zh: "绿洲数据流处理核心",
    desc_en: "The structural execution pipelines matrix driving decentralized workflow state transformations.",
    desc_zh: "流水线多分支数据对流。承载动态微内核拓扑连通、阶段里程碑以及完整进度调试。",
    x: 480,
    y: 480,
    latency: "12ms",
    type: "pipeline",
    connectedTags: ["Workflow", "Pipeline", "Docker"],
    borderHue: "border-emerald-250 hover:border-emerald-450 bg-emerald-50/10"
  },
  {
    id: "registry",
    name_en: "Hearth Topology Registry Hub",
    name_zh: "赫斯拉维斯逻辑组件中枢",
    desc_en: "Core component locator matrix mapping logical, self-contained sub-modules registry.",
    desc_zh: "逻辑注册与特征算符映射。汇聚了经过 SHA-256 复合签名的自洽静态与动态网关单元。",
    x: 720,
    y: 470,
    latency: "8ms",
    type: "registry",
    connectedTags: ["Registry", "Components", "Logic"],
    borderHue: "border-amber-200 hover:border-amber-400 bg-amber-50/20"
  },
  {
    id: "geneva",
    name_en: "Geneva Autonomous Consensus Sphere",
    name_zh: "日内瓦多智能体共识自治星域",
    desc_en: "Uncharted space targeted for deep cryptographic mesh networking algorithms.",
    desc_zh: "纯洁共识空间。适用于在偏远逻辑对角中验证零知识证明（ZKP）以及多跳网格自理中继。",
    x: 180,
    y: 280,
    latency: "19ms",
    type: "consensus",
    connectedTags: ["Mesh-Net", "ZKP", "Swiss-UX"],
    borderHue: "border-purple-200 hover:border-purple-400 bg-purple-50/10"
  },
  {
    id: "retro-archive",
    name_en: "Tokyo Cybernetic Archive Zone",
    name_zh: "东京智能体自适应数据域",
    desc_en: "High-density feedback diagnostics zone running continuous autonomous companion companion logic.",
    desc_zh: "高密度语义与代理网络反馈域。部署主权 AGI 同伴分析，过滤并提炼异变噪声。",
    x: 760,
    y: 180,
    latency: "15ms",
    type: "agent",
    connectedTags: ["Agent", "AI-Insight", "Bento"],
    borderHue: "border-pink-200 hover:border-pink-400 bg-pink-50/20"
  },
  {
    id: "nebula-fluid",
    name_en: "Deep-Space Gravitational Core",
    name_zh: "深空重力流极端物理域",
    desc_en: "High margin perimeter quadrant utilizing organic Bezier spline bounds computing.",
    desc_zh: "高偏角物理边缘象限。验证极值贝塞尔曲线边界扩张、重物逻辑牵引和不规则多边形容器。",
    x: 900,
    y: 700,
    latency: "31ms",
    type: "gravity",
    connectedTags: ["Physics", "Spline-Hull", "Fluid"],
    borderHue: "border-teal-200 hover:border-teal-400 bg-teal-50/10"
  }
];

export default function ExploreRealmNavigator({
  nodes,
  setNodes,
  language = 'en',
  onWarpToCoordinates
}: ExploreRealmNavigatorProps) {
  const lVal = localT[language];

  // Quantum Radar Probe states
  const [isScanning, setIsScanning] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    x: number;
    y: number;
    name: string;
    signalStrength: number;
    anomalyType: string;
    nodeTypeSeed: NodeType;
  } | null>(null);

  // Trigger quantum frequency probe scanning effect
  const handleTriggerProbe = () => {
    (window as any).playTactileChime?.('click');
    setIsScanning(true);
    setProbeResult(null);

    setTimeout(() => {
      // Create random coordinate boundaries in typical active canvas space: X (120-950), Y (100-750)
      const randomX = Math.round(150 + Math.random() * 750);
      const randomY = Math.round(120 + Math.random() * 550);
      
      const names_en = [
        "Aether Core Terminal", "Vortex Signalling Ledger", "Superconducting Handshake Gate", 
        "Hyperbolic Gravitational Pivot", "Sub-Kelvin Memory Vault", "Zero-Knowledge Ingress Stream",
        "Plausibility Loop Anchor", "Crystalline Buffer Zone", "Gossip-Symmetric Relay"
      ];
      const names_zh = [
        "以太逆涡核端座", "量子协议自洽校验闸", "超导极温逻辑缓冲区", 
        "双曲引力拓扑牵制网", "绝热低温寻址寄存箱", "零知识信令路由阀",
        "可信共识节点断层点", "固态记忆矩阵存储腔", "对称 Gossip 高传中继站"
      ];

      const chosenName = language === 'en' 
        ? names_en[Math.floor(Math.random() * names_en.length)] 
        : names_zh[Math.floor(Math.random() * names_zh.length)];

      const anomalies = ["Gravitational Spline Knot", "Rogue P2P Handshake", "Quantum State Drift", "Aesthetic Coherence"];
      const types: NodeType[] = ["project", "todo", "agent", "muse", "resource"];

      setProbeResult({
        x: randomX,
        y: randomY,
        name: `${chosenName} #${Math.floor(100 + Math.random() * 900)}`,
        signalStrength: Math.round(65 + Math.random() * 32),
        anomalyType: anomalies[Math.floor(Math.random() * anomalies.length)],
        nodeTypeSeed: types[Math.floor(Math.random() * types.length)]
      });

      setIsScanning(false);
      (window as any).playTactileChime?.('success');

      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { message: lVal.probeSuccess, type: 'info' }
      }));
    }, 1500);
  };

  // Warp directly to coordinate on click
  const executeWarpDrive = (x: number, y: number, label: string) => {
    (window as any).playTactileChime?.('success');

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: `${lVal.toastWarp} X:${x}, Y:${y}`, 
        type: 'success' 
      }
    }));

    onWarpToCoordinates(x, y, label);
  };

  // Seed node on random coordinate
  const seedNodeAtCoordinates = () => {
    if (!probeResult) return;
    (window as any).playTactileChime?.('success');

    const freshNode: NodeData = {
      id: `probe-node-${Date.now()}`,
      type: probeResult.nodeTypeSeed,
      title: probeResult.name,
      description: language === 'en' 
        ? `Sovereign component registered at probed spatial coordinate. Sync anomaly: [${probeResult.anomalyType}].`
        : `探测注册实体。在此坐标（X:${probeResult.x}, Y:${probeResult.y}）处捕获异性磁异常场，特注为此级节点。`,
      x: probeResult.x,
      y: probeResult.y,
      progress: Math.round(10 + Math.random() * 40),
      members: ['System-Probe'],
      checklist: [],
      tags: [probeResult.anomalyType.replace(/ /g, '-'), 'Quantum-Seed'],
      connections: [],
      createdAt: '2026/06/10',
      updatedAt: '2026/06/10',
      status: 'active',
      syncStatus: 'synced',
      authorId: 'probe-bot',
      version: 1,
      star: true,
    };

    setNodes(prev => [...prev, freshNode]);

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { message: lVal.randomNodeCreated, type: 'success' }
    }));

    // Instantly warp to center it and show
    executeWarpDrive(probeResult.x, probeResult.y, probeResult.name);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] p-10 space-y-8 animate-in fade-in-20 duration-300">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-200">
              <Compass className="w-5 h-5 text-indigo-500 fill-indigo-200/30" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
                {lVal.title}
              </h2>
              <p className="text-[11.5px] text-slate-500 font-bold mt-0.5 max-w-xl leading-relaxed">
                {lVal.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Global summary count */}
        <div className="px-4 py-2 border rounded-xl bg-white flex items-center gap-3 font-mono text-[10px] font-bold text-slate-600">
          <Globe className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '10s' }} />
          <span>REALMS KNOWN: 6 CLASSIC / {nodes.length} COORDINATE ANCHORS</span>
        </div>
      </div>

      {/* Grid of panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT 5 COLS: RADAR TERMINAL SCANNER ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="space-y-5 relative z-10">
              <div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Radar className={`w-4 h-4 text-indigo-400 ${isScanning ? 'animate-spin' : 'animate-pulse'}`} />
                  <span>{lVal.scanCardTitle}</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 max-w-sm leading-relaxed">
                  {lVal.scanCardDesc}
                </p>
              </div>

              {/* Holographic Radar Circular Scanner HUD */}
              <div className="w-full h-[260px] bg-[#020205] border border-indigo-950/80 rounded-2xl relative overflow-hidden flex items-center justify-center">
                {/* Micro particle grid */}
                <div className="absolute inset-0 select-none pointer-events-none opacity-[0.06]" style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '15px 15px'
                }} />

                {/* Radar target rings */}
                <div className="absolute w-[200px] h-[200px] rounded-full border border-indigo-500/10 flex items-center justify-center">
                  <div className="w-[140px] h-[140px] rounded-full border border-indigo-500/15 flex items-center justify-center">
                    <div className="w-[80px] h-[80px] rounded-full border border-indigo-500/20 flex items-center justify-center">
                      <div className="w-[20px] h-[20px] rounded-full border border-indigo-500/25 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal Coordinate Sweep Line */}
                <div className={`absolute top-0 bottom-0 left-0 right-0 border-t border-indigo-500/30 w-full pointer-events-none origin-center ${
                  isScanning ? 'animate-pulse' : ''
                }`} style={{
                  transform: isScanning ? 'translateY(130px)' : 'translateY(0)',
                  transition: isScanning ? 'transform 1.5s ease-in-out infinite' : 'none'
                }} />

                {/* Probe result dot pin flashing inside radar */}
                {probeResult && !isScanning && (
                  <div 
                    className="absolute z-20 group cursor-pointer"
                    style={{
                      left: '42%',
                      top: '38%'
                    }}
                  >
                    <span className="relative flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 ring-4 ring-amber-500/20 animate-bounce">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-950 absolute" />
                    </span>
                    <span className="pointer-events-none absolute left-6 top-1/2 transform -translate-y-1/2 bg-slate-900 border border-slate-700 text-[8.5px] font-mono font-black text-amber-300 rounded px-1.5 py-0.5 whitespace-nowrap">
                      SIGNAL LOCKED ({probeResult.x}, {probeResult.y})
                    </span>
                  </div>
                )}

                {/* Standard idle indicator */}
                {!probeResult && !isScanning && (
                  <div className="text-center space-y-2 p-4 relative z-10 select-none">
                    <Radio className="w-8 h-8 text-slate-800 mx-auto animate-pulse" />
                    <p className="text-[10px] font-mono font-extrabold text-[#6366f1]/50 uppercase tracking-widest">
                      {lVal.probePlaceholder}
                    </p>
                  </div>
                )}

                {/* Loading bar for scanning */}
                {isScanning && (
                  <div className="text-center space-y-3 p-4">
                    <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-indigo-950 animate-spin mx-auto" />
                    <p className="text-[9.5px] font-mono text-slate-400 font-bold tracking-wider animate-pulse">
                      {lVal.scanning}
                    </p>
                  </div>
                )}
              </div>

              {/* Probe results dashboard view */}
              {probeResult && !isScanning && (
                <div className="p-4 bg-[#121320] border border-slate-900 rounded-xl space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center border-b border-indigo-950/40 pb-2">
                    <span className="text-[9px] font-mono text-indigo-400 font-black uppercase tracking-widest">
                      📡 {lVal.unmappedSpace}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[9px] font-bold rounded">
                      STRENGTH: {probeResult.signalStrength}%
                    </span>
                  </div>

                  {/* Matrix details */}
                  <div className="grid grid-cols-2 gap-3 pb-1">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Procedural Identity</span>
                      <p className="text-xs font-mono font-extrabold text-slate-200 truncate">{probeResult.name}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">{lVal.coordinateRuler}</span>
                      <p className="text-xs font-mono font-extrabold text-indigo-300">X: {probeResult.x}px | Y: {probeResult.y}px</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Local Flux Signature</span>
                      <p className="text-xs font-mono font-bold text-slate-300">{probeResult.anomalyType}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Recommended Node Blueprint</span>
                      <p className="text-xs font-mono font-bold text-slate-300">{probeResult.nodeTypeSeed.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Integrated buttons with true functional mappings */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-950/40">
                    <button
                      onClick={() => executeWarpDrive(probeResult.x, probeResult.y, probeResult.name)}
                      className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>WARP DRIVE</span>
                    </button>
                    <button
                      onClick={seedNodeAtCoordinates}
                      className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-200 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-500" />
                      <span>SEED NODE</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Deploy scanning trigger */}
              <button
                onClick={handleTriggerProbe}
                disabled={isScanning}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{lVal.probeBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT 7 COLS: SHOCKWAVE DOMAINS REGISTRY ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section banner description */}
          <div className="p-5 bg-indigo-50/20 border border-indigo-100 rounded-2xl">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Milestone className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>{lVal.classicRealms}</span>
            </h4>
            <p className="text-[10.5px] text-slate-500 font-bold mt-1 leading-relaxed">
              {lVal.classicDesc}
            </p>
          </div>

          {/* Classic Domains List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CLASSIC_DOMAINS.map((domain) => {
              // Calculate elements count currently residing near these coordinates
              const nodesNear = nodes.filter(n => {
                const distance = Math.sqrt(Math.pow(n.x - domain.x, 2) + Math.pow(n.y - domain.y, 2));
                return distance < 180; // approximate sector region radius
              });

              const dName = language === 'en' ? domain.name_en : domain.name_zh;
              const dDesc = language === 'en' ? domain.desc_en : domain.desc_zh;

              return (
                <div 
                  key={domain.id} 
                  className={`border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${domain.borderHue}`}
                >
                  <div className="space-y-2.5">
                    
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-mono text-[8.5px] font-black uppercase">
                        {domain.type}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 font-bold">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        <span>{domain.latency}</span>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div>
                      <h4 className="text-xs font-black text-[#0f172a] leading-tight">
                        {dName}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 font-mono">
                        X: {domain.x}px | Y: {domain.y}px
                      </p>
                    </div>

                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed line-clamp-2">
                      {dDesc}
                    </p>

                    {/* Connected tags */}
                    <div className="flex flex-wrap gap-1">
                      {domain.connectedTags.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-white border text-indigo-600 font-black text-[8px] rounded tracking-tight">
                          #{t}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Footing actions */}
                  <div className="border-t pt-4 mt-4 flex items-center justify-between">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase font-mono">
                      {lVal.activeNodes}: <strong className="text-slate-600 font-extrabold">{nodesNear.length}</strong>
                    </span>

                    <button
                      onClick={() => executeWarpDrive(domain.x, domain.y, dName)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-[9.5px] font-extrabold uppercase rounded-lg shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      title={lVal.warpAction}
                    >
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>{language === 'en' ? 'WARP' : '空间跃迁'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
