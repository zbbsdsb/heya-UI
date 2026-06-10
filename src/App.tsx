/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Share2,
  ChevronRight,
  Settings,
  Bell,
  BookOpen,
  Compass,
  Grid,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  Plus,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Sidebar from './components/Sidebar';
import FieldMapCanvas from './components/FieldMapCanvas';
import HeyCompanion from './components/HeyCompanion';
import ForgeLogic from './components/ForgeLogic';
import MuseIdeation from './components/MuseIdeation';
import OermosNetwork from './components/OermosNetwork';
import WorkspaceToolList from './components/WorkspaceToolList';
import ProjectSpace from './components/ProjectSpace';
import HearthComponentRegistry from './components/HearthComponentRegistry';
import ExploreRealmNavigator from './components/ExploreRealmNavigator';
import DraggableToolPreview from './components/DraggableToolPreview';

import { NodeData, MuseIdea, NodeType } from './types';
import { translations } from './locales';

// Avatars for online collaboration representations
const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop&sat=-100", // ceaserzhao
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop", // Ying
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop", // Alex
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop", // David
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=128&auto=format&fit=crop"  // Emma
];

export default function App() {
  const [activeTab, setActiveTab] = useState('projectspace');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('project-a');
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [swissTheme, setSwissTheme] = useState(false);
  const [warpTargetCoords, setWarpTargetCoords] = useState<{ x: number; y: number; label: string } | null>(null);
  const [isToolPreviewOpen, setIsToolPreviewOpen] = useState(false);
  const [toolPreviewPosition, setToolPreviewPosition] = useState({ x: 300, y: 250 });
  const toolPreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterToolList = (rect: DOMRect) => {
    if (toolPreviewTimeoutRef.current) {
      clearTimeout(toolPreviewTimeoutRef.current);
      toolPreviewTimeoutRef.current = null;
    }
    const targetX = Math.round(rect.right + 12);
    const targetY = Math.max(10, Math.round(rect.top - 50));
    setToolPreviewPosition({ x: targetX, y: targetY });
    setIsToolPreviewOpen(true);
  };

  const handleMouseLeaveToolList = () => {
    if (toolPreviewTimeoutRef.current) {
      clearTimeout(toolPreviewTimeoutRef.current);
    }
    toolPreviewTimeoutRef.current = setTimeout(() => {
      setIsToolPreviewOpen(false);
    }, 400); // 400ms delay to move cursor onto target popover smoothly
  };

  const handleMouseEnterToolPreview = () => {
    if (toolPreviewTimeoutRef.current) {
      clearTimeout(toolPreviewTimeoutRef.current);
      toolPreviewTimeoutRef.current = null;
    }
  };

  const handleMouseLeaveToolPreview = () => {
    if (toolPreviewTimeoutRef.current) {
      clearTimeout(toolPreviewTimeoutRef.current);
    }
    toolPreviewTimeoutRef.current = setTimeout(() => {
      setIsToolPreviewOpen(false);
    }, 300);
  };
  
  // Custom states matching interactive mesh requirements
  const [audioSfx, setAudioSfx] = useState(() => {
    return localStorage.getItem('heya_sfx_enabled') !== 'false';
  });
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn'; id: number } | null>(null);

  const tVal = translations[language];

  // Zero-dependency professional Web Audio synthesizer for tactile clicks and sweeps
  const playSfx = (type: 'click' | 'success' | 'alert' | 'route') => {
    if (!audioSfx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // Beautiful C-major arpeggio
        frequencies.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + i * 0.06 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.2);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + i * 0.06 + 0.2);
        });
      } else if (type === 'alert') {
        const frequencies = [820, 520];
        frequencies.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + i * 0.12 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.25);
        });
      } else if (type === 'route') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (err) {
      console.warn("Audio synthesizer lookup error:", err);
    }
  };

  // Expose play function to global window scope and synchronize handlers
  useEffect(() => {
    (window as any).playTactileChime = (type: 'click' | 'success' | 'alert' | 'route') => {
      playSfx(type);
    };
    localStorage.setItem('heya_sfx_enabled', String(audioSfx));
  }, [audioSfx]);

  // Intercept dialog events and replace raw iframe-breaking native alert calls
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type?: 'info' | 'success' | 'warn' }>;
      if (customEvent.detail && customEvent.detail.message) {
        setToast({
          message: customEvent.detail.message,
          type: customEvent.detail.type || 'info',
          id: Date.now()
        });
        playSfx(customEvent.detail.type === 'success' ? 'success' : 'alert');
      }
    };

    window.addEventListener('heya-toast', handleToastEvent);

    const originalAlert = window.alert;
    window.alert = (message: any) => {
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { message: String(message), type: 'info' }
      }));
    };

    return () => {
      window.removeEventListener('heya-toast', handleToastEvent);
      window.alert = originalAlert;
    };
  }, [audioSfx]);

  // Autohide toast tracker loop
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Hearth core components state (shares across Canvas & Relations)
  const [nodes, setNodes] = useState<NodeData[]>(() => {
    const saved = localStorage.getItem('hearth_nodes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_nodes from localStorage', e);
      }
    }
    return [
      {
        id: 'project-a',
        type: 'project',
        title: 'Project A',
        description: '核心开发，对齐 Oasis 公司对接条件。',
        x: 380,
        y: 350,
        progress: 62,
        members: ['ceaserzhao', 'Ying', 'Alex', 'David'],
        checklist: [
          { id: 'pa-1', text: 'Define system architecture', done: true },
          { id: 'pa-2', text: 'Align styling design norms', done: true },
          { id: 'pa-3', text: 'Coordinate with Oasis Co.', done: false }
        ],
        tags: ['产品', '开发周期'],
        connections: ['project-b', 'todo-list', 'research'],
        star: true,
        createdAt: '2024/05/28',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'AND',
        logicalValue: true
      },
      {
        id: 'project-b',
        type: 'project',
        title: 'Project B',
        description: '重点在 Oermos 协议设计，测试 Zurich 基座握手包。',
        x: 580,
        y: 220,
        progress: 48,
        members: ['ceaserzhao', 'Ying'],
        checklist: [
          { id: 'pb-1', text: 'Implement WebRTC handshake', done: true },
          { id: 'pb-2', text: 'P2P transport validation', done: false }
        ],
        tags: ['核心', '网络协议'],
        connections: ['project-a', 'user-research', 'todo-list'],
        star: false,
        createdAt: '2024/05/20',
        updatedAt: '2024/05/29',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'INPUT',
        logicalValue: true
      },
      {
        id: 'todo-list',
        type: 'todo',
        title: 'Execution Pipeline',
        description: '系统底层动态微内核与拓扑运算流执行管线。',
        x: 480,
        y: 480,
        progress: 25,
        members: ['ceaserzhao', 'Alex'],
        checklist: [],
        tags: ['Pipeline', 'Core-Flow'],
        connections: ['project-a', 'project-b'],
        star: false,
        createdAt: '2024/05/25',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'OR',
        logicalValue: true
      },
      {
        id: 'design-system',
        type: 'resource',
        title: 'Registry Matrix',
        description: '赫斯全局拓扑网络数据寻址与组件注册控制枢纽。',
        x: 720,
        y: 470,
        progress: 100,
        members: ['Alex', 'David', 'Emma'],
        checklist: [],
        tags: ['Registry', 'Base'],
        connections: ['todo-list'],
        star: false,
        createdAt: '2024/05/18',
        updatedAt: '2024/05/28',
        status: 'completed',
        syncStatus: 'synced',
        authorId: 'Alex',
        version: 1,
        logicalOperator: 'NOT',
        logicalValue: false
      },
      {
        id: 'research',
        type: 'muse',
        title: 'Research',
        description: '市场契机 analysis 与用户心流追踪研讨。',
        x: 220,
        y: 280,
        progress: 30,
        members: ['ceaserzhao'],
        checklist: [],
        tags: ['研究', '创意'],
        connections: ['project-a'],
        star: false,
        createdAt: '2024/05/10',
        updatedAt: '2024/05/25',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'INPUT',
        logicalValue: false
      },
      {
        id: 'user-research',
        type: 'agent',
        title: 'User Research Companion',
        description: '自动分析、提炼并过滤用户反馈。',
        x: 760,
        y: 180,
        progress: 85,
        members: ['Agent Spark'],
        checklist: [],
        tags: ['Agent', 'AI 洞察'],
        connections: ['project-b'],
        star: false,
        createdAt: '2024/05/29',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'system',
        version: 1,
        logicalOperator: 'INPUT',
        logicalValue: true
      }
    ];
  });

  // Muse original sparks state (shares across Muse & can evolve onto Canvas)
  const [ideas, setIdeas] = useState<MuseIdea[]>(() => {
    const saved = localStorage.getItem('hearth_ideas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing hearth_ideas from localStorage', e);
      }
    }
    return [
      { id: 'muse-1', content: '使用 WebRTC 进行去中心化分布式元数据直接广播', createdAt: '今天 09:24' },
      { id: 'muse-2', content: 'Swiss 极简网格排版系统：仅采用黑白对比与粗细线条，零多余圆角', createdAt: '昨天 19:40' },
      { id: 'muse-3', content: '0ms 通讯底座：握手信息通过底层 P2P 网格自动绕过中心式服务器', createdAt: '前天 11:12' }
    ];
  });

  // Sync state variations back to localStorage whenever they mutate
  useEffect(() => {
    localStorage.setItem('hearth_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('hearth_ideas', JSON.stringify(ideas));
  }, [ideas]);

  // AI chat states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  // Ask Hey AI handler
  const handleAskHeya = async (prompt: string) => {
    if (!prompt.trim() || isAiLoading) return;
    setIsAiLoading(true);

    const userMsg = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      // Localized proactive seed generation or server analysis
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          nodesSummary: nodes.map(n => ({ title: n.title, type: n.type }))
        })
      });

      if (!resp.ok) {
        throw new Error('API server unreachable');
      }

      const data = await resp.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.content }]);

      // If action is returned, execute it!
      if (data.action) {
        const type = data.action.type;
        const actData = data.action.data;

        if (type === 'create_node') {
          const freshId = `node-${Date.now()}`;
          const newNode: NodeData = {
            id: freshId,
            type: (actData.type || 'todo') as NodeType,
            title: actData.title || 'Sprouted Node',
            description: actData.description || 'Sprout catalyzed by Hey companion trigger.',
            x: 420 + Math.random() * 80,
            y: 350 + Math.random() * 80,
            progress: 0,
            members: ['Agent Spark'],
            checklist: [],
            tags: ['AI-Catalyzed'],
            connections: ['project-a'],
            createdAt: '2024/05/30',
            updatedAt: '2024/05/30',
            status: 'active',
            syncStatus: 'synced',
            authorId: 'system',
            version: 1
          };
          setNodes(prev => [...prev, newNode]);
          setSelectedNodeId(freshId);
        }
      }

    } catch (err) {
      // Offline smart fallback simulation - perfectly robust
      setTimeout(() => {
        const fallbacks = [
          `我分析了你的 Field Map！你可以尝试将 “User Research Companion” 节点拖拽移动至 机会域，这可以帮助自动捕获访谈信息。同时，我已经帮你将这个建议记入日志。`,
          `建议在 “Todo List” 增加一个子任务 “WebRTC 性能压测”，这能对齐 Project B 要求的 Oermos 协议底座条件！`,
          `已经为你激活了该决策拓扑。你可以点击左侧 "Oermos P2P" 选项卡来检查 Zurich 网关的连线同步状态！`
        ];
        const randomAnswer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: randomAnswer 
        }]);

        // Auto spawn node if user asked for a node
        const promptLower = prompt.toLowerCase();
        if (promptLower.includes('node') || promptLower.includes('节点') || promptLower.includes('任务') || promptLower.includes('task')) {
          const freshId = `node-offline-${Date.now()}`;
          setNodes(prev => [...prev, {
            id: freshId,
            type: 'todo',
            title: 'AI Proposes Node',
            description: '启发式分析建议加入的元数据任务边界。',
            x: 520,
            y: 380,
            progress: 10,
            members: ['ceaserzhao'],
            checklist: [{ id: `item-${freshId}`, text: '分析机会域元数据边界', done: false }],
            tags: ['AI-Proposal'],
            connections: ['todo-list'],
            createdAt: '2024/05/30',
            updatedAt: '2024/05/30',
            status: 'draft',
            syncStatus: 'synced',
            authorId: 'system',
            version: 1
          }]);
          setSelectedNodeId(freshId);
        }
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Evolve unstructured Muse ideation into Hearth active map component
  const handleEvolveNode = (ideaId: string, text: string, title?: string, tags?: string[], connections?: string[]) => {
    const freshId = `node-evolved-${Date.now()}`;
    const evolvedNode: NodeData = {
      id: freshId,
      type: 'muse',
      title: title || (text.length > 20 ? text.slice(0, 18) + '...' : text),
      description: text,
      x: 320 + Math.random() * 120,
      y: 280 + Math.random() * 100,
      progress: 0,
      members: ['ceaserzhao'],
      checklist: [],
      tags: tags || ['Muse-Evolved'],
      connections: connections || ['project-a'],
      createdAt: '2024/05/30',
      updatedAt: '2024/05/30',
      status: 'active',
      syncStatus: 'synced',
      authorId: 'ceaserzhao',
      version: 1
    };

    setNodes(prev => [...prev, evolvedNode]);
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId ? { ...idea, convertedToNodeId: freshId } : idea
    ));

    setSelectedNodeId(freshId);
    setActiveTab('fieldmap');
  };

  // Custom tool top bar actions mapping
  const handleAddMapItemDirectly = (title: string, type: string) => {
    const id = `item-direct-${Date.now()}`;
    const newItem: NodeData = {
      id,
      type: type as any,
      title: title || 'Quick Sprout',
      description: 'Hearth creation active node block.',
      x: 430,
      y: 320,
      progress: 0,
      members: ['ceaserzhao'],
      tags: ['Manual'],
      checklist: [],
      connections: [],
      createdAt: '25/05/30',
      updatedAt: '25/05/30',
      status: 'active',
      syncStatus: 'synced',
      authorId: 'ceaserzhao',
      version: 1
    };

    setNodes(prev => [...prev, newItem]);
    setSelectedNodeId(id);
  };

  const handleResetDemoSandbox = () => {
    const defaultNodes: NodeData[] = [
      {
        id: 'project-a',
        type: 'project',
        title: 'Project A',
        description: '核心开发，对齐 Oasis 公司对接条件。',
        x: 380,
        y: 350,
        progress: 62,
        members: ['ceaserzhao', 'Ying', 'Alex', 'David'],
        checklist: [
          { id: 'pa-1', text: 'Define system architecture', done: true },
          { id: 'pa-2', text: 'Align styling design norms', done: true },
          { id: 'pa-3', text: 'Coordinate with Oasis Co.', done: false }
        ],
        tags: ['产品', '开发周期'],
        connections: ['project-b', 'todo-list', 'research'],
        star: true,
        createdAt: '2024/05/28',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'AND',
        logicalValue: true
      },
      {
        id: 'project-b',
        type: 'project',
        title: 'Project B',
        description: '重点在 Oermos 协议设计，测试 Zurich 基座握手包。',
        x: 580,
        y: 220,
        progress: 48,
        members: ['ceaserzhao', 'Ying'],
        checklist: [
          { id: 'pb-1', text: 'Implement WebRTC handshake', done: true },
          { id: 'pb-2', text: 'P2P transport validation', done: false }
        ],
        tags: ['核心', '网络协议'],
        connections: ['project-a', 'user-research', 'todo-list'],
        star: false,
        createdAt: '2024/05/20',
        updatedAt: '2024/05/29',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'INPUT',
        logicalValue: true
      },
      {
        id: 'todo-list',
        type: 'todo',
        title: 'Execution Pipeline',
        description: '系统底层动态微内核与拓扑运算流执行管线。',
        x: 480,
        y: 480,
        progress: 25,
        members: ['ceaserzhao', 'Alex'],
        checklist: [],
        tags: ['Pipeline', 'Core-Flow'],
        connections: ['project-a', 'project-b'],
        star: false,
        createdAt: '2024/05/25',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'OR',
        logicalValue: true
      },
      {
        id: 'design-system',
        type: 'resource',
        title: 'Registry Matrix',
        description: '赫斯全局拓扑网络数据寻址与组件注册控制枢纽。',
        x: 720,
        y: 470,
        progress: 100,
        members: ['Alex', 'David', 'Emma'],
        checklist: [],
        tags: ['Registry', 'Base'],
        connections: ['todo-list'],
        star: false,
        createdAt: '2024/05/18',
        updatedAt: '2024/05/28',
        status: 'completed',
        syncStatus: 'synced',
        authorId: 'Alex',
        version: 1,
        logicalOperator: 'NOT',
        logicalValue: false
      },
      {
        id: 'research',
        type: 'muse',
        title: 'Research',
        description: '市场契机 analysis 与用户心流追踪研讨。',
        x: 220,
        y: 280,
        progress: 30,
        members: ['ceaserzhao'],
        checklist: [],
        tags: ['研究', '创意'],
        connections: ['project-a'],
        star: false,
        createdAt: '2024/05/10',
        updatedAt: '2024/05/25',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'ceaserzhao',
        version: 1,
        logicalOperator: 'INPUT',
        logicalValue: false
      },
      {
        id: 'user-research',
        type: 'agent',
        title: 'User Research Companion',
        description: '自动分析、提炼并过滤用户反馈。',
        x: 760,
        y: 180,
        progress: 85,
        members: ['Agent Spark'],
        checklist: [],
        tags: ['Agent', 'AI 洞察'],
        connections: ['project-b'],
        star: false,
        createdAt: '2024/05/29',
        updatedAt: '2024/05/30',
        status: 'active',
        syncStatus: 'synced',
        authorId: 'system',
        version: 1,
        logicalOperator: 'INPUT',
        logicalValue: true
      }
    ];

    const defaultIdeas: MuseIdea[] = [
      { id: 'muse-1', content: '使用 WebRTC 进行去中心化分布式元数据直接广播', createdAt: '今天 09:24' },
      { id: 'muse-2', content: 'Swiss 极简网格排版系统：仅采用黑白对比与粗细线条，零多余圆角', createdAt: '昨天 19:40' },
      { id: 'muse-3', content: '0ms 通讯底座：握手信息通过底层 P2P 网格自动绕过中心式服务器', createdAt: '前天 11:12' }
    ];

    setNodes(defaultNodes);
    setIdeas(defaultIdeas);
    localStorage.setItem('hearth_nodes', JSON.stringify(defaultNodes));
    localStorage.setItem('hearth_ideas', JSON.stringify(defaultIdeas));

    const defaultDocs = [
      {
        id: 'doc-1',
        title: language === 'en' ? 'Oasis P2P Node Broadcast Spec' : 'Oasis P2P 去中心节点广播规范',
        content: language === 'en' 
          ? `Service endpoints must adhere to zero server footprint rules. Establish multi-hop WebRTC signaling pathways across distributed browsers. Peer routing requires NAT coordinate discovery via decentralized Gossip tables to avoid single-point outages. Node state locks use high-performance vector sync.`
          : `业务终点必须坚持零中心化服务器驻留。在分布式的多端浏览器之间建立多跳 WebRTC 自洽信令。对等传输依赖 Gossip 协议表，剔除常规 SaaS 中继网卡保障高防灾表现。`,
        wordCount: 45,
        updatedAt: '2026/06/10'
      },
      {
        id: 'doc-2',
        title: language === 'en' ? 'Hearth Switzerland Typography Manifesto' : '赫斯瑞士版式极端自律设计白皮书',
        content: language === 'en'
          ? `Deselect visual clutter. Use strict grid margin divisions: 25px gaps, 2px borders, absolute sharp edges, high contrast. Pastes and cards are stripped of micro-shadow borders unless representing an active drag node. Color is used solely as functional telemetry indicator, not decor.`
          : `主动丢弃一切花哨装饰。对版面进行硬质微划分，坚持等宽等距网格配给、纯对齐比例。彻底抛弃圆角、华而不实的微阴影投影和无力斑驳。对色彩的使用遵循严格的数据监控和 telemetry 指示作用。`,
        wordCount: 44,
        updatedAt: '2026/06/09'
      }
    ];
    localStorage.setItem('hearth_muse_docs', JSON.stringify(defaultDocs));
    
    // Force reset custom event or storage trigger
    window.dispatchEvent(new Event('storage'));

    (window as any).playTactileChime?.('success');
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' 
          ? 'High-Fideltiy demonstration star-map restored successfully!' 
          : '高保真演示星图重置装载成功！赫斯拓扑网格已被洗礼重建。', 
        type: 'success' 
      }
    }));
  };

  return (
    <div className={`w-screen h-screen flex bg-[#fafafa] overflow-hidden text-slate-800 text-sm font-sans antialiased select-none ${swissTheme ? 'swiss-grid-active' : ''}`}>
      
      {/* 1. Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAskHeya={handleAskHeya}
        isAiLoading={isAiLoading}
        chatHistory={chatHistory}
        language={language}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onMouseEnterToolList={handleMouseEnterToolList}
        onMouseLeaveToolList={handleMouseLeaveToolList}
      />

      {/* 2. Main content block routing */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden justify-between border-r">
        
        {/* Nav Header Bar */}
        <header className="h-[72px] shrink-0 border-b border-[#f1f5f9] bg-white px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button 
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-400 border border-slate-100"
                onClick={() => alert(tVal.header.returnBack)}
                title={tVal.header.returnBack}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button 
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-400 border border-slate-100"
                onClick={() => alert(tVal.header.forward)}
                title={tVal.header.forward}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-[#f8fafc]/90 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50 cursor-pointer transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700">{tVal.header.mainSpace}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Avatars */}
            <div className="flex items-center -space-x-2">
              {AVATARS.map((url, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm relative cursor-pointer">
                  <img src={url} alt="Collaborator" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 text-slate-500 font-bold text-[10px] flex items-center justify-center shadow-sm cursor-pointer hover:bg-slate-100">
                +4
              </div>
            </div>

            {/* Share action */}
            <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow shadow-indigo-500/15">
              <Share2 className="w-3.5 h-3.5" />
              <span>{tVal.header.share}</span>
            </button>

            <button className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100" title={tVal.header.more}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Tab Router */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'projectspace' && (
            <ProjectSpace 
              nodes={nodes}
              setNodes={setNodes}
              language={language}
            />
          )}

          {activeTab === 'fieldmap' && (
            <FieldMapCanvas 
              nodes={nodes}
              setNodes={setNodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              onAddMapItem={handleAddMapItemDirectly}
              language={language}
              warpTargetCoords={warpTargetCoords}
              onClearWarpTarget={() => setWarpTargetCoords(null)}
              onDoubleClickNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveTab('component');
              }}
            />
          )}

          {activeTab === 'hey' && (
            <HeyCompanion 
              nodes={nodes}
              setNodes={setNodes}
              setSelectedNodeId={setSelectedNodeId}
              setActiveTab={setActiveTab}
              language={language}
            />
          )}

          {activeTab === 'forge' && (
            <ForgeLogic 
              nodes={nodes}
              setNodes={setNodes}
              setActiveTab={setActiveTab}
              setSelectedNodeId={setSelectedNodeId}
              language={language}
            />
          )}

          {activeTab === 'muse' && (
            <MuseIdeation 
              ideas={ideas}
              setIdeas={setIdeas}
              onEvolveNode={handleEvolveNode}
              language={language}
              nodes={nodes}
            />
          )}

          {activeTab === 'oermos' && (
            <OermosNetwork language={language} />
          )}

          {activeTab === 'toollist' && (
            <WorkspaceToolList 
              language={language}
            />
          )}

          {/* TAB 3: Component Library listing config */}
          {activeTab === 'component' && (
            <HearthComponentRegistry
              nodes={nodes}
              setNodes={setNodes}
              language={language}
              selectedIdFromMain={selectedNodeId || undefined}
              onNavigateToNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveTab('fieldmap');
              }}
            />
          )}

          {/* TAB 4: Explore (Quantum Warp & Spatial Sovereign Domain Navigator) */}
          {activeTab === 'explore' && (
            <ExploreRealmNavigator
              nodes={nodes}
              setNodes={setNodes}
              language={language}
              onWarpToCoordinates={(x, y, label) => {
                setWarpTargetCoords({ x, y, label });
                setActiveTab('fieldmap');
              }}
            />
          )}

        </div>

      </div>

      {/* 3. Settings Preference Overlay */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border text-[#0f172a] rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-6 mx-4">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" />
                  <span>{tVal.settingsModal.header}</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  {tVal.settingsModal.desc}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              
              {/* Language Selection Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {tVal.settingsModal.languageLabel}
                </label>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      language === 'en' 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow shadow-indigo-600/10' 
                        : 'bg-[#f8fafc] border-slate-200/60 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tVal.settingsModal.langEn}
                  </button>
                  <button 
                    onClick={() => setLanguage('zh')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      language === 'zh' 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow shadow-indigo-600/10' 
                        : 'bg-[#f8fafc] border-slate-200/60 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tVal.settingsModal.langZh}
                  </button>
                </div>
              </div>

              {/* Swiss Theme Toggle */}
              <div className="pt-2 flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-700">{tVal.settingsModal.swissTheme}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                    {tVal.settingsModal.swissThemeDesc}
                  </p>
                </div>
                <button 
                  onClick={() => setSwissTheme(!swissTheme)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    swissTheme ? 'bg-[#10b981]' : 'bg-slate-200'
                  }`}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-205 ${
                    swissTheme ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Audio Sound Effects Toggle */}
              <div className="pt-2 flex justify-between items-start gap-4 border-t border-slate-100 pt-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    {audioSfx ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    <span>{tVal.settingsModal.audioSfx}</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                    {tVal.settingsModal.audioDesc}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const nextVal = !audioSfx;
                    setAudioSfx(nextVal);
                    if (nextVal) {
                      setTimeout(() => (window as any).playTactileChime?.('success'), 50);
                    }
                  }}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    audioSfx ? 'bg-[#10b981]' : 'bg-slate-200'
                  }`}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-205 ${
                    audioSfx ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Demo Sandbox Restorer */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>{language === 'en' ? 'Demonstration Sandbox Seeder' : '高保真演示星图重置器'}</span>
                </h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  {language === 'en' 
                    ? 'Instantly restore the full, professional interconnected node topography layout, ideas sandbox and grounded reference documents.'
                    : '一键重置当前工作区！恢复完整、经过优化组织的 P2P 自适应节点星图和示例参考规格书，随时呈现最完美的视觉演示。'}
                </p>
                <button 
                  onClick={handleResetDemoSandbox}
                  className="w-full mt-1 py-2 bg-gradient-to-r from-indigo-500/90 via-purple-500/95 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'en' ? 'Reset to High-Fidelity Demo Canvas' : '一键恢复官方高保真演示星态'}</span>
                </button>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 bg-[#0f172a] hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow transition-all duration-200"
              >
                {tVal.settingsModal.saveBtn}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Elegant Decentralized Toast Notifications System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.15 } }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4.5 py-4 min-w-[300px] max-w-sm rounded-2xl shadow-xl border select-none ${
              swissTheme 
                ? 'bg-white border-2 border-black font-mono text-black' 
                : 'bg-white/95 backdrop-blur-md border-indigo-100 ring-1 ring-indigo-50/50 text-slate-800'
            }`}
          >
            {/* Colored indicator icon */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              swissTheme 
                ? 'border border-black text-black' 
                : toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'
            }`}>
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className={`text-[9px] font-bold uppercase tracking-widest block mb-0.5 ${
                swissTheme ? 'text-black' : 'text-indigo-500'
              }`}>
                {toast.type === 'success' ? (language === 'en' ? 'Mesh Sync Success' : '系统同步成功') : (language === 'en' ? 'Sovereign Notification' : '系统操作指引')}
              </span>
              <p className="text-xs font-bold leading-relaxed mt-0.5 text-ellipsis overflow-hidden whitespace-normal">{toast.message}</p>
            </div>

            <button 
              onClick={() => {
                (window as any).playTactileChime?.('click');
                setToast(null);
              }}
              className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors shrink-0 ${
                swissTheme ? 'hover:bg-black hover:text-white border border-black' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-700'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Draggable Tool List Popover */}
      {isToolPreviewOpen && (
        <DraggableToolPreview
          language={language}
          initialX={toolPreviewPosition.x}
          initialY={toolPreviewPosition.y}
          onClose={() => setIsToolPreviewOpen(false)}
          onMouseEnter={handleMouseEnterToolPreview}
          onMouseLeave={handleMouseLeaveToolPreview}
        />
      )}

    </div>
  );
}
