/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Trash2, 
  Plus, 
  Settings, 
  Volume2, 
  Grid, 
  Zap, 
  Palette, 
  Maximize, 
  Layers, 
  FileText, 
  Compass, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { translations } from '../locales';

interface ToolNote {
  id: string;
  text: string;
  color: string;
  createdAt: string;
}

interface WorkspaceToolListProps {
  language?: 'en' | 'zh';
}

const localT = {
  en: {
    title: "Sovereign Workspace Toolkit",
    subtitle: "A collection of localized utility widgets, quick scratch memos, design inspectors, and ambient tactile controls.",
    notesTitle: "Sticky Scratch Memos",
    notesDesc: "Sow fleeting ideas, checklists, and pipeline requirements instantly. Persisted locally.",
    addNote: "Pin Scratch Memo",
    notePlaceholder: "Write a swift custom directive or design draft here...",
    paletteTitle: "High-Contrast Swiss Swatches",
    paletteDesc: "Analyze branding colors conforming to Switzerland Modern typography standards.",
    paletteLabel: "Copy Hex",
    telemetryTitle: "Coordinate Telemetry Helper",
    telemetryDesc: "Simulate scaling projection offsets and grid multipliers across custom viewpoints.",
    factor: "Grid Scale Flux Metric",
    simulateBtn: "Compute Multiplied Scaling Vector",
    audioTitle: "Tactile Synthesis Board",
    audioDesc: "Manually test clean sine-wave audio sfx channels generated directly from Web Audio API.",
    copied: "Color Hex copied to clipboard!"
  },
  zh: {
    title: "自主星网智能工具箱 (Workspace Tools)",
    subtitle: "融合了即刻主权便签便签瓦、数字化网格换算器、瑞士极简色卡测试舱和底层音频调试器。",
    notesTitle: "数字即贴轻量便签 (Memos)",
    notesDesc: "记录任何随时可能消散的研究指令、流水线思路和未定清单，支持即时本地化持久存储。",
    addNote: "贴上灵感便签",
    notePlaceholder: "在此输入一条临时的控制指令或架构灵感...",
    paletteTitle: "瑞士设计视觉高对比度色板",
    paletteDesc: "审查匹配 Swiss Minimal UI 的规范色带。一键拷贝其底层 RGB 与十六进制特征数值。",
    paletteLabel: "拷贝 Hex 值",
    telemetryTitle: "网格坐标物理转换器",
    telemetryDesc: "手动输入比例系数，测算多跳网格下的边界离散距离、物理引力约束和缩放基准值。",
    factor: "网格尺度引力乘数",
    simulateBtn: "测算晶格流转偏移物理量",
    audioTitle: "赫斯物理声效合成器",
    audioDesc: "直接通过浏览器底层 Web Audio API 触发并测试纯净的正弦波、正切波、警报和成功和弦音效。",
    copied: "颜色 HASH 已拷贝至系统剪贴板！"
  }
};

const SWISS_PALETTE = [
  { name: "Sovereign Absolute Dark", hex: "#020205", desc: "For Cosmic black canvases" },
  { name: "Swiss Pure White", hex: "#ffffff", desc: "Clean background layouts" },
  { name: "Tactile Amber Beacon", hex: "#f59e0b", desc: "Warp signals & high alert pins" },
  { name: "Deep Royal Indigo", hex: "#4f46e5", desc: "Relations lines & group bounds" },
  { name: "Vapor forest Green", hex: "#10b981", desc: "Milestones complete state" },
  { name: "Fleshy Cosmic Violet", hex: "#8b5cf6", desc: "Autonomous Strategy Daemon" }
];

export default function WorkspaceToolList({ language = 'en' }: WorkspaceToolListProps) {
  const lVal = localT[language];

  // Notes state (local storage backed)
  const [notes, setNotes] = useState<ToolNote[]>(() => {
    const cached = localStorage.getItem('heya_workspace_notes');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) { return []; }
    }
    return [
      {
        id: 'initial-note-1',
        text: language === 'en' 
          ? '✏️ Target: Deliver a full high-fidelity seed reset of interlocking nodes into local memory for seed presentations.' 
          : '✏️ 任务规划：准备一键赫斯高精度星态物理还原，以便一键展示给评委。',
        color: '#fef08a',
        createdAt: '10:45 AM'
      },
      {
        id: 'initial-note-2',
        text: language === 'en'
          ? '⚙️ Reminder: Check if index.css fully overrides Inter as primary headings and JetBrains Mono for telemetry tags.'
          : '⚙️ 瑞士严谨提醒：覆盖 index.css 中的中英文字体样式，强制 telemetry 数值使用等宽字体。',
        color: '#fecdd3',
        createdAt: '11:15 AM'
      }
    ];
  });

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('heya_workspace_notes', JSON.stringify(notes));
  }, [notes]);

  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fef08a'); // yellow sticky

  // Telemetry physics state
  const [xVal, setXVal] = useState(400);
  const [yVal, setYVal] = useState(300);
  const [multiplier, setMultiplier] = useState(1.25);
  const [computedResult, setComputedResult] = useState<string | null>(null);

  const colors = [
    { bg: 'bg-yellow-100 border-yellow-250', value: '#fef08a' },
    { bg: 'bg-rose-100 border-rose-250', value: '#fecdd3' },
    { bg: 'bg-emerald-100 border-emerald-250', value: '#bdf5d0' },
    { bg: 'bg-sky-100 border-sky-250', value: '#bae6fd' },
    { bg: 'bg-purple-100 border-purple-250', value: '#e9d5ff' }
  ];

  // Add memo
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    (window as any).playTactileChime?.('click');

    const fresh: ToolNote = {
      id: `toolnote-${Date.now()}`,
      text: newNoteText.trim(),
      color: selectedColor,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotes(prev => [fresh, ...prev]);
    setNewNoteText('');

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Sticky memo pinned to workspace board.' : '灵感便签贴纸成功，持久存储已写入数据库。', 
        type: 'success' 
      }
    }));
  };

  // Delete memo
  const handleDeleteNote = (id: string) => {
    (window as any).playTactileChime?.('alert');
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Run multiplier calculation
  const handleSimulatePhysics = (e: React.FormEvent) => {
    e.preventDefault();
    (window as any).playTactileChime?.('click');

    const calculatedRadius = Math.sqrt(xVal * xVal + yVal * yVal) * multiplier;
    const offsetTranslationX = Math.round(xVal * multiplier * Math.sin(0.4));
    const offsetTranslationY = Math.round(yVal * multiplier * Math.cos(0.4));

    const outMessage = language === 'en'
      ? `✅ Spatial Gravity vector: Distance R: ${calculatedRadius.toFixed(2)}px. Under scaling modifier, target offsets computed as (dx: ${offsetTranslationX}px, dy: ${offsetTranslationY}px). Bounds synced.`
      : `✅ 重力自抗扰测算完成！相对距 R: ${calculatedRadius.toFixed(2)}px。物理阻抗拟合投影坐标拟定为 (X: ${offsetTranslationX}px, Y: ${offsetTranslationY}px)。边缘完全越过。`;

    setComputedResult(outMessage);
  };

  // Play audio synthesize chime manually from control board
  const playCustomSynthesizedTone = (type: 'bell' | 'siren' | 'success' | 'alert') => {
    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime(type === 'alert' ? 'alert' : type === 'success' ? 'success' : 'click');
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: language === 'en' 
            ? `Tested Synthesizer output frequency track: [${type} melody]` 
            : `测试底层物理声卡：频率追踪 [${type}] 信宿已成功共振。`, 
          type: 'info' 
        }
      }));
    } else {
      // Falback context audio
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const freq = type === 'alert' ? 180 : type === 'success' ? 523.25 : 440;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch(ex) {}
    }
  };

  // Copy Swatch Hex helper
  const copyColorSwatchHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    (window as any).playTactileChime?.('success');
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { message: `${lVal.copied} (${hex})`, type: 'success' }
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] p-10 space-y-8 animate-in fade-in-20 duration-300">
      
      {/* 1. Header Layout */}
      <div className="pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-200">
            <ClipboardList className="w-5 h-5 text-orange-500 fill-orange-200/30" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
              {lVal.title}
            </h2>
            <p className="text-[11.5px] text-slate-500 font-bold mt-0.5 max-w-xl leading-relaxed">
              {lVal.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT 7 COLS: STICKY MEMOS & AUDIO SYNTHETIC PADS ================= */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* A. Sticky notes module */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6.5 space-y-5 shadow-sm">
            
            <div>
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>{lVal.notesTitle}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-0.5">
                {lVal.notesDesc}
              </p>
            </div>

            {/* Input Form sticky */}
            <form onSubmit={handleAddNote} className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-150">
              <textarea
                placeholder={lVal.notePlaceholder}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                required
                rows={2}
                className="w-full text-xs font-semibold bg-white border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-400 rounded-xl px-3 py-2.5 leading-relaxed"
              />

              <div className="flex items-center justify-between">
                {/* Choose color bubble */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                    Swatch:
                  </span>
                  <div className="flex gap-1.5">
                    {colors.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-5.5 h-5.5 rounded-full border-2 cursor-pointer transition-all ${c.bg} ${
                          selectedColor === c.value ? 'ring-2 ring-slate-800 scale-110' : 'opacity-85 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-extrabold text-[10.5px] rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-400" />
                  <span>{lVal.addNote}</span>
                </button>
              </div>
            </form>

            {/* Note post pads rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.length === 0 ? (
                <div className="col-span-2 text-center py-8 border border-dashed border-slate-200 rounded-xl select-none">
                  <HelpCircle className="w-7 h-7 text-slate-300 mx-auto" />
                  <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wide">
                    {language === 'en' ? 'Board Empty. Pin a memo.' : '写点便签吧，这里空无一物。'}
                  </p>
                </div>
              ) : (
                notes.map((note) => (
                  <div 
                    key={note.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({ isNoteDrag: true, text: note.text }));
                      e.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="p-4 rounded-2xl border-2 shadow-sm transition-all flex flex-col justify-between hover:scale-[1.015] duration-200 relative group cursor-grab active:cursor-grabbing"
                    style={{ 
                      backgroundColor: note.color, 
                      borderColor: note.color === '#fef08a' ? '#fef08a' : note.color 
                    }}
                  >
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-slate-600 hover:text-red-600 opacity-20 group-hover:opacity-100 transition-all duration-200"
                      title="Unpin memo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-xs font-bold font-sans text-slate-800 mr-4 leading-relaxed whitespace-pre-wrap">
                      {note.text}
                    </p>

                    <div className="border-t border-black/5 mt-3 pt-2 text-[8.5px] font-mono text-slate-500 font-black flex justify-between items-center select-none">
                      <span>STATIONARY DIRECTIVE</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* B. Synthesizer sound board */}
          <div className="bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-orange-600/10 blur-2xl rounded-full pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div>
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>{lVal.audioTitle}</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed mt-0.5">
                  {lVal.audioDesc}
                </p>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: "Click Tone", type: "click", label: "C5 note" },
                  { name: "System success", type: "success", label: "C-Major arpeggio" },
                  { name: "Alert Signal", type: "alert", label: "Deep warning" },
                  { name: "Siren Warning", type: "siren", label: "High frequency" }
                ].map((aud, index) => (
                  <button
                    key={index}
                    onClick={() => playCustomSynthesizedTone(aud.type as any)}
                    className="p-3 bg-[#111221] hover:bg-[#181932] border border-slate-850 hover:border-slate-800 text-slate-300 rounded-xl transition-all duration-200 text-center flex flex-col justify-center items-center gap-1 select-none active:scale-95 group focus:outline-none"
                  >
                    <Volume2 className="w-4 h-4 text-orange-400 opacity-60 group-hover:opacity-100" />
                    <span className="text-[10px] font-black">{aud.name}</span>
                    <span className="text-[8px] font-mono text-slate-550">{aud.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT 5 COLS: COORDINATE MULTIPLIERS & PALETTE ================= */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* C. Coordinate telemeters physics solver */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6.5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{lVal.telemetryTitle}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-0.5">
                {lVal.telemetryDesc}
              </p>
            </div>

            <form onSubmit={handleSimulatePhysics} className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest font-mono">X Reference coordinate (px)</span>
                  <input
                    type="number"
                    value={xVal}
                    onChange={(e) => setXVal(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest font-mono">Y Reference coordinate (px)</span>
                  <input
                    type="number"
                    value={yVal}
                    onChange={(e) => setYVal(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono block">
                  {lVal.factor} ({multiplier}x)
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.25}
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-neutral-800 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow"
              >
                {lVal.simulateBtn}
              </button>
            </form>

            {computedResult && (
              <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-[10px] font-semibold text-slate-700 leading-relaxed font-mono">
                {computedResult}
              </div>
            )}
          </div>

          {/* D. Brand Palettes designer workspace */}
          <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6.5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-orange-500" />
                <span>{lVal.paletteTitle}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-0.5">
                {lVal.paletteDesc}
              </p>
            </div>

            <div className="space-y-2 pr-1">
              {SWISS_PALETTE.map((color, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-8 h-8 rounded-lg shrink-0 border border-slate-200 shadow-inner" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">
                        {color.name}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-450 block font-mono">
                        {color.desc}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyColorSwatchHex(color.hex)}
                    className="px-2.5 py-1 text-[8px] font-black font-mono tracking-wider uppercase bg-slate-100 text-slate-650 hover:bg-black hover:text-white rounded-lg transition-colors cursor-pointer select-none"
                    title={lVal.paletteLabel}
                  >
                    {color.hex}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
