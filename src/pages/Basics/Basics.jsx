import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Code2, Mic, Layers, ChevronRight, Sparkles, ArrowLeft, ArrowRight
} from 'lucide-react';
import './Basics.css';

const featureDetails = [
  {
    id: 'builder',
    icon: Bot,
    title: 'Builder 模式',
    subtitle: '从想法到产品的端到端构建',
    color: '#6C5CE7',
    description: 'Builder 模式是 SOLO 的核心能力。你只需要描述你的想法，SOLO 会自动完成从项目初始化、代码生成到部署的全流程。',
    capabilities: [
      '自动项目脚手架搭建',
      'PRD 文档生成与需求拆解',
      '前端+后端全栈代码生成',
      '一键部署到 Vercel/Netlify',
      '实时预览与即时反馈',
    ],
    codeExample: `// 你只需要这样描述：
"帮我做一个待办事项应用，支持拖拽排序"

// SOLO Builder 会自动：
// 1. 生成 PRD 文档
// 2. 创建 React + Vite 项目
// 3. 实现拖拽排序功能
// 4. 添加本地存储持久化
// 5. 部署到 Vercel`,
  },
  {
    id: 'coder',
    icon: Code2,
    title: 'Coder 模式',
    subtitle: '精确规划、深度执行的编码专家',
    color: '#00CEC9',
    description: 'Coder 模式专注于代码质量和精确执行。支持 Spec 模式和 Plan 模式，在编码前先进行详细的规划和规范定义。',
    capabilities: [
      'Spec 模式先定义规范再编码',
      'Plan 模式任务分解与执行计划',
      '跨文件重构与影响分析',
      '代码质量检查与优化建议',
      '子Agent协同处理复杂任务',
    ],
    codeExample: `// Plan 模式会自动生成执行计划：
//
// 📋 Task Plan:
// ├─ [1] 创建数据库模型 (User, Task)
// ├─ [2] 实现 RESTful API 端点
// │   ├─ [2a] 认证中间件
// │   └─ [2b] CRUD 操作
// ├─ [3] 前端组件开发
// │   ├─ [3a] 任务列表组件
// │   └─ [3b] 表单组件
// └─ [4] 集成测试`,
  },
  {
    id: 'voice',
    icon: Mic,
    title: '语音输入',
    subtitle: '像和队友对话一样描述需求',
    color: '#FDCB6E',
    description: 'SOLO 支持语音输入，你可以像和队友讨论一样描述你的需求。AI 输出也不再局限于代码，右侧可展开的动态视图提供直观的视觉反馈。',
    capabilities: [
      '自然语言语音识别',
      '实时语音转文字',
      '上下文理解与意图识别',
      '多轮对话支持',
      '动态视图可视化输出',
    ],
    codeExample: `// 语音交互示例：
//
// 🎤 你说："帮我给这个按钮加个加载动画"
//
// SOLO 理解：
// → 目标：Button 组件
// → 操作：添加 loading 状态
// → 动画：旋转/脉冲效果
//
// ✅ 自动生成代码并预览`,
  },
  {
    id: 'tools',
    icon: Layers,
    title: '全栈工具集成',
    subtitle: '终端、编辑器、浏览器、文档一体化',
    color: '#00B894',
    description: 'SOLO 将分散的开发工具统一到一个智能工作空间中。Agent 智能选择合适的上下文和工具，实时响应你的每一个操作。',
    capabilities: [
      '内置终端执行命令',
      '代码编辑器实时修改',
      '浏览器预览与调试',
      '文档视图(DocView)',
      'Figma 设计稿集成',
    ],
    codeExample: `// SOLO 工作空间布局：
// ┌──────────────────────────────────┐
// │  📝 Editor  │  🤖 AI Chat      │
// │             │  (动态视图)        │
// ├─────────────┼───────────────────┤
// │  💻 Terminal│  🌐 Browser      │
// │             │  (实时预览)        │
// └─────────────┴───────────────────┘
//
// 所有工具统一协调，AI 自由调度`,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Basics() {
  const [activeFeature, setActiveFeature] = useState(featureDetails[0]);

  // 滚动到页面顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="basics-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="basics-hero">
        <div className="container">
          <motion.h1 className="basics-hero-title" variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}>
            <span className="gradient-text">入门功能</span>
          </motion.h1>
          <motion.p className="basics-hero-desc" variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
          }}>
            Trae Solo 的核心基础能力——从零开始，快速上手
          </motion.p>
        </div>
      </section>

      <section className="basics-detail section">
        <div className="container">
          <div className="basics-layout">
            {/* Left: Feature List */}
            <motion.div className="feature-list" variants={containerVariants}>
              {featureDetails.map((feature) => {
                const isActive = activeFeature.id === feature.id;
                return (
                  <motion.button
                    key={feature.id}
                    className={`feature-list-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveFeature(feature)}
                    whileHover={{ x: 4 }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <div
                      className="fli-icon"
                      style={{ background: isActive ? feature.color : 'transparent' }}
                    >
                      <feature.icon
                        size={18}
                        color={isActive ? 'white' : feature.color}
                      />
                    </div>
                    <div className="fli-content">
                      <h3>{feature.title}</h3>
                      <p>{feature.subtitle}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="fli-arrow"
                      style={{ opacity: isActive ? 1 : 0 }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Right: Feature Detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                className="feature-detail glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="fd-header">
                  <div
                    className="fd-icon"
                    style={{ background: activeFeature.color }}
                  >
                    <activeFeature.icon size={24} color="white" />
                  </div>
                  <div>
                    <h2>{activeFeature.title}</h2>
                    <p className="fd-subtitle">{activeFeature.subtitle}</p>
                  </div>
                </div>

                <p className="fd-description">{activeFeature.description}</p>

                <div className="fd-capabilities">
                  <h4>
                    <Sparkles size={14} />
                    核心能力
                  </h4>
                  <ul>
                    {activeFeature.capabilities.map((cap) => (
                      <li key={cap}>
                        <span className="cap-dot" style={{ background: activeFeature.color }} />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="fd-code">
                  <div className="code-header">
                    <div className="code-dots">
                      <span /><span /><span />
                    </div>
                    <span className="code-lang">示例</span>
                  </div>
                  <pre className="code-block">
                    <code>{activeFeature.codeExample}</code>
                  </pre>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Page Flow Navigation */}
      <section className="page-flow-nav section">
        <div className="container">
          <div className="flow-nav-inner">
            <a href="/" className="flow-nav-btn">
              <ArrowLeft size={16} />
              <span>回到首页</span>
            </a>
            <div className="flow-nav-steps">
              <span className="flow-nav-dot active" />入门
              <span className="flow-nav-dot" />进阶
              <span className="flow-nav-dot" />演示
              <span className="flow-nav-dot" />抽奖
            </div>
            <a href="/advanced" className="flow-nav-btn flow-nav-btn-primary">
              <span>进阶功能</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
