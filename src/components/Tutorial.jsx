import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Tutorial = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [highlightEl, setHighlightEl] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const steps = [
    {
      target: null,
      title: 'Welcome to FinanceQuest! 🎉',
      description: 'Transform your financial journey into an exciting adventure! Let me show you around in just 2 minutes.',
      position: 'center'
    },
    {
      target: '.mascot-section',
      title: 'Your Finance Buddy 🎪',
      description: 'Meet your mascot! It evolves as you level up and reacts to your financial decisions.',
      position: 'bottom'
    },
    {
      target: '.level-display',
      title: 'Level & XP System ⭐',
      description: 'Earn XP by adding transactions and completing quests. Level up to unlock new avatars!',
      position: 'bottom'
    },
    {
      target: '.streak-badge',
      title: 'Daily Streak 🔥',
      description: 'Login daily and track transactions to maintain your streak. Longer streaks = more rewards!',
      position: 'bottom'
    },
    {
      target: '.coins-display',
      title: 'Coins System 💰',
      description: 'Earn coins from quests and staying within budget. Use them for special features!',
      position: 'bottom'
    },
    {
      target: '.analytics-nav-btn',
      title: 'Financial Analytics 📊',
      description: 'Click here to see your Financial Health Score, spending trends, and personalized insights!',
      position: 'bottom'
    },
    {
      target: '.quests-section',
      title: 'Daily Quests 🏆',
      description: 'Complete daily challenges to earn bonus XP and coins. New quests every day!',
      position: 'bottom'
    },
    {
      target: '.budget-section',
      title: 'Budget Tracker 💵',
      description: 'Set monthly limits for each category. Stay within budget to earn rewards!',
      position: 'bottom'
    },
    {
      target: '.goals-section',
      title: 'Savings Goals 🎯',
      description: 'Set goals like "New Laptop" or "Vacation". Track progress and celebrate achievements!',
      position: 'bottom'
    },
    {
      target: '.big-add-btn',
      title: 'Add Transactions ➕',
      description: 'Click here to add expenses or income. Our AI predicts categories automatically!',
      position: 'top'
    },
    {
      target: '.transactions-game',
      title: 'Transaction History 📝',
      description: 'View, edit, or delete your transactions. Track your financial journey here!',
      position: 'top'
    },
    {
      target: null,
      title: 'You\'re All Set! 🚀',
      description: 'Start your journey now! Track daily, complete quests, and become a Money Master!',
      position: 'center'
    }
  ];

  const currentStep = steps[step];

  // Main effect - handle step changes
  useEffect(() => {
    if (currentStep.target) {
      setIsScrolling(true);
      
      setTimeout(() => {
        const el = document.querySelector(currentStep.target);
        if (el) {
          const rect = el.getBoundingClientRect();
          const absoluteTop = rect.top + window.pageYOffset;
          const windowHeight = window.innerHeight;
          const tooltipHeight = 400;
          const padding = 100;
          
          let scrollTarget;
          
          if (currentStep.position === 'bottom') {
            // Tooltip below: scroll so element is near top with space for tooltip below
            scrollTarget = absoluteTop - padding;
          } else if (currentStep.position === 'top') {
            // Tooltip above: scroll so element is near bottom with space for tooltip above
            scrollTarget = absoluteTop - windowHeight + rect.height + tooltipHeight + padding;
          } else {
            // Center
            scrollTarget = absoluteTop - (windowHeight / 2) + (rect.height / 2);
          }
          
          scrollTarget = Math.max(0, scrollTarget);
          
          console.log('📜 Auto scrolling to:', scrollTarget);
          
          window.scrollTo({ 
            top: scrollTarget, 
            behavior: 'smooth' 
          });
          
          setTimeout(() => {
            setIsScrolling(false);
            updateHighlight();
          }, 800);
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateHighlight();
    }
  }, [step]);

  // Update highlight on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling && currentStep.target) {
        updateHighlight();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step, currentStep.target, isScrolling]);

  const updateHighlight = () => {
    if (currentStep.target) {
      const el = document.querySelector(currentStep.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setHighlightEl({
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset,
          width: rect.width,
          height: rect.height,
          viewportTop: rect.top,
          viewportLeft: rect.left
        });
      } else {
        setHighlightEl(null);
      }
    } else {
      setHighlightEl(null);
    }
  };

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const skip = () => {
    onSkip();
  };

  const getTooltipPos = () => {
    if (!highlightEl || currentStep.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100001
      };
    }

    const padding = 30;
    
    if (currentStep.position === 'bottom') {
      // Tooltip FIXED below element in viewport
      const topInViewport = highlightEl.viewportTop + highlightEl.height + padding;
      return {
        position: 'fixed',
        top: `${Math.min(topInViewport, window.innerHeight - 420)}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100001
      };
    } else {
      // Tooltip FIXED above element in viewport
      const bottomInViewport = window.innerHeight - highlightEl.viewportTop + padding;
      return {
        position: 'fixed',
        bottom: `${Math.max(bottomInViewport, 50)}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100001
      };
    }
  };

  return (
    <>
      <style>{`
        .tutorial-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99998;
          animation: fadeIn 0.3s;
          pointer-events: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .tutorial-spotlight {
          position: absolute;
          border: 5px solid #667eea;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 
            0 0 0 8px rgba(102, 126, 234, 0.4),
            0 0 0 99999px rgba(0, 0, 0, 0.5),
            0 0 150px 40px rgba(102, 126, 234, 1),
            inset 0 0 40px rgba(255, 255, 255, 0.2);
          z-index: 99999;
          pointer-events: none;
          animation: spotlight-pulse 2s infinite;
          transition: all 0.15s ease-out;
        }

        @keyframes spotlight-pulse {
          0%, 100% {
            box-shadow: 
              0 0 0 8px rgba(102, 126, 234, 0.4),
              0 0 0 99999px rgba(0, 0, 0, 0.5),
              0 0 150px 40px rgba(102, 126, 234, 1),
              inset 0 0 40px rgba(255, 255, 255, 0.2);
            border-color: #667eea;
          }
          50% {
            box-shadow: 
              0 0 0 12px rgba(102, 126, 234, 0.6),
              0 0 0 99999px rgba(0, 0, 0, 0.5),
              0 0 200px 60px rgba(102, 126, 234, 1),
              inset 0 0 60px rgba(255, 255, 255, 0.3);
            border-color: #98b3ff;
          }
        }

        .tutorial-tooltip {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 32px;
          max-width: 480px;
          width: 90%;
          box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          animation: tooltip-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transition: all 0.15s ease-out;
          overflow: hidden;
          pointer-events: auto;
        }

        @keyframes tooltip-appear {
          from {
            opacity: 0;
            transform: scale(0.85) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: scale(1) translateX(-50%);
          }
        }

        .tutorial-tooltip::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .tutorial-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .tutorial-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg) scale(1.1);
        }

        .tutorial-header {
          display: flex;
          gap: 16px;
          align-items: start;
          margin-bottom: 22px;
          position: relative;
        }

        .tutorial-icon {
          font-size: 56px;
          animation: icon-bounce 2s ease-in-out infinite;
          flex-shrink: 0;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }

        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }

        .tutorial-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0 0 6px 0;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
          line-height: 1.2;
        }

        .tutorial-step-count {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .tutorial-desc {
          color: rgba(255, 255, 255, 0.95);
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 28px;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
        }

        .tutorial-progress {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .progress-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .progress-dot.active {
          background: white;
          transform: scale(1.5);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.9);
        }

        .tutorial-actions {
          display: flex;
          gap: 12px;
        }

        .tutorial-btn {
          flex: 1;
          padding: 16px 20px;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          font-family: inherit;
        }

        .btn-prev {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .btn-prev:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .btn-prev:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-next {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 24px rgba(245, 87, 108, 0.5);
        }

        .btn-next:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(245, 87, 108, 0.7);
        }

        .skip-btn {
          position: fixed;
          top: 100px;
          right: 28px;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          z-index: 100002;
          transition: all 0.3s ease;
          font-size: 15px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .skip-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .tutorial-tooltip {
            padding: 28px 24px;
            max-width: 92%;
          }

          .tutorial-icon {
            font-size: 44px;
          }

          .tutorial-title {
            font-size: 20px;
          }

          .tutorial-desc {
            font-size: 15px;
          }

          .tutorial-btn {
            padding: 14px 16px;
            font-size: 15px;
          }

          .skip-btn {
            top: 85px;
            right: 16px;
            padding: 12px 22px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="tutorial-overlay" />

      {highlightEl && (
        <div
          className="tutorial-spotlight"
          style={{
            top: `${highlightEl.top - 12}px`,
            left: `${highlightEl.left - 12}px`,
            width: `${highlightEl.width + 24}px`,
            height: `${highlightEl.height + 24}px`
          }}
        />
      )}

      <button className="skip-btn" onClick={skip}>
        Skip Tutorial ⏭️
      </button>

      <div className="tutorial-tooltip" style={getTooltipPos()}>
        <button className="tutorial-close" onClick={skip}>
          <X size={20} />
        </button>

        <div className="tutorial-header">
          <div className="tutorial-icon">
            {step === 0 && '🎉'}
            {step === 1 && '🎪'}
            {step === 2 && '⭐'}
            {step === 3 && '🔥'}
            {step === 4 && '💰'}
            {step === 5 && '📊'}
            {step === 6 && '🏆'}
            {step === 7 && '💵'}
            {step === 8 && '🎯'}
            {step === 9 && '➕'}
            {step === 10 && '📝'}
            {step === 11 && '🚀'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="tutorial-title">{currentStep.title}</h3>
            <div className="tutorial-step-count">
              Step {step + 1} of {steps.length}
            </div>
          </div>
        </div>

        <p className="tutorial-desc">{currentStep.description}</p>

        <div className="tutorial-progress">
          {steps.map((_, i) => (
            <div key={i} className={`progress-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        <div className="tutorial-actions">
          <button className="tutorial-btn btn-prev" onClick={prev} disabled={step === 0}>
            ← Back
          </button>
          <button className="tutorial-btn btn-next" onClick={next}>
            {step === steps.length - 1 ? 'Start! ✨' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Tutorial;