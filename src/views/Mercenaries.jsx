import React from 'react';

function Mercenaries({ list, activeId, onActivate, onSummon, onDismiss, scrollCount }) {
  return (
    <div className="mercenaries-view">
      <div className="summon-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button className="summon-btn" onClick={onSummon}>
          SUMMON (Scrolls: {scrollCount})
        </button>
      </div>

      <div className="merc-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {list.length > 0 ? (
          list.map((merc) => (
            <div key={merc.id} className="merc-card" style={{ background: '#222', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
              {/* IMAGE FIX: Replacing the gray box */}
              <img 
                src={`/assets/${merc.image}`} 
                alt={merc.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              />
              
              <div style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#fff' }}>{merc.name}</h3>
                  <span style={{ fontSize: '12px', color: '#aaa' }}>Rank {merc.rarity}</span>
                </div>

                {/* DYNAMIC STATUS: Deployed vs Idle */}
                <p style={{ 
                  margin: '5px 0', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: activeId === merc.id ? '#ff4444' : '#44ff44' 
                }}>
                  {activeId === merc.id ? '⚔️ DEPLOYED' : `💤 ${merc.status.toUpperCase()}`}
                </p>

                <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#fff' }}>
                  <span>💪 {merc.strength}</span>
                  <span>⚡ {merc.agility}</span>
                  <span>🎯 {merc.dexterity}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    onClick={() => onActivate(merc.id)}
                    disabled={activeId === merc.id}
                    style={{ flex: 1, padding: '8px', background: activeId === merc.id ? '#444' : '#0088cc', color: 'white', border: 'none', borderRadius: '5px' }}
                  >
                    {activeId === merc.id ? 'Active' : 'Deploy'}
                  </button>
                  <button 
                    onClick={() => onDismiss(merc.id)}
                    disabled={activeId === merc.id}
                    style={{ padding: '8px', background: '#cc0000', color: 'white', border: 'none', borderRadius: '5px' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#aaa', textAlign: 'center' }}>No mercenaries recruited yet.</p>
        )}
      </div>
    </div>
  );
}

export default Mercenaries;