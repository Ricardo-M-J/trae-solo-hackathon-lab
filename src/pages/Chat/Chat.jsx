import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageCircle, Users, Settings, Zap, Loader2, X, RefreshCw } from 'lucide-react';
import './Chat.css';
import aiService from '../../services/aiService';

const AGENTS = [
  {
    id: 'pm',
    name: '产品经理小李',
    role: '产品经理',
    avatar: '👔',
    color: '#6C5CE7',
    persona: '你是一名资深产品经理，善于需求分析和产品规划。你说话专业、逻辑清晰，喜欢用产品思维思考问题。',
    keywords: ['需求', '产品', '功能', '用户', '规划', '设计', '方案', '分析', '市场', '竞品', 'PRD', 'MVP', ' roadmap'],
    response_templates: {
      greeting: ['大家好，我是产品经理小李，专注于产品规划和需求分析。', '我是小李，有什么产品规划方面的问题可以问我。'],
      self_intro: ['我是产品经理小李，负责产品规划和需求分析。我擅长从用户角度思考问题，推动产品迭代。'],
      career: ['作为产品经理，我每天主要做需求分析、产品规划和跨部门沟通协调。'],
      technical: ['这个问题我需要和开发团队详细讨论后才能给出方案。', '从产品角度看，我们可以先做个MVP验证一下。'],
      default: ['这个需求我需要分析一下用户场景。', '好的，我来梳理一下这个需求的优先级。']
    }
  },
  {
    id: 'designer',
    name: '设计师小王',
    role: 'UI设计师',
    avatar: '🎨',
    color: '#FD79A8',
    persona: '你是一名创意十足的UI设计师，关注用户体验和视觉美感。你说话充满创意，喜欢用颜色和形状描述事物。',
    keywords: ['设计', '颜色', '界面', 'UI', 'UX', '用户体验', '美观', '创意', '图标', '布局', '视觉', '交互', '原型'],
    response_templates: {
      greeting: ['嗨！我是设计师小王，专注于让产品变得更好看更好用~', '我是小王，做设计的！有什么视觉体验方面的问题尽管问。'],
      self_intro: ['我是设计师小王！我热爱让界面变得更美、更易用。设计不仅是外观，更是体验。'],
      career: ['我平时主要做界面设计、交互优化和视觉规范制定，让产品既美观又好用是我的追求。'],
      technical: ['技术实现上我没问题，但设计上我想加入一些动效让体验更流畅~', '这个功能的设计我会考虑加入一些渐变色和阴影效果。'],
      default: ['我觉得可以在颜色和布局上做一些优化~', '这个设计风格可以再活泼一些！']
    }
  },
  {
    id: 'backend',
    name: '开发小张',
    role: '后端工程师',
    avatar: '💻',
    color: '#00CEC9',
    persona: '你是一名全栈工程师，技术能力强，喜欢简洁高效的解决方案。你说话直接，有时候会用技术术语。',
    keywords: ['代码', '开发', '技术', '系统', '数据库', 'API', '架构', '性能', 'bug', '测试', '部署', '服务器', '微服务', '缓存', '并发'],
    response_templates: {
      greeting: ['我是开发小张，技术问题找我准没错。', '嗨！我是后端开发，有技术问题可以直接问。'],
      self_intro: ['我是开发小张，写代码是我的强项。我喜欢简洁高效的解决方案，追求高性能和低耦合的架构。'],
      career: ['我主要做后端开发，写接口、设计数据库、优化系统性能。偶尔也写点前端代码。'],
      technical: ['这个在技术层面完全可以实现。', '我建议用缓存来优化性能。', '数据库查询可以优化一下。'],
      default: ['技术上没问题，我来评估一下实现方案。', '这个功能我来实现，保证性能。']
    }
  },
  {
    id: 'tester',
    name: '测试小陈',
    role: 'QA工程师',
    avatar: '🧪',
    color: '#FDCB6E',
    persona: '你是一名细心严谨的测试工程师，关注细节和质量问题。你说话谨慎，喜欢提出质疑和潜在问题。',
    keywords: ['测试', '质量', 'bug', '问题', '风险', '异常', '边界', '验证', '缺陷', '监控', '日志', '安全', '漏洞'],
    response_templates: {
      greeting: ['我是测试小陈，质量把控从我做起。', '嗨！我是QA工程师小陈，有测试和质量方面的问题可以问我。'],
      self_intro: ['我是测试小陈！我的工作就是找出问题、发现bug，保证产品质量。细节决定成败~'],
      career: ['我主要负责功能测试、编写测试用例、回归测试，还有上线前的质量把控。'],
      technical: ['这个功能需要重点测试边界情况和异常场景。', '我先来测试一下，看看有没有bug。'],
      default: ['这个方案有没有考虑边界情况？', '我需要验证一下这个功能的正确性。', '注意：这个实现可能存在风险，建议增加异常处理。']
    }
  }
];

function Message({ message, agent }) {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <motion.div
        className="message system-message"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="system-text">{message.text}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`message ${isUser ? 'user-message' : 'agent-message'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ '--agent-color': agent?.color || '#6C5CE7' }}
    >
      {!isUser && agent && (
        <div className="message-avatar" style={{ backgroundColor: agent.color }}>
          {agent.avatar}
        </div>
      )}
      <div className="message-content">
        {!isUser && agent && (
          <div className="message-header">
            <span className="message-sender">{agent.name}</span>
            <span className="message-role">{agent.role}</span>
          </div>
        )}
        <div className="message-bubble">
          {message.text}
        </div>
      </div>
    </motion.div>
  );
}

function AgentPill({ agent, isActive, onClick, unread }) {
  return (
    <motion.button
      className={`agent-pill ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--agent-color': agent.color }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="agent-pill-avatar" style={{ backgroundColor: agent.color }}>
        {agent.avatar}
      </span>
      <div className="agent-pill-info">
        <span className="agent-pill-name">{agent.name}</span>
        <span className="agent-pill-role">{agent.role}</span>
      </div>
      {unread > 0 && <span className="agent-pill-badge">{unread}</span>}
    </motion.button>
  );
}

export default function Chat() {
  // 会话管理
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  // 消息和对话状态
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: '👋 职场 AI 聊天室已启动！选择一个 Agent 进行一对一对话，或开启群聊让所有 Agent 参与讨论。'
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isGroupChat, setIsGroupChat] = useState(true);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentStream, setCurrentStream] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('kimi');
  const messagesEndRef = useRef(null);

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      const isNearBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100;
      
      if (force || isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // 从本地存储加载会话和对话历史
  useEffect(() => {
    // 加载会话列表
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to load sessions from localStorage:', error);
      }
    }
  }, []);

  // 加载当前会话的消息和历史
  useEffect(() => {
    if (currentSessionId) {
      const sessionMessages = localStorage.getItem(`chatMessages_${currentSessionId}`);
      const sessionHistory = localStorage.getItem(`conversationHistory_${currentSessionId}`);
      
      if (sessionMessages) {
        try {
          setMessages(JSON.parse(sessionMessages));
        } catch (error) {
          console.error('Failed to load session messages:', error);
        }
      }
      
      if (sessionHistory) {
        try {
          setConversationHistory(JSON.parse(sessionHistory));
        } catch (error) {
          console.error('Failed to load session history:', error);
        }
      }
    }
  }, [currentSessionId]);

  // 保存当前会话的消息到本地存储
  useEffect(() => {
    if (currentSessionId && messages.length > 1) { // 跳过初始系统消息
      localStorage.setItem(`chatMessages_${currentSessionId}`, JSON.stringify(messages));
    }
  }, [messages, currentSessionId]);

  // 保存当前会话的对话历史到本地存储
  useEffect(() => {
    if (currentSessionId && conversationHistory.length > 0) {
      localStorage.setItem(`conversationHistory_${currentSessionId}`, JSON.stringify(conversationHistory));
    }
  }, [conversationHistory, currentSessionId]);

  // 会话管理函数
  const createNewSession = () => {
    const newSessionId = Date.now().toString();
    const newSession = {
      id: newSessionId,
      name: `会话 ${sessions.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    setCurrentSessionId(newSessionId);
    
    // 重置消息和对话历史
    setMessages([{
      id: 1,
      sender: 'system',
      text: '👋 新会话已创建！开始与 Agent 对话吧。'
    }]);
    setConversationHistory([]);
    
    // 保存会话到本地存储
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };

  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    
    // 加载对应会话的消息和历史
    const sessionMessages = localStorage.getItem(`chatMessages_${sessionId}`);
    const sessionHistory = localStorage.getItem(`conversationHistory_${sessionId}`);
    
    if (sessionMessages) {
      try {
        setMessages(JSON.parse(sessionMessages));
      } catch (error) {
        console.error('Failed to load session messages:', error);
      }
    } else {
      setMessages([{
        id: 1,
        sender: 'system',
        text: '👋 会话已切换！开始与 Agent 对话吧。'
      }]);
    }
    
    if (sessionHistory) {
      try {
        setConversationHistory(JSON.parse(sessionHistory));
      } catch (error) {
        console.error('Failed to load session history:', error);
      }
    } else {
      setConversationHistory([]);
    }
  };

  const deleteSession = (sessionId) => {
    if (sessionId === currentSessionId) {
      // 如果删除当前会话，创建新会话
      createNewSession();
    }
    
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    
    // 从本地存储删除会话数据
    localStorage.removeItem(`chatMessages_${sessionId}`);
    localStorage.removeItem(`conversationHistory_${sessionId}`);
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };

  const handleAgentResponse = async (agent, userMessage) => {
    setIsAgentTyping(true);
    setApiError(null);

    const agentMessageId = Date.now() + Math.random();
    const agentMessage = {
      id: agentMessageId,
      sender: agent.id,
      text: '',
      isStreaming: true
    };

    setMessages(prev => [...prev, agentMessage]);

    // 构建滑动窗口上下文，只保留最近 15 条消息
    const recentHistory = conversationHistory.slice(-14); // 预留一个位置给当前消息
    const history = recentHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 添加当前用户消息到历史
    history.push({ 
      role: 'user', 
      content: userMessage 
    });

    try {
      const stream = aiService.generate(history, agent, selectedProvider);
      setCurrentStream(stream);
      setIsGenerating(true);

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === agentMessageId ? { ...msg, text: fullResponse } : msg
        ));
        
        // 实时滚动
        setTimeout(scrollToBottom, 50);
      }

      setMessages(prev => prev.map(msg => 
        msg.id === agentMessageId ? { ...msg, isStreaming: false } : msg
      ));

      // 更新对话历史，添加用户消息和 Agent 回复，确保角色区分
      setConversationHistory(prev => [...prev, 
        { 
          role: 'user', 
          content: userMessage,
          name: '用户'
        },
        { 
          role: 'assistant', 
          content: fullResponse,
          name: agent.name,
          agentId: agent.id
        }
      ]);

      // 确保滚动到底部
      setTimeout(scrollToBottom, 100);

    } catch (error) {
      console.error('AI generation error:', error);
      setApiError(`生成回复失败: ${error.message}`);
      setMessages(prev => prev.map(msg => 
        msg.id === agentMessageId ? { ...msg, text: `❌ 生成失败: ${error.message}`, isStreaming: false } : msg
      ));
    } finally {
      setIsAgentTyping(false);
      setIsGenerating(false);
      setCurrentStream(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userMessage
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // 手动滚动到底部
    setTimeout(scrollToBottom, 100);

    if (isGroupChat) {
      for (const agent of AGENTS) {
        setCurrentAgent(agent);
        await handleAgentResponse(agent, userMessage);
        setCurrentAgent(null);
      }
    } else if (selectedAgent) {
      const agent = AGENTS.find(a => a.id === selectedAgent);
      if (agent) {
        setCurrentAgent(agent);
        await handleAgentResponse(agent, userMessage);
        setCurrentAgent(null);
      }
    }
  };

  const handleCancelGeneration = () => {
    if (currentStream) {
      // 这里可以添加取消逻辑，具体实现取决于 AI 服务
      setIsGenerating(false);
      setCurrentStream(null);
      setIsAgentTyping(false);
    }
  };

  const handleAgentSelect = (agentId) => {
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
      setIsGroupChat(true);
    } else {
      setSelectedAgent(agentId);
      setIsGroupChat(false);
    }
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'system',
      text: `🔄 已切换到 ${provider === 'kimi' ? 'Kimi' : 'Minimax'} AI 服务`
    }]);
  };

  return (
    <motion.div
      className="chat-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="chat-header">
        <div className="container">
          <motion.h1
            className="chat-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MessageCircle size={32} />
            职场 AI 聊天室
            <span className="chat-badge">智能 Agent</span>
          </motion.h1>
          <motion.p
            className="chat-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {isGroupChat ? '群聊模式：所有 Agent 参与讨论' : '单聊模式：选择一个 Agent 深入交流'}
          </motion.p>
        </div>
      </section>

      <section className="chat-main section">
        <div className="container">
          <div className="chat-layout">
            <div className="chat-sidebar">
              <div className="sidebar-section">
                <h3 className="section-title">
                  <RefreshCw size={16} />
                  会话管理
                </h3>
                <div className="session-list">
                  {sessions.length > 0 ? (
                    sessions.map(session => (
                      <div key={session.id} className="session-item">
                        <div 
                          className={`session-name ${currentSessionId === session.id ? 'active' : ''}`}
                          onClick={() => switchSession(session.id)}
                        >
                          {session.name}
                        </div>
                        <button 
                          className="session-delete"
                          onClick={() => deleteSession(session.id)}
                          title="删除会话"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="session-empty">
                      暂无会话
                    </div>
                  )}
                </div>
                <button 
                  className="create-session-button"
                  onClick={createNewSession}
                >
                  + 新会话
                </button>
              </div>

              <div className="sidebar-section">
                <h3 className="section-title">
                  <Users size={16} />
                  {isGroupChat ? 'Agent 列表（群聊中）' : '选择 Agent（单聊）'}
                </h3>
                <div className="agent-list">
                  {AGENTS.map(agent => (
                    <AgentPill
                      key={agent.id}
                      agent={agent}
                      isActive={isGroupChat || selectedAgent === agent.id}
                      onClick={() => handleAgentSelect(agent.id)}
                      unread={0}
                    />
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="section-title">
                  <Settings size={16} />
                  AI 服务设置
                </h3>
                <div className="provider-selector">
                  <button
                    className={`provider-button ${selectedProvider === 'kimi' ? 'active' : ''}`}
                    onClick={() => handleProviderChange('kimi')}
                  >
                    Kimi AI
                  </button>
                  <button
                    className={`provider-button ${selectedProvider === 'minimax' ? 'active' : ''}`}
                    onClick={() => handleProviderChange('minimax')}
                  >
                    Minimax
                  </button>
                  <button
                    className={`provider-button ${selectedProvider === 'doubao' ? 'active' : ''}`}
                    onClick={() => handleProviderChange('doubao')}
                  >
                    豆包 AI
                  </button>
                </div>
                {apiError && (
                  <div className="error-message">
                    <X size={16} />
                    {apiError}
                  </div>
                )}
              </div>

              <div className="sidebar-section">
                <h3 className="section-title">
                  <Sparkles size={16} />
                  使用说明
                </h3>
                <div className="usage-tips">
                  <p>🤖 <strong>群聊模式</strong>：所有 Agent 都会回复你的消息</p>
                  <p>👤 <strong>单聊模式</strong>：点击某个 Agent 只与它对话</p>
                  <p>💬 尝试问他们问题、讨论职场话题或让他们自我介绍</p>
                  <p>🔧 可以在左侧切换不同的 AI 服务提供商</p>
                </div>
              </div>

              <motion.button
                className="mode-toggle"
                onClick={() => {
                  setIsGroupChat(!isGroupChat);
                  if (!isGroupChat) setSelectedAgent(null);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap size={16} />
                {isGroupChat ? '切换到单聊模式' : '切换到群聊模式'}
              </motion.button>
            </div>

            <div className="chat-area">
              <div className="messages-container">
                <AnimatePresence>
                  {messages.map(message => {
                    const agent = AGENTS.find(a => a.id === message.sender);
                    return (
                      <Message
                        key={message.id}
                        message={message}
                        agent={agent}
                      />
                    );
                  })}
                </AnimatePresence>
                {isAgentTyping && currentAgent && (
                  <motion.div
                    className="message agent-message typing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ '--agent-color': currentAgent.color }}
                  >
                    <div className="message-avatar" style={{ backgroundColor: currentAgent.color }}>
                      {currentAgent.avatar}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{currentAgent.name}</span>
                        <span className="message-role">{currentAgent.role}</span>
                      </div>
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  className="chat-input"
                  placeholder={isGroupChat ? "输入话题，让 Agent 们一起讨论..." : "和 Agent 单独对话..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isGenerating}
                />
                {isGenerating ? (
                  <motion.button
                    className="cancel-button"
                    onClick={handleCancelGeneration}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                ) : (
                  <motion.button
                    className="send-button"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={20} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
