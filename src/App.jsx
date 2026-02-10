import React, { useState, useEffect } from 'react';
import './App.css';
// [NEW] TonConnect UI Hook
import { useTonConnectUI } from '@tonconnect/ui-react';
import Arena from './views/Arena';
import Exploration from './views/Exploration';
import Shop from './views/Shop';
import Leaderboard from './views/Leaderboard';
import Mercenaries from './views/Mercenaries'; 

function App() {
  const [activeTab, setActiveTab] = useState(null);

  // --- [1. STATE: MASTER DATA] ---
  const [userData, setUserData] = useState(null); 
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- [NEW: TONCONNECT INITIALIZATION] ---
  const [tonConnectUI] = useTonConnectUI();

  // --- [2. LOGIC: INITIAL FETCH] ---
  useEffect(() => {
    const loadGameData = async () => {
      setLoading(true);
      try {
        console.log("System: Fetching profile and mercenary data...");
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGameData();
  }, []);

  // --- [3. LOGIC: ARENA HANDLERS] ---
  const handleStartTraining = async (mercId, stat) => {
    console.log(`API CALL: Start Training for Merc ${mercId} in ${stat}`);
  };

  const handleSkipTraining = async () => {
    console.log("API CALL: Skip training via Ad Verification");
  };

  // --- [4. LOGIC: MERCENARY HANDLERS] ---
  const handleSetActiveMercenary = async (mercId) => {
    console.log(`API CALL: Setting Active Unit to ${mercId}`);
  };

  // --- [5. LOGIC: EXPLORATION HANDLERS] ---
  const handleStartExploration = async (mercId, ticketType) => {
    console.log(`API CALL: Deploying ${mercId} with ${ticketType} scroll`);
  };

  const handleInstantFinishExploration = async () => {
    console.log("AD LOGIC: Triggering full-screen video ad...");
  };

  const handleClaimExplorationRewards = async () => {
    console.log("API CALL: Claiming loot and freeing mercenary...");
  };

  // --- [6. LOGIC: SHOP & TON HANDLERS] ---
  const handlePurchase = async (itemId, currencyType) => {
    console.log(`Attempting purchase: ${itemId} via ${currencyType}`);

    if (currencyType === 'ton') {
      // Define prices in TON (Match these with your Shop.jsx list)
      const prices = {
        'hp_potion_lg': '100000000',    // 0.1 TON
        'sta_potion_lg': '100000000',   // 0.1 TON
        'tourney_ticket': '200000000',  // 0.2 TON
        'premium_recruit': '1000000000', // 1.0 TON
        'premium_explore': '400000000'   // 0.4 TON
      };

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 seconds
        messages: [
          {
            address: "YOUR_RECEIVING_WALLET_ADDRESS", // REPLACE WITH YOUR WALLET
            amount: prices[itemId] || '100000000', 
          }
        ]
      };

      try {
        const result = await tonConnectUI.sendTransaction(transaction);
        console.log("TON transaction success:", result);
        // Backend: Verify transaction hash result.boc
      } catch (e) {
        console.error("TON transaction failed:", e);
      }
    } else {
      // Stars Logic (In-game currency)
      console.log(`STARS: Processing in-game purchase for ${itemId}`);
    }
  };

  return (
    <div className="game-wrapper">
      <div className="header-section">
        <div className="top-row">
          <div className="profile-btn"><div className="shield-icon">🛡️</div></div>
          <div className="menu-btn"><div className="hamburger">≡</div></div>
        </div>
        <div className="announcement-row">
          <div className="rolling-box"><div className="marquee-text">SERVER UNDER CONSTRUCTION!!</div></div>
        </div>
      </div>

      {activeTab && (
        <div className="screen-overlay" onClick={() => setActiveTab(null)}>
          <div className={`overlay-content ${activeTab}-bg`} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveTab(null)}>✕</button>
            <div className="overlay-body">
              
              {activeTab === 'arena' && (
                <Arena 
                  userData={userData} 
                  onStartTraining={handleStartTraining}
                  onSkipTraining={handleSkipTraining}
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard 
                  rankings={rankings} 
                  playerRank={userData?.rank} 
                  isLoading={loading} 
                />
              )}

              {activeTab === 'mercenaries' && (
                <Mercenaries 
                  list={userData?.mercenaries || []} 
                  activeId={userData?.activeMercenaryId}
                  onSelect={handleSetActiveMercenary}
                />
              )}

              {activeTab === 'exploration' && (
                <Exploration 
                  userData={userData} 
                  onStartExploration={handleStartExploration} 
                  onInstantFinish={handleInstantFinishExploration}
                  onClaimRewards={handleClaimExplorationRewards}
                />
              )}

              {activeTab === 'shop' && (
                <Shop 
                  userData={userData} 
                  onPurchase={handlePurchase} 
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="footer-section">
        <div className="side-btns-row">
          <div className="icon-unit" onClick={() => setActiveTab('leaderboard')}>
            <span className="emoji">⭐</span>
            <label>Leaderboard</label>
          </div>
          <div className="icon-unit" onClick={() => setActiveTab('mercenaries')}>
            <span className="emoji">👥</span>
            <label>Mercenaries</label>
          </div>
        </div>

        <div className="main-nav-row">
            <button onClick={() => setActiveTab('arena')}>Arena</button>
            <button onClick={() => setActiveTab('exploration')}>Exploration</button>
            <button onClick={() => setActiveTab('shop')}>Shop</button>
        </div>
      </div>
    </div>
  );
}

export default App;