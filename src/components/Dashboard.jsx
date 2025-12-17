import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2, X, DollarSign, Calendar, Tag, FileText, Sparkles, Zap, Trophy, Target, Flame, Star, Award, CheckCircle, AlertCircle, Gift, Coins, PiggyBank, Settings, BarChart3, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Tutorial from './Tutorial';

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [celebrationText, setCelebrationText] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  // Check tutorial on mount - AUTO MUNCUL!
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('financequest_tutorial_done');
    console.log('🎯 Tutorial Check:', hasSeenTutorial ? 'Already seen' : 'NEW USER - SHOW TUTORIAL!');
    
    if (!hasSeenTutorial) {
      // Delay untuk kasih waktu DOM render
      const timer = setTimeout(() => {
        console.log('✨ Showing tutorial now!');
        setShowTutorial(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Gamification State
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  // const [coins, setCoins] = useState(100);
  const [coins, setCoins] = useState(() => {
    const stored = localStorage.getItem('coins');
    return stored !== null ? Number(stored) : 100; // Default 100 untuk user baru
  });

  const [streak, setStreak] = useState(() => {
    const stored = localStorage.getItem('streak');
    return stored !== null ? Number(stored) : 0;
  });
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [hearts, setHearts] = useState(5);
  const [mascotMood, setMascotMood] = useState('happy');
  const [avatarLevel, setAvatarLevel] = useState(1);
  
  // Daily Quests
  const [dailyQuests, setDailyQuests] = useState([
    { id: 1, title: 'Add 3 transactions', progress: 0, target: 3, reward: 50, completed: false, icon: '📝' },
    { id: 2, title: 'Stay under budget', progress: 0, target: 1, reward: 100, completed: false, icon: '💰' },
    { id: 3, title: 'Use AI prediction', progress: 0, target: 2, reward: 30, completed: false, icon: '🤖' }
  ]);
  
  // Budget System
  const [budgets, setBudgets] = useState({
    'Food': { limit: 1000000, spent: 0 },
    'Transport': { limit: 500000, spent: 0 },
    'Shopping': { limit: 800000, spent: 0 },
    'Entertainment': { limit: 400000, spent: 0 },
  });
  
  // Savings Goals
  const [savingsGoals, setSavingsGoals] = useState([
    { id: 1, name: 'New Laptop', target: 15000000, current: 0, icon: '💻' },
    { id: 2, name: 'Vacation Fund', target: 5000000, current: 0, icon: '🏖️' },
  ]);
  
  const [floatingCoins, setFloatingCoins] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [predictedCategory, setPredictedCategory] = useState('');
  const [confidence, setConfidence] = useState(0);

  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  const categoryKeywords = {
    'Food': ['makan', 'food', 'resto', 'restaurant', 'warung', 'cafe', 'kopi', 'nasi', 'ayam', 'soto', 'bakso', 'mie', 'sate padang', 'mam'],
    'Transport': ['grab', 'grep', 'gojek', 'taxi', 'uber', 'bensin', 'parkir', 'tol', 'busway', 'kereta', 'commuter'],
    'Shopping': ['beli', 'belanja', 'shop', 'tokopedia', 'shopee', 'lazada', 'mall', 'toko'],
    'Utilities': ['pulsa', 'listrik', 'air', 'wifi', 'internet', 'token', 'pln'],
    'Entertainment': ['nonton', 'bioskop', 'game', 'spotify', 'netflix', 'youtube', 'concert', 'karaoke', 'k-pop', 'korea drama', 'k-drama', 'viu', 'manga', 'manhwa', 'anime'],
    'Health': ['dokter', 'rumah sakit', 'obat', 'apotek', 'vitamin', 'medical', 'hospital', 'kanker', 'demam', 'batuk'],
    'Education': ['belajar', 'buku', 'kursus', 'les ', 'course', 'sekolah', 'kuliah', 'udemy', 'bootcamp', 'webinar'],
    'Salary': ['gaji', 'upah', 'gaji bulanan', 'gaji harian', 'payroll', 'slip gaji', 'salary'],
    'Freelance': ['freelance', 'freelancer', 'proyek', 'project', 'client', 'fee', 'honor', 'jasa', 'komisi jasa'],
    'Business': ['usaha', 'bisnis', 'penjualan', 'omzet', 'laba', 'profit', 'pendapatan usaha', 'reseller', 'dropship'],
    'Investment': ['investasi', 'dividen', 'bunga', 'return', 'imbal hasil', 'saham', 'reksadana', 'crypto', 'deposito', 'deposit', 'obligasi'],
    'Gift': ['hadiah', 'gift', 'pemberian', 'uang hadiah', 'kado', 'angpao', 'thr', 'tehaer', 'sumbangan'],
    'Bonus': ['bonus', 'insentif', 'reward', 'komisi', 'tunjangan', 'uang lembur', 'performance bonus', 'bonus kantor'],
    'Other': []
  };

  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Education', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Bonus', 'Other'];

  const getCurrentCategories = () => {
    return formData.type === 'expense' ? expenseCategories : incomeCategories;
  };

  const getAvatar = () => {
    if (level >= 20) return '👑';
    if (level >= 15) return '🦸';
    if (level >= 10) return '🧙';
    if (level >= 5) return '🎯';
    return '🎪';
  };

  const getAvatarTitle = () => {
    if (level >= 20) return 'Money Master';
    if (level >= 15) return 'Finance Hero';
    if (level >= 10) return 'Budget Wizard';
    if (level >= 5) return 'Savings Expert';
    return 'Money Starter';
  };

  useEffect(() => {
  const sync = () => {
    const stored = localStorage.getItem('coins');
    if (stored !== null) setCoins(Number(stored));
  };

  sync();
  // window.addEventListener('storage', sync);
  return () => window.removeEventListener('storage', sync);
}, []);


  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);


useEffect(() => {
  const milestones = {
    10: { coins: 20 },
    50: { coins: 50, hearts: 1 },
    100: { coins: 100, hearts: 1 },
    200: { coins: 200, hearts: 2 },
  };

  const lastRewarded =
    Number(localStorage.getItem('lastStreakReward')) || 0;

  if (milestones[streak] && streak > lastRewarded) {
    const reward = milestones[streak];

    if (reward.coins) {
      setCoins(prev => prev + reward.coins);
    }

    if (reward.hearts) {
      setHearts(prev => Math.min(prev + reward.hearts, 5));
    }

    localStorage.setItem('lastStreakReward', streak.toString());

    showCelebrationModal(
      `🔥 ${streak} Day Streak!
       +${reward.coins || 0} Coins
       ${reward.hearts ? `+${reward.hearts} ❤️` : ''}`
    );
  }
}, [streak]);


useEffect(() => {
  const today = new Date().toDateString();
  const storedLastLogin = localStorage.getItem('lastLoginDate');

  if (!storedLastLogin) {
    // login pertama
    setStreak(1);
    localStorage.setItem('lastLoginDate', today);
    return;
  }

  if (storedLastLogin === today) {
    // sudah login hari ini → DO NOTHING
    return;
  }

  const diffDays =
    (new Date(today) - new Date(storedLastLogin)) / 86400000;

  if (diffDays === 1) {
    setStreak(prev => prev + 1);
  } else {
    setStreak(1);
  }

  localStorage.setItem('lastLoginDate', today);
}, []);



  useEffect(() => {
    const thisMonthExpenses = transactions.filter(t => {
      const transDate = new Date(t.date);
      const now = new Date();
      return t.type === 'expense' && 
             transDate.getMonth() === now.getMonth() && 
             transDate.getFullYear() === now.getFullYear();
    });

    const newBudgets = { ...budgets };
    Object.keys(newBudgets).forEach(cat => {
      const spent = thisMonthExpenses
        .filter(t => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0);
      newBudgets[cat].spent = spent;
    });
    setBudgets(newBudgets);

    const totalSpent = Object.values(newBudgets).reduce((sum, b) => sum + b.spent, 0);
    const totalLimit = Object.values(newBudgets).reduce((sum, b) => sum + b.limit, 0);
    if (totalSpent <= totalLimit) {
      updateQuestProgress(2, 1);
    }
  }, [transactions]);

  const predictCategory = (desc) => {
    if (!desc || desc.trim().length < 3) {
      setPredictedCategory('');
      setConfidence(0);
      return;
    }

    const lowerDesc = desc.toLowerCase();
    let maxScore = 0;
    let bestCategory = 'Other';

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        if (lowerDesc.includes(keyword)) {
          score += 1;
        }
      });
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    });

    const conf = Math.min(maxScore * 30 + 40, 95);
    setPredictedCategory(bestCategory);
    setConfidence(conf);
    
    if (!formData.category && bestCategory !== 'Other') {
      setFormData(prev => ({ ...prev, category: bestCategory }));
      updateQuestProgress(3, 1);
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, description: value }));
    predictCategory(value);
  };

  const spawnCoins = (amount) => {
    const newCoins = [];
    for (let i = 0; i < 5; i++) {
      newCoins.push({
        id: Date.now() + i,
        left: Math.random() * 80 + 10,
        delay: i * 100
      });
    }
    setFloatingCoins(newCoins);
    setTimeout(() => setFloatingCoins([]), 2000);
  };

  
  const showCelebrationModal = (text) => {
    setCelebrationText(text);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const addXP = (amount, reason) => {
    const newXp = xp + amount;
    if (newXp >= xpForNextLevel) {
      setLevel(level + 1);
      setXp(newXp - xpForNextLevel);
      setAvatarLevel(level + 1);
      showCelebrationModal(`🎉 LEVEL UP! Now Level ${level + 1}! ${getAvatarTitle()}`);
      setMascotMood('excited');
      setTimeout(() => setMascotMood('happy'), 3000);
    } else {
      setXp(newXp);
    }
    spawnCoins(amount);
  };

  const updateQuestProgress = (questId, increment) => {
    setDailyQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        const newProgress = Math.min(quest.progress + increment, quest.target);
        if (newProgress >= quest.target && !quest.completed) {
          setCoins(prev => prev + quest.reward);
          addXP(quest.reward / 2, 'quest');
          showCelebrationModal(`✅ Quest Complete! +${quest.reward} coins!`);
          return { ...quest, progress: quest.target, completed: true };
        }
        return { ...quest, progress: newProgress };
      }
      return quest;
    }));
  };

  const checkBudgetWarning = (category, amount) => {
    if (!budgets[category]) return;

    const newSpent = budgets[category].spent + amount;
    const percentage = (newSpent / budgets[category].limit) * 100;

    // 🔴 OVER 90% → HEART BERKURANG
    if (percentage > 90) {
      setHearts(prev => Math.max(prev - 1, 0));

      showCelebrationModal(
        `💔 Budget ${category} over ${percentage.toFixed(0)}%! Heart -1`
      );

      setMascotMood('sad');
      setTimeout(() => setMascotMood('happy'), 3000);

    // 🟡 Warning ringan (opsional)
    } else if (percentage >= 80) {
      showCelebrationModal(
        `⚠️ Warning! ${category} budget at ${percentage.toFixed(0)}%`
      );
    }
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Please fill all fields!');
      return;
    }

    const newTransaction = {
      id: editingId || Date.now(),
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString()
    };

        if (editingId) {
      setTransactions(prev =>
        prev.map(t => t.id === editingId ? newTransaction : t)
      );

      addXP(5, 'edit');

      // ⬇️ EDIT = BIAYA KECIL
      setCoins(prev => Math.max(prev - 2, 0));

    } else {
      setTransactions(prev => [newTransaction, ...prev]);

      addXP(15, 'add');

      // ⬆️ ADD = REWARD
      setCoins(prev => prev + 10);

      updateQuestProgress(1, 1);

      if (newTransaction.type === 'expense') {
        checkBudgetWarning(newTransaction.category, newTransaction.amount);
      }

      setMascotMood('excited');
      setTimeout(() => setMascotMood('happy'), 2000);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setPredictedCategory('');
    setConfidence(0);
    setShowModal(false);
    setEditingId(null);
  };

  const handleEdit = (transaction) => {
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date
    });
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setTransactions(prev => prev.filter(t => t.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    addXP(3, 'delete');
    setCoins(coins - 5);
  };

  const handleLogout = () => {
    localStorage.clear(); // atau removeItem('token')
    sessionStorage.clear();

    window.location.replace('/');
  };


  const goToAnalytics = () => {
    navigate('/analytics', { 
      state: { 
        transactions, 
        budgets, 
        level, 
        xp 
      } 
    });
  };

  const updateBudget = (category, newLimit) => {
    setBudgets(prev => ({
      ...prev,
      [category]: { ...prev[category], limit: parseFloat(newLimit) }
    }));
  };

  const addGoal = (name, target, icon) => {
    const newGoal = {
      id: Date.now(),
      name,
      target: parseFloat(target),
      current: 0,
      icon
    };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const contributeToGoal = (goalId, amount) => {
    setSavingsGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newCurrent = Math.min(goal.current + amount, goal.target);
        if (newCurrent >= goal.target && goal.current < goal.target) {
          showCelebrationModal(`🎉 GOAL ACHIEVED! ${goal.name} completed!`);
          addXP(100, 'goal');
          setCoins(coins + 200);
        }
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  };

  const openContributeModal = (goal) => {
    setSelectedGoal(goal);
    setShowContributeModal(true);
  };

  const handleContribute = () => {
    const amount = parseFloat(document.getElementById('contributeAmount').value);
    if (amount && amount > 0 && selectedGoal) {
      contributeToGoal(selectedGoal.id, amount);
      setShowContributeModal(false);
      setSelectedGoal(null);
      showCelebrationModal(`💰 +Rp ${amount.toLocaleString('id-ID')} to ${selectedGoal.name}!`);
    } else {
      alert('Please enter a valid amount!');
    }
  };

  const thisMonthTransactions = transactions.filter(t => {
    const transDate = new Date(t.date);
    const now = new Date();
    return transDate.getMonth() === now.getMonth() && 
           transDate.getFullYear() === now.getFullYear();
  });

  const totalExpense = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="game-container">
      {floatingCoins.map(coin => (
        <div 
          key={coin.id} 
          className="floating-coin"
          style={{ 
            left: `${coin.left}%`,
            animationDelay: `${coin.delay}ms`
          }}
        >
          💰
        </div>
      ))}

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="streak-badge">
            <Flame size={18} className="flame-icon" />
            <span className="streak-number">{streak}</span>
          </div>
          <div className="hearts-container">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`heart ${i < hearts ? 'active' : ''}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>
        <div className="top-bar-right">
          <div className="coins-display">
            <span className="coin-icon">💰</span>
            <span className="coin-amount">{coins}</span>
          </div>
          <button 
            className="logout-btn-top" 
            onClick={() => {
              localStorage.removeItem('financequest_tutorial_done');
              setShowTutorial(true);
            }}
            style={{ marginRight: '10px', background: '#667eea', fontSize: '18px' }}
            title="Restart Tutorial"
          >
            📚
          </button>
          <button
            className="logout-btn-top"
            onClick={() => setShowLogoutModal(true)}
          >
            Exit
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="game-content">
        {/* Mascot & Level Section */}
        <div className="mascot-section">
          <div className={`mascot mascot-${mascotMood}`}>
            <div className="mascot-character">{getAvatar()}</div>
            <div className="mascot-title">{getAvatarTitle()}</div>
            <div className="mascot-speech">
              {mascotMood === 'excited' ? "Amazing! 🎉" : mascotMood === 'sad' ? "Keep going! 💪" : "Hello! 👋"}
            </div>
          </div>
          <div className="level-display">
            <div className="level-badge">
              <Star className="level-star" size={20} />
              <span className="level-text">Level {level}</span>
            </div>
            <div className="xp-container">
              <div className="xp-bar-bg">
                <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }}>
                  <div className="xp-shine"></div>
                </div>
              </div>
              <div className="xp-text">{xp} / {xpForNextLevel} XP</div>
            </div>
          </div>
        </div>

        {/* Analytics Navigation Button */}
        <button className="analytics-nav-btn" onClick={goToAnalytics}>
          <div className="analytics-btn-inner">
            <Activity size={28} className="analytics-icon" />
            <div className="analytics-btn-content">
              <span className="analytics-btn-title">View Financial Analytics</span>
              <span className="analytics-btn-subtitle">📊 See your health score & insights</span>
            </div>
            <BarChart3 size={24} className="analytics-arrow" />
          </div>
        </button>

        {/* Daily Quests */}
        <div className="quests-section">
          <h2 className="section-title">
            <Trophy size={20} />
            Daily Quests
          </h2>
          <div className="quests-grid">
            {dailyQuests.map(quest => (
              <div key={quest.id} className={`quest-card ${quest.completed ? 'completed' : ''}`}>
                <div className="quest-icon">{quest.icon}</div>
                <div className="quest-info">
                  <div className="quest-title">{quest.title}</div>
                  <div className="quest-progress-bar">
                    <div 
                      className="quest-progress-fill" 
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    ></div>
                  </div>
                  <div className="quest-footer">
                    <span className="quest-progress-text">{quest.progress}/{quest.target}</span>
                    <span className="quest-reward">💰 {quest.reward}</span>
                  </div>
                </div>
                {quest.completed && (
                  <div className="quest-check">
                    <CheckCircle size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Budget System */}
        <div className="budget-section">
          <div className="section-header">
            <h2 className="section-title">
              <Target size={20} />
              Monthly Budget
            </h2>
            <button className="settings-btn" onClick={() => setShowBudgetModal(true)}>
              <Settings size={18} />
            </button>
          </div>
          <div className="budget-grid">
            {Object.entries(budgets).map(([category, data]) => {
              const percentage = (data.spent / data.limit) * 100;
              const isWarning = percentage >= 80;
              const isDanger = percentage >= 90;
              
              return (
                <div key={category} className={`budget-card ${isDanger ? 'danger' : isWarning ? 'warning' : ''}`}>
                  <div className="budget-header">
                    <span className="budget-category">{category}</span>
                    {isDanger && <AlertCircle size={18} className="alert-icon" />}
                  </div>
                  <div className="budget-amount">
                    <span className="budget-spent">Rp {data.spent.toLocaleString('id-ID')}</span>
                    <span className="budget-limit">/ Rp {data.limit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="budget-progress-bar">
                    <div 
                      className="budget-progress-fill" 
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="budget-percentage">{percentage.toFixed(0)}% used</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="goals-section">
          <div className="section-header">
            <h2 className="section-title">
              <PiggyBank size={20} />
              Savings Goals
            </h2>
            <button className="settings-btn" onClick={() => setShowGoalsModal(true)}>
              <Plus size={18} />
            </button>
          </div>
          <div className="goals-grid">
            {savingsGoals.map(goal => {
              const percentage = (goal.current / goal.target) * 100;
              const isComplete = percentage >= 100;
              
              return (
                <div key={goal.id} className={`goal-card ${isComplete ? 'completed' : ''}`}>
                  <div className="goal-icon-big">{goal.icon}</div>
                  <div className="goal-info">
                    <div className="goal-name">{goal.name}</div>
                    <div className="goal-amount">
                      <span className="goal-current">Rp {goal.current.toLocaleString('id-ID')}</span>
                      <span className="goal-target">/ Rp {goal.target.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="goal-progress-bar">
                      <div 
                        className="goal-progress-fill" 
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="goal-footer">
                      <span className="goal-percentage">{percentage.toFixed(0)}%</span>
                      {!isComplete && (
                        <button 
                          className="goal-contribute-btn"
                          onClick={() => openContributeModal(goal)}
                        >
                          <Coins size={14} /> Add
                        </button>
                      )}
                      {isComplete && (
                        <span className="goal-complete-badge">
                          <CheckCircle size={16} /> Complete!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card-game expense">
            <div className="stat-icon-game">💸</div>
            <div className="stat-label-game">Expenses</div>
            <div className="stat-value-game">Rp {totalExpense.toLocaleString('id-ID')}</div>
          </div>
          <div className="stat-card-game income">
            <div className="stat-icon-game">💰</div>
            <div className="stat-label-game">Income</div>
            <div className="stat-value-game">Rp {totalIncome.toLocaleString('id-ID')}</div>
          </div>
          <div className="stat-card-game balance">
            <div className="stat-icon-game">💵</div>
            <div className="stat-label-game">Balance</div>
            <div className="stat-value-game">Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}</div>
          </div>
        </div>

        {/* Big Add Button */}
        <button className="big-add-btn" onClick={() => setShowModal(true)}>
          <div className="btn-inner">
            <Plus size={32} />
            <span className="btn-text">Add Transaction</span>
            <span className="btn-reward">+15 XP • +10 💰</span>
          </div>
        </button>

        {/* Transactions List */}
        <div className="transactions-game">
          <h2 className="section-title">
            <FileText size={20} />
            Recent Activity
          </h2>
          {transactions.length === 0 ? (
            <div className="empty-game">
              <div className="empty-mascot">🎯</div>
              <div className="empty-title">Start Your Journey!</div>
              <div className="empty-subtitle">Add your first transaction to begin</div>
            </div>
          ) : (
            <div className="transactions-game-list">
              {transactions.slice(0, 10).map(transaction => (
                <div key={transaction.id} className={`transaction-game-item ${transaction.type}`}>
                  <div className="transaction-game-left">
                    <div className="transaction-game-icon">
                      {transaction.type === 'expense' ? '💸' : '💰'}
                    </div>
                    <div className="transaction-game-info">
                      <div className="transaction-game-desc">{transaction.description}</div>
                      <div className="transaction-game-meta">
                        <span className="transaction-game-cat">{transaction.category}</span>
                        <span className="transaction-game-date">{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-game-right">
                    <div className="transaction-game-amount">
                      {transaction.type === 'expense' ? '-' : '+'}Rp {transaction.amount.toLocaleString('id-ID')}
                    </div>
                    <div className="transaction-game-actions">
                      <button className="game-action-btn edit" onClick={() => handleEdit(transaction)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="game-action-btn delete" onClick={() => confirmDelete(transaction.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ALL MODALS */}
      {showModal && (
        <div className="game-modal-overlay" onClick={(e) => e.target.className === 'game-modal-overlay' && resetForm()}>
          <div className="game-modal">
            <button className="game-modal-close" onClick={resetForm}>
              <X size={24} />
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">✨</div>
              <h3 className="game-modal-title">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
            </div>
            <div className="game-form">
              <div className="type-toggle">
                <button
                  className={`type-toggle-btn ${formData.type === 'expense' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
                >
                  💸 Expense
                </button>
                <button
                  className={`type-toggle-btn ${formData.type === 'income' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
                >
                  💰 Income
                </button>
              </div>
              <div className="game-input-group">
                <label className="game-label">💵 Amount</label>
                <input
                  type="number"
                  className="game-input"
                  placeholder="50000"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="game-input-group">
                <label className="game-label">📝 Description</label>
                <input
                  type="text"
                  className="game-input"
                  placeholder="What did you spend on?"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
                {predictedCategory && confidence > 0 && (
                  <div className="ai-prediction">
                    <Sparkles size={14} />
                    <span>AI suggests: <strong>{predictedCategory}</strong> ({confidence}%)</span>
                    <div className="ai-confidence">
                      <div className="ai-confidence-fill" style={{ width: `${confidence}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="game-input-group">
                <label className="game-label">🏷️ Category</label>
                <select
                  className="game-select"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {getCurrentCategories().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="game-input-group">
                <label className="game-label">📅 Date</label>
                <input
                  type="date"
                  className="game-input"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <button className="game-submit-btn" onClick={handleSubmit}>
                <span>{editingId ? 'Update' : 'Add'} Transaction</span>
                <span className="submit-reward">+{editingId ? '5' : '15'} XP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showBudgetModal && (
        <div className="game-modal-overlay" onClick={(e) => e.target.className === 'game-modal-overlay' && setShowBudgetModal(false)}>
          <div className="game-modal">
            <button className="game-modal-close" onClick={() => setShowBudgetModal(false)}>
              <X size={24} />
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">💰</div>
              <h3 className="game-modal-title">Set Monthly Budget</h3>
            </div>
            <div className="game-form">
              {Object.entries(budgets).map(([category, data]) => (
                <div key={category} className="game-input-group">
                  <label className="game-label">{category}</label>
                  <input
                    type="number"
                    className="game-input"
                    placeholder="Enter budget limit"
                    value={data.limit}
                    onChange={(e) => updateBudget(category, e.target.value)}
                  />
                  <div className="budget-helper">
                    Current spending: Rp {data.spent.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
              <button className="game-submit-btn" onClick={() => setShowBudgetModal(false)}>
                <span>Save Budget</span>
                <span className="submit-reward">+5 XP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showGoalsModal && (
        <div className="game-modal-overlay" onClick={(e) => e.target.className === 'game-modal-overlay' && setShowGoalsModal(false)}>
          <div className="game-modal">
            <button className="game-modal-close" onClick={() => setShowGoalsModal(false)}>
              <X size={24} />
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">🎯</div>
              <h3 className="game-modal-title">Add Savings Goal</h3>
            </div>
            <div className="game-form">
              <div className="game-input-group">
                <label className="game-label">🎁 Goal Name</label>
                <input type="text" className="game-input" placeholder="New Laptop, Vacation, etc." id="goalName" />
              </div>
              <div className="game-input-group">
                <label className="game-label">💰 Target Amount</label>
                <input type="number" className="game-input" placeholder="5000000" id="goalTarget" />
              </div>
              <div className="game-input-group">
                <label className="game-label">🎨 Choose Icon</label>
                <div className="icon-picker">
                  {['💻', '🏖️', '🚗', '🏠', '📱', '🎮', '👕', '✈️'].map(icon => (
                    <button 
                      key={icon}
                      className="icon-picker-btn"
                      onClick={(e) => {
                        document.querySelectorAll('.icon-picker-btn').forEach(btn => btn.classList.remove('selected'));
                        e.target.classList.add('selected');
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                className="game-submit-btn" 
                onClick={() => {
                  const name = document.getElementById('goalName').value;
                  const target = document.getElementById('goalTarget').value;
                  const selectedIcon = document.querySelector('.icon-picker-btn.selected');
                  const icon = selectedIcon ? selectedIcon.textContent : '🎯';
                  if (name && target) {
                    addGoal(name, target, icon);
                    setShowGoalsModal(false);
                    showCelebrationModal('🎯 New Goal Created! +20 XP');
                    addXP(20, 'goal-create');
                  } else {
                    alert('Please fill all fields!');
                  }
                }}
              >
                <span>Create Goal</span>
                <span className="submit-reward">+20 XP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showContributeModal && selectedGoal && (
        <div className="game-modal-overlay" onClick={(e) => e.target.className === 'game-modal-overlay' && setShowContributeModal(false)}>
          <div className="game-modal contribute-modal">
            <button className="game-modal-close" onClick={() => setShowContributeModal(false)}>
              <X size={24} />
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">{selectedGoal.icon}</div>
              <h3 className="game-modal-title">Add to {selectedGoal.name}</h3>
              <div className="contribute-info">
                <div className="contribute-current">Current: Rp {selectedGoal.current.toLocaleString('id-ID')}</div>
                <div className="contribute-target">Target: Rp {selectedGoal.target.toLocaleString('id-ID')}</div>
                <div className="contribute-remaining">Remaining: Rp {(selectedGoal.target - selectedGoal.current).toLocaleString('id-ID')}</div>
              </div>
            </div>
            <div className="game-form">
              <div className="game-input-group">
                <label className="game-label">💰 Contribution Amount</label>
                <input type="number" className="game-input" placeholder="Enter amount" id="contributeAmount" max={selectedGoal.target - selectedGoal.current} />
                <div className="budget-helper">Max: Rp {(selectedGoal.target - selectedGoal.current).toLocaleString('id-ID')}</div>
              </div>
              <button className="game-submit-btn" onClick={handleContribute}>
                <span>Contribute</span>
                <span className="submit-reward">💰 Save Money</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="game-modal-overlay">
          <div className="game-delete-modal">
            <div className="delete-mascot">😢</div>
            <h3 className="delete-modal-title">Delete Transaction?</h3>
            <p className="delete-modal-text">Are you sure want to detele transaction? If you delete, your coins will be -5</p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="delete-modal-btn confirm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-modal">
            <div className="celebration-confetti">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="confetti" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#ff9a9e', '#fad0c4', '#ffd1ff', '#ffd4a3'][Math.floor(Math.random() * 4)]
                }}></div>
              ))}
            </div>
            <div className="celebration-content">
              <div className="celebration-icon">🎉</div>
              <div className="celebration-text">{celebrationText}</div>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="logout-overlay">
          <div className="logout-box">
            <p>Are you sure you want to logout?</p>

            <button onClick={() => setShowLogoutModal(false)}>
              Cancel
            </button>

            <button onClick={confirmLogout}>
              Yes, Logout
            </button>
          </div>
        </div>
      )}

      {/* TUTORIAL - AUTO MUNCUL UNTUK NEW USER! */}
      {showTutorial && (
        <Tutorial 
          onComplete={() => {
            console.log('✅ Tutorial COMPLETED!');
            localStorage.setItem('financequest_tutorial_done', 'true');
            setShowTutorial(false);
            showCelebrationModal('🎉 Tutorial Complete! Welcome aboard!');
          }}
          onSkip={() => {
            console.log('⏭️ Tutorial SKIPPED!');
            localStorage.setItem('financequest_tutorial_done', 'true');
            setShowTutorial(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;