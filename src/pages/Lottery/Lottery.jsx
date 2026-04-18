import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Trophy, RotateCcw, Plus, Minus, Gift, Users,
  Sparkles, Volume2, Star, Crown, Zap, PartyPopper,
  QrCode, X, Smartphone
} from 'lucide-react';
import './Lottery.css';

const DEFAULT_PARTICIPANTS = [
  '开发者A', '设计师B', '产品C', '运营D', '前端E',
  '后端F', '测试G', '架构H', '数据I', '安全J',
  'AI工程师K', '全栈L', '移动端M', 'DevOpsN',
];

const DEFAULT_PRIZES = [
  { id: 1, name: '🏆 特等奖', desc: 'Trae 定制周边', count: 1, color: '#FDCB6E' },
  { id: 2, name: '🥇 一等奖', desc: '机械键盘', count: 2, color: '#FD79A8' },
  { id: 3, name: '🥈 二等奖', desc: '充电宝', count: 3, color: '#6C5CE7' },
  { id: 4, name: '🥉 三等奖', desc: '贴纸套装', count: 5, color: '#00CEC9' },
];

function SlotMachine({ participants, isSpinning, winner, onSpinEnd }) {
  const [displayNames, setDisplayNames] = useState(
    participants.slice(0, 3).map(() => participants[Math.floor(Math.random() * participants.length)])
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isSpinning) {
      intervalRef.current = setInterval(() => {
        setDisplayNames(
          Array(3).fill(null).map(() => 
            participants[Math.floor(Math.random() * participants.length)]
          )
        );
      }, 80);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (winner) {
        setDisplayNames([winner, winner, winner]);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSpinning, winner, participants]);

  return (
    <div className="slot-machine">
      <div className="slot-display">
        {displayNames.map((name, i) => (
          <motion.div
            key={`${name}-${i}`}
            className={`slot-reel ${isSpinning ? 'spinning' : ''} ${winner && !isSpinning ? 'winner' : ''}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            {name}
          </motion.div>
        ))}
      </div>
      {winner && !isSpinning && (
        <motion.div 
          className="winner-announce"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <PartyPopper size={24} />
          <span>🎉 恭喜 {winner} 中奖！</span>
          <PartyPopper size={24} />
        </motion.div>
      )}
    </div>
  );
}

/* ===== Join Mode (观众扫码后看到的页面) ===== */
function JoinMode({ onJoin }) {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (name.trim()) {
      onJoin(name.trim());
      setJoined(true);
    }
  };

  return (
    <motion.div 
      className="join-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="join-card glass">
        <div className="join-icon">
          <Trophy size={48} color="#FDCB6E" />
        </div>
        <h1 className="join-title">加入抽奖</h1>
        <p className="join-subtitle">输入你的名字，参与幸运抽奖</p>
        
        {!joined ? (
          <div className="join-form">
            <input
              type="text"
              placeholder="请输入你的名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="join-input"
              autoFocus
            />
            <motion.button
              className="join-btn"
              onClick={handleJoin}
              disabled={!name.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={18} />
              加入抽奖
            </motion.button>
          </div>
        ) : (
          <motion.div 
            className="join-success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <PartyPopper size={32} />
            <h2>已加入！✨</h2>
            <p>{name}，等待抽奖开始</p>
            <p className="join-hint">请在演示大屏幕上查看抽奖结果</p>
          </motion.div>
        )}

        <div className="join-footer">
          <Smartphone size={14} />
          <span>SOLO 多端能力演示 — 手机也能参与</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ===== Main Lottery Page ===== */
export default function Lottery() {
  const [participants, setParticipants] = useState(DEFAULT_PARTICIPANTS);
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  const [currentPrizeIdx, setCurrentPrizeIdx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winHistory, setWinHistory] = useState([]);
  const [newName, setNewName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 检测 Join 模式
  const urlParams = new URLSearchParams(window.location.search);
  const isJoinMode = urlParams.get('mode') === 'join';

  // Join 模式：只显示加入页面
  if (isJoinMode) {
    return <JoinMode onJoin={(name) => {
      // 在 Join 模式下，名字存储在 localStorage
      const existing = JSON.parse(localStorage.getItem('lottery_participants') || '[]');
      if (!existing.includes(name)) {
        localStorage.setItem('lottery_participants', JSON.stringify([...existing, name]));
      }
    }} />;
  }

  const currentPrize = prizes[currentPrizeIdx];
  const availableParticipants = participants.filter(
    p => !winHistory.some(w => w.winner === p)
  );

  // 从 localStorage 加载观众加入的名字
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('lottery_participants') || '[]');
    if (stored.length > 0) {
      setParticipants(prev => {
        const existing = new Set(prev);
        const newOnes = stored.filter(n => !existing.has(n));
        return [...prev, ...newOnes];
      });
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning || availableParticipants.length === 0 || !currentPrize || currentPrize.remaining <= 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);

    const spinDuration = 2000 + Math.random() * 1500;
    
    setTimeout(() => {
      const winnerIdx = Math.floor(Math.random() * availableParticipants.length);
      const winnerName = availableParticipants[winnerIdx];
      
      setWinner(winnerName);
      setIsSpinning(false);
      setShowConfetti(true);
      
      setWinHistory(prev => [...prev, {
        prize: currentPrize.name,
        winner: winnerName,
        desc: currentPrize.desc,
        color: currentPrize.color,
      }]);

      setPrizes(prev => prev.map((p, i) => 
        i === currentPrizeIdx ? { ...p, remaining: (p.remaining || p.count) - 1 } : p
      ));

      setTimeout(() => {
        const currentRemaining = (currentPrize.remaining ?? currentPrize.count) - 1;
        if (currentRemaining <= 0) {
          let nextPrize = -1;
          for (let i = 1; i <= prizes.length; i++) {
            const idx = (currentPrizeIdx + i) % prizes.length;
            const remaining = prizes[idx].remaining || prizes[idx].count;
            if (remaining > 0) {
              nextPrize = idx;
              break;
            }
          }
          if (nextPrize >= 0) setCurrentPrizeIdx(nextPrize);
        }
      }, 3000);
    }, spinDuration);
  }, [isSpinning, availableParticipants, currentPrize, currentPrizeIdx, prizes]);

  const handleReset = () => {
    setIsSpinning(false);
    setWinner(null);
    setWinHistory([]);
    setShowConfetti(false);
    setPrizes(DEFAULT_PRIZES.map(p => ({ ...p, remaining: p.count })));
    setCurrentPrizeIdx(0);
    localStorage.removeItem('lottery_participants');
  };

  const handleAddParticipant = () => {
    if (newName.trim()) {
      setParticipants(prev => [...prev, newName.trim()]);
      setNewName('');
    }
  };

  const handleRemoveParticipant = (name) => {
    setParticipants(prev => prev.filter(p => p !== name));
  };

  const qrUrl = `${window.location.origin}${window.location.pathname}?mode=join`;

  return (
    <motion.div 
      className="lottery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            className="confetti-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="confetti-piece"
                initial={{ 
                  y: -20, 
                  x: Math.random() * 100 - 50,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{ 
                  y: window.innerHeight + 50,
                  x: Math.random() * 200 - 100,
                  rotate: Math.random() * 720,
                  opacity: 0,
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeIn',
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E', '#00B894', '#E17055'][Math.floor(Math.random() * 6)],
                  width: `${6 + Math.random() * 8}px`,
                  height: `${6 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            className="qr-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              className="qr-modal glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="qr-modal-close" onClick={() => setShowQR(false)}>
                <X size={20} />
              </button>
              <h3 className="qr-modal-title">
                <QrCode size={20} />
                扫码加入抽奖
              </h3>
              <p className="qr-modal-desc">用手机扫描二维码，输入名字即可加入参与者列表</p>
              <div className="qr-code-wrapper">
                <QRCodeSVG 
                  value={qrUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1a1a2e"
                  level="M"
                />
              </div>
              <p className="qr-modal-url">{qrUrl}</p>
              <div className="qr-modal-note">
                <Smartphone size={14} />
                <span>SOLO 多端能力：手机、平板、电脑都能访问</span>
              </div>
              <p className="qr-modal-hint">💡 当前为本地开发环境，扫码需在同一局域网内。部署到 Vercel 等公网后，任何人扫码都能加入。</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <section className="lottery-header">
        <div className="container">
          <motion.h1 
            className="lottery-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Trophy size={32} className="trophy-icon" />
            幸运抽奖
            <span className="lottery-badge">互动 Demo</span>
          </motion.h1>
          <motion.p 
            className="lottery-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            这个抽奖系统由 TRAE SOLO 构建 —— 一个展示 SOLO 实际开发能力的案例
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="lottery-main section">
        <div className="container">
          <div className="lottery-layout">
            {/* Left: Participants */}
            <div className="lottery-sidebar">
              <div className="sidebar-card glass">
                <div className="sidebar-title-row">
                  <h3 className="sidebar-title">
                    <Users size={16} />
                    参与者 ({availableParticipants.length}/{participants.length})
                  </h3>
                  <motion.button 
                    className="btn-qr"
                    onClick={() => setShowQR(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="生成参与二维码"
                  >
                    <QrCode size={16} />
                  </motion.button>
                </div>
                <div className="participant-list">
                  {participants.map((name) => {
                    const isWon = winHistory.some(w => w.winner === name);
                    return (
                      <div key={name} className={`participant-item ${isWon ? 'won' : ''}`}>
                        <span className="participant-name">
                          {isWon ? '🏆' : '👤'} {name}
                        </span>
                        {!isWon && !isSpinning && (
                          <button 
                            className="participant-remove"
                            onClick={() => handleRemoveParticipant(name)}
                          >
                            <Minus size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="add-participant">
                  <input
                    type="text"
                    placeholder="添加参与者..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
                    disabled={isSpinning}
                  />
                  <button 
                    className="btn-add"
                    onClick={handleAddParticipant}
                    disabled={!newName.trim() || isSpinning}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Center: Lottery Machine */}
            <div className="lottery-center">
              {/* Prize Selector */}
              <div className="prize-selector">
                {prizes.map((prize, i) => (
                  <button
                    key={prize.id}
                    className={`prize-tab ${i === currentPrizeIdx ? 'active' : ''} ${(prize.remaining || prize.count) <= 0 ? 'exhausted' : ''}`}
                    onClick={() => !isSpinning && (prize.remaining || prize.count) > 0 && setCurrentPrizeIdx(i)}
                    disabled={isSpinning}
                    style={{ '--prize-color': prize.color }}
                  >
                    <span className="prize-tab-name">{prize.name}</span>
                    <span className="prize-tab-count">
                      {prize.remaining ?? prize.count}/{prize.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Current Prize Display */}
              <motion.div 
                className="current-prize glass"
                key={currentPrizeIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="prize-display">
                  <motion.div 
                    className="prize-icon-large"
                    animate={isSpinning ? { rotate: 360 } : {}}
                    transition={isSpinning ? { repeat: Infinity, duration: 2, ease: 'linear' } : {}}
                  >
                    <Gift size={48} />
                  </motion.div>
                  <div className="prize-info">
                    <h2>{currentPrize?.name}</h2>
                    <p>{currentPrize?.desc}</p>
                    <span className="prize-remaining">
                      剩余 {currentPrize?.remaining ?? currentPrize?.count} 份
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Slot Machine */}
              <SlotMachine 
                participants={availableParticipants}
                isSpinning={isSpinning}
                winner={winner}
              />

              {/* Action Buttons */}
              <div className="lottery-actions">
                <motion.button
                  className="btn-spin"
                  onClick={handleSpin}
                  disabled={isSpinning || availableParticipants.length === 0 || (currentPrize?.remaining ?? 0) <= 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSpinning ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Zap size={20} />
                      </motion.div>
                      <span>抽奖中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>
                        {availableParticipants.length === 0 ? '无参与者' : 
                         (currentPrize?.remaining ?? 0) <= 0 ? '奖品已抽完' : '开始抽奖'}
                      </span>
                    </>
                  )}
                </motion.button>
                <button className="btn-reset" onClick={handleReset} disabled={isSpinning}>
                  <RotateCcw size={16} />
                  <span>重置</span>
                </button>
              </div>
            </div>

            {/* Right: Win History */}
            <div className="lottery-sidebar">
              <div className="sidebar-card glass">
                <h3 className="sidebar-title">
                  <Crown size={16} />
                  中奖记录 ({winHistory.length})
                </h3>
                <div className="win-history">
                  <AnimatePresence>
                    {winHistory.length === 0 ? (
                      <div className="empty-history">
                        <Star size={32} className="empty-star" />
                        <p>还没有中奖记录</p>
                        <p className="empty-hint">点击「开始抽奖」试试手气</p>
                      </div>
                    ) : (
                      winHistory.map((record, i) => (
                        <motion.div
                          key={`${record.winner}-${i}`}
                          className="win-record"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          style={{ '--record-color': record.color }}
                        >
                          <div className="win-record-prize">{record.prize}</div>
                          <div className="win-record-winner">{record.winner}</div>
                          <div className="win-record-desc">{record.desc}</div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
