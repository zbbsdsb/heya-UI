import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Cpu, 
  Send, 
  CheckSquare, 
  Square, 
  Code, 
  Terminal, 
  Users, 
  Layers, 
  Activity, 
  HardDrive, 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Save, 
  Lightbulb, 
  TrendingUp, 
  MessageSquare,
  FileText,
  Clock,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NodeData, ChecklistItem, NodeType } from '../types';

interface ProjectSpaceProps {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  language?: 'en' | 'zh';
}

interface ExtendedDialogueMessage {
  id: string;
  sender: 'user' | 'hey';
  text: string;
  timestamp: string;
  codeBlock?: string;
  isRecommendation?: boolean;
}

export interface SubComponentNode {
  id: string;
  label: string;
  type: 'ui' | 'gate' | 'db' | 'agent';
  x: number;
  y: number;
  status: 'synced' | 'warning' | 'pending';
  connections: string[]; // Target sub-node IDs
  description?: string;
}

export default function ProjectSpace({ 
  nodes, 
  setNodes, 
  language = 'en' 
}: ProjectSpaceProps) {
  const isEn = language === 'en';
  
  // Active Project Selection
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    // Default to 'project-a' if it exists, otherwise first project
    const defaultProj = nodes.find(n => n.type === 'project');
    return defaultProj ? defaultProj.id : null;
  });

  // Local state for selected project's AI companion dialogue
  const [chatInputs, setChatInputs] = useState<Record<string, string>>({});
  const [projectChats, setProjectChats] = useState<Record<string, ExtendedDialogueMessage[]>>({
    'project-a': [
      {
        id: 'pa-d1',
        sender: 'hey',
        text: isEn 
          ? "Hey there, ceaserzhao! I'm analyzing the Oasis Company integration points for Project A. Our current checklist shows system architecture is defined, and our styling norms are locked. However, the Oasis boundary handshake remains unverified. How would you like us to approach the client-side proxy today?"
          : "你好 ceaserzhao！我正在深度解析 Project A 关于 Oasis 公司的对接端点。我们的任务看板显示，系统架构已经定义明确，但 Oasis 的安全握手机制尚未对齐。你希望我们今天如何架构其 P2P 连接代理组件？",
        timestamp: '15:10'
      }
    ],
    'project-b': [
      {
        id: 'pb-d1',
        sender: 'hey',
        text: isEn
          ? "Zurich connection protocol initialized. Project B requires strict compliance with high-load Oermos WebRTC handshake rules. I have detected potential synchronization bottlenecks if we exceed 256 peer pools. Shall we audit the transport buffering now?"
          : "Zurich 传输协议已成功初始化。Project B 核心聚焦于 Oermos WebRTC 去中心化通讯。目前检测到当并发节点数突破 256 以上时，本地缓冲队列可能出现包丢失。我们现在审计高载荷握手流吗？",
        timestamp: '15:12'
      }
    ]
  });

  // Feed logs generator specific to each project
  const [telemetryFeeds, setTelemetryFeeds] = useState<Record<string, string[]>>({
    'project-a': [
      "● [14:10] Oermos local broadcast active",
      "◆ [14:15] Loaded layout config from local sandbox",
      "✓ [14:32] Synced ADR-007 compliant schema metadata",
      "⚡ [15:01] Compiled Swiss grid typography templates",
      "● [15:08] Ping latency: 12ms to nearest Oasis container"
    ],
    'project-b': [
      "● [13:02] Zurich Gateway heartbeat established",
      "⚡ [13:40] P2P signaling buffer initialized (0ms latency)",
      "✓ [14:15] WebRTC handshaking pool verified: 48 active peers",
      "◆ [15:02] Cryptographic secure envelope signed via ECDSA",
      "▲ [15:08] Warning: Local disk buffer threshold crossed 75%"
    ]
  });

  // Is companion thinking
  const [isHeyThinking, setIsHeyThinking] = useState(false);

  // New checklist item input
  const [newTaskText, setNewTaskText] = useState('');

  // New tag input
  const [newTagText, setNewTagText] = useState('');

  // Selected project object
  const activeProject = nodes.find(n => n.id === selectedProjectId);

  // Auto-calculated checklist stats
  const calculateProgress = (items: ChecklistItem[]) => {
    if (!items || items.length === 0) return 100;
    const doneCount = items.filter(i => i.done).length;
    return Math.round((doneCount / items.length) * 100);
  };

  // Tab panels within the Left Column: checklist/notebook or subfield component map
  const [activePanelTab, setActivePanelTab] = useState<'notebook' | 'subfield'>('subfield');

  // Subfield component maps for each project
  const [subFieldMaps, setSubFieldMaps] = useState<Record<string, SubComponentNode[]>>(() => {
    const saved = localStorage.getItem('hearth_subfields');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_subfields', e);
      }
    }
    return {
      'project-a': [
        {
          id: 'sa-1',
          label: 'Grid Micro-UX',
          type: 'ui',
          x: 40,
          y: 40,
          status: 'synced',
          connections: ['sa-2'],
          description: 'Swiss-styled typography frame renderer.'
        },
        {
          id: 'sa-2',
          label: 'Oasis TLS Port',
          type: 'gate',
          x: 260,
          y: 60,
          status: 'synced',
          connections: ['sa-4'],
          description: 'Secures inbound connections from Oasis container network.'
        },
        {
          id: 'sa-3',
          label: 'IndexedDB Vault',
          type: 'db',
          x: 60,
          y: 190,
          status: 'synced',
          connections: ['sa-1'],
          description: 'High-security client-side decentralized database sandbox.'
        },
        {
          id: 'sa-4',
          label: 'ECDSA Validator',
          type: 'agent',
          x: 280,
          y: 190,
          status: 'synced',
          connections: [],
          description: 'Asymmetric cryptographic validator matching ADR-007 specifications.'
        }
      ],
      'project-b': [
        {
          id: 'sb-1',
          label: 'WebRTC P2P Channel',
          type: 'gate',
          x: 50,
          y: 60,
          status: 'synced',
          connections: ['sb-2'],
          description: 'Autonomic peer-to-peer data tunnel with UDP fallback.'
        },
        {
          id: 'sb-2',
          label: 'Sliding Handshake Window',
          type: 'db',
          x: 270,
          y: 60,
          status: 'synced',
          connections: ['sb-4'],
          description: 'Secures Oermis transport flow buffer up to 256 parallel peers.'
        },
        {
          id: 'sb-3',
          label: 'Zurich Seed Node',
          type: 'gate',
          x: 60,
          y: 200,
          status: 'synced',
          connections: ['sb-2'],
          description: 'Fallback signaling connector for zero-configuration lookup.'
        },
        {
          id: 'sb-4',
          label: 'Peer Observer Agent',
          type: 'agent',
          x: 280,
          y: 200,
          status: 'warning',
          connections: [],
          description: 'Auto-monitors dropouts or custody spikes across Oermos network.'
        }
      ]
    };
  });

  // Local Storage synchronizer for subfield models
  useEffect(() => {
    localStorage.setItem('hearth_subfields', JSON.stringify(subFieldMaps));
  }, [subFieldMaps]);

  // Subfield map interactive states
  const [selectedSubNodeId, setSelectedSubNodeId] = useState<string | null>(null);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [draggingNodeState, setDraggingNodeState] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Spawner form states
  const [newSubNodeName, setNewSubNodeName] = useState('');
  const [newSubNodeType, setNewSubNodeType] = useState<'ui' | 'gate' | 'db' | 'agent'>('ui');
  const [newSubNodeDesc, setNewSubNodeDesc] = useState('');

  // Switch project
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setNewTaskText('');
    setNewTagText('');
    setSelectedSubNodeId(null);
    setConnectingSourceId(null);
  };

  // Toggle checklist task
  const handleToggleTask = (projectId: string, taskId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        const updatedChecklist = node.checklist.map(item => 
          item.id === taskId ? { ...item, done: !item.done } : item
        );
        const updatedProgress = calculateProgress(updatedChecklist);
        return {
          ...node,
          checklist: updatedChecklist,
          progress: updatedProgress,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));
  };

  // Add new task to project checklist
  const handleAddTask = (projectId: string) => {
    if (!newTaskText.trim()) return;
    
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        const newTask: ChecklistItem = {
          id: `task-${Date.now()}`,
          text: newTaskText.trim(),
          done: false
        };
        const updatedChecklist = [...node.checklist, newTask];
        const updatedProgress = calculateProgress(updatedChecklist);
        return {
          ...node,
          checklist: updatedChecklist,
          progress: updatedProgress,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));
    setNewTaskText('');
  };

  // Remove task from project checklist
  const handleRemoveTask = (projectId: string, taskId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        const updatedChecklist = node.checklist.filter(item => item.id !== taskId);
        const updatedProgress = calculateProgress(updatedChecklist);
        return {
          ...node,
          checklist: updatedChecklist,
          progress: updatedProgress,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));
  };

  // Add custom tag to project
  const handleAddTag = (projectId: string) => {
    if (!newTagText.trim()) return;
    
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        if (node.tags.includes(newTagText.trim())) return node;
        return {
          ...node,
          tags: [...node.tags, newTagText.trim()],
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));
    setNewTagText('');
  };

  // Remove tag from project
  const handleRemoveTag = (projectId: string, tagToRemove: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        return {
          ...node,
          tags: node.tags.filter(t => t !== tagToRemove),
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));
  };

  // Save notes handler
  const handleSaveNotes = (projectId: string, notesText: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        return {
          ...node,
          notes: notesText,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));
  };

  // Add new subcomponent to active project's map
  const handleAddSubComponent = (projectId: string) => {
    if (!newSubNodeName.trim()) return;
    const newId = `sub-${Date.now()}`;
    const newNode: SubComponentNode = {
      id: newId,
      label: newSubNodeName.trim(),
      type: newSubNodeType,
      x: Math.floor(Math.random() * 100) + 100,
      y: Math.floor(Math.random() * 80) + 100,
      status: 'pending',
      connections: [],
      description: newSubNodeDesc.trim() || 'Custom user-specified component endpoint.'
    };

    setSubFieldMaps(prev => {
      const currentList = prev[projectId] || [];
      return {
        ...prev,
        [projectId]: [...currentList, newNode]
      };
    });

    setNewSubNodeName('');
    setNewSubNodeDesc('');

    // Append log
    const logVal = isEn 
      ? `⚡ Spawned sub-component node "${newNode.label}" on Project Map.`
      : `⚡ 成功在项目图谱生成子组件节点「${newNode.label}」。`;
    setTelemetryFeeds(prev => ({
      ...prev,
      [projectId]: [logVal, ...(prev[projectId] || [])]
    }));
  };

  // Remove a subcomponent from the map
  const handleRemoveSubComponent = (projectId: string, subNodeId: string) => {
    setSubFieldMaps(prev => {
      const currentList = prev[projectId] || [];
      // Also filter out any inbound connections targeting this node
      return {
        ...prev,
        [projectId]: currentList
          .filter(n => n.id !== subNodeId)
          .map(n => ({
            ...n,
            connections: n.connections.filter(targetId => targetId !== subNodeId)
          }))
      };
    });

    if (selectedSubNodeId === subNodeId) setSelectedSubNodeId(null);
    if (connectingSourceId === subNodeId) setConnectingSourceId(null);

    const logVal = isEn
      ? `⚡ Pruned sub-component node "${subNodeId}" from Project Map.`
      : `⚡ 已将子组件节点「${subNodeId}」从项目底图中物理剥离。`;
    setTelemetryFeeds(prev => ({
      ...prev,
      [projectId]: [logVal, ...(prev[projectId] || [])]
    }));
  };

  // Connect or disconnect between two sub-components
  const handleToggleSubConnection = (projectId: string, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setSubFieldMaps(prev => {
      const currentList = prev[projectId] || [];
      return {
        ...prev,
        [projectId]: currentList.map(n => {
          if (n.id === sourceId) {
            const hasLink = n.connections.includes(targetId);
            return {
              ...n,
              connections: hasLink 
                ? n.connections.filter(id => id !== targetId)
                : [...n.connections, targetId]
            };
          }
          return n;
        })
      };
    });

    const currMap = subFieldMaps[projectId] || [];
    const srcNode = currMap.find(n => n.id === sourceId);
    const tgtNode = currMap.find(n => n.id === targetId);
    if (srcNode && tgtNode) {
      const isBinding = !srcNode.connections.includes(targetId);
      const logVal = isEn
        ? `⚡ ${isBinding ? 'Linked' : 'Severed'} P2P channel: "${srcNode.label}" ➔ "${tgtNode.label}".`
        : `⚡ ${isBinding ? '对接完成' : '切断连接'}：「${srcNode.label}」 ➔ 「${tgtNode.label}」。`;
      setTelemetryFeeds(prev => ({
        ...prev,
        [projectId]: [logVal, ...(prev[projectId] || [])]
      }));
    }
  };

  // Ask assistant 'Hey' regarding a specific component
  const handleAskHeyAboutComponent = (projectId: string, node: SubComponentNode) => {
    const promptText = isEn
      ? `Can you audit and write a production-ready template for the component "${node.label}"? It is a "${node.type}" component described as: ${node.description}`
      : `请帮我审计并为一个类型为「${node.type}」、功能描述为「${node.description}」的组件节点「${node.label}」编写一套生产级的 TypeScript 架构模板代码。`;

    setChatInputs(prev => ({
      ...prev,
      [projectId]: promptText
    }));

    // Scroll chat into focus if needed
    const dialogueIndicator = isEn ? "Cognitive Companion aligned to check Component " : "AI伴生心智已就绪，锁定组件：";
    setTelemetryFeeds(prev => ({
      ...prev,
      [projectId]: [`◆ [${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] ${dialogueIndicator}「${node.label}」`, ...(prev[projectId] || [])]
    }));
  };

  // Dragging event handlers for Sub-Field Blueprint Canvas
  const handleSubNodeMouseDown = (projectId: string, nodeId: string, e: React.MouseEvent) => {
    // Prevent default except on buttons/inputs
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    
    e.preventDefault();
    const currentList = subFieldMaps[projectId] || [];
    const node = currentList.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNodeState({
      id: nodeId,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y
    });
    setSelectedSubNodeId(nodeId);
  };

  const handleSubNodeMouseMove = (projectId: string, e: React.MouseEvent) => {
    if (!draggingNodeState) return;
    const dx = e.clientX - draggingNodeState.startX;
    const dy = e.clientY - draggingNodeState.startY;

    // Confine positions dynamically to canvas boundaries [5px to 450px, 5px to 250px]
    const nextX = Math.max(5, Math.min(450, draggingNodeState.origX + dx));
    const nextY = Math.max(5, Math.min(250, draggingNodeState.origY + dy));

    setSubFieldMaps(prev => {
      const currentList = prev[projectId] || [];
      return {
        ...prev,
        [projectId]: currentList.map(n => 
          n.id === draggingNodeState.id ? { ...n, x: nextX, y: nextY } : n
        )
      };
    });
  };

  const handleSubNodeMouseUpOrLeave = () => {
    setDraggingNodeState(null);
  };

  // Ask companion 'Hey' inside specific project page
  const handleSendHeyMessage = (projectId: string) => {
    const userInput = chatInputs[projectId] || '';
    if (!userInput.trim()) return;

    // Append user message
    const userMsg: ExtendedDialogueMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentChat = projectChats[projectId] || [];
    setProjectChats(prev => ({
      ...prev,
      [projectId]: [...currentChat, userMsg]
    }));

    // Clear input
    setChatInputs(prev => ({ ...prev, [projectId]: '' }));

    // Trigger companion reaction
    setIsHeyThinking(true);
    
    setTimeout(() => {
      const lower = userInput.toLowerCase();
      let replyText = '';
      let codeBlock = '';

      if (projectId === 'project-a') {
        if (lower.includes('oasis') || lower.includes('proxy') || lower.includes('接口') || lower.includes('代理')) {
          replyText = isEn 
            ? "I have generated an optimized low-latency Proxy Handler. It captures external handshakes, signs packets with ECDSA, and integrates directly with our Swiss Grid visualizers. The code below contains the precise interface contract."
            : "我已经为你生成了一个优化后的低延迟 Oasis 代理模块（Oasis Security Bridge）。该组件能够拦截外部 WebRTC 握手机制，用本地生成的 ECDSA 私钥对其进行加密签名。以下是对齐规范组件的实现代码：";
          codeBlock = `// Oasis Security Bridge Endpoint Implementation
import { createServer } from "vite";
import crypto from "crypto";

export class OasisBridgeProxy {
  private localKeypair: crypto.KeyPairSyncResult<string, string>;

  constructor() {
    this.localKeypair = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
  }

  public async authenticateInboundHandshake(payload: string, signatureHex: string): Promise<boolean> {
    const verify = crypto.createVerify('SHA256');
    verify.write(payload);
    verify.end();
    return verify.verify(this.localKeypair.publicKey, Buffer.from(signatureHex, 'hex'));
  }
}`;
        } else {
          replyText = isEn
            ? "I hear you. Given the current progress index of Project A (62%), defining structural parameters and keeping designs simple is our highest leverage task. Shall I suggest a clean Swiss interface schema?"
            : "我完全明白。基于 Project A 当前 62% 的总进发指标，首要任务是在保持架构极简的同时对齐高密度的版面规格。需要我针对 Project A 规划一套瑞士极简布局规范代码吗？";
          codeBlock = `/* Swiss High-Density Grid CSS Classes */
.swiss-grid-root {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.5rem;
  border: 1px solid #0f172a;
  padding: 2rem;
  font-family: 'JetBrains Mono', monospace;
}`;
        }
      } else if (projectId === 'project-b') {
        if (lower.includes('webrtc') || lower.includes('zurich') || lower.includes('p2p') || lower.includes('协议')) {
          replyText = isEn
            ? "Regarding Oermos WebRTC transport in Project B: I recommend using packet bundling and a circular sliding buffer setup to restrict peer congestion. Here's a custom ESM queue controller I just drafted:"
            : "关于 Project B 中的 Oermos 核心 P2P 去中心化连接：由于并发节点对等握手时容易瞬时堵塞，我极度建议在前端加入滑动窗口缓冲池。以下是我帮你实时撰写的 P2P 数据分包缓冲队列组件代码：";
          codeBlock = `// Oermos WebRTC High-Throughput Packet Congestion Buffer
export class WebRTCSlidingBuffer<T> {
  private queue: T[] = [];
  private readonly maxPoolCapacityCount: number = 256;

  constructor(maxSize?: number) {
    if (maxSize) this.maxPoolCapacityCount = maxSize;
  }

  public pushPacket(packet: T): void {
    if (this.queue.length >= this.maxPoolCapacityCount) {
      this.queue.shift(); // Evict oldest packet to preserve low memory footprints
    }
    this.queue.push(packet);
  }

  public getCurrentBufferSnapshot(): T[] {
    return [...this.queue];
  }
}`;
        } else {
          replyText = isEn
            ? "Project B is our cryptographic bedrock. I suggestion we enforce ECDSA local validation. Tell me, do you plan to store the connection state locally, or broadcast it peer-to-peer?"
            : "Project B 是我们的加密底模。我建议强制开启 ECDSA 本地校签信道。告诉我，你是倾向于将对端握手状态存储在本地 LocalStorage，还是进行去中心化的分布式 P2P 多播广播？";
        }
      } else {
        replyText = isEn
          ? `Analysis of ${activeProject?.title || 'this project'} complete. I highly recommend auditing active checklist tasks to push progress levels past the current ${activeProject?.progress || 0}% threshold.`
          : `针对 ${activeProject?.title || '此项目'} 的诊断分析已就绪。我强烈建议优先消灭当前的未完成待办事项，从而将目前的进展率推进至下一阶段。`;
      }

      // Add companion response
      const compMsg: ExtendedDialogueMessage = {
        id: `hey-${Date.now()}`,
        sender: 'hey',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeBlock: codeBlock || undefined
      };

      setProjectChats(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), compMsg]
      }));

      // Append log
      const newLog = `● [${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] AI Peer Companion suggested custom source optimization.`;
      setTelemetryFeeds(prev => ({
        ...prev,
        [projectId]: [newLog, ...(prev[projectId] || [])]
      }));

      setIsHeyThinking(false);
    }, 1500);
  };

  // Apply companion recommendation to raw project code sandbox
  const handleApplyRecCode = (projectId: string, code: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === projectId) {
        return {
          ...node,
          codeSnippet: code,
          updatedAt: new Date().toLocaleDateString()
        };
      }
      return node;
    }));

    // Alert or note success
    const successMsg = `● [${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] Applied custom code snapshot directly into Local File Workspace.`;
    setTelemetryFeeds(prev => ({
      ...prev,
      [projectId]: [successMsg, ...(prev[projectId] || [])]
    }));
  };

  // Push new manual log to telemetry stream
  const handleInjectTelemetryLog = (projectId: string) => {
    const logs = [
      `⚡ [${new Date().toLocaleTimeString()}] Dev initiated hot-refresh packet audit`,
      `✓ [${new Date().toLocaleTimeString()}] Local IndexedDB sector compiled & synced successfully`,
      `● [${new Date().toLocaleTimeString()}] WebRTC Channel handshake validated with 0ms latency bounds`,
      `▲ [${new Date().toLocaleTimeString()}] Re-verified asymmetric cryptography validation signature key`
    ];
    const chosenLog = logs[Math.floor(Math.random() * logs.length)];
    
    setTelemetryFeeds(prev => ({
      ...prev,
      [projectId]: [chosenLog, ...(prev[projectId] || [])]
    }));
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#fafbfe] dark:bg-transparent overflow-hidden">
      
      {/* LEFT PROJECT SELECTOR PANEL / MENU */}
      <div className="w-full md:w-[280px] bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase text-indigo-400 font-mono tracking-widest">
              {isEn ? "Sovereign Projects" : "独 占 项 目 空 间"}
            </h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-mono font-black px-2 py-0.5 rounded-full">
              {nodes.filter(n => n.type === 'project').length || 0}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
            {isEn 
              ? "Select a dedicated project subspace. Each is integrated with custom notes, tailored AI companions, and streaming feeds."
              : "点击进入独立主权空间。系统自动挂载伴生心智、任务流、沙盒代码及多通道源订阅。"}
          </p>
        </div>

        {/* Project Lists Container */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2">
          {nodes.filter(n => n.type === 'project').map((p) => {
            const isSelected = selectedProjectId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/20 shadow-sm'
                    : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                {/* Visual glow overlay on selection */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/10 rounded-full blur-sm pointer-events-none" />
                )}

                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                      {p.progress}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-3">
                  {p.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-50 text-slate-500 font-bold px-1.5 py-0.5 rounded-md border border-slate-100">
                      #{t}
                    </span>
                  ))}
                  {p.tags.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-bold px-1 py-0.5">
                      +{p.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick instruction notice */}
        <div className="p-4 border-t border-slate-150 bg-slate-50 text-[10px] font-mono text-slate-500 text-center select-none">
          <span>SECURE SECP256K1 AUTHENTICATED</span>
        </div>
      </div>

      {/* RIGHT DETAILED WORKSPACE (SPLITS INTO THREE HIGH-DENSITY COLUMNS) */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden justify-between">
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div 
              key={activeProject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col md:flex-row overflow-hidden h-full"
            >
              
              {/* IMMERSIVE SUB-VIEW 1: GENERAL CANVAS WORKSPACE (Left Side) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-slate-100 flex flex-col h-full">
                
                {/* 1. Page Header Section */}
                <div className="flex flex-col space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px] font-bold uppercase border border-slate-200">
                        {isEn ? "Independent Core Project" : "独立核心主权项目"}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase select-none">
                      {isEn ? "ADR-007 Sandbox Ready" : "ADR-007 沙盒验证通过"}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <span>{activeProject.title}</span>
                      <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/30">
                        {isEn ? 'Sovereign View' : '独立专页'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">
                      {activeProject.description}
                    </p>
                  </div>
                </div>

                {/* Visual Tab Selector for Sub-Field map or Notebook list */}
                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/40 select-none">
                  <button
                    onClick={() => setActivePanelTab('subfield')}
                    className={`flex-1 py-1.5 text-[10.5px] font-black uppercase font-mono tracking-wider transition-all rounded-lg flex items-center justify-center gap-1.5 ${
                      activePanelTab === 'subfield' 
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/20 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isEn ? "Component Sub-Field Map" : "组件图谱 (Sub-Field Map)"}</span>
                  </button>
                  <button
                    onClick={() => setActivePanelTab('notebook')}
                    className={`flex-1 py-1.5 text-[10.5px] font-black uppercase font-mono tracking-wider transition-all rounded-lg flex items-center justify-center gap-1.5 ${
                      activePanelTab === 'notebook' 
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/20 font-black'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isEn ? "Goals & Notebook" : "开发反思与指标树"}</span>
                  </button>
                </div>

                {activePanelTab === 'notebook' ? (
                  <div className="flex-1 flex flex-col space-y-6">
                    {/* 2. Checklist & Progress Sector */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 animate-pulse" />
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-sans">
                            {isEn ? "Dynamic Task Checklist" : "项 目 进 展 指 标 完 成 树"}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-black text-indigo-600">
                          {activeProject.progress}% {isEn ? "COMPLETED" : "完成率"}
                        </span>
                      </div>

                      {/* High Quality Tasks List */}
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {activeProject.checklist.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => handleToggleTask(activeProject.id, item.id)}
                            className={`flex items-center justify-between px-3.5 py-2 rounded-xl border cursor-pointer select-none transition-all duration-200 group ${
                              item.done 
                                ? 'bg-indigo-50/10 border-indigo-150 text-slate-450 line-through decoration-slate-350 bg-slate-50/40' 
                                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-705'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.done ? (
                                <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 shrink-0" />
                              )}
                              <span className="text-xs font-bold leading-relaxed">{item.text}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTask(activeProject.id, item.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {activeProject.checklist.length === 0 && (
                          <div className="text-center py-6 text-slate-400 font-semibold text-xs border border-dashed border-slate-200 rounded-xl bg-white">
                            {isEn ? "No active checklist parameters. Spawn one below." : "本空间尚无进行性指标。可在下方立即追加指标。"}
                          </div>
                        )}
                      </div>

                      {/* Add Checkitem trigger */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTask(activeProject.id)}
                          placeholder={isEn ? "Inject new project goal detail..." : "追加新子目标..."}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-semibold"
                        />
                        <button 
                          onClick={() => handleAddTask(activeProject.id)}
                          className="px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-all shadow shadow-indigo-600/10 hover:scale-[1.02]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 3. Deep Project Notes Block */}
                    <div className="flex-1 flex flex-col space-y-2 min-h-[220px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 font-sans">
                            {isEn ? "Project Notebook / Code Notes" : "私 密 精 神 反 思 与 独 占 笔 记"}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#22c55e] font-mono font-black flex items-center gap-1 select-none">
                          <Save className="w-3 h-3 text-[#22c55e]" /> LOCAL AUTOSAVE
                        </span>
                      </div>

                      <div className="relative flex-1 flex flex-col rounded-2xl border border-slate-200 overflow-hidden">
                        <textarea
                          value={activeProject.notes || ''}
                          onChange={(e) => handleSaveNotes(activeProject.id, e.target.value)}
                          placeholder={isEn 
                            ? `Paste markdown notes, engineering logs, or custom Swiss grid specifications for ${activeProject.title}...` 
                            : `在此处录入您的专属项目灵性反思、瑞士排版比例规划，或备忘逻辑代码片...（全自动高安全级内存安全级防篡改存储）_`
                          }
                          className="w-full flex-1 bg-[#fcfeff] p-4 text-xs font-semibold leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none border-none resize-none"
                        />
                        <div className="h-9 px-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{isEn ? "UTF-8 SANDBOXED" : "UTF-8 本地沙盒锁"}</span>
                          <span>{activeProject.notes?.length || 0} {isEn ? "characters" : "字符"}</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Interactive Metadata Tags Block */}
                    <div className="border border-slate-200 bg-white p-4.5 rounded-2xl space-y-3">
                      <span className="text-[10px] font-mono font-black text-slate-500 block uppercase tracking-wider">
                        {isEn ? "Sovereign Taxonomy Labels" : "主权标签编目规范（点击标签一键剥离）"}
                      </span>
                      
                      <div className="flex flex-wrap gap-2 items-center">
                        {activeProject.tags.map((t, index) => (
                          <span 
                            key={index} 
                            onClick={() => handleRemoveTag(activeProject.id, t)}
                            title={isEn ? "Click to remove this label" : "点击移除此标签"}
                            className="text-[10.5px] font-bold text-slate-600 bg-slate-50 hover:bg-neutral-100 hover:text-red-500 hover:border-red-200 cursor-pointer px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition-all"
                          >
                            <span>#{t}</span>
                            <span className="text-[8px] text-slate-400 group-hover:text-red-500">×</span>
                          </span>
                        ))}

                        <div className="flex gap-1 items-center shrink-0">
                          <input 
                            type="text"
                            value={newTagText}
                            onChange={(e) => setNewTagText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag(activeProject.id)}
                            placeholder="+"
                            className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none"
                          />
                          {newTagText.trim() && (
                            <button
                              onClick={() => handleAddTag(activeProject.id)}
                              className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded hover:bg-slate-200"
                            >
                              OK
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* 🗺️ Sub-Field Map Workspace Panel */
                  <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                    {/* Top subfield title / description */}
                    <div className="flex items-center justify-between shrink-0">
                      <div>
                        <h4 className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                          <span>SYSTEM TOPOLOGY BLUEPRINT</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">
                          {isEn 
                            ? "Drag nodes to adjust relative position layout; click connecting circles to bind links." 
                            : "可自由拖动卡片规划相对位置；点击两侧的圆圈锚点进行组件间的单向关联连线。"}
                        </p>
                      </div>
                      
                      {connectingSourceId && (
                        <div className="text-[9px] font-mono bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg animate-pulse flex items-center gap-1">
                          <span>{isEn ? "LINK MODE: Click target circle" : "对接中：点击目标组件右侧圈"}</span>
                          <button 
                            onClick={() => setConnectingSourceId(null)}
                            className="font-bold underline text-slate-500 hover:text-red-500 ml-1"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Interactive Sandbox Canvas Container */}
                    <div 
                      onMouseMove={(e) => handleSubNodeMouseMove(activeProject.id, e)}
                      onMouseUp={handleSubNodeMouseUpOrLeave}
                      onMouseLeave={handleSubNodeMouseUpOrLeave}
                      className="relative w-full h-[280px] bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden select-none cursor-crosshair shrink-0 shadow-inner"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 1.2px, transparent 1.2px)',
                        backgroundSize: '16px 16px'
                      }}
                    >
                      {/* SVGs rendering the links pathways */}
                      <svg className="absolute inset-0 pointer-events-none w-full h-full">
                        <defs>
                          <marker
                            id="arrow"
                            viewBox="0 0 10 10"
                            refX="18"
                            refY="5"
                            markerWidth="6"
                            markerHeight="6"
                            orient="auto-start-reverse"
                          >
                            <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
                          </marker>
                        </defs>

                        {/* Iterate and draw the paths */}
                        {(subFieldMaps[activeProject.id] || []).map((node) => {
                          const list = subFieldMaps[activeProject.id] || [];
                          return node.connections.map((targetId) => {
                            const targetNode = list.find(n => n.id === targetId);
                            if (!targetNode) return null;
                            
                            const x1 = node.x + 65;
                            const y1 = node.y + 24;
                            const x2 = targetNode.x + 65;
                            const y2 = targetNode.y + 24;

                            return (
                              <g key={`${node.id}-${targetId}`}>
                                <line 
                                  x1={x1} 
                                  y1={y1} 
                                  x2={x2} 
                                  y2={y2} 
                                  stroke="#6366f1" 
                                  strokeWidth="3.5" 
                                  strokeOpacity="0.15"
                                />
                                <line 
                                  x1={x1} 
                                  y1={y1} 
                                  x2={x2} 
                                  y2={y2} 
                                  stroke={selectedSubNodeId === node.id ? "#818cf8" : "#4f46e5"} 
                                  strokeWidth="1.5" 
                                  strokeDasharray="4 3"
                                  markerEnd="url(#arrow)"
                                />
                              </g>
                            );
                          });
                        })}
                      </svg>

                      {/* Display the active layout nodes inside the map */}
                      {(subFieldMaps[activeProject.id] || []).map((node) => {
                        const isSelected = selectedSubNodeId === node.id;
                        const isConnectingSource = connectingSourceId === node.id;
                        
                        // Theme colors for styles
                        let nodeStyles = "";
                        let typeColorText = "";
                        switch(node.type) {
                          case 'ui':
                            nodeStyles = "bg-[#0c0f24]/90 border-indigo-500/80 text-indigo-100 hover:border-indigo-400";
                            typeColorText = "text-indigo-400";
                            break;
                          case 'gate':
                            nodeStyles = "bg-[#0b1b17]/90 border-emerald-500/80 text-emerald-100 hover:border-emerald-400";
                            typeColorText = "text-emerald-400";
                            break;
                          case 'db':
                            nodeStyles = "bg-[#0a1c1f]/90 border-cyan-500/80 text-cyan-100 hover:border-cyan-400";
                            typeColorText = "text-cyan-400";
                            break;
                          case 'agent':
                            nodeStyles = "bg-[#200d28]/90 border-purple-500/80 text-purple-100 hover:border-purple-400";
                            typeColorText = "text-purple-400";
                            break;
                        }

                        return (
                          <div
                            key={node.id}
                            onMouseDown={(e) => handleSubNodeMouseDown(activeProject.id, node.id, e)}
                            className={`absolute w-[130px] rounded-xl border p-2 text-left cursor-grab active:cursor-grabbing transition-shadow duration-150 relative select-none ${nodeStyles} ${
                              isSelected ? 'ring-2 ring-indigo-500/65 scale-[1.03] shadow-[0_4px_12px_rgba(99,102,241,0.25)] border-indigo-400' : 'shadow-sm'
                            }`}
                            style={{ left: node.x, top: node.y }}
                          >
                            {/* Connector node circle indicator dot */}
                            <button
                              title={isEn ? "Connect Outgoing Link" : "拉出对接通道"}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (connectingSourceId) {
                                  handleToggleSubConnection(activeProject.id, connectingSourceId, node.id);
                                  setConnectingSourceId(null);
                                } else {
                                  setConnectingSourceId(node.id);
                                }
                              }}
                              className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center border transition-all z-20 ${
                                isConnectingSource 
                                  ? 'bg-amber-500 border-amber-300 scale-125 rotate-45'
                                  : 'bg-slate-900 border-slate-700 hover:scale-110'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isConnectingSource ? 'bg-white' : 'bg-indigo-400'}`} />
                            </button>

                            <div className="flex justify-between items-start mb-0.5">
                              <span className="text-[10px] font-black tracking-wide font-sans truncate pr-1">
                                {node.label}
                              </span>
                              <span className={`text-[8px] font-mono font-black uppercase tracking-widest shrink-0 ${typeColorText}`}>
                                {node.type}
                              </span>
                            </div>

                            <p className="text-[8.5px] text-slate-400 line-clamp-1 leading-snug">
                              {node.description || 'Endpoint module.'}
                            </p>

                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-[8px] font-mono leading-none">
                              <span className="text-slate-500">#{node.id}</span>
                              <span className={`font-bold uppercase ${node.status === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {node.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Integrated Sub-Component Details Inspector Block */}
                    {selectedSubNodeId ? (() => {
                      const list = subFieldMaps[activeProject.id] || [];
                      const sNode = list.find(n => n.id === selectedSubNodeId);
                      if (!sNode) return null;
                      
                      return (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shrink-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                                sNode.type === 'ui' ? 'bg-indigo-100 text-indigo-700' :
                                sNode.type === 'gate' ? 'bg-emerald-100 text-emerald-700' :
                                sNode.type === 'db' ? 'bg-cyan-100 text-cyan-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {sNode.type}
                              </span>
                              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                {sNode.label}
                              </h5>
                            </div>

                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleAskHeyAboutComponent(activeProject.id, sNode)}
                                className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[9.5px] font-bold font-mono border border-indigo-200/50 transition-colors flex items-center gap-1 shrink-0"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                <span>{isEn ? "Audit & Code" : "伴生心智写代码"}</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  // Toggle status synced / warning / pending
                                  setSubFieldMaps(prev => {
                                    const currentList = prev[activeProject.id] || [];
                                    return {
                                      ...prev,
                                      [activeProject.id]: currentList.map(n => 
                                        n.id === selectedSubNodeId 
                                          ? { ...n, status: n.status === 'synced' ? 'warning' : n.status === 'warning' ? 'pending' : 'synced' } 
                                          : n
                                      )
                                    };
                                  });
                                }}
                                className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-600 rounded text-[9.5px] font-bold border border-slate-200 transition-colors shrink-0"
                              >
                                {isEn ? "Toggle Status" : "轮转状态"}
                              </button>
                              
                              <button
                                onClick={() => handleRemoveSubComponent(activeProject.id, selectedSubNodeId)}
                                className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-650 rounded text-[9.5px] font-bold border border-red-100/50 transition-colors shrink-0"
                              >
                                {isEn ? "Prune" : "裁剪"}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="font-mono text-[9px] block text-slate-400 uppercase font-black">
                              SPECIFICATION BLUEPRINT DESCRIPTION:
                            </span>
                            <input
                              type="text"
                              value={sNode.description || ''}
                              onChange={(e) => {
                                const desc = e.target.value;
                                setSubFieldMaps(prev => {
                                  const currentList = prev[activeProject.id] || [];
                                  return {
                                    ...prev,
                                    [activeProject.id]: currentList.map(n => 
                                      n.id === selectedSubNodeId ? { ...n, description: desc } : n
                                    )
                                  };
                                });
                              }}
                              placeholder={isEn ? "Specify exact component responsibility..." : "追加指定该子单元职责..."}
                              className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-400 font-sans text-xs text-slate-750 font-semibold"
                            />
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="p-4 bg-slate-50 border border-dashed border-slate-200 text-center rounded-2xl select-none shrink-0">
                        <span className="text-[10px] font-semibold text-slate-450 flex items-center justify-center gap-1.5 font-mono">
                          <Terminal className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isEn ? "Select any node above to inspect or request code templates" : "点击底图节点可以启动伴生心智代码生成器与配置审计"}</span>
                        </span>
                      </div>
                    )}

                    {/* Component Spawner Dock footer */}
                    <div className="border border-slate-150 bg-white p-3.5 rounded-2xl space-y-2 shrink-0">
                      <span className="text-[9px] font-mono font-black text-indigo-500 block uppercase">
                        {isEn ? "Component Spawner Interface Gateway" : "+ 物理生成级组件接口对接锚点"}
                      </span>
                      
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={newSubNodeName}
                          onChange={(e) => setNewSubNodeName(e.target.value)}
                          placeholder={isEn ? "Subcomponent label (e.g. Auth-Bridge)" : "新组件标记 (如. JWT-Port)"}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400 font-semibold"
                        />
                        <select
                          value={newSubNodeType}
                          onChange={(e) => setNewSubNodeType(e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-2 py-1.5 text-xs focus:outline-none font-bold"
                        >
                          <option value="ui">UI Component</option>
                          <option value="gate">Gateway API</option>
                          <option value="db">Secure DB</option>
                          <option value="agent">Micro Agent</option>
                        </select>
                        <button
                          onClick={() => handleAddSubComponent(activeProject.id)}
                          disabled={!newSubNodeName.trim()}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap"
                        >
                          {isEn ? "Spawn component" : "添加组件"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* IMMERSIVE SUB-VIEW 2: INTEGRATED TAILORED AI ASSISTANT PANEL ('Hey') (Middle Column) */}
              <div className="w-full md:w-[380px] border-r border-slate-100 flex flex-col justify-between h-full bg-[#fafbff]">
                
                {/* Hey Assistant Header */}
                <div className="p-5 bg-[#03020c] text-white border-b border-indigo-950 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                    <div>
                      <h3 className="text-xs font-black tracking-widest font-mono text-indigo-300">
                        HEY COGNITIVE ECHO
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {isEn ? "Project AI Coding Critic" : "专属项目智能代码伙伴与镜反体系"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/40 text-indigo-300">
                    {isEn ? "Model 2.0" : "心智2代"}
                  </span>
                </div>

                {/* Companion Dialogues area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  
                  {/* Persona Indicator Card */}
                  <div className="p-3.5 bg-indigo-950/10 border border-indigo-100/40 rounded-2xl">
                    <div className="text-[9px] font-mono text-indigo-500 block uppercase font-bold mb-1">
                      {isEn ? "Active Project Mind Anchor" : "当前项目心智坐标锚点"}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                      {isEn 
                        ? `A custom crit observer aligned with ${activeProject.title}'s specifications, checking P2P protocol integrity and core aesthetics.`
                        : `已经针对 ${activeProject.title} 专属底层对齐：自动代入项目的哲学纲领进行代码设计、高频逻辑推演与批判审核。`}
                    </p>
                  </div>

                  {/* Chat messages */}
                  <div className="space-y-4">
                    {(projectChats[activeProject.id] || []).map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex flex-col space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm shadow-indigo-600/10'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                        }`}>
                          {msg.text}

                          {/* Companion provided inline source code preview */}
                          {msg.codeBlock && (
                            <div className="mt-3.5 space-y-2">
                              <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900 rounded-lg text-[9px] font-mono text-[#4ba2ff]">
                                <span>{isEn ? "PROPOSED HANDSHAKE SOURCE" : "AI 推理代码骨架建议"}</span>
                                <button
                                  onClick={() => handleApplyRecCode(activeProject.id, msg.codeBlock!)}
                                  className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-sans font-bold flex items-center gap-1 transition-all"
                                >
                                  <Code className="w-3 h-3" />
                                  <span>{isEn ? "Apply Snippet" : "写入沙盒"}</span>
                                </button>
                              </div>
                              <pre className="p-3 bg-[#03020a] rounded-lg text-[10px] font-mono text-slate-200 overflow-x-auto border border-slate-800 text-left shrink-0">
                                <code>{msg.codeBlock}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 px-1">
                          {msg.sender === 'user' ? 'ceaserzhao' : 'Hey'} • {msg.timestamp}
                        </span>
                      </div>
                    ))}

                    {/* Companion thinking indicator */}
                    {isHeyThinking && (
                      <div className="flex flex-col items-start space-y-1.5 animate-pulse">
                        <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3.5 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{isEn ? 'CRYSTALLIZING SEED' : '心智星轨测算中...'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subpage custom prompt seeds */}
                <div className="px-4 py-2 border-t border-slate-100 bg-white">
                  <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none shrink-0 select-none">
                    {(activeProject.id === 'project-a' ? [
                      { text: isEn ? "🔑 Security audit" : "🔑 安全接口审计", prompt: isEn ? "Run severe security audit mapping Oasis interface protocols." : "针对 Oasis 公司的接口条件进行高等级安全审计校验..." },
                      { text: isEn ? "📏 Code layout" : "📏 统一排版规范", prompt: isEn ? "How can we align Swiss grid CSS with our Project A layouts?" : "我们如何针对 Project A 规划高可信的瑞士极简 CSS 栅格规则？" }
                    ] : [
                      { text: isEn ? "⚡ Load balance" : "⚡ 去中心并发分析", prompt: isEn ? "What's the circular queue bottleneck on WebRTC sliding windows?" : "对于 Zurich 去中心通讯底座中突破 256 并发时的滑动滑动队列瓶颈有什么优化策略？" },
                      { text: isEn ? "🛡️ Signed logs" : "🛡️ 本地签名验证", prompt: isEn ? "Propose an asymmetric encryption structure to secure Oermos state." : "提出一个非对称加密本地校签方案来保护 Oermos 本地储存安全..." }
                    ]).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChatInputs(prev => ({ ...prev, [activeProject.id]: item.prompt }));
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 bg-white text-slate-650 hover:text-indigo-650 hover:bg-slate-50 hover:border-indigo-400 shrink-0 transition-all"
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hey Input Console footer */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0 flex gap-2">
                  <input
                    type="text"
                    value={chatInputs[activeProject.id] || ''}
                    disabled={isHeyThinking}
                    onChange={(e) => {
                      const text = e.target.value;
                      setChatInputs(prev => ({ ...prev, [activeProject.id]: text }));
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendHeyMessage(activeProject.id)}
                    placeholder={isEn ? "Prompt 'Hey' regarding this workspace..." : "向当前项目的 AI Companion 提问..."}
                    className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:border-indigo-600 font-semibold"
                  />
                  <button
                    onClick={() => handleSendHeyMessage(activeProject.id)}
                    disabled={isHeyThinking || !(chatInputs[activeProject.id] || '').trim()}
                    className="w-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow shadow-indigo-600/10 active:scale-95"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>

              </div>

              {/* IMMERSIVE SUB-VIEW 3: TELEMETRY STREAM & CONNECTORS FEED (Right Column) */}
              <div className="w-full md:w-[260px] flex flex-col justify-between h-full bg-slate-50 dark:bg-transparent">
                
                {/* Upper Module: Telemetry stream */}
                <div className="p-5 flex-1 flex flex-col space-y-4 overflow-hidden">
                  
                  {/* Title */}
                  <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-600" />
                      <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider">
                        {isEn ? "Multi-Source Feed" : "多通道源数据流集成"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleInjectTelemetryLog(activeProject.id)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 text-slate-400 rounded-lg transition-all"
                      title={isEn ? "Inject random signal wave" : "注入手动模拟波动特征"}
                    >
                      <Play className="w-3.5 h-3.5 rotate-90" />
                    </button>
                  </div>

                  {/* Feed Logs Block */}
                  <div className="flex-1 overflow-y-auto p-3.5 bg-slate-900 border border-slate-850 rounded-2xl font-mono text-[9.5px] leading-relaxed text-[#3dd1bc] space-y-2.5 shadow-inner">
                    {(telemetryFeeds[activeProject.id] || []).map((log, index) => (
                      <div key={index} className="border-b border-slate-850 pb-2 last:border-none">
                        {log}
                      </div>
                    ))}
                    <div className="text-[8px] text-slate-500 uppercase font-black text-center pt-2 leading-snug">
                      -- END OF MEMORY STREAMS --
                    </div>
                  </div>
                </div>

                {/* Sub-Module: Code Sandbox Snapshot Container */}
                {activeProject.codeSnippet && (
                  <div className="p-5 border-t border-slate-100 bg-white space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase">
                          {isEn ? "SANDBOX BUFFER CODE" : "沙盒局部代码缓存"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setNodes(prev => prev.map(n => n.id === activeProject.id ? { ...n, codeSnippet: undefined } : n));
                        }}
                        className="text-[9px] text-slate-400 hover:text-red-500 font-bold"
                      >
                        Clear
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      {isEn 
                        ? "Active custom telemetry block is cached and linked specifically into this project's runtime."
                        : "检测到当前项目专页已经导入了 AI 推荐代码。下面是局部临时内存映像："}
                    </p>

                    <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl max-h-[110px] overflow-y-auto">
                      <pre className="text-[9px] font-mono text-emerald-400 whitespace-pre">
                        {activeProject.codeSnippet}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Bottom Module: Diagnostic and Hardware representations */}
                <div className="p-5 border-t border-slate-150 bg-white space-y-4 shrink-0">
                  <span className="text-[10px] font-mono font-black text-slate-500 block uppercase tracking-wider">
                    {isEn ? "Subspace Telemetry Indicators" : "物理及主权网络监视指标"}
                  </span>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative select-none">
                      <div className="text-[9px] text-slate-400 font-mono font-black mb-1">P2P SECTOR</div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Zurich-S</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative select-none">
                      <div className="text-[9px] text-slate-400 font-mono font-black mb-1">CACHE NODE</div>
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span>IndexedDB</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#fcfdfe] border border-slate-150 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase block">{isEn ? "Encryption protocol" : "加密隔离握手协议"}</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">ECDSA_secp256k1</span>
                    </div>
                    <span className="text-[9px] font-mono font-black border border-emerald-200 bg-[#effdf5] text-[#15803d] rounded px-1.5 py-0.5">
                      LOCK
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Lightbulb className="w-12 h-12 text-slate-300 mb-2 animate-bounce" />
              <p className="text-xs font-semibold">
                {isEn ? "No project selected. Open a core project from the list." : "暂未选中任何项目。请在左侧列表中点击选择空间。"}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
