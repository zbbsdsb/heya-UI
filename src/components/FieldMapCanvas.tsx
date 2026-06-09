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
  return { width: 220, height: 124 };
};

const getOrganicFluidPath = (x: number, y: number, w: number, h: number, id: string) => {
  const seed = id === 'opportunity' ? 1 : id === 'execution' ? 2 : id === 'core' ? 3 : id === 'future' ? 4 : 5;
  const o1 = Math.sin(seed * 11) * 14;
  const o2 = Math.cos(seed * 7) * 14;
  const o3 = Math.sin(seed * 3) * 16;
  const o4 = Math.cos(seed * 9) * 16;
  
  const pad = 36; // Dynamic bubble visual offset padding
  const x1 = x - pad;
  const y1 = y - pad;
  const x2 = x + w + pad;
  const y2 = y + h + pad;
  
  const midX = x1 + (x2 - x1) / 2;
  const midY = y1 + (y2 - y1) / 2;
  
  const cpTop = { x: midX + o1, y: y1 + o2 };
  const cpRight = { x: x2 + o3, y: midY + o4 };
  const cpBottom = { x: midX - o2, y: y2 - o1 };
  const cpLeft = { x: x1 - o4, y: midY - o3 };
  
  const cTL = { x: x1 - o4, y: y1 + o3 };
  const cTR = { x: x2 + o1, y: y1 - o2 };
  const cBR = { x: x2 - o3, y: y2 + o4 };
  const cBL = { x: x1 + o2, y: y2 - o1 };
  
  return `M ${cpLeft.x} ${cpLeft.y} 
          C ${cTL.x} ${cTL.y}, ${cTL.x + 35} ${cTL.y - 35}, ${cpTop.x} ${cpTop.y} 
          C ${cTR.x - 35} ${cTR.y - 35}, ${cTR.x} ${cTR.y}, ${cpRight.x} ${cpRight.y} 
          C ${cBR.x} ${cBR.y}, ${cBR.x - 35} ${cBR.y + 35}, ${cpBottom.x} ${cpBottom.y} 
          C ${cBL.x + 35} ${cBL.y + 35}, ${cBL.x} ${cBL.y}, ${cpLeft.x} ${cpLeft.y} Z`;
};

const compileAndEvaluateLogic = (nodeList: NodeData[]): { nodes: NodeData[]; cycles: string[] } => {
  // Defensive copy to prevent state contamination during resolution
  let currentNodes: NodeData[] = nodeList.map(n => ({
    ...n,
    logicalOperator: n.logicalOperator || (n.type === 'todo' ? 'OR' : n.type === 'resource' ? 'NOT' : n.type === 'project' ? 'AND' : 'INPUT'),
    logicalValue: n.logicalValue !== undefined ? n.logicalValue : false
  }));

  // Resolve incoming node linkages
  const getParents = (targetId: string, list: NodeData[]) => {
    return list.filter(n => n.connections && n.connections.includes(targetId));
  };

  let maxIterations = 30;
  let changed = true;
  let iteration = 0;
  let cyclesDetected: string[] = [];

  while (changed && iteration < maxIterations) {
    changed = false;
    iteration++;

    currentNodes = currentNodes.map(node => {
      if (node.logicalOperator === 'INPUT') {
        return node; // Input types preserve state, not computed
      }

      const incoming = getParents(node.id, currentNodes);
      
      let newValue = false;
      if (incoming.length === 0) {
        newValue = false; // Zero connections default evaluation is false
      } else {
        const inputVals = incoming.map(p => p.logicalValue || false);

        switch (node.logicalOperator) {
          case 'AND':
            newValue = inputVals.every(val => val === true);
            break;
          case 'OR':
            newValue = inputVals.some(val => val === true);
            break;
          case 'NOT':
            newValue = !inputVals[0];
            break;
          case 'XOR':
            const trueCount = inputVals.filter(v => v === true).length;
            newValue = trueCount % 2 === 1;
            break;
          default:
            newValue = false;
        }
      }

      if (node.logicalValue !== newValue) {
        changed = true;
        return { ...node, logicalValue: newValue };
      }
      return node;
    });
  }

  // Mark cycle dependencies fallback
  if (iteration >= maxIterations) {
    cyclesDetected = currentNodes.filter(n => {
      const incoming = getParents(n.id, currentNodes);
      return incoming.some(p => p.connections && p.connections.includes(n.id)) || incoming.some(p => p.id === n.id);
    }).map(n => n.id);
  }

  return { nodes: currentNodes, cycles: cyclesDetected };
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

  // --- DYNAMIC SIGNAL-PROPAGATION ROUTER (SPRouter) STATES ---
  const [activePackets, setActivePackets] = useState<{
    id: string;
    sourceId: string;
    targetId: string;
    progress: number;
    hopCount: number;
  }[]>([]);
  const [processingNodeIds, setProcessingNodeIds] = useState<Record<string, { active: boolean; timestamp: number }>>({});
  const [signalLogs, setSignalLogs] = useState<{ id: string; text: string; timestamp: string }[]>([]);
  
  // --- BOOLEAN LOGIC EVALUATOR DERIVED STATE AND OPERATORS ---
  const { nodes: evaluatedNodes, cycles: cyclesDetected } = React.useMemo(() => {
    return compileAndEvaluateLogic(nodes);
  }, [nodes]);

  const toggleInputNodeValue = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const currentVal = n.logicalValue || false;
        return {
          ...n,
          logicalValue: !currentVal,
          updatedAt: '2024/05/30'
        };
      }
      return n;
    }));

    // Trigger log entry to inform diagnostics
    const target = nodes.find(n => n.id === nodeId);
    const nodeName = target ? target.title : nodeId;
    const currentVal = target ? (target.logicalValue || false) : false;
    setSignalLogs(prev => [
      {
        id: `toggle-${Date.now()}`,
        text: `🔘 Toggled manual input 0x${nodeId.replace('node-', '').slice(0, 4).toUpperCase()} (${nodeName}) value to ${!currentVal ? 'TRUE' : 'FALSE'}.`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const setNodeLogicalOperator = (nodeId: string, op: 'AND' | 'OR' | 'NOT' | 'XOR' | 'INPUT') => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          logicalOperator: op,
          updatedAt: '2024/05/30'
        };
      }
      return n;
    }));

    // Trigger log entry to inform diagnostics
    const target = nodes.find(n => n.id === nodeId);
    const nodeName = target ? target.title : nodeId;
    setSignalLogs(prev => [
      {
        id: `op-${Date.now()}`,
        text: `⚙️ Re-configured operation on 0x${nodeId.replace('node-', '').slice(0, 4).toUpperCase()} (${nodeName}) to standard [ ${op.toUpperCase()} ] gate.`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  // Cubic Bezier interpolation mathematical solver
  const interpolateBezier = (
    x1: number, y1: number,
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x2: number, y2: number,
    t: number
  ) => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const rx = mt3 * x1 + 3 * mt2 * t * cx1 + 3 * mt * t2 * cx2 + t3 * x2;
    const ry = mt3 * y1 + 3 * mt2 * t * cy1 + 3 * mt * t2 * cy2 + t3 * y2;

    return { x: rx, y: ry };
  };

  // Triggered cascade processing flow
  const triggerTargetCascade = (targetId: string, hopCount: number) => {
    // 1. Mark node as processing
    setProcessingNodeIds(prev => ({
      ...prev,
      [targetId]: { active: true, timestamp: Date.now() }
    }));

    const targetNode = nodes.find(n => n.id === targetId);
    const nodeName = targetNode ? targetNode.title : `0x${targetId.slice(0, 4).toUpperCase()}`;
    const logTime = new Date().toLocaleTimeString();

    setSignalLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        text: `⚡ 0x${targetId.replace('node-', '').slice(0, 4).toUpperCase()} (${nodeName}) received signal. Processing payload...`,
        timestamp: logTime
      },
      ...prev
    ]);

    // 2. Latency delay simulation (1000ms duration)
    setTimeout(() => {
      // Deactivate processing
      setProcessingNodeIds(prev => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });

      // 3. Unfold cascading routing propagation
      const maxHops = 5;
      if (hopCount < maxHops && targetNode && targetNode.connections && targetNode.connections.length > 0) {
        const newPackets = targetNode.connections.map(nextId => ({
          id: `packet-${Date.now()}-${Math.random()}`,
          sourceId: targetId,
          targetId: nextId,
          progress: 0,
          hopCount: hopCount + 1
        }));

        setActivePackets(prev => [...prev, ...newPackets]);

        setSignalLogs(prev => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            text: `🛰️ 0x${targetId.replace('node-', '').slice(0, 4).toUpperCase()} completed. Propagated packets to ${targetNode.connections.length} target vectors.`,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      } else if (hopCount >= maxHops) {
        setSignalLogs(prev => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            text: `⚠️ Routing depth cap reached at 0x${targetId.replace('node-', '').slice(0, 4).toUpperCase()} to safeguard against loops.`,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      } else {
        setSignalLogs(prev => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            text: `✅ Signal cascade terminated at terminal vector node 0x${targetId.replace('node-', '').slice(0, 4).toUpperCase()}.`,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
      }
    }, 1000);
  };

  // Client manual initiation spark trigger
  const emitInitialSignal = (sourceId: string) => {
    const sourceNode = nodes.find(n => n.id === sourceId);
    if (!sourceNode) return;

    if (!sourceNode.connections || sourceNode.connections.length === 0) {
      alert(language === 'en' 
        ? "No outward connections registered on this node! Click 'Anchor Connect' to link nodes first." 
        : "该节点没有向外的拓扑连线！请在上方选中“建立拓扑关联”为它添加连线。"
      );
      return;
    }

    setSignalLogs(prev => [
      {
        id: `spark-${Date.now()}`,
        text: `💥 Sparked route handshake cascade from 0x${sourceId.replace('node-', '').slice(0, 4).toUpperCase()} (${sourceNode.title})`,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);

    const newPackets = sourceNode.connections.map(targetId => ({
      id: `packet-${Date.now()}-${Math.random()}`,
      sourceId,
      targetId,
      progress: 0,
      hopCount: 1
    }));

    setActivePackets(prev => [...prev, ...newPackets]);
  };

  // Smooth frame tracking updates for current packets
  useEffect(() => {
    if (activePackets.length === 0) return;

    let frameId: number;
    const updatePackets = () => {
      setActivePackets(prev => {
        const nextPackets: typeof prev = [];
        prev.forEach(p => {
          const nextProgress = p.progress + 0.015; // Animation speed modifier
          if (nextProgress >= 1) {
            triggerTargetCascade(p.targetId, p.hopCount);
          } else {
            nextPackets.push({
              ...p,
              progress: nextProgress
            });
          }
        });
        return nextPackets;
      });
      frameId = requestAnimationFrame(updatePackets);
    };

    frameId = requestAnimationFrame(updatePackets);
    return () => cancelAnimationFrame(frameId);
  }, [activePackets, nodes]);

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

  // Hearth Boundaries specification computed dynamically based on the coordinates of nodes belonging to each category
  const getDynamicBoundaries = () => {
    const defaultBoundaries = [
      { name: tVal.opportunityDomain, id: 'opportunity', color: 'border-purple-300 text-purple-600 bg-purple-500/[0.003]', x: 80, y: 150, width: 320, height: 260, nodeType: 'muse' },
      { name: tVal.executionDomain, id: 'execution', color: 'border-emerald-300 text-emerald-600 bg-emerald-500/[0.003]', x: 260, y: 460, width: 400, height: 250, nodeType: 'todo' },
      { name: tVal.coreTerritory, id: 'core', color: 'border-indigo-300 text-indigo-600 bg-indigo-500/[0.005]', x: 620, y: 340, width: 340, height: 240, nodeType: 'project' },
      { name: tVal.futureStation, id: 'future', color: 'border-teal-300 text-teal-600 bg-teal-500/[0.003]', x: 650, y: 120, width: 340, height: 210, nodeType: 'agent' },
      { name: tVal.designSystemAsset, id: 'assets', color: 'border-orange-300 text-orange-600 bg-orange-500/[0.003]', x: 740, y: 560, width: 220, height: 180, nodeType: 'resource' },
    ];

    return defaultBoundaries.map(b => {
      const associatedNodes = nodes.filter(n => n.type === b.nodeType);
      if (associatedNodes.length === 0) {
        return b; // Fallback to original layout
      }

      // Calculate bounding box containing all nodes of this type
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      associatedNodes.forEach(node => {
        const dim = getNodeDimensions(node.type);
        if (node.x < minX) minX = node.x;
        if (node.y < minY) minY = node.y;
        if (node.x + dim.width > maxX) maxX = node.x + dim.width;
        if (node.y + dim.height > maxY) maxY = node.y + dim.height;
      });

      // Add generous visual padding around the group
      const padding = 42;
      const x = minX - padding;
      const y = minY - padding;
      const width = (maxX - minX) + padding * 2;
      const height = (maxY - minY) + padding * 2;

      return {
        ...b,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height)
      };
    });
  };

  const boundaries = getDynamicBoundaries();

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

          {/* Animated Fluidic Boundaries */}
          {boundaries.map((b) => {
            const pathD = getOrganicFluidPath(b.x, b.y, b.width, b.height, b.id);
            
            let fillCol = 'rgba(99, 102, 241, 0.015)';
            let strokeCol = 'rgba(99, 102, 241, 0.45)';
            
            if (b.id === 'opportunity') {
              fillCol = 'rgba(168, 85, 247, 0.015)';
              strokeCol = 'rgba(168, 85, 247, 0.45)';
            } else if (b.id === 'execution') {
              fillCol = 'rgba(16, 185, 129, 0.012)';
              strokeCol = 'rgba(16, 185, 129, 0.45)';
            } else if (b.id === 'core') {
              fillCol = 'rgba(99, 102, 241, 0.018)';
              strokeCol = 'rgba(99, 102, 241, 0.48)';
            } else if (b.id === 'future') {
              fillCol = 'rgba(20, 184, 166, 0.015)';
              strokeCol = 'rgba(20, 184, 166, 0.45)';
            } else if (b.id === 'assets') {
              fillCol = 'rgba(245, 158, 11, 0.015)';
              strokeCol = 'rgba(245, 158, 11, 0.42)';
            }

            return (
              <g key={`fluid-boundary-${b.id}`} className="transition-all duration-500">
                {/* Glowing breathing backdrop */}
                <path
                  d={pathD}
                  fill={fillCol}
                  stroke={strokeCol}
                  strokeWidth={3}
                  strokeDasharray="6, 8"
                  className="animate-pulse animate-duration-10000"
                  style={{ transformOrigin: 'center' }}
                />
                
                {/* Fluid outline border */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeCol}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* SVG Bezier wires connecting everything precisely */}
          {evaluatedNodes.map(node => {
            return node.connections?.map(targetId => {
              const target = evaluatedNodes.find(n => n.id === targetId);
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

              // Boolean Logical styling vectors
              const carriesTrueSignal = node.logicalValue === true;
              const inCycle = cyclesDetected.includes(node.id) || cyclesDetected.includes(target.id);

              let backdropStroke = 'rgba(226, 232, 240, 0.65)';
              let lineStroke = '#cbd5e1';
              let dotColor = '#94a3b8';
              let dotGlow = 'rgba(148, 163, 184, 0.5)';
              let isDashed = false;

              if (inCycle) {
                backdropStroke = 'rgba(249, 115, 22, 0.25)';
                lineStroke = '#f97316';
                dotColor = '#f97316';
                dotGlow = 'rgba(249, 115, 22, 0.7)';
                isDashed = true;
              } else if (carriesTrueSignal) {
                backdropStroke = isHighlighted ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.15)';
                lineStroke = '#10b981';
                dotColor = '#34d399';
                dotGlow = 'rgba(16, 185, 129, 0.8)';
              } else {
                backdropStroke = isHighlighted ? 'rgba(99, 102, 241, 0.35)' : 'rgba(226, 232, 240, 0.5)';
                lineStroke = isHighlighted ? '#6366f1' : '#94a3b8';
                dotColor = isHighlighted ? '#818cf8' : '#475569';
                dotGlow = isHighlighted ? 'rgba(99, 102, 241, 0.6)' : 'rgba(71, 85, 105, 0.4)';
              }

              return (
                <g key={`${node.id}-${targetId}`} className={`transition-opacity duration-300 ${isFilteredOut ? 'opacity-10' : 'opacity-100'}`}>
                  {/* Subtle blur backdrop wire */}
                  <path 
                    d={pathData}
                    fill="none" 
                    stroke={backdropStroke}
                    strokeWidth={isHighlighted ? 9 : 6} 
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Primary sharp wire */}
                  <path 
                    d={pathData}
                    fill="none" 
                    stroke={lineStroke}
                    strokeWidth={isHighlighted || carriesTrueSignal ? 2.5 : 1.5} 
                    strokeLinecap="round"
                    strokeDasharray={isDashed ? '4,4' : node.type === 'muse' || target.type === 'muse' ? '5,5' : 'none'}
                    className={`transition-all duration-300 ${carriesTrueSignal && !inCycle ? 'animate-pulse' : ''}`}
                  />
                  {/* Glowing flowing energy dot along the wire */}
                  <circle r={carriesTrueSignal ? "4.5" : isHighlighted ? "4" : "3"} fill={dotColor} style={{ filter: `drop-shadow(0 0 4px ${dotGlow})` }}>
                    <animateMotion dur={carriesTrueSignal ? "2s" : isHighlighted ? "2.5s" : "5.5s"} repeatCount="indefinite" path={pathData} />
                  </circle>
                  
                  {/* Dynamic logical true/false signal indicator bubble on active interaction wires */}
                  {isHighlighted && !inCycle && (
                    <g className="animate-fade-in">
                      <rect
                        x={(cx1 + cx2) / 2 - 10}
                        y={(cy1 + cy2) / 2 - 22}
                        width={20}
                        height={11}
                        rx={3}
                        fill={carriesTrueSignal ? '#10b981' : '#64748b'}
                        className="opacity-90 shadow-sm"
                      />
                      <text
                        x={(cx1 + cx2) / 2}
                        y={(cy1 + cy2) / 2 - 14}
                        fill="white"
                        fontSize="6.5px"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {carriesTrueSignal ? '1' : '0'}
                      </text>
                    </g>
                  )}
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

          {/* Real-time flowing packets (SPRouter) */}
          {activePackets.map(p => {
            const srcNode = nodes.find(n => n.id === p.sourceId);
            const tgtNode = nodes.find(n => n.id === p.targetId);
            if (!srcNode || !tgtNode) return null;

            const dimSrc = getNodeDimensions(srcNode.type);
            const dimTgt = getNodeDimensions(tgtNode.type);

            const x1 = srcNode.x + dimSrc.width / 2;
            const y1 = srcNode.y + dimSrc.height / 2;
            const x2 = tgtNode.x + dimTgt.width / 2;
            const y2 = tgtNode.y + dimTgt.height / 2;

            const cx1 = x1 + (x2 - x1) * 0.45;
            const cy1 = y1;
            const cx2 = x1 + (x2 - x1) * 0.55;
            const cy2 = y2;

            // Compute current point along Cubic Bezier path
            const pos = interpolateBezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2, p.progress);

            return (
              <g key={`sprouter-pkg-${p.id}`} className="filter drop-shadow-[0_0_8px_rgba(34,197,94,0.85)]">
                {/* Visual ripple */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={1.5}
                  className="animate-ping"
                  style={{ animationDuration: '1.2s' }}
                />
                
                {/* Interactive particle bull */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={4.5}
                  fill="#4ade80"
                  stroke="#15803d"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Domain labels styled like technical heads-up-display markers */}
        {boundaries.map((b) => {
          let badgeCol = 'bg-indigo-50/90 border-indigo-100/80 text-indigo-700';
          if (b.id === 'opportunity') badgeCol = 'bg-purple-50/90 border-purple-100/80 text-purple-700';
          else if (b.id === 'execution') badgeCol = 'bg-emerald-50/90 border-emerald-100/80 text-emerald-700';
          else if (b.id === 'future') badgeCol = 'bg-teal-50/90 border-teal-100/80 text-teal-700';
          else if (b.id === 'assets') badgeCol = 'bg-amber-50/90 border-amber-100/80 text-amber-700';

          return (
            <div 
              key={`domain-label-${b.id}`}
              className="absolute pointer-events-none transition-all duration-500 ease-out"
              style={{
                left: `${b.x + 16}px`,
                top: `${b.y - 14}px`,
                zIndex: 15
              }}
            >
              <div className={`flex items-center gap-1.5 font-mono tracking-widest text-[8.5px] uppercase px-2 py-0.5 rounded-md border shadow-sm backdrop-blur-sm pointer-events-auto hover:scale-105 transition-all select-none ${badgeCol}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span className="font-extrabold">{b.name}</span>
                <span className="opacity-40">|</span>
                <span className="opacity-70 font-bold">0x{b.id.toUpperCase().slice(0, 3)}</span>
              </div>
            </div>
          );
        })}

        {/* Floating Node elements layer - pointer events enabled */}
        <div className="absolute inset-0 pointer-events-auto animate-in fade-in duration-500">
          {evaluatedNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isFilteredOut = nodeFilter !== 'all' && node.type !== nodeFilter;
            const dim = getNodeDimensions(node.type);

          // Compute specific styling parameters based on node type
          const getThemeAttributes = () => {
            switch (node.type) {
              case 'project':
                return {
                  icon: <Layers className="w-3.5 h-3.5 text-indigo-500" />,
                  label: language === 'en' ? 'Project' : '项目域',
                  color: 'border-indigo-200/80 bg-white/95 text-indigo-650',
                  glow: 'shadow-[0_8px_30px_rgba(99,102,241,0.04)]',
                  accent: 'indigo'
                };
              case 'todo':
                return {
                  icon: <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />,
                  label: language === 'en' ? 'Execution' : '执行载荷',
                  color: 'border-emerald-200/80 bg-white/95 text-emerald-650',
                  glow: 'shadow-[0_8px_30px_rgba(16,185,129,0.04)]',
                  accent: 'emerald'
                };
              case 'agent':
                return {
                  icon: <Cpu className="w-3.5 h-3.5 text-purple-500" />,
                  label: language === 'en' ? 'Agent' : '代理域',
                  color: 'border-purple-200/80 bg-white/95 text-purple-650',
                  glow: 'shadow-[0_8px_30px_rgba(168,85,247,0.04)]',
                  accent: 'purple'
                };
              case 'muse':
                return {
                  icon: <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />,
                  label: language === 'en' ? 'Muse' : '灵感域',
                  color: 'border-pink-200/80 bg-white/95 text-pink-650',
                  glow: 'shadow-[0_8px_30px_rgba(236,72,153,0.04)]',
                  accent: 'pink'
                };
              case 'resource':
              default:
                return {
                  icon: <BookOpen className="w-3.5 h-3.5 text-amber-500" />,
                  label: language === 'en' ? 'Data Base' : '数据底座',
                  color: 'border-amber-200/80 bg-white/95 text-amber-650',
                  glow: 'shadow-[0_8px_30px_rgba(245,158,11,0.04)]',
                  accent: 'amber'
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
              {/* Unified Artistic Card Element */}
              <div className={`w-full h-full rounded-2xl bg-white/95 border backdrop-blur-md p-3.5 flex flex-col justify-between select-none relative transition-all duration-300 ${
                processingNodeIds[node.id]
                  ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/20 scale-[1.01]'
                  : isSelected 
                    ? `border-${ui.accent}-500 shadow-md ring-2 ring-${ui.accent}-500/10` 
                    : `border-slate-200/80 ${ui.glow}`
              }`}>
                {/* Upper line: Icon, Type Label and Status indication */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {ui.icon}
                    <span className="text-[9px] font-bold font-mono tracking-wider text-slate-500 uppercase truncate">
                      {ui.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Dynamic Zap Spark Emitter */}
                    <button
                      onClick={(e) => { e.stopPropagation(); emitInitialSignal(node.id); }}
                      className={`p-1 rounded border border-slate-100 transition-all ${
                        processingNodeIds[node.id]
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse'
                          : 'bg-indigo-50/50 hover:bg-indigo-100/85 text-indigo-500'
                      }`}
                      title={language === 'en' ? "Transmit Signal Pulse" : "向外发射脉冲信号"}
                    >
                      <Zap className="w-2.5 h-2.5 fill-current" />
                    </button>
                    <button 
                      onClick={(e) => handleToggleStar(node.id, e)}
                      className="p-0.5 hover:bg-slate-100 rounded text-slate-300 hover:text-yellow-500 transition-colors"
                    >
                      <Star className={`w-2.5 h-2.5 ${node.star ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                    </button>
                    <span 
                      className={`w-1.5 h-1.5 rounded-full ${
                        processingNodeIds[node.id] ? 'bg-emerald-400 shadow-[0_0_4px_#34d399] animate-ping' :
                        node.syncStatus === 'synced' ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 
                        node.syncStatus === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'
                      }`} 
                    />
                  </div>
                </div>
 
                {/* Title and description */}
                <div className="min-w-0 flex-1 my-1 flex flex-col justify-center">
                  <h3 className="text-[11px] font-black text-slate-800 leading-tight truncate tracking-tight">
                    {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).title}
                  </h3>
                  <p className="text-[9px] font-medium text-slate-400 truncate mt-0.5">
                    {getLocalizedNode(node.id, { title: node.title, description: node.description }, language).description}
                  </p>
                  
                  {/* Minimal Logical Control Engine bar */}
                  <div className="mt-1 flex items-center justify-between bg-slate-50/50 border border-slate-100 rounded-lg px-2 py-0.5 gap-1 text-[8px] font-mono pointer-events-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold uppercase select-none text-[6.5px]" title="Gate Selector">Logic:</span>
                      <select
                        value={node.logicalOperator || 'INPUT'}
                        onChange={(e) => {
                          e.stopPropagation();
                          setNodeLogicalOperator(node.id, e.target.value as any);
                        }}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent card dragging
                        className="bg-white border border-slate-200 text-slate-700 font-bold text-[8px] rounded px-1 py-0 outline-none cursor-pointer focus:border-indigo-400 transition-all font-mono"
                      >
                        <option value="INPUT">INPUT</option>
                        <option value="AND">AND (&amp;)</option>
                        <option value="OR">OR (|)</option>
                        <option value="NOT">NOT (!)</option>
                        <option value="XOR">XOR (^)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {(node.logicalOperator === 'INPUT' || !node.logicalOperator) ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleInputNodeValue(node.id);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className={`px-1.5 py-0.5 font-bold text-[8px] rounded transition-all border outline-none select-none max-h-[16px] flex items-center gap-1 cursor-pointer ${
                            node.logicalValue 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-250 font-black shadow-[0_1px_2px_rgba(16,185,129,0.12)]' 
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${node.logicalValue ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          {node.logicalValue ? 'True' : 'False'}
                        </button>
                      ) : (
                        <span className={`px-1.5 py-0.5 font-bold text-[7.5px] rounded border select-none max-h-[16px] flex items-center gap-1 ${
                          node.logicalValue 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                            : 'bg-slate-100/80 text-slate-400 border-slate-200/50'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${node.logicalValue ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                          {node.logicalValue ? 'True' : 'False'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
 
                {/* Footer section: Simplified, unified, and artistic. */}
                <div className="flex items-center justify-between border-t border-slate-105/80 pt-1.5 shrink-0">
                  <div className="flex items-center gap-1">
                    {processingNodeIds[node.id] ? (
                      <span className="text-[7.5px] font-mono text-emerald-500 font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                        0x{node.id.replace('node-', '').replace('node-offline-', '').replace('node-evolved-', '').slice(0, 4).toUpperCase()} // ACTIVE_CASCADE
                      </span>
                    ) : (
                      <span className="text-[7.5px] font-mono text-slate-400">
                        0x{node.id.replace('node-', '').replace('node-offline-', '').replace('node-evolved-', '').slice(0, 4).toUpperCase()} // SYS_COMP
                      </span>
                    )}
                  </div>
                  
                  {/* Members Avatars */}
                  <div className="flex items-center -space-x-1">
                    {node.members && node.members.slice(0, 2).map((member, i) => (
                      <img 
                        key={i}
                        src={AVATARS[i % AVATARS.length]}
                        alt={member}
                        className="w-[15px] h-[15px] rounded-full object-cover border border-white shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {node.members && node.members.length > 2 && (
                      <div className="w-[15px] h-[15px] bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-[6px] font-black text-slate-500">
                        +{node.members.length - 2}
                      </div>
                    )}
                  </div>
                </div>

                {/* Trash/Delete Action on Hover */}
                {isHovered && activeTool === 'select' && (
                  <div className="absolute top-1 right-1 flex gap-1 z-30">
                    <button 
                      onClick={(e) => handleDeleteNode(node.id, e)}
                      className="p-0.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-all shadow"
                      title="Prune node"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
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

          {/* SPRouter Real-time Packet Diagnostics panel */}
          <div className="absolute right-6 bottom-[180px] bg-slate-900/95 text-white/95 border border-slate-800 rounded-2xl p-4 text-[10px] font-mono shadow-2xl space-y-2.5 transition-all z-40 w-[240px] max-h-[190px] flex flex-col pointer-events-auto overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold tracking-wider text-slate-400 text-[9px] uppercase">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>SPRouter Diagnostics</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSignalLogs([]); }}
                className="text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded cursor-pointer pointer-events-auto"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[8px] leading-relaxed max-h-[140px] select-text pointer-events-auto">
              {signalLogs.length === 0 ? (
                <div className="text-slate-600 italic py-2 text-center select-none">
                  Line idle. Emit pulse from any node's Zap icon.
                </div>
              ) : (
                signalLogs.map(log => (
                  <div key={log.id} className="border-b border-slate-800/40 pb-1 last:border-0">
                    <div className="flex justify-between text-slate-500 text-[7px] mb-0.5 select-none">
                      <span>SYS_PROP_BUS</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-emerald-400 font-medium break-all">{log.text}</div>
                  </div>
                ))
              )}
            </div>
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
