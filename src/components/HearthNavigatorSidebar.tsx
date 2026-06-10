import React, { useState } from 'react';
import { 
  Search, 
  Grid, 
  Plus, 
  Compass, 
  Clock, 
  Cpu, 
  Terminal, 
  SlidersHorizontal,
  Link2,
  Trash2,
  Activity,
  Code,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { NodeData, NodeType } from '../types';

interface HearthNavigatorSidebarProps {
  nodes: NodeData[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  language: 'en' | 'zh';
  onAddNodeClick: () => void;
}

const t = {
  en: {
    sidebarHeader: "Component Registry",
    searchPlaceholder: "Search components...",
    all: "All Components",
    project: "Clusters",
    todo: "Pipelines",
    agent: "Agents",
    muse: "Sandboxes",
    resource: "Assets",
    emptyList: "No matching components found.",
    addNode: "Register Node",
    totalNodes: "Sovereign Nodes"
  },
  zh: {
    sidebarHeader: "拓扑组件库 (Directory)",
    searchPlaceholder: "过滤搜索节点特质或标题...",
    all: "全部主权",
    project: "规划簇群 (Clusters)",
    todo: "流线管道 (Pipelines)",
    agent: "决策代理 (Agents)",
    muse: "思想沙盒 (Sandboxes)",
    resource: "代码模块 (Assets)",
    emptyList: "未找到符合的拓扑组件。",
    addNode: "新增节点",
    totalNodes: "核心拓扑节点"
  }
};

export default function HearthNavigatorSidebar({
  nodes,
  selectedNodeId,
  setSelectedNodeId,
  language,
  onAddNodeClick
}: HearthNavigatorSidebarProps) {
  const lVal = t[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNodes = nodes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return <Grid className="w-4 h-4 text-indigo-500 fill-indigo-200/20" />;
      case 'todo': return <Clock className="w-4 h-4 text-emerald-500" />;
      case 'agent': return <Terminal className="w-4 h-4 text-purple-500" />;
      case 'muse': return <Compass className="w-4 h-4 text-pink-500" />;
      default: return <Code className="w-4 h-4 text-amber-500" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'project': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'todo': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'agent': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'muse': return 'bg-pink-50 text-pink-700 border-pink-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-5 h-full flex flex-col justify-between">
      
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Header Indicator */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Activity className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>{lVal.sidebarHeader}</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-bold font-mono">
              {lVal.totalNodes}: {nodes.length}
            </span>
          </div>
          
          <button
            type="button"
            onClick={onAddNodeClick}
            className="p-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all border border-indigo-200/60 active:scale-95 flex items-center gap-1 font-black text-[10px]"
            title={lVal.addNode}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lVal.addNode}</span>
          </button>
        </div>

        {/* Unified Search Input */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={lVal.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700"
          />
        </div>

        {/* Filter Pill Badges */}
        <div className="flex gap-1 overflow-x-auto pb-1.5 shrink-0 scrollbar-none custom-scroll-x flex-nowrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all border whitespace-nowrap active:scale-95 ${
              filterType === 'all' 
                ? 'bg-slate-900 border-slate-950 text-white shadow' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {lVal.all}
          </button>
          {['project', 'todo', 'agent', 'muse', 'resource'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all border uppercase whitespace-nowrap active:scale-95 ${
                filterType === type 
                  ? 'bg-slate-900 border-slate-900 text-white shadow' 
                  : 'bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100'
              }`}
            >
              {lVal[type] || type}
            </button>
          ))}
        </div>

        {/* Components Feed List container styled as groupable collapsible accordion sections */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-3 custom-scroll">
          {filteredNodes.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-[10px] font-bold">
              {lVal.emptyList}
            </div>
          ) : (
            <HearthSidebarGroupedList 
              filteredNodes={filteredNodes}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              getTypeIcon={getTypeIcon}
              getBadgeStyle={getBadgeStyle}
              language={language}
            />
          )}
        </div>

      </div>
    </div>
  );
}

interface HearthSidebarGroupedListProps {
  filteredNodes: NodeData[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  getTypeIcon: (type: string) => React.ReactNode;
  getBadgeStyle: (type: string) => string;
  language: 'en' | 'zh';
}

function HearthSidebarGroupedList({
  filteredNodes,
  selectedNodeId,
  setSelectedNodeId,
  getTypeIcon,
  getBadgeStyle,
  language
}: HearthSidebarGroupedListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    project: false,
    todo: false,
    agent: false,
    muse: false,
    resource: false
  });

  const categories = [
    { id: 'project', en: 'Clusters', zh: '规划簇群 (Clusters)' },
    { id: 'todo', en: 'Pipelines', zh: '流线管道 (Pipelines)' },
    { id: 'agent', en: 'Agents', zh: '决策代理 (Agents)' },
    { id: 'muse', en: 'Sandboxes', zh: '思想沙盒 (Sandboxes)' },
    { id: 'resource', en: 'Assets', zh: '代码模块 (Assets)' }
  ];

  const handleToggleGroup = (groupId: string) => {
    (window as any).playTactileChime?.('click');
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const catNodes = filteredNodes.filter(n => n.type === cat.id);
        if (catNodes.length === 0) return null;

        const isCollapsed = collapsedGroups[cat.id] || false;
        const displayName = language === 'en' ? cat.en : cat.zh;

        return (
          <div key={cat.id} className="space-y-1.5 border-b border-slate-100 pb-2">
            {/* Collapsible Accordion Folder Header */}
            <div 
              onClick={() => handleToggleGroup(cat.id)}
              className="flex justify-between items-center px-1.5 py-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-slate-500 hover:text-slate-900 group select-none"
            >
              <div className="flex items-center gap-1.5 text-xs font-black tracking-wide font-mono">
                <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                  {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
                <span className="opacity-80 group-hover:opacity-100">
                  {displayName}
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 font-mono text-[9px] font-bold rounded-md group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                {catNodes.length}
              </span>
            </div>

            {/* List of items inside this collapsed group */}
            {!isCollapsed && (
              <div className="space-y-1.5 pl-2 animate-in fade-in-30 duration-200">
                {catNodes.map((n) => {
                  const isSelected = selectedNodeId === n.id;
                  const hasBinders = n.binders && n.binders.length > 0;
                  const hasWires = n.connections && n.connections.length > 0;

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        (window as any).playTactileChime?.('click');
                        setSelectedNodeId(n.id);
                      }}
                      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-500/10' 
                          : 'bg-white border-slate-150 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="shrink-0">
                            {getTypeIcon(n.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-black tracking-tight text-slate-800 block truncate leading-tight">
                              {n.title}
                            </span>
                            <span className="text-[8.5px] font-mono text-slate-400 block mt-0.5 uppercase tracking-wider font-extrabold">
                              COORDS: X:{n.x} Y:{n.y}
                            </span>
                          </div>
                        </div>

                        {/* Node level indicators */}
                        <div className="flex gap-1 items-center shrink-0">
                          {hasBinders && (
                            <span className="px-1 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded border border-indigo-100" title="Physical Binders Linked">
                              🔒 Host
                            </span>
                          )}
                          {hasWires && (
                            <span className="px-1 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-mono font-black rounded border border-amber-100" title="Wired Links Connections">
                              +{n.connections.length}W
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tiny progress inline metrics */}
                      {n.progress > 0 && (
                        <div className="mt-2 space-y-0.5">
                          <div className="flex justify-between text-[7px] font-mono font-black text-slate-400">
                            <span>PROGRESS</span>
                            <span>{n.progress}%</span>
                          </div>
                          <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                              style={{ width: `${n.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
