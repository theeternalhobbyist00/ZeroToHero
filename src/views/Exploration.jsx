import React, { useState, useEffect } from 'react';

const Exploration = ({ userData, onStartExploration, onInstantFinish, onClaimRewards }) => {
  const [view, setView] = useState('merc-select');
  const [selectedMerc, setSelectedMerc] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // --- TIMER & AUTO-REDIRECT LOGIC ---
  useEffect(() => {
    let interval;
    if (userData?.isExploring && userData?.explorationEndsAt) {
      setView('timer');
      interval = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(userData.explorationEndsAt).getTime();
        const distance = end - now;

        if (distance <= 0) {
          clearInterval(interval);
          setTimeLeft("00:00");
          setIsComplete(true);
        } else {
          setIsComplete(false);
          const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [userData]);

  // --- VIEW: MERC SELECTION ---
  if (view === 'merc-select') {
    const idleMercs = userData?.mercenaries?.filter(m => m.status === 'idle') || [];
    return (
      <div className="arena-content-view">
        <h2 className="arena-title">EXPLORATION</h2>
        <div className="merc-selection-list">
          {idleMercs.map(merc => (
            <button key={merc.id} className="arena-menu-btn" onClick={() => {
              setSelectedMerc(merc);
              setView('ticket-select');
            }}>
              {merc.name} (Lv.{merc.level})
            </button>
          ))}
          {idleMercs.length === 0 && <p className="status-note">All mercenaries are busy.</p>}
        </div>
      </div>
    );
  }

  // --- VIEW: TICKET SELECTION ---
  if (view === 'ticket-select') {
    return (
      <div className="arena-content-view">
        <h2 className="arena-title">SELECT SCROLL</h2>
        <div className="arena-menu">
          <button className="arena-menu-btn" onClick={() => onStartExploration(selectedMerc.id, 'basic')}>
            Basic Scroll (10m)
          </button>
          <button className="arena-menu-btn" onClick={() => onStartExploration(selectedMerc.id, 'premium')}>
            Premium Scroll (20m)
          </button>
        </div>
        <button className="cancel-btn" onClick={() => setView('merc-select')}>BACK</button>
      </div>
    );
  }

  // --- VIEW: TIMER / INSTANT FINISH / CLAIM ---
  if (view === 'timer') {
    return (
      <div className="arena-content-view">
        <h2 className="loading-text">{isComplete ? "MISSION COMPLETE" : "EXPLORING..."}</h2>
        <div className="timer-box">
          <p className="timer-display">{timeLeft}</p>
        </div>

        <div className="action-column" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {isComplete ? (
            <button className="confirm-btn claim-animation" onClick={onClaimRewards}>
              CLAIM REWARDS
            </button>
          ) : (
            <button className="confirm-btn ad-btn" onClick={onInstantFinish}>
              INSTANT FINISH (WATCH AD)
            </button>
          )}
          <button className="cancel-btn" onClick={() => setView('menu')}>EXIT</button>
        </div>
      </div>
    );
  }

  return null;
};

export default Exploration;