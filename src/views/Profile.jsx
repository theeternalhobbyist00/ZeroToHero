import React from 'react';

function Profile({ userData, inventory, onUseStaminaPotion }) {
  return (
    <div className="profile-view" style={{ color: 'white' }}>
      <div className="profile-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>{userData?.name || 'Player'}</h2>
        <p>Rating: ⭐ {userData?.rating || 0}</p>
        <p>Stamina: ⚡ {userData?.stamina}/20</p>
        <button onClick={onUseStaminaPotion} style={{ padding: '5px 10px' }}>Use Stamina Potion</button>
      </div>

      <h3>Inventory</h3>
      {/* 4-COLUMN GRID FIX */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '8px', 
        padding: '10px',
        background: '#111',
        borderRadius: '8px'
      }}>
        {inventory.length > 0 ? (
          inventory.map((item, index) => (
            <div key={index} style={{ 
              aspectRatio: '1/1', 
              background: '#2a2a2a', 
              borderRadius: '6px', 
              border: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img src={`/assets/${item.image}`} style={{ width: '80%' }} alt={item.name} />
            </div>
          ))
        ) : (
          <p style={{ gridColumn: 'span 4', textAlign: 'center', opacity: 0.5 }}>Empty</p>
        )}
      </div>
    </div>
  );
}

export default Profile;