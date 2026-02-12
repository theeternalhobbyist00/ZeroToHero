import React, { useState } from 'react';

const Admin = ({ onGrant }) => {
  const [targetId, setTargetId] = useState('7902485594');
  const [selectedTemplate, setSelectedTemplate] = useState('scroll');

  const templates = {
    scroll: { 
      name: "Recruitment Scroll", 
      image: "scroll.png", 
      type: "consumable" 
    },
    dust: { 
      name: "Training Dust", 
      image: "powder.png", 
      type: "material" 
    },
    potion: { 
      name: "Stamina Potion", 
      image: "potion.png", 
      type: "consumable" 
    },
    ticket: { 
      name: "Tournament Ticket", 
      image: "ticket.png", 
      type: "consumable" 
    },
    black_knight: { 
      name: "The Black Knight", 
      image: "Rank-S-1-The-Black-Knight.png", 
      rarity: "S", 
      strength: 18, 
      agility: 15, 
      dexterity: 12,
      status: "idle"
    }
  };

  const handleAction = () => {
    if (!targetId) {
      window.Telegram?.WebApp?.showAlert("Please enter a Target Player ID");
      return;
    }
    
    const itemData = templates[selectedTemplate];
    onGrant(targetId, 'item', itemData);
  };

  return (
    <div className="admin-panel" style={{ padding: '20px', color: 'white' }}>
      <h2>Admin Control</h2>
      <hr />
      
      <div style={{ marginBottom: '15px' }}>
        <label>Target Player ID:</label>
        <input 
          type="text" 
          value={targetId} 
          onChange={(e) => setTargetId(e.target.value)}
          placeholder="e.g. 7902485594"
          style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Item to Grant:</label>
        <select 
          value={selectedTemplate} 
          onChange={(e) => setSelectedTemplate(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }}
        >
          <option value="scroll">Recruitment Scroll</option>
          <option value="dust">Training Dust</option>
          <option value="potion">Stamina Potion</option>
          <option value="ticket">Tournament Ticket</option>
          <option value="black_knight">S-Rank: Black Knight</option>
        </select>
      </div>

      <button 
        onClick={handleAction}
        style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#ff4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        EXECUTE GRANT
      </button>

      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
        <p>* Note: Grants are added directly to the player's inventory or mercenary list in Supabase.</p>
      </div>
    </div>
  );
};

export default Admin;