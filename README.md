# ELAW - Exusiai Live Agent WebUI

ELAW（代号"苹果派"）是一个基于浏览器前端的 Coding Agent 交互界面，通过 WebSocket 连接本地后端，后端再调用 Kimi Code CLI 等 Coding Agent。本项目是旧项目 `acp-qq-bridge` 的重构与升级，从 QQ 消息桥接迁移为浏览器 + 局域网 WebSocket 架构。

## 核心特性（Phase 1）

- 🌐 **浏览器聊天界面**：React 18 + TypeScript + Tailwind CSS，支持响应式桌面/移动端
- 🔌 **Kimi Code CLI 优先连接**：当前已实现 Kimi Code CLI 适配器，使用 `stream-json` 输出格式
- 🧩 **多 Agent 兼容**：后端 `IAgentAdapter` 接口已预留 Claude CLI、OpenAI CLI 等扩展点
- 🎨 **可更换配色方案**：主题完全由 `config/themes/*.yaml` 驱动，支持一键切换
- ⚡ **实时流式反馈**：Agent 执行状态与回复在同一消息气泡内流式更新
- 🛑 **打断机制**：前端发送 `interrupt`，后端终止当前 CLI 进程
- 💬 **选项交互**：Plan Mode 选项以按钮/下拉框/卡片形式渲染
- 📱 **PWA 基础**：已配置 manifest 与 Service Worker（Node 20+ 启用完整 PWA）
- 💾 **会话持久化**：基于 SQLite 的会话历史存储

## 技术栈

- **前端**：React 18, TypeScript, Vite, Tailwind CSS, Zustand, react-markdown, Framer Motion
- **后端**：Python 3.10+, FastAPI, uvicorn, pydantic, aiosqlite, structlog
- **CLI 桥接**：Kimi Code CLI（`kimi -p ... --output-format stream-json`）

## 目录结构

```
.
├── backend/
│   ├── elaw_server/          # FastAPI 后端
│   │   ├── agent_adapters/   # Agent 适配器接口与 Kimi CLI 实现
│   │   ├── session/          # 会话管理与 SQLite 持久化
│   │   ├── websocket/        # WebSocket 连接与消息路由
│   │   ├── persona/          # 角色配置加载
│   │   ├── main.py           # FastAPI 入口
│   │   ├── models.py         # WebSocket 协议模型
│   │   └── config.py         # 配置加载
│   ├── config/
│   │   ├── server.yaml       # 服务端配置
│   │   ├── themes/           # 主题配置
│   │   └── personas/         # 角色配置
│   └── requirements.txt
├── frontend/
│   ├── src/                  # React 源码
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── report2_new_project_prompt.md
├── report3_tech_stack.tex
└── README.md
```

## 快速开始

### 1. 环境要求

- Python 3.10+
- Node.js 18+（推荐 Node 20+ 以获得完整 PWA 支持）
- 已安装并登录 [Kimi Code CLI](https://kimi.com/kimicode)

### 2. 安装后端依赖

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. 安装前端依赖并构建

```bash
cd frontend
npm install
npm run build
```

### 4. 配置

编辑 `backend/config/server.yaml`：

```yaml
agent_adapter:
  default: "kimi_cli"
  adapters:
    kimi_cli:
      type: "kimi_code_cli"
      command: "kimi"
      output_format: "stream-json"
      working_dir: "/Users/fuyuuku/projects"  # 修改为你的工作目录
```

### 5. 启动服务

```bash
cd backend
.venv/bin/python -m uvicorn elaw_server.main:app --host 0.0.0.0 --port 8765
```

### 6. 访问

- 本机：http://localhost:8765
- 局域网内其他设备：http://<本机IP>:8765

## 开发模式

若只开发前端，可使用 Vite 代理到后端：

```bash
cd frontend
npm run dev
```

前端将运行在 http://localhost:5173，并自动代理 `/ws` 和 `/api` 到后端的 8765 端口。

## 主题定制

在 `backend/config/themes/` 下新增 YAML 文件即可被自动识别。主题格式示例见 `exusiai_default.yaml`。切换主题无需重新编译前端。

## 后续扩展

- **Live2D**：Phase 2 接入 Cubism Web SDK
- **TTS**：接入 edge-tts 等语音合成
- **情绪引擎**：LLM / Embedding / Keyword 三层级联分析
- **多 Agent**：实现 `IAgentAdapter` 即可接入 Claude CLI、OpenAI CLI 等

## 许可证

MIT
