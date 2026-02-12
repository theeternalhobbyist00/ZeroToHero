import React, { useState, useEffect } from 'react';

const Arena = ({ tournamentData, userData, onStartTraining, onSkipTraining, onCompleteTraining, onUseTicket }) => {
  // --- STATE SECTION ---
  const [view, setView] = useState('menu'); 
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('04:00:00');
  
  // States for selection flow
  const [selectedMerc, setSelectedMerc] = useState(null);

  // --- CONFIGURATION ---
  const dustCosts = { D: 10, C: 15, B: 20, A: 25, S: 30 };

  // --- BACKEND TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (userData?.is_training && userData?.training_ends_at) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(userData.training_ends_at).getTime();
        const distance = end - now;

        if (distance <= 0) {
          clearInterval(interval);
          setTimeLeft("00:00:00");
        } else {
          const h = Math.floor(distance / (1000 * 60 * 60));
          const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [userData?.is_training, userData?.training_ends_at]);

  // --- AUTOMATIC VIEW REDIRECT ---
  useEffect(() => {
    if (userData?.is_training) {
      setView('training-timer');
    }
  }, [userData?.is_training]);

  // --- VIEW: PVP SEARCHING ---
  if (view === 'searching') {
    return (
      <div className="matchmaking-container">
        <h2 className="loading-text">SEARCHING FOR OPPONENT...</h2>
        <button className="cancel-btn" onClick={() => { setView('menu'); setProgress(0); }}>
          CANCEL
        </button>
      </div>
    );
  }

  // --- VIEW: TRAINING MERCENARY SELECTION ---
  if (view === 'training-merc-select') {
    const idleMercs = userData?.mercenaries?.filter(m => !m.status || m.status === 'idle') || [];

    return (
      <div className="arena-content-view">
        <h2 className="arena-title">CHOOSE MERCENARY</h2>
        <div className="merc-selection-list">
          {idleMercs.length > 0 ? (
            idleMercs.map(merc => (
              <button 
                key={merc.id} 
                className="arena-menu-btn" 
                onClick={() => {
                  setSelectedMerc(merc); 
                  setView('training-menu'); 
                }}
              >
                {merc.name} (Rank {merc.rarity})
              </button>
            ))
          ) : (
            <p className="status-note">No idle mercenaries available.</p>
          )}
        </div>
        <button className="cancel-btn" onClick={() => setView('menu')}>BACK</button>
      </div>
    );
  }

  // --- VIEW: TRAINING MENU (WITH DUST COSTS) ---
  if (view === 'training-menu') {
    const requiredDust = dustCosts[selectedMerc?.rarity] || 10;
    const currentDust = userData?.inventory?.filter(i => i.name === "Training Dust").length || 0;
    const hasEnoughDust = currentDust >= requiredDust;

    return (
      <div className="arena-content-view">
        <h2 className="arena-title">TRAIN {selectedMerc?.name.toUpperCase()}</h2>
        
        <div className="resource-bar-simple">
          <p>Dust: <span className={hasEnoughDust ? 'text-green' : 'text-red'}>{currentDust}/{requiredDust}</span></p>
          <p>Stamina: {userData.stamina}/20</p>
        </div>

        <div className="arena-menu">
          {['Strength', 'Agility', 'Dexterity'].map(stat => (
            <button 
              key={stat} 
              className="arena-menu-btn training-btn" 
              disabled={!hasEnoughDust || userData.stamina < 5}
              onClick={() => onStartTraining(selectedMerc.id, stat)}
            >
              <span className="btn-label">Train {stat}</span>
              <span className="btn-subtext">-{requiredDust} Dust | -5 ⚡</span>
            </button>
          ))}
        </div>
        <button className="cancel-btn" onClick={() => setView('training-merc-select')}>BACK</button>
      </div>
    );
  }

  // --- VIEW: TRAINING TIMER ---
  if (view === 'training-timer') {
    const isFinished = timeLeft === "00:00:00";

    return (
      <div className="arena-content-view">
        <h2 className="loading-text">
          {isFinished ? "TRAINING COMPLETE!" : "TRAINING IN PROGRESS..."}
        </h2>
        
        <div className="timer-box">
          <p className="timer-display">{timeLeft}</p>
        </div>

        <div className="action-row">
          {isFinished ? (
            <button className="confirm-btn" onClick={onCompleteTraining}>
              CLAIM & FINISH
            </button>
          ) : (
            <button className="confirm-btn ad-btn" onClick={onSkipTraining}>
              SKIP (WATCH AD) 📺
            </button>
          )}
        </div>
        <button className="cancel-btn" onClick={() => setView('menu')}>EXIT ARENA</button>
      </div>
    );
  }

  // --- MAIN ARENA MENU ---
  return (
    <div className="arena-container">
      <h2 className="arena-title">ARENA</h2>
      <div className="arena-menu">
        <button className="arena-menu-btn" onClick={() => setView('searching')}>
          <span className="btn-icon">⚔️</span>
          <span className="btn-label">PVP</span>
        </button>
        <button className="arena-menu-btn" onClick={() => setView('ticket-check')}>
          <span className="btn-icon">🏆</span>
          <span className="btn-label">Tournament</span>
        </button>
        <button className="arena-menu-btn" onClick={() => setView('training-merc-select')}>
          <span className="btn-icon">🛡️</span>
          <span className="btn-label">Training</span>
        </button>
      </div>
    </div>
  );
};

export default Arena;