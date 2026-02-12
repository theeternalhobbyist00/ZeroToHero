import React from 'react';

const Menu = ({ userData, seasonPrize }) => {
  
  const handleInvite = () => {
    const botUsername = "YourBotName_bot"; // REPLACE with your bot's username
    const inviteLink = `https://t.me/${botUsername}?start=ref_${userData?.id || 'newuser'}`;
    const shareText = "Join me in Zero to Hero! ⚔️";
    
    window.Telegram.WebApp.openTelegramLink(
      `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
    );
  };

  return (
    <div className="menu-container">
      <h2 className="arena-title">SYSTEM MENU</h2>

      <div className="menu-list">
        {/* SEASON REWARDS - Live Dynamic Prize Pool */}
        <div className="menu-item season-highlight">
          <div className="menu-text">
            <div className="label-with-status">
              <span>Season Rewards</span>
              <span className="live-indicator">LIVE</span>
            </div>
            <div className="prize-amount">
              {seasonPrize || "0.00"} <span className="currency-unit">TON</span>
            </div>
          </div>
          <span className="menu-icon-gold">🏆</span>
        </div>

        {/* INVITE FRIEND - Referral Logic */}
        <div className="menu-item" onClick={handleInvite}>
          <span>Invite a Friend</span>
          <span className="menu-arrow">👥</span>
        </div>

        {/* TOS - Static Link */}
        <div className="menu-item" onClick={() => window.Telegram.WebApp.openLink('https://your-site.com/terms')}>
          <span>Terms of Service</span>
          <span className="menu-arrow">📄</span>
        </div>

        {/* CONTACT - Support Logic */}
        <div className="menu-item" onClick={() => window.Telegram.WebApp.openTelegramLink('https://t.me/YourSupportUser')}>
          <span>Contact Us</span>
          <span className="menu-arrow">📧</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;