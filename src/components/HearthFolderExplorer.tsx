/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Play,
  Maximize2,
  Minimize2,
  Columns2,
  Rows2,
  Eye,
  EyeOff,
  Type,
  X,
  Send,
  Sparkles,
  Command,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
  HelpCircle
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

// Define visual internal topologies for each component type
interface SubTopologyNode {
  id: string;
  label: string;
  desc: string;
  fileName: string; // Opens this file when clicked
  x: number;
  y: number;
}

const subTopologies: Record<string, SubTopologyNode[]> = {
  project: [
    { id: 'canvas', label: 'RegistryCanvas.tsx', desc: 'Spatially layout tactile visual graph mechanics', fileName: 'RegistryCanvas.tsx', x: 80, y: 70 },
    { id: 'hub', label: 'HearthSovereignHub.tsx', desc: 'Sync telemetry, connections and system binders', fileName: 'HearthSovereignHub.tsx', x: 220, y: 70 },
    { id: 'main', label: 'main.tsx', desc: 'Node runtime container and virtual engine entrypoint', fileName: 'main.tsx', x: 150, y: 150 },
    { id: 'relay', label: 'signal_relay.go', desc: 'Physical signal routing pipeline proxy', fileName: 'signal_relay.go', x: 260, y: 150 }
  ],
  todo: [
    { id: 'validate', label: '01_validate.rs', desc: 'Inbound cryptographic integrity validator', fileName: '01_validate.rs', x: 90, y: 70 },
    { id: 'sandbox', label: '02_sandbox_exec.rs', desc: 'Firewalled execution container sandbox', fileName: '02_sandbox_exec.rs', x: 210, y: 70 },
    { id: 'ci_cd', label: 'ci_cd_workflow.yml', desc: 'Automated workflow regression tester', fileName: 'ci_cd_workflow.yml', x: 150, y: 150 }
  ],
  agent: [
    { id: 'seed', label: 'system_seed_inst.md', desc: 'Decentralized prompt core memory instructions', fileName: 'system_seed_inst.md', x: 80, y: 70 },
    { id: 'loop', label: 'reflexive_loop.json', desc: 'Friction factor configuration variables', fileName: 'reflexive_loop.json', x: 220, y: 70 },
    { id: 'cron', label: 'scheduler_cron.py', desc: 'Autonomic chronometers polling script', fileName: 'scheduler_cron.py', x: 150, y: 160 }
  ],
  muse: [
    { id: 'canvas_sketch', label: 'creative_outbreak.canvas', desc: 'Chaotic vector thoughts and creative links', fileName: 'creative_outbreak.canvas', x: 90, y: 70 },
    { id: 'unstructured', label: 'unstructured_draft.txt', desc: 'Plaintext sketchpad conceptual layouts', fileName: 'unstructured_draft.txt', x: 210, y: 70 },
    { id: 'weights', label: 'divergence_factor.bin', desc: 'Physical neural divergent vector weights', fileName: 'divergence_factor.bin', x: 150, y: 150 }
  ],
  resource: [
    { id: 'v001', label: 'v001_initial_schema.sql', desc: 'Structured logical database schema', fileName: 'v001_initial_schema.sql', x: 80, y: 70 },
    { id: 'v002', label: 'v002_seeding_data.sql', desc: 'Relational initial seed coordinates', fileName: 'v002_seeding_data.sql', x: 210, y: 70 },
    { id: 'r2', label: 'r2_bucket_config.json', desc: 'Cloudflare media buckets synchronization properties', fileName: 'r2_bucket_config.json', x: 150, y: 150 }
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
  const currentSubTopology = subTopologies[nodeType] || subTopologies.project;

  const [collapsedPaths, setCollapsedPaths] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileSearch, setFileSearch] = useState('');

  // Customizable IDE states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'side' | 'stacked' | 'code-only'>('side');
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'base'>('xs');

  // Multi-tab sub views: "editor" | "topology" | "ai"
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'topology' | 'ai'>('editor');

  // Source code state persistent store
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  
  // Simulated terminal compiler logger state
  const [compileOutput, setCompileOutput] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationStatus, setCompilationStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  // AI workspace assistant state machine
  const [workspaceChatHistory, setWorkspaceChatHistory] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    codePatch?: {
      targetFile: string;
      patchSnippet: string;
    }
  }>>([
    {
      sender: 'assistant',
      text: language === 'en' 
        ? "Hello! I am your AI Code Assistant. I can help you analyze, implement new signal handshakes, or auto-refactor the active component's files. Select a file and ask or click code actions downstream!"
        : "您好！我是 Hearth 内核 AI 辅助开发助手。我可以帮您审计代码逻辑、新增主权通讯特征，或者自动重构当前选中的逻辑。请先在左侧选择文件，然后与我对话！"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Seed default fileContents on initialization
  useEffect(() => {
    const defaultContents: Record<string, string> = {};
    const extractContents = (list: FileNode[]) => {
      list.forEach(node => {
        if (node.type === 'file' && node.snippet) {
          defaultContents[node.name] = node.snippet;
        }
        if (node.children) {
          extractContents(node.children);
        }
      });
    };
    Object.values(fileTrees).forEach(tree => {
      extractContents(tree);
    });
    setFileContents(defaultContents);
  }, []);

  // Set default selected file on mount/node type switch
  useEffect(() => {
    if (currentTree && currentTree.length > 0) {
      // Find first file recursively
      const findFirstFile = (list: FileNode[]): FileNode | null => {
        for (const item of list) {
          if (item.type === 'file') return item;
          if (item.children) {
            const res = findFirstFile(item.children);
            if (res) return res;
          }
        }
        return null;
      };
      const first = findFirstFile(currentTree);
      if (first) {
        setSelectedFile(first);
      }
    }
  }, [nodeType, currentTree]);

  // Scroll AI dialogue to bottom when logs update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [workspaceChatHistory]);

  const loc = {
    en: {
      explorerTitle: 'Active Project Module Filesystem',
      explorerSub: 'Folders and configurations matching this component coordinate layer. Click folders to toggle, click files to audit source scripts.',
      searchPlaceholder: 'Filter project files...',
      previewTitle: 'Sovereign Code Sandbox Audit',
      noFileText: 'Select any project file from the directory tree to projection preview.',
      metaSize: 'PHYSICAL CODE VOLUME:',
      metaCheck: 'INTEGRITY SHA-256 SIGNATURE:',
      backText: 'Clear Selector',
      layoutText: 'Layout Orientation',
      layoutSide: 'Split Dual-Pane',
      layoutStacked: 'Stacked Panes',
      layoutCodeOnly: 'Code Focus',
      fontSizeText: 'Text Scale',
      fullscreenEnter: 'Fullscreen IDE',
      fullscreenExit: 'Exit Fullscreen',
      treeToggle: 'Toggle File Tree',
      saveBtn: 'Save Source Code Checkpoint',
      compileBtn: 'Run Secure Compiler Audit',
      compileIdle: 'STABLE READY',
      compiling: 'COMPILING KERNEL VECTOR...',
      compilationLogs: 'Compiler System Diagnostics Console',
      subTopologyTitle: 'Active Component Internal Topology Map',
      subTopologyDesc: 'Click on sub-topology hardware nodes below to automatically focus and open their physical files in the source editor IDE.',
      aiTitle: 'Autonomous AGI Code Assistant',
      aiPlaceholder: 'Type co-programming direction (e.g. Add offline safety checks)...',
      aiSend: 'Dispatch Prompt',
      applyPatchText: '✨ Click to Inject AI Code Code Into Editor',
      patchInjected: 'Physics patch successfully committed to editor.',
      quickPrompts: 'Tactical Workspace Refactoring Prompts'
    },
    zh: {
      explorerTitle: '当前组件项目代码文件树 (Collapsible Filesystem)',
      explorerSub: '此组件节点物理打包物料文件。可点击折叠/打开文件夹树，选中文件进行安全阻断审计及源码预览。',
      searchPlaceholder: '输入文件名过滤检索...',
      previewTitle: '主机本地代码安全性审计沙盒 (Viewer)',
      noFileText: '请在左侧文件树中选中任何文件，以此加载指纹指认及物理源码审计。',
      metaSize: '物理字节体积:',
      metaCheck: '物理密码学防篡改签名:',
      backText: '清除选择',
      layoutText: '视图布局方式',
      layoutSide: '左右双栏分屏',
      layoutStacked: '上下分栏分屏',
      layoutCodeOnly: '代码面板独占',
      fontSizeText: '字体缩放',
      fullscreenEnter: '进入全屏工作区',
      fullscreenExit: '退出全屏',
      treeToggle: '树结构开关',
      saveBtn: '保存本地代码快照',
      compileBtn: '运行主权安全编译探测',
      compileIdle: '内核就绪',
      compiling: '源程序打包流校验中...',
      compilationLogs: '主权内核本地编译终端跟踪堆栈',
      subTopologyTitle: '此 Component 微结构系统物理拓扑图 (Topology)',
      subTopologyDesc: '点击下方组件内部逻辑网络的各个物理节点，即可使代码编辑器自动寻址并秒级打开对应的源码脚本。',
      aiTitle: 'AI 代码辅助与协处理器对话框 (AI Chat)',
      aiPlaceholder: '键入协同问题（如：为此机制新增防注入安全过滤器）...',
      aiSend: '发送指令',
      applyPatchText: '✨ 点击将 AI 优化方案直接物尽其用写进编辑器',
      patchInjected: 'AI 物理编译规约已自动写入。',
      quickPrompts: 'AI 开发智能加速套件快捷项'
    }
  };

  const lVal = loc[language];

  // Helper toggle paths
  const togglePath = (path: string) => {
    setCollapsedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Helper search checks
  const matchesSearch = (node: FileNode, query: string): boolean => {
    if (!query) return true;
    if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
    if (node.children) {
      return node.children.some(child => matchesSearch(child, query));
    }
    return false;
  };

  // Helper to lookup file by name in tree
  const findFileByFileName = (nodes: FileNode[], targetName: string): FileNode | null => {
    for (const n of nodes) {
      if (n.type === 'file' && n.name === targetName) {
        return n;
      }
      if (n.children) {
        const found = findFileByFileName(n.children, targetName);
        if (found) return found;
      }
    }
    return null;
  };

  // Handle clicking visual node from local topology
  const handleTopologyNodeClick = (fileName: string) => {
    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime('success');
    }
    const matched = findFileByFileName(currentTree, fileName);
    if (matched) {
      setSelectedFile(matched);
      setActiveWorkspaceTab('editor');
      // Dispatch toast
      window.dispatchEvent(new CustomEvent('heya-toast', {
        detail: { 
          message: language === 'en' 
            ? `Navigated to File: ${fileName} via Inner Topology Map` 
            : `通过局部物理拓扑映射，自动跳转打开：${fileName}`, 
          type: 'info' 
        }
      }));
    }
  };

  // Run secure build compiler simulation
  const handleCompileSovereign = () => {
    if (!selectedFile) return;
    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime('click');
    }

    setIsCompiling(true);
    setCompilationStatus('idle');
    setCompileOutput([
      `[COMPILER] Initializing sovereign hardware sandboxing...`,
      `[COMPILER] Locating active workspace node: ${nodeTitle}`,
      `[COMPILER] Target file stream audit: ${selectedFile.name}`,
    ]);

    setTimeout(() => {
      setCompileOutput(prev => [
        ...prev,
        `[COMPILER] Computing local file block checksum... Passed.`,
        `[COMPILER] Verifying absence of non-orthodox external telemetry APIs... Verified.`,
        `[COMPILER] Evaluating logical rules & anti-slop visual compliance...`
      ]);
    }, 600);

    setTimeout(() => {
      const activeCode = fileContents[selectedFile.name] || selectedFile.snippet || '';
      const containsSyntaxError = activeCode.includes('ERROR_TRIGGER') || activeCode.includes('SyntaxError');

      if (containsSyntaxError) {
        setCompilationStatus('failed');
        setCompileOutput(prev => [
          ...prev,
          `[CRITICAL CORRUPT] Code validation scan parsed fatal error values.`,
          `[FATAL] Compilation aborted. Check for incomplete assignments or syntax typos!`
        ]);
        if (typeof (window as any).playTactileChime === 'function') {
          (window as any).playTactileChime('alert');
        }
      } else {
        setCompilationStatus('success');
        setCompileOutput(prev => [
          ...prev,
          `[COMPILER] Building dependency graphs successfully (Depth: 3 layers).`,
          `[COMPILER] COMPILE SUCCESSFUL. Cryptographic signature registered: SHA-256_${Math.floor(Math.random()*900000+100000)}`
        ]);
        if (typeof (window as any).playTactileChime === 'function') {
          (window as any).playTactileChime('success');
        }
      }
      setIsCompiling(false);
    }, 1500);
  };

  // Save code changes manually
  const handleSaveCode = () => {
    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime('success');
    }
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: language === 'en' 
          ? 'Code checkpoint committed to container disk state.' 
          : '代码文件本地快照已保存至在册系统目录！', 
        type: 'success' 
      }
    }));
  };

  // Submit AI Prompt or preset routines
  const handleDispatchAiPrompt = (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || !selectedFile) return;

    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime('click');
    }

    const nextUserMsg = { sender: 'user' as const, text: textToSend };
    setWorkspaceChatHistory(prev => [...prev, nextUserMsg]);
    if (!customText) setChatInput('');

    setIsAiLoading(true);

    setTimeout(() => {
      // Formulate a beautiful, high-fidelity custom code suggestion patch depending on active file and request
      let generatedPatch = "";
      let responseExp = "";

      const lowerText = textToSend.toLowerCase();
      const isRust = selectedFile.name.endsWith('.rs');
      const isGo = selectedFile.name.endsWith('.go');
      const isTs = selectedFile.name.endsWith('.ts') || selectedFile.name.endsWith('.tsx');

      if (lowerText.includes('websocket') || lowerText.includes('socket') || lowerText.includes('信令')) {
        if (isGo) {
          responseExp = language === 'en'
            ? `I have updated 'signal_relay.go' to support WebSockets. Added gorilla/websocket structures, managed socket handshakes, and established low-friction routing loops.`
            : `我已重构了 'signal_relay.go' 以支持 WebSockets 反向连接。引入了标准双工 Socket 握手流并防止在离线场景下心跳崩溃。`;
          generatedPatch = `package router\n\nimport (\n    "net/http"\n    "github.com/gorilla/websocket"\n)\n\nvar upgrader = websocket.Upgrader{\n    ReadBufferSize:  1024,\n    WriteBufferSize: 1024,\n}\n\nfunc RegisterRelayHandler(w http.ResponseWriter, r *http.Request) {\n    conn, err := upgrader.Upgrade(w, r, nil)\n    if err != nil {\n        return\n    }\n    defer conn.Close()\n    \n    // Sovereign duplex signal loop\n    for {\n        messageType, p, err := conn.ReadMessage()\n        if err != nil {\n            return\n        }\n        if err := conn.WriteMessage(messageType, p); err != nil {\n            return\n        }\n    }\n}`;
        } else if (isTs) {
          responseExp = language === 'en'
            ? `Added highly resilient WebSocket fallback interfaces with reconnect backing schemas.`
            : `新增了弹性 WebSocket 双向重连机制，当本地宿主意外断链时可实现 1.5 秒级自我修复逻辑。`;
          generatedPatch = `import React, { useEffect, useState } from 'react';\n\nexport default function RegistryCanvas() {\n  const [wsState, setWsState] = useState('DISCONNECTED');\n  \n  useEffect(() => {\n    const socket = new WebSocket('ws://localhost:3000/api/relay');\n    socket.onopen = () => setWsState('STABLE');\n    socket.onclose = () => setWsState('RECONNECTING');\n    return () => socket.close();\n  }, []);\n\n  return (\n    <div className="p-4 bg-slate-900 border text-indigo-400 font-mono">\n      🛰️ Dual-Pipe Status: {wsState}\n    </div>\n  );\n}`;
        } else {
          responseExp = `WS protocol is not natively optimized for this specific file extension, but I injected a customized lightweight transport handler outline.`;
          generatedPatch = `// WebSocket transport outline injected safely.\n// Managed context connections.`;
        }
      } else if (lowerText.includes('security') || lowerText.includes('assert') || lowerText.includes('安全')) {
        if (isRust) {
          responseExp = language === 'en'
            ? `Hardened system-critical checks. Injected strict cryptographic validation guards, zero-copy buffer verification, and memory safety invariants.`
            : `对关键程序段实施了高强度密码学边界断言保护。注入绝对可控的零拷贝缓存区拦截和 SHA-256 签名匹配锁。`;
          generatedPatch = `pub fn validate_pipeline_stage() -> Result<(), CryptoError> {\n    println!("Initiating high-fidelity signature validation...");\n    \n    // SECURITY GUARD: Enforce maximum code block size thresholds\n    let memory_block_threshold = 4194304;\n    assert!(memory_block_threshold < 8388608, "CRITICAL ERROR: Memory buffer block violates physical limits!");\n    \n    verify_integrity_checksums()?;\n    Ok(())\n}`;
        } else {
          responseExp = language === 'en'
            ? "Injected strict runtime boundary safety checks, error capture matrices, and telemetry protection bounds."
            : "为所选代码增加了运行时逻辑边界卫氏断言、结构体深克隆异常捕捉以及抗沙盒击穿的安全隔离锁。";
          generatedPatch = `// Enhanced cryptographic bounding assert block\ntry {\n  if (!process.env.GEMINI_API_KEY) {\n    console.warn("[SECURITY WARN] Proceeding under offline simulation vault.");\n  }\n  // Sandbox assertions verified.\n} catch (secureAuditErr) {\n  throw new Error("Security check failed!");\n}`;
        }
      } else {
        // Fallback optimization
        responseExp = language === 'en'
          ? `Analyzed file '${selectedFile.name}'. Refactored visual aesthetics, modernized function headers, reduced nested loops to guarantee O(1) complexity, and enforced clean typography style conventions.`
          : `已深入对 '${selectedFile.name}' 文件执行代码审查。重构了代码段可读性、删除无意义循环并使符合最苛刻的极简程序规则。`;
        generatedPatch = `// Refactored and optimized cleanly for production compile\n` + (fileContents[selectedFile.name] || selectedFile.snippet || '');
      }

      setWorkspaceChatHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: responseExp,
          codePatch: {
            targetFile: selectedFile.name,
            patchSnippet: generatedPatch
          }
        }
      ]);
      setIsAiLoading(false);
      
      if (typeof (window as any).playTactileChime === 'function') {
        (window as any).playTactileChime('success');
      }
    }, 1500);
  };

  // Apply code patch from AI into editing state
  const handleApplyAiPatch = (patchSnippet: string, targetFile: string) => {
    setFileContents(prev => ({
      ...prev,
      [targetFile]: patchSnippet
    }));
    window.dispatchEvent(new CustomEvent('heya-toast', {
      detail: { 
        message: lVal.patchInjected, 
        type: 'success' 
      }
    }));
    if (typeof (window as any).playTactileChime === 'function') {
      (window as any).playTactileChime('success');
    }
  };

  // Render tree recursive file elements
  const renderFileSystemNode = (node: FileNode, currentPath: string, depth: number) => {
    const isFolder = node.type === 'folder';
    const hasChildren = node.children && node.children.length > 0;
    const path = `${currentPath}/${node.name}`;
    const isCollapsed = collapsedPaths[path] || false;

    if (fileSearch && !matchesSearch(node, fileSearch)) {
      return null;
    }

    const itemPaddingLeft = `${depth * 14}px`;
    const isSelected = selectedFile?.name === node.name;

    return (
      <div key={path} className="select-none text-slate-300">
        <div 
          onClick={() => {
            if (typeof (window as any).playTactileChime === 'function') {
              (window as any).playTactileChime('click');
            }
            if (isFolder) {
              togglePath(path);
            } else {
              setSelectedFile(node);
            }
          }}
          className={`flex items-center justify-between py-1.5 px-3 rounded-xl hover:bg-indigo-950/20 transition-colors cursor-pointer group ${
            isSelected ? 'bg-indigo-950/50 text-amber-300 border-l-2 border-indigo-500' : ''
          }`}
          style={{ paddingLeft: itemPaddingLeft }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {isFolder ? (
              <span className="text-slate-500">
                {isCollapsed ? <ChevronRight className="w-3" /> : <ChevronDown className="w-3" />}
              </span>
            ) : (
              <span className="w-3" />
            )}

            <span className="shrink-0">
              {isFolder ? (
                isCollapsed ? (
                  <Folder className="w-4 h-4 text-indigo-400" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-indigo-400 fill-indigo-400/5" />
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
            <span className="text-[8.5px] font-mono text-slate-500 shrink-0 select-none uppercase">
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

  // Layout calculations
  let leftTreeCol = "md:col-span-3";
  let middleEditorCol = "md:col-span-6";
  let rightConsoleCol = "md:col-span-3";

  if (layoutMode === 'stacked') {
    leftTreeCol = "md:col-span-12";
    middleEditorCol = "md:col-span-12";
    rightConsoleCol = "md:col-span-12";
  } else if (layoutMode === 'code-only') {
    leftTreeCol = "hidden";
    middleEditorCol = "md:col-span-8";
    rightConsoleCol = "md:col-span-4";
  }

  return (
    <div className={`transition-all duration-300 relative overflow-hidden ${
      isFullscreen 
        ? 'fixed inset-0 bg-[#060714] z-[9999] p-8 md:p-10 flex flex-col justify-between space-y-6' 
        : 'bg-[#0b0c16] border border-slate-900 rounded-3xl p-6 shadow-xl space-y-4'
    }`}>
      {/* Background neon elements */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-purple-605/5 blur-3xl rounded-full pointer-events-none" />

      {/* 1. Control Panel Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-4 border-b border-indigo-950/45 gap-4">
        <div>
          <h4 className="text-xs font-black text-slate-350 uppercase tracking-widest flex items-center gap-1.5 flex-wrap">
            <Command className="w-4 h-4 text-indigo-400" />
            <span>{lVal.explorerTitle}</span>
            {isFullscreen ? (
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[8.5px] uppercase tracking-wider font-extrabold rounded animate-pulse">
                ● FULLSCREEN VAULT ACTIVE
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-505/20 text-indigo-300 font-mono text-[8px] uppercase tracking-wider font-bold rounded">
                ● COCKPIT
              </span>
            )}
          </h4>
          <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">
            {lVal.explorerSub} <span className="text-indigo-400 font-mono font-black">[{nodeTitle}]</span>
          </p>
        </div>

        {/* IDE Controls Deck */}
        <div className="flex flex-wrap items-center gap-2 bg-[#020205]/95 p-1.5 rounded-xl border border-indigo-950/60 select-none shrink-0 self-start xl:self-center shadow-lg">
          
          {/* File tree toggle */}
          <button
            type="button"
            onClick={() => {
              if (typeof (window as any).playTactileChime === 'function') {
                (window as any).playTactileChime('click');
              }
              setLayoutMode(prev => prev === 'code-only' ? 'side' : 'code-only');
            }}
            title={lVal.treeToggle}
            className={`p-1.5 rounded-lg transition-all border cursor-pointer active:scale-95 ${
              layoutMode === 'code-only' 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {layoutMode === 'code-only' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          <div className="h-4 w-[1px] bg-indigo-950/80" />

          {/* Dual column configuration */}
          <button
            type="button"
            onClick={() => {
              if (typeof (window as any).playTactileChime === 'function') {
                (window as any).playTactileChime('click');
              }
              setLayoutMode('side');
            }}
            title={lVal.layoutSide}
            className={`p-1.5 rounded-lg transition-all border cursor-pointer active:scale-95 ${
              layoutMode === 'side' 
                ? 'bg-indigo-600/25 border-indigo-500/40 text-indigo-300' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>

          {/* Spanning layout */}
          <button
            type="button"
            onClick={() => {
              if (typeof (window as any).playTactileChime === 'function') {
                (window as any).playTactileChime('click');
              }
              setLayoutMode('stacked');
            }}
            title={lVal.layoutStacked}
            className={`p-1.5 rounded-lg transition-all border cursor-pointer active:scale-95 ${
              layoutMode === 'stacked' 
                ? 'bg-indigo-600/25 border-indigo-500/40 text-indigo-300' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Rows2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-indigo-950/80" />

          {/* Size metrics slider */}
          <button
            type="button"
            onClick={() => {
              if (typeof (window as any).playTactileChime === 'function') {
                (window as any).playTactileChime('click');
              }
              setFontSize(prev => prev === 'xs' ? 'sm' : prev === 'sm' ? 'base' : 'xs');
            }}
            title={`${lVal.fontSizeText}: ${fontSize.toUpperCase()}`}
            className="p-1 px-2 border border-slate-801 hover:border-slate-700 bg-slate-950/80 text-[9px] font-black font-mono text-slate-305 hover:text-white rounded-lg cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
          >
            <Type className="w-3 h-3 text-indigo-400" />
            <span>{fontSize.toUpperCase()}</span>
          </button>

          <div className="h-4 w-[1px] bg-indigo-950/80" />

          {/* Fullscreen controller */}
          <button
            type="button"
            onClick={() => {
              if (typeof (window as any).playTactileChime === 'function') {
                (window as any).playTactileChime('click');
              }
              setIsFullscreen(!isFullscreen);
            }}
            title={isFullscreen ? lVal.fullscreenExit : lVal.fullscreenEnter}
            className={`p-1.5 rounded-lg transition-all border cursor-pointer active:scale-95 ${
              isFullscreen 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 animate-pulse' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Three-Panel Space Cockpit */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-5 ${isFullscreen ? 'flex-1 min-h-0' : 'min-h-[460px]'}`}>
        
        {/* ================= PANEL 1: COLLAPSIBLE FILESYSTEM BROWSER ================= */}
        <div className={`${leftTreeCol} bg-[#020205] ring-1 ring-indigo-950/50 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-inner`}>
          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            {/* Direct search query */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input 
                type="text" 
                placeholder={lVal.searchPlaceholder}
                value={fileSearch}
                onChange={(e) => setFileSearch(e.target.value)}
                className="w-full text-[10px] pl-8 pr-2.5 py-1.5 bg-slate-900 border border-indigo-950/40 rounded-lg text-slate-300 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Tree Nodes file item listing scroll */}
            <div className="flex-1 overflow-y-auto pr-1.5 custom-scroll space-y-0.5">
              {currentTree.map(node => renderFileSystemNode(node, '', 0))}
            </div>
          </div>
          
          <div className="text-[8.5px] text-indigo-400 font-mono flex justify-between uppercase pt-2 border-t border-indigo-950/30">
            <span>HARDWARE CLASS</span>
            <span>{nodeType.toUpperCase()}</span>
          </div>
        </div>

        {/* ================= PANEL 2: HIGH-FIDELITY INTERACTIVE EDITOR ================= */}
        <div className={`${middleEditorCol} flex flex-col bg-[#010103] border border-indigo-950/85 rounded-2xl p-5 justify-between min-h-[380px]`}>
          {selectedFile ? (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              
              {/* Active File Tab Headers */}
              <div className="flex items-center justify-between pb-1.5 border-b border-indigo-950/45">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-indigo-900/40 border border-indigo-500/25">
                    <FileCode className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-mono font-black text-amber-300 flex items-center gap-1.5">
                      <span>{selectedFile.name}</span>
                    </h5>
                    <div className="text-[8.5px] text-slate-500 font-mono mt-0.5 uppercase tracking-tight">
                      {lVal.metaSize} <span className="text-slate-300 font-bold">{selectedFile.size || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Sub Tab selection buttons inside the workspace */}
                <div className="flex border border-indigo-950 bg-[#020205] p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setActiveWorkspaceTab('editor')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      activeWorkspaceTab === 'editor' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Code Editor
                  </button>
                  <button
                    onClick={() => setActiveWorkspaceTab('topology')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      activeWorkspaceTab === 'topology' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Inner TopologyMap
                  </button>
                  <button
                    onClick={() => setActiveWorkspaceTab('ai')}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                      activeWorkspaceTab === 'ai' 
                        ? 'bg-indigo-650 text-white' 
                        : 'text-slate-400 hover:text-white text-center flex items-center gap-1'
                    }`}
                  >
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                    <span>AI Assistant</span>
                  </button>
                </div>
              </div>

              {/* Render view contents depending on active tab selection */}
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* SUB TAB A: THE CODE EDITOR & WRITING PLATFORM */}
                {activeWorkspaceTab === 'editor' && (
                  <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0">
                    <div className="flex-1 flex border border-indigo-950/60 rounded-xl bg-[#04040a]/95 overflow-hidden p-3 font-mono leading-relaxed relative">
                      {/* Interactive code write-area with row counters */}
                      <div className="absolute top-1 left-1 font-mono text-[8px] text-slate-650 select-none">
                        HEARTH SECURE SANDBOX EDIT MODE / WRITE CODE SAFELY
                      </div>

                      {/* Code Area row numbering column */}
                      <div className="select-none text-slate-700 text-right pr-3 border-r border-indigo-950/40 shrink-0 font-mono text-[9.5px] space-y-1 pt-6">
                        {Array.from({ length: Math.max(12, (fileContents[selectedFile.name] || selectedFile.snippet || '').split('\n').length) }).map((_, idx) => (
                          <div key={idx} className="h-5">{idx + 1}</div>
                        ))}
                      </div>

                      {/* Interactive Text Field for user typing inputs */}
                      <textarea
                        value={fileContents[selectedFile.name] !== undefined ? fileContents[selectedFile.name] : selectedFile.snippet}
                        onChange={(e) => {
                          setFileContents(prev => ({
                            ...prev,
                            [selectedFile.name]: e.target.value
                          }));
                        }}
                        placeholder="// Write your sovereign program logic here..."
                        style={{ resize: 'none' }}
                        className={`flex-1 pl-4 bg-transparent text-indigo-150 outline-none font-mono focus:ring-0 focus:outline-none border-none pt-6 overflow-y-auto leading-5 ${
                          fontSize === 'xs' ? 'text-[10px]' : fontSize === 'sm' ? 'text-xs md:text-[13px]' : 'text-sm md:text-[14px]'
                        }`}
                      />
                    </div>

                    {/* Integrated diagnostics logs console output */}
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={handleSaveCode}
                          className="px-4 py-2 bg-indigo-950/50 hover:bg-indigo-900/40 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wide rounded-xl cursor-pointer border border-indigo-500/20 active:scale-95 transition-all text-center shrink-0"
                        >
                          {lVal.saveBtn}
                        </button>
                        <button
                          onClick={handleCompileSovereign}
                          disabled={isCompiling}
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isCompiling ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>{lVal.compiling}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-indigo-100 fill-indigo-50" />
                              <span>{lVal.compileBtn}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Simulated Compile trace output */}
                      {compileOutput.length > 0 && (
                        <div className="p-3 bg-[#020205] border border-indigo-950/80 rounded-xl font-mono text-[9px] text-[#8e9bb4] space-y-1 relative select-all max-h-[85px] overflow-y-auto animate-in slide-in-from-bottom-2">
                          <div className="absolute right-3 top-2.5 flex items-center gap-1">
                            {compilationStatus === 'success' && (
                              <span className="text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1 text-[8.5px]">
                                <CheckCircle className="w-3 h-3" /> SUCCESS
                              </span>
                            )}
                            {compilationStatus === 'failed' && (
                              <span className="text-rose-500 font-bold uppercase tracking-widest flex items-center gap-1 text-[8.5px]">
                                <AlertTriangle className="w-3 h-3 animate-pulse" /> FAILED
                              </span>
                            )}
                            {compilationStatus === 'idle' && (
                              <span className="text-amber-500 font-bold uppercase tracking-widest animate-pulse text-[8.5px]">
                                RUNNING...
                              </span>
                            )}
                          </div>
                          <span className="text-[8.5px] font-black text-indigo-400 block pb-1 border-b border-indigo-950/50 uppercase tracking-widest">
                            {lVal.compilationLogs}
                          </span>
                          {compileOutput.map((log, idx) => (
                            <div key={idx} className="leading-relaxed leading-4">{log}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB TAB B: CHASSIS INNER SUB-TOPOLOGY DIAGRAM */}
                {activeWorkspaceTab === 'topology' && (
                  <div className="flex-1 flex flex-col justify-between space-y-4 min-h-0 py-2 animate-in fade-in duration-250">
                    <div className="space-y-1 border-b border-indigo-950/30 pb-2">
                      <span className="text-[11px] font-black text-slate-350 uppercase tracking-widest block font-mono">
                        {lVal.subTopologyTitle}
                      </span>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                        {lVal.subTopologyDesc}
                      </p>
                    </div>

                    {/* SVG Vector Interactive Topology Canvas Node Map */}
                    <div className="flex-1 bg-[#020205] border border-indigo-950 p-4 rounded-xl relative flex items-center justify-center overflow-hidden h-[180px] md:h-[260px] cursor-crosshair">
                      <div className="absolute inset-0 select-none pointer-events-none opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '15px 15px'
                      }} />

                      {/* Connective vectors */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {currentSubTopology.map((sub, idx) => {
                          if (idx === 0) return null;
                          const prev = currentSubTopology[idx - 1];
                          const percentX1 = (prev.x / 350) * 100 + '%';
                          const percentY1 = (prev.y / 220) * 100 + '%';
                          const percentX2 = (sub.x / 350) * 100 + '%';
                          const percentY2 = (sub.y / 220) * 100 + '%';

                          return (
                            <line 
                              key={sub.id}
                              x1={percentX1}
                              y1={percentY1}
                              x2={percentX2}
                              y2={percentY2}
                              stroke="#4338ca"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                          );
                        })}
                      </svg>

                      {currentSubTopology.map((subNode) => {
                        const percentX = (subNode.x / 350) * 100;
                        const percentY = (subNode.y / 220) * 100;
                        const isNodeFileSelected = selectedFile?.name === subNode.fileName;

                        return (
                          <div
                            key={subNode.id}
                            style={{ left: `${percentX}%`, top: `${percentY}%` }}
                            onClick={() => handleTopologyNodeClick(subNode.fileName)}
                            className="absolute translate-x-[-50%] translate-y-[-50%] group cursor-pointer text-center z-12"
                          >
                            <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 leading-none shadow shadow-inner ${
                              isNodeFileSelected 
                                ? 'bg-amber-400 border-amber-500 scale-125 ring-4 ring-amber-500/30' 
                                : 'bg-slate-900 border-indigo-501 hover:bg-slate-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isNodeFileSelected ? 'bg-slate-950' : 'bg-[#6366f1]'
                              }`} />
                            </span>

                            {/* Tooltip bubble descriptors and labels */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-300 rounded px-2 py-0.5 pointer-events-none group-hover:scale-105 transition-all text-center">
                              <div className="font-mono text-amber-300 flex items-center justify-center gap-1">
                                {isNodeFileSelected && <span>✏️</span>}
                                <span>{subNode.label}</span>
                              </div>
                              <div className="text-[8px] text-slate-500 max-w-[150px] overflow-hidden text-ellipsis block mt-0.5 leading-none">
                                {subNode.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SUB TAB C: INTELLIGENT AI ASSISTANT CODE CHAT COPROCESSOR */}
                {activeWorkspaceTab === 'ai' && (
                  <div className="flex-1 flex flex-col justify-between space-y-3 min-h-0 py-2 animate-in fade-in duration-250">
                    <div className="flex-1 bg-[#020205] border border-indigo-950 rounded-xl p-3 flex flex-col justify-between overflow-hidden min-h-[160px]">
                      
                      {/* Chat text panel log viewport list */}
                      <div 
                        ref={chatScrollRef}
                        className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll max-h-[220px]"
                      >
                        {workspaceChatHistory.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`flex flex-col space-y-1 py-1 max-w-[90%] ${
                              item.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                            }`}
                          >
                            <span className="text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-widest block select-none">
                              {item.sender === 'user' ? 'Ceaserzhao' : 'Hearth Coprocessor AI'}
                            </span>
                            <div className={`p-2.5 rounded-xl text-xs font-semibold leading-relaxed ${
                              item.sender === 'user' 
                                ? 'bg-indigo-650 text-white rounded-tr-none' 
                                : 'bg-[#0a0c16] text-[#beccd9] border border-indigo-950/80 rounded-tl-none'
                            }`}>
                              {item.text}
                            </div>

                            {/* Direct Inject logic code patch buttons rendered beautifully */}
                            {item.codePatch && (
                              <button
                                onClick={() => handleApplyAiPatch(item.codePatch!.patchSnippet, item.codePatch!.targetFile)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide rounded-lg cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all mt-1.5 shadow"
                              >
                                <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                                <span>{lVal.applyPatchText}</span>
                              </button>
                            )}
                          </div>
                        ))}

                        {isAiLoading && (
                          <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10.5px] py-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Formulating sandbox logic refactoring...</span>
                          </div>
                        )}
                      </div>

                      {/* Mini AI shortcuts block list */}
                      <div className="pt-2 border-t border-indigo-950/45 space-y-1">
                        <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-wider font-mono">
                          {lVal.quickPrompts}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => handleDispatchAiPrompt('✨ Refactor active code to support robust WebSocket relays')}
                            className="px-2 py-0.5 bg-slate-900 hover:bg-indigo-950/50 border border-indigo-950 hover:border-indigo-805 text-slate-400 hover:text-indigo-250 text-[8.5px] font-black uppercase rounded font-mono transition-colors cursor-pointer"
                          >
                            + WEBSOCKET RELAY
                          </button>
                          <button
                            onClick={() => handleDispatchAiPrompt('🛡️ Enforce strict security guards and memory safety assert-locks')}
                            className="px-2 py-0.5 bg-slate-900 hover:bg-indigo-950/50 border border-indigo-950 hover:border-indigo-805 text-slate-400 hover:text-indigo-250 text-[8.5px] font-black uppercase rounded font-mono transition-colors cursor-pointer"
                          >
                            + SECURITY ASSERTS
                          </button>
                          <button
                            onClick={() => handleDispatchAiPrompt('⚡ Optimize nested code paths to reduce CPU performance cycles')}
                            className="px-2 py-0.5 bg-slate-900 hover:bg-indigo-950/50 border border-indigo-950 hover:border-indigo-805 text-slate-400 hover:text-indigo-250 text-[8.5px] font-black uppercase rounded font-mono transition-colors cursor-pointer"
                          >
                            + OPTIMISE PATHS
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Chat field write-input send */}
                    <div className="flex gap-2 relative">
                      <input 
                        type="text" 
                        placeholder={lVal.aiPlaceholder}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleDispatchAiPrompt()}
                        className="flex-1 text-xs px-3.5 py-2.5 bg-slate-900 border border-indigo-950 text-[#beccd9] rounded-xl focus:bg-slate-950 focus:outline-none focus:border-indigo-505 font-bold pr-14"
                      />
                      <button 
                        onClick={() => handleDispatchAiPrompt()}
                        className="px-3 bg-indigo-605 hover:bg-indigo-700 text-white rounded-xl absolute right-1.5 top-1.5 bottom-1.5 flex items-center justify-center shadow transition-all active:scale-95 hover:scale-102 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-white fill-white/10" />
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Physical Checksum telemetry banner */}
              <div className="bg-indigo-950/20 border border-indigo-500/5 p-2 rounded-xl text-[8px] font-mono space-y-1 text-slate-505 shrink-0">
                <div className="flex justify-between items-center text-slate-550 leading-none">
                  <span>{lVal.metaCheck}</span>
                  <span className="text-indigo-400">STATUS: REPLICATED</span>
                </div>
                <div className="text-slate-350 select-all tracking-wide font-black truncate leading-none">
                  {selectedFile.checksum || 'N/A'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-10 h-10 bg-indigo-950/50 rounded-xl flex items-center justify-center border border-indigo-850/60 text-indigo-405">
                <FileCheck className="w-5 h-5 animate-pulse" />
              </div>
              <p className="text-[10px] font-black font-mono max-w-[200px] leading-relaxed text-slate-550 uppercase">
                {lVal.noFileText}
              </p>
            </div>
          )}
        </div>

        {/* ================= PANEL 3: TACTILE CONTROLLERS & DEMO SIMULATORS ================= */}
        {layoutMode !== 'code-only' && (
          <div className={`${rightConsoleCol} bg-[#020205] border border-indigo-950/70 p-4 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl`}>
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-950/40">
                <span className="text-[9.5px] font-black uppercase tracking-widest text-[#8a9bb3] font-mono">
                  HEARTH CONTROL BOARD
                </span>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] rounded uppercase tracking-wider font-extrabold animate-pulse">
                  ONLINE
                </span>
              </div>

              {/* Quick instructions and telemetry widget info */}
              <div className="p-3 bg-indigo-950/15 border border-indigo-950 rounded-xl space-y-2">
                <span className="text-[9.5px] font-black text-indigo-300 uppercase tracking-widest block font-mono">
                  Sandbox Directives
                </span>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  You are inside Heya's UI Prototype Laboratory. Feel free to modify files, trigger compiling diagnostics, view component inner topologies dynamically, or let our AI auto-refactor parameters on checkout threads!
                </p>
              </div>

              {/* Hardware diagnostics meter */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block font-mono">
                  Hardware Physical Signals
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900 border border-indigo-950 rounded-xl text-center space-y-0.5">
                    <span className="text-[8px] text-slate-500 block font-mono uppercase">Decouple Rate</span>
                    <span className="text-xs font-black text-indigo-350 font-mono">98.4 Kb/s</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-indigo-950 rounded-xl text-center space-y-0.5">
                    <span className="text-[8px] text-slate-500 block font-mono uppercase">Local Entropy</span>
                    <span className="text-xs font-black text-pink-400 font-mono">0.042 λ</span>
                  </div>
                </div>
              </div>

              {/* Component specific system notes */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <span className="text-[8.5px] font-black text-amber-500 uppercase tracking-wider font-mono block mb-1">
                  Orthodox Compliance Rule
                </span>
                <p className="text-[9.5px] text-slate-400 font-medium leading-relaxed">
                  Decentralized nodes require SHA-256 validation signatures to bypass Hearth downstreams filters. Hit 'Run Secure Compiler Audit' to generate proper compliance signatures.
                </p>
              </div>
            </div>

            <div className="text-[8.5px] text-slate-600 font-mono uppercase text-center leading-none">
              UI Prototype Laboratory v4.18
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
