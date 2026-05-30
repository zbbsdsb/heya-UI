/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
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
  MessageSquare
} from 'lucide-react';
import { translations } from '../locales';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAskHeya: (prompt: string) => void;
  isAiLoading: boolean;
  chatHistory: { role: string; content: string }[];
  language?: 'en' | 'zh';
  onOpenSettings?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onAskHeya, 
  isAiLoading, 
  chatHistory,
  language = 'en',
  onOpenSettings
}: SidebarProps) {
  const [promptInput, setPromptInput] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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


  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isAiLoading) return;
    onAskHeya(promptInput);
    setPromptInput('');
  };

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
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
                  alt="Zhibin avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-800">
                  Zhibin
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
        <div className="p-4 rounded-2xl bg-[#eff6ff] border border-[#dbeafe] relative overflow-hidden group">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 rounded-full blur-xl transition-all group-hover:scale-125" />
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-blue-900 tracking-tight flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Heya AI
            </span>
            <span className="px-1.5 py-0.5 bg-[#dbeafe] text-blue-600 rounded-md text-[9px] font-bold uppercase tracking-wider">
              Beta
            </span>
          </div>
          
          <p className="text-xs text-blue-800/80 leading-relaxed font-semibold mb-3">
            {tVal.analyzePrompt}
          </p>

          <form onSubmit={handleAsk} className="space-y-2">
            <input
              type="text"
              placeholder={tVal.placeholder}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white/90 border border-blue-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 shadow-sm"
              disabled={isAiLoading}
            />
            
            <div className="flex gap-1.5">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-blue-400/20 transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
                disabled={isAiLoading}
              >
                {isAiLoading ? tVal.analyzing : tVal.askButton}
              </button>
              
              {chatHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(true)}
                  className="px-2 bg-white/80 hover:bg-white text-slate-600 border border-blue-200 rounded-lg text-xs font-bold transition-all relative"
                  title={tVal.historyTitle}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer actions exactly as shown in screenshot */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
          <button 
            onClick={onOpenSettings}
            className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" 
            title={tVal.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all relative" title={tVal.notifications}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          </button>
          <button className="flex items-center justify-center w-9 h-9 text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all" title={tVal.systemLogs}>
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dialog for Chat History Response */}
      {showHistoryModal && (
        <div className="absolute inset-x-4 bottom-24 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 flex flex-col max-h-[320px] animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {tVal.historyTitle}
            </span>
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded"
            >
              {tVal.close}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 mt-1 pr-1">
            {chatHistory.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-2 rounded-xl text-xs leading-relaxed ${
                  item.role === 'user' 
                    ? 'bg-slate-50 text-slate-800' 
                    : 'bg-indigo-50/50 text-slate-700 border border-indigo-100/50'
                }`}
              >
                <div className="font-bold text-[10px] uppercase tracking-wide mb-0.5 text-slate-400">
                  {item.role === 'user' ? tVal.you : tVal.assistant}
                </div>
                <div className="whitespace-pre-wrap font-medium">{item.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
