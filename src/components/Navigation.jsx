export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = ['arena', 'exploration', 'shop'];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', background: '#222', padding: '15px' }}>
      {tabs.map(tab => (
        <button 
          key={tab} 
          onClick={() => setActiveTab(tab)}
          style={{ 
            color: activeTab === tab ? 'gold' : 'white',
            background: 'none', textTransform: 'capitalize' 
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}