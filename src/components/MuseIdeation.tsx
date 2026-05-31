/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Send, 
  Maximize2, 
  FolderLock,
  Compass,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { MuseIdea } from '../types';
import { translations } from '../locales';

interface MuseIdeationProps {
  ideas: MuseIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<MuseIdea[]>>;
  onEvolveNode: (id: string, text: string) => void;
  language?: 'en' | 'zh';
}

export default function MuseIdeation({ ideas, setIdeas, onEvolveNode, language = 'en' }: MuseIdeationProps) {
  const [newThought, setNewThought] = useState('');
  const tVal = translations[language].muse;

  const handleCaptureThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;

    const idea: MuseIdea = {
      id: `muse-${Date.now()}`,
      content: newThought.trim(),
      createdAt: language === 'en' ? 'Today 11:55' : '今天 11:55',
    };

    setIdeas(prev => [idea, ...prev]);
    setNewThought('');
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-8 animate-in fade-in-20 duration-300">
      
      {/* Intro upper details */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0f172a] flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500 fill-amber-300/30" />
            <span>{tVal.title}</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {tVal.desc}
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-xl text-xs font-bold font-mono text-amber-700 uppercase tracking-wide">
            {language === 'en' ? `${ideas.length} ideas cached` : `${ideas.length} ${tVal.ideasCached}`}
          </span>
        </div>
      </div>

      {/* Capture Input Panel */}
      <div className="bg-white border border-slate-250/60 rounded-2xl p-6 shadow-sm max-w-2xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          {tVal.captureHeader}
        </h3>

        <form onSubmit={handleCaptureThought} className="flex gap-2.5">
          <input 
            type="text" 
            placeholder={tVal.inputPlaceholder}
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            className="flex-1 text-xs px-3.5 py-3 bg-[#f8fafc] border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-400 font-semibold"
            required
          />
          <button 
            type="submit"
            className="px-4 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all text-white font-bold rounded-xl flex items-center gap-1 shadow-md text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{tVal.sproutBtn}</span>
          </button>
        </form>
      </div>

      {/* Grid of capturing sparks */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {tVal.ideaSandbox}
        </h3>

        {ideas.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
            <p className="text-xs font-semibold">{tVal.emptyCache}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div 
                key={idea.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-amber-300/60 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                
                {/* Meta block */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-3 font-mono">
                    <span>{idea.createdAt}</span>
                    <span className="text-amber-600 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-500 animate-pulse" />
                      {tVal.fleetingSpark}
                    </span>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    {idea.content}
                  </p>
                </div>

                {/* Evolution Trigger Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                    title={language === 'en' ? 'Delete Idea' : '删除点子'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {idea.convertedToNodeId ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{tVal.evolvedLabel}</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => onEvolveNode(idea.id, idea.content)}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all hover:scale-[1.03]"
                    >
                      <span>{tVal.evolveButton}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
