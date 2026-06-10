/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardList, 
  X, 
  GripHorizontal, 
  Plus, 
  Volume2, 
  Trash2, 
  Check, 
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

interface ToolNote {
  id: string;
  text: string;
  color: string;
  createdAt: string;
}

interface DraggableToolPreviewProps {
  onClose: () => void;
  language?: 'en' | 'zh';
  initialX?: number;
  initialY?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const localT = {
  en: {
    previewHeader: "Quick Companion Toolkit",
    dragPrompt: "Drag anywhere via handle",
    memoField: "Quick stick directive...",
    addBtn: "Pin",
    emptyNotes: "No memos current on board.",
    unpin: "Unpin",
    synthHeader: "TACTILE SYNTH CO-PILOT",
    syncedLabel: "Synced Locally",
    statusLive: "LIVE FEED"
  },
  zh: {
    previewHeader: "即贴便捷智能工具盒",
    dragPrompt: "按住顶部条可任意拖动",
    memoField: "随时写入快捷指令...",
    addBtn: "添加",
    emptyNotes: "暂无临贴便签。",
    unpin: "移除",
    synthHeader: "微型正弦物理合成器",
    syncedLabel: "已进行本地哈希同步",
    statusLive: "实时监控"
  }
};

export default function DraggableToolPreview({
  onClose,
  language = 'en',
  initialX = 300,
  initialY = 200,
  onMouseEnter,
  onMouseLeave
}: DraggableToolPreviewProps) {
  const lVal = localT[language];
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Memos state
  const [notes, setNotes] = useState<ToolNote[]>(() => {
    const cached = localStorage.getItem('heya_workspace_notes');
    if (cached) {
      try { return JSON.parse(cached); } catch(e) { return []; }
    }
    return [];
  });

  const [newText, setNewText] = useState('');

  // Sync memos in real-time using global custom events
  useEffect(() => {
    const syncNotes = () => {
      const cached = localStorage.getItem('heya_workspace_notes');
      if (cached) {
        try { setNotes(JSON.parse(cached)); } catch(e) {}
      }
    };

    window.addEventListener('update-toolnotes', syncNotes);
    window.addEventListener('storage', syncNotes);
    
    // Initial fetch
    syncNotes();

    return () => {
      window.removeEventListener('update-toolnotes', syncNotes);
      window.removeEventListener('storage', syncNotes);
    };
  }, []);

  // Save notes and dispatch sync event
  const saveNotes = (updated: ToolNote[]) => {
    setNotes(updated);
    localStorage.setItem('heya_workspace_notes', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('update-toolnotes'));
  };

  // Dragging mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag when clicking the top header bar or specific drag handles
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };
    (window as any).playTactileChime?.('click');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      // Calculate new coordinates, constrain inside screen boundaries loosely
      const newX = Math.max(10, Math.min(window.innerWidth - 340, initialPos.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 440, initialPos.current.y + dy));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Touch event handlers for responsive mobile interfaces
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    initialPos.current = { x: position.x, y: position.y };
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      
      const newX = Math.max(10, Math.min(window.innerWidth - 340, initialPos.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 440, initialPos.current.y + dy));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  // Add memo handler
  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    (window as any).playTactileChime?.('click');

    const colors = ['#fef08a', '#fecdd3', '#bdf5d0', '#bae6fd', '#e9d5ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const fresh: ToolNote = {
      id: `toolnote-${Date.now()}`,
      text: newText.trim(),
      color: randomColor,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [fresh, ...notes];
    saveNotes(updated);
    setNewText('');

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Memo pinned!' : '便签添加成功！已同步储存。', 
        type: 'success' 
      }
    }));
  };

  // Delete memo handler
  const handleDeleteMemo = (id: string) => {
    (window as any).playTactileChime?.('alert');
    const updated = notes.filter(n => n.id !== id);
    saveNotes(updated);
  };

  // Play tone helper
  const handlePlayTone = (tone: 'click' | 'success' | 'alert') => {
    (window as any).playTactileChime?.(tone);
  };

  return (
    <div
      ref={containerRef}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed w-[320px] bg-white border-2 border-slate-900 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] z-[9999] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 ${
        isDragging ? 'cursor-grabbing opacity-95 scale-[0.99] ring-2 ring-indigo-505' : ''
      }`}
    >
      {/* Draggable Header handle strip */}
      <div className="drag-handle bg-slate-950 text-white px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-slate-450 shrink-0" />
          <div className="min-w-0">
            <h4 className="text-[11px] font-black tracking-wider uppercase text-amber-400 truncate">
              {lVal.previewHeader}
            </h4>
            <p className="text-[8px] text-slate-400 font-mono italic">
              {lVal.dragPrompt}
            </p>
          </div>
        </div>

        {/* Close widget */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            (window as any).playTactileChime?.('alert');
            onClose();
          }}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Local Diagnostic status feed */}
      <div className="bg-slate-50 border-b px-4 py-1.5 flex items-center justify-between text-[8px] font-mono text-slate-500 font-bold">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span>{lVal.statusLive}</span>
        </div>
        <span>{lVal.syncedLabel}</span>
      </div>

      {/* Internal interactive view padding */}
      <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto bg-slate-50/30">
        
        {/* Memo fast composer form */}
        <form onSubmit={handleAddMemo} className="flex gap-2.5">
          <input
            type="text"
            placeholder={lVal.memoField}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-xl px-3 py-2 text-xs font-semibold"
          />
          <button
            type="submit"
            className="px-3 bg-slate-900 text-white text-xs font-black uppercase rounded-xl hover:bg-black transition-colors"
          >
            {lVal.addBtn}
          </button>
        </form>

        {/* Notes quick layout */}
        <div className="space-y-2">
          {notes.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-semibold text-center py-3 italic">
              {lVal.emptyNotes}
            </p>
          ) : (
            notes.slice(0, 3).map((note) => (
              <div 
                key={note.id}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ isNoteDrag: true, text: note.text }));
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                className="p-2.5 rounded-xl border border-black/5 shadow-sm text-[10.5px] font-bold flex justify-between items-start gap-2.5 cursor-grab active:cursor-grabbing hover:scale-[1.01] transition-transform"
                style={{ backgroundColor: note.color }}
              >
                <p className="leading-relaxed text-slate-800 break-words flex-1">
                  {note.text}
                </p>
                <button
                  onClick={() => handleDeleteMemo(note.id)}
                  className="text-slate-500 hover:text-red-600 transition-colors shrink-0 pt-0.5"
                  title={lVal.unpin}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Synthesizer mini pad board */}
        <div className="border-t pt-3.5">
          <h5 className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">
            🔊 {lVal.synthHeader}
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Click", t: "click", color: "hover:bg-indigo-50/50 hover:text-indigo-600" },
              { label: "Done!", t: "success", color: "hover:bg-emerald-50/50 hover:text-emerald-600" },
              { label: "Alert", t: "alert", color: "hover:bg-rose-50/50 hover:text-rose-600" }
            ].map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePlayTone(btn.t as any)}
                className={`py-1.5 border border-slate-200/80 bg-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors duration-150 flex items-center justify-center gap-1 ${btn.color}`}
              >
                <Volume2 className="w-2.5 h-2.5" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Dragging help indicators */}
      <div className="border-t px-4 py-2 bg-slate-50 flex items-center justify-between text-[8px] font-mono text-slate-400 select-none">
        <span>BOUNDS: FLUID X/Y</span>
        <span className="text-[7.5px] font-black text-indigo-500 animate-pulse uppercase">active tracking</span>
      </div>
    </div>
  );
}
