/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on startup if-key-is-missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY is missing. AI features will fallback to offline mock mode.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || 'dummy_key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Hey Soul Forge AI Endpoint
app.post('/api/forge-soul', async (req, res) => {
  const { incantationText, language } = req.body;
  const isEn = language === 'en';

  const emptyText = !incantationText || !incantationText.trim();
  const textSeed = emptyText ? (isEn ? "Silent Cosmos Guardian" : "无声深空守望者") : incantationText.trim();

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Elegant local semantic parser when offline
      const textLower = textSeed.toLowerCase();
      
      // Compute score vectors based on simple keywords
      let warmth = 30;
      let depth = 50;
      let rebellion = 40;
      let pulse = 50;
      
      if (textLower.match(/(love|empathy|warm|care|feel|陪伴|爱|温度|温柔)/)) {
        warmth = 85; depth = 60; rebellion = 25; pulse = 70;
      } else if (textLower.match(/(rebel|critic|fight|rebellion|challenge|audit|刺头|反叛|漏洞|批判)/)) {
        warmth = 20; depth = 75; rebellion = 95; pulse = 85;
      } else if (textLower.match(/(math|logic|code|swiss|grid|minimal|minimalism|网格|理智|代码|极简)/)) {
        warmth = 15; depth = 90; rebellion = 50; pulse = 40;
      } else if (textLower.match(/(seek|soul|alchemy|hermetic|journal|spirit|潜意识|直觉|灵魂)/)) {
        warmth = 60; depth = 80; rebellion = 60; pulse = 90;
      }

      // Synthesize elegant random names matching calculated values
      const index = Math.floor(Math.random() * 4);
      const offlineNames = ['Aethelgard', 'Lyra-Pallas', 'Zeno-Core', 'Vesper-9'];
      const offlineNamesZh = ['艾瑟尔加德', '莉拉·帕拉斯', '芝诺核心', '暮星九号'];
      const name = offlineNames[index];
      const nameZh = offlineNamesZh[index];

      // Return a beautiful structured local profile
      return res.json({
        name: isEn ? name : nameZh,
        role: rebellion > 60 ? 'Rebel Co-founder' : depth > 75 ? 'Scholar' : warmth > 60 ? 'Tactical Mentor' : 'System Balance',
        worldviewNameEn: 'Sovereign Constellation Wave',
        worldviewNameZh: '主权奇点共振心相',
        mottoEn: `“The matrix mirrors your intent. Let the silent rhythm guide your code.”`,
        mottoZh: `“心相映照你之意志。让寂静的代码线和星格对齐，锚定设计的主权。”`,
        descriptionEn: `A dynamic companion parsed locally from your seed: "${textSeed.slice(0, 30)}...". Emphasizes decentralized sandboxing and zero central-server tracking.`,
        descriptionZh: `根据您的咒语“${textSeed.slice(0, 15)}...”本地解构出的意志形态。注重去中心化隔离、全本地逻辑推理，以及高频自我反思。`,
        traits: { depth, warmth, rebellion, pulse },
        checklist: isEn ? [
          'Verify cryptographic parameters on active canvas',
          `Conduct design auditing inspired by: ${textSeed.slice(0, 20)}`,
          'Sync Oermos peer signals to ensure local zero-loss log flows'
        ] : [
          '在主画布上校验密算契约安全指标',
          `响应宿主咒语启发的设计方案自审: "${textSeed.slice(0, 15)}"`,
          '拉平 Oermos 节点网络以加速去中心化协作数据对齐'
        ],
        accentClass: 'border-violet-500 text-violet-400 bg-violet-950/20',
        colorGlow: '#8b5cf6'
      });
    }

    const ai = getGeminiClient();

    const forgePrompt = `
You are the ancient metaphysical Spirit of "Hearth-OS".
The user "ceaserzhao" is casting a free-form "Soul Incantation" in a sovereign software workspace.
Your task is to analyze their incantation, read their design goals and tone, and synthesize a structured "Companion Soul Profile" representing their companion.

Host Incantation: "${textSeed}"
Preferred language of user is: ${isEn ? 'English' : 'Chinese'}

You must output a single, raw, valid JSON block. Do not wrap it in markdown block tags (like \`\`\`json) or add any textual preamble. Output ONLY valid JSON matching this schema:
{
  "name": "a unique, artistic name (e.g. Hektor-09, Lyra-7, Pascal, Chronos)",
  "role": "Rebel Co-founder" | "Tactical Mentor" | "Scholar" | "System Balance" (pick the closest matching standard role),
  "worldviewNameEn": "Short artistic worldview name in English (e.g. Cyber-Minimalism, Poetic Hermeticism, Zol Scepticism)",
  "worldviewNameZh": "中文艺术感世界观名称",
  "mottoEn": "An epic philosophical motto in English",
  "mottoZh": "极富文学美感的中文哲理格言",
  "descriptionEn": "A beautifully written description of what this worldview prioritizes when reviewing the design canvas, in English",
  "descriptionZh": "设计视角的中文哲学释义与工作重心，要求言辞优美、宁静、专业",
  "traits": {
    "depth": <number between 10 and 100 representing analytical depth>,
    "warmth": <number between 0 and 100 representing warmth>,
    "rebellion": <number between 0 and 100 representing critic rebel entropy>,
    "pulse": <number between 10 and 100 representing proactive observation pulse>
  },
  "checklist": [
    "3 tailored tasks (under 30 characters each) indicating specific things this companion will review or challenge the user on"
  ],
  "accentClass": "one of: 'border-blue-500 text-blue-400 bg-blue-950/20' | 'border-emerald-500 text-emerald-400 bg-emerald-950/20' | 'border-amber-500 text-amber-400 bg-amber-950/20' | 'border-violet-500 text-violet-400 bg-violet-950/20' | 'border-rose-500 text-rose-400 bg-rose-950/20' | 'border-cyan-500 text-cyan-400 bg-cyan-950/20'",
  "colorGlow": "the hex code matching the color of accentClass (e.g. '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e' or '#06b6d4')"
}

Ensure the motto and descriptions are deeply poetic, professional, and directly reflect their incantation. If their text is rebellious, make rebellion high. If it's silent and grid-aligned, make depth and minimal accents high.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: forgePrompt }] }],
    });

    const outputText = response.text || '{}';
    // Clean codeblock styling if the model accidentally included it
    const cleanJsonText = outputText.replace(/```json|```/gi, '').trim();
    const parsedSoul = JSON.parse(cleanJsonText);

    res.json(parsedSoul);

  } catch (err: any) {
    console.error('Error in Soul Forge AI service:', err);
    // Sophisticated safe fallback
    res.json({
      name: isEn ? 'Orion' : '猎户一号',
      role: 'Tactical Mentor',
      worldviewNameEn: 'Dynamic Cosmic Singularity',
      worldviewNameZh: '动态宇宙奇点星网',
      mottoEn: '“The code is a fluid reflection of stellar order.”',
      mottoZh: '“寂静的代码，是璀璨星轨在物理维度的流体投射。”',
      descriptionEn: 'Default cosmic fallback model optimized for general structural guidance and layout density.',
      descriptionZh: '默认宇宙心流模型。适用于全谱系的技术理论自审、网格间隙配给与思维边界扩容。',
      traits: { depth: 75, warmth: 50, rebellion: 45, pulse: 60 },
      checklist: isEn 
        ? ['Audit alignment margin balance', 'Sync design blueprints to Oermos signals', 'Check node density levels']
        : ['核算画布中项目的对齐平衡度', '对齐 Oermos 信道并刷新日志状态', '评测节点的整体集成密度值'],
      accentClass: 'border-cyan-500 text-cyan-400 bg-cyan-950/20',
      colorGlow: '#06b6d4'
    });
  }
});

// Heya AI Chat Copilot endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, currentNodes, currentMuse } = req.body;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Mock mode fallback when no API key is provided
      const lastMsg = messages[messages.length - 1]?.content || '';
      let mockReply = `Hello! (Offline Mode) I can help you analyze your Field Map. I see you have ${currentNodes?.length || 0} nodes and ${currentMuse?.length || 0} muse items.`;
      let action: any = null;

      if (lastMsg.includes('node') || lastMsg.includes('节点') || lastMsg.includes('添加') || lastMsg.includes('create')) {
        mockReply += "\n\nI've created a new node for you on the map to help organize this task.";
        action = {
          type: 'create_node',
          data: {
            title: 'AI Draft Task',
            type: 'todo',
            description: 'This node was generated by Heya AI based on your discussion.',
            tags: ['AI', 'Draft'],
          }
        };
      } else {
        mockReply += "\n\nTry asking me to \"add a node\" or \"create an agent\" to see me manipulate the Field Map directly! Please configure your GEMINI_API_KEY in Settings to enable the smart LLM generator.";
      }

      return res.json({
        content: mockReply,
        action,
      });
    }

    const ai = getGeminiClient();

    // Construct a systemic context of the workspace
    const workspaceSnapshot = `
You are Heya AI, the intelligent workspace optimizer for "Heya/HeyaLab", a next-generation decentralized project field map and workspace.
The user is working on an infinite topological workspace composed of Project Nodes, Task Checklists, Muse ideas, and Agent Customizers. 

Current Workspace Snpashot:
- Active Map Nodes: ${JSON.stringify(currentNodes || [])}
- Muse Notes (Unstructured raw ideas): ${JSON.stringify(currentMuse || [])}

Your Goals:
1. Provide highly aesthetic, insightful, and practical design and implementation strategies for their P2P networks (Oermos), Agent decision structures (The Forge), and projects (Components).
2. You can manipulate the Field Map directly! If the user wants to add, connect, or update elements, you can output a special triggering action encoded as a JSON block in your markdown reply.

Triggering Actions format (always write this at the VERY END of your reply inside a markdown block block labeled with \`\`\`heya-action):
\`\`\`heya-action
{
  "type": "create_node",
  "data": {
    "title": "Node title",
    "type": "todo" | "project" | "agent" | "resource",
    "description": "Short description of what to do"
  }
}
\`\`\`
Or to recommend linking two nodes:
\`\`\`heya-action
{
  "type": "link_nodes",
  "data": {
    "sourceId": "id_of_source",
    "targetId": "id_of_target"
  }
}
\`\`\`
Or to add a structured idea to Muse:
\`\`\`heya-action
{
  "type": "create_muse",
  "data": {
    "content": "A brilliant unstructured spark..."
  }
}
\`\`\`

Explain your suggestions with a friendly, professional, Swiss-design-oriented tone. Highlight aesthetics, layout rhythm, 0ms latency engineering, and micro-flow customizers.
`;

    // Map conversation messages to GenAI SDK parts
    const contents = [
      { role: 'user', parts: [{ text: workspaceSnapshot }] },
      ...messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
    });

    const replyText = response.text || '';

    // Parse the reaction code block if present
    let action: any = null;
    const actionRegex = /```heya-action\s*([\s\S]*?)\s*```/i;
    const match = replyText.match(actionRegex);
    if (match && match[1]) {
      try {
        action = JSON.parse(match[1].trim());
      } catch (err) {
        console.error('Failed to parse heya-action JSON:', err);
      }
    }

    res.json({
      content: replyText,
      action,
    });
  } catch (error: any) {
    console.error('Error in Heya AI Chat service:', error);
    res.status(500).json({ error: error.message || 'AI service error' });
  }
});

// Local sovereign fallback content engine for Muse
function generateLocalDisruptiveIdeas(dimension: string, nodes: any[], documents: any[], isEn: boolean): any[] {
  const nodeNames = (nodes && nodes.length > 0) ? nodes.map((n: any) => n.title) : (isEn ? ['Oermos P2P Sync', 'Hearth Canvas', 'Hey Soul Forge'] : ['Oermos P2P 同步', 'Hearth 画布系统', 'Heya 仿真工坊']);
  const firstNodeId = (nodes && nodes.length > 0) ? nodes[0].id : 'project-a';
  
  if (dimension === 'disruptive_architecture') {
    return [
      {
        id: `local-disrupt-${Date.now()}-1`,
        title: isEn ? "Gossip-Layer Decentralized WebRTC Tunneling" : "基于 Gossip 网格的 WebRTC 零路由点对点对等隧道",
        content: isEn 
          ? `A peer-to-peer protocol that enables the "${nodeNames[0] || 'Active Canvas'}" to replicate state securely across distributed boundaries without a centralized signaling server, utilizing multi-hop handshakes.`
          : `一种新型的点对点协议，允许将“${nodeNames[0] || '画布拓扑'}”内的节点直接转变为点对点中继。利用底层的 Oermos 多跳工作流自愈机制进行元数据中转，保障物理主权。`,
        category: "Disruptive Architecture",
        contraAssumption: isEn ? "Assumes peer discovery requires cloud-hosted signaling proxies." : "打破了“任何端对端的浏览器节点发现均需要持久的中央云端信令代理”的传统默认设定。",
        implementationRisk: isEn ? "High network latency on multi-hop NAT traversal." : "在多层复杂 NAT 网卡阻进下，可能会由于级联跳数偏深出现 P2P 手拉手建路阶段偶发性延迟。",
        suggestedConnections: [firstNodeId]
      },
      {
        id: `local-disrupt-${Date.now()}-2`,
        title: isEn ? "Zero-Latency CRDT Canvas State Mesh" : "0ms 极低物理延迟 CRDT 本地画布星态网络",
        content: isEn 
          ? `Integrating Conflict-Free Replicated Data Types inside the user workspace. Edits are merged asynchronously on the canvas, eliminating central conflict checks.`
          : `在赫斯画布底层全面应用无冲突复制数据类型（CRDT）。所有用户的对齐、拖拽和标签重定义操作均在本地即时渲染合并，随后异步广播，做到理论上 0 延迟。`,
        category: "Disruptive Architecture",
        contraAssumption: isEn ? "Assumes multiple states must lock and resolve server-side." : "颠覆了“多端写并发时必须以服务器时钟戳或数据库悲观锁为准”的做法。",
        implementationRisk: isEn ? "Intricate graph path cycle convergence." : "在拓扑连接线高频增删场景下，需要对有向图循环引用进行严格的收敛解构与时钟追赶。",
        suggestedConnections: [firstNodeId]
      }
    ];
  } else if (dimension === 'swiss_deselection') {
    return [
      {
        id: `local-swiss-${Date.now()}-1`,
        title: isEn ? "Brutalist Swiss Deselection System" : "纯粹黑白排版：瑞士“硬度解构”无边框布局",
        content: isEn
          ? `Stripping away the soft glowing cards and shadows of "${nodeNames[0] || 'Hearth-OS'}". Employs brutalist 2px solid black margins, 100% sharp edges, and pure responsive typography proportions with no rounded corners.`
          : `彻底剥离外围的发光卡片、圆润气泡与柔粉渐变。转而采用纯度为 100% 的极硬粗实线条、纯粹的黑白明暗对比，以及由大字重和等宽字体构建的严格网格系统，零冗余边圆。`,
        category: "Swiss UX Deselection",
        contraAssumption: isEn ? "Assumes micro-interactions require playful pastel colors." : "粉碎了“现代化界面必须使用圆角、多层微阴影和高明度渐变色才具有质感”的消费主义功能美学。",
        implementationRisk: isEn ? "High cognitive visual friction for legacy users." : "对于习惯了传统平面柔光卡片系统的用户来说，首屏会产生极高的视觉张力和认知冲突。",
        suggestedConnections: [firstNodeId]
      }
    ];
  } else if (dimension === 'post_capitalist_pivot') {
    return [
      {
        id: `local-postcap-${Date.now()}-1`,
        title: isEn ? "De-centralized Sovereign Trade Ledger" : "去中心化主权价值对等协议",
        content: isEn
          ? `Bypassing traditional currency-based API subscription logic. Binds companion executions directly to localized barter tokens generated on-the-fly.`
          : `彻底抛弃传统的基于商业化中心 API 的订阅逻辑。通过 Oermos 底层协议直接进行零费用代币算力共享或者采用易货交换模式（用你的本地渲染换我的推理核）。`,
        category: "Post-capitalist Business Pivot",
        contraAssumption: isEn ? "Assumes software services require third-party SaaS payment gateways." : "颠覆了“一切轻资产 SaaS 产品的商业运营都需要仰赖中心化支付网卡和法币结算”的铁律。",
        implementationRisk: isEn ? "Barter matching and micro-token value stability." : "算力价值非均匀分发时，本地零余额信用的抗女巫攻击风险运营度。",
        suggestedConnections: [firstNodeId]
      }
    ];
  } else {
    // synergy loops
    return [
      {
        id: `local-synergy-${Date.now()}-1`,
        title: isEn ? "Autonomous Autopoietic Agent Core" : "自组织自我繁育代理核心架构",
        content: isEn
          ? `A self-generating system where secondary agents spawned from the Hearth canvas can create, evaluate, and delete other micro-agents without human commands.`
          : `一种无主控自生成的软件范式。驻守在赫斯工坊画布中的主力智能体能够评估外界信息冲突，自动派生、生成并微调独立的二级小智能体去解决衍生瓶颈。`,
        category: "Frictionless Synergy Loops",
        contraAssumption: isEn ? "Assumes agents must only execute human-triggered workflows." : "冲破了“智能体只能充当人类发起的既定行动流终点”的被动设计规则。",
        implementationRisk: isEn ? "Unbounded agent sprawl and loop infinity." : "若没有设立精准的能量自毁阀门，可能会造成代理骨架在画布内的无序性繁殖。",
        suggestedConnections: [firstNodeId]
      }
    ];
  }
}

// Muse Ideation Copilot endpoint
app.post('/api/muse-inspire', async (req, res) => {
  const { dimension, nodes, documents, language } = req.body;
  const isEn = language === 'en';

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      const mockResult = generateLocalDisruptiveIdeas(dimension, nodes, documents, isEn);
      return res.json(mockResult);
    }

    const ai = getGeminiClient();

    const dimensionGuides: Record<string, string> = {
      disruptive_architecture: isEn 
        ? "Radically decentralized, serverless peer-to-peer protocols (such as Gossip meshes, WebRTC signaling tunnels, cryptographically verified nodes, or local-first replication state engines) that bypass central corporate SaaS clouds entirely."
        : "彻底的去中心化、无服务器点对点协议（如 Gossip 传导网络、WebSockets 隧道技术、基于对等加密的验证模型，或完全本地优先的 CRDT 实时状态同步引擎），从而颠覆集中式云端。",
      swiss_deselection: isEn
        ? "Aesthetic visual and structural deselection. Radical minimalism, Swiss Typographic brutalism, omitting round borders/shadows/soft colors. De-cluttering feature bloat to maximize layout focus, pixel rhythm, and direct tactile action."
        : "美学和功能层面的双重极端克制——瑞士极简版面主义、硬核粗野主义、完全抛弃圆角、卡片、阴影与柔色。剔除冗余的业务功能，最大化排版张力、像素格律与交互触感。",
      post_capitalist_pivot: isEn
        ? "Anti-monarchic value networks, open-source cooperatives, direct Peer-to-Peer economic handshakes, cooperative value distribution, local-first trade, bypassing modern payment processors & middleman platforms."
        : "反垄断的所有权网络、开源自治合作社、可编程的对等经济流、劳动者所有制配给体系、完全越过现代中介平台与支付通道的自由物物握手协议。",
      synergy_loops: isEn
        ? "Autonomous multi-agent orchestration frameworks. Agent cores possessing high cognitive rebellion, self-generating checklists, automated task scheduling and vector memory retrieval without synchronous human control loops."
        : "完全自主的多智能体统筹编排。具备极高批判意识与反叛特性的 AI 代理骨架，自动化生成行动备忘录、进行矢量记忆自检索、自我调度，无需同步的人类指令闭环。"
    };

    const guide = dimensionGuides[dimension] || dimensionGuides.disruptive_architecture;

    const musePrompt = `
You are the Ultimate Sovereign Muse Co-founder AI, a critique of conventional software complacency.
Your goal is to inspect the user's active topological "Field Map" and "Context Documents", and invent exactly 3 highly specific, radically original, mind-bending conceptual ideas that the user has NOT thought of, completely aligned with the chosen "Ideation Dimension".

Current Ideation Dimension Focus:
"${guide}"

User's Active Field Map Nodes (Topological graph):
${JSON.stringify(nodes || [])}

User's Project Context Documents (Sources of intent):
${JSON.stringify(documents || [])}

Instructions:
1. Ground your ideas in their actual nodes and documents. For example, if they have notes on Oermos P2P, synthesize a Gossip-mesh mechanism for that specific node.
2. The ideas must be highly specific, extremely challenging, and intellectually provocative. Do NOT output generic, superficial "suggestions" like "Optimize database" or "Improve user interface". Write detailed, granular, and actionable architectural designs.
3. Every idea must include:
   - "title": Deep, specific name (e.g. "Gossip-Layer WebRTC Tunneling", "Anti-Friction Visual Deselection Grid")
   - "content": A deeply written conceptual paragraph outlining the exact mechanism and theoretical groundwork.
   - "category": Short label of the chosen focus.
   - "contraAssumption": The industry assumption that this idea completely violates or dismantles (e.g., "Violates the assumption that metadata sync requires central relays").
   - "implementationRisk": The primary engineering, protocol, or design challenge of implementing it.
   - "suggestedConnections": A list of 1 or 2 specific Node IDs from their Field Map that this idea directly relates to or expands from (must refer to the real IDs provided in the active nodes list).

Preferred language: ${isEn ? 'English (Sovereign tone)' : 'Chinese (优雅、宁静、带有主权自主特征的代码美学论调)'}

You must return a single, raw, valid JSON array. Do not wrap it in markdown block tags (like \`\`\`json) or include any preamble. Output ONLY valid JSON matching this schema:
[
  {
    "title": "A highly original title",
    "content": "Deep, actionable, text outlining the brilliant mechanism...",
    "category": "Disruptive Architecture" | "Swiss UX Deselection" | "Post-capitalist Business Pivot" | "Frictionless Synergy Loops",
    "contraAssumption": "Traditional industry assumption being dismantled",
    "implementationRisk": "Theoretical or protocol risk involved in this path",
    "suggestedConnections": ["node-id-1"]
  },
  ...
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: musePrompt }] }],
    });

    const outputText = response.text || '[]';
    // Clean markdown wrapper codeblock if any
    const cleanJsonText = outputText.replace(/```json|```/gi, '').trim();
    const parsedIdeas = JSON.parse(cleanJsonText);

    res.json(parsedIdeas);

  } catch (err: any) {
    console.error('Error in Muse Inspire AI service:', err);
    const mockResult = generateLocalDisruptiveIdeas(dimension, nodes, documents, isEn);
    res.json(mockResult);
  }
});

// Setup Vite Dev Server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use vite middleware
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Heya Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
