export default function Header({ data }) {
  return (
    <div style={{ padding: '10px', background: '#222', borderBottom: '1px solid #444' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Stamina: {data.stamina}/{data.maxStamina}</span>
        <span>Points: {data.points}</span>
        <span>Dust: {data.dust}</span>
      </div>
      <div style={{ width: '100%', background: '#444', height: '8px', marginTop: '5px' }}>
        <div style={{ 
          width: `${(data.stamina / data.maxStamina) * 100}%`, 
          background: 'lime', height: '100%' 
        }}></div>
      </div>
    </div>
  );
}