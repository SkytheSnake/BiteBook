const restaurants = [
  {id:'little-french',name:'Little French',area:'Westbury Park',cuisine:'French',price:'£££',lat:51.4846,lng:-2.6108,score:4.8,tags:['Date night','Independent','Wine'],image:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80',blurb:'Neighbourhood French cooking, excellent wine and a dangerously easy excuse to order dessert.',deal:'Midweek set menu · Tue–Thu',bookable:true},
  {id:'pasta-ripiena',name:'Pasta Ripiena',area:'City Centre',cuisine:'Italian',price:'££',lat:51.4547,lng:-2.5932,score:4.7,tags:['Pasta','Cosy','Independent'],image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=80',blurb:'Tiny, lively and entirely committed to filled pasta. A strong contender for carb-based happiness.',deal:null,bookable:true},
  {id:'squeezed',name:'Squeezed',area:'Wapping Wharf',cuisine:'Burgers',price:'££',lat:51.4474,lng:-2.5995,score:4.6,tags:['Casual','Burgers','Harbourside'],image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',blurb:'Messy burgers, brilliant chips and absolutely no expectation that you retain your dignity while eating.',deal:'Free fries with a double burger · Mondays',bookable:false},
  {id:'seven-lucky-gods',name:'Seven Lucky Gods',area:'Wapping Wharf',cuisine:'Japanese',price:'££',lat:51.4471,lng:-2.6003,score:4.5,tags:['Small plates','Cocktails','Groups'],image:'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=80',blurb:'Japanese-inspired small plates and cocktails made for ordering far too much “for the table”.',deal:null,bookable:true},
  {id:'root',name:'Root',area:'Wapping Wharf',cuisine:'Modern British',price:'£££',lat:51.4475,lng:-2.6006,score:4.7,tags:['Veg-forward','Seasonal','Small plates'],image:'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80',blurb:'Vegetables get main-character treatment, without making the meat eaters feel like they have been punished.',deal:'Friday lunch tasting menu',bookable:true},
  {id:'bokman',name:'Bokman',area:'Stokes Croft',cuisine:'Korean',price:'££',lat:51.4598,lng:-2.5907,score:4.8,tags:['Korean','Sharing','Hidden gem'],image:'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1000&q=80',blurb:'Bold Korean cooking and the sort of menu that makes choosing only one thing feel personally offensive.',deal:null,bookable:true},
  {id:'bravas',name:'Bravas',area:'Clifton',cuisine:'Spanish',price:'££',lat:51.4588,lng:-2.6111,score:4.6,tags:['Tapas','Date night','Clifton'],image:'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1000&q=80',blurb:'Bustling tapas bar energy, good sherry and plates that disappear before anyone remembers to photograph them.',deal:'Weekday lunch offer',bookable:true},
  {id:'molto-buono',name:'Molto Buono',area:'Park Street',cuisine:'Italian',price:'££',lat:51.4545,lng:-2.6045,score:4.4,tags:['Pizza','Pasta','Casual'],image:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=80',blurb:'Big comfort-food energy: pizza, pasta and the eternal question of whether ordering both is excessive.',deal:'Student pizza night · Wednesdays',bookable:true}
];

const rewards = [
  {id:'rw-fries',restaurant:'squeezed',title:'Free fries',cost:120,detail:'With any burger. One redemption per visit.',stock:18},
  {id:'rw-dessert',restaurant:'little-french',title:'Dessert on us',cost:250,detail:'One dessert from the standard menu, Tue–Thu.',stock:8},
  {id:'rw-bravas',restaurant:'bravas',title:'£5 off your bill',cost:300,detail:'Minimum £25 spend. Mon–Thu.',stock:12},
  {id:'rw-root',restaurant:'root',title:'Free small plate',cost:350,detail:'With two other plates purchased at lunch.',stock:6}
];

const defaultState = {
  saved:['little-french','bokman'],
  visited:{
    'pasta-ripiena':{rating:5,note:'Would absolutely go back. The ravioli was ridiculous and I am still thinking about it.',photo:true,checkin:true},
    'squeezed':{rating:4,note:'Great burger. Needed approximately seventeen napkins, which is probably the correct burger-to-napkin ratio.',photo:true,checkin:true},
    'bravas':{rating:4,note:'Perfect for sharing and pretending I will not order another plate. Good atmosphere and very easy to over-order.',photo:false,checkin:true}
  },
  redeemed:[],
  betaBonusClaimed:true
};

let state = load();
let page = 'discover';
let cuisine = 'All';
let query = '';
let mapMode = 'all';
let mapInstance = null;

function clone(obj){return JSON.parse(JSON.stringify(obj))}
function load(){
  try{
    const v2 = JSON.parse(localStorage.getItem('bitebook-v2') || 'null');
    if(v2) return Object.assign(clone(defaultState),v2);
    const v1 = JSON.parse(localStorage.getItem('bitebook-v1') || 'null');
    if(v1){
      const migrated = clone(defaultState);
      migrated.saved = v1.saved || migrated.saved;
      if(v1.visited){
        migrated.visited = {};
        Object.entries(v1.visited).forEach(([id,v])=>migrated.visited[id]={rating:v.rating||0,note:v.note||'',photo:false,checkin:true});
      }
      return migrated;
    }
  }catch(e){}
  return clone(defaultState);
}
function save(){localStorage.setItem('bitebook-v2',JSON.stringify(state))}

function reviewScore(v){
  if(!v) return {xp:0,bites:0,quality:false,parts:[]};
  let xp=0,bites=0; const parts=[];
  if(v.checkin){xp+=50;bites+=15;parts.push('check-in');}
  if(v.rating){xp+=50;bites+=15;parts.push('rating');}
  if((v.note||'').trim().length>=80){xp+=60;bites+=25;parts.push('useful review');}
  else if((v.note||'').trim().length>=30){xp+=25;bites+=10;parts.push('short review');}
  if(v.photo){xp+=40;bites+=20;parts.push('photo');}
  const quality=Boolean(v.rating && (v.note||'').trim().length>=80);
  if(quality){xp+=25;bites+=10;parts.push('quality bonus');}
  return {xp,bites,quality,parts};
}
function totals(){
  const scores=Object.values(state.visited).map(reviewScore);
  const baseXp=scores.reduce((n,s)=>n+s.xp,0);
  const baseBites=scores.reduce((n,s)=>n+s.bites,0);
  const quality=scores.filter(s=>s.quality).length;
  const milestoneBites=Math.floor(quality/10)*250;
  const betaBonus=state.betaBonusClaimed?150:0;
  const spent=state.redeemed.reduce((n,r)=>n+r.cost,0);
  return {xp:baseXp,bites:Math.max(0,baseBites+milestoneBites+betaBonus-spent),earnedBites:baseBites+milestoneBites+betaBonus,quality,spent};
}
function level(){return Math.max(1,Math.floor(totals().xp/500)+1)}
function nextLevelProgress(){return totals().xp%500/500*100}
function format(n){return new Intl.NumberFormat('en-GB').format(n)}

function setPage(next){
  page=next;
  document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  render(); window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
document.getElementById('searchInput').addEventListener('input',e=>{query=e.target.value.toLowerCase(); if(page!=='discover') setPage('discover'); else render();});

function toast(message){
  const root=document.getElementById('toastRoot');
  root.innerHTML=`<div class="toast">${message}</div>`;
  setTimeout(()=>{root.innerHTML=''},2600);
}
function title(k,t,c){return `<div class="title"><span class="eyebrow">${k}</span><h1>${t}</h1><p>${c}</p></div>`}
function rewardStatus(r){const redeemed=state.redeemed.some(x=>x.rewardId===r.id); return redeemed?'Redeemed':`${r.cost} Bites`;}

function card(r){
  const v=state.visited[r.id];
  return `<article class="restaurant">
    <div class="restaurant-image" onclick="openRestaurant('${r.id}')"><img src="${r.image}" alt="${r.name}"><span class="chip price">${r.price}</span>${rewards.some(x=>x.restaurant===r.id)?'<span class="chip deal">✦ Reward</span>':''}</div>
    <div class="restaurant-body"><div class="restaurant-title"><div><h3>${r.name}</h3><div class="meta">⌖ ${r.area} · ${r.cuisine}</div></div><button class="save ${state.saved.includes(r.id)?'saved':''}" onclick="event.stopPropagation();toggleSave('${r.id}')">${state.saved.includes(r.id)?'♥':'♡'}</button></div>
    <p class="blurb">${r.blurb}</p><div class="tags">${r.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <div class="card-foot"><span class="score">★ ${r.score}</span>${v?`<span class="visited">✓ ${reviewScore(v).xp} XP earned</span>`:''}<button class="view" onclick="openRestaurant('${r.id}')">View</button></div></div>
  </article>`;
}

function earnStrip(){return `<section class="earn-strip">
  <div><span class="earn-icon">⌖</span><b>Check in</b><small>+50 XP · +15 Bites</small></div>
  <div><span class="earn-icon">★</span><b>Rate it</b><small>+50 XP · +15 Bites</small></div>
  <div><span class="earn-icon">✎</span><b>Useful review</b><small>up to +85 XP · +35 Bites</small></div>
  <div><span class="earn-icon">▧</span><b>Add a photo</b><small>+40 XP · +20 Bites</small></div>
</section>`}

function render(){
  const t=totals();
  document.getElementById('topXp').textContent=`${format(t.xp)} XP`;
  document.getElementById('topBites').textContent=`${format(t.bites)} Bites`;
  document.getElementById('sidebarLevel').textContent=`Food menace · Level ${level()}`;
  const root=document.getElementById('app');
  if(page==='discover')root.innerHTML=discover();
  if(page==='bitebook')root.innerHTML=bitebook();
  if(page==='groups')root.innerHTML=groups();
  if(page==='rewards')root.innerHTML=rewardsPage();
  if(page==='owners')root.innerHTML=owners();
  if(page==='discover') requestAnimationFrame(initBristolMap);
  else destroyMap();
}

function discover(){
  const cs=['All',...new Set(restaurants.map(r=>r.cuisine))];
  const list=restaurants.filter(r=>`${r.name} ${r.area} ${r.cuisine} ${r.tags.join(' ')}`.toLowerCase().includes(query)&&(cuisine==='All'||r.cuisine===cuisine));
  const t=totals(); const visited=Object.keys(state.visited).length;
  return `<div class="page">
    <section class="hero"><div><span class="eyebrow">✦ Bristol beta · V2</span><h1>Eat Bristol.<br>Make a game of it.</h1><p>Discover somewhere new, check in, rate it properly and earn your way up the leaderboard. XP is for bragging rights. Bites are for free food. Sensible priorities.</p><div class="actions"><button class="primary" onclick="document.getElementById('explore').scrollIntoView({behavior:'smooth'})">Find my next bite</button><button class="secondary" onclick="setPage('rewards')">Spend ${t.bites} Bites</button></div></div>
    <div class="hero-wallet"><span>Level ${level()}</span><strong>${format(t.xp)} <em>XP</em></strong><small>${500-(t.xp%500||0)} XP to the next level</small><div class="progress"><i style="width:${nextLevelProgress()}%"></i></div><hr><span>Available to spend</span><strong class="bites-total">${format(t.bites)} <em>Bites</em></strong><small>Bites never affect your leaderboard score.</small></div></section>
    ${earnStrip()}
    <section class="stats"><div class="stat"><span>Places tried</span><b>${visited}</b><small>Keep eating. Heroically.</small></div><div class="stat"><span>Quality reviews</span><b>${t.quality}</b><small>${Math.max(0,10-(t.quality%10||10))||10} until the next 250 Bite bonus</small></div><div class="stat"><span>Group position</span><b>#2</b><small>Nick remains a problem</small></div><div class="stat"><span>Bites available</span><b>${t.bites}</b><small>Spend them in Rewards</small></div></section>
    <section class="map-section"><div class="section-head"><div><span class="eyebrow">Bristol Bite Map</span><h2>Collect the city</h2><p class="section-copy">See where you have eaten, what is waiting on your wishlist and which restaurants currently have Bite rewards.</p></div><div class="map-filters">${[['all','All'],['unvisited','Not tried'],['visited','Visited'],['wishlist','Wishlist'],['rewards','Rewards']].map(x=>`<button onclick="setMapMode('${x[0]}')" class="${mapMode===x[0]?'active':''}">${x[1]}</button>`).join('')}</div></div><div class="map-shell"><div id="bristolMap"></div><div class="map-legend"><span><i class="dot unvisited"></i>Not tried</span><span><i class="dot visited"></i>Visited</span><span><i class="dot wishlist"></i>Wishlist</span><span><i class="dot reward"></i>Reward available</span></div></div></section>
    <section id="explore"><div class="section-head"><div><span class="eyebrow">Explore</span><h2>Popular around Bristol</h2></div><div class="filters">${cs.map(c=>`<button onclick="setCuisine('${c.replaceAll("'","\\'")}')" class="${cuisine===c?'active':''}">${c}</button>`).join('')}</div></div><div class="restaurant-grid">${list.map(card).join('')}</div>${!list.length?'<div class="empty">No bites found. Bristol has failed you. Try another search.</div>':''}</section>
  </div>`;
}
function setCuisine(c){cuisine=c;render()}
function setMapMode(mode){mapMode=mode;render()}

function destroyMap(){
  if(mapInstance){mapInstance.remove();mapInstance=null;}
}
function mapRestaurantStatus(r){
  if(state.visited[r.id]) return 'visited';
  if(state.saved.includes(r.id)) return 'wishlist';
  return 'unvisited';
}
function mapVisible(r){
  const matchesSearch=`${r.name} ${r.area} ${r.cuisine} ${r.tags.join(' ')}`.toLowerCase().includes(query);
  const matchesCuisine=cuisine==='All'||r.cuisine===cuisine;
  if(!matchesSearch||!matchesCuisine)return false;
  if(mapMode==='visited')return Boolean(state.visited[r.id]);
  if(mapMode==='unvisited')return !state.visited[r.id];
  if(mapMode==='wishlist')return state.saved.includes(r.id)&&!state.visited[r.id];
  if(mapMode==='rewards')return rewards.some(x=>x.restaurant===r.id);
  return true;
}
function initBristolMap(){
  const el=document.getElementById('bristolMap');
  if(!el||typeof L==='undefined')return;
  destroyMap();
  mapInstance=L.map(el,{zoomControl:true,scrollWheelZoom:false}).setView([51.4555,-2.5970],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(mapInstance);
  const visible=restaurants.filter(mapVisible);
  const bounds=[];
  visible.forEach(r=>{
    const status=mapRestaurantStatus(r);
    const hasReward=rewards.some(x=>x.restaurant===r.id);
    const marker=L.marker([r.lat,r.lng],{icon:L.divIcon({className:'bite-map-icon-wrap',html:`<div class=\"bite-map-icon ${status} ${hasReward?'has-reward':''}\"><span>${state.visited[r.id]?'✓':state.saved.includes(r.id)?'♥':'B'}</span>${hasReward?'<b>✦</b>':''}</div>`,iconSize:[38,44],iconAnchor:[19,42],popupAnchor:[0,-38]})}).addTo(mapInstance);
    marker.bindPopup(`<div class=\"map-popup\"><strong>${r.name}</strong><span>${r.area} · ${r.cuisine} · ${r.price}</span><small>★ ${r.score}${state.visited[r.id]?' · ✓ Visited':state.saved.includes(r.id)?' · ♥ Wishlist':''}${hasReward?' · ✦ Reward':''}</small><button onclick=\"openRestaurant('${r.id}')\">Open BiteBook profile</button></div>`,{closeButton:false});
    bounds.push([r.lat,r.lng]);
  });
  if(bounds.length>1)mapInstance.fitBounds(bounds,{padding:[38,38],maxZoom:14});
  if(bounds.length===1)mapInstance.setView(bounds[0],15);
  setTimeout(()=>mapInstance&&mapInstance.invalidateSize(),80);
}


function bitebook(){
  const tried=restaurants.filter(r=>state.visited[r.id]); const wish=restaurants.filter(r=>state.saved.includes(r.id)&&!state.visited[r.id]); const t=totals();
  return `<div class="page">${title('Your collection','My BiteBook',"Every restaurant you've conquered, what you thought of it, and exactly how much fake internet glory it earned you.")}
    <div class="collection-summary"><div><small>Lifetime XP</small><b>${format(t.xp)}</b></div><div><small>Available Bites</small><b>${format(t.bites)}</b></div><div><small>Useful reviews</small><b>${t.quality}</b></div><div><small>Photos added</small><b>${Object.values(state.visited).filter(v=>v.photo).length}</b></div></div>
    <div class="section-head"><div><span class="eyebrow">Stamped</span><h2>Places you've tried</h2></div></div><div class="restaurant-grid">${tried.map(card).join('')}</div>
    <div class="section-head spaced"><div><span class="eyebrow">Wishlist</span><h2>Next on the hit list</h2></div></div><div class="restaurant-grid">${wish.map(card).join('')||'<div class="empty">Your wishlist is suspiciously empty.</div>'}</div>
  </div>`;
}

function groups(){
  const t=totals();
  const leaders=[['Nick',t.xp+180,7,'N'],['Annie',t.xp,6,'A'],['Hush',Math.max(0,t.xp-130),5,'H'],['Zay',Math.max(0,t.xp-240),4,'Z']];
  const ww=restaurants.filter(r=>r.area==='Wapping Wharf'&&state.visited[r.id]).length;
  const badges=[
    ['📸','Photo Finish','Add 3 food photos',Object.values(state.visited).filter(v=>v.photo).length>=3],
    ['🗺️','Bristol Explorer','Visit 3 different areas',new Set(restaurants.filter(r=>state.visited[r.id]).map(r=>r.area)).size>=3],
    ['✍️','Actually Helpful','Write 3 quality reviews',t.quality>=3],
    ['🥂','Fancy Pants','Try 2 £££ restaurants',restaurants.filter(r=>r.price==='£££'&&state.visited[r.id]).length>=2]
  ];
  return `<div class="page">${title('Eat competitively','The Dinner Club',"Your friends are lovely people. They are also obstacles between you and first place.")}
    <div class="group-layout"><section class="leaderboard"><div class="leader-head"><b>🏆 August XP leaderboard</b><small>XP never gets spent. Your dignity, however, is less secure.</small></div>${leaders.map((l,i)=>`<div class="leader ${l[0]==='Annie'?'me':''}"><span class="rank">${i+1}</span><div class="avatar">${l[3]}</div><div><b>${l[0]}</b><small>${l[2]} new restaurants this month</small></div><b>${format(l[1])} XP</b><span class="crown">${i===0?'👑':''}</span></div>`).join('')}</section>
    <section class="challenge"><span class="eyebrow">🔥 Live challenge</span><h2>Passport: Wapping Wharf</h2><p>Visit and rate four different Wapping Wharf restaurants before the end of August.</p><b>${ww} / 4</b><div class="progress"><i style="width:${Math.min(100,ww/4*100)}%"></i></div><p><b>Reward:</b> +300 XP · +100 Bites · “Cargo Crawler” badge</p></section></div>
    <div class="section-head spaced"><div><span class="eyebrow">Badges</span><h2>Bragging rights</h2></div></div><div class="badges">${badges.map(x=>`<div class="badge ${x[3]?'unlocked':'locked'}"><span class="emoji">${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small><span class="badge-state">${x[3]?'Unlocked':'In progress'}</span></div>`).join('')}</div>
  </div>`;
}

function rewardsPage(){
  const t=totals();
  return `<div class="page">${title('Spend your Bites','Rewards',"Restaurants reward useful participation, not positive scores. Hate the chips if you must; your free dessert remains emotionally neutral.")}
    <section class="wallet-hero"><div><span class="eyebrow">Your wallet</span><h2>${format(t.bites)} Bites</h2><p>You’ve earned ${format(t.earnedBites)} in total and spent ${format(t.spent)}. Your XP stays untouched when you redeem a reward.</p></div><div class="wallet-rule"><b>How rewards stay trustworthy</b><p>Restaurants can reward check-ins, photos and qualifying reviews, but never a particular star rating. They see a valid redemption — not what you said about them.</p></div></section>
    <div class="section-head spaced"><div><span class="eyebrow">Marketplace</span><h2>Trade Bites for food</h2></div></div>
    <div class="reward-grid">${rewards.map(rewardCard).join('')}</div>
    <div class="section-head spaced"><div><span class="eyebrow">Your redemptions</span><h2>Claimed rewards</h2></div></div>${state.redeemed.length?`<div class="redemption-list">${state.redeemed.map(x=>{const rw=rewards.find(r=>r.id===x.rewardId);const rr=restaurants.find(r=>r.id===rw.restaurant);return `<div><span>✓</span><p><b>${rw.title}</b><small>${rr.name} · ${x.code}</small></p><strong>${rw.cost} Bites</strong></div>`}).join('')}</div>`:'<div class="empty">Nothing redeemed yet. Your Bites are sitting there looking smug.</div>'}
    <div class="note"><b>Prototype:</b> reward stock, redemption codes and restaurant verification are simulated locally in V2. Supabase will make these real and fraud-resistant.</div>
  </div>`;
}
function rewardCard(rw){
  const r=restaurants.find(x=>x.id===rw.restaurant); const t=totals(); const done=state.redeemed.some(x=>x.rewardId===rw.id); const can=t.bites>=rw.cost && !done;
  return `<article class="reward-card"><img src="${r.image}" alt="${r.name}"><div><span class="eyebrow">${r.name}</span><h3>${rw.title}</h3><p>${rw.detail}</p><div class="reward-foot"><b>${rw.cost} Bites</b><small>${rw.stock} available this month</small></div><button class="${can?'primary':'secondary disabled'}" ${can?'': 'disabled'} onclick="redeem('${rw.id}')">${done?'Already redeemed':t.bites<rw.cost?`Need ${rw.cost-t.bites} more Bites`:'Redeem reward'}</button></div></article>`;
}
function redeem(id){
  const rw=rewards.find(x=>x.id===id); const t=totals();
  if(state.redeemed.some(x=>x.rewardId===id)||t.bites<rw.cost)return;
  const code=`BITE-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
  state.redeemed.push({rewardId:id,cost:rw.cost,code,date:new Date().toISOString()}); save(); render();
  toast(`✦ Reward unlocked — ${code}`);
}

function owners(){
  return `<div class="page">${title('Restaurant partners','Reward the behaviour — not the rating','BiteBook lets restaurants turn discovery into repeat visits without buying five-star reviews or knowing who said what.')}
    <section class="owner-hero"><div><span class="eyebrow">▣ Free during Bristol beta</span><h2>Create rewards. Reach explorers.</h2><p>Claim your profile, set a monthly reward allowance, choose what customers can redeem and see anonymous engagement. Reviews stay independent: restaurants cannot make rewards conditional on positive ratings.</p><button class="primary" onclick="toast('Restaurant onboarding is queued for the Supabase build.')">Claim your restaurant</button></div>
    <div class="dash"><div class="dash-top"><span>This month</span><b>Little French</b></div><div class="dash-stats"><div><strong>1,284</strong><span>profile views</span></div><div><strong>214</strong><span>saves</span></div><div><strong>31</strong><span>rewards claimed</span></div></div><div class="chart">${[32,46,40,66,58,80,92].map(h=>`<i style="height:${h}%"></i>`).join('')}</div></div></section>
    <div class="features"><div class="feature"><span class="ico">✦</span><b>Set Bite rewards</b><p>Offer a free side, fixed discount or perk with a monthly redemption cap.</p></div><div class="feature"><span class="ico">◉</span><b>Stay anonymous</b><p>See aggregate activity and valid redemptions without linking customers to reviews.</p></div><div class="feature"><span class="ico">🏆</span><b>Sponsor challenges</b><p>Join neighbourhood and cuisine challenges that encourage genuine discovery.</p></div><div class="feature"><span class="ico">▣</span><b>Own your profile</b><p>Update photos, description, cuisine, opening information and booking links.</p></div></div>
    <div class="note"><b>Commercial direction:</b> restaurants can eventually subscribe for enhanced profiles, richer analytics, reward campaigns and booking tools while core listings remain useful to diners.</div>
  </div>`;
}

function toggleSave(id){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];save();render()}

function openRestaurant(id){
  const r=restaurants.find(x=>x.id===id); const v=state.visited[id]||{rating:0,note:'',photo:false,checkin:false}; const earned=reviewScore(v);
  document.getElementById('modalRoot').innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><section class="modal"><button class="close" onclick="closeModal()">✕</button><img src="${r.image}" alt="${r.name}"><div class="modal-content"><span class="eyebrow">⌖ ${r.area} · ${r.cuisine}</span><h2>${r.name}</h2><p>${r.blurb}</p>${r.deal?`<div class="deal-box"><b>✦ Restaurant offer:</b> ${r.deal}</div>`:''}
    <div class="review-builder"><div class="review-head"><div><b>Build your Bite</b><small>Do more than tap five stars. Useful activity earns more.</small></div><div class="mini-earned"><b>${earned.xp} XP</b><span>${earned.bites} Bites</span></div></div>
      <button class="task-toggle ${v.checkin?'done':''}" onclick="toggleCheckin('${id}')"><span>⌖</span><div><b>${v.checkin?'Checked in':'Check in'}</b><small>+50 XP · +15 Bites</small></div><strong>${v.checkin?'✓':'+'}</strong></button>
      <div class="rating-row"><div><b>Your rating</b><small>Any honest rating earns the same reward.</small></div><div class="stars">${[1,2,3,4,5].map(n=>`<button class="${n<=v.rating?'on':''}" onclick="rate('${id}',${n})">★</button>`).join('')}</div></div>
      <label class="review-text"><span><b>Your review</b><small id="reviewHint">${(v.note||'').length>=80?'Quality threshold reached ✓':'80+ characters unlocks the quality bonus'}</small></span><textarea id="reviewNote" maxlength="500" placeholder="What did you eat? What stood out? Who would you recommend it to?">${escapeHtml(v.note||'')}</textarea><div><small id="charCount">${(v.note||'').length}/80 for full reward</small><button onclick="saveReview('${id}')">Save review</button></div></label>
      <button class="task-toggle ${v.photo?'done':''}" onclick="togglePhoto('${id}')"><span>▧</span><div><b>${v.photo?'Photo added':'Add a food photo'}</b><small>Prototype toggle · +40 XP · +20 Bites</small></div><strong>${v.photo?'✓':'+'}</strong></button>
    </div>
    <div class="modal-actions">${rewards.some(x=>x.restaurant===id)?`<button class="secondary" onclick="closeModal();setPage('rewards')">See ${r.name} rewards</button>`:''}${r.bookable?'<button class="primary" onclick="toast(\'Booking comes with the Supabase build.\')">Request a table</button>':'<span class="walkin">Walk-in / external booking</span>'}</div>
    </div></section></div>`;
  const ta=document.getElementById('reviewNote'); if(ta)ta.addEventListener('input',()=>{document.getElementById('charCount').textContent=`${ta.value.length}/80 for full reward`;document.getElementById('reviewHint').textContent=ta.value.length>=80?'Quality threshold reached ✓':'80+ characters unlocks the quality bonus';});
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function ensureVisit(id){if(!state.visited[id])state.visited[id]={rating:0,note:'',photo:false,checkin:false};return state.visited[id]}
function closeModal(){document.getElementById('modalRoot').innerHTML=''}
function rate(id,rating){const before=reviewScore(state.visited[id]);ensureVisit(id).rating=rating;save();const after=reviewScore(state.visited[id]);openRestaurant(id);renderHeader();if(after.xp>before.xp)toast(`★ +${after.xp-before.xp} XP · +${after.bites-before.bites} Bites`)}
function toggleCheckin(id){const v=ensureVisit(id);const before=reviewScore(v);v.checkin=!v.checkin;save();const after=reviewScore(v);openRestaurant(id);renderHeader();if(v.checkin)toast(`⌖ +${after.xp-before.xp} XP · +${after.bites-before.bites} Bites`)}
function togglePhoto(id){const v=ensureVisit(id);const before=reviewScore(v);v.photo=!v.photo;save();const after=reviewScore(v);openRestaurant(id);renderHeader();if(v.photo)toast(`▧ +${after.xp-before.xp} XP · +${after.bites-before.bites} Bites`)}
function saveReview(id){const v=ensureVisit(id);const before=reviewScore(v);v.note=document.getElementById('reviewNote').value.trim();save();const after=reviewScore(v);openRestaurant(id);renderHeader();const dx=after.xp-before.xp,db=after.bites-before.bites;toast(dx>0?`✎ +${dx} XP · +${db} Bites`:'Review saved')}
function renderHeader(){const t=totals();document.getElementById('topXp').textContent=`${format(t.xp)} XP`;document.getElementById('topBites').textContent=`${format(t.bites)} Bites`;document.getElementById('sidebarLevel').textContent=`Food menace · Level ${level()}`}

render();
