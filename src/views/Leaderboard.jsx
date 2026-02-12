import React from 'react';

const Leaderboard = ({ rankings, playerRank, isLoading, seasonPrize, onLoadMore }) => {
  
  // Calculate reward based on your specific percentage scheme
  const calculateReward = (rank, totalPool) => {
    if (!totalPool || !rank || rank > 1500) return "0.000";
    
    let sharePercentage = 0;
    let playersInBracket = 1;

    if (rank === 1) sharePercentage = 0.15;
    else if (rank === 2) sharePercentage = 0.10;
    else if (rank === 3) sharePercentage = 0.05;
    else if (rank <= 10) { sharePercentage = 0.10; playersInBracket = 7; }
    else if (rank <= 20) { sharePercentage = 0.07; playersInBracket = 10; }
    else if (rank <= 50) { sharePercentage = 0.08; playersInBracket = 30; }
    else if (rank <= 70) { sharePercentage = 0.05; playersInBracket = 20; }
    else if (rank <= 100) { sharePercentage = 0.05; playersInBracket = 30; }
    else if (rank <= 150) { sharePercentage = 0.05; playersInBracket = 50; }
    else if (rank <= 300) { sharePercentage = 0.05; playersInBracket = 150; }
    else if (rank <= 400) { sharePercentage = 0.05; playersInBracket = 100; }
    else if (rank <= 600) { sharePercentage = 0.05; playersInBracket = 200; }
    else if (rank <= 800) { sharePercentage = 0.05; playersInBracket = 200; }
    else if (rank <= 1100) { sharePercentage = 0.05; playersInBracket = 300; }
    else if (rank <= 1500) { sharePercentage = 0.05; playersInBracket = 400; }

    const individualReward = (totalPool * sharePercentage) / playersInBracket;
    return individualReward.toFixed(3);
  };

  return (
    <div className="leaderboard-container">
      <h2 className="arena-title">LEADERBOARD</h2>
      
      <div className="player-rank-card">
        <div className="rank-info-main">
          <span>YOUR RANK: <strong>#{playerRank || "Unranked"}</strong></span>
          <span className="estimated-reward">
            Est. Reward: {playerRank ? calculateReward(playerRank, seasonPrize) : "0.000"} TON
          </span>
        </div>
      </div>

      <div className="rank-list">
        <div className="rank-header">
          <span>RANK</span>
          <span>NAME</span>
          <span>REWARD</span>
        </div>

        {rankings && rankings.length > 0 ? (
          <>
            {rankings.map((user, index) => (
              <div key={index} className="rank-item">
                <span className="rank-num">{user.rank}</span>
                <span className="rank-name">{user.username}</span>
                <span className="rank-reward">
                  {calculateReward(user.rank, seasonPrize)} TON
                </span>
              </div>
            ))}
            
            {/* 1. LOAD MORE BUTTON LOGIC */}
            {rankings.length < 1500 && (
              <button 
                className="load-more-btn" 
                onClick={onLoadMore} 
                disabled={isLoading}
              >
                {isLoading ? "FETCHING..." : "LOAD MORE"}
              </button>
            )}
          </>
        ) : (
          isLoading ? (
            <div className="loading-spinner">FETCHING RANKINGS...</div>
          ) : (
            <div className="no-data">No rankings found.</div>
          )
        )}
      </div>
    </div>
  );
};

export default Leaderboard;