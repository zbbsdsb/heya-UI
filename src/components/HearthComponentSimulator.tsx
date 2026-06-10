import React from 'react';
import { 
  Target, 
  Trash2, 
  Clock, 
  CheckSquare, 
  SlidersHorizontal, 
  Shield, 
  Terminal, 
  Activity, 
  Compass, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { NodeData } from '../types';

interface HearthComponentSimulatorProps {
  selectedNode: NodeData;
  language: 'en' | 'zh';
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  
  // Hash parameters
  computingHash: boolean;
  computedHashCode: string | null;
  calculateShaRegistry: () => void;

  // Agent parameters
  agentLogs: string[];
  horizonProtocol: string;
  setHorizonProtocol: React.Dispatch<React.SetStateAction<string>>;
  handleAgentScan: () => void;

  // Muse parameters
  divergenceVal: number;
  setDivergenceVal: React.Dispatch<React.SetStateAction<number>>;
  musePromptText: string;
  setMusePromptText: React.Dispatch<React.SetStateAction<string>>;
  handleLocalMuseCast: (e: React.FormEvent) => void;

  // MileStone parameters
  newMilestoneText: string;
  setNewMilestoneText: React.Dispatch<React.SetStateAction<string>>;
  handleAddMilestone: (e: React.FormEvent) => void;
  toggleMilestoneComplete: (id: string) => void;
  deleteMilestone: (id: string) => void;

  // Slider change
  handleProgressSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Field change
  handleUpdateNodeStringField: (field: 'title' | 'description' | 'status' | 'logicalOperator', val: any) => void;
}

const t = {
  en: {
    widgetTitle: "Operational-Component Simulator Frame",
    widgetDesc: "Interact with the real, live-simulated functional applet corresponding to your node status.",
    nodeType: "Node Class",
    milestones: "Milestone Execution Checks",
    addMilestone: "Add Milestone",
    milestonePlaceholder: "e.g., Deliver WebRTC handshake module proof",
    progressSlider: "Pipeline Execution Completeness",
    divergenceCoef: "Cognitive Rebellion Factor",
    quickPrompt: "Sandbox Fleeting Draft Prompt",
    castSpark: "Spawn Idea Spark",
    hashBtn: "Compute Security Fingerprint",
    hashProgress: "Computing SHA-256 Registry Hash...",
    hashActive: "SHA-256 Secure Fingerprint",
    agentLogs: "Agent Cognitive Log Shell",
    agentRun: "Trigger Memory Scan Probe",
    tags: "Component Tags"
  },
  zh: {
    widgetTitle: "核心组件真实运转模拟舱 (Simulator)",
    widgetDesc: "交互模拟运行该级节点相对应的真实功能。每一次点击和进度调整均将实时更新拓扑网。",
    nodeType: "拓扑节点类目",
    milestones: "节点周期里程碑校验清单",
    addMilestone: "新增里程碑",
    milestonePlaceholder: "例如：交付 WebRTC 握手广播模块原型",
    progressSlider: "流水线执行深度 (手动微调进度分值)",
    divergenceCoef: "反常识发散偏差指数 (叛逆度系数)",
    quickPrompt: "灵感沙盒内容即刻编写",
    castSpark: "向思想池播撒灵感碎屑",
    hashBtn: "计算物理防篡改哈希指纹码",
    hashProgress: "正在校验本地物料生成 SHA-256 注册特征值...",
    hashActive: "SHA-256 复合安全验证签名",
    agentLogs: "AGI 主权代理思考决策日志沙漏",
    agentRun: "探询代理空间特征语义区",
    tags: "组件特性标签"
  }
};

export default function HearthComponentSimulator({
  selectedNode,
  language,
  setNodes,
  computingHash,
  computedHashCode,
  calculateShaRegistry,
  agentLogs,
  horizonProtocol,
  setHorizonProtocol,
  handleAgentScan,
  divergenceVal,
  setDivergenceVal,
  musePromptText,
  setMusePromptText,
  handleLocalMuseCast,
  newMilestoneText,
  setNewMilestoneText,
  handleAddMilestone,
  toggleMilestoneComplete,
  deleteMilestone,
  handleProgressSliderChange,
  handleUpdateNodeStringField
}: HearthComponentSimulatorProps) {
  const lVal = t[language];

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden h-full flex flex-col justify-between">
      
      {/* Telemetry Indicator ribbons */}
      <div className="absolute top-0 left-8 transform -translate-y-1/2 flex items-center gap-2 z-10">
        <span className="px-3.5 py-1 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-md shadow-sm">
          {lVal.widgetTitle}
        </span>
        
        <span className="px-3.5 py-1 text-[9px] font-black font-mono uppercase tracking-widest bg-amber-500 text-white rounded-md shadow-sm">
          A-ID: {selectedNode.id.slice(-6).toUpperCase()}
        </span>
      </div>

      <div className="space-y-5 pt-3 flex-1">
        {/* Node standard structural fields editor panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Component Active Host Label</span>
            <input 
              type="text" 
              value={selectedNode.title}
              onChange={(e) => handleUpdateNodeStringField('title', e.target.value)}
              className="w-full text-xs font-black text-[#0f172a] px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-indigo-505 focus:outline-none rounded-xl"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Runtime Status</span>
            <select
              value={selectedNode.status || 'active'}
              onChange={(e) => handleUpdateNodeStringField('status', e.target.value)}
              className="w-full text-[10.5px] font-bold px-2 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="draft">📁 Draft</option>
              <option value="active">🟢 Active</option>
              <option value="completed">🏆 Finished</option>
              <option value="archived">📦 Archived</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Logical Ingress Gate</span>
            <select
              value={selectedNode.logicalOperator || 'AND'}
              onChange={(e) => handleUpdateNodeStringField('logicalOperator', e.target.value)}
              className="w-full text-[10.5px] font-bold px-2 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="AND">AND GATE</option>
              <option value="OR">OR GATE</option>
              <option value="NOT">NOT GATE</option>
              <option value="XOR">XOR GATE</option>
              <option value="INPUT">RAW SEED</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Functional Capabilities Descriptor</span>
          <textarea 
            rows={2}
            value={selectedNode.description}
            onChange={(e) => handleUpdateNodeStringField('description', e.target.value)}
            className="w-full text-xs font-medium leading-relaxed px-3.5 py-2 bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-indigo-505 focus:outline-none rounded-xl"
          />
        </div>

        {/* ================= TYPE-SPECIFIC ACTIVE LIVE APPLET SIMULATORS ================= */}
        
        {/* CASE A: project typology */}
        {selectedNode.type === 'project' && (
          <div className="p-5 bg-slate-50/75 border border-slate-200/60 rounded-2xl space-y-4 animate-in fade-in duration-305">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <h5 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5 font-mono">
                <Target className="w-4 h-4 text-indigo-500 fill-indigo-500/20 animate-pulse" />
                <span>{lVal.milestones}</span>
              </h5>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Module Complete: {selectedNode.progress}%
              </span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {selectedNode.checklist.length === 0 ? (
                <p className="text-[10px] text-slate-400 font-bold py-4 text-center border border-dashed rounded-xl">
                  Zero milestones assigned. Fill below to spawn downstreams.
                </p>
              ) : (
                selectedNode.checklist.map((item) => (
                  <div key={item.id} className="p-2 bg-white border rounded-lg flex items-center justify-between shadow-sm">
                    <button
                      onClick={() => toggleMilestoneComplete(item.id)}
                      className="flex items-center gap-2 text-left text-xs font-bold text-slate-700 select-none cursor-pointer"
                    >
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                        item.done 
                          ? 'bg-indigo-600 border-indigo-700 text-white' 
                          : 'border-slate-300 hover:border-indigo-500'
                      }`}>
                        {item.done && <span className="text-[8px] font-black">✓</span>}
                      </span>
                      <span className={item.done ? 'line-through text-slate-400 text-[11px]' : 'text-[11px]'}>
                        {item.text}
                      </span>
                    </button>

                    <button 
                      onClick={() => deleteMilestone(item.id)}
                      className="p-1 hover:bg-rose-50 text-slate-350 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddMilestone} className="flex gap-2">
              <input 
                type="text" 
                placeholder={lVal.milestonePlaceholder}
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                required
                className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
              <button 
                type="submit"
                className="px-4.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] rounded-xl flex items-center gap-1 shadow"
              >
                <span>{lVal.addMilestone}</span>
              </button>
            </form>
          </div>
        )}

        {/* CASE B: todo typology */}
        {selectedNode.type === 'todo' && (
          <div className="p-5 bg-emerald-50/15 border border-emerald-100 rounded-2xl space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h5 className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5 font-mono">
                <Clock className="w-4 h-4 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{lVal.progressSlider}</span>
              </h5>
              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100/40 px-2 py-0.5 rounded">
                {selectedNode.progress}% Done
              </span>
            </div>

            <div className="space-y-2 py-1">
              <input 
                type="range" 
                min={0} 
                max={100} 
                value={selectedNode.progress} 
                onChange={handleProgressSliderChange}
                className="w-full h-2 bg-emerald-100/50 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-400 font-mono tracking-tight">
                <span>0% SEED</span>
                <span>50% INGRESS PIPELINE</span>
                <span>100% AUDITED MASTER</span>
              </div>
            </div>

            <div className="p-3 bg-white border rounded-xl border-emerald-150 space-y-1.5">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block font-mono">
                Pipeline Sanity Assertions Check
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Source codes fully integrated in Hearth registry bundle</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Logical Gates passed without structural loop anomalies</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE C: resource typology */}
        {selectedNode.type === 'resource' && (
          <div className="p-5 bg-slate-50/75 border border-slate-200/60 rounded-2xl space-y-3.5 animate-in fade-in duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h5 className="text-xs font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5 font-mono">
                <SlidersHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Workspace Module Reference Link Code</span>
              </h5>
              <span className="text-[10px] font-mono font-bold text-slate-505">
                Class: Static
              </span>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-950 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1 flex-wrap gap-1">
                <span className="text-[8.5px] font-mono font-bold text-indigo-400 uppercase tracking-tight">
                  Import Code snippet
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <pre className="text-[9.5px] font-mono text-slate-350 font-medium overflow-x-auto select-all leading-relaxed leading-4">
                <code>
{`import { HearthKernel } from '@hearth/core';
const registryHandle = HearthKernel.locate('${selectedNode.id}');
console.log('[Engine] Status: ', registryHandle.status);`}
                </code>
              </pre>
            </div>

            <div className="pt-1">
              {computedHashCode ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-250 rounded-xl space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 font-mono block">
                    {lVal.hashActive}
                  </span>
                  <p className="text-[9.5px] text-slate-600 font-mono font-bold break-all">
                    🔒 {computedHashCode}
                  </p>
                </div>
              ) : (
                <button
                  onClick={calculateShaRegistry}
                  disabled={computingHash}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                  <span>{computingHash ? lVal.hashProgress : lVal.hashBtn}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* CASE D: agent typology */}
        {selectedNode.type === 'agent' && (
          <div className="p-5 bg-purple-50/15 border border-purple-100 rounded-2xl space-y-3.5 animate-in fade-in duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-purple-101/40">
              <h5 className="text-xs font-black uppercase text-purple-700 tracking-wider flex items-center gap-1.5 font-mono">
                <Terminal className="w-4 h-4 text-purple-500 animate-pulse" />
                <span>{lVal.agentLogs}</span>
              </h5>
              
              <span className="text-[8.5px] font-mono font-black text-purple-500 px-1.5 py-0.5 bg-purple-50 rounded">
                DAEMON ONLINE
              </span>
            </div>

            <div className="p-3 bg-[#0a0a14] border border-slate-950 rounded-xl max-h-[110px] overflow-y-auto space-y-1.5 custom-scroll select-all">
              {agentLogs.length === 0 ? (
                <div className="font-mono text-[9px] text-slate-500">Evaluating cognitive space tags...</div>
              ) : (
                agentLogs.map((log, idx) => (
                  <div key={idx} className="font-mono text-[9px] text-zinc-300 leading-normal select-all">
                    {log}
                  </div>
                ))
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 font-mono">
                  FOCUS STRATEGY
                </span>
                <select 
                  value={horizonProtocol}
                  onChange={(e) => setHorizonProtocol(e.target.value)}
                  className="w-full text-[10.5px] px-2.5 py-1.5 bg-slate-50 border rounded-xl font-bold focus:outline-none"
                >
                  <option value="Heuristic Gravity">Heuristic Align</option>
                  <option value="Logical Sieve">Logical Sieve</option>
                  <option value="Swiss Deselect Pro">Swiss Minimal</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAgentScan}
                  className="w-full py-1.5 bg-[#09090f] hover:bg-slate-900 text-white text-[9.5px] font-black uppercase tracking-widest rounded-xl transition-all shadow flex items-center justify-center gap-1 border border-slate-800"
                >
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lVal.agentRun}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CASE E: muse typology */}
        {selectedNode.type === 'muse' && (
          <div className="p-5 bg-pink-50/15 border border-pink-100 rounded-2xl space-y-3.5 animate-in fade-in duration-300">
            <div className="flex justify-between items-center pb-2 border-b border-pink-101/40">
              <h5 className="text-xs font-black uppercase text-pink-700 tracking-wider flex items-center gap-1.5 font-mono">
                <Compass className="w-4 h-4 text-pink-500 animate-spin" style={{ animationDuration: '10s' }} />
                <span>{language === 'en' ? 'Inspiration Sandbox' : '创新构想灵感沙盒'}</span>
              </h5>
              
              <span className="text-[9.5px] font-mono font-bold text-pink-600 bg-pink-100/40 px-2 py-0.5 rounded">
                Active Sparks
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>{lVal.divergenceCoef}</span>
                <span className="font-mono text-pink-600">{divergenceVal}%</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={120} 
                value={divergenceVal} 
                onChange={(e) => setDivergenceVal(parseInt(e.target.value))}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            <form onSubmit={handleLocalMuseCast} className="space-y-1.5">
              <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 font-mono block">
                {lVal.quickPrompt}
              </span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={language === 'en' ? 'Jot down unorthodox feature concepts...' : '草拟一项创新的离经叛道设想...'} 
                  value={musePromptText}
                  onChange={(e) => setMusePromptText(e.target.value)}
                  required
                  className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-pink-400 font-bold"
                />
                <button 
                  type="submit" 
                  className="px-3 py-2 bg-[#1c0812] text-pink-300 hover:text-pink-150 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>{lVal.castSpark}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Metadata tags list wrapper */}
      <div className="space-y-1.5 border-t pt-4 relative">
        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">
          {lVal.tags}
        </span>

        <div className="flex flex-wrap gap-1.5 items-center">
          {selectedNode.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black font-mono rounded"
            >
              #{tag}
            </span>
          ))}

          <button 
            onClick={() => {
              (window as any).playTactileChime?.('click');
              const freshTag = prompt(language === 'en' ? 'Enter tag string:' : '输入新特性标签字符串:');
              if (freshTag && freshTag.trim()) {
                setNodes(prev => prev.map(n => {
                  if (n.id === selectedNode.id) {
                    return { ...n, tags: [...n.tags, freshTag.trim()] };
                  }
                  return n;
                }));
              }
            }}
            className="px-2 py-0.5 border border-dashed border-slate-350 hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-[9px] font-black font-mono rounded transition-colors"
          >
            + NEW TAG
          </button>
        </div>
      </div>

    </div>
  );
}
