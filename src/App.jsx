import React, { useState, useEffect } from 'react';
import './App.css';
import { useTonConnectUI, TonConnectButton } from '@tonconnect/ui-react';
import Arena from './views/Arena';
import Exploration from './views/Exploration';
import Shop from './views/Shop';
import Leaderboard from './views/Leaderboard';
import Mercenaries from './views/Mercenaries'; 
import Profile from './views/Profile'; 
import Menu from './views/Menu';
import { supabase } from './supabaseClient';
import Admin from './Admin'; // ADMIN CONTROL

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonData, setSeasonData] = useState({ prizePool: "0.00" });
  const ADMIN_ID = 7902485594; // THIS IS MY OWN TELEGRAM ID
  
  // NEW: Leaderboard Pagination States
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const [tonConnectUI] = useTonConnectUI();

  const calculateRegen = (profile) => {
    const REGEN_RATE_MS = 30 * 60 * 1000;
    const now = new Date();
    const lastUpdate = new Date(profile.last_stamina_update);
    const timeElapsed = now - lastUpdate;
    const pointsToGain = Math.floor(timeElapsed / REGEN_RATE_MS);
    return pointsToGain > 0 ? Math.min(profile.stamina + pointsToGain, 20) : profile.stamina;
  };

  useEffect(() => {
    const loadGameData = async () => {
      setLoading(true);
      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;

      if (!tgUser) {
        setLoading(false);
        return; 
      }

      try {
        let { data: profile } = await supabase.from('profiles').select('*').eq('id', tgUser.id).maybeSingle();

        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ 
              id: tgUser.id, 
              name: tgUser.first_name, 
              stamina: 20, 
              inventory: [],
              last_stamina_update: new Date().toISOString() 
            }])
            .select().single();
          if (createError) throw createError;
          profile = newProfile;
        }

        const currentStamina = calculateRegen(profile);
        setUserData({ ...profile, stamina: currentStamina });

        // INITIAL FETCH: Gets the prize pool when app first opens
        const { data: globalStats } = await supabase.from('global_stats').select('season_prize_pool').eq('id', 1).single();
        if (globalStats) setSeasonData({ prizePool: globalStats.season_prize_pool });

        // INITIAL LEADERBOARD FETCH
        await loadLeaderboard(true);

      } catch (err) {
        console.error("Database Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();

    // REAL-TIME LISTENER: Updates the prize pool instantly when it changes in DB
    const subscription = supabase
      .channel('live_prize_pool')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'global_stats',
        filter: 'id=eq.1' 
      }, (payload) => {
        setSeasonData({ prizePool: payload.new.season_prize_pool });
      })
      .subscribe();

    // CLEANUP: Closes the listener when the user leaves the app
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

// --- HANDLERS ---

const handleSummonMercenary = async () => {
  const inventory = [...(userData.inventory || [])];
  const scrollIndex = inventory.findIndex(item => item.name === "Recruitment Scroll");

  if (scrollIndex === -1) {
    window.Telegram?.WebApp?.showAlert("No Recruitment Scrolls found!");
    return;
  }

  // 1. Define possible mercenaries
  const mercPool = [
    { name: "Lowly Spearman", image: "Rank-D-5-Spearman-Hand-Me-Down.png", rarity: "D", strength: 5, agility: 5, dexterity: 5 },
    { name: "Old Swordsman", image: "Rank-D-4-Old-Swordsman.png", rarity: "D", strength: 7, agility: 3, dexterity: 5 },
    { name: "Town Militia", image: "Rank-D-3-Town-Militia.png", rarity: "D", strength: 3, agility: 6, dexterity: 6 },
    { name: "Footsoldier Initiate", image: "Rank-D-2-Footsoldier-Initiate.png", rarity: "D", strength: 5, agility: 6, dexterity: 4 },
    { name: "Axeman Apprentice", image: "Rank-D-1-Axeman-Apprentice.png", rarity: "D", strength: 7, agility: 4, dexterity: 4 },
    { name: "Footsoldier Initiate", image: "Rank-C-4-Footsoldier-Initiate.png", rarity: "C", strength: 8, agility: 7, dexterity: 5 },
    { name: "Crossbowman Initiate", image: "Rank-C-3-Crossbowman-Initiate.png", rarity: "C", strength: 5, agility: 7, dexterity: 8 },
    { name: "Spearman Initiate", image: "Rank-C-2-Spearman-Initiate.png", rarity: "C", strength: 10, agility: 5, dexterity: 5 },
    { name: "Assassin Initiate", image: "Rank-C-1-Assassin-Initiate.png", rarity: "C", strength: 8, agility: 7, dexterity: 5 },
    { name: "Discharged Bowman", image: "Rank-B-4-Discharged-Crossbowman.png", rarity: "B", strength: 7, agility: 8, dexterity: 10 },
    { name: "Veteran Axeman", image: "Rank-B-3-Veteran-Axeman.png", rarity: "B", strength: 12, agility: 5, dexterity: 7 },
    { name: "Discharged Footsoldier", image: "Rank-B-2-Discharged-Footsoldier.png", rarity: "B", strength: 10, agility: 9, dexterity: 6 },
    { name: "Veteran Spearman", image: "Rank-B-1-Veteran-Spearman.png", rarity: "B", strength: 13, agility: 6, dexterity: 6 },
    { name: "Discharged Hammerman", image: "Rank-A-4-Discharged-Hammerman.png", rarity: "A", strength: 15, agility: 6, dexterity: 8 },
    { name: "Cavalry Javelin", image: "Rank-A-3-Cavalry-Javelin.png", rarity: "A", strength: 15, agility: 10, dexterity: 5 },
    { name: "Hooded Crossbowman", image: "Rank-A-2-Hooded-Crossbowman.png", rarity: "A", strength: 8, agility: 10, dexterity: 12 },
    { name: "Cloaked Assassin", image: "Rank-A-1-Cloaked-Assassin.png", rarity: "A", strength: 10, agility: 12, dexterity: 8 },
    { name: "The Black Knight", image: "Rank-S-1-The-Black-Knight.png", rarity: "S", strength: 18, agility: 15, dexterity: 12 },
    { name: "Elven Archer", image: "Rank-S-2-Elven-Archer.png", rarity: "S", strength: 10, agility: 17, dexterity: 18 },
    { name: "Dwarven Axeman", image: "Rank-S-3-Dwarven-Axeman.png", rarity: "S", strength: 20, agility: 10, dexterity: 15 }
  ];

  const selectedMercTemplate = mercPool[Math.floor(Math.random() * mercPool.length)];
  const newMerc = { ...selectedMercTemplate, id: `merc_${Date.now()}`, status: 'idle' };

  inventory.splice(scrollIndex, 1);
  const newMercList = [...(userData.mercenaries || []), newMerc];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ inventory, mercenaries: newMercList })
      .eq('id', userData.id)
      .select().single();
    
    if (!error) {
      setUserData(data);
      window.Telegram?.WebApp?.showAlert(`Summoned: ${newMerc.rarity} ${newMerc.name}!`);
    }
  } catch (err) { console.error(err); }
};

const handleActivateMercenary = async (mercId) => {
  const selectedMerc = userData.mercenaries?.find(m => m.id === mercId);
  if (selectedMerc?.status === 'training') {
    window.Telegram?.WebApp?.showAlert("This mercenary is currently training and cannot be deployed!");
    return;
  }
  if (selectedMerc?.status === 'exploring') {
    window.Telegram?.WebApp?.showAlert("This mercenary is out exploring and cannot be deployed!");
    return;
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ active_mercenary_id: mercId })
      .eq('id', userData.id)
      .select().single();
    if (!error) {
      setUserData(data);
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
    }
  } catch (err) { console.error("Activation Error:", err.message); }
};

const handleDismissMercenary = async (mercId) => {
  const updatedMercs = [...(userData.mercenaries || [])];
  const inventory = [...(userData.inventory || [])];
  const mercIndex = updatedMercs.findIndex(m => m.id === mercId);
  if (mercIndex === -1) return;

  const dismissedMerc = updatedMercs[mercIndex];
  if (mercId === userData.active_mercenary_id || dismissedMerc.status === 'training') {
    window.Telegram?.WebApp?.showAlert("Cannot dismiss a deployed or training mercenary!");
    return;
  }

  const dustRewards = { D: 3, C: 5, B: 7, A: 9, S: 15 };
  const rewardAmount = dustRewards[dismissedMerc.rarity] || 0;
  updatedMercs.splice(mercIndex, 1);

  for (let i = 0; i < rewardAmount; i++) {
    inventory.push({ id: `dust_${Date.now()}_${i}`, name: "Training Dust", image: "powder.png", type: "material" });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ mercenaries: updatedMercs, inventory: inventory })
      .eq('id', userData.id)
      .select().single();
    if (!error) {
      setUserData(data);
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('medium');
      window.Telegram?.WebApp?.showAlert(`${dismissedMerc.name} dismissed! Gained ${rewardAmount} Training Dust.`);
    }
  } catch (err) { console.error("Dismiss Error:", err.message); }
};

  const loadLeaderboard = async (isNewLoad = false) => {
    setLoading(true);
    const currentPage = isNewLoad ? 0 : page;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, rating')
        .order('rating', { ascending: false })
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1);

      if (error) throw error;
      const formattedData = data.map((user, index) => ({
        rank: (currentPage * pageSize) + index + 1,
        username: user.name,
        power: user.rating
      }));

      if (isNewLoad) {
        setRankings(formattedData);
        setPage(1);
      } else {
        setRankings(prev => [...prev, ...formattedData]);
        setPage(prev => prev + 1);
      }
    } catch (err) { console.error(err.message); } finally { setLoading(false); }
  };

  const handlePVPSearch = async () => {
    try {
      await supabase.from('profiles').update({ is_searching: true }).eq('id', userData.id);
      const { data: opponent } = await supabase.from('profiles').select('id, name, rating').eq('is_searching', true).neq('id', userData.id).limit(1).maybeSingle();
      if (opponent) {
        const { data: match } = await supabase.from('pvp_matches').insert([{ player_1_id: userData.id, player_2_id: opponent.id, status: 'active' }]).select().single();
        await supabase.from('profiles').update({ is_searching: false }).in('id', [userData.id, opponent.id]);
        return match;
      }
    } catch (err) { console.error(err.message); }
  };

  const handleCancelPVPSearch = async () => {
    await supabase.from('profiles').update({ is_searching: false }).eq('id', userData.id);
  };

const handleStartTraining = async (mercId, statType) => {
  if (userData.is_training) {
    window.Telegram?.WebApp?.showAlert("A mercenary is already training!");
    return;
  }
  const updatedMercs = [...(userData.mercenaries || [])];
  const mercIndex = updatedMercs.findIndex(m => m.id === mercId);
  if (mercIndex === -1) return;
  const targetMerc = updatedMercs[mercIndex];
  const dustCosts = { D: 10, C: 15, B: 20, A: 25, S: 30 };
  const requiredDust = dustCosts[targetMerc.rarity] || 10;
  const inventory = [...(userData.inventory || [])];
  const availableDust = inventory.filter(item => item.name === "Training Dust");

  if (availableDust.length < requiredDust) {
    window.Telegram?.WebApp?.showAlert(`Insufficient Training Dust! Need ${requiredDust} (You have ${availableDust.length})`);
    return;
  }
  if (userData.stamina < 5) {
    window.Telegram?.WebApp?.showAlert("Not enough stamina!");
    return;
  }

  let removedCount = 0;
  const newInventory = inventory.filter(item => {
    if (item.name === "Training Dust" && removedCount < requiredDust) {
      removedCount++;
      return false;
    }
    return true;
  });

  updatedMercs[mercIndex].status = 'training';
  const duration = 4 * 60 * 60 * 1000; 
  const endTime = new Date(Date.now() + duration).toISOString();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        stamina: userData.stamina - 5, 
        mercenaries: updatedMercs,
        inventory: newInventory,
        is_training: true, 
        training_ends_at: endTime, 
        training_stat: statType, 
        last_stamina_update: new Date().toISOString() 
      })
      .eq('id', userData.id)
      .select().single();
    if (!error) {
      setUserData(data);
      window.Telegram?.WebApp?.HapticFeedback.impactOccurred('heavy');
    }
  } catch (err) { console.error("Start Training Error:", err.message); }
};

  const handleCompleteTraining = async () => {
    const updatedMercs = [...(userData.mercenaries || [])];
    const mercIndex = updatedMercs.findIndex(m => m.status === 'training');
    if (mercIndex !== -1) {
      const statKey = userData.training_stat.toLowerCase();
      updatedMercs[mercIndex][statKey] = (updatedMercs[mercIndex][statKey] || 0) + 1;
      updatedMercs[mercIndex].status = 'idle';
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({ mercenaries: updatedMercs, is_training: false, training_ends_at: null, training_stat: null })
          .eq('id', userData.id).select().single();
        if (!error) {
          setUserData(data);
          window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
          window.Telegram?.WebApp?.showAlert(`Success! ${userData.training_stat} +1`);
        }
      } catch (err) { console.error("Completion Error:", err.message); }
    }
  };

  const handleSkipTraining = async () => {
    console.log("Ad finished placeholder triggered. Proceeding to claim stats.");
    await handleCompleteTraining();
  };

  const handleUseTournamentTicket = async () => {
    const inventory = [...(userData.inventory || [])];
    const ticketIndex = inventory.findIndex(item => item.name === "Tournament Ticket");
    if (ticketIndex === -1) {
      window.Telegram?.WebApp?.showAlert("You need a Tournament Ticket!");
      return false;
    }
    inventory.splice(ticketIndex, 1);
    try {
      const { data, error } = await supabase.from('profiles').update({ inventory }).eq('id', userData.id).select().single();
      if (error) throw error;
      setUserData(data);
      return true;
    } catch (err) { console.error(err.message); return false; }
  };

  const handleUseStaminaPotion = async () => {
    const inventory = [...(userData.inventory || [])];
    const itemIndex = inventory.findIndex(item => item.name === "Stamina Potion");
    if (itemIndex === -1) {
      window.Telegram?.WebApp?.showAlert("No Stamina Potions left!");
      return;
    }
    inventory.splice(itemIndex, 1);
    try {
      const { data, error } = await supabase.from('profiles').update({ stamina: 20, inventory, last_stamina_update: new Date().toISOString() }).eq('id', userData.id).select().single();
      if (error) throw error;
      setUserData(data);
    } catch (err) { console.error(err.message); }
  };

  const handleStartExploration = async (scrollType) => {
    const inventory = [...(userData.inventory || [])];
    const scrollName = scrollType === 'premium' ? "Premium Exploration Scroll" : "Basic Exploration Scroll";
    const durationMinutes = scrollType === 'premium' ? 20 : 10;
    const scrollIndex = inventory.findIndex(item => item.name === scrollName);
    if (scrollIndex === -1) {
      window.Telegram?.WebApp?.showAlert(`You need a ${scrollName}!`);
      return;
    }
    inventory.splice(scrollIndex, 1);
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    try {
      const { data, error } = await supabase.from('profiles').update({ exploration_end_time: endTime.toISOString(), inventory }).eq('id', userData.id).select().single();
      if (!error) {
        setUserData(data);
        window.Telegram?.WebApp?.HapticFeedback.impactOccurred('light');
      }
    } catch (err) { console.error(err.message); }
  };

  const handleClaimExploration = async () => {
    const roll = Math.random() * 100;
    let reward = null;
    if (roll <= 25) {
      const lootPool = [
        { name: "Training Dust", image: "/powder.png", weight: 60 },
        { name: "Small HP Potion", image: "/Small_HP_Potion.png", weight: 30 },
        { name: "Recruitment Scroll", image: "/basic_rec_scroll.png", weight: 10 }
      ];
      const itemRoll = Math.random() * 100;
      let cumulativeWeight = 0;
      for (const item of lootPool) {
        cumulativeWeight += item.weight;
        if (itemRoll <= cumulativeWeight) { reward = item; break; }
      }
    }
    try {
      const updates = { exploration_end_time: null };
      if (reward) updates.inventory = [...(userData.inventory || []), { ...reward, id: Date.now() }];
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', userData.id).select().single();
      if (error) throw error;
      setUserData(data);
      if (reward) window.Telegram?.WebApp?.showAlert(`Mission Success! You found: ${reward.name}`);
      else window.Telegram?.WebApp?.showAlert("Mission Complete. You found nothing of value this time.");
    } catch (err) { console.error("Claim Error:", err.message); }
  };

  const handlePurchase = async (item) => {
    if (item.currency === 'ton') {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{ address: "UQCdh-H8Xi7bRXmVi4Zgq8Fqg2WDKC72AVsgfIUgCIxgiaIP", amount: "100000000" }],
      };
      try { await tonConnectUI.sendTransaction(transaction); } 
      catch (e) { console.error("Payment failed", e); return; }
    }
    const newInventory = [...(userData.inventory || []), { id: Date.now(), name: item.name, image: item.image, icon: item.icon }];
    try {
      const { data, error } = await supabase.from('profiles').update({ inventory: newInventory }).eq('id', userData.id).select().single();
      if (error) throw error;
      setUserData(data);
    } catch (err) { console.error(err.message); }
  };

// --- ADMIN GRANT (Enhanced for Alpha) ---
  const handleAdminGrant = async (targetPlayerId, grantType, itemTemplate) => {
    // 1. Fetch current data
    const { data: targetUser, error: fetchError } = await supabase
      .from('profiles')
      .select('inventory, mercenaries')
      .eq('id', targetPlayerId)
      .single();

    if (fetchError) {
      window.Telegram?.WebApp?.showAlert(`Fetch Error: ${fetchError.message}`);
      return;
    }

    // 2. Prepare the update object
    const uniqueId = `grant_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;
    const updatePayload = {};

    if (itemTemplate.rarity) {
      // If the template has a rarity (like S or A), treat it as a Mercenary
      const updatedMercs = [...(targetUser.mercenaries || [])];
      updatedMercs.push({ ...itemTemplate, id: uniqueId });
      updatePayload.mercenaries = updatedMercs;
    } else {
      // Otherwise, treat it as a standard inventory item (Scroll, Dust, etc.)
      const updatedInv = [...(targetUser.inventory || [])];
      updatedInv.push({ ...itemTemplate, id: uniqueId });
      updatePayload.inventory = updatedInv;
    }

    // 3. Send update to Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', targetPlayerId);

    if (updateError) {
      window.Telegram?.WebApp?.showAlert(`Update Failed: ${updateError.message}`);
    } else {
      window.Telegram?.WebApp?.showAlert(`${itemTemplate.name} granted successfully!`);
    }
  };

  if (loading && !userData) return <div className="loading-screen">CONNECTING...</div>;

  return (
    <div className="game-wrapper">
      <div className="header-section">
        <div className="top-row">
          <div className="profile-btn" onClick={() => setActiveTab('profile')}>🛡️</div>
          <div className="wallet-container"><TonConnectButton /></div>
          <div className="menu-btn" onClick={() => setActiveTab('menu')}>≡</div>
        </div>
        <div className="announcement-row">
          <div className="rolling-box">
            <div className="marquee-text">SERVER UNDER CONSTRUCTION!!!</div>
          </div>
        </div>
      </div>

      {activeTab && (
        <div className="screen-overlay" onClick={() => setActiveTab(null)}>
          <div className={`overlay-content ${activeTab}-bg`} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveTab(null)}>✕</button>
            <div className="overlay-body">
              {activeTab === 'profile' && (
                <Profile userData={userData} inventory={userData?.inventory || []} onUseStaminaPotion={handleUseStaminaPotion} />
              )}
              {activeTab === 'menu' && <Menu userData={userData} seasonPrize={seasonData.prizePool} />}
              {activeTab === 'arena' && (
                <Arena userData={userData} onStartTraining={handleStartTraining} onCompleteTraining={handleCompleteTraining} onSkipTraining={handleSkipTraining} onPVPSearch={handlePVPSearch} onCancelPVPSearch={handleCancelPVPSearch} onUseTicket={handleUseTournamentTicket} />
              )}
              {activeTab === 'exploration' && (
                <Exploration userData={userData} onStart={handleStartExploration} onClaim={handleClaimExploration} />
              )}
              {activeTab === 'shop' && <Shop userData={userData} onPurchase={handlePurchase} />}
              {activeTab === 'leaderboard' && (
                <Leaderboard rankings={rankings} playerRank={userData?.rank} isLoading={loading} seasonPrize={seasonData.prizePool} onLoadMore={() => loadLeaderboard(false)} />
              )}
              {activeTab === 'mercenaries' && (
                <Mercenaries list={userData?.mercenaries || []} activeId={userData?.active_mercenary_id} onActivate={handleActivateMercenary} onSummon={handleSummonMercenary} onDismiss={handleDismissMercenary} scrollCount={userData?.inventory?.filter(i => i.name === "Recruitment Scroll").length || 0} />
              )}
              {activeTab === 'admin' && userData?.id === ADMIN_ID && (
                <Admin onGrant={handleAdminGrant} />
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
          {userData?.id === ADMIN_ID && (
            <button onClick={() => setActiveTab('admin')} style={{color: 'red'}}>Admin</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;