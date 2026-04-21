# Trae Solo Hackathon Lab

> 🌐 **Bilingual**: This project offers a [Chinese version](https://ricardo-m-j.github.io/trae-solo-hackathon-lab/bilingual-readme.html#cn) of the introduction.

## Project Name
**English**: Solo Teaches You Solo — A Multi-Agent Architecture Meeting Room Example
**中文**：solo教你用solo——以multiagent架构的会议室为例

## Project Introduction
This is a **Trae Friends Wuhan Hackathon** project designed to demonstrate how to build a complete web application using Trae Solo through practical examples. The project showcases the power of AI-assisted development by building two functional systems:

- **Roadshow Lottery System**: An interactive lottery system for event presentations
- **AI Meeting Room**: An intelligent chat system featuring four AI agents with different roles

## Technology Stack
- React + Vite
- React Router
- Framer Motion (animations)
- Lucide React (icons)
- Kimi API (AI chat)

## Key Features
- ✅ Responsive design, adapting to different devices
- ✅ Smart routing: AI moderator automatically determines which agents should respond
- ✅ Streaming API responses with real-time chat display
- ✅ Local storage for chat history persistence
- ✅ Support for GitHub Pages and Cloudflare Pages deployment
- ✅ Multi-agent architecture with role-specific AI behaviors

## Deployment Links
- **GitHub Pages**: [https://ricardo-m-j.github.io/trae-solo-hackathon-lab/](https://ricardo-m-j.github.io/trae-solo-hackathon-lab/)
- **Cloudflare Pages**: [https://trae-lottery-demo-v2.pages.dev/](https://trae-lottery-demo-v2.pages.dev/)

## Local Development
```bash
git clone https://github.com/Ricardo-M-J/trae-solo-hackathon-lab.git
cd trae-solo-hackathon-lab
npm install
npm run dev
npm run build  # Production build
```

## Project Structure
```
src/
├── pages/
│   ├── Home/         # Home page
│   ├── Chat/          # AI Meeting Room
│   ├── Lottery/       # Lottery system
│   ├── Basics/        # Basic features
│   ├── Advanced/       # Advanced features
│   └── Demo/          # Demo page
├── components/         # Common components
├── styles/            # Global styles
└── services/         # API services

public/
├── _redirects        # Cloudflare Pages routing
├── 404.html          # SPA routing fallback
└── favicon.svg       # Site favicon
```

## Core Features

### 1. Roadshow Lottery System
- Manual input for number of participants
- Random winner selection with animations
- Visual celebration effects
- Adjustable prize tiers

### 2. AI Meeting Room
- **Four AI Roles**:
  - 🎯 Product Manager (产品经理小王)
  - 🎨 Designer (设计师小李)
  - 💻 Developer (程序员小张)
  - 🧪 Tester (测试小刘)

- **Smart Routing**: AI moderator analyzes messages and determines which agents should respond
- **Chat Modes**: Support for 1v1 private chat and group chat
- **Streaming Responses**: Real-time AI reply display
- **Persistent History**: Local storage maintains conversation history

### 3. Multi-Agent Architecture
The AI Meeting Room implements a sophisticated multi-agent system where:
- Each agent has a distinct personality and expertise
- A moderator agent analyzes incoming messages
- Agents can collaborate in group discussions
- Responses are contextually appropriate to each role

## Environment Variables
The project uses the following environment variables:

```env
VITE_BASE_PATH=/trae-solo-hackathon-lab
VITE_API_PROXY_URL=https://trae-solo-api-proxy.1463940581.workers.dev/api/chat
VITE_KIMI_API_KEY=your_kimi_api_key
VITE_PM_API_KEY=product_manager_api_key
VITE_DESIGNER_API_KEY=designer_api_key
VITE_DEV_API_KEY=developer_api_key
VITE_QA_API_KEY=tester_api_key
```

> ⚠️ **Security Note**: API keys are protected through Cloudflare Worker proxy and are never exposed in the frontend code.

## Architecture

### Frontend
```
User Browser → React App → Cloudflare Worker Proxy → Kimi API
```

### Cloudflare Worker Proxy
The Worker acts as a secure API gateway:
- Receives requests from the frontend
- Adds API credentials securely
- Forwards requests to Kimi API
- Returns responses to frontend

This architecture ensures API keys remain secure on the server side.

## Learning Journey

This project was created using **Trae Solo** as a learning tool:
1. Started with basic concepts
2. Built features incrementally
3. Integrated AI APIs
4. Implemented multi-agent architecture
5. Deployed to production

## License
MIT License

## Contact
For questions or collaboration opportunities, feel free to reach out!

---

## 中文版本
[点击这里查看中文介绍](https://ricardo-m-j.github.io/trae-solo-hackathon-lab/bilingual-readme.html#cn)
