import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Zap, GraduationCap, Code2, Trophy,
  ChevronDown, ChevronUp, Puzzle, Plug, Users, CheckCircle2, XCircle,
  Terminal, Monitor, Rocket
} from 'lucide-react';
import './Home.css';

/* ========================================
   Data
   ======================================== */

const evolutionStages = [
  {
    stage: 1,
    name: 'Claude Code',
    subtitle: '纯终端 AI 编程',
    icon: Terminal,
    color: '#636E72',
    pros: ['AI 代码能力强', '支持 MCP 协议', '多模型切换'],
    cons: ['纯英文终端界面', 'MCP/Agent 配置全靠手写 JSON', '报错信息看不懂', '没有可视化反馈'],
    verdict: '能力很强，但门槛太高',
  },
  {
    stage: 2,
    name: 'Trae IDE',
    subtitle: '本地桌面端',
    icon: Monitor,
    color: '#6C5CE7',
    pros: ['图形化界面，直观易用', 'MCP/Agent 可视化配置', '中文友好', '实时预览'],
    cons: ['在本地运行，总弹权限请求', '权限全给怕删重要文件', '理解错意思可能改错东西', '换电脑要重新配环境'],
    verdict: '体验好多了，但安全感不足',
  },
  {
    stage: 3,
    name: 'Trae SOLO',
    subtitle: '云端网页版 ★',
    icon: Sparkles,
    color: '#00CEC9',
    pros: ['云端沙箱，不碰本地文件', 'Claude Code 级别的 AI 能力', 'Trae IDE 级别的图形化界面', '手机/平板/电脑都能用', '零配置，打开浏览器就能用'],
    cons: [],
    verdict: '集大成者，Vibe Coding 的终极形态',
    highlight: true,
  },
];

const roadshowSteps = [
  { number: 1, title: '了解 Solo', desc: '为什么选择 SOLO', icon: Sparkles, path: '/' },
  { number: 2, title: '入门功能', desc: 'Builder / Coder / 语音 / 工具集成', icon: Zap, path: '/basics' },
  { number: 3, title: '进阶功能', desc: 'Skill / MCP / Multi-Agent', icon: GraduationCap, path: '/advanced', hasPreview: true },
  { number: 4, title: '完整演示', desc: 'SOLO 构建抽奖系统全过程', icon: Code2, path: '/demo' },
  { number: 5, title: '抽奖互动', desc: '现场抽奖，试试手气', icon: Trophy, path: '/lottery' },
];

const advancedPreview = [
  { icon: Puzzle, title: 'Skill 技能系统', desc: '把反复使用的 Prompt 蒸馏为结构化 Skill，按需加载节省 Token', gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)' },
  { icon: Plug, title: 'MCP 协议集成', desc: '让 AI 调用数据库、GitHub API 等外部工具', gradient: 'linear-gradient(135deg, #00CEC9 0%, #81ECEC 100%)' },
  { icon: Users, title: 'Multi-Agent 架构', desc: '多个智能体并行协作，前端后端测试同时开发', gradient: 'linear-gradient(135deg, #FD79A8 0%, #FDCB6E 100%)' },
];

/* ========================================
   Animation
   ======================================== */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ========================================
   Component
   ======================================== */

export default function Home() {
  const navigate = useNavigate();
  const [showAdvancedPreview, setShowAdvancedPreview] = useState(false);

  return (
    <motion.div className="home" variants={containerVariants} initial="hidden" animate="visible">

      {/* ===================== 1. Hero ===================== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <motion.div className="hero-badge" variants={itemVariants}>
            <Sparkles size={14} /><span>Trae Friends Hackathon</span>
          </motion.div>
          <motion.h1 className="hero-title" variants={itemVariants}>
            <span className="hero-title-line">Vibe Coding</span>
            <span className="hero-title-line hero-title-gradient">的下一步</span>
          </motion.h1>
          <motion.p className="hero-desc" variants={itemVariants}>
            不用装环境，不用碰终端，打开浏览器就能让 AI 帮你写代码。
            <br />你现在看到的这个网站，就是 TRAE SOLO 从零构建的。
          </motion.p>
          <motion.div className="hero-actions" variants={itemVariants}>
            <button className="btn-hero btn-hero-primary" onClick={() => navigate('/basics')}>
              <span>开始路演</span><ArrowRight size={18} />
            </button>
            <button className="btn-hero btn-hero-secondary" onClick={() => navigate('/lottery')}>
              <Trophy size={18} /><span>直接抽奖</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===================== 2. Evolution Comparison ===================== */}
      <section className="pain-solution-section section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">
              我的 Vibe Coding <span className="gradient-text">进化之路</span>
            </h2>
            <p className="section-desc">从 Claude Code 到 Trae IDE 再到 Trae SOLO，我经历了三个阶段</p>
          </motion.div>

          <motion.div className="evolution-grid" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            {evolutionStages.map((stage) => (
              <motion.div key={stage.name} className={`evolution-card${stage.highlight ? ' highlight' : ''}`} variants={itemVariants}>
                <div className="evolution-stage-badge" style={{ background: stage.color }}>
                  阶段 {stage.stage}
                </div>
                <div className="evolution-name">
                  <stage.icon size={24} style={{ color: stage.color }} />
                  <h3>{stage.name}</h3>
                </div>
                <p className="evolution-subtitle">{stage.subtitle}</p>
                <div className="evolution-pros">
                  {stage.pros.map((pro) => (
                    <div key={pro} className="evolution-pro-item">
                      <CheckCircle2 size={14} color="#00B894" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                {stage.cons.length > 0 && (
                  <div className="evolution-cons">
                    {stage.cons.map((con) => (
                      <div key={con} className="evolution-con-item">
                        <XCircle size={14} color="#FF6B6B" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                )}
                {stage.cons.length === 0 && (
                  <div className="evolution-no-cons">
                    <Sparkles size={14} />
                    <span>没有痛点 ✨</span>
                  </div>
                )}
                <p className={`evolution-verdict${stage.highlight ? ' highlight' : ''}`}>
                  {stage.verdict}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="proof-banner" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Rocket size={20} />
            <span>你现在看到的这个网站，就是 SOLO 用一句话需求从零构建的——包括你正在滑动的这个页面</span>
          </motion.div>
        </div>
      </section>

      {/* ===================== 3. Roadshow Flow (含进阶预览) ===================== */}
      <section className="roadshow-section section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">路演 <span className="gradient-text">流程</span></h2>
            <p className="section-desc">按照以下步骤，完整体验 TRAE SOLO 的能力</p>
          </motion.div>

          <motion.div className="roadshow-timeline" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {roadshowSteps.map((step, i) => (
              <div key={step.number} className="roadshow-step-wrapper">
                <motion.div
                  className={`roadshow-step${step.path === '/' ? ' active' : ''}`}
                  onClick={() => {
                    if (step.hasPreview) {
                      setShowAdvancedPreview(v => !v);
                    } else if (step.path !== '/') {
                      navigate(step.path);
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="roadshow-step-number">{step.number}</span>
                  <div className="roadshow-step-icon"><step.icon size={20} /></div>
                  <span className="roadshow-step-title">{step.title}</span>
                  <span className="roadshow-step-desc">{step.desc}</span>
                  {step.hasPreview && (
                    <span className="roadshow-step-toggle">
                      {showAdvancedPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  )}
                </motion.div>
                {i < roadshowSteps.length - 1 && (
                  <div className="roadshow-connector"><div className="roadshow-connector-line" /></div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Advanced Preview (embedded in roadshow) */}
          <AnimatePresence>
            {showAdvancedPreview && (
              <motion.div
                className="advanced-preview-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="advanced-preview-inner">
                  <p className="advanced-preview-hint">以抽奖系统为案例，理解三大进阶能力</p>
                  <div className="advanced-preview-grid">
                    {advancedPreview.map((item) => (
                      <div
                        key={item.title}
                        className="advanced-preview-card glass"
                        onClick={() => navigate('/advanced')}
                      >
                        <div className="apc-icon" style={{ background: item.gradient }}>
                          <item.icon size={20} color="white" />
                        </div>
                        <div>
                          <h4 className="apc-title">{item.title}</h4>
                          <p className="apc-desc">{item.desc}</p>
                        </div>
                        <ArrowRight size={14} className="apc-arrow" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ===================== 4. CTA ===================== */}
      <section className="cta-section section">
        <div className="container">
          <motion.div className="cta-card glass" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2>准备好了吗？</h2>
            <p>从入门功能开始，一步步体验 SOLO 如何用 AI 构建完整项目</p>
            <div className="cta-actions">
              <button className="btn-hero btn-hero-primary" onClick={() => navigate('/basics')}>
                <span>开始路演</span><ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
