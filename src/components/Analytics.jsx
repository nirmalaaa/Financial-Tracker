import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle, Zap, Target, PieChart, BarChart3, ArrowLeft, Lightbulb, Trophy, Star, Award, DollarSign, Wallet, ShieldAlert, Flame, Gift, Sparkles, Heart, BadgeCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Analytics.css';

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state
  const data = location.state || {
    transactions: [],
    budgets: {},
    level: 1,
    xp: 0,
    coins: 100,
    streak: 3,
    hearts: 5
  };

  const [transactions] = useState(data.transactions || []);
  const [budgets] = useState(data.budgets || {});
  const [level] = useState(data.level || 1);
  const [xp] = useState(data.xp || 0);
  const [coins] = useState(data.coins || 100);
  const [streak] = useState(data.streak || 3);
  const [hearts] = useState(data.hearts || 5);

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
  const [monthlyData, setMonthlyData] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

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

  // Calculate Financial Health Score
  useEffect(() => {
    calculateHealthScore();
    calculateInsights();
  }, [transactions, budgets]);

  const calculateHealthScore = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthTx = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const totalIncome = thisMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = thisMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Factor 1: Budget Adherence (30 points)
    let budgetScore = 0;
    const totalBudget = Object.values(budgets).reduce((sum, b) => sum + (b.limit || 0), 0);
    const totalSpent = Object.values(budgets).reduce((sum, b) => sum + (b.spent || 0), 0);
    if (totalBudget > 0) {
      const adherence = 1 - (totalSpent / totalBudget);
      budgetScore = Math.max(0, Math.min(30, adherence * 30 + 15));
    }

    // Factor 2: Savings Rate (30 points)
    let savingsScore = 0;
    if (totalIncome > 0) {
      const savingsRate = (totalIncome - totalExpense) / totalIncome;
      savingsScore = Math.max(0, Math.min(30, savingsRate * 50));
    }

    // Factor 3: Spending Consistency (20 points)
    const dailySpending = calculateDailySpending(thisMonthTx);
    const consistency = calculateConsistency(dailySpending);
    const consistencyScore = consistency * 20;

    // Factor 4: Emergency Fund / Level Progress (20 points)
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
        daily[date] = (daily[date] || 0) + t.amount;
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

    // Calculate category spending
    const categorySpending = {};
    thisMonthTx.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    // Find top category
    const top = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    if (top) {
      setTopCategory({ name: top[0], amount: top[1] });
    }

    // Calculate monthly trend
    const lastMonthTx = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth - 1 && date.getFullYear() === thisYear && t.type === 'expense';
    });

    const thisMonthTotal = thisMonthTx.reduce((sum, t) => sum + t.amount, 0);
    const lastMonthTotal = lastMonthTx.reduce((sum, t) => sum + t.amount, 0);

    if (lastMonthTotal > 0) {
      const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      if (change > 10) setSpendingTrend('increasing');
      else if (change < -10) setSpendingTrend('decreasing');
      else setSpendingTrend('stable');
    }

    // Generate insights
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
      const totalSpent = thisMonthTx.reduce((sum, t) => sum + t.amount, 0);
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

    // Calculate monthly data for chart
    const monthly = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const date = new Date(t.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthly[monthYear] = (monthly[monthYear] || 0) + t.amount;
      }
    });

    const sortedMonths = Object.entries(monthly)
      .sort((a, b) => {
        const [aMonth, aYear] = a[0].split('/');
        const [bMonth, bYear] = b[0].split('/');
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      })
      .slice(-6);

    setMonthlyData(sortedMonths);
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

  const handleLogout = () => {
    navigate('/');
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

  return (
    <div className="analytics-container">
      {/* Top Bar - Same as Dashboard */}
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
          <button className="logout-btn-top" onClick={handleLogout}>
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

        {/* Spending Chart */}
        <div className="chart-section">
          <h2 className="section-title">
            <BarChart3 size={24} />
            Monthly Spending Trend
          </h2>
          <div className="chart-card">
            {monthlyData.length > 0 ? (
              <div className="simple-chart">
                {monthlyData.map(([month, amount]) => {
                  const maxAmount = Math.max(...monthlyData.map(m => m[1]));
                  const height = (amount / maxAmount) * 100;
                  return (
                    <div key={month} className="chart-bar-wrapper">
                      <div className="chart-bar" style={{ height: `${height}%` }}>
                        <div className="chart-value">
                          Rp {(amount / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="chart-label">{month}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="chart-empty">
                <div className="empty-icon">📊</div>
                <p>No spending data yet. Start tracking to see your trends!</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Category */}
        {topCategory && (
          <div className="top-category-section">
            <h2 className="section-title">
              <PieChart size={24} />
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

      {/* Modals */}
      {showBudgetModal && (
        <div className="game-modal-overlay" onClick={(e) => e.target.className === 'game-modal-overlay' && setShowBudgetModal(false)}>
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

      {showGoalsModal && (
        <div className="game-modal-overlay" onClick={(e) => e.target.className === 'game-modal-overlay' && setShowGoalsModal(false)}>
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
    </div>
  );
};

export default Analytics;