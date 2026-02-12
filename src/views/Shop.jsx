import React, { useState } from 'react';

const Shop = ({ userData, onPurchase }) => {
  const [currencyTab, setCurrencyTab] = useState('stars');

  // Updated shopItems with image paths
  const shopItems = [
    { 
      id: 'hp_potion_lg', 
      name: 'Large Health Potion', 
      stars: 50, 
      ton: 0.005, 
      image: '/Large_HP_Potion.png' 
    },
    { 
      id: 'sta_potion_lg', 
      name: 'Stamina Potion', 
      stars: 50, 
      ton: 0.005, 
      image: '/Stamina_Potion.png' 
    },
    { 
      id: 'tourney_ticket', 
      name: 'Tournament Ticket', 
      stars: 100, 
      ton: 0.01, 
      image: '/tourney.png'
    },
    { 
      id: 'premium_recruit', 
      name: 'Premium Recruitment Scroll', 
      stars: 500, 
      ton: 0.5, 
      image: '/premium_rec_scroll.png' 
    },
    { 
      id: 'premium_explore', 
      name: 'Premium Exploration Scroll', 
      stars: 200, 
      ton: 0.2, 
      image: '/premium_exploration_scroll.png' 
    },
  ];

  return (
    <div className="shop-container">
      <h2 className="arena-title">MARKETPLACE</h2>

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

      <div className="shop-items-grid">
        {shopItems.map((item) => (
          <div key={item.id} className="shop-item-card">
            <div className="item-image-wrapper">
              {/* Logic to handle both PNGs and Emojis */}
              {item.image.startsWith('/') ? (
                <img src={item.image} alt={item.name} className="item-asset" />
              ) : (
                <span className="item-emoji">{item.image}</span>
              )}
            </div>
            
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <button 
                className="purchase-btn"
                onClick={() => {
                  // Prepare the item object for App.jsx inventory logic
                  const purchaseData = {
                    ...item,
                    currency: currencyTab,
                    price: currencyTab === 'stars' ? item.stars : item.ton
                  };
                  onPurchase(purchaseData);
                }}
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