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
