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
  Compass
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
                onClick={() => setActiveTab(item.id)}
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
      </div>

      {/* Heya AI Section */}
      <div className="px-5 pb-5">
        <button
          onClick={() => setActiveTab('forge')}
          className={`w-full text-left p-4.5 rounded-2xl relative overflow-hidden transition-all duration-300 group border flex flex-col justify-between ${
            activeTab === 'forge'
              ? 'bg-[#0f172a] text-white border-slate-900 shadow-xl'
              : 'bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#e0f2fe] hover:from-[#f0f4f8] hover:via-[#e0f1fe] hover:to-[#bae6fd] text-slate-800 border-[#eef2f6] hover:border-indigo-200 hover:shadow-md'
          }`}
          title={language === 'en' ? 'Click to open Official Creation & Forge Workbench' : '点击打开系统官方节点及计算代理创意工坊'}
        >
          {/* Pulsing signal background */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
          
          <div className="w-full flex items-center justify-between mb-3 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${activeTab === 'forge' ? 'text-blue-400' : 'text-indigo-600 animate-pulse'}`} />
              <span className={`text-[10px] font-black tracking-wider uppercase ${activeTab === 'forge' ? 'text-blue-300' : 'text-indigo-950 font-sans'}`}>
                {language === 'en' ? 'Hey Portal' : 'Hey 门户'}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className={`text-[8px] font-mono font-extrabold tracking-wider ${activeTab === 'forge' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                LIVE
              </span>
            </div>
          </div>

          <div className="pointer-events-none space-y-1 select-none">
            <h4 className={`text-xs font-black ${activeTab === 'forge' ? 'text-white' : 'text-slate-950 font-sans'}`}>
              {language === 'en' ? 'Official Design & Forge' : '进入正式创建面板'}
            </h4>
            <p className={`text-[10px] font-semibold leading-relaxed ${activeTab === 'forge' ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'en' 
                ? 'Tactile workspace with AI model optimization to draft nodes & agents directly to Field Map!' 
                : '一键进入官方高级节点与模型代理设计中心，配置属性并实体化入图！'}
            </p>
          </div>

          <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50 group-hover:border-slate-300/50 transition-colors pointer-events-none">
            <span className={`text-[9px] font-bold ${activeTab === 'forge' ? 'text-blue-400' : 'text-indigo-600'} flex items-center gap-1`}>
              <span>{language === 'en' ? 'Enter Forge Studio' : '进入熔铸工坊'}</span>
              <span className="transform group-hover:translate-x-1 duration-200">→</span>
            </span>
            <span className={`text-[8px] font-mono font-bold px-1.2 py-0.2 rounded ${
              activeTab === 'forge' ? 'bg-slate-800 text-slate-400' : 'bg-white/80 border border-slate-200/40 text-slate-500'
            }`}>
              ADR-007
            </span>
          </div>
        </button>

        {/* Footer actions exactly as shown in screenshot */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
          <button 
            onClick={onOpenSettings}
            className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" 
            title={language === 'en' ? 'Settings' : '系统设置'}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all relative" title={language === 'en' ? 'Notifications' : '通知'}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          </button>
          <button className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" title={language === 'en' ? 'System Guide' : '指南'}>
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
