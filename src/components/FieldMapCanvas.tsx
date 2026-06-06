/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Star, 
  Maximize2, 
  MapPin, 
  Grid, 
  Circle, 
  Sparkles, 
  CheckSquare, 
  Lightbulb, 
  Trash2, 
  PenTool, 
  CheckCircle2, 
  Calendar,
  Layers,
  HelpCircle,
  Zap,
  Info,
  Cpu,
  BookOpen,
  Check
} from 'lucide-react';
import { NodeData, ChecklistItem } from '../types';
import { translations, getLocalizedNode } from '../locales';

// Team member avatars
const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop&sat=-100", // ceaserzhao
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop", // Ying
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop", // Alex
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop", // David
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128&auto=format&fit=crop"  // Emma
];

const getNodeDimensions = (type: string) => {
  switch (type) {
    case 'project':
      return { width: 236, height: 140 };
    case 'todo':
      return { width: 216, height: 130 };
    case 'agent':
      return { width: 210, height: 130 };
    case 'muse':
      return { width: 226, height: 132 };
    case 'resource':
    default:
      return { width: 196, height: 122 };
  }
};

interface FieldMapCanvasProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  onAddMapItem: (title: string, type: string) => void;
  language?: 'en' | 'zh';
}

export default function FieldMapCanvas({ 
  nodes, 
  setNodes, 
  selectedNodeId, 
  setSelectedNodeId,
  onAddMapItem,
  language = 'en'
}: FieldMapCanvasProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  // Drag states
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Connection Builder State (line-drawing option)
  const [activeTool, setActiveTool] = useState<'select' | 'connection' | 'boundary'>('select');
  const [connectionSourceId, setConnectionSourceId] = useState<string | null>(null);

  // Task overlays
  const [focusedTodoNodeId, setFocusedTodoNodeId] = useState<string | null>('todo-list');
  const [quickTaskText, setQuickTaskText] = useState('');
  
  // Add new element state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<NodeData['type']>('todo');
  const [newDesc, setNewDesc] = useState('');
  const [hudActive, setHudActive] = useState(true);

  // Organic Ecosystem enhancement states
  const [nodeFilter, setNodeFilter] = useState<'all' | 'project' | 'todo' | 'agent' | 'muse' | 'resource'>('all');
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<number | null>(null);

  // Background mindspore/neural glowing particle flow coordinates in canvas space
  const [particles] = useState(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 1400 + 50,
      y: Math.random() * 900 + 50,
      r: Math.random() * 2.2 + 0.8,
      opacity: Math.random() * 0.35 + 0.1,
      speed: Math.random() * 1.5 + 0.4,
    }));
  });

  const tVal = translations[language].fieldmap;

  // --- SUBTLE LATTICE SPRING OPTIMIZER ENGINE ---
  const runLatticeRelaxation = (customFrames = 90) => {
    if (simulationRef.current) {
      cancelAnimationFrame(simulationRef.current);
    }
    
    setIsSimulating(true);
    let framesRemaining = customFrames;
    
    const step = () => {
      setNodes(prev => {
        const k = 220; // Perfect standard spacing between nodes
        const decayForce = Math.min(1, framesRemaining / customFrames); // Eased force decay
        
        // Vectors for accumulated displacement
        const dxs = new Array(prev.length).fill(0);
        const dys = new Array(prev.length).fill(0);
        
        // 1. Repulsive forces (prevent clutter and overlap)
        for (let i = 0; i < prev.length; i++) {
          for (let j = i + 1; j < prev.length; j++) {
            const n1 = prev[i];
            const n2 = prev[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Repulsive range: if closer than 190, push apart gently
            const minAllowedDist = 194;
            if (dist < minAllowedDist) {
              const repelStrength = (minAllowedDist - dist) * 0.12 * decayForce;
              const forceX = (dx / dist) * repelStrength;
              const forceY = (dy / dist) * repelStrength;
              
              dxs[i] -= forceX;
              dys[i] -= forceY;
              dxs[j] += forceX;
              dys[j] += forceY;
            }
          }
        }
        
        // 2. Attractive forces along connection links
        for (let i = 0; i < prev.length; i++) {
          const node = prev[i];
          if (!node.connections) continue;
          node.connections.forEach(targetId => {
            const j = prev.findIndex(n => n.id === targetId);
            if (j === -1) return;
            const n2 = prev[j];
            const dx = n2.x - node.x;
            const dy = n2.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Connected nodes like to stay near ideal distance K
            if (dist > k) {
              const attractiveStrength = (dist - k) * 0.03 * decayForce;
              const forceX = (dx / dist) * attractiveStrength;
              const forceY = (dy / dist) * attractiveStrength;
              
              dxs[i] += forceX;
              dys[i] += forceY;
              dxs[j] -= forceX;
              dys[j] -= forceY;
            }
          });
        }

        // 3. Coordinate bounds clamp & gentle pull to preserve layout integrity
        return prev.map((node, idx) => {
          if (node.id === draggedNodeId) return node; // Skip current dragging item
          
          let nx = node.x + dxs[idx];
          let ny = node.y + dys[idx];
          
          // Outer canvas bounding safety guard
          nx = Math.max(40, Math.min(1450, nx));
          ny = Math.max(40, Math.min(950, ny));
          
          return {
            ...node,
            x: Math.round(nx),
            y: Math.round(ny),
            updatedAt: '2024/05/30'
          };
        });
      });
      
      framesRemaining--;
      if (framesRemaining > 0) {
        simulationRef.current = requestAnimationFrame(step);
      } else {
        setIsSimulating(false);
      }
    };
    
    simulationRef.current = requestAnimationFrame(step);
  };

  // Clean up animation ticker on component unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        cancelAnimationFrame(simulationRef.current);
      }
    };
  }, []);

  // Hearth Boundaries specification
  const boundaries = [
    { name: tVal.opportunityDomain, id: 'opportunity', color: 'border-[#a855f7]/30 text-[#a855f7]/70', x: 80, y: 150, width: 320, height: 260 },
    { name: tVal.executionDomain, id: 'execution', color: 'border-[#3b82f6]/25 text-[#3b82f6]/70', x: 260, y: 460, width: 400, height: 250 },
    { name: tVal.coreTerritory, id: 'core', color: 'border-indigo-500/25 text-indigo-500/70 bg-indigo-500/[0.005]', x: 620, y: 340, width: 340, height: 240 },
    { name: tVal.futureStation, id: 'future', color: 'border-[#14b8a6]/25 text-[#14b8a6]/70', x: 650, y: 120, width: 340, height: 210 },
    { name: tVal.designSystemAsset, id: 'assets', color: 'border-orange-500/25 text-orange-500/70', x: 740, y: 560, width: 220, height: 180 },
  ];

  const handleNodeMouseDown = (e: React.MouseEvent, node: NodeData) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);

    if (activeTool === 'connection') {
      if (!connectionSourceId) {
        setConnectionSourceId(node.id);
      } else {
        if (connectionSourceId !== node.id) {
          // Join nodes
          setNodes(prev => prev.map(n => {
            if (n.id === connectionSourceId && !n.connections.includes(node.id)) {
              return { ...n, connections: [...n.connections, node.id], updatedAt: '2024/05/30' };
            }
            return n;
          }));
        }
        setConnectionSourceId(null);
        setActiveTool('select');
      }
      return;
    }

    setDraggedNodeId(node.id);
    const clientX = e.clientX;
    const clientY = e.clientY;
    setDragOffset({
      x: (clientX / zoom) - node.x,
      y: (clientY / zoom) - node.y
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const newX = Math.round((e.clientX / zoom) - dragOffset.x);
      const newY = Math.round((e.clientY / zoom) - dragOffset.y);
      setNodes(prev => prev.map(n => 
        n.id === draggedNodeId ? { ...n, x: newX, y: newY, updatedAt: '2024/05/30' } : n
      ));
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleBgMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'connection') {
      setConnectionSourceId(null);
      setActiveTool('select');
      return;
    }
    setIsPanning(true);
    setPanStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    });
  };

  // Checklist actions
  const handleToggleChecklist = (nodeId: string, itemId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const updatedChecklist = node.checklist.map(item => 
          item.id === itemId ? { ...item, done: !item.done } : item
        );
        const doneCount = updatedChecklist.filter(item => item.done).length;
        const totalCount = updatedChecklist.length;
        const newProgress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : node.progress;

        return {
          ...node,
          checklist: updatedChecklist,
          progress: newProgress,
          updatedAt: '2024/05/30'
        };
      }
      return node;
    }));
  };

  const handleAddMapTaskSubmit = (e: React.FormEvent, nodeId: string) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const newItem: ChecklistItem = {
          id: `task-${Date.now()}`,
          text: quickTaskText.trim(),
          done: false,
          dueDate: '今天'
        };
        const updatedChecklist = [...node.checklist, newItem];
        const doneCount = updatedChecklist.filter(item => item.done).length;
        const totalCount = updatedChecklist.length;
        const newProgress = Math.round((doneCount / totalCount) * 100);

        return {
          ...node,
          checklist: updatedChecklist,
          progress: newProgress,
          updatedAt: '2024/05/30'
        };
      }
      return node;
    }));
    setQuickTaskText('');
  };

  // Header quick nodes creators
  const handleCreateNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const id = `node-${Date.now()}`;
    const newNode: NodeData = {
      id,
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim() || 'A Hearth network active component.',
      x: 350 + Math.random() * 100,
      y: 300 + Math.random() * 100,
      progress: 0,
      members: ['ceaserzhao'],
      checklist: newType === 'todo' ? [
        { id: `t-${id}-1`, text: '初始化子任务清单', done: false }
      ] : [],
      tags: ['Manual', 'Hearth-1.0'],
      connections: [],
      createdAt: '2024/05/30',
      updatedAt: '2024/05/30'
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(id);
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleDeleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes(prev => prev.filter(n => n.id !== id).map(n => ({
      ...n,
      connections: n.connections.filter(c => c !== id)
    })));
    setSelectedNodeId(null);
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes(prev => prev.map(n => 
      n.id === id ? { ...n, star: !n.star, updatedAt: '2024/05/30' } : n
    ));
  };

  const getFilterLabel = (type: string) => {
    switch (type) {
      case 'all': return language === 'en' ? 'All' : '全部';
      case 'project': return tVal.project || 'Project';
      case 'todo': return tVal.todo || 'Todo';
      case 'agent': return tVal.agent || 'Agent';
      case 'muse': return tVal.muse || 'Muse';
      case 'resource': return tVal.resource || 'Resource';
      default: return type;
    }
  };

  return (
    <div 
      className="flex-1 overflow-hidden relative bg-[#fafafa]" 
      onMouseDown={handleBgMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
    >
      
      {/* Centered Single Viewport Container - Eliminates viewport desynchronization jitter */}
      <div 
        className="absolute inset-0 select-none pointer-events-none transition-viewport"
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* dot grid backdrop */}
        <div className="absolute inset-[-2000px] bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none opacity-80" />

        {/* Bioluminescent floating mycelium micro-particles representing self-organizing mindspore spores */}
        <svg className="w-[3000px] h-[3000px] overflow-visible absolute top-0 left-0 pointer-events-none">
          {/* Glowing biological spores that float and drift */}
          {particles.map(p => (
            <circle
              key={`spore-${p.id}`}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="#818cf8"
              opacity={p.opacity}
              className="animate-pulse"
              style={{
                animationDelay: `${p.id * 120}ms`,
                animationDuration: `${3200 / p.speed}ms`
              }}
            />
          ))}

          {/* SVG Bezier wires connecting everything precisely */}
          {nodes.map(node => {
            return node.connections?.map(targetId => {
              const target = nodes.find(n => n.id === targetId);
              if (!target) return null;

              const dimSource = getNodeDimensions(node.type);
              const dimTarget = getNodeDimensions(target.type);

              const x1 = node.x + dimSource.width / 2;
              const y1 = node.y + dimSource.height / 2;
              const x2 = target.x + dimTarget.width / 2;
              const y2 = target.y + dimTarget.height / 2;

              // Cubic Bezier curvatures
              const cx1 = x1 + (x2 - x1) * 0.45;
              const cy1 = y1;
              const cx2 = x1 + (x2 - x1) * 0.55;
              const cy2 = y2;

              const isHighlighted = selectedNodeId === node.id || selectedNodeId === target.id;
              const isFilteredOut = (nodeFilter !== 'all' && node.type !== nodeFilter && target.type !== nodeFilter);

              const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

              return (
                <g key={`${node.id}-${targetId}`} className={`transition-opacity duration-300 ${isFilteredOut ? 'opacity-10' : 'opacity-100'}`}>
                  {/* Subtle blur backdrop wire */}
                  <path 
                    d={pathData}
                    fill="none" 
                    stroke={isHighlighted ? 'rgba(99, 102, 241, 0.45)' : 'rgba(226, 232, 240, 0.65)'}
                    strokeWidth={8} 
                    strokeLinecap="round"
                  />
                  {/* Primary sharp wire */}
                  <path 
                    d={pathData}
                    fill="none" 
                    stroke={isHighlighted ? '#6366f1' : '#cbd5e1'}
                    strokeWidth={2} 
                    strokeLinecap="round"
                    strokeDasharray={node.type === 'muse' || target.type === 'muse' ? '5,5' : 'none'}
                    className="transition-all duration-300 animate-pulse"
                  />
                  {/* Glowing flowing energy dot along the wire */}
                  <circle r={isHighlighted ? "5" : "3.5"} fill={isHighlighted ? "#818cf8" : "#94a3b8"} className="filter drop-shadow-[0_0_5px_rgba(99,102,241,0.7)]">
                    <animateMotion dur={isHighlighted ? "2.5s" : "5.5s"} repeatCount="indefinite" path={pathData} />
                  </circle>
                </g>
              );
            });
          })}

          {/* Draw active connecting guidance wire */}
          {activeTool === 'connection' && connectionSourceId && (() => {
            const originNode = nodes.find(n => n.id === connectionSourceId);
            if (!originNode) return null;
            const dimSrc = getNodeDimensions(originNode.type);
            return (
              <line 
                x1={originNode.x + dimSrc.width / 2}
                y1={originNode.y + dimSrc.height / 2}
                x2={(originNode.x + dimSrc.width + 100)} // Placeholder end
                y2={(originNode.y + dimSrc.height + 50)}
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
            );
          })()}
        </svg>

        {/* Decorative Hearth subfields boundaries layers */}
        {boundaries.map((b) => (
          <div 
            key={b.id}
            className={`absolute border border-dashed rounded-[32px] p-5 flex flex-col justify-between transition-all duration-500 bg-slate-500/[0.003] hover:bg-slate-500/[0.015] ${b.color}`}
            style={{
              left: b.x,
              top: b.y,
              width: b.width,
              height: b.height,
            }}
          >
            {/* Elegant corner tick marks representing technical drawing specs */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-current opacity-30 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-current opacity-30 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-current opacity-30 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-current opacity-30 rounded-br-xl" />

            {/* Boundary header showing index and location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 opacity-80 font-mono tracking-widest text-[9px] uppercase px-2 py-0.5 bg-white border border-slate-200/50 rounded-md shadow-sm">
                <Layers className="w-2.5 h-2.5 text-indigo-500" />
                <span className="font-bold text-slate-700">{b.name}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400 font-extrabold">{b.id.toUpperCase()}</span>
              </div>
              
              {/* Micro-coordinate indicator */}
              <div className="opacity-40 font-mono text-[8px] tracking-tight">
                POS: {b.x}X, {b.y}Y
              </div>
            </div>

            {/* Technical grid coordinates at the bottom */}
            <div className="flex justify-between items-center opacity-30 font-mono text-[7px] tracking-widest mt-auto pt-4">
              <span>W: {b.width}px H: {b.height}px</span>
              <span>HEARTH_GRID_INDEX // 0x{b.id.toUpperCase().slice(0, 3)}</span>
            </div>
          </div>
        ))}

        {/* Floating Node elements layer - pointer events enabled */}
        <div className="absolute inset-0 pointer-events-auto animate-in fade-in duration-500">
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isFilteredOut = nodeFilter !== 'all' && node.type !== nodeFilter;
            const dim = getNodeDimensions(node.type);

          // Compute specific styling parameters based on node type
          const getThemeAttributes = () => {
            switch (node.type) {
              case 'project':
                return {
                  gradient: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/15 hover:to-indigo-500/15',
                  accent: 'text-indigo-600',
                  badge: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
                  glow: 'glow-purple',
                  border: isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200/50',
                  bar: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                };
              case 'todo':
                return {
                  gradient: 'from-[#10b981]/10 to-[#34d399]/5 hover:from-[#10b981]/15',
                  accent: 'text-emerald-600',
                  badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
                  glow: 'glow-green',
                  border: isSelected ? 'border-emerald-500 ring-2 ring-[#a7f3d0]/60' : 'border-slate-200/50',
                  bar: 'bg-gradient-to-r from-emerald-500 to-teal-500'
                };
              case 'agent':
                return {
                  gradient: 'from-purple-500/10 to-pink-500/5',
                  accent: 'text-purple-600',
                  badge: 'bg-purple-50 text-purple-600 border border-purple-100',
                  glow: 'glow-purple',
                  border: isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200/50',
                  bar: 'bg-indigo-500'
                };
              case 'muse':
                return {
                  gradient: 'from-[#14b8a6]/10 to-[#2dd4bf]/5',
                  accent: 'text-teal-600',
                  badge: 'bg-teal-50 text-teal-600 border border-teal-100',
                  glow: 'glow-blue',
                  border: isSelected ? 'border-teal-500 ring-2 ring-teal-200' : 'border-slate-200/50',
                  bar: 'bg-teal-500'
                };
              case 'resource':
              default:
                return {
                  gradient: 'from-orange-500/10 to-amber-500/5',
                  accent: 'text-orange-600',
                  badge: 'bg-orange-50 text-orange-600 border border-orange-100',
                  glow: 'glow-orange',
                  border: isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-slate-200/50',
                  bar: 'bg-orange-500'
                };
            }
          };

          const ui = getThemeAttributes();

          // Liquid organic blob breath animation choice
          const animateClass = node.id === 'project-a' 
            ? 'blob-animate-1' 
            : node.id === 'project-b'
              ? 'blob-animate-2'
              : node.id === 'todo-list'
                ? 'blob-animate-3'
                : 'rounded-2xl';

          return (
            <div 
              key={node.id}
              className={`absolute cursor-grab active:cursor-grabbing transition-all duration-300 ease-out ${
                isFilteredOut 
                  ? 'opacity-25 pointer-events-none saturate-50 scale-95' 
                  : 'hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-10px_rgba(99,102,241,0.22)] hover:scale-[1.02]'
              }`}
              style={{
                left: node.x,
                top: node.y,
                width: `${dim.width}px`,
                height: `${dim.height}px`,
                zIndex: isSelected ? 49 : 10
              }}
              onMouseDown={(e) => !isFilteredOut && handleNodeMouseDown(e, node)}
              onMouseEnter={() => !isFilteredOut && setHoveredNodeId(node.id)}
              onMouseLeave={() => !isFilteredOut && setHoveredNodeId(null)}
            >
              {/* Type-Specific Artistic Visual Layouts */}
              {node.type === 'project' && (
                <div className={`w-full h-full rounded-[24px] bg-slate-900/90 border-2 backdrop-blur-md p-4 flex flex-col justify-between select-none relative transition-all duration-300 ${isSelected ? 'shadow-[0_0_15px_rgba(99,102,241,0.3)] border-indigo-500' : 'border-slate-800'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Project
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${node.syncStatus === 'synced' ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-slate-500'}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => handleToggleStar(node.id, e)} className="p-0.5 hover:bg-slate-800 rounded">
                        <Star className={`w-3.5 h-3.5 ${node.star ? 'fill-yellow-400 text-yellow-500' : 'text-slate-500'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="min-w-0 pr-10">
                    <h3 className="text-[12.5px] font-black text-white leading-snug truncate tracking-tight">
                      {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).title}
                    </h3>
                    <p className="text-[9.5px] font-semibold text-slate-400 mt-0.5 truncate">
                      {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).description}
                    </p>
                  </div>

                  {/* Radial Ring completion indicator inside project card */}
                  <div className="absolute right-4 top-[45%] -translate-y-[45%] flex flex-col items-center gap-1">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" fill="transparent" />
                        <circle cx="16" cy="16" r="13" stroke="#818cf8" strokeWidth="2.5" fill="transparent" 
                                strokeDasharray={`${2 * Math.PI * 13}`} 
                                strokeDashoffset={`${2 * Math.PI * 13 * (1 - node.progress / 100)}`} 
                                strokeLinecap="round" className="transition-all duration-500" />
                      </svg>
                      <span className="absolute text-[8px] font-mono font-black text-indigo-300">{node.progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${node.progress}%` }} />
                      </div>
                      <span className="text-[8.5px] font-mono font-bold text-indigo-400">{node.progress}%</span>
                    </div>

                    <div className="flex items-center -space-x-1">
                      {node.members.slice(0, 3).map((member, i) => (
                        <img 
                          key={i} 
                          src={AVATARS[i % AVATARS.length]} 
                          alt={member} 
                          className="w-[16px] h-[16px] rounded-full object-cover border border-slate-900" 
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {node.type === 'todo' && (
                <div className={`w-full h-full rounded-[16px] bg-white border p-3.5 flex flex-col justify-between select-none relative transition-all duration-300 ${isSelected ? 'shadow-lg border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/90 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                        LEDGER
                      </span>
                    </div>
                    <button onClick={(e) => handleToggleStar(node.id, e)} className="p-0.5 hover:bg-slate-100 rounded">
                      <Star className={`w-3.5 h-3.5 ${node.star ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300'}`} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-800 tracking-tight leading-none truncate">
                      {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).title}
                    </h3>
                    
                    {/* Embedded checklist snippet inside the card */}
                    <div className="space-y-1 my-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg">
                      {node.checklist.slice(0, 1).map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5 text-[8.5px] text-slate-600 truncate leading-tight">
                          <span className={`w-2 h-2 rounded-full border shrink-0 ${item.done ? 'bg-emerald-500 border-emerald-550' : 'bg-white border-slate-300'}`} />
                          <span className={`truncate ${item.done ? 'line-through text-slate-400 font-normal' : 'font-extrabold text-slate-700'}`}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Linear segmented ledger style progress indicator */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5 h-1.5 flex-1 bg-slate-100 rounded overflow-hidden">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const fillRatio = (i + 1) / 6;
                        const active = node.progress / 100 >= fillRatio;
                        return (
                          <div key={i} className={`h-full flex-1 transition-all ${active ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        );
                      })}
                    </div>
                    <span className="text-[9px] font-mono font-black text-slate-500">{node.progress}%</span>
                  </div>
                </div>
              )}

              {node.type === 'agent' && (
                <div className={`w-full h-full rounded-2xl bg-[#0b0813] border p-3.5 flex flex-col justify-between font-mono select-none relative transition-all duration-300 ${isSelected ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] bg-[#110c1f]' : 'border-purple-950/60 shadow-inner'}`}>
                  <div className="flex items-center justify-between text-[8px] text-purple-400">
                    <div className="flex items-center gap-1 text-[8.5px] font-black">
                      <Cpu className="w-3 h-3 text-purple-500 animate-pulse" />
                      <span className="tracking-wide">AI CORE</span>
                    </div>
                    <span className="text-emerald-400 font-extrabold animate-pulse">● LIVE</span>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-purple-100 leading-tight truncate">
                      {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).title}
                    </h3>
                    <div className="font-mono text-[7.5px] bg-[#120e20] border border-purple-950/45 p-1 rounded-md text-slate-400/90 leading-tight select-none mt-1 truncate">
                      LOG // Core index syncing...
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] border-t border-purple-950/60 pt-1.5">
                    <span className="text-purple-500 tracking-wider">COMPILING:</span>
                    <span className="text-purple-300 font-bold bg-purple-950 px-1 py-0.5 rounded text-[7.5px]">{node.progress}%</span>
                  </div>
                </div>
              )}

              {node.type === 'muse' && (
                <div className={`w-full h-full rounded-tr-[36px] rounded-bl-[36px] rounded-tl-[12px] rounded-br-[12px] bg-gradient-to-tr from-pink-50/95 via-indigo-50/40 to-amber-50/90 border p-4 flex flex-col justify-between select-none relative transition-all duration-300 ${isSelected ? 'shadow-[0_10px_25px_-5px_rgba(236,72,153,0.15)] border-pink-300 ring-1 ring-pink-300/40' : 'border-pink-100/80 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: '8s' }} />
                      <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-pink-600/90 font-mono">MUSE</span>
                    </div>
                    <button onClick={(e) => handleToggleStar(node.id, e)} className="p-0.5 hover:bg-white/40 rounded">
                      <Star className={`w-3.5 h-3.5 ${node.star ? 'fill-yellow-400 text-yellow-500' : 'text-pink-300'}`} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-[13px] font-serif italic font-black text-indigo-950 leading-tight truncate">
                      {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).title}
                    </h3>
                    <p className="text-[9.5px] font-semibold text-slate-500 mt-0.5 truncate italic">
                      {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[8px] font-mono text-pink-500/80 border-t border-pink-100/80 pt-2">
                    <span className="font-extrabold tracking-tight">IDEATION ACTIVE</span>
                    <span className="font-black">LVL {Math.round(node.progress / 10)}</span>
                  </div>
                </div>
              )}

              {node.type === 'resource' && (
                <div className={`w-full h-full bg-[#fcfaf2] border p-3.5 flex flex-col justify-between select-none relative transition-all duration-300 rounded-r-2xl rounded-bl-2xl ${isSelected ? 'shadow-lg border-amber-600 ring-1 ring-amber-600/20' : 'border-amber-900/10 shadow-sm'}`}>
                  <div className="absolute -top-[16px] left-3 bg-[#fcfaf2] border-t border-x border-amber-900/10 px-2 py-0.5 rounded-t-md text-[7px] font-mono font-extrabold uppercase text-amber-800 flex items-center gap-1 select-none">
                    <BookOpen className="w-2.5 h-2.5 text-amber-700" />
                    <span>Resource Bundle</span>
                  </div>

                  <div className="flex justify-between items-start pt-1.5">
                    <div className="min-w-0">
                      <h3 className="text-xs font-black text-slate-800 tracking-tight leading-snug truncate">
                        {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).title}
                      </h3>
                      <p className="text-[9px] font-semibold text-[#8b5a2b]/70 mt-0.5 truncate">
                        {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-amber-900/5 pt-2">
                    <span className="text-[8px] font-mono font-black text-amber-800 bg-amber-100/55 border border-amber-200/40 px-1.5 py-0.5 rounded">
                      Finalized Asset
                    </span>
                    <span className="text-[8.5px] font-mono font-black text-slate-400">100% COMPLETE</span>
                  </div>
                </div>
              )}

              {/* Trash/Delete Action on Hover */}
              {isHovered && activeTool === 'select' && (
                <div className="absolute top-1.5 right-1.5 flex gap-1 z-30">
                  <button 
                    onClick={(e) => handleDeleteNode(node.id, e)}
                    className="p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 transition-all shadow"
                    title="Delete node from grid"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* ACTIVE CHECKLIST MODAL/POPUP OVERLAY - Specifically designed on the Todo List node */}
              {node.id === focusedTodoNodeId && node.checklist.length > 0 && (
                <div 
                  className="absolute shadow-2xl p-3 bg-white rounded-2xl border border-slate-100 z-50 animate-in slide-in-from-top-3 duration-200"
                  style={{
                    left: '10px',
                    top: `${dim.height + 8}px`,
                    width: '240px'
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {node.title} checklist
                      </span>
                      <button 
                        onClick={() => setFocusedTodoNodeId(null)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-400 hover:text-slate-600"
                      >
                        Hide
                      </button>
                    </div>

                    {/* List content */}
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {node.checklist.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleToggleChecklist(node.id, item.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                            item.done 
                              ? 'bg-slate-50/50 border-slate-100 text-slate-400' 
                              : 'bg-white border-slate-100 hover:border-indigo-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold ${
                              item.done 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'border-slate-300'
                            }`}>
                              {item.done && '✓'}
                            </span>
                            <span className={`text-xs font-semibold truncate ${item.done ? 'line-through' : ''}`}>
                              {item.text}
                            </span>
                          </div>
                          {item.dueDate && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              item.dueDate === '今天' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.dueDate}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Append list task */}
                    <form onSubmit={(e) => handleAddMapTaskSubmit(e, node.id)} className="mt-2.5 flex gap-1">
                      <input 
                        type="text" 
                        placeholder="+ 新建任务"
                        value={quickTaskText}
                        onChange={(e) => setQuickTaskText(e.target.value)}
                        className="flex-1 text-xs px-2.5 py-1.5 bg-[#f8fafc] border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold"
                      />
                      <button type="submit" className="px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">+</button>
                    </form>
                  </div>
                )}

                {/* Hidden Checklist Toggle Button */}
                {!isSelected && node.id === 'todo-list' && !focusedTodoNodeId && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFocusedTodoNodeId(node.id); }}
                    className="absolute bottom-[-14px] left-[50%] -translate-x-[50%] text-[9px] font-extrabold tracking-wider uppercase bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-30 whitespace-nowrap"
                  >
                    <span>Checklist</span>
                  </button>
                )}
            </div>
          );
        })}
      </div>
    </div>

      {/* Viewport Zoom bottom left controller matching screenshot precisely */}
      <div className="absolute bottom-6 left-6 flex items-center gap-1 px-1 bg-white border border-slate-200 shadow-xl rounded-2xl z-40">
        <button 
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="w-8 h-8 rounded-xl font-bold hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all text-sm"
        >
          －
        </button>
        <span className="text-xs font-bold text-slate-700 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
        <button 
          onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
          className="w-8 h-8 rounded-xl font-bold hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all text-sm"
        >
          ＋
        </button>
        <div className="w-px h-5 bg-slate-100 mx-0.5" />
        <button 
          onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
          className="w-8 h-8 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all"
          title="Reset Canvas View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Canvas Top Panel to manage line connections tool, boundaries configurations */}
      <div className="absolute top-4 left-6 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/50 p-1 rounded-2xl shadow-xl z-40">
        <button 
          onClick={() => { setActiveTool('select'); setConnectionSourceId(null); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === 'select' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Circle className="w-3.5 h-3.5" />
          <span>{tVal.selectMode}</span>
        </button>
        <button 
          onClick={() => setActiveTool('connection')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === 'connection' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
          }`}
          title="Click first node, then second node to draw link"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{tVal.linkMode}</span>
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-800"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{tVal.newNode}</span>
        </button>
        
        <div className="w-px h-5 bg-slate-200 mx-1" />
        
        <button 
          onClick={() => setHudActive(!hudActive)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            hudActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
          }`}
          title={language === 'en' ? "Toggle Swiss Layout HUD Scales" : "切换瑞士极简辅助坐标系"}
        >
          <Grid className={`w-3.5 h-3.5 ${hudActive ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>{language === 'en' ? "Blueprint HUD" : "蓝图 HUD"}</span>
        </button>
      </div>

      {/* Category Filter Deck & Lattice Optimizer physics controls */}
      <div className="absolute top-[68px] left-6 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-xl z-40 max-w-[calc(100vw-340px)] overflow-x-auto select-none">
        {/* Lattice Relax Sparkle Button */}
        <button
          onClick={() => runLatticeRelaxation(120)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isSimulating 
              ? 'bg-indigo-100 text-indigo-600 animate-pulse' 
              : 'text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50'
          }`}
          title={language === 'en' ? "Simulate self-organizing organic node arrangement" : "一键激发智能晶格避障自适应排列"}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{language === 'en' ? "Lattice Relax" : "晶格整理"}</span>
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Local type filters */}
        {(['all', 'project', 'todo', 'agent', 'muse', 'resource'] as const).map((filterOpt) => (
          <button
            key={filterOpt}
            onClick={() => setNodeFilter(filterOpt)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              nodeFilter === filterOpt
                ? 'bg-black text-white'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/40'
            }`}
          >
            {getFilterLabel(filterOpt)}
          </button>
        ))}
      </div>

      {/* Right Corner: Quick Hearth Ecosystem information Box */}
      <div className="absolute top-4 right-6 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow p-3 z-40 max-w-[280px]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>{tVal.sandboxHeader}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
          {tVal.sandboxDesc}
        </p>
      </div>

      {/* Add node modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white border rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-slate-800">{tVal.newComponentHeader}</h3>
            </div>

            <form onSubmit={handleCreateNodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{tVal.componentTitleLabel}</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Marketing Campaign"
                  className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{tVal.componentTypeLabel}</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                >
                  <option value="todo">{tVal.todo} (todo)</option>
                  <option value="project">{tVal.project} (project)</option>
                  <option value="agent">{tVal.agent} (agent)</option>
                  <option value="muse">{tVal.muse} (muse)</option>
                  <option value="resource">{tVal.resource} (resource)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">{tVal.componentDescLabel}</label>
                <textarea 
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short description summarizing function..."
                  className="w-full text-xs p-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  {tVal.cancel}
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                >
                  {tVal.sproutBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hudActive && (
        <div className="absolute inset-0 pointer-events-none z-30 select-none">
          {/* Top Ruler scale */}
          <div className="absolute top-0 inset-x-0 h-4 bg-white/50 border-b border-slate-200/50 flex text-[8px] font-mono font-bold text-slate-400 items-center justify-between px-10 transition-all">
            <span>[0px]</span>
            <span className="hidden sm:inline">[200px]</span>
            <span>[400px]</span>
            <span className="hidden sm:inline">[600px]</span>
            <span>[800px]</span>
            <span className="hidden sm:inline">[1000px]</span>
            <span>[1200px]</span>
            <span className="hidden sm:inline">[1400px]</span>
          </div>

          {/* Left Ruler scale */}
          <div className="absolute left-0 inset-y-0 w-4 bg-white/50 border-r border-slate-200/50 flex flex-col text-[8px] font-mono font-bold text-slate-400 items-center justify-between py-10 transition-all">
            <span>[0px]</span>
            <span>[100px]</span>
            <span>[200px]</span>
            <span>[300px]</span>
            <span>[400px]</span>
            <span>[500px]</span>
            <span>[600px]</span>
            <span>[700px]</span>
          </div>

          {/* Core Axis Lines Crosshair in center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
            <div className="w-full h-px bg-slate-900 absolute" />
            <div className="h-full w-px bg-slate-900 absolute" />
            <div className="absolute text-[10px] font-mono border p-1 translate-x-4 bg-white rounded">[CENTRIC POINT AXIS]</div>
          </div>

          {/* Technical drafting CAD metrics monitor block */}
          <div className="absolute right-6 bottom-6 bg-slate-900/95 text-white/95 border border-slate-800 rounded-2xl p-4 text-[10px] font-mono shadow-2xl space-y-2 transition-all z-40 max-w-[210px] pointer-events-auto">
            <div className="flex items-center gap-1 border-b border-slate-800 pb-1.5 font-bold tracking-wider text-slate-400 text-[9px] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Viewport Telemetry</span>
            </div>
            
            <div className="space-y-1 text-slate-300">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">ENGINE // RENDER</span>
                <span className="text-indigo-400 font-extrabold">SWISS SECURE // WEBGL</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">ACTIVE HANDS</span>
                <span className="text-emerald-400 font-extrabold">P2P_MESH_OK</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">PAN SHIFT VM</span>
                <span>{panOffset.x.toFixed(0)}, {panOffset.y.toFixed(0)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">ACTIVE SCALING</span>
                <span>{(zoom * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[8px] text-slate-500 font-semibold tracking-wider">
              <span>HEARTH COMPANION</span>
              <span>v1.0.4-PRE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline Close SVG Icon helper if not imported
function X(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
