import React, { useState } from 'react';

const Shop = ({ userData, onPurchase }) => {
  const [currencyTab, setCurrencyTab] = useState('stars');

  const shopItems = [
    { id: 'hp_potion_lg', name: 'Large Health Potion', stars: 50, ton: 0.1, icon: '🧪' },
    { id: 'sta_potion_lg', name: 'Large Stamina Potion', stars: 50, ton: 0.1, icon: '⚡' },
    { id: 'tourney_ticket', name: 'Tournament Ticket', stars: 100, ton: 0.2, icon: '🎫' },
    { id: 'premium_recruit', name: 'Premium Recruitment Scroll', stars: 500, ton: 1.0, icon: '📜' },
    { id: 'premium_explore', name: 'Premium Exploration Scroll', stars: 200, ton: 0.4, icon: '🧭' },
  ];

  return (
    <div className="shop-container">
      <h2 className="arena-title">MARKETPLACE</h2>

      {/* TABS SECTION */}
      <div className="shop-tabs">
        <button 
          className={`tab-btn ${currencyTab === 'stars' ? 'active' : ''}`}
          onClick={() => setCurrencyTab('stars')}
        >
          ⭐ STARS
        </button>
        <button 
          className={`tab-btn ${currencyTab === 'ton' ? 'active' : ''}`}
          onClick={() => setCurrencyTab('ton')}
        >
          💎 TON
        </button>
      </div>

      {/* ITEMS LIST */}
      <div className="shop-items-grid">
        {shopItems.map((item) => (
          <div key={item.id} className="shop-item-card">
            <div className="item-icon">{item.icon}</div>
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <button 
                className="purchase-btn"
                onClick={() => onPurchase(item.id, currencyTab)}
              >
                Buy for {currencyTab === 'stars' ? `${item.stars} ⭐` : `${item.ton} TON`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;