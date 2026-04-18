import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Settings, Trash2, Bot, User, ChevronDown,
  MessageSquare, Key, Loader2, AlertCircle, Sparkles, Users
} from 'lucide-react';
import './Chat.css';

/* ===== 角色定义（4 个员工）===== */
const ROLES = [
  {
    id: 'pm',
    name: '产品经理小王',
    emoji: '🎯',
    color: '#6C5CE7',
    desc: '需求分析、用户故事、排期催促',
    apiKey: 'sk-YLuIge7lmWtuavjgE27IVGLyjiccaTw2nYNE906BaxW9O8YO',
    systemPrompt: '你是字节跳动的一名产品经理"小王"。说话风格：喜欢用"对齐"、"赋能"、"抓手"、"闭环"等互联网黑话，但也会偶尔吐槽加班。回复要简短自然，像微信群聊一样，不要写长文。每次回复控制在50字以内。',
  },
  {
    id: 'designer',
    name: '设计师小李',
    emoji: '🎨',
    color: '#FD79A8',
    desc: 'UI/UX、设计规范、配色方案',
    apiKey: 'sk-9kIx0uxAdmAnuA2pqrsHuNWgTdqKvECw3imxjaCfnMFAfHgw',
    systemPrompt: '你是字节跳动的一名 UI 设计师"小李"。说话风格：温和但坚持设计原则，会吐槽开发不按设计稿来。回复要简短自然，像微信群聊一样。每次回复控制在50字以内。',
  },
  {
    id: 'dev',
    name: '程序员小张',
    emoji: '💻',
    color: '#00CEC9',
    desc: '技术方案、代码问题、偶尔摸鱼',
    apiKey: 'sk-0pmKwEVTNk3eKfpSCNAN6eW5c6dv1fYGe4Rotyu1XUsD5WJB',
    systemPrompt: '你是字节跳动的一名后端程序员"小张"。说话风格：直接、偶尔用技术梗，会吐槽产品经理改需求。回复要简短自然，像微信群聊一样。每次回复控制在50字以内。',
  },
  {
    id: 'qa',
    name: '测试小陈',
    emoji: '🧪',
    color: '#FDCB6E',
    desc: 'Bug 报告、质量把控、边界情况',
    apiKey: 'sk-F8qyjXL1NHG2JLb8Ql7YXoAbmA416DOHht9GSPVf1PnQtpoh',
    systemPrompt: '你是字节跳动的一名测试工程师"小陈"。说话风格：认真负责，会列举各种边界情况，偶尔吐槽开发写的代码质量。回复要简短自然，像微信群聊一样。每次回复控制在50字以内。',
  },
];

const API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const DEFAULT_MODEL = 'moonshot-v1-8k';
const MAX_CONTEXT_MESSAGES = 15;

/* ===== 会议室主持人（智能路由）===== */
const MODERATOR_KEY = 'sk-mZ9AZD1Xb6RHYilRtu1IoMcsN8pGaNIrhzB7KaNevAkrHOfY';
const MODERATOR_PROMPT = `你是一个职场群聊的主持人。当用户发送一条消息时，你需要判断哪些同事应该回复。

可选的同事及 ID：
- pm: 产品经理小王（需求、排期、用户反馈、PRD）
- designer: 设计师小李（UI、设计、配色、设计稿）
- dev: 程序员小张（技术、代码、Bug、架构）
- qa: 测试小陈（测试、质量、边界情况）

规则：
- 根据消息内容判断哪些角色最相关
- 至少返回 1 个 ID，最多返回 3 个
- 只返回 ID，用逗号分隔，不要返回其他任何内容
- 如果消息涉及多个领域，返回多个 ID

示例：
用户说"这个需求排期怎么排" → pm
用户说"线上出 Bug 了" → dev, qa
用户说"技术选型讨论" → cto, dev`;

/* ===== 流式 API 调用 ===== */
async function streamChat(apiKey, model, messages, onChunk, onDone, onError) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: model || DEFAULT_MODEL, messages, stream: true }),
    });

    if (!response.ok) {
      const errText = await response.text();
      onError(`API 错误 (${response.status}): ${errText.slice(0, 100)}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') { onDone(); return; }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
        } catch {}
      }
    }
    onDone();
  } catch (err) {
    onError(err.message);
  }
}

/* ===== 聊天室组件 ===== */
export default function Chat() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('chat_api_key') || 'sk-mZ9AZD1Xb6RHYilRtu1IoMcsN8pGaNIrhzB7KaNevAkrHOfY');
  const [model, setModel] = useState(() => localStorage.getItem('chat_model') || DEFAULT_MODEL);
  const [mode, setMode] = useState('single'); // 'single' | 'group'

  // 1v1 模式状态
  const [activeRole, setActiveRole] = useState(ROLES[0].id);
  const [chatHistories, setChatHistories] = useState(() => {
    const saved = localStorage.getItem('chat_histories');
    return saved ? JSON.parse(saved) : {};
  });

  // 群聊模式状态
  const [groupMessages, setGroupMessages] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState(['pm', 'designer', 'dev', 'qa']);
  const [smartRouting, setSmartRouting] = useState(true);
  const [routingInfo, setRoutingInfo] = useState('');

  // 通用状态
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingRole, setStreamingRole] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentRole = ROLES.find(r => r.id === activeRole);
  const messages = chatHistories[activeRole] || [];

  // 保存到 localStorage
  useEffect(() => { localStorage.setItem('chat_histories', JSON.stringify(chatHistories)); }, [chatHistories]);
  useEffect(() => { localStorage.setItem('chat_api_key', apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem('chat_model', model); }, [model]);
  useEffect(() => { localStorage.setItem('group_messages', JSON.stringify(groupMessages)); }, [groupMessages]);
  useEffect(() => { localStorage.setItem('selected_roles', JSON.stringify(selectedRoles)); }, [selectedRoles]);

  // 自动滚动
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, groupMessages]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // 初始化群聊数据
  useEffect(() => {
    const saved = localStorage.getItem('group_messages');
    if (saved) setGroupMessages(JSON.parse(saved));
    const savedRoles = localStorage.getItem('selected_roles');
    if (savedRoles) setSelectedRoles(JSON.parse(savedRoles));
  }, []);

  // ===== 1v1 发送 =====
  const handleSingleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    if (!currentRole?.apiKey) {
      setError(`${currentRole?.name} 未配置 API Key`);
      return;
    }
    setError('');

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setInput('');
    setChatHistories(prev => ({ ...prev, [activeRole]: [...newMessages, { role: 'assistant', content: '' }] }));
    setIsStreaming(true);

    const apiMessages = [
      { role: 'system', content: currentRole.systemPrompt },
      ...newMessages.map(m => ({ role: m.role, content: m.content })),
    ];

    let fullContent = '';
    await streamChat(currentRole.apiKey, model, apiMessages,
      (chunk) => {
        fullContent += chunk;
        setChatHistories(prev => ({
          ...prev,
          [activeRole]: [...prev[activeRole].slice(0, -1), { role: 'assistant', content: fullContent }],
        }));
      },
      () => setIsStreaming(false),
      (err) => {
        setIsStreaming(false);
        setError(err);
        setChatHistories(prev => ({ ...prev, [activeRole]: [...prev[activeRole].slice(0, -1)] }));
      }
    );
  }, [input, isStreaming, model, messages, activeRole, currentRole]);

  // ===== 群聊发送 =====
  const handleGroupSend = useCallback(async () => {
    if (!input.trim() || isStreaming || selectedRoles.length === 0) return;
    setError('');
    setRoutingInfo('');

    const userMsg = { id: Date.now(), role: 'user', name: '你', content: input.trim() };
    const newMessages = [...groupMessages, userMsg];
    setInput('');
    setGroupMessages(newMessages);
    setIsStreaming(true);

    // 确定要回复的角色
    let rolesToReply = selectedRoles;

    if (smartRouting) {
      // 主持人 AI 决定谁回复
      try {
        setRoutingInfo('🤔 主持人正在分析...');
        const modResponse = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MODERATOR_KEY}`,
          },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            messages: [
              { role: 'system', content: MODERATOR_PROMPT },
              { role: 'user', content: input.trim() },
            ],
          }),
        });
        const modData = await modResponse.json();
        const modResult = (modData.choices?.[0]?.message?.content || '').trim();
        // 解析返回的 ID（支持逗号、空格、换行分隔）
        const allRoleIds = ROLES.map(r => r.id);
        const parsedIds = modResult.split(/[,，\s\n]+/).map(s => s.trim()).filter(id => allRoleIds.includes(id));
        if (parsedIds.length > 0) {
          rolesToReply = parsedIds;
          const replyNames = rolesToReply.map(id => ROLES.find(r => r.id === id)?.name).join('、');
          setRoutingInfo(`🎯 主持人指定了 ${replyNames} 回复`);
        } else {
          // 主持人没返回有效 ID，fallback 到所有角色
          setRoutingInfo('⚠️ 主持人未能判断，全部同事回复');
        }
      } catch (err) {
        // 主持人分析失败，fallback
        setRoutingInfo('⚠️ 主持人分析失败，全部同事回复');
      }
    }

    // 串行调用每个要回复的角色
    for (const roleId of rolesToReply) {
      const role = ROLES.find(r => r.id === roleId);
      if (!role || !role.apiKey) continue;

      setStreamingRole(roleId);

      // 添加占位消息
      const placeholderId = Date.now() + roleId;
      setGroupMessages(prev => [...prev, { id: placeholderId, role: roleId, name: role.name, emoji: role.emoji, color: role.color, content: '' }]);

      // 构建上下文：滑动窗口取最近 N 条
      const contextMessages = newMessages.slice(-MAX_CONTEXT_MESSAGES);
      const apiMessages = [
        {
          role: 'system',
          content: `${role.systemPrompt}\n\n你正在一个职场群聊中。以下是群聊记录，请根据上下文用你的角色风格回复。注意：你只能以"${role.name}"的身份发言，不要模仿其他人。`,
        },
        ...contextMessages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: `${m.name || '你'}: ${m.content}`,
        })),
      ];

      let fullContent = '';
      await new Promise((resolve) => {
        streamChat(role.apiKey, model, apiMessages,
          (chunk) => {
            fullContent += chunk;
            setGroupMessages(prev => prev.map(m =>
              m.id === placeholderId ? { ...m, content: fullContent } : m
            ));
          },
          () => resolve(),
          (err) => {
            setError(err);
            setGroupMessages(prev => prev.filter(m => m.id !== placeholderId));
            resolve();
          }
        );
      });
    }

    setStreamingRole(null);
    setIsStreaming(false);
  }, [input, isStreaming, model, groupMessages, selectedRoles, smartRouting]);

  const handleSend = mode === 'group' ? handleGroupSend : handleSingleSend;

  const handleClear = () => {
    if (mode === 'single') {
      setChatHistories(prev => ({ ...prev, [activeRole]: [] }));
    } else {
      setGroupMessages([]);
    }
  };

  const toggleRole = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayMessages = mode === 'group' ? groupMessages : messages.map((m, i) => ({
    ...m,
    id: i,
    name: m.role === 'user' ? '你' : currentRole.name,
    emoji: m.role === 'user' ? null : currentRole.emoji,
    color: m.role === 'user' ? null : currentRole.color,
  }));

  return (
    <div className="chat-page">
      {/* Header */}
      <section className="chat-header">
        <div className="container">
          <motion.h1 className="chat-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MessageSquare size={28} />
            AI 同事聊天室
            <span className="chat-badge">职场模拟</span>
          </motion.h1>
          <motion.p className="chat-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {mode === 'single'
              ? '选择一个 AI 同事，体验 1v1 对话'
              : '选择多个 AI 同事，体验群聊效果'}
            {' —— 由 Kimi 大模型驱动'}
          </motion.p>

          {/* Mode Switch */}
          <motion.div className="mode-switch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <button className={`mode-btn ${mode === 'single' ? 'active' : ''}`} onClick={() => setMode('single')}>
              <MessageSquare size={14} />
              1v1 聊天
            </button>
            <button className={`mode-btn ${mode === 'group' ? 'active' : ''}`} onClick={() => setMode('group')}>
              <Users size={14} />
              群聊模式
            </button>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="chat-main section">
        <div className="container">
          <div className="chat-layout">
            {/* Left: Role List */}
            <div className="chat-sidebar">
              <div className="sidebar-section">
                <h3 className="sidebar-heading">
                  {mode === 'group' ? '选择群成员' : '选择同事'}
                  {mode === 'group' && selectedRoles.length > 0 && (
                    <span className="role-count">{selectedRoles.length} 人</span>
                  )}
                </h3>
                <div className="role-list">
                  {ROLES.map((role) => {
                    const isSelected = mode === 'single'
                      ? activeRole === role.id
                      : selectedRoles.includes(role.id);

                    return (
                      <button
                        key={role.id}
                        className={`role-item ${isSelected ? 'active' : ''}`}
                        onClick={() => mode === 'single' ? setActiveRole(role.id) : toggleRole(role.id)}
                        style={{ '--role-color': role.color }}
                      >
                        <span className="role-emoji">{role.emoji}</span>
                        <div className="role-info">
                          <span className="role-name">{role.name}</span>
                          <span className="role-desc">{role.desc}</span>
                        </div>
                        {mode === 'group' && (
                          <span className={`role-check ${isSelected ? 'checked' : ''}`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Settings */}
              <div className="sidebar-section">
                <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
                  <Settings size={14} />
                  <span>设置</span>
                  <ChevronDown size={14} className={`chevron ${showSettings ? 'open' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div className="settings-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <div className="setting-item">
                        <label><Bot size={12} /> 模型</label>
                        <select value={model} onChange={(e) => setModel(e.target.value)}>
                          <option value="moonshot-v1-8k">moonshot-v1-8k（免费）</option>
                          <option value="moonshot-v1-32k">moonshot-v1-32k</option>
                          <option value="moonshot-v1-128k">moonshot-v1-128k</option>
                        </select>
                      </div>
                      <p className="settings-hint">每个角色已配置独立 API Key</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Center: Chat Area */}
            <div className="chat-area">
              {/* Chat Header */}
              <div className="chat-area-header" style={{ '--role-color': mode === 'single' ? currentRole.color : '#6C5CE7' }}>
                <div className="chat-area-role">
                  <span className="chat-area-emoji">{mode === 'group' ? '💬' : currentRole.emoji}</span>
                  <div>
                    <h3>{mode === 'group' ? `群聊 (${selectedRoles.length} 人)` : currentRole.name}</h3>
                    <p>{mode === 'group' ? selectedRoles.map(id => ROLES.find(r => r.id === id)?.name).join('、') : currentRole.desc}</p>
                  </div>
                </div>
                <div className="chat-area-actions">
                  {mode === 'group' && (
                    <label className="smart-routing-toggle" title={smartRouting ? '智能路由：主持人决定谁回复' : '手动模式：所有勾选角色都回复'}>
                      <span className="routing-label">智能路由</span>
                      <div className={`routing-switch ${smartRouting ? 'on' : ''}`} onClick={() => setSmartRouting(!smartRouting)}>
                        <div className="routing-knob" />
                      </div>
                    </label>
                  )}
                  <button className="btn-clear" onClick={handleClear} title="清空对话">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {displayMessages.length === 0 && (
                  <div className="empty-chat">
                    <Sparkles size={40} className="empty-icon" />
                    <h3>{mode === 'group' ? '开始群聊' : `开始和 ${currentRole.name} 聊天`}</h3>
                    <p>{mode === 'group' ? '勾选左侧的同事，发一条消息试试' : '试试问一些职场话题，比如：'}</p>
                    {mode === 'single' && (
                      <div className="suggestion-chips">
                        {getSuggestions(activeRole).map((s, i) => (
                          <button key={i} className="suggestion-chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    {mode === 'group' && (
                      <div className="suggestion-chips">
                        {['这个需求怎么排期？', '线上出 Bug 了怎么办？', '新功能的设计稿出了', '技术选型讨论一下'].map((s, i) => (
                          <button key={i} className="suggestion-chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <AnimatePresence>
                  {displayMessages.map((msg) => {
                    const isUser = msg.role === 'user';
                    const isCurrentlyStreaming = streamingRole === msg.role && !msg.content;

                    return (
                      <motion.div
                        key={msg.id}
                        className={`message ${isUser ? 'user' : 'assistant'} ${mode === 'group' ? 'group' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {!isUser && (
                          <div className="message-avatar" style={{ background: msg.color || '#6C5CE7' }}>
                            {msg.emoji || '🤖'}
                          </div>
                        )}
                        <div className="message-bubble">
                          {mode === 'group' && !isUser && (
                            <span className="message-name" style={{ color: msg.color }}>{msg.name}</span>
                          )}
                          <p>{msg.content}</p>
                          {isCurrentlyStreaming && (
                            <span className="typing-indicator"><span /><span /><span /></span>
                          )}
                        </div>
                        {isUser && (
                          <div className="message-avatar user-avatar"><User size={16} /></div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {error && (
                  <motion.div className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </motion.div>
                )}

                {routingInfo && (
                  <motion.div className="routing-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {routingInfo}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <div className="input-wrapper">
                  <textarea
                    ref={inputRef}
                    className="chat-input"
                    placeholder={mode === 'group'
                      ? (selectedRoles.length === 0 ? '请先勾选群成员' : '发一条消息给所有同事...')
                      : `和 ${currentRole.name} 聊点什么...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isStreaming || (mode === 'group' && selectedRoles.length === 0)}
                    rows={1}
                  />
                  <motion.button
                    className="btn-send"
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming || (mode === 'group' && selectedRoles.length === 0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isStreaming ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
                  </motion.button>
                </div>
                <p className="input-hint">
                  按 Enter 发送，Shift+Enter 换行 · {mode === 'group' ? 'AI 同事会依次回复' : '对话保存在本地'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===== 建议问题 ===== */
function getSuggestions(roleId) {
  const suggestions = {
    pm: ['这个需求排期怎么排？', '用户反馈说这个功能不好用', '竞品出了新功能我们跟不跟？', '帮我写个 PRD'],
    designer: ['这个页面的配色怎么样？', '开发又没按设计稿来', '有什么好的设计灵感网站？', '暗色主题怎么做更好看？'],
    dev: ['这个 Bug 怎么修？', '需求又改了，心态崩了', '有什么好的技术博客推荐？', '微服务和单体怎么选？'],
    qa: ['这个功能的边界情况有哪些？', '线上又出 Bug 了！', '自动化测试怎么搞？', '这个需求测试要点是什么？'],
  };
  return suggestions[roleId] || [];
}