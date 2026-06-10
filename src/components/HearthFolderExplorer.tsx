/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  FileText, 
  FileJson, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Code, 
  FileCheck, 
  Search,
  Database,
  Play
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  language?: 'typescript' | 'rust' | 'python' | 'go' | 'json' | 'yaml' | 'sql' | 'markdown';
  checksum?: string;
  snippet?: string;
  children?: FileNode[];
}

const fileTrees: Record<string, FileNode[]> = {
  project: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            {
              name: 'RegistryCanvas.tsx',
              type: 'file',
              size: '4.2 KB',
              language: 'typescript',
              checksum: 'SHA256: 4f8a...b1e2',
              snippet: `import React from 'react';\n\nexport default function RegistryCanvas() {\n  return (\n    <svg className="w-full h-full bg-[#020205] relative">\n      <circle cx={50} cy={50} r={10} fill="#6366f1" />\n      {/* Grid Anchor mapping and line wiring algorithms */}\n    </svg>\n  );\n}`
            },
            {
              name: 'HearthSovereignHub.tsx',
              type: 'file',
              size: '8.4 KB',
              language: 'typescript',
              checksum: 'SHA256: 91fa...e2d3',
              snippet: `import { NodeData } from '../types';\n\nexport function HearthSovereignHub({ nodes }: { nodes: NodeData[] }) {\n  console.log("Synchronizing tactile physics with system nodes...");\n  return <div className="p-6 text-indigo-400">Tactile Sovereign Space Grid</div>;\n}`
            }
          ]
        },
        {
          name: 'main.tsx',
          type: 'file',
          size: '1.8 KB',
          language: 'typescript',
          checksum: 'SHA256: a13b...ff21',
          snippet: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`
        },
        {
          name: 'types.ts',
          type: 'file',
          size: '2.5 KB',
          language: 'typescript',
          checksum: 'SHA256: d23e...1e90',
          snippet: `export type NodeType = 'project' | 'todo' | 'agent' | 'muse' | 'resource';\n\nexport interface NodeData {\n  id: string;\n  type: NodeType;\n  title: string;\n  x: number;\n  y: number;\n  progress: number;\n}`
        }
      ]
    },
    {
      name: 'pkg',
      type: 'folder',
      children: [
        {
          name: 'router',
          type: 'folder',
          children: [
            {
              name: 'signal_relay.go',
              type: 'file',
              size: '12.3 KB',
              language: 'go',
              checksum: 'SHA256: 8cb4...99a1',
              snippet: `package router\n\nimport "net/http"\n\nfunc RegisterRelayHandler(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set("Content-Type", "application/json")\n    w.Write([]byte(\`{"status": "decentralized_routing_active"}\`))\n}`
            }
          ]
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      size: '1.4 KB',
      language: 'json',
      checksum: 'SHA256: f2c4...e12a',
      snippet: `{\n  "name": "hearth-sovereign-matrix",\n  "version": "1.0.4",\n  "type": "module",\n  "dependencies": {\n    "react": "^18.3.1",\n    "lucide-react": "^0.435.0"\n  }\n}`
    },
    {
      name: 'vite.config.ts',
      type: 'file',
      size: '0.9 KB',
      language: 'typescript',
      checksum: 'SHA256: e4a3...de32',
      snippet: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 3000, host: '0.0.0.0' }\n});`
    }
  ],
  todo: [
    {
      name: 'pipeline',
      type: 'folder',
      children: [
        {
          name: 'stages',
          type: 'folder',
          children: [
            {
              name: '01_validate.rs',
              type: 'file',
              size: '5.6 KB',
              language: 'rust',
              checksum: 'SHA256: 12ab...cd34',
              snippet: `pub fn validate_pipeline_stage() -> Result<(), CryptoError> {\n    println!("Initiating high-fidelity signature validation...");\n    verify_integrity_checksums()?;\n    Ok(())\n}`
            },
            {
              name: '02_sandbox_exec.rs',
              type: 'file',
              size: '14.2 KB',
              language: 'rust',
              checksum: 'SHA256: d8e1...d3b4',
              snippet: `use std::process::Command;\n\npub fn execute_isolated_sandbox() {\n    println!("Deploying firewalled container sandbox for sovereign task compilation...");\n    Command::new("firejail").arg("--private").spawn().unwrap();\n}`
            }
          ]
        },
        {
          name: 'Cargo.toml',
          type: 'file',
          size: '0.8 KB',
          language: 'yaml',
          checksum: 'SHA256: f1b1...ef4a',
          snippet: `[package]\nname = "hearth-pipeline-runner"\nversion = "0.2.1"\nedition = "2021"\n\n[dependencies]\ntokio = { version = "1.30", features = ["full"] }\nserde = { version = "1.0", features = ["derive"] }`
        }
      ]
    },
    {
      name: 'ci_cd_workflow.yml',
      type: 'file',
      size: '1.2 KB',
      language: 'yaml',
      checksum: 'SHA256: cb12...ffab',
      snippet: `name: Sovereign Pipeline Automation\non:\n  push:\n    branches: [ main ]\njobs:\n  compile_and_audit:\n    runs-on: self-hosted\n    steps:\n    - uses: actions/checkout@v3\n    - name: Run Clang Analyzer\n      run: cargo check --all-features`
    }
  ],
  agent: [
    {
      name: 'prompts',
      type: 'folder',
      children: [
        {
          name: 'system_seed_inst.md',
          type: 'file',
          size: '32.0 KB',
          language: 'markdown',
          checksum: 'SHA256: aa82...19fa',
          snippet: `# Sovereign Cognitive Base Seed\nYou are a decentralized agent residing inside a Hearth sovereign node container.\nMaintain strict offline-first operational parameters.\n- Respect Swiss core typographical styling rules.\n- Refuse to submit telemetry streams to major hyperscalers.`
        },
        {
          name: 'reflexive_loop.json',
          type: 'file',
          size: '4.5 KB',
          language: 'json',
          checksum: 'SHA256: 4f12...ee89',
          snippet: `{\n  "agent_id": "daemon-core-ceaser",\n  "reflexive_rebellion_index": 0.98,\n  "orthodox_fallbacks": [\n    "recompile_dynamic_kernels",\n    "sever_external_handshakes"\n  ]\n}`
        }
      ]
    },
    {
      name: 'daemon',
      type: 'folder',
      children: [
        {
          name: 'scheduler_cron.py',
          type: 'file',
          size: '8.9 KB',
          language: 'python',
          checksum: 'SHA256: de90...23bc',
          snippet: `import time\nimport os\n\ndef pulse_heartbeat_signals():\n    while True:\n        print("[AUTONOMIC DAEMON] Inspecting state vector values...")\n        os.system("/usr/local/bin/pulse-probe --local")\n        time.sleep(30)`
        }
      ]
    },
    {
      name: 'requirements.txt',
      type: 'file',
      size: '0.7 KB',
      language: 'yaml',
      checksum: 'SHA256: b1ea...4e19',
      snippet: `google-genai==0.1.0\npydantic>=2.0\ntokio-probe==0.4\npsutil>=5.8`
    }
  ],
  muse: [
    {
      name: 'sketches',
      type: 'folder',
      children: [
        {
          name: 'creative_outbreak.canvas',
          type: 'file',
          size: '64.2 KB',
          language: 'json',
          checksum: 'SHA256: be43...da87',
          snippet: `{\n  "canvas_version": "2.1.0",\n  "elements": [\n    {"type": "vector_node", "label": "Orthodox Spark Matrix", "weight": 441.5},\n    {"type": "entropy_stream", "amplitude": 99.2}\n  ]\n}`
        },
        {
          name: 'unstructured_draft.txt',
          type: 'file',
          size: '3.1 KB',
          language: 'markdown',
          checksum: 'SHA256: fd89...cc21',
          snippet: `Sovereign Design Ideal Drafts:\n- Eliminate borders whenever layout can guide structure naturally\n- Large Helvetica numbers to represent telemetry indicators\n- Heavy shadows are signs of visual weakness`
        }
      ]
    },
    {
      name: 'model_weights',
      type: 'folder',
      children: [
        {
          name: 'divergence_factor.bin',
          type: 'file',
          size: '240.5 MB',
          language: 'typescript',
          checksum: 'SHA256: da2c...6c12',
          snippet: `// Binary metadata stream (240.5 Megabytes)\n// SHA-256 integrity block successfully parsed.\n// Dynamic Creative Coefficient loaded (Factor: 50/100).`
        }
      ]
    },
    {
      name: 'manifest.toml',
      type: 'file',
      size: '0.4 KB',
      language: 'yaml',
      checksum: 'SHA256: c32c...b1e2',
      snippet: `[sandbox_meta]\ncreator = "ceaserzhao"\nmode = "unpredictable_genesis"\nentropy_seed = 0xcafebabe`
    }
  ],
  resource: [
    {
      name: 'db_migrations',
      type: 'folder',
      children: [
        {
          name: 'v001_initial_schema.sql',
          type: 'file',
          size: '18.4 KB',
          language: 'sql',
          checksum: 'SHA256: aa11...bb52',
          snippet: `CREATE TABLE sovereign_nodes (\n    id VARCHAR(64) PRIMARY KEY,\n    title VARCHAR(256) NOT NULL,\n    coordinate_x INTEGER DEFAULT 150,\n    coordinate_y INTEGER DEFAULT 150,\n    sync_status VARCHAR(32) DEFAULT 'synced'\n);`
        },
        {
          name: 'v002_seeding_data.sql',
          type: 'file',
          size: '42.1 KB',
          language: 'sql',
          checksum: 'SHA256: cc44...dd9e',
          snippet: `INSERT INTO sovereign_nodes (id, title, coordinate_x, coordinate_y, sync_status)\nVALUES \n('demo-cluster-1', 'Gossip Protocol Matrix Host', 240, 180, 'synced'),\n('demo-agent-12', 'Vanguard Oracle Daemon', 560, 420, 'synced');`
        }
      ]
    },
    {
      name: 'cloud_storage',
      type: 'folder',
      children: [
        {
          name: 'r2_bucket_config.json',
          type: 'file',
          size: '2.1 KB',
          language: 'json',
          checksum: 'SHA256: dde3...9021',
          snippet: `{\n  "bucket_name": "hearth-assets-sandbox",\n  "cors_rules": [\n    {\n      "allowed_methods": ["GET", "PUT"],\n      "allowed_origins": ["https://*.asia-southeast1.run.app"]\n    }\n  ]\n}`
        }
      ]
    },
    {
      name: 'credentials.enc',
      type: 'file',
      size: '1.2 KB',
      language: 'yaml',
      checksum: 'SHA256: b332...bda9',
      snippet: `-----BEGIN SOVEREIGN ENCRYPTED PRIVKEY BLOCK-----\nVersion: Hearth Cryptography v1.0\nHash: SHA-256\nReflexive Salt Signature: e2819dfab2\n-----END SOVEREIGN ENCRYPTED PRIVKEY BLOCK-----`
    }
  ]
};

interface HearthFolderExplorerProps {
  nodeType: string;
  nodeTitle: string;
  language: 'en' | 'zh';
}

export default function HearthFolderExplorer({
  nodeType,
  nodeTitle,
  language
}: HearthFolderExplorerProps) {
  const currentTree = fileTrees[nodeType] || fileTrees.project;
  const [collapsedPaths, setCollapsedPaths] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileSearch, setFileSearch] = useState('');

  const loc = {
    en: {
      explorerTitle: 'Active Project Module Filesystem',
      explorerSub: 'Folders and configurations matching this component coordinate layer. Click folders to toggle, click files to audit source scripts.',
      searchPlaceholder: 'Filter project files...',
      previewTitle: 'Sovereign Code Sandbox Audit',
      noFileText: 'Select any project file from the directory tree to projection preview.',
      metaSize: 'PHYSICAL WEIGHT:',
      metaCheck: 'INTEGRITY SIGNATURE:',
      backText: 'Clear Selector',
    },
    zh: {
      explorerTitle: '当前挂载项目工程文件树 (Collapsible Filesystem)',
      explorerSub: '此组件节点物理打包物料文件。可点击折叠/打开文件夹树，选中文件进行安全阻断审计及源码预览。',
      searchPlaceholder: '输入文件名过滤检索...',
      previewTitle: '主机本地代码安全性审计沙盒 (Viewer)',
      noFileText: '请在左侧文件树中选中任何文件，以此加载指纹指认及物理源码审计。',
      metaSize: '物理字节体积:',
      metaCheck: '哈希防篡改指纹:',
      backText: '清除选择'
    }
  };

  const lVal = loc[language];

  // Helper toggle
  const togglePath = (path: string) => {
    setCollapsedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Helper to determine if file node matches filter
  const matchesSearch = (node: FileNode, query: string): boolean => {
    if (!query) return true;
    if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
    if (node.children) {
      return node.children.some(child => matchesSearch(child, query));
    }
    return false;
  };

  // Render tree node recursively
  const renderFileSystemNode = (node: FileNode, currentPath: string, depth: number) => {
    const isFolder = node.type === 'folder';
    const hasChildren = node.children && node.children.length > 0;
    const path = `${currentPath}/${node.name}`;
    const isCollapsed = collapsedPaths[path] || false;

    // Filter node if searching
    if (fileSearch && !matchesSearch(node, fileSearch)) {
      return null;
    }

    const itemPaddingLeft = `${depth * 14}px`;

    return (
      <div key={path} className="select-none text-slate-350">
        <div 
          onClick={() => {
            (window as any).playTactileChime?.('click');
            if (isFolder) {
              togglePath(path);
            } else {
              setSelectedFile(node);
            }
          }}
          className={`flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer group ${
            selectedFile?.name === node.name ? 'bg-indigo-950/40 text-amber-200 border-l-2 border-amber-500' : ''
          }`}
          style={{ paddingLeft: itemPaddingLeft }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isFolder ? (
              <span className="text-slate-400">
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            ) : (
              <span className="w-3.5" />
            )}

            <span className="shrink-0">
              {isFolder ? (
                isCollapsed ? (
                  <Folder className="w-4 h-4 text-indigo-400" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-indigo-400 fill-indigo-400/10" />
                )
              ) : (
                node.name.endsWith('.json') || node.name.endsWith('.toml') ? (
                  <Settings className="w-4 h-4 text-amber-400" />
                ) : node.name.endsWith('.sql') ? (
                  <Database className="w-4 h-4 text-emerald-400" />
                ) : (
                  <FileCode className="w-4 h-4 text-sky-400" />
                )
              )}
            </span>

            <span className="text-xs font-mono truncate tracking-tight font-bold text-slate-300 group-hover:text-amber-100">
              {node.name}
            </span>
          </div>

          {!isFolder && node.size && (
            <span className="text-[8.5px] font-mono text-slate-550 shrink-0 select-none uppercase">
              {node.size}
            </span>
          )}
        </div>

        {isFolder && !isCollapsed && hasChildren && (
          <div className="mt-0.5 space-y-0.5">
            {node.children!.map(child => renderFileSystemNode(child, path, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
      <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />

      {/* Header info */}
      <div className="pb-3 border-b border-indigo-950/45">
        <h4 className="text-xs font-black text-slate-350 uppercase tracking-widest flex items-center gap-1.5">
          <FolderOpen className="w-4 h-4 text-indigo-400" />
          <span>{lVal.explorerTitle}</span>
        </h4>
        <p className="text-[10px] text-slate-500 font-bold mt-1.5 leading-relaxed">
          {lVal.explorerSub} <span className="text-indigo-400 font-mono">[{nodeTitle}]</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[260px]">
        {/* Left Tree column */}
        <div className="md:col-span-5 bg-slate-950/60 ring-1 ring-slate-900/80 p-3 rounded-2xl flex flex-col justify-between space-y-3">
          
          {/* File Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input 
              type="text" 
              placeholder={lVal.searchPlaceholder}
              value={fileSearch}
              onChange={(e) => setFileSearch(e.target.value)}
              className="w-full text-[10px] pl-8 pr-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Directory node explorer */}
          <div className="flex-1 overflow-y-auto max-h-[220px] pr-1.5 custom-scroll space-y-0.5">
            {currentTree.map(node => renderFileSystemNode(node, '', 0))}
          </div>
          
          <div className="text-[8.5px] text-indigo-450 font-mono flex justify-between uppercase pt-1 border-t border-indigo-950/30">
            <span>FILESYSTEM METRIC</span>
            <span>TYPE: {nodeType.toUpperCase()}</span>
          </div>
        </div>

        {/* Right Preview column */}
        <div className="md:col-span-7 bg-[#020205] border border-indigo-950/85 p-4 rounded-2xl flex flex-col justify-between min-h-[240px]">
          {selectedFile ? (
            <div className="flex flex-col justify-between h-full space-y-3.5 animate-in fade-in-25 duration-200">
              {/* Header metrics */}
              <div className="flex justify-between items-start pb-2 border-b border-indigo-950/45">
                <div>
                  <h5 className="text-[11px] font-mono font-black text-amber-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedFile.name}</span>
                  </h5>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {lVal.metaSize} <span className="text-slate-300 font-bold">{selectedFile.size || 'N/A'}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedFile(null)}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded font-mono text-[8.5px] uppercase border border-slate-800"
                >
                  {lVal.backText}
                </button>
              </div>

              {/* Code Snippet */}
              <div className="flex-1 overflow-auto bg-[#04040a] border border-slate-900/60 rounded-xl p-3 max-h-[160px] custom-scroll">
                <pre className="text-[10px] font-mono text-indigo-200 leading-relaxed overflow-x-auto whitespace-pre">
                  <code>{selectedFile.snippet || '// No preview available.'}</code>
                </pre>
              </div>

              {/* Security info flag */}
              <div className="bg-indigo-950/30 border border-indigo-505/10 p-2 rounded-xl text-[8.5px] font-mono space-y-0.5 text-slate-400">
                <div>
                  <span className="text-[#6366f1] font-black">{lVal.metaCheck}</span>
                </div>
                <div className="text-slate-300 select-all tracking-wider font-semibold">
                  {selectedFile.checksum || 'N/A'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-10 h-10 bg-indigo-950/50 rounded-xl flex items-center justify-center border border-indigo-850/60 text-indigo-400">
                <FileCheck className="w-5 h-5 animate-pulse" />
              </div>
              <p className="text-[9.5px] font-bold font-mono max-w-[200px] leading-relaxed text-slate-500">
                {lVal.noFileText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
