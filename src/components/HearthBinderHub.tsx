import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  X, 
  Trash2, 
  RefreshCw, 
  Folder, 
  Cloud, 
  Code, 
  Link 
} from 'lucide-react';
import { NodeData, Binder, BinderType } from '../types';

interface HearthBinderHubProps {
  selectedNode: NodeData;
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  language: 'en' | 'zh';
}

const t = {
  en: {
    bindersHeader: "External Node Binder Map",
    bindersSub: "Map nodes to local directory handles, GitHub repositories, or Cloudflare R2 Buckets.",
    addBinderBtn: "Register New Binder Link",
    binderTypeLabel: "Platform System Type",
    binderPathLabel: "Target Endpoint or Local Path",
    localFolder: "Local Filesystem Path",
    cfR2: "Cloudflare R2 Object Storage",
    githubRepo: "GitHub Master Repository Link",
    customApi: "Custom Webhook HTTP Relay",
    testConn: "Test Connection Probe",
    syncSuccess: "Host sync handshake completed successfully!",
    emptyBinders: "No external physical binders map this node coordinate."
  },
  zh: {
    bindersHeader: "设备/外部空间绑定映射 (Binders)",
    bindersSub: "将本组件节点挂载至本地物理位置（例如某目录）或云平台（例如 Cloudflare R2 / GitHub）。",
    addBinderBtn: "绑定新的外部位置 (Binder)",
    binderTypeLabel: "绑定的服务系统类型",
    binderPathLabel: "目标目录路径 / 桶名 / HTTP 路径",
    localFolder: "本机物理文件夹 (Local Folder)",
    cfR2: "Cloudflare R2 对象存储桶",
    githubRepo: "GitHub 代码托管仓库",
    customApi: "自定义三方 API 同步接口",
    testConn: "双向校验同步",
    syncSuccess: "与此物理绑定端点的同步探测成功！数据校验正常，通信畅通。",
    emptyBinders: "本组拓扑坐标未建立硬件终端或 R2/GitHub 挂载绑定。"
  }
};

export default function HearthBinderHub({
  selectedNode,
  nodes,
  setNodes,
  language
}: HearthBinderHubProps) {
  const lVal = t[language];

  const [isNewBinderFormOpen, setIsNewBinderFormOpen] = useState(false);
  const [newBinderType, setNewBinderType] = useState<BinderType>('local_folder');
  const [newBinderName, setNewBinderName] = useState('');
  const [newBinderPath, setNewBinderPath] = useState('');
  const [newBinderSecret, setNewBinderSecret] = useState('');
  const [newBinderRegion, setNewBinderRegion] = useState('');
  const [syncingBinderId, setSyncingBinderId] = useState<string | null>(null);

  const handleAddBinder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBinderName.trim() || !newBinderPath.trim()) return;

    (window as any).playTactileChime?.('click');

    const freshBinder: Binder = {
      id: `binder-${Date.now()}`,
      type: newBinderType,
      name: newBinderName.trim(),
      path: newBinderPath.trim(),
      secretKey: newBinderSecret.trim() || undefined,
      region: newBinderRegion.trim() || undefined,
      status: 'active',
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const currentBinders = n.binders || [];
        return {
          ...n,
          binders: [...currentBinders, freshBinder],
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));

    // Reset fields
    setNewBinderName('');
    setNewBinderPath('');
    setNewBinderSecret('');
    setNewBinderRegion('');
    setIsNewBinderFormOpen(false);

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Sovereign binder link registered.' : '外部绑定关联设备成功注入。', 
        type: 'success' 
      }
    }));
  };

  const handleDeleteBinder = (binderId: string) => {
    (window as any).playTactileChime?.('alert');

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        const currentBinders = n.binders || [];
        return {
          ...n,
          binders: currentBinders.filter(b => b.id !== binderId),
          updatedAt: '2026/06/10'
        };
      }
      return n;
    }));

    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' ? 'Binder mapping removed.' : '绑定设备连接已注销。', 
        type: 'info' 
      }
    }));
  };

  const handleSyncBinder = (binderId: string) => {
    (window as any).playTactileChime?.('success');
    setSyncingBinderId(binderId);

    setTimeout(() => {
      setNodes(prev => prev.map(n => {
        if (n.id === selectedNode.id) {
          const currentBinders = n.binders || [];
          return {
            ...n,
            binders: currentBinders.map(b => {
              if (b.id === binderId) {
                return {
                  ...b,
                  status: 'synced',
                  lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                };
              }
              return b;
            }),
            updatedAt: '2026/06/10'
          };
        }
        return n;
      }));
      setSyncingBinderId(null);

      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: lVal.syncSuccess, 
          type: 'success' 
        }
      }));
    }, 1500);
  };

  return (
    <div className="bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-center pb-2 border-b border-indigo-950/40">
        <div>
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>{lVal.bindersHeader}</span>
          </h3>
          <p className="text-[10px] text-slate-550 font-bold mt-1 leading-relaxed">
            {lVal.bindersSub}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            (window as any).playTactileChime?.('click');
            setIsNewBinderFormOpen(!isNewBinderFormOpen);
          }}
          className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 rounded-xl transition-all border border-indigo-500/20 active:scale-95"
          title={lVal.addBinderBtn}
        >
          {isNewBinderFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Add Binder form */}
      {isNewBinderFormOpen && (
        <form onSubmit={handleAddBinder} className="bg-[#121320] border border-indigo-950/40 p-4 rounded-2xl space-y-3 animate-in slide-in-from-top-2 duration-200 relative z-20">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Binder Display Name</label>
            <input
              type="text"
              placeholder="e.g. Local Component Cache / Cloudflare Assets"
              value={newBinderName}
              onChange={(e) => setNewBinderName(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-8 w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{lVal.binderTypeLabel}</label>
            <select
              value={newBinderType}
              onChange={(e) => setNewBinderType(e.target.value as BinderType)}
              className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-250 font-bold focus:outline-none"
            >
              <option value="local_folder">📁 {lVal.localFolder}</option>
              <option value="cloudflare_r2">⚡ {lVal.cfR2}</option>
              <option value="github_repo">🐙 {lVal.githubRepo}</option>
              <option value="custom_api">🔗 {lVal.customApi}</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{lVal.binderPathLabel}</label>
            <input
              type="text"
              placeholder={
                newBinderType === 'local_folder' ? '/Users/admin/projects/h-core/'
                : newBinderType === 'cloudflare_r2' ? 'r2://bucket-name.r2.cloudflarestorage.com'
                : newBinderType === 'github_repo' ? 'https://github.com/h-org/core-v1'
                : 'https://api.domain.com/v1/sync'
              }
              value={newBinderPath}
              onChange={(e) => setNewBinderPath(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {newBinderType === 'cloudflare_r2' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Access Key ID</label>
                <input
                  type="text"
                  placeholder="Optional Key"
                  value={newBinderSecret}
                  onChange={(e) => setNewBinderSecret(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Region</label>
                <input
                  type="text"
                  placeholder="auto/us-east-1"
                  value={newBinderRegion}
                  onChange={(e) => setNewBinderRegion(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewBinderFormOpen(false)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-[10px] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-lg shadow active:scale-95 transition-all"
            >
              Confirm Bind
            </button>
          </div>
        </form>
      )}

      {/* Binders List */}
      <div className="space-y-3 relative z-10 max-h-[350px] overflow-y-auto pr-1">
        {(!selectedNode.binders || selectedNode.binders.length === 0) ? (
          <div className="p-5 rounded-2xl border border-dashed border-slate-900 text-center text-[10px] text-slate-500 font-medium">
            {lVal.emptyBinders}
          </div>
        ) : (
          selectedNode.binders.map((binder) => {
            const isSyncing = syncingBinderId === binder.id;
            return (
              <div key={binder.id} className="bg-[#121320] border border-slate-900/80 p-3.5 rounded-2xl space-y-2.5 transition-all hover:border-slate-800/80">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/10 border border-indigo-505/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      {binder.type === 'local_folder' && <Folder className="w-4 h-4" />}
                      {binder.type === 'cloudflare_r2' && <Cloud className="w-4 h-4" />}
                      {binder.type === 'github_repo' && <Code className="w-4 h-4" />}
                      {binder.type === 'custom_api' && <Link className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10.5px] font-black text-slate-200 block truncate leading-tight">{binder.name}</span>
                      <span className="text-[9px] font-mono text-slate-500 block truncate mt-0.5" title={binder.path}>
                        {binder.path}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-black uppercase tracking-wider ${
                      binder.status === 'synced' ? 'bg-emerald-950/50 text-emerald-450 border border-emerald-550/20' : 'bg-amber-950/50 text-amber-450 border border-amber-550/20'
                    }`}>
                      ● {binder.status}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => handleDeleteBinder(binder.id)}
                      className="p-1 hover:bg-slate-900 text-slate-500 hover:text-red-400 rounded-md transition-all active:scale-90"
                      title="Delete binder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-950/40 text-[8.5px] font-mono">
                  <span className="text-slate-550 font-medium">
                    Sync: {binder.lastSyncedAt || 'N/A'}
                  </span>
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={() => handleSyncBinder(binder.id)}
                    className={`px-2 py-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 font-black tracking-wide border border-indigo-500/20 rounded-lg flex items-center gap-1.5 transition-all ${
                      isSyncing ? 'animate-pulse opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Handshaking...' : lVal.testConn}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
