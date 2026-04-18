import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Play, CheckCircle2, Circle, 
  FileCode, FolderTree, Eye, Sparkles,
  ChevronDown, Copy, Check, ArrowLeft, ArrowRight
} from 'lucide-react';
import './Demo.css';

// Simulated Trae Solo workflow steps (advanced version)
const workflowSteps = [
  {
    id: 1,
    title: '接收需求',
    type: 'input',
    content: '"帮我创建一个抽奖系统，支持参与者管理和奖品设置"',
    duration: 1500,
  },
  {
    id: 2,
    title: '生成 PRD 文档',
    type: 'doc',
    content: `📋 PRD: 抽奖系统 v1.0

功能需求:
├── 参与者管理 (添加/删除/列表)
├── 奖品设置 (名称/数量/概率)
├── 抽奖引擎 (随机/加权)
└── 结果展示 (动画/记录)`,
    duration: 2000,
  },
  {
    id: 3,
    title: '自动匹配 Skill',
    type: 'skill',
    content: `🧩 Skill 自动匹配中...

检测到需求匹配以下 Skill:
├── [Match] react-best-practices
│   → 组件设计规范、状态管理最佳实践
├── [Match] frontend-design
│   → UI/UX 设计规范、响应式布局
└── [Match] webapp-testing
    → 自动生成单元测试

✅ 已加载 3 个 Skill，获得专业领域指导`,
    duration: 2500,
  },
  {
    id: 4,
    title: '创建项目结构',
    type: 'file',
    content: `📁 trae-lottery/
├── 📄 package.json
├── 📄 vite.config.js
├── 📁 .trae/
│   ├── 📁 skills/          ← Skill 配置
│   └── 📄 mcp.json         ← MCP 配置
├── 📁 src/
│   ├── 📄 App.jsx
│   ├── 📄 main.jsx
│   ├── 📁 components/
│   │   ├── LotteryWheel.jsx
│   │   ├── ParticipantList.jsx
│   │   └── PrizeConfig.jsx
│   ├── 📁 hooks/
│   │   └── useLottery.js
│   └── 📁 styles/
│       └── lottery.css`,
    duration: 2500,
  },
  {
    id: 5,
    title: '调用 MCP 工具',
    type: 'mcp',
    content: `🔌 MCP 工具调用中...

[SOLO Coder] → [SQLite MCP]
  → 查询奖品配置表: SELECT * FROM prizes
  → 返回: 4 条奖品记录

[SOLO Coder] → [GitHub MCP]
  → 搜索参考项目: "lottery react"
  → 找到 3 个开源参考实现

✅ MCP 工具调用完成，获得外部数据支撑`,
    duration: 2500,
  },
  {
    id: 6,
    title: 'Multi-Agent 协作编码',
    type: 'agent',
    content: `🤖 Multi-Agent 编排中...

[SOLO Coder] 主控智能体启动
  │
  ├── [Frontend Architect] Sub-agent
  │   → 模型: Claude-3.5-Sonnet
  │   → 任务: UI 组件开发
  │   → 状态: ✅ 已完成 (LotteryWheel, PrizeConfig)
  │
  ├── [Backend Architect] Sub-agent
  │   → 模型: GPT-4o
  │   → 任务: Hook + 状态管理
  │   → 状态: ✅ 已完成 (useLottery, 状态逻辑)
  │
  └── [API Test Pro] Sub-agent
      → 模型: DeepSeek
      → 任务: 单元测试
      → 状态: ✅ 已完成 (3 个测试用例)`,
    duration: 3500,
  },
  {
    id: 7,
    title: '生成核心代码',
    type: 'code',
    content: `// hooks/useLottery.js
export function useLottery() {
  const [participants, setParticipants] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState([]);
  
  const draw = useCallback(() => {
    const pool = [...participants];
    const results = [];
    for (const prize of prizes) {
      const idx = Math.floor(Math.random() * pool.length);
      results.push({ prize, winner: pool[idx] });
      pool.splice(idx, 1);
    }
    setWinners(results);
    return results;
  }, [participants, prizes]);
  
  return { participants, prizes, winners, draw };
}`,
    duration: 3000,
  },
  {
    id: 8,
    title: '实时预览 & 部署',
    type: 'deploy',
    content: `✅ 项目构建完成！

📊 统计:
   • 文件数: 14
   • 代码行数: 1,247
   • 测试覆盖: 3 个用例
   • 构建时间: 3.8s
   
🌐 预览地址: http://localhost:5173
🚀 部署到 Vercel... 完成！

⏱️ 总用时: 约 18 分钟（人工估计 3-5 小时）
🧩 使用 Skill: 3 个
🔌 调用 MCP: 2 次
🤖 Agent 协作: 3 个 Sub-agent`,
    duration: 2500,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const startDemo = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setCompletedSteps(new Set());
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (!isPlaying || currentStep < 0) return;
    
    const step = workflowSteps[currentStep];
    timerRef.current = setTimeout(() => {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      if (currentStep < workflowSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, step.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep]);

  const handleCopy = () => {
    if (currentStep >= 0) {
      navigator.clipboard?.writeText(workflowSteps[currentStep].content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'input': return '💬';
      case 'doc': return '📄';
      case 'skill': return '🧩';
      case 'file': return '📁';
      case 'mcp': return '🔌';
      case 'agent': return '🤖';
      case 'code': return '⚡';
      case 'deploy': return '🚀';
      default: return '✨';
    }
  };

  return (
    <motion.div 
      className="demo-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="demo-hero">
        <div className="container">
          <motion.h1 className="demo-hero-title" variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}>
            <Terminal size={28} className="inline-icon" />
            看看 SOLO <span className="gradient-text">如何工作</span>
          </motion.h1>
          <motion.p className="demo-hero-desc" variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
          }}>
            这是一个模拟的 SOLO 工作流回放，展示从需求输入到项目部署的完整过程
          </motion.p>
        </div>
      </section>

      <section className="demo-content section">
        <div className="container">
          <div className="demo-layout">
            {/* Left: Step List */}
            <div className="demo-steps">
              <div className="demo-steps-header">
                <h3>工作流步骤</h3>
                <div className="demo-controls">
                  {!isPlaying && currentStep < 0 && (
                    <button className="btn-play" onClick={startDemo}>
                      <Play size={16} />
                      <span>开始演示</span>
                    </button>
                  )}
                  {isPlaying && (
                    <button className="btn-playing" onClick={resetDemo}>
                      <Circle size={16} />
                      <span>演示中...</span>
                    </button>
                  )}
                  {!isPlaying && currentStep >= 0 && (
                    <button className="btn-play" onClick={startDemo}>
                      <Play size={16} />
                      <span>重新演示</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="steps-list">
                {workflowSteps.map((step, i) => {
                  const isActive = currentStep === i;
                  const isCompleted = completedSteps.has(i);
                  const isPending = !isActive && !isCompleted && currentStep >= 0;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="step-indicator">
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="step-check" />
                        ) : isActive ? (
                          <motion.div 
                            className="step-active-dot"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                        ) : (
                          <Circle size={18} className="step-pending" />
                        )}
                      </div>
                      <div className="step-info">
                        <span className="step-emoji">{getTypeIcon(step.type)}</span>
                        <span className="step-title">{step.title}</span>
                      </div>
                      {isActive && (
                        <motion.div 
                          className="step-progress"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: step.duration / 1000, ease: 'linear' }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Content Panel */}
            <div className="demo-panel glass">
              {currentStep < 0 ? (
                <div className="demo-panel-empty">
                  <Sparkles size={48} className="empty-icon" />
                  <h3>点击「开始演示」查看 SOLO 工作流</h3>
                  <p>你将看到 SOLO 如何从一句话需求生成完整项目</p>
                </div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="panel-header">
                    <div className="panel-dots">
                      <span /><span /><span />
                    </div>
                    <div className="panel-actions">
                      <button className="panel-action" onClick={handleCopy}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? '已复制' : '复制'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="panel-title-bar">
                    <span className="panel-emoji">{getTypeIcon(workflowSteps[currentStep].type)}</span>
                    <span>{workflowSteps[currentStep].title}</span>
                    {isPlaying && (
                      <motion.span 
                        className="panel-status"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        处理中...
                      </motion.span>
                    )}
                    {completedSteps.has(currentStep) && !isPlaying && (
                      <span className="panel-status panel-status-done">✅ 完成</span>
                    )}
                  </div>
                  <pre className="panel-content code-block">
                    <code>{workflowSteps[currentStep].content}</code>
                  </pre>
                </motion.div>
              )}
            </div>
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
              <span className="flow-nav-dot done" />入门
              <span className="flow-nav-dot done" />进阶
              <span className="flow-nav-dot active" />演示
              <span className="flow-nav-dot" />抽奖
            </div>
            <a href="/lottery" className="flow-nav-btn flow-nav-btn-primary">
              <span>试试抽奖</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
