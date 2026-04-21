# Trae Friends 武汉站黑客松项目

> 🌐 **双语页面**：本项目提供[中英双语介绍页面](https://ricardo-m-j.github.io/trae-solo-hackathon-lab/bilingual-readme.html)，支持一键切换语言，提供更好的国际化体验。

## 项目名称
**中文**：solo教你用solo——以multiagent架构的会议室为例
**English**：Solo Teaches You Solo — A Multi-Agent Architecture Meeting Room Example

## 项目简介
**中文**：这是一个 Trae Friends 武汉站黑客松项目，旨在通过实际案例展示如何使用 Trae Solo 构建完整的 web 应用。项目包含两个主要功能：
- 路演抽奖系统：用于活动现场抽奖
- AI 会议室：基于 Multi-Agent 架构的智能聊天系统，包含产品经理、设计师、程序员、测试四个角色

**English**：This is a Trae Friends Wuhan hackathon project designed to demonstrate how to build a complete web application using Trae Solo through practical examples. The project includes two main features:
- Roadshow Lottery System: For on-site event lottery
- AI Meeting Room: Intelligent chat system based on Multi-Agent architecture, including four roles: Product Manager, Designer, Developer, and Tester

## 技术栈
- React + Vite
- React Router
- Framer Motion (动画效果)
- Lucide React (图标)
- Kimi API (AI 聊天)

## 项目特点
**中文**：
- 响应式设计，适配不同设备
- 智能路由：AI 主持人自动判断消息应该由哪些角色回复
- 流式 API 响应，实时显示聊天内容
- 本地存储聊天历史
- 支持 GitHub Pages 和 Cloudflare Pages 部署

**English**：
- Responsive design, adapting to different devices
- Smart routing: AI moderator automatically determines which roles should respond to messages
- Streaming API responses, real-time chat display
- Local storage for chat history
- Support for GitHub Pages and Cloudflare Pages deployment

## 部署链接
- **GitHub Pages**：[https://ricardo-m-j.github.io/trae-solo-hackathon-lab/](https://ricardo-m-j.github.io/trae-solo-hackathon-lab/)
- **Cloudflare Pages**：[https://trae-lottery-demo-v2.pages.dev/](https://trae-lottery-demo-v2.pages.dev/)

## 本地开发
1. 克隆项目
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 构建生产版本：`npm run build`

## 项目结构
- `src/`：源代码
  - `pages/`：页面组件
    - `Home/`：首页
    - `Chat/`：AI 聊天页面
    - `Lottery/`：抽奖页面
  - `components/`：通用组件
  - `styles/`：样式文件
  - `services/`：服务（如 AI API 调用）
- `public/`：静态资源
  - `_redirects`：Cloudflare Pages 路由配置
  - `404.html`：SPA 路由 fallback

## 核心功能
### 1. 路演抽奖系统
- 支持手动输入抽奖人数
- 随机抽取获奖者
- 动画效果展示

### 2. AI 会议室
- 四个 AI 角色：产品经理、设计师、程序员、测试
- 智能路由：主持人 AI 自动判断消息应该由哪些角色回复
- 支持 1v1 聊天和群聊模式
- 流式 API 响应，实时显示聊天内容

## 环境变量
项目使用以下环境变量：
- `VITE_BASE_PATH`：部署基础路径
- `VITE_KIMI_API_KEY`：Kimi API 密钥
- `VITE_PM_API_KEY`：产品经理角色 API 密钥
- `VITE_DESIGNER_API_KEY`：设计师角色 API 密钥
- `VITE_DEV_API_KEY`：程序员角色 API 密钥
- `VITE_QA_API_KEY`：测试角色 API 密钥

## 许可
MIT License

## 联系方式
如有问题，欢迎联系项目团队。