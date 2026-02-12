import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct

const Exploration = ({ userData, onStart, onClaim }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (userData?.exploration_end_time) {
        const remaining = Math.max(0, new Date(userData.exploration_end_time) - new Date());
        setTimeLeft(Math.floor(remaining / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [userData?.exploration_end_time]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('exploration_logs')
        .select('item_name, created_at')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error("Error fetching logs:", err.message);
    }
  };

  const internalClaim = async () => {
    const result = await onClaim(); 
    // result returns { success: bool, name: string } from App.jsx
    if (result?.success) {
      // Re-fetch logs from DB immediately after claiming to show the new result
      fetchLogs();
    }
  };

  return (
    <div className="exploration-view-wrapper">
      {showLogs ? (
        <div className="logs-container">
          <h3>RECENT EXPEDITIONS</h3>
          <div className="logs-list">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className="log-item">
                <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className={log.item_name === "Nothing" ? "log-empty" : "log-gain"}>
                  {log.item_name}
                </span>
              </div>
            )) : <p>No records found.</p>}
          </div>
          <button className="close-logs-btn" onClick={() => setShowLogs(false)}>BACK</button>
        </div>
      ) : (
        <>
          {!userData?.exploration_end_time ? (
            <div className="exploration-button-stack">
              <button className="exp-btn short" onClick={() => onStart('basic')}>
                Short Exploration
              </button>
              <button className="exp-btn long" onClick={() => onStart('premium')}>
                Long Exploration
              </button>
              <button className="view-logs-btn" onClick={() => { fetchLogs(); setShowLogs(true); }}>
                📜 View Logs
              </button>
            </div>
          ) : (
            <div className="exploration-timer-stack">
              {timeLeft > 0 ? (
                <div className="timer-countdown">{formatTime(timeLeft)}</div>
              ) : (
                <button className="exp-claim-btn" onClick={internalClaim}>
                  CLAIM REWARDS
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Exploration;