import React from 'react';

const Mercenaries = ({ list, activeId, onSelect }) => {
  return (
    <div className="mercenaries-view-container">
      <h2 className="arena-title">MERCENARIES</h2>

      {list.length === 0 ? (
        <div className="empty-state">No mercenaries recruited yet.</div>
      ) : (
        <div className="merc-list-wrapper">
          {list.map((merc) => {
            const isActive = merc.id === activeId;
            const isBusy = merc.status !== 'idle';

            return (
              <div 
                key={merc.id} 
                className={`merc-card ${isActive ? 'active-merc' : ''}`}
              >
                <div className="merc-info">
                  <div className="merc-name-row">
                    <span className="merc-name">{merc.name}</span>
                    <span className="merc-level">Lv.{merc.level}</span>
                  </div>
                  {/* Displays the current state: idle, training, or exploring */}
                  <div className={`merc-status-badge ${merc.status}`}>
                    {merc.status.toUpperCase()}
                  </div>
                </div>

                <div className="merc-actions">
                  {isActive ? (
                    <button className="status-button active-label" disabled>
                      SELECTED
                    </button>
                  ) : (
                    <button 
                      className="status-button select-action"
                      onClick={() => onSelect(merc.id)}
                      disabled={isBusy}
                    >
                      {isBusy ? "BUSY" : "CHOOSE"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Mercenaries;