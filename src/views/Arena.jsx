import React, { useState, useEffect } from 'react';

const Arena = ({ tournamentData, userData, onStartTraining, onSkipTraining }) => {
  // --- STATE SECTION ---
  const [view, setView] = useState('menu'); 
  const [progress, setProgress] = useState(0);
  const [ticketCount, setTicketCount] = useState(0); 
  const [timeLeft, setTimeLeft] = useState('04:00:00');
  
  // States for selection flow
  const [selectedMerc, setSelectedMerc] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);

  // --- BACKEND TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (userData?.isTraining && userData?.trainingEndsAt) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(userData.trainingEndsAt).getTime();
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
  }, [userData]);

  // --- PVP SEARCHING LOGIC ---
  useEffect(() => {
    let interval;
    if (view === 'searching' && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 50);
    } else if (progress >= 100) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [view, progress]);

  // --- AUTOMATIC VIEW REDIRECT ---
  useEffect(() => {
    if (userData?.isTraining) {
      setView('training-timer');
    }
  }, [userData?.isTraining]);

  // --- TOURNAMENT DATA ---
  const leftSide = tournamentData?.left || ["Player 1", "Player 2", "Player 3", "Player 4"];
  const rightSide = tournamentData?.right || ["Player 5", "Player 6", "Player 7", "Player 8"];

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

  // --- VIEW: TOURNAMENT TICKET CHECK ---
  if (view === 'ticket-check') {
    return (
      <div className="arena-content-view">
        <h2 className="loading-text">TOURNAMENT ENTRY</h2>
        <div className="item-request-box">
          <p>Tickets: {ticketCount}</p>
          <p>You need 1x 🎫 <strong>Tournament Ticket</strong> to enter.</p>
        </div>
        <div className="action-row">
          <button className="confirm-btn" onClick={() => {
              if (ticketCount > 0) {
                setTicketCount(ticketCount - 1);
                setView('bracket');
              } else {
                alert("You don't have enough tickets!");
              }
            }}>
            USE TICKET
          </button>
          <button className="cancel-btn" onClick={() => setView('menu')}>BACK</button>
        </div>
      </div>
    );
  }

  // --- VIEW: TOURNAMENT BRACKET ---
  if (view === 'bracket') {
    return (
      <div className="arena-content-view bracket-view">
        <h2 className="arena-title">TOURNAMENT</h2>
        <div className="bracket-wrapper">
          <div className="bracket-side left">
            <div className="round round-1">
              {leftSide.map((p, i) => <div key={i} className="bracket-slot">{p}</div>)}
            </div>
            <div className="round round-2">
              <div className="bracket-slot empty"></div>
              <div className="bracket-slot empty"></div>
            </div>
          </div>
          <div className="bracket-center">
            <div className="bracket-slot final">FINAL</div>
          </div>
          <div className="bracket-side right">
            <div className="round round-2">
              <div className="bracket-slot empty"></div>
              <div className="bracket-slot empty"></div>
            </div>
            <div className="round round-1">
              {rightSide.map((p, i) => <div key={i} className="bracket-slot">{p}</div>)}
            </div>
          </div>
        </div>
        <button className="cancel-btn" onClick={() => setView('menu')}>LEAVE</button>
      </div>
    );
  }

  // --- [FIXED] VIEW: TRAINING MERCENARY SELECTION ---
  if (view === 'training-merc-select') {
    const idleMercs = userData?.mercenaries?.filter(m => m.status === 'idle') || [];

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
                {merc.name} (Lv.{merc.level})
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

  // --- [FIXED] VIEW: TRAINING MENU ---
  if (view === 'training-menu') {
    return (
      <div className="arena-content-view">
        <h2 className="arena-title">TRAIN {selectedMerc?.name.toUpperCase()}</h2>
        <div className="arena-menu">
          {['Strength', 'Agility', 'Dexterity'].map(stat => (
            <button key={stat} className="arena-menu-btn" onClick={() => {
              setSelectedStat(stat);
              // Passing both Mercenary ID and Stat to backend
              if (onStartTraining) onStartTraining(selectedMerc.id, stat);
            }}>
              <span className="btn-label">{stat}</span>
            </button>
          ))}
        </div>
        <button className="cancel-btn" onClick={() => setView('training-merc-select')}>BACK</button>
      </div>
    );
  }

  // --- VIEW: TRAINING TIMER ---
  if (view === 'training-timer') {
    return (
      <div className="arena-content-view">
        <h2 className="loading-text">TRAINING {userData?.trainingStat?.toUpperCase() || selectedStat?.toUpperCase()}...</h2>
        <div className="timer-box">
          <p className="timer-display">{timeLeft}</p>
          <p className="status-note">Mercenary is locked in backend until finished.</p>
        </div>
        <button className="confirm-btn ad-btn" onClick={onSkipTraining}>
          SKIP (WATCH AD)
        </button>
        <button className="cancel-btn" onClick={() => setView('menu')}>EXIT ARENA</button>
      </div>
    );
  }

  // --- [FIXED] VIEW: MAIN ARENA MENU ---
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

        {/* Linked to merc selection first */}
        <button className="arena-menu-btn" onClick={() => setView('training-merc-select')}>
          <span className="btn-icon">🛡️</span>
          <span className="btn-label">Training</span>
        </button>
      </div>
    </div>
  );
};

export default Arena;