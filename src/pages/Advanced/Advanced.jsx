import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Puzzle, Plug, Users, Bot, Code2, Mic, Layers, Sparkles,
  ChevronRight, ArrowRight, ArrowLeft, Zap, Database, GitBranch, Globe,
  FolderTree, CheckCircle2, XCircle, Play, Shield, Rocket,
  Cpu, Workflow, FileCheck, FileText, Brain, Search,
  Download, Eye, Terminal, Settings, Box, Lightbulb,
  ChevronDown, RefreshCw, Layout, Server, TestTube,
  Palette, BookOpen, Wrench, Info
} from 'lucide-react';
import './Advanced.css';

/* ===== Animation Variants ===== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } }
};

/* ===== Tabs ===== */
const TABS = [
  { key: 'skill', label: 'Skill 技能', emoji: '\u{1F9E9}' },
  { key: 'mcp', label: 'MCP 协议', emoji: '\u{1F50C}' },
  { key: 'agent', label: 'Multi-Agent', emoji: '\u{1F916}' },
];

/* ===== Skill Tab Data ===== */
const communitySkills = [
  {
    icon: Search,
    title: 'find-skills',
    desc: '搜索和发现社区 Skill，快速安装到项目中',
    installs: '12.4k',
    color: '#6C5CE7',
    bg: 'rgba(108,92,231,0.12)',
  },
  {
    icon: Layout,
    title: 'vercel-react-best-practices',
    desc: 'Vercel + React 最佳实践，自动优化部署配置',
    installs: '8.7k',
    color: '#00CEC9',
    bg: 'rgba(0,206,201,0.12)',
  },
  {
    icon: Palette,
    title: 'frontend-design',
    desc: '前端设计规范，统一色彩、字体、间距体系',
    installs: '6.2k',
    color: '#FD79A8',
    bg: 'rgba(253,121,168,0.12)',
  },
  {
    icon: Wrench,
    title: 'skill-creator',
    desc: '帮助创建自定义 Skill 的元技能工具',
    installs: '4.9k',
    color: '#FDCB6E',
    bg: 'rgba(253,203,110,0.12)',
  },
];

const layerData = [
  {
    num: 1,
    title: 'Metadata',
    subtitle: '~15 tokens，始终加载',
    color: '#6C5CE7',
    bg: 'rgba(108,92,231,0.12)',
    desc: 'Skill 名称、触发关键词、简短描述。SOLO 在每次对话时都会扫描所有已安装 Skill 的 Metadata，判断是否需要激活。',
    code: `# .trae/skills/lottery-code-review/SKILL.md
---
name: lottery-code-review
trigger:
  keywords: ["抽奖", "lottery", "review"]
  description: "Review lottery system code for bugs and best practices"
---`,
  },
  {
    num: 2,
    title: 'SKILL.md',
    subtitle: '~200 tokens，触发时加载',
    color: '#00CEC9',
    bg: 'rgba(0,206,201,0.12)',
    desc: '完整的 Skill 指令文件，定义了具体的行为规范和执行步骤。只有当 Metadata 匹配成功时，才会将 SKILL.md 注入上下文。',
    code: `## Review Checklist
- 检查抽奖概率计算是否正确
- 验证奖品库存扣减的原子性
- 确认随机数生成算法的安全性
- 检查防重复中奖逻辑
- 审查前端动画性能

## Output Format
输出结构化的 Review 报告，包含：
\`\`\`
[Bug] 严重程度: 高/中/低
[建议] 优化方向
[通过] 符合规范的检查项
\`\`\``,
  },
  {
    num: 3,
    title: 'Resources',
    subtitle: 'near-zero tokens，按需加载',
    color: '#FD79A8',
    bg: 'rgba(253,121,168,0.12)',
    desc: 'Skill 引用的外部资源文件（如模板、配置、参考文档）。只在执行过程中真正需要时才加载，几乎不占用上下文。',
    code: `# .trae/skills/lottery-code-review/resources/
├── templates/
│   ├── review-report.md      # Review 报告模板
│   └── bug-severity.md       # Bug 严重度标准
├── config/
│   └── lottery-rules.json    # 抽奖业务规则参考
└── examples/
    └── good-lottery-code.ts  # 优秀代码示例`,
  },
];

/* ===== MCP Tab Data ===== */
const mcpTools = [
  {
    icon: GitBranch,
    title: 'GitHub MCP',
    desc: '创建仓库、推送代码、管理 PR 和 Issue',
    color: '#6C5CE7',
    bg: 'rgba(108,92,231,0.12)',
  },
  {
    icon: Database,
    title: 'SQLite MCP',
    desc: '读写项目数据库，查询和管理业务数据',
    color: '#00CEC9',
    bg: 'rgba(0,206,201,0.12)',
  },
  {
    icon: FolderTree,
    title: 'Filesystem MCP',
    desc: '批量创建、修改、移动项目文件',
    color: '#FD79A8',
    bg: 'rgba(253,121,168,0.12)',
  },
  {
    icon: Globe,
    title: 'Web Search MCP',
    desc: '获取最新文档、查询 API 信息和技术方案',
    color: '#FDCB6E',
    bg: 'rgba(253,203,110,0.12)',
  },
  {
    icon: Rocket,
    title: 'Vercel MCP',
    desc: '一键部署到 Vercel，获取线上访问 URL',
    color: '#00B894',
    bg: 'rgba(0,184,148,0.12)',
  },
  {
    icon: Eye,
    title: 'Puppeteer MCP',
    desc: 'AI 自动操作浏览器：截图、填表、端到端测试',
    color: '#E17055',
    bg: 'rgba(225,112,85,0.12)',
  },
];

/* ===== Multi-Agent Tab Data ===== */
const agentArchitectures = [
  {
    name: 'Pipeline',
    nameCn: '流水线架构',
    desc: 'Agent 按固定顺序执行，上一个的输出是下一个的输入',
    pros: ['流程清晰可预测', '易于调试和回溯'],
    cons: ['串行执行，速度慢', '无法并行处理'],
    example: '需求分析 → 代码生成 → 代码审查 → 测试',
    icon: GitBranch,
    color: '#636E72',
  },
  {
    name: 'Supervisor-Worker',
    nameCn: '监督者-工人架构',
    desc: '一个 Supervisor Agent 负责任务分解和分配，多个 Worker Agent 并行执行',
    pros: ['支持并行执行', '灵活的任务分配', '上下文隔离'],
    cons: ['Supervisor 是单点瓶颈', '上下文传递有损耗'],
    example: 'SOLO Coder 分配任务给 Frontend / Backend / Test 三个 Worker',
    icon: Users,
    color: '#6C5CE7',
    highlight: true,
  },
  {
    name: 'Peer / Network',
    nameCn: '对等网络架构',
    desc: '所有 Agent 平等协作，通过消息传递通信，无中心节点',
    pros: ['去中心化，容错性强', 'Agent 自主决策'],
    cons: ['通信开销大', '协调复杂，容易死锁'],
    example: 'AutoGen、CrewAI 的默认协作模式',
    icon: Globe,
    color: '#00CEC9',
  },
  {
    name: 'Hierarchical',
    nameCn: '层级架构',
    desc: '多层级的 Supervisor-Worker，支持嵌套的任务分解',
    pros: ['适合超大型项目', '层次分明，职责清晰'],
    cons: ['复杂度极高', '调试困难', '通信链路长'],
    example: 'CEO → CTO → Tech Lead → Developer',
    icon: Layers,
    color: '#FD79A8',
  },
];

const presetAgents = [
  { icon: Layout, title: 'Frontend Architect', model: 'Claude-3.5-Sonnet', desc: '专注 UI 组件、样式系统、响应式布局', color: '#6C5CE7', bg: 'rgba(108,92,231,0.12)' },
  { icon: Server, title: 'Backend Architect', model: 'GPT-4o', desc: 'API 设计、数据库建模、后端逻辑', color: '#00CEC9', bg: 'rgba(0,206,201,0.12)' },
  { icon: TestTube, title: 'Test Engineer', model: 'DeepSeek-V3', desc: '单元测试、集成测试、E2E 测试', color: '#FD79A8', bg: 'rgba(253,121,168,0.12)' },
  { icon: FileCheck, title: 'Code Reviewer', model: 'Claude-3.5-Sonnet', desc: '代码审查、规范检查、安全审计', color: '#FDCB6E', bg: 'rgba(253,203,110,0.12)' },
  { icon: BookOpen, title: 'Doc Writer', model: 'GPT-4o', desc: 'API 文档、README、用户手册', color: '#00B894', bg: 'rgba(0,184,148,0.12)' },
  { icon: Zap, title: 'Perf Optimizer', model: 'DeepSeek-V3', desc: '性能分析、Bundle 优化、懒加载', color: '#E17055', bg: 'rgba(225,112,85,0.12)' },
  { icon: Shield, title: 'Security Auditor', model: 'Claude-3.5-Sonnet', desc: '安全扫描、漏洞检测、合规检查', color: '#0984E3', bg: 'rgba(9,132,227,0.12)' },
  { icon: Rocket, title: 'DevOps Engineer', model: 'GPT-4o', desc: 'CI/CD、Docker、部署自动化', color: '#6C5CE7', bg: 'rgba(108,92,231,0.12)' },
];

const subAgentDetails = {
  frontend: {
    name: 'Frontend Architect',
    model: 'Claude-3.5-Sonnet',
    code: `// LotteryWheel.tsx - 抽奖转盘组件
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Prize { id: string; name: string; color: string; }

export function LotteryWheel({ prizes }: { prizes: Prize[] }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    const extra = Math.floor(Math.random() * 360);
    setRotation(prev => prev + 1440 + extra);
    setTimeout(() => setSpinning(false), 4000);
  }, [spinning]);

  return (
    <div className="wheel-container">
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ duration: 4, ease: 'easeOut' }}
        className="wheel"
      >
        {prizes.map((p, i) => (
          <div key={p.id} className="wheel-segment"
            style={{
              transform: \`rotate(\${i * (360/prizes.length)}deg)\`,
              background: p.color,
            }}
          />
        ))}
      </motion.div>
      <button onClick={spin} disabled={spinning}>
        {spinning ? '抽奖中...' : '开始抽奖'}
      </button>
    </div>
  );
}`,
  },
  backend: {
    name: 'Backend Architect',
    model: 'GPT-4o',
    code: `// useLottery.ts - 抽奖核心 Hook
import { useState, useCallback } from 'react';

interface LotteryState {
  prizes: Prize[];
  remaining: Record<string, number>;
  history: LotteryRecord[];
  isDrawing: boolean;
}

export function useLottery(initialPrizes: Prize[]) {
  const [state, setState] = useState<LotteryState>({
    prizes: initialPrizes,
    remaining: Object.fromEntries(
      initialPrizes.map(p => [p.id, p.stock])
    ),
    history: [],
    isDrawing: false,
  });

  const draw = useCallback(() => {
    setState(prev => {
      if (prev.isDrawing) return prev;
      // 加权随机算法
      const available = prev.prizes.filter(
        p => prev.remaining[p.id] > 0
      );
      if (available.length === 0) return prev;

      const totalWeight = available.reduce(
        (sum, p) => sum + p.weight, 0
      );
      let rand = Math.random() * totalWeight;
      let selected = available[0];
      for (const p of available) {
        rand -= p.weight;
        if (rand <= 0) { selected = p; break; }
      }

      return {
        ...prev,
        isDrawing: true,
        remaining: {
          ...prev.remaining,
          [selected.id]: prev.remaining[selected.id] - 1,
        },
        history: [...prev.history, {
          prize: selected,
          time: Date.now(),
        }],
      };
    });
    setTimeout(() => {
      setState(prev => ({ ...prev, isDrawing: false }));
    }, 500);
  }, []);

  return { ...state, draw };
}`,
  },
  test: {
    name: 'API Test Pro',
    model: 'DeepSeek-V3',
    code: `// useLottery.test.ts - 抽奖 Hook 单元测试
import { renderHook, act } from '@testing-library/react';
import { useLottery } from './useLottery';

const mockPrizes = [
  { id: 'p1', name: '一等奖', stock: 1, weight: 1 },
  { id: 'p2', name: '二等奖', stock: 5, weight: 5 },
  { id: 'p3', name: '三等奖', stock: 10, weight: 10 },
];

describe('useLottery', () => {
  it('应正确初始化状态', () => {
    const { result } = renderHook(() =>
      useLottery(mockPrizes)
    );
    expect(result.current.prizes).toHaveLength(3);
    expect(result.current.history).toHaveLength(0);
    expect(result.current.isDrawing).toBe(false);
  });

  it('抽奖后应减少库存', () => {
    const { result } = renderHook(() =>
      useLottery(mockPrizes)
    );
    act(() => { result.current.draw(); });
    const totalBefore = Object.values(
      result.current.remaining
    ).reduce((a, b) => a + b, 0);
    expect(totalBefore).toBe(15); // 16 - 1
  });

  it('库存为 0 时不应中奖', () => {
    const singlePrize = [{ ...mockPrizes[0], stock: 1 }];
    const { result } = renderHook(() =>
      useLottery(singlePrize)
    );
    act(() => { result.current.draw(); });
    act(() => { result.current.draw(); });
    expect(result.current.remaining['p1']).toBe(0);
    expect(result.current.history).toHaveLength(1);
  });

  it('不应在抽奖过程中重复触发', () => {
    const { result } = renderHook(() =>
      useLottery(mockPrizes)
    );
    act(() => {
      result.current.draw();
      result.current.draw(); // 应被忽略
    });
    expect(result.current.history).toHaveLength(1);
  });
});`,
  },
};

/* ===== Skill Tab Component ===== */
function SkillTab() {
  const [distillView, setDistillView] = useState('before');
  const [openLayers, setOpenLayers] = useState([0]);

  const toggleLayer = (idx) => {
    setOpenLayers(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Intro Banner */}
      <motion.div className="intro-banner" variants={itemVariants}>
        <div className="banner-icon" style={{ background: 'rgba(108,92,231,0.12)' }}>
          <Puzzle size={24} color="#6C5CE7" />
        </div>
        <div className="banner-text">
          在构建抽奖系统时，如果你每次都要告诉 SOLO <strong>"用 React + Tailwind、函数式组件、中文注释"</strong>，不如把这些做成一个 Skill —— SOLO 会自动识别并应用。
        </div>
      </motion.div>

      {/* Rules vs Skill */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Layers size={14} />
          Rules vs Skill
        </div>
        <h2 className="section-title">项目规范 vs 按需技能</h2>
      </motion.div>

      <motion.div className="comparison-grid" variants={itemVariants}>
        {/* Rules Card */}
        <div className="comparison-card">
          <div className="card-header">
            <div className="icon-box" style={{ background: 'rgba(108,92,231,0.12)' }}>
              <FileText size={20} color="#6C5CE7" />
            </div>
            <h3>.rules</h3>
            <span className="tag" style={{ background: 'rgba(108,92,231,0.12)', color: '#A29BFE' }}>
              始终加载
            </span>
          </div>
          <div className="card-body">
            <p className="desc">适合项目级规范，每次对话都会注入上下文。适合全局性的、不可变更的规则。</p>
            <div className="code-example">
<span className="code-filename">.rules</span>
<span className="comment"># 抽奖系统项目规范</span>
- 使用 React 18 + TypeScript
- 样式方案：Tailwind CSS
- 组件风格：函数式组件 + Hooks
- 代码注释使用中文
- 文件命名：PascalCase 组件，camelCase 工具函数
- 状态管理：优先使用 useState/useReducer
- 测试框架：Vitest + React Testing Library
            </div>
          </div>
        </div>

        {/* Skill Card */}
        <div className="comparison-card">
          <div className="card-header">
            <div className="icon-box" style={{ background: 'rgba(0,206,201,0.12)' }}>
              <Puzzle size={20} color="#00CEC9" />
            </div>
            <h3>SKILL.md</h3>
            <span className="tag" style={{ background: 'rgba(0,206,201,0.12)', color: '#00CEC9' }}>
              按需加载
            </span>
          </div>
          <div className="card-body">
            <p className="desc">三层渐进架构，只在匹配到关键词时才加载，节省上下文空间。</p>
            <div className="code-example">
<span className="code-filename">.trae/skills/lottery-component/SKILL.md</span>
<span className="comment">---</span>
<span className="keyword">name:</span> lottery-component
<span className="keyword">trigger:</span>
  <span className="keyword">keywords:</span> [<span className="string">"抽奖组件"</span>, <span className="string">"转盘"</span>, <span className="string">"LotteryWheel"</span>]
<span className="comment">---</span>

<span className="comment"># 抽奖组件开发规范</span>
- 转盘使用 framer-motion 实现旋转动画
- 奖品扇区颜色从预设调色板中选取
- 抽奖结果通过回调函数通知父组件
- 防重复点击：spinning 状态锁
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skill Distillation Demo */}
      <motion.div className="distill-demo" variants={itemVariants}>
        <div className="section-label">
          <Sparkles size={14} />
          Skill 蒸馏
        </div>
        <h2 className="section-title">从冗长 Prompt 到精炼 Skill</h2>

        <div className="distill-toggle">
          <button
            className={`distill-toggle-btn ${distillView === 'before' ? 'active' : ''}`}
            onClick={() => setDistillView('before')}
          >
            <XCircle size={16} />
            蒸馏前 (冗长 Prompt)
          </button>
          <button
            className={`distill-toggle-btn ${distillView === 'after' ? 'active' : ''}`}
            onClick={() => setDistillView('after')}
          >
            <CheckCircle2 size={16} />
            蒸馏后 (SKILL.md)
          </button>
        </div>

        <AnimatePresence mode="wait">
          {distillView === 'before' ? (
            <motion.div
              key="before"
              className="distill-grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="distill-card">
                <div className="card-label before">
                  <FileText size={14} />
                  用户每次手动输入的 Prompt
                </div>
                <div className="card-content">
                  <div className="code-example">
请帮我 review 一下抽奖系统的代码。我需要你关注以下几点：

1. 检查抽奖概率计算是否正确，我们使用的是加权随机算法，需要确保权重越大中奖概率越高
2. 验证奖品库存扣减是否是原子操作，防止超发
3. 确认随机数生成算法是否安全，不能被预测
4. 检查是否有防重复中奖的逻辑
5. 审查前端转盘动画的性能，确保不会卡顿
6. 检查错误处理是否完善
7. 确保代码注释是中文的

输出格式要求：使用结构化的报告，包含 Bug（标注严重程度）、优化建议和通过项。
                  </div>
                  <div className="token-badge high">
                    <Zap size={12} />
                    ~350 tokens / 次
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              className="distill-grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="distill-card">
                <div className="card-label after">
                  <Sparkles size={14} />
                  蒸馏后的 SKILL.md（自动触发）
                </div>
                <div className="card-content">
                  <div className="code-example">
<span className="code-filename">.trae/skills/lottery-code-review/SKILL.md</span>
<span className="comment">---</span>
<span className="keyword">name:</span> lottery-code-review
<span className="keyword">trigger:</span>
  <span className="keyword">keywords:</span> [<span className="string">"review"</span>, <span className="string">"审查"</span>, <span className="string">"抽奖代码"</span>]
<span className="comment">---</span>

<span className="comment"># Review Checklist</span>
- 概率计算正确性（加权随机）
- 库存扣减原子性
- 随机数安全性
- 防重复中奖
- 动画性能
- 错误处理
- 中文注释

<span className="comment"># Output</span>
结构化报告: [Bug] 严重度 | [建议] | [通过]
                  </div>
                  <div className="token-badge low">
                    <Zap size={12} />
                    ~80 tokens（仅触发时加载）
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Three-Layer Loading Architecture */}
      <motion.div className="layer-accordion" variants={itemVariants}>
        <div className="section-label">
          <Layers size={14} />
          三层加载架构
        </div>
        <h2 className="section-title">渐进式上下文加载</h2>

        {layerData.map((layer, idx) => (
          <motion.div
            key={idx}
            className="layer-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="layer-panel-header" onClick={() => toggleLayer(idx)}>
              <div className="layer-num" style={{ background: layer.bg, color: layer.color }}>
                L{layer.num}
              </div>
              <div className="layer-info">
                <h4>{layer.title}</h4>
                <p>{layer.subtitle}</p>
              </div>
              <ChevronRight
                size={18}
                className={`layer-chevron ${openLayers.includes(idx) ? 'open' : ''}`}
              />
            </div>
            <AnimatePresence>
              {openLayers.includes(idx) && (
                <motion.div
                  className="layer-panel-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12 }}>
                    {layer.desc}
                  </p>
                  <div className="code-example">{layer.code}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Community Skills */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Globe size={14} />
          社区 Skill
        </div>
        <h2 className="section-title">热门社区技能</h2>
      </motion.div>

      <motion.div className="community-grid" variants={containerVariants}>
        {communitySkills.map((skill, idx) => (
          <motion.div
            key={idx}
            className="community-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="card-icon" style={{ background: skill.bg }}>
              <skill.icon size={22} color={skill.color} />
            </div>
            <h4>{skill.title}</h4>
            <p>{skill.desc}</p>
            <div className="install-count">
              <Download size={12} />
              {skill.installs} 次安装
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ===== MCP Tab Component ===== */
function MCPTab() {
  const [mcpView, setMcpView] = useState('without');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Intro Banner */}
      <motion.div className="intro-banner" variants={itemVariants}>
        <div className="banner-icon" style={{ background: 'rgba(0,206,201,0.12)' }}>
          <Plug size={24} color="#00CEC9" />
        </div>
        <div className="banner-text">
          豆包网页版、ChatGPT 网页版……它们只能<strong>"说"不能"做"</strong>。而 SOLO 通过 MCP 协议，可以让 AI 直接操作真实的外部服务 —— 创建 GitHub 仓库、部署到 Vercel、发送邮件……这不是模拟，是真实发生的。
        </div>
      </motion.div>

      {/* Architecture Diagram */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Workflow size={14} />
          架构
        </div>
        <h2 className="section-title">MCP 协议架构</h2>
      </motion.div>

      <motion.div className="mcp-arch-diagram" variants={itemVariants}>
        <div className="mcp-arch-node">
          <div className="node-icon" style={{ background: 'rgba(108,92,231,0.12)' }}>
            <Users size={28} color="#6C5CE7" />
          </div>
          <span className="node-label">用户</span>
        </div>

        <div className="mcp-arch-arrow">
          <div className="arrow-line">
            <div className="arrow-dots">
              <div className="arrow-dot" />
              <div className="arrow-dot" />
              <div className="arrow-dot" />
            </div>
          </div>
          <ChevronRight size={16} color="var(--color-primary-light)" />
        </div>

        <div className="mcp-arch-node">
          <div className="node-icon" style={{ background: 'rgba(108,92,231,0.2)' }}>
            <Bot size={28} color="#A29BFE" />
          </div>
          <span className="node-label">SOLO Agent</span>
        </div>

        <div className="mcp-arch-arrow">
          <div className="arrow-line">
            <div className="arrow-dots">
              <div className="arrow-dot" />
              <div className="arrow-dot" />
              <div className="arrow-dot" />
            </div>
          </div>
          <ChevronRight size={16} color="var(--color-primary-light)" />
        </div>

        <div className="mcp-arch-node">
          <div className="node-icon" style={{ background: 'rgba(0,206,201,0.12)' }}>
            <Server size={28} color="#00CEC9" />
          </div>
          <span className="node-label">MCP Server</span>
        </div>

        <div className="mcp-arch-arrow">
          <div className="arrow-line">
            <div className="arrow-dots">
              <div className="arrow-dot" />
              <div className="arrow-dot" />
              <div className="arrow-dot" />
            </div>
          </div>
          <ChevronRight size={16} color="var(--color-primary-light)" />
        </div>

        <div className="mcp-arch-node">
          <div className="node-icon" style={{ background: 'rgba(253,121,168,0.12)' }}>
            <Database size={28} color="#FD79A8" />
          </div>
          <span className="node-label">SQLite / DB</span>
        </div>
      </motion.div>

      {/* Config Demo */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Settings size={14} />
          配置
        </div>
        <h2 className="section-title">MCP 配置示例</h2>
      </motion.div>

      <motion.div className="config-demo" variants={itemVariants}>
        <div className="config-card">
          <div className="config-header">
            <FileText size={16} color="#6C5CE7" />
            .trae/mcp.json
          </div>
          <div className="config-body">
            <pre className="code-block">{`{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "./lottery.db"
      ]
    }
  }
}`}</pre>
          </div>
        </div>

        <div className="config-card">
          <div className="config-header">
            <Zap size={16} color="#00CEC9" />
            新增可用工具
          </div>
          <div className="config-body">
            <div className="code-example">
<span className="comment">// 配置 SQLite MCP 后，SOLO 自动获得以下工具：</span>

<span className="keyword">read_query</span>(sql)
  <span className="comment">→ 执行 SELECT 查询</span>

<span className="keyword">write_query</span>(sql)
  <span className="comment">→ 执行 INSERT/UPDATE/DELETE</span>

<span className="keyword">list_tables</span>()
  <span className="comment">→ 列出所有表</span>

<span className="keyword">describe_table</span>(table)
  <span className="comment">→ 查看表结构</span>

<span className="comment">// 无需手动调用，SOLO 会自动判断何时使用</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparison Toggle */}
      <motion.div className="mcp-comparison" variants={itemVariants}>
        <div className="section-label">
          <Lightbulb size={14} />
          对比
        </div>
        <h2 className="section-title">有 MCP vs 没有 MCP</h2>

        <div className="mcp-comp-toggle">
          <button
            className={`mcp-comp-btn ${mcpView === 'without' ? 'active bad' : ''}`}
            onClick={() => setMcpView('without')}
          >
            <XCircle size={16} />
            没有 MCP
          </button>
          <button
            className={`mcp-comp-btn ${mcpView === 'with' ? 'active' : ''}`}
            onClick={() => setMcpView('with')}
          >
            <CheckCircle2 size={16} />
            有 MCP
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mcpView === 'without' ? (
            <motion.div
              key="without"
              className="mcp-comp-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <div className="scenario-label fail">
                <XCircle size={12} />
                普通 AI 对话框（只能"说"）
              </div>
              <div className="scenario-text">
                <div className="user-msg">
                  用户: "帮我把这个抽奖系统部署到线上"
                </div>
                <div className="ai-response fail">
                  AI: 我无法直接帮你部署。以下是部署步骤：
                  <br />
                  1. 安装 Node.js 和 npm
                  <br />
                  2. 运行 npm run build
                  <br />
                  3. 注册 Vercel 账号
                  <br />
                  4. 上传 dist 文件夹
                  <br />
                  请你按照这些步骤手动操作。如果遇到问题随时问我。
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="with"
              className="mcp-comp-content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <div className="scenario-label success">
                <CheckCircle2 size={12} />
                SOLO + MCP（直接"做"）
              </div>
              <div className="scenario-text">
                <div className="user-msg">
                  用户: "帮我把这个抽奖系统部署到线上"
                </div>
                <div className="ai-response success">
                  AI: 好的，我来帮你部署。
                  <br />
                  <br />
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    [调用 GitHub MCP] 创建仓库 trae-lottery-demo...
                  </code>
                  <br />
                  ✓ 仓库已创建: github.com/user/trae-lottery-demo
                  <br />
                  <br />
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    [调用 GitHub MCP] 推送代码...
                  </code>
                  <br />
                  ✓ 已推送 14 个文件
                  <br />
                  <br />
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    [调用 Vercel MCP] 创建部署...
                  </code>
                  <br />
                  ✓ 部署成功: trae-lottery-demo.vercel.app
                  <br />
                  <br />
                  🎉 抽奖系统已上线！访问: <strong>https://trae-lottery-demo.vercel.app</strong>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="mcp-proof-note" variants={itemVariants} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Rocket size={16} />
          <span>以上操作不是模拟 —— SOLO 在开发这个抽奖系统时，确实通过 MCP 创建了 GitHub 仓库、部署了线上版本。你正在访问的这个页面，就是 SOLO 部署的。</span>
        </motion.div>
      </motion.div>

      {/* MCP Tools Grid */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Box size={14} />
          工具
        </div>
        <h2 className="section-title">可用 MCP 工具</h2>
      </motion.div>

      <motion.div className="mcp-tools-grid" variants={containerVariants}>
        {mcpTools.map((tool, idx) => (
          <motion.div
            key={idx}
            className="mcp-tool-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="tool-icon" style={{ background: tool.bg }}>
              <tool.icon size={22} color={tool.color} />
            </div>
            <h4>{tool.title}</h4>
            <p>{tool.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ===== Multi-Agent Tab Component ===== */
function MultiAgentTab() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ frontend: 0, backend: 0, test: 0 });
  const [activeAgent, setActiveAgent] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | distributing | working | done

  const startDemo = useCallback(() => {
    setIsPlaying(true);
    setProgress({ frontend: 0, backend: 0, test: 0 });
    setActiveAgent(null);
    setPhase('distributing');

    // Phase 1: distributing (1s)
    setTimeout(() => setPhase('working'), 1000);

    // Phase 2: working - animate progress
    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const base = (step / steps) * 100;
      setProgress({
        frontend: Math.min(100, base * (0.9 + Math.random() * 0.2)),
        backend: Math.min(100, base * (0.85 + Math.random() * 0.25)),
        test: Math.min(100, base * (0.8 + Math.random() * 0.3)),
      });
      if (step >= steps) {
        clearInterval(timer);
        setProgress({ frontend: 100, backend: 100, test: 100 });
        setPhase('done');
        setIsPlaying(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleAgentClick = (key) => {
    setActiveAgent(prev => prev === key ? null : key);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Intro Banner */}
      <motion.div className="intro-banner" variants={itemVariants}>
        <div className="banner-icon" style={{ background: 'rgba(253,121,168,0.12)' }}>
          <Users size={24} color="#FD79A8" />
        </div>
        <div className="banner-text">
          抽奖系统的<strong>前端 UI</strong>、<strong>后端 Hook 逻辑</strong>、<strong>单元测试</strong> —— 三个 Sub-agent 各自独立上下文，由 SOLO Coder 统一编排，并行开发。
        </div>
      </motion.div>

      {/* Agent Architecture Theory */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Brain size={14} />
          架构理论
        </div>
        <h2 className="section-title">Multi-Agent 主流架构对比</h2>
      </motion.div>

      <motion.div className="arch-grid" variants={containerVariants}>
        {agentArchitectures.map((arch) => (
          <motion.div key={arch.name} className={`arch-card${arch.highlight ? ' highlight' : ''}`} variants={itemVariants}>
            <div className="arch-header">
              <div className="arch-icon" style={{ background: `${arch.color}20`, color: arch.color }}>
                <arch.icon size={20} />
              </div>
              <div>
                <h4 className="arch-name">{arch.name}</h4>
                <span className="arch-name-cn">{arch.nameCn}</span>
              </div>
              {arch.highlight && <span className="arch-badge">SOLO 采用</span>}
            </div>
            <p className="arch-desc">{arch.desc}</p>
            <div className="arch-pros">
              {arch.pros.map((p) => (
                <div key={p} className="arch-pro-item"><CheckCircle2 size={12} color="#00B894" /><span>{p}</span></div>
              ))}
            </div>
            <div className="arch-cons">
              {arch.cons.map((c) => (
                <div key={c} className="arch-con-item"><XCircle size={12} color="#FF6B6B" /><span>{c}</span></div>
              ))}
            </div>
            <div className="arch-example">
              <code>{arch.example}</code>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="mcp-proof-note" variants={itemVariants} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Cpu size={16} />
        <span>TRAE SOLO 的 Coder 模式采用 <strong>Supervisor-Worker</strong> 架构 —— SOLO Coder 作为 Supervisor 负责任务分解和结果整合，多个 Sub-agent 作为 Worker 并行执行，上下文完全隔离。</span>
      </motion.div>

      <motion.div className="arch-honest-note" variants={itemVariants} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Info size={16} />
        <span>注意：本次抽奖系统演示项目主要使用 Builder 模式（单 Agent 端到端构建），下方的 Multi-Agent 编排演示为模拟效果，展示 Coder 模式的潜力。</span>
      </motion.div>

      {/* Builder vs Coder */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Bot size={14} />
          模式对比
        </div>
        <h2 className="section-title">Builder vs Coder</h2>
      </motion.div>

      <motion.div className="builder-coder-grid" variants={itemVariants}>
        <div className="bc-card">
          <div className="bc-header">
            <div className="bc-icon" style={{ background: 'rgba(108,92,231,0.12)' }}>
              <Bot size={22} color="#6C5CE7" />
            </div>
            <h3>Builder 模式</h3>
          </div>
          <div className="bc-body">
            <p>端到端构建，SOLO 全权负责。适合从零开始的新项目，AI 自主完成所有决策。</p>
            <ul>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 自动生成 PRD 文档</li>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 全栈代码生成</li>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 一键部署</li>
              <li><XCircle size={14} color="var(--text-muted)" /> 用户控制粒度较粗</li>
              <li><XCircle size={14} color="var(--text-muted)" /> 单 Agent 执行</li>
            </ul>
          </div>
        </div>

        <div className="bc-card">
          <div className="bc-header">
            <div className="bc-icon" style={{ background: 'rgba(0,206,201,0.12)' }}>
              <Code2 size={22} color="#00CEC9" />
            </div>
            <h3>Coder 模式</h3>
          </div>
          <div className="bc-body">
            <p>精确规划、深度执行。支持 Plan/Spec 模式，多 Agent 协同处理复杂任务。</p>
            <ul>
              <li><CheckCircle2 size={14} color="#00CEC9" /> Plan / Spec 双模式</li>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 多 Sub-agent 并行</li>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 独立模型选择</li>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 上下文隔离</li>
              <li><CheckCircle2 size={14} color="#00CEC9" /> 精细任务控制</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Agent Orchestration */}
      <motion.div className="agent-orchestration" variants={itemVariants}>
        <div className="section-label">
          <Workflow size={14} />
          编排演示
        </div>
        <h2 className="section-title">Agent 编排可视化</h2>

        <div className="orchestration-controls">
          <motion.button
            className="orchestration-start-btn"
            onClick={startDemo}
            disabled={isPlaying}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={18} />
            {phase === 'idle' ? '开始演示' : phase === 'done' ? '重新演示' : '演示中...'}
          </motion.button>
        </div>

        <div className="orchestration-flow">
          {/* Main Agent */}
          <motion.div
            className="main-agent-card"
            animate={phase === 'distributing' ? { scale: [1, 1.03, 1] } : {}}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Cpu size={20} color="#6C5CE7" />
              <span className="agent-name">SOLO Coder</span>
            </div>
            <div className="agent-model">主编排 Agent</div>
            <div className="agent-status">
              {phase === 'idle' && '等待启动...'}
              {phase === 'distributing' && '正在分配任务给 Sub-agents...'}
              {phase === 'working' && '监控 Sub-agents 执行进度...'}
              {phase === 'done' && '所有任务已完成!'}
            </div>
          </motion.div>

          {/* Distribution Arrows */}
          <div className="dist-arrows">
            {['frontend', 'backend', 'test'].map((key) => (
              <div key={key} className="dist-arrow">
                <div className="arrow-shaft">
                  {(phase === 'distributing' || phase === 'working') && (
                    <div className="flow-particle" />
                  )}
                </div>
                <div className="arrow-head" />
              </div>
            ))}
          </div>

          {/* Sub-agents */}
          <div className="sub-agents-row">
            {[
              {
                key: 'frontend',
                icon: Layout,
                name: 'Frontend Architect',
                model: 'Claude-3.5-Sonnet',
                tasks: ['LotteryWheel', 'PrizeConfig'],
                color: '#6C5CE7',
                bg: 'rgba(108,92,231,0.12)',
              },
              {
                key: 'backend',
                icon: Server,
                name: 'Backend Architect',
                model: 'GPT-4o',
                tasks: ['useLottery', 'State Mgmt'],
                color: '#00CEC9',
                bg: 'rgba(0,206,201,0.12)',
              },
              {
                key: 'test',
                icon: TestTube,
                name: 'API Test Pro',
                model: 'DeepSeek-V3',
                tasks: ['Unit Tests', 'E2E Tests'],
                color: '#FD79A8',
                bg: 'rgba(253,121,168,0.12)',
              },
            ].map((agent) => (
              <motion.div
                key={agent.key}
                className={`sub-agent-card ${activeAgent === agent.key ? 'active' : ''}`}
                onClick={() => handleAgentClick(agent.key)}
                whileHover={{ y: -2 }}
                animate={
                  phase === 'working'
                    ? { boxShadow: [
                        '0 0 0 rgba(108,92,231,0)',
                        '0 0 20px rgba(108,92,231,0.3)',
                        '0 0 0 rgba(108,92,231,0)',
                      ]}
                    : {}
                }
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="sa-header">
                  <div className="sa-icon" style={{ background: agent.bg }}>
                    <agent.icon size={18} color={agent.color} />
                  </div>
                  <div>
                    <div className="sa-name">{agent.name}</div>
                    <div className="sa-model">{agent.model}</div>
                  </div>
                </div>
                <div className="sa-tasks">
                  {agent.tasks.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-label">
                    <span>进度</span>
                    <span>{Math.round(progress[agent.key])}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <motion.div
                      className="progress-bar-fill"
                      style={{
                        width: `${progress[agent.key]}%`,
                        background: `linear-gradient(90deg, ${agent.color}, ${agent.color}88)`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sub-agent Detail */}
          <AnimatePresence>
            {activeAgent && subAgentDetails[activeAgent] && (
              <motion.div
                className="sub-agent-detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="detail-header">
                  <Code2 size={16} color="var(--color-primary-light)" />
                  {subAgentDetails[activeAgent].name} ({subAgentDetails[activeAgent].model}) 生成的代码
                </div>
                <div className="detail-body">
                  <div className="code-example">
                    {subAgentDetails[activeAgent].code}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Context Management */}
      <motion.div className="context-section" variants={itemVariants}>
        <div className="section-label">
          <Layers size={14} />
          上下文管理
        </div>
        <h2 className="section-title">共享层 vs 隔离层</h2>

        <div className="context-layers">
          <motion.div
            className="context-layer shared"
            variants={itemVariants}
          >
            <div className="layer-icon" style={{ background: 'rgba(108,92,231,0.15)' }}>
              <Globe size={22} color="#A29BFE" />
            </div>
            <div className="layer-info">
              <h4 style={{ color: '#A29BFE' }}>Shared Context (共享层)</h4>
              <p>所有 Sub-agent 共享的项目级信息，确保一致性</p>
              <div className="layer-tags">
                <span className="layer-tag">项目结构</span>
                <span className="layer-tag">.rules 规范</span>
                <span className="layer-tag">类型定义</span>
                <span className="layer-tag">API 接口</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="context-layer isolated"
            variants={itemVariants}
          >
            <div className="layer-icon" style={{ background: 'rgba(0,206,201,0.15)' }}>
              <Shield size={22} color="#00CEC9" />
            </div>
            <div className="layer-info">
              <h4 style={{ color: '#00CEC9' }}>Isolated Context (隔离层)</h4>
              <p>每个 Sub-agent 独有的上下文，互不干扰</p>
              <div className="layer-tags">
                <span className="layer-tag">对话历史</span>
                <span className="layer-tag">执行计划</span>
                <span className="layer-tag">中间结果</span>
                <span className="layer-tag">错误日志</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Plan vs Spec */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <FileCheck size={14} />
          编码模式
        </div>
        <h2 className="section-title">Plan vs Spec</h2>
      </motion.div>

      <motion.div className="plan-spec-grid" variants={itemVariants}>
        <div className="ps-card">
          <div className="ps-header">
            <div className="ps-icon" style={{ background: 'rgba(108,92,231,0.12)' }}>
              <FileText size={20} color="#6C5CE7" />
            </div>
            <h3>Plan 模式</h3>
          </div>
          <div className="ps-body">
            <p>先制定执行计划，列出所有步骤和文件变更，确认后再逐步执行。</p>
            <div className="code-example">
<span className="comment">// Plan: 抽奖系统开发计划</span>
<span className="keyword">Step 1:</span> 创建类型定义 types/lottery.ts
<span className="keyword">Step 2:</span> 实现 useLottery Hook
<span className="keyword">Step 3:</span> 开发 LotteryWheel 组件
<span className="keyword">Step 4:</span> 开发 PrizeConfig 组件
<span className="keyword">Step 5:</span> 编写单元测试
<span className="keyword">Step 6:</span> 集成到 App.tsx
            </div>
          </div>
        </div>

        <div className="ps-card">
          <div className="ps-header">
            <div className="ps-icon" style={{ background: 'rgba(0,206,201,0.12)' }}>
              <FileCheck size={20} color="#00CEC9" />
            </div>
            <h3>Spec 模式</h3>
          </div>
          <div className="ps-body">
            <p>先定义详细的技术规范，包括接口、数据结构、行为约束，再基于规范编码。</p>
            <pre className="code-block">{`// Spec: useLottery Hook 规范
interface LotteryState {
  prizes: Prize[]
  remaining: Record<string, number>
  history: LotteryRecord[]
  isDrawing: boolean
}
function draw(): void
  // 前置条件: !isDrawing && 有库存
  // 后置条件: remaining[prizeId]--
  // 副作用: history.push(record)`}</pre>
          </div>
        </div>
      </motion.div>

      {/* Preset Sub-agents */}
      <motion.div variants={itemVariants}>
        <div className="section-label">
          <Cpu size={14} />
          预设
        </div>
        <h2 className="section-title">预设 Sub-agent</h2>
      </motion.div>

      <motion.div className="preset-grid" variants={containerVariants}>
        {presetAgents.map((agent, idx) => (
          <motion.div
            key={idx}
            className="preset-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="preset-icon" style={{ background: agent.bg }}>
              <agent.icon size={20} color={agent.color} />
            </div>
            <h4>{agent.title}</h4>
            <div className="preset-model">{agent.model}</div>
            <p>{agent.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ===== Main Page Component ===== */
export default function Advanced() {
  const [activeTab, setActiveTab] = useState('skill');

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="advanced-page">
      {/* Hero */}
      <motion.section
        className="advanced-hero container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Rocket size={14} />
          进阶
        </motion.div>
        <motion.h1
          className="gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          进阶功能
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          以抽奖系统为案例，理解 Skill、MCP、Multi-Agent 如何让 AI 从"能写代码"进化为"能调用工具、能协作分工"
        </motion.p>
      </motion.section>

      {/* Tab Bar */}
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="advanced-tab-bar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`advanced-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="advanced-tab-content">
        <AnimatePresence mode="wait">
          {activeTab === 'skill' && (
            <motion.div
              key="skill"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SkillTab />
            </motion.div>
          )}
          {activeTab === 'mcp' && (
            <motion.div
              key="mcp"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MCPTab />
            </motion.div>
          )}
          {activeTab === 'agent' && (
            <motion.div
              key="agent"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <MultiAgentTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Page Flow Navigation */}
      <section className="page-flow-nav section">
        <div className="container">
          <div className="flow-nav-inner">
            <a href="/basics" className="flow-nav-btn">
              <ArrowLeft size={16} />
              <span>入门功能</span>
            </a>
            <div className="flow-nav-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`flow-nav-tab ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>
            <a href="/demo" className="flow-nav-btn flow-nav-btn-primary">
              <span>完整演示</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
