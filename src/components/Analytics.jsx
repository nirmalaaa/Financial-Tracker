import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle, Zap, Target, PieChart, BarChart3, ArrowLeft, Lightbulb, Trophy, Star, Award, DollarSign, Wallet, ShieldAlert, Flame, Gift, Sparkles, Heart, BadgeCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const storedBudgets = JSON.parse(localStorage.getItem('budgets')) || {};

  const data = location.state || {
    transactions: storedTransactions,
    budgets: storedBudgets,
    level: 1,
    xp: 0,
    streak: 0,
    hearts: 5
  };

  const [transactions] = useState(data.transactions || []);
  const [budgets] = useState(data.budgets || {});
  const [level] = useState(data.level || 1);
  const [xp] = useState(data.xp || 0);
  const [coins, setCoins] = useState(() => {
    const stored = localStorage.getItem('coins');
    return stored !== null ? Number(stored) : 0;
  });
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(data.hearts || 5);
  const [chartMode, setChartMode] = useState('daily');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [healthScore, setHealthScore] = useState(0);
  const [scoreFactors, setScoreFactors] = useState({
    budgetAdherence: 0,
    savingsRate: 0,
    spendingConsistency: 0,
    emergencyFund: 0
  });
  const [topCategory, setTopCategory] = useState(null);
  const [spendingTrend, setSpendingTrend] = useState('stable');
  const [insights, setInsights] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [lastLoginDate, setLastLoginDate] = useState(localStorage.getItem('lastLoginDate'));

  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

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

  const getDailyDataThisMonth = () => {
    if (!Array.isArray(transactions)) return [];

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const daily = {};

    transactions.forEach(t => {
      if (!t || t.type !== 'expense' || !t.date) return;

      const d = new Date(t.date);
      if (isNaN(d)) return;

      if (d.getMonth() !== month || d.getFullYear() !== year) return;

      const day = d.getDate();
      daily[day] = (daily[day] || 0) + Number(t.amount || 0);
    });

    return Object.entries(daily)
      .map(([day, amount]) => ({ day: Number(day), amount }))
      .sort((a, b) => a.day - b.day);
  };

  const getCategoryDataThisMonth = () => {
    if (!Array.isArray(transactions)) return [];

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const categories = {};

    transactions.forEach(t => {
      if (!t || t.type !== 'expense' || !t.date) return;

      const d = new Date(t.date);
      if (isNaN(d)) return;

      if (d.getMonth() !== month || d.getFullYear() !== year) return;

      const cat = t.category || 'Other';
      categories[cat] = (categories[cat] || 0) + Number(t.amount || 0);
    });

    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/');
  };

  useEffect(() => {
    const stored = localStorage.getItem('coins');
    if (stored !== null) {
      setCoins(Number(stored));
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (!lastLoginDate) {
      setStreak(1);
    } else {
      const last = new Date(lastLoginDate).toDateString();
      if (today === last) {
        return;
      }
      const diffDays = (new Date(today) - new Date(last)) / 86400000;
      if (diffDays === 1) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1);
      }
    }
    setLastLoginDate(today);
    localStorage.setItem('lastLoginDate', today);
  }, []);

  useEffect(() => {
    calculateHealthScore();
    calculateInsights();
    setDailyData(getDailyDataThisMonth());
    setCategoryData(getCategoryDataThisMonth());
  }, [transactions, budgets]);

  const calculateHealthScore = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const thisMonthTx = transactions.filter(t => {
      if (!t?.date) return false;
      const date = new Date(t.date);
      return (
        !isNaN(date) &&
        date.getMonth() === thisMonth &&
        date.getFullYear() === thisYear
      );
    });

    const totalIncome = thisMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpense = thisMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    let budgetScore = 0;
    const totalBudget = Object.values(budgets || {})
      .reduce((sum, b) => sum + Number(b.limit || 0), 0);

    const totalSpent = Object.values(budgets || {})
      .reduce((sum, b) => sum + Number(b.spent || 0), 0);

    if (totalBudget > 0) {
      const adherence = 1 - totalSpent / totalBudget;
      budgetScore = Math.max(0, Math.min(30, adherence * 30 + 15));
    }

    let savingsScore = 0;
    if (totalIncome > 0) {
      const savingsRate = (totalIncome - totalExpense) / totalIncome;
      savingsScore = Math.max(0, Math.min(30, savingsRate * 50));
    }

    const dailySpending = calculateDailySpending(thisMonthTx);
    const consistency = calculateConsistency(dailySpending);
    const consistencyScore = consistency * 20;

    const levelScore = Math.min(20, (level / 20) * 20);

    const factors = {
      budgetAdherence: Math.round(budgetScore),
      savingsRate: Math.round(savingsScore),
      spendingConsistency: Math.round(consistencyScore),
      emergencyFund: Math.round(levelScore)
    };

    const totalScore = Math.round(
      factors.budgetAdherence +
      factors.savingsRate +
      factors.spendingConsistency +
      factors.emergencyFund
    );

    setScoreFactors(factors);
    setHealthScore(totalScore);
  };

  const calculateDailySpending = (transactions) => {
    const daily = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = new Date(t.date).toDateString();
        daily[date] = (daily[date] || 0) + Number(t.amount || 0);
      });
    return Object.values(daily);
  };

  const calculateConsistency = (dailySpending) => {
    if (dailySpending.length < 2) return 0.5;
    const avg = dailySpending.reduce((a, b) => a + b, 0) / dailySpending.length;
    const variance = dailySpending.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / dailySpending.length;
    const stdDev = Math.sqrt(variance);
    const cv = avg > 0 ? stdDev / avg : 1;
    return Math.max(0, 1 - cv);
  };

  const calculateInsights = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthTx = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear && t.type === 'expense';
    });

    const categorySpending = {};
    thisMonthTx.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    const top = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    if (top) {
      setTopCategory({ name: top[0], amount: top[1] });
    }

    const lastMonthTx = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth - 1 && date.getFullYear() === thisYear && t.type === 'expense';
    });

    const thisMonthTotal = thisMonthTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const lastMonthTotal = lastMonthTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    if (lastMonthTotal > 0) {
      const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      if (change > 10) setSpendingTrend('increasing');
      else if (change < -10) setSpendingTrend('decreasing');
      else setSpendingTrend('stable');
    }

    const newInsights = [];

    if (healthScore < 50) {
      newInsights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Low Health Score',
        message: 'Your financial health needs attention. Focus on staying within budget and increasing savings.',
        action: 'Review Budget'
      });
    }

    if (scoreFactors.budgetAdherence < 15) {
      newInsights.push({
        type: 'danger',
        icon: '🚨',
        title: 'Budget Overspending',
        message: 'You\'re exceeding your budget limits. Consider reducing spending in high-expense categories.',
        action: 'Adjust Budget'
      });
    }

    if (scoreFactors.savingsRate < 15) {
      newInsights.push({
        type: 'warning',
        icon: '💰',
        title: 'Low Savings Rate',
        message: 'Try to save at least 20% of your income. Look for areas to cut unnecessary expenses.',
        action: 'Set Savings Goal'
      });
    }

    if (spendingTrend === 'increasing') {
      newInsights.push({
        type: 'warning',
        icon: '📈',
        title: 'Spending Increasing',
        message: 'Your spending has increased by more than 10% this month. Monitor your expenses closely.',
        action: 'Track Expenses'
      });
    }

    if (topCategory && topCategory.amount > 0) {
      const totalSpent = thisMonthTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const percentage = (topCategory.amount / totalSpent) * 100;
      if (percentage > 40) {
        newInsights.push({
          type: 'info',
          icon: '📊',
          title: `High ${topCategory.name} Spending`,
          message: `${topCategory.name} accounts for ${percentage.toFixed(0)}% of your spending. Consider if this is necessary.`,
          action: 'Review Category'
        });
      }
    }

    if (healthScore >= 80) {
      newInsights.push({
        type: 'success',
        icon: '🌟',
        title: 'Excellent Financial Health!',
        message: 'Keep up the great work! You\'re managing your money very well.',
        action: 'Keep Going'
      });
    }

    setInsights(newInsights);
  };

  const getScoreGrade = () => {
    if (healthScore >= 90) return { grade: 'A+', color: '#4caf50', emoji: '🌟' };
    if (healthScore >= 80) return { grade: 'A', color: '#66bb6a', emoji: '✨' };
    if (healthScore >= 70) return { grade: 'B', color: '#fdd835', emoji: '👍' };
    if (healthScore >= 60) return { grade: 'C', color: '#ff9800', emoji: '⚠️' };
    if (healthScore >= 50) return { grade: 'D', color: '#ff6b6b', emoji: '😰' };
    return { grade: 'F', color: '#f44336', emoji: '🚨' };
  };

  const getScoreDescription = () => {
    if (healthScore >= 80) return 'Excellent! Your finances are in great shape!';
    if (healthScore >= 60) return 'Good! Keep improving your financial habits.';
    if (healthScore >= 40) return 'Fair. Focus on budget adherence and savings.';
    return 'Needs improvement. Start with small changes today.';
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard', { 
      state: { 
        transactions, 
        budgets, 
        level, 
        xp,
        coins,
        streak,
        hearts
      } 
    });
  };

  const handleInsightAction = (action) => {
    switch(action) {
      case 'Review Budget':
      case 'Adjust Budget':
        setShowBudgetModal(true);
        break;
      case 'Set Savings Goal':
        setShowGoalsModal(true);
        break;
      case 'Track Expenses':
        handleNavigateToDashboard();
        break;
      case 'Review Category':
        document.querySelector('.top-category-section')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  const scoreGrade = getScoreGrade();

  // Line Chart Component
  const LineChart = ({ data }) => {
    if (!data || data.length === 0) return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ffffffff' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <p>No spending data yet.</p>
      </div>
    );

    const maxAmount = Math.max(...data.map(d => d.amount), 1);
    const width = 600;
    const height = 300;
    const padding = 40;

    const points = data.map((item, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((item.amount / maxAmount) * (height - padding * 2));
      return { x, y, ...item };
    });

    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '300px' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - padding - (ratio * (height - padding * 2));
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255, 254, 254, 0.1)" strokeWidth="1" />
              <text x={padding - 10} y={y + 4} fontSize="10" fill="#ffffffff" textAnchor="end">
                {(maxAmount * ratio / 1000).toFixed(0)}K
              </text>
            </g>
          );
        })}

        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        <path
          d={pathData}
          fill="none"
          stroke="#667eea"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#667eea" stroke="#fff" strokeWidth="2" />
            <text x={p.x} y={height - padding + 20} fontSize="12" fill="#a0aec0" textAnchor="middle">
              Day {p.day}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data }) => {
    if (!data || data.length === 0) return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <p>No category data yet.</p>
      </div>
    );

    const total = data.reduce((sum, d) => sum + d.amount, 0);
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

    let currentAngle = -90;
    const radius = 100;
    const centerX = 150;
    const centerY = 150;

    const slices = data.map((item, i) => {
      const percentage = (item.amount / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      currentAngle = endAngle;

      return {
        path,
        color: colors[i % colors.length],
        category: item.category,
        amount: item.amount,
        percentage: percentage.toFixed(1)
      };
    });

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px', padding: '20px', flexWrap: 'wrap' }}>
        <svg viewBox="0 0 300 300" style={{ width: '300px', height: '300px', flexShrink: 0 }}>
          {slices.map((slice, i) => (
            <g key={i}>
              <path d={slice.path} fill={slice.color} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <div style={{ flex: 1, minWidth: '250px' }}>
          {slices.map((slice, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.71)',
              borderRadius: '8px'
            }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                background: slice.color, 
                borderRadius: '4px', 
                marginRight: '12px',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                  {slice.category}
                </div>
                <div style={{ fontSize: '12px', color: '#ffffffff' }}>
                  Rp {slice.amount.toLocaleString('id-ID')} ({slice.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-container">
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
            onClick={() => setShowLogoutModal(true)}
          >
            Exit
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="analytics-content">
        {/* Header with Back Button and Avatar */}
        <div className="analytics-header-full">
          <button className="back-btn" onClick={handleNavigateToDashboard}>
            <ArrowLeft size={24} />
          </button>
          
          <div className="analytics-mascot-section">
            <div className="analytics-mascot">
              <div className="analytics-mascot-character">{getAvatar()}</div>
              <div className="analytics-mascot-title">{getAvatarTitle()}</div>
            </div>
            <div className="analytics-level-display">
              <div className="analytics-level-badge">
                <Star className="analytics-level-star" size={18} />
                <span className="analytics-level-text">Level {level}</span>
              </div>
              <div className="analytics-xp-container">
                <div className="analytics-xp-bar-bg">
                  <div className="analytics-xp-bar-fill" style={{ width: `${xpProgress}%` }}>
                    <div className="analytics-xp-shine"></div>
                  </div>
                </div>
                <div className="analytics-xp-text">{xp} / {xpForNextLevel} XP</div>
              </div>
            </div>
          </div>

          <h1 className="analytics-title">
            <Activity size={28} />
            Financial Analytics
          </h1>
        </div>

        {/* Financial Health Score */}
        <div className="health-score-section">
          <div className="health-score-card">
            <div className="score-header">
              <h2>Financial Health Score</h2>
              <div className="score-badge">
                <span className="score-emoji">{scoreGrade.emoji}</span>
              </div>
            </div>
            
            <div className="score-display">
              <div className="score-circle" style={{ '--score-color': scoreGrade.color }}>
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" className="score-bg" />
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="90" 
                    className="score-progress"
                    style={{ 
                      strokeDashoffset: 565 - (565 * healthScore) / 100,
                      stroke: scoreGrade.color 
                    }}
                  />
                </svg>
                <div className="score-content">
                  <div className="score-number">{healthScore}</div>
                  <div className="score-grade">{scoreGrade.grade}</div>
                </div>
              </div>
            </div>

            <div className="score-description">
              {getScoreDescription()}
            </div>

            {/* Score Factors */}
            <div className="score-factors">
              <div className="factor-item">
                <div className="factor-header">
                  <span className="factor-icon">📊</span>
                  <span className="factor-name">Budget Adherence</span>
                </div>
                <div className="factor-bar">
                  <div 
                    className="factor-fill"
                    style={{ width: `${(scoreFactors.budgetAdherence / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="factor-score">{scoreFactors.budgetAdherence}/30</div>
              </div>

              <div className="factor-item">
                <div className="factor-header">
                  <span className="factor-icon">💰</span>
                  <span className="factor-name">Savings Rate</span>
                </div>
                <div className="factor-bar">
                  <div 
                    className="factor-fill"
                    style={{ width: `${(scoreFactors.savingsRate / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="factor-score">{scoreFactors.savingsRate}/30</div>
              </div>

              <div className="factor-item">
                <div className="factor-header">
                  <span className="factor-icon">📈</span>
                  <span className="factor-name">Spending Consistency</span>
                </div>
                <div className="factor-bar">
                  <div 
                    className="factor-fill"
                    style={{ width: `${(scoreFactors.spendingConsistency / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="factor-score">{scoreFactors.spendingConsistency}/20</div>
              </div>

              <div className="factor-item">
                <div className="factor-header">
                  <span className="factor-icon">🎯</span>
                  <span className="factor-name">Level Progress</span>
                </div>
                <div className="factor-bar">
                  <div 
                    className="factor-fill"
                    style={{ width: `${(scoreFactors.emergencyFund / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="factor-score">{scoreFactors.emergencyFund}/20</div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Insights */}
        <div className="insights-section">
          <h2 className="section-title">
            <Lightbulb size={24} />
            Smart Insights
          </h2>
          <div className="insights-grid">
            {insights.length > 0 ? insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <h3 className="insight-title">{insight.title}</h3>
                  <p className="insight-message">{insight.message}</p>
                  <button 
                    className="insight-action"
                    onClick={() => handleInsightAction(insight.action)}
                  >
                    {insight.action}
                  </button>
                </div>
              </div>
            )) : (
              <div className="insight-card info">
                <div className="insight-icon">💡</div>
                <div className="insight-content">
                  <h3 className="insight-title">Getting Started</h3>
                  <p className="insight-message">Add more transactions to get personalized insights!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spending Charts */}
        <div className="chart-section">
          <h2 className="section-title">
            <BarChart3 size={24} />
            Spending Trends
          </h2>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              onClick={() => setChartMode('daily')}
              className={`chart-mode-btn ${chartMode === 'daily' ? 'active' : ''}`}
            >
              Daily (Line)
            </button>
            <button
              onClick={() => setChartMode('category')}
              className={`chart-mode-btn ${chartMode === 'category' ? 'active' : ''}`}
            >
              Categories (Pie)
            </button>
          </div>

          <div className="chart-card">
            {chartMode === 'daily' ? (
              <LineChart data={dailyData} />
            ) : (
              <PieChart data={categoryData} />
            )}
          </div>
        </div>

        {/* Top Category */}
        {topCategory && (
          <div className="top-category-section">
            <h2 className="section-title">
              <Trophy size={24} />
              Top Spending Category
            </h2>
            <div className="top-category-card">
              <div className="category-icon-big">🏆</div>
              <div className="category-info">
                <h3 className="category-name">{topCategory.name}</h3>
                <div className="category-amount">
                  Rp {topCategory.amount.toLocaleString('id-ID')}
                </div>
                <p className="category-desc">Your highest expense this month</p>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="tips-section">
          <h2 className="section-title">
            <Star size={24} />
            Improvement Tips
          </h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-number">1</div>
              <h3>Track Every Day</h3>
              <p>Input transactions daily to maintain consistency and awareness</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">2</div>
              <h3>Follow 50/30/20 Rule</h3>
              <p>50% needs, 30% wants, 20% savings for balanced finances</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">3</div>
              <h3>Review Weekly</h3>
              <p>Check your spending patterns every week to stay on track</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">4</div>
              <h3>Set Realistic Goals</h3>
              <p>Start with achievable savings goals and gradually increase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="game-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="game-modal">
            <button className="game-modal-close" onClick={() => setShowLogoutModal(false)}>
              <span style={{ fontSize: '24px' }}>×</span>
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">👋</div>
              <h3 className="game-modal-title">Leave so soon?</h3>
            </div>

            <div className="logout-modal-content">
              <p className="modal-description">Your progress will be saved. Come back soon!</p>
              
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '24px' }}>⭐</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Level {level}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '24px' }}>💰</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{coins} Coins</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '24px' }}>🔥</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{streak} Days</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Stay
                </button>
                <button
                  onClick={confirmLogout}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                    border: 'none',
                    color: 'white',
                    padding: '14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="game-modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="game-modal">
            <button className="game-modal-close" onClick={() => setShowBudgetModal(false)}>
              <span style={{ fontSize: '24px' }}>×</span>
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">💰</div>
              <h3 className="game-modal-title">Budget Overview</h3>
            </div>

            <div className="budget-modal-content">
              <p className="modal-description">
                Review your budget settings in the Dashboard to adjust limits.
              </p>
              
              <button 
                className="game-submit-btn" 
                onClick={() => {
                  setShowBudgetModal(false);
                  handleNavigateToDashboard();
                }}
              >
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoalsModal && (
        <div className="game-modal-overlay" onClick={() => setShowGoalsModal(false)}>
          <div className="game-modal">
            <button className="game-modal-close" onClick={() => setShowGoalsModal(false)}>
              <span style={{ fontSize: '24px' }}>×</span>
            </button>
            <div className="game-modal-header">
              <div className="modal-mascot">🎯</div>
              <h3 className="game-modal-title">Savings Goals</h3>
            </div>

            <div className="goals-modal-content">
              <p className="modal-description">
                Create and manage your savings goals in the Dashboard!
              </p>
              
              <button 
                className="game-submit-btn" 
                onClick={() => {
                  setShowGoalsModal(false);
                  handleNavigateToDashboard();
                }}
              >
                <span>Create Goal in Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chart-mode-btn {
          padding: 10px 20px;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.73);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .chart-mode-btn.active {
          background: linear-gradient(135deg, #667eea, #ae8ad3ff);
          border-color: transparent;
          transform: scale(1.05);
        }

        .chart-mode-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-description {
          margin-bottom: 24px;
          color: #ffffffff;
          text-align: center;
        }

        .game-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #cd7bedff, #ebed89ff);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          fontWeight: 600;
          fontSize: 16px;
          transition: all 0.3s ease;
        }

        .game-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(234, 238, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Analytics;