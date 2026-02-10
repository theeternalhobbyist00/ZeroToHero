import React from 'react';

// We accept 'rankings' (the list) and 'playerRank' (your position) as props
const Leaderboard = ({ rankings, playerRank, isLoading }) => {
  
  // 1. Handle the loading state while the backend is thinking
  if (isLoading) {
    return (
      <div className="leaderboard-container">
        <h2 className="arena-title">LEADERBOARD</h2>
        <div className="loading-spinner">FETCHING RANKINGS...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <h2 className="arena-title">LEADERBOARD</h2>
      
      {/* 2. Show the player's real rank from the DB */}
      <div className="player-rank-card">
        <span>YOUR RANK: <strong>#{playerRank || "Unranked"}</strong></span>
      </div>

      <div className="rank-list">
        <div className="rank-header">
          <span>RANK</span>
          <span>NAME</span>
          <span>POWER</span>
        </div>

        {/* 3. Map through the live data from the backend */}
        {rankings && rankings.length > 0 ? (
          rankings.map((user, index) => (
            <div key={index} className="rank-item">
              <span className="rank-num">{user.rank}</span>
              <span className="rank-name">{user.username}</span>
              <span className="rank-power">{user.power.toLocaleString()}</span>
            </div>
          ))
        ) : (
          <div className="no-data">No rankings found.</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;