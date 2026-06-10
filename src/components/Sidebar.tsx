/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Grid, 
  Cpu, 
  Settings, 
  Lightbulb,
  Radio,
  Network,
  Sparkles,
  Bell,
  BookOpen,
  ChevronDown,
  Map,
  Compass,
  Layers
} from 'lucide-react';
import { translations } from '../locales';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAskHeya?: (prompt: string) => void;
  isAiLoading?: boolean;
  chatHistory?: { role: string; content: string }[];
  language?: 'en' | 'zh';
  onOpenSettings?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  language = 'en',
  onOpenSettings
}: SidebarProps) {
  const tVal = translations[language].sidebar;

  const menuItems = [
    { id: 'projectspace', label: 'Project Space', icon: Layers },
    { id: 'fieldmap', label: 'Field Map', icon: Map },
    { id: 'component', label: 'Component', icon: Grid },
    { id: 'forge', label: 'Forge', icon: Cpu },
    { id: 'muse', label: 'Muse', icon: Lightbulb },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'oermos', label: 'Oermos P2P', icon: Radio },
    { id: 'relations', label: 'Relations', icon: Network },
    { id: 'hey', label: 'Hey Companion', icon: Sparkles },
  ];

  return (
    <div className="w-[280px] h-full flex flex-col justify-between bg-white border-r border-[#eef2f6] shrink-0 select-none font-sans relative">
      <div>
        {/* Brand Logo & User Header */}
        <div className="p-6 pb-2">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-semibold tracking-tighter text-sm">
              <span className="scale-110">⬢</span>
            </div>
            <div className="font-extrabold tracking-tight text-xl text-slate-900">
              HeYa
            </div>
          </div>

          {/* User Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc]/80 hover:bg-[#f1f5f9] cursor-pointer transition-all duration-200 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-100 shadow-sm relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop&sat=-100" 
                  alt="ceaserzhao avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800">
                  ceaserzhao
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  Oasis Company
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
          </div>
        </div>

        {/* Navigation Menus */}
        <div className="px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  (window as any).playTactileChime?.('click');
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'bg-[#eef2ff] text-indigo-600 font-bold shadow-sm shadow-indigo-100/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-glow" />
                )}
              </button>
            );
          })}
        </div>
      </div>      {/* Heya AI Section */}
      <div className="px-5 pb-5">
        <button
          onClick={() => {
            (window as any).playTactileChime?.('click');
            setActiveTab('hey');
          }}
          className={`w-full text-left p-4.5 rounded-2xl relative overflow-hidden transition-all duration-300 group border flex flex-col justify-between ${
            activeTab === 'hey'
              ? 'bg-[#03020c] text-white border-indigo-950 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
              : 'bg-gradient-to-br from-[#0c0a24] via-[#050414] to-[#010103] hover:border-[#6366f1]/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] text-slate-100 border-indigo-950/40'
          }`}
          title={language === 'en' ? 'Click to engage Hey Strategy Companion Portal' : '点击唤醒 Hey 战略AI伙伴控制台'}
        >
          {/* Pulsing deep purple/indigo space dust backdrop */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/10 via-violet-500/5 to-transparent rounded-2xl group-hover:scale-110 transition-transform duration-500" />
          
          <div className="w-full flex items-center justify-between mb-3 pointer-events-none relative z-10">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${activeTab === 'hey' ? 'text-indigo-400 animate-pulse' : 'text-indigo-400 rotate-12 transition-transform duration-300'}`} />
              <span className="text-[10px] font-black tracking-widest uppercase text-indigo-300 font-mono">
                {language === 'en' ? 'Hey Companion' : 'Hey 核心伙伴'}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
              </span>
              <span className="text-[8px] font-mono font-black tracking-wider text-indigo-400">
                SOVEREIGN
              </span>
            </div>
          </div>

          <div className="pointer-events-none space-y-1 select-none relative z-10">
            <h4 className="text-xs font-black text-white uppercase tracking-tight">
              {language === 'en' ? 'PORTAL TO HEY AI' : 'Hey 联络交互空间'}
            </h4>
            <p className="text-[9.5px] font-bold leading-relaxed text-slate-400">
              {language === 'en' 
                ? 'Co-pilot system topologies, brainstorm strategic goals & dispatch real-time commands with fluid companion AI!' 
                : '与核心系统 AI 协同治理星图、激发灵感，并通过对话框瞬发全局控制与节点增删指令！'}
            </p>
          </div>

          <div className="w-full flex items-center justify-between mt-3.5 pt-3.5 border-t border-slate-900/60 pointer-events-none relative z-10">
            <span className={`text-[9px] font-black tracking-widest uppercase ${activeTab === 'hey' ? 'text-indigo-400' : 'text-indigo-300'} flex items-center gap-1.5`}>
              <span>{language === 'en' ? 'ENGAGE PORTAL' : '唤醒和联络 Hey'}</span>
              <span className="transform group-hover:translate-x-1 duration-200">→</span>
            </span>
            <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-indigo-950/40 border border-indigo-900/30 text-indigo-300">
              ADR-007
            </span>
          </div>
        </button>

        {/* Footer actions exactly as shown in screenshot */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
          <button 
            onClick={() => {
              (window as any).playTactileChime?.('click');
              onOpenSettings();
            }}
            className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" 
            title={language === 'en' ? 'Settings' : '系统设置'}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              (window as any).playTactileChime?.('click');
              window.dispatchEvent(new CustomEvent('heya-toast', { detail: { message: language === 'en' ? 'Scanning Oermos P2P activity stream...' : '正在拦截扫描 Oermos P2P 自律活动日志...' } }));
            }}
            className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all relative" 
            title={language === 'en' ? 'Notifications' : '通知'}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          </button>
          <button 
            onClick={() => {
              (window as any).playTactileChime?.('click');
              window.dispatchEvent(new CustomEvent('heya-toast', { detail: { message: language === 'en' ? 'Hearth Guide ADR-007 is locked to workspace local memory.' : '赫斯系统操作指南 ADR-007 协议已锁定防篡改内存。' } }));
            }}
            className="flex items-center justify-center w-9 h-9 text-slate-400 bg-[#f8fafc] hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" 
            title={language === 'en' ? 'System Guide' : '指南'}
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
