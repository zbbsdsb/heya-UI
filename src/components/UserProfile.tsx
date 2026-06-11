/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  MessageSquare, 
  Send, 
  Search, 
  Check, 
  Plus, 
  Link2, 
  Chrome, 
  Github, 
  Slack, 
  Music, 
  Video, 
  FileText, 
  Database, 
  Mail, 
  MapPin, 
  Calendar, 
  RefreshCw, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Trash2,
  X,
  Zap,
  Globe,
  Edit2,
  Save,
  Cpu,
  Terminal,
  Activity,
  UserCheck
} from 'lucide-react';

interface UserProfileProps {
  language?: 'en' | 'zh';
  setActiveTab?: (tab: string) => void;
}

interface IntegrationApp {
  id: string;
  name: string;
  category: 'developer' | 'productivity' | 'communication' | 'creative' | 'marketing' | 'infrastructure';
  icon: React.ComponentType<any>;
  description: string;
  connected: boolean;
  color: string;
  logoColor: string;
  apiEndpoints: number;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ReflectionLog {
  id: string;
  timestamp: string;
  content: string;
  category: string;
}

export default function UserProfile({ language = 'en', setActiveTab }: UserProfileProps) {
  const isEn = language === 'en';

  // --- STATE FOR EDITABLE BIO & METADATA (PRIMARY FOCUS) ---
  const [userName, setUserName] = useState(() => localStorage.getItem('heya-profile-name') || 'ceaserzhao');
  const [userLocation, setUserLocation] = useState(() => localStorage.getItem('heya-profile-location') || 'Nuptune');
  const [userTitle, setUserTitle] = useState(() => localStorage.getItem('heya-profile-title') || 'Oasis Founder & Sovereign Architect');
  const [userBio, setUserBio] = useState(() => localStorage.getItem('heya-profile-bio') || (isEn 
    ? 'Distinguished systems orchestrator & founder of Oasis. Crafting fluid, secure, local-first environments with pixel accuracy. Currently executing deep reflection protocols on Neptunian nodes. Committed to building zero-telemetry software chassis for the future sovereign web.'
    : '在海王星座深耕自主协议的系统架构师，Oasis 创始人。致力于以极致像素精度塑造流畅、安全的本地优先（local-first）软件生存空间，目前正在海王星（Nuptune）轨道边缘运行深层反射共识。'));
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [locationInput, setLocationInput] = useState(userLocation);
  const [titleInput, setTitleInput] = useState(userTitle);
  const [bioInput, setBioInput] = useState(userBio);

  // Custom Interest Tags State
  const [userTags, setUserTags] = useState<string[]>(() => {
    const stored = localStorage.getItem('heya-profile-tags');
    return stored ? JSON.parse(stored) : [
      'Local-First Networks', 
      'Sovereign Architecture', 
      'Oasis Protocol', 
      'Interactive Canvas', 
      'Zero-Telemetry Sync', 
      'Decentralized Buffer Alignment',
      'Pixel Crafting'
    ];
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Reflection logs state
  const [logs, setLogs] = useState<ReflectionLog[]>(() => {
    const stored = localStorage.getItem('heya-profile-logs');
    if (stored) return JSON.parse(stored);
    return [
      { id: '1', timestamp: '2026-06-11 00:15', content: isEn ? 'Verified SHA-256 local-first index matrices.' : '确认 SHA-256 本地优先索引矩阵。', category: 'SYSTEM' },
      { id: '2', timestamp: '2026-06-11 01:23', content: isEn ? 'Established peer handshake protocol with Zürich Node 4.' : '与苏黎世 4 号节点建立对等握手协议。', category: 'NETWORK' },
      { id: '3', timestamp: '2026-06-11 01:45', content: isEn ? 'Synchronized local buffer arrays with static Oasis assets.' : '将本地缓冲区数据同静态 Oasis 资产进行并轨。', category: 'SYNC' }
    ];
  });
  const [newLogInput, setNewLogInput] = useState('');

  // Nuptune node ping state simulation
  const [pingState, setPingState] = useState<'idle' | 'linking' | 'success'>('idle');
  const [pingLogs, setPingLogs] = useState<string[]>([]);

  // Search & Categories for Integration Hub
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      content: isEn 
        ? "Hello ceaserzhao! I am your Hearth Integration Coach. I am here to help you cross-authenticate your local buffers with active secure OAuth endpoints. Which tool do you want to bind next?"
        : "你好 ceaserzhao！我是赫斯集成助手。我在这里协助您将本地缓冲区同各类外部 OAuth 端点进行跨平台绑定。接下来我们准备连通哪款工具？",
      timestamp: '23:59'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Big integration list to showcase the sheer volume of integration capability
  const [apps, setApps] = useState<IntegrationApp[]>([
    { id: 'github', name: 'GitHub Enterprise', category: 'developer', icon: Github, description: 'Sync commit histories, PR hooks, and codespace workflows.', connected: true, color: 'bg-slate-900', logoColor: 'text-white', apiEndpoints: 34 },
    { id: 'slack', name: 'Slack Mesh', category: 'communication', icon: Slack, description: 'Route push notifications and telemetry warnings to dynamic channels.', connected: true, color: 'bg-[#4a154b]', logoColor: 'text-[#e01e5a]', apiEndpoints: 18 },
    { id: 'spotify', name: 'Spotify Ambient', category: 'creative', icon: Music, description: 'Feed rhythm BPM to spatial dynamic layouts.', connected: false, color: 'bg-emerald-500', logoColor: 'text-white', apiEndpoints: 12 },
    { id: 'notion', name: 'Notion Database', category: 'productivity', icon: FileText, description: 'Import workspace wiki boards and structured tabular documents.', connected: false, color: 'bg-neutral-905', logoColor: 'text-white', apiEndpoints: 22 },
    { id: 'zoom', name: 'Zoom Conference', category: 'communication', icon: Video, description: 'Direct audio synthesis feedback hooks and video presence signals.', connected: false, color: 'bg-blue-600', logoColor: 'text-white', apiEndpoints: 9 },
    { id: 'gmail', name: 'Google Mail Services', category: 'communication', icon: Mail, description: 'P2P secure smtp relay mappings and telemetry reports.', connected: true, color: 'bg-rose-600', logoColor: 'text-white', apiEndpoints: 27 },
    { id: 'gdrive', name: 'Google Drive Files', category: 'productivity', icon: Database, description: 'Hot-sync static markdown files, vector embeddings, and assets.', connected: false, color: 'bg-amber-500', logoColor: 'text-white', apiEndpoints: 45 },
    { id: 'figma', name: 'Figma Dev API', category: 'creative', icon: Chrome, description: 'Import visual vectors, responsive variables, and canvas coordinates.', connected: false, color: 'bg-orange-600', logoColor: 'text-white', apiEndpoints: 15 },
    { id: 'linear', name: 'Linear Tracker', category: 'developer', icon: Settings, description: 'Import backlog lists, sprint cycles, and software logs.', connected: false, color: 'bg-violet-650', logoColor: 'text-violet-500', apiEndpoints: 31 },
    { id: 'gitlab', name: 'GitLab Sovereign', category: 'developer', icon: Shield, description: 'Trigger private CI/CD triggers on cluster deployments.', connected: false, color: 'bg-orange-600', logoColor: 'text-white', apiEndpoints: 19 },
    { id: 'discord', name: 'Discord Webhooks', category: 'communication', icon: MessageSquare, description: 'Broadcast client-peer network status directly into guild charts.', connected: true, color: 'bg-[#5865F2]', logoColor: 'text-white', apiEndpoints: 14 },
    { id: 'strava', name: 'Strava Health API', category: 'productivity', icon: Compass, description: 'Inject physical telemetry metrics directly into local cards.', connected: false, color: 'bg-orange-700', logoColor: 'text-white', apiEndpoints: 8 },
    { id: 'stripe', name: 'Stripe Gateway', category: 'marketing', icon: Zap, description: 'Manage merchant subscriptions, invoices, and ledger statuses.', connected: false, color: 'bg-[#635BFF]', logoColor: 'text-white', apiEndpoints: 52 },
    { id: 'trello', name: 'Trello Boards', category: 'productivity', icon: FileText, description: 'Kanban cards mapping directly to physical layout quadrants.', connected: false, color: 'bg-blue-600', logoColor: 'text-white', apiEndpoints: 11 },
    { id: 'asana', name: 'Asana Flow', category: 'productivity', icon: CheckCircle2, description: 'Coordinate timeline gantt tasks into micro-deliverables.', connected: false, color: 'bg-rose-500', logoColor: 'text-white', apiEndpoints: 17 },
    { id: 'hubspot', name: 'HubSpot Sync', category: 'marketing', icon: Globe, description: 'Push client engagement metrics and outbound statistics.', connected: false, color: 'bg-amber-600', logoColor: 'text-white', apiEndpoints: 38 },
  ]);

  // Persist values on change
  useEffect(() => {
    localStorage.setItem('heya-profile-name', userName);
    localStorage.setItem('heya-profile-location', userLocation);
    localStorage.setItem('heya-profile-title', userTitle);
    localStorage.setItem('heya-profile-bio', userBio);
  }, [userName, userLocation, userTitle, userBio]);

  const handleSaveBio = () => {
    (window as any).playTactileChime?.('success');
    setUserName(nameInput);
    setUserLocation(locationInput);
    setUserTitle(titleInput);
    setUserBio(bioInput);
    setIsEditingBio(false);

    window.dispatchEvent(new CustomEvent('heya-toast', { 
      detail: { 
        message: isEn 
          ? "Sovereign biography records updated successfully."
          : "主权个人履历档案已成功写入本地缓冲区。"
      } 
    }));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    if (userTags.includes(newTagInput.trim())) return;

    (window as any).playTactileChime?.('click');
    const updated = [...userTags, newTagInput.trim()];
    setUserTags(updated);
    localStorage.setItem('heya-profile-tags', JSON.stringify(updated));
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    (window as any).playTactileChime?.('click');
    const updated = userTags.filter(t => t !== tagToRemove);
    setUserTags(updated);
    localStorage.setItem('heya-profile-tags', JSON.stringify(updated));
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogInput.trim()) return;

    (window as any).playTactileChime?.('success');
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newLog: ReflectionLog = {
      id: `${Date.now()}`,
      timestamp: dateStr,
      content: newLogInput.trim(),
      category: 'MANUAL'
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('heya-profile-logs', JSON.stringify(updated));
    setNewLogInput('');
  };

  const handleClearLog = (id: string) => {
    (window as any).playTactileChime?.('click');
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem('heya-profile-logs', JSON.stringify(updated));
  };

  // Nuptune orbital handshake telemetry simulation
  const handlePingNuptune = () => {
    (window as any).playTactileChime?.('chord');
    setPingState('linking');
    setPingLogs([]);

    const steps = [
      isEn ? '> Initiating peer socket on local interface linked with oasis client...' : '> 在 Oasis 客户端启动本地接口的对等套接字...',
      isEn ? '> Resolving physical coordinates to Neptunian orbit network arrays...' : '> 解析物理空间坐标至海王星轨域阵列...',
      isEn ? '> Encrypting handshake frames using local sovereign Curve25519 key...' : '> 使用本地自主 Curve25519 密钥对握手帧进行端对端加密...',
      isEn ? '> Handshake established with Nuptune Orbit Hub 9 (Latency: 221ms)' : '> 与海王星（Nuptune）9号轨道枢纽握手成功 (往返延迟: 221ms)',
      isEn ? '> Integrity metrics verification pass: 99.98% Parity Harmony.' : '> 完整度验证通过: 99.98% 一致性和谐率。',
      isEn ? '✓ LINK ACTIVE (SOVEREIGN PEER-TO-PEER COHERENCE)' : '✓ 链接激活 (主权点对点一致性通畅)'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setPingLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setPingState('success');
          (window as any).playTactileChime?.('success');
        } else {
          (window as any).playTactileChime?.('click');
        }
      }, (idx + 1) * 800);
    });
  };

  const handleToggleConnect = (id: string) => {
    (window as any).playTactileChime?.('click');
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        const nextState = !app.connected;
        window.dispatchEvent(new CustomEvent('heya-toast', { 
          detail: { 
            message: isEn 
              ? `${app.name} binding state updated: ${nextState === true ? 'CONNECTED (Sovereign Session)' : 'REMOVED'}`
              : `${app.name} 绑定状态已更新：${nextState === true ? '对等鉴权通过' : '连接已断开'}`
          } 
        }));
        return { ...app, connected: nextState };
      }
      return app;
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    (window as any).playTactileChime?.('click');
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate smart interactive reply
    setTimeout(() => {
      let replyContent = "";
      const lower = userMsg.content.toLowerCase();

      if (lower.includes('github') || lower.includes('git')) {
        replyContent = isEn 
          ? "GitHub Enterprise handles are verified on Oermos node Zürich. Active webhook feeds 34 endpoints smoothly. Type 'sync code' if you want me to index active repositories into the Forge."
          : "GitHub 认证已通过 Zurich 网关验证。当前动态流推送支持 34 个 API 端点。若需将代码库加入 Forge 体系，请输入 '同步代码库' 指令。";
      } else if (lower.includes('nuptune') || lower.includes('neptune') || lower.includes('海王星')) {
        replyContent = isEn
          ? "Nuptune (Neptune Space Orbit Hub 9) is your primary localized physical anchor node. Connecting to it allows zero-telemetry WebRTC loops to secure your digital sovereignty."
          : "海王星（Nuptune 轨道枢纽 9）是您的主要本地化物理锚点节点。与之连接能够激活零遥测的 WebRTC 环路，确保您的数字自主权。";
      } else if (lower.includes('how') || lower.includes('help') || lower.includes('怎么') || lower.includes('帮助')) {
        replyContent = isEn
          ? "Each application toggle generates an ephemeral local encryption token. Simply slide the bind toggle to establish instantaneous WebRTC routing across your local workbench."
          : "只需点击列表中对应服务卡片的开关，系统将自动基于本地生成一次性加密 Token 连通外部端点，无需经由任何云服务器缓存。";
      } else {
        replyContent = isEn
          ? `Received your handshake prompt regarding your local configuration! We currently offer 16+ production integrations. I have marked this query directly in your reflection buffers.`
          : `已记录您对外部集成的提问！我们目前提供多达 16 款高兼容度的外部绑定选择。相关日志已成功注入您的本地状态缓冲区。`;
      }

      setIsTyping(false);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      (window as any).playTactileChime?.('success');
    }, 1200);
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fafbfc] font-sans h-full relative select-text">
      
      {/* Scrollable Workspace Wrapper */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 select-text">

        {/* ==================== SECTION 1: THE USER BIOGRAPHY CORE (MAIN FOCUS) ==================== */}
        <div id="sovereign-biography-chassis" className="bg-white border border-[#eef2f6] rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
          
          {/* Subtle gradient glowing accent indicating Neptune connection state */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full pointer-events-none" />

          {/* Top block layout: Profile header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10 w-full lg:w-auto">
              
              {/* Premium pixel avatar with Glasses and "Oasis" hoodie */}
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-indigo-100 shadow-md relative shrink-0 group">
                <img 
                  src="/src/assets/images/ceaserzhao_avatar_1781142623800.png" 
                  alt="ceaserzhao"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 text-[8px] font-mono font-black text-center text-white py-0.5 tracking-wider">
                  OASIS ID
                </div>
              </div>

              {/* Bio Titles with Quick Display & Edit Switch */}
              <div className="space-y-2 flex-grow">
                {isEditingBio ? (
                  <div className="space-y-2 mt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Username</label>
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Title</label>
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">{userName}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-mono text-[9px] font-black uppercase tracking-wider">
                        {isEn ? 'SOVEREIGN NODE MASTER' : '对等网络节点主控'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-indigo-600 font-mono">{userTitle}</p>
                  </div>
                )}
                
                {/* Meta details (Nuptune, Joined Date, etc.) */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-550 font-semibold text-xs">
                  {isEditingBio ? (
                    <div className="space-y-0.5 w-full max-w-[200px]">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Location Anchor</label>
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(setLocationInput && ((e) => setLocationInput(e.target.value)))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      <span>{userLocation} / Solar Orbit Hub 9</span>
                    </span>
                  )}
                  
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {isEn ? 'Created June 2026' : '加入于 2026 年 6 月'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-2 z-10 w-full sm:w-auto self-stretch sm:self-auto justify-end sm:justify-start">
              {isEditingBio ? (
                <>
                  <button
                    onClick={() => {
                      (window as any).playTactileChime?.('click');
                      setIsEditingBio(false);
                      // revert
                      setNameInput(userName);
                      setLocationInput(userLocation);
                      setTitleInput(userTitle);
                      setBioInput(userBio);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Cancel' : '取消'}</span>
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Save Biography' : '保存履历'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    (window as any).playTactileChime?.('click');
                    setIsEditingBio(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 hover:border-slate-350 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isEn ? 'Edit Bio Config' : '修改个人长文履历'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Main Biography long-text statement details */}
          <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column A: Long Text & Tags (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-[10px] tracking-wider font-mono font-black text-slate-400 uppercase flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                  {isEn ? 'Core Self-Reflection Statement' : '对等网络空间核心叙事 (BIOGRAPHY)'}
                </h3>
                
                {isEditingBio ? (
                  <textarea
                    rows={4}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder={isEn ? "Describe your system philosophies..." : "描述您的系统开发哲学..."}
                  />
                ) : (
                  <div className="bg-gradient-to-r from-indigo-50/20 via-slate-50/50 to-transparent p-5 rounded-2xl border border-slate-100 text-slate-705 leading-relaxed text-[12.5px] font-semibold text-slate-700 relative italic">
                    <span className="absolute left-2.5 top-2.5 text-indigo-200 text-4xl font-serif pointer-events-none">“</span>
                    <p className="pl-6 select-text">
                      {userBio}
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic tag management */}
              <div className="space-y-3">
                <h4 className="text-[10px] tracking-wider font-mono font-black text-slate-400 uppercase">
                  {isEn ? 'Focus Sectors & Alignment Tags' : '关注领域与技术阵列标签'}
                </h4>
                
                <div className="flex flex-wrap gap-1.5">
                  {userTags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10.5px] px-2.5 py-1 bg-indigo-50/50 text-indigo-755 border border-indigo-100 rounded-lg font-bold group select-none transition-all duration-150"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-indigo-400 hover:text-indigo-600 focus:outline-none transition-colors ml-1"
                        title={isEn ? "Remove Tag" : "移除标签"}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Add Tag Input Inline Form */}
                  <form onSubmit={handleAddTag} className="inline-flex items-center">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder={isEn ? "+ Add align tag" : "+ 新增对齐特征"}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg px-2 py-0.5 text-[10.5px] font-semibold text-slate-700 placeholder-slate-450 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:bg-white w-28 transition-all"
                    />
                  </form>
                </div>
              </div>

            </div>

            {/* Column B: Nuptune Network Realtime Telemetry Simulation (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Interactive Neptunian Test Panel */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4 font-mono select-none">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                      NUPTUNE LINK DIAGNOSTICS
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400">
                    OASIS-V3
                  </span>
                </div>

                <p className="text-[10px] leading-relaxed text-slate-400 font-semibold">
                  {isEn 
                    ? 'Verify localized node handshakes with your orbital anchor. Run symmetric route checks directly inside your browser container.'
                    : '对部署在海王星（Nuptune）轨道上的物理锚点进行对等握手，可在浏览器沙箱内测试对等延迟与对称加解密速度。'}
                </p>

                {pingState === 'idle' ? (
                  <button
                    onClick={handlePingNuptune}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer text-center"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Ping Nuptune Node Router' : '激活并测试海王星锚点'}</span>
                  </button>
                ) : (
                  <div className="bg-black/50 border border-slate-800 rounded-xl p-3 text-[9px] text-slate-300 space-y-1.5 h-36 overflow-y-auto">
                    {pingLogs.map((logLine, index) => (
                      <div key={index} className="leading-relaxed whitespace-pre-wrap">
                        {logLine}
                      </div>
                    ))}
                    {pingState === 'linking' && (
                      <div className="flex items-center gap-1 text-indigo-400 animate-pulse">
                        <span className="w-1 h-3 bg-indigo-400 animate-bounce" />
                        <span>[handshaking...]</span>
                      </div>
                    )}
                  </div>
                )}

                {pingState === 'success' && (
                  <button
                    onClick={() => {
                      (window as any).playTactileChime?.('click');
                      setPingState('idle');
                      setPingLogs([]);
                    }}
                    className="w-full py-1 text-center text-[9px] font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    {isEn ? 'Reset Link Session' : '重置测试状态'}
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* User's Sovereign Reflection Stream Board */}
          <div className="mt-4 pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-800 tracking-tight uppercase">
                  {isEn ? "Sovereign Reflections Board" : "主权者研制反射纪要 (SYSTEM LOGS)"}
                </h4>
                <p className="text-[10px] text-slate-450 font-semibold mt-0.5">
                  {isEn 
                    ? "Log direct design reflections or system coordinates instantly in your local session cache." 
                    : "即时在本地会话缓存中记录系统研制要点、物理节点并轨日志或开发心得。"}
                </p>
              </div>
            </div>

            {/* Quick manual logging form */}
            <form onSubmit={handleAddLog} className="flex gap-2">
              <input
                type="text"
                value={newLogInput}
                onChange={(e) => setNewLogInput(e.target.value)}
                placeholder={isEn ? "Add an audit note, e.g., 'Validated Frankfurt network routing...'" : "新增系统纪要，例：'确认了海王星锚点至 Zürich 轨道握手成功'"}
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-850 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!newLogInput.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  newLogInput.trim()
                    ? 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? "Log Entry" : "注入日志"}</span>
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {logs.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3.5 rounded-2xl relative flex flex-col justify-between group transition-all"
                >
                  <button
                    onClick={() => handleClearLog(item.id)}
                    className="absolute right-2.5 top-2.5 p-1 text-slate-350 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                    title={isEn ? "Delete Log" : "删除日志"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1.5 pr-4">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black tracking-wider bg-indigo-50 text-indigo-600 block w-max uppercase">
                      {item.category}
                    </span>
                    <p className="text-[11px] text-slate-700 font-semibold leading-relaxed select-text">
                      {item.content}
                    </p>
                  </div>

                  <span className="text-[8px] font-mono text-slate-400 mt-2 block pt-1.5 border-t border-slate-50">
                    {item.timestamp}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ==================== SECTION 2: THE EPHEMERAL APP BINDINGS CHASSIS (SHANNON GRID) ==================== */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase font-mono">
                {isEn ? 'EPHEMERAL APP BINDINGS CHASSIS' : '跨界服务对等绑定中心 (INTEGRATION HUB)'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                {isEn 
                  ? 'We support more local-to-cloud bindings than any other workspace. Connect your ecosystem with absolute zero remote database caching.' 
                  : '我们在无中心构架下提供最为繁茂的外设应用绑定目录。点击开关即可借助一跳中转完成数据并轨同步。'}
              </p>
            </div>

            {/* Quick Filter tabs & search input */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search 16+ apps..." : "检索 16 种外接部件..."}
                  className="bg-white border border-slate-205 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-805 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold w-full sm:w-48 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick filter strip buttons */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
            {['all', 'developer', 'productivity', 'communication', 'creative', 'marketing'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  (window as any).playTactileChime?.('click');
                }}
                className={`px-3 py-1.2 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 text-indigo-650 border border-indigo-200'
                    : 'text-slate-400 hover:text-slate-700 bg-transparent border border-transparent hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Large dynamic integration grid: showcases the brand-rich logos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  className={`bg-white border text-left p-4.5 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:border-slate-300 relative group ${
                    app.connected ? 'border-indigo-150 ring-1 ring-indigo-50' : 'border-slate-200/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {/* Brand Logo with exact brand styling */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-1.5 ${app.color} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className={`w-5 h-5 ${app.logoColor}`} />
                      </div>

                      {/* Connection status tag */}
                      <button
                        type="button"
                        onClick={() => handleToggleConnect(app.id)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                          app.connected
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-150 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {app.connected ? (isEn ? 'ON' : '已连通') : (isEn ? 'BIND' : '绑定')}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                        <span>{app.name}</span>
                        {app.connected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </h4>
                      <p className="text-[10.2px] text-slate-450 leading-relaxed font-semibold line-clamp-2">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between text-[8px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                    <span>{app.category}</span>
                    <span className="text-slate-455">{app.apiEndpoints} ENDPOINTS</span>
                  </div>
                </div>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-200 rounded-3xl space-y-2">
                <Database className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-mono font-bold text-slate-455">
                  {isEn ? 'No bindable software matches your active query.' : '没有找到与您的检索相吻合的绑定功能模块。'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. COOLDOWN SECURITY ASSERTS */}
        <div className="bg-slate-900 text-white/90 p-5 rounded-3xl space-y-4 shadow-xl font-sans relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full pointer-events-none select-none" />
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-[10px] tracking-widest font-mono font-black text-indigo-400 uppercase">
              DECENTRALIZED ENCRYPTION STANDARDS (ADR-033)
            </span>
          </div>

          <p className="text-xs font-medium leading-relaxed max-w-3xl text-slate-300">
            Unlike legacy integration portals (Zapier, Make, etc.) that copy client webhook states into central cloud servers, the Hearth core client leverages direct point-to-point symmetric tunnels. Your keys, tokens, and OAuth identifiers remain strictly localized in cryptographic keystores within your hardware memory. No cloud lookup, zero telemetry leakage.
          </p>

          <div className="flex items-center gap-4 text-[9px] font-mono text-slate-400 border-t border-white/5 pt-3">
            <span>KEY ENCRYPTION: AES-GCM-256</span>
            <span>✓ HANDSHAKES VERIFIED BY CURVE25519</span>
          </div>
        </div>

      </div>

      {/* --- FLOATING CHAT BUTTON --- */}
      <button
        onClick={() => {
          setIsChatOpen(!isChatOpen);
          (window as any).playTactileChime?.('click');
        }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center cursor-pointer group"
        title={isEn ? "Talk to Coach" : "联系同步顾问"}
      >
        {isChatOpen ? <X className="w-6 h-6 animate-spin-slow" /> : <MessageSquare className="w-6 h-6" />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-black uppercase text-left whitespace-nowrap pl-0 group-hover:pl-2">
          {isEn ? "Talk to Coach" : "同步顾问"}
        </span>
      </button>

      {/* --- IN-PAGE COLLAPSIBLE FLOATING INTEGRATION CHAT DRIFT DRAWER --- */}
      {isChatOpen && (
        <div className="absolute inset-y-0 right-0 w-full sm:w-[380px] bg-white border-l border-slate-200/80 shadow-2xl z-40 flex flex-col justify-between animate-in slide-in-from-right duration-305">
          
          {/* Header block with close icon */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <div>
                <span className="text-xs font-black text-slate-800 tracking-tight block">
                  {isEn ? 'Hearth Coach' : '赫斯系统同步顾问'}
                </span>
                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-black tracking-widest">
                  Active diagnostic peer
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsChatOpen(false);
                (window as any).playTactileChime?.('click');
              }}
              className="p-1 px-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation history block */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 max-w-[85%] text-xs font-semibold leading-relaxed rounded-2xl shadow-xs ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-100 text-slate-750 rounded-bl-none border border-slate-200/50'
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {/* Simulated typing dot animation */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 px-3.5 bg-slate-100 rounded-full w-20 text-slate-450 self-start animate-pulse">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Form message submission */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isEn ? "Ask coach about bindings..." : "向顾问咨询，如 'GitHub端点怎么用'"}
              className="flex-1 bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-455 focus:outline-none focus:ring-1 focus:ring-indigo-550 font-semibold"
              required
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                newMessage.trim() 
                  ? 'bg-indigo-650 hover:bg-indigo-700 text-white active:scale-95 shadow-sm shadow-indigo-650/15'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
