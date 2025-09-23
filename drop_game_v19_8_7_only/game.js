// ====== DPR & 自適應方形布局 ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const topHUD = document.getElementById("topHUD");
const controls = document.getElementById("controls");
const topScoreEl = document.getElementById("topScore");
const topTimeEl  = document.getElementById("topTime");
const topComboEl = document.getElementById("topCombo");
const btnMute    = document.getElementById("btnMute");

function setupCanvasDPR(){
  const ratio = Math.min(isTouchDevice()?2:3, Math.max(1, Math.floor(window.devicePixelRatio || 1)));
  canvas.width = 800 * ratio;
  canvas.height = 800 * ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
  ctx.imageSmoothingEnabled = true;
}
setupCanvasDPR();

function isTouchDevice(){
  return window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
const IS_TOUCH = isTouchDevice();
function layoutSquare(){
  const isTouch = isTouchDevice();
  const hudH = topHUD.hidden ? 0 : topHUD.getBoundingClientRect().height;
  const controlsH = (!controls.hidden && isTouch) ? 96 : 0;
  const margin = 12;
  const maxW = Math.min(800, document.documentElement.clientWidth - margin*2);
  const maxH = Math.min(800, window.innerHeight - hudH - controlsH - margin*2);
  const side = Math.max(260, Math.min(maxW, maxH));
  canvas.style.width = side + "px";
  canvas.style.height = side + "px";
  topHUD.style.width = side + "px";
  controls.style.width = side + "px";
}
layoutSquare();
window.addEventListener("resize", ()=>{ setupCanvasDPR(); layoutSquare(); });
window.addEventListener("orientationchange", ()=> setTimeout(layoutSquare, 300));

// ====== 菜單/語系 ======
const menu = document.getElementById("menu");
const overlayGameOver = document.getElementById("overlayGameOver");
const titleEl = document.getElementById("title");
const menuStart = document.getElementById("menuStart");
const menuHow = document.getElementById("menuHow");
const closeHow = document.getElementById("closeHow");
const finalScoreEl = document.getElementById("finalScore");
const bestScoreEl = document.getElementById("bestScore");
const diffLabelEl = document.getElementById("diffLabel");
const diffButtons = [...document.querySelectorAll(".diff")];
const timeButtons = [...document.querySelectorAll(".timebtn")];
const langButtons = [...document.querySelectorAll(".langbtn")];
const howToEl = document.getElementById("howTo");
const howTitleEl = document.getElementById("howTitle");
const howListEl = document.getElementById("howList");
const overTitleEl = document.getElementById("overTitle");

const i18n = {
  zh: { title:"掉落遊戲", start:"開始遊戲", loading:"載入中…", how:"玩法說明", close:"關閉",
        difficulty:"難度：", easy:"簡單", normal:"普通", hard:"困難",
        timeLabel:"時間：", t30:"30 秒", t60:"60 秒", lang:"語言：",
        howTitle:"玩法說明",
        howItems:[
          "操作艾克斯和巨龍移動吃東西",
          "PC：鍵盤 ← → / A D 移動；按下 Shift 觸發「極限衝刺!!」",
          "手機：點住下方 ◀ ▶ 移動；按「DASH」鍵依當前方向觸發",
          "30 或 60 秒內盡量吃高分：star +1、dog +50、sushi +200、bird +500",
          "rest -50、ban -200；吃到 dog 會讓右上角 MILLION 現身",
          "星星連擊：避開 rest/ban；每 5 顆 +500 並 +15 秒（可連續）"
        ],
        over:"時間到！", restartSame:"再玩一次（同難度）", backToMenu:"回到標題",
        score:"分數", time:"時間", best:"最佳", comboHUD:"⭐ ", dash:"極限衝刺!!" },
  ja: { title:"キャッチして食べるゲーム", start:"ゲーム開始", loading:"読み込み中…", how:"遊び方", close:"閉じる",
        difficulty:"難易度：", easy:"かんたん", normal:"ふつう", hard:"むずかしい",
        timeLabel:"時間：", t30:"30秒", t60:"60秒", lang:"言語：",
        howTitle:"遊び方",
        howItems:[
          "エクスとドラゴンを操作して落ちてくるものを食べよう",
          "PC：← → / A D で移動；Shift で「エクストリームダッシュ」",
          "スマホ：◀ ▶ で移動；「DASH」で現在方向にダッシュ",
          "30秒または60秒で高得点：スター +1、犬 +50、寿司 +200、バード +500",
          "休憩 -50、出場禁止 -200；犬を食べると右上にMILLIONが登場",
          "スター連続：rest/banを避け、5個ごとに +500 と +15秒（連続）"
        ],
        over:"時間切れ！", restartSame:"もう一度（同じ難易度）", backToMenu:"タイトルへ",
        score:"スコア", time:"時間", best:"ベスト", comboHUD:"⭐ ", dash:"エクストリームダッシュ" },
  en: { title:"Catch & Chow", start:"Start Game", loading:"Loading…", how:"How to Play", close:"Close",
        difficulty:"Difficulty:", easy:"Easy", normal:"Normal", hard:"Hard",
        timeLabel:"Time:", t30:"30s", t60:"60s", lang:"Language:",
        howTitle:"How to Play",
        howItems:[
          "Control X and the Dragon to move and eat falling items.",
          "PC: ← → / A D to move; press Shift to trigger \"Xtreme Dash!!\"",
          "Mobile: Hold ◀ ▶ to move; press the DASH button to dash",
          "Go for a high score in 30 or 60 seconds: star +1, dog +50, sushi +200, bird +500",
          "rest −50, ban −200; eating a dog makes MILLION appear top‑right",
          "Star combo: avoid rest/ban; every 5 stars +500 & +15s (chainable)"
        ],
        over:"Time Up!", restartSame:"Play Again (Same)", backToMenu:"Back to Title",
        score:"Score", time:"Time", best:"Best", comboHUD:"⭐ ", dash:"Xtreme Dash!!" }
};
let lang = localStorage.getItem("lang") || "zh";
function t(key){ return (i18n[lang] && i18n[lang][key]) || key; }
function applyLang(){
  titleEl.textContent = t("title");
  menuStart.textContent = assetsReady ? t("start") : t("loading");
  menuHow.textContent = t("how");
  diffLabelEl.textContent = t("difficulty");
  diffButtons[0].textContent = t("easy");
  diffButtons[1].textContent = t("normal");
  diffButtons[2].textContent = t("hard");
  document.getElementById("timeLabel").textContent = t("timeLabel");
  timeButtons[0].textContent = t("t30");
  timeButtons[1].textContent = t("t60");
  document.getElementById("langLabel").textContent = t("lang");
  howTitleEl.textContent = t("howTitle");
  howListEl.innerHTML = i18n[lang].howItems.map(li=>`<li>${li}</li>`).join("");
  closeHow.textContent = t("close");
  overTitleEl.textContent = t("over");
  document.getElementById("btnRestartSame").textContent = t("restartSame");
  document.getElementById("btnBackToMenu").textContent = t("backToMenu");
  topScoreEl.textContent = `${t("score")}: ${score}`;
  topTimeEl.textContent = `${t("time")}: ${Math.ceil(timeLeft)}`;
  updateComboHUD();
  langButtons.forEach(b=> b.classList.toggle("active", b.dataset.lang===lang));
}

// ====== 尺寸 ======
const SIZES = {
  ban:{w:163/2,h:81/2}, bird:{w:211/2,h:168/2}, dog:{w:265/2,h:203/2},
  mascot:{w:364/2,h:389/2},
  player_1:{w:688/2,h:373/2}, player_2:{w:688/2,h:373/2},
  player_rest:{w:688/2,h:373/2}, player_ban:{w:688/2,h:373/2}, player_bird:{w:688/2,h:373/2},
  rest:{w:163/2,h:81/2}, sushi:{w:126/2,h:113/2}, star:{w:37,h:34},
};

// ====== 圖片 ======
const IMGS = {
  bg:"images/bg.png",
  ban:"images/ban.png", ban_zh:"images/ban_zh.png", ban_ja:"images/ban_ja.png", ban_en:"images/ban_en.png",
  bird:"images/bird.png", dog:"images/dog.png", mascot:"images/mascot.png",
  player_1:"images/player_1.png", player_2:"images/player_2.png",
  player_rest:"images/player_rest.png", player_ban:"images/player_ban.png", player_bird:"images/player_bird.png",
  rest:"images/rest.png", rest_zh:"images/rest_zh.png", rest_ja:"images/rest_ja.png", rest_en:"images/rest_en.png",
  sushi:"images/sushi.png", star:"images/star.png",
};
const cache = {}; let assetsReady=false;
function preloadImages(map){
  const entries=Object.entries(map);
  return Promise.all(entries.map(([k,src])=> new Promise(res=>{
    const img=new Image();
    img.onload=()=>res([k,img]);
    img.onerror=()=>res([k,img]); // 失敗也算完成，避免卡「載入中」
    img.src=src;
  }))).then(list=>{ list.forEach(([k,img])=> cache[k]=img); });
}
function getItemImage(type){
  if(type==="rest"||type==="ban"){
    const loc=cache[`${type}_${lang}`];
    if(loc && loc.naturalWidth>0) return loc;
  }
  return cache[type];
}

// ====== 音效 ======
const sounds = {
  dog:new Audio("sounds/dog.mp3"), sushi:new Audio("sounds/sushi.mp3"), bird:new Audio("sounds/bird.mp3"),
  rest:new Audio("sounds/rest.mp3"), ban:new Audio("sounds/ban.mp3"), star:new Audio("sounds/star.mp3"),
  timeup:new Audio("sounds/timeup.mp3"), beep:new Audio("sounds/beep.mp3")
};
const bgm=new Audio("sounds/bgm.mp3"); bgm.loop=true; bgm.volume=0.4;
let muted = localStorage.getItem("muted")==="1";
function updateMuteUI(){ btnMute.textContent = muted ? "🔇" : "🔊"; bgm.muted = muted; }
updateMuteUI();
btnMute.addEventListener("click", ()=>{ muted=!muted; localStorage.setItem("muted", muted?"1":"0"); updateMuteUI(); if(muted) bgm.pause(); else if(state==="playing") startBGM(); });

// Small author label left to the mute button
(function(){
  try{
    let tag = document.getElementById('authorTag');
    if(!tag){
      tag = document.createElement('div');
      tag.id = 'authorTag';
      tag.textContent = 'X@kaixxxten';
      btnMute.parentNode.insertBefore(tag, btnMute);
    }
  }catch(e){}
})();


// --- Low‑latency audio pool to avoid lag on mobile ---
const audioPools = {};
function buildPool(name, size=4){
  const base = sounds[name]; if(!base) return;
  const pool = []; for(let i=0;i<size;i++){ const a=base.cloneNode(); a.preload="auto"; a.volume=0.8; pool.push(a); }
  audioPools[name] = {pool, idx:0};
}
["dog","sushi","bird","rest","ban","star","timeup","beep"].forEach(k=>buildPool(k,4));
function playSound(n){ if(muted) return; const P=audioPools[n]; if(!P) return; const a=P.pool[P.idx=(P.idx+1)%P.pool.length]; try{ a.currentTime=0; a.play(); }catch(e){} }
function startBGM(){ if(!muted){ try{ bgm.currentTime=0; bgm.play(); }catch(e){} } }
function stopBGM(){ try{ bgm.pause(); }catch(e){} }

// ====== 遊戲狀態 ======
let state="menu", score=0, timeLeft=30, spawnTimer=0, items=[], mascot={visible:false,timer:0};
let popups=[], difficulty="normal", gameDuration=30, prevSecond=null, timeupPlayed=false, paused=false;
let reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let starStreak=0, iFramesUntil=0;

// Dash（Shift 或 DASH 鈕）
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnDash = document.getElementById("btnDash");
const DASH = { duration:180, speed:900, cooldown:380 };
let dash = { active:false, dir:0, timer:0, cooldownUntil:0 };
let leftPressed=false, rightPressed=false, lastDir=+1;

// 難度參數
const DIFF={ easy:{initVy:60,gravity:80}, normal:{initVy:180,gravity:240}, hard:{initVy:280,gravity:380} };
const TIME_CFG = { easy:0, normal:3, hard:8 };
const MAX_EXTRA_TIME = 15;

// 玩家
const player={ x:(800 - SIZES.player_1.w)/2, y:800 - SIZES.player_1.h, w:SIZES.player_1.w, h:SIZES.player_1.h,
  toggle:false, mode:null, modeTimer:0,
  get img(){ if(this.mode==="rest" && cache.player_rest?.naturalWidth>0) return cache.player_rest;
             if(this.mode==="ban"  && cache.player_ban ?.naturalWidth>0) return cache.player_ban;
             if(this.mode==="bird" && cache.player_bird?.naturalWidth>0) return cache.player_bird;
             return this.toggle?cache.player_2:cache.player_1; } };

// 物件
const ITEM_RULES={ star:{score:+1,size:()=>SIZES.star}, dog:{score:+50,size:()=>SIZES.dog}, sushi:{score:+200,size:()=>SIZES.sushi}, bird:{score:+500,size:()=>SIZES.bird}, rest:{score:-50,size:()=>SIZES.rest}, ban:{score:-200,size:()=>SIZES.ban} };
function weightFor(type){ if(type==="star"){ if(difficulty==="easy") return 3; if(difficulty==="normal") return 2; return 1; } return 1; }
function pickWeightedKey(){ const keys=Object.keys(ITEM_RULES); let t=0,w={}; for(const k of keys){w[k]=weightFor(k); t+=w[k];} let r=Math.random()*t; for(const k of keys){ r-=w[k]; if(r<0) return k; } return "dog"; }

// ====== 碰撞（柔性） ======
function shrinkRect(x,y,w,h,s){ const dx=w*s, dy=h*s; return {x:x+dx,y:y+dy,w:w-2*dx,h:h-2*dy}; }
function overlap(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }
function smartCollide(player,it){
  const sA=0.22, sB=(it.type==='rest'||it.type==='ban')?0.35:0.18;
  return overlap(shrinkRect(player.x,player.y,player.w,player.h,sA),
                 shrinkRect(it.x,it.y,it.w,it.h,sB));
}

// ====== 產生物件（左右安全距 + 負面避玩家 + 負面稍慢） ======
let lastSpawnX=null;
function spawnItem(){
  const key=pickWeightedKey(); const sz=ITEM_RULES[key].size(); const {initVy}=DIFF[difficulty];
  const negative=(key==='rest'||key==='ban');

  // 邊界安全距：考慮玩家碰撞縮小（0.22w）與一點餘裕，避免貼邊吃不到
  const edgeMargin = Math.max(24, Math.round(SIZES.player_1.w * 0.28)); // 約 96px
  const minX = edgeMargin;
  const maxX = 800 - sz.w - edgeMargin;

  let x=0, tries=0;
  const minDX=120;
  const avoidCenter=player.x+player.w/2;
  const avoidRadius=player.w*0.95;
  do{
    x = minX + Math.random() * Math.max(0, maxX - minX);
    const farFromLast=(lastSpawnX===null)||Math.abs(x-lastSpawnX)>=minDX;
    const farFromPlayer=!negative || Math.abs((x+sz.w/2)-avoidCenter)>=avoidRadius;
    if(farFromLast && farFromPlayer) break;
    tries++;
  }while(tries<50);

  lastSpawnX=x;
  const negMulInit = (difficulty==="hard") ? 1.25 : (difficulty==="normal" ? 1.15 : 1.0);
  const negMulG = (difficulty==="hard") ? 1.35 : (difficulty==="normal" ? 1.20 : 1.0);
  const vy0=initVy*(negative?negMulInit:1.0);
  const gMul=negative?negMulG:1.0;
  items.push({type:key,x,y:-sz.h,w:sz.w,h:sz.h,vy:vy0,gMul});
}

// ====== 控制 ======
document.addEventListener("keydown",e=>{
  if(state==="menu"&&(e.key==="Enter"||e.key===" ")) startGame();
  if(state==="gameover"&&(e.key==="Enter"||e.key===" ")) goToMenu();
  if(state!=="playing"||paused) return;
  if(e.key==="ArrowLeft"||e.code==="KeyA"){ leftPressed=true; lastDir=-1; }
  if(e.key==="ArrowRight"||e.code==="KeyD"){ rightPressed=true; lastDir=+1; }
  if(e.key==="Shift"||e.code==="ShiftLeft"||e.code==="ShiftRight"){
    const dir = leftPressed ? -1 : (rightPressed ? +1 : lastDir||+1); triggerDash(dir);
  }
});
document.addEventListener("keyup",e=>{
  if(e.key==="ArrowLeft"||e.code==="KeyA"){ leftPressed=false; }
  if(e.key==="ArrowRight"||e.code==="KeyD"){ rightPressed=false; }
});

function preventTouch(handler){ return (e)=>{ e.preventDefault(); handler(); }; }
btnLeft.addEventListener("touchstart", preventTouch(()=>{ leftPressed=true; lastDir=-1; }), {passive:false});
btnLeft.addEventListener("touchend",   preventTouch(()=>{ leftPressed=false; }), {passive:false});
btnRight.addEventListener("touchstart",preventTouch(()=>{ rightPressed=true; lastDir=+1; }), {passive:false});
btnRight.addEventListener("touchend",  preventTouch(()=>{ rightPressed=false; }), {passive:false});
btnDash.addEventListener("touchstart", preventTouch(()=>{ const dir = leftPressed ? -1 : (rightPressed ? +1 : lastDir||+1); triggerDash(dir); }), {passive:false});
btnDash.addEventListener("click", ()=>{ const dir = leftPressed ? -1 : (rightPressed ? +1 : lastDir||+1); triggerDash(dir); });

// ====== Dash ======
function triggerDash(dir){
  const now=performance.now(); if(now<dash.cooldownUntil) return;
  dash.active=true; dash.dir=dir; dash.timer=DASH.duration; dash.cooldownUntil=now + DASH.cooldown;
  const headX=player.x+player.w/2, headY=player.y-12;
  popups.push({type:"dash", x:headX, y:headY, alpha:1, ttl:620});
  playSound("beep");
}

// ====== 可見性暫停 ======
document.addEventListener("visibilitychange", ()=>{
  if(document.hidden && state==="playing"){ paused=true; stopBGM(); }
  else if(!document.hidden && state==="playing"){ paused=false; startBGM(); lastTS=performance.now(); }
});

// ====== HUD ======
function setHUDVisible(v){ topHUD.hidden=!v; layoutSquare(); }
function setPlayingFlag(on){ document.body.classList.toggle('playing', !!on); }
function updateComboHUD(){ topComboEl.textContent = `${i18n[lang].comboHUD}${starStreak}`; }

// ====== 預載 & 綁定 ======
preloadImages(IMGS).then(()=>{
  assetsReady=true;
  menuStart.disabled=false;
  menuStart.textContent = t("start");
}).finally(()=>{ applyLang(); });
// 兩秒容錯：就算有檔案 404 也別卡住
setTimeout(()=>{ if(menuStart.disabled){ menuStart.disabled=false; menuStart.textContent=t("start"); } }, 2000);

menuHow.addEventListener("click", ()=> howToEl.hidden=false );
closeHow.addEventListener("click", ()=> howToEl.hidden=true );
menuStart.addEventListener("click", ()=>{ if(!assetsReady){ /* 還是可以開始 */ } startGame(); });
diffButtons.forEach(btn=> btn.addEventListener("click", ()=>{ diffButtons.forEach(b=>b.classList.remove("active")); btn.classList.add("active"); difficulty=btn.dataset.d; }));
timeButtons.forEach(btn=> btn.addEventListener("click", ()=>{ timeButtons.forEach(b=>b.classList.remove("active")); btn.classList.add("active"); gameDuration=parseInt(btn.dataset.t,10); }));
langButtons.forEach(btn=> btn.addEventListener("click", ()=>{ lang=btn.dataset.lang; localStorage.setItem("lang",lang); applyLang(); }));
document.getElementById("btnRestartSame").addEventListener("click", ()=>{ overlayGameOver.classList.remove("show"); startGame(); });
document.getElementById("btnBackToMenu").addEventListener("click", ()=> goToMenu() );

// ====== 主流程 ======
let FIXED_DT = 1000/60; let lastTS=0, acc=0;
let hurtFlash=0, hurtDecayMs=300;
const fx=document.createElement("canvas"); const fxCtx=fx.getContext("2d"); fx.width=SIZES.player_1.w; fx.height=SIZES.player_1.h;
function addHurtFlash(ms=300,s=1){ hurtFlash=Math.min(1,s); hurtDecayMs=ms; }

function startGame(){
  setPlayingFlag(true);
  state="playing"; score=0; timeLeft=gameDuration; items=[]; mascot.visible=false; popups=[];
  prevSecond=null; timeupPlayed=false; paused=false; spawnTimer=0;
  player.mode=null; player.modeTimer=0; starStreak=0; iFramesUntil=0; hurtFlash=0;
  leftPressed=false; rightPressed=false; lastDir=+1; dash.active=false; dash.timer=0; dash.cooldownUntil=0;
  menu.classList.remove("show"); overlayGameOver.classList.remove("show");
  setHUDVisible(true); controls.hidden = !isTouchDevice(); layoutSquare(); startBGM();
}

function goToMenu(){
  setPlayingFlag(false);
  state="menu"; items=[]; popups=[]; mascot.visible=false;
  stopBGM(); setHUDVisible(false); controls.hidden = true; layoutSquare();
  menu.classList.add("show"); overlayGameOver.classList.remove("show");
}

requestAnimationFrame(loop);
function loop(ts){
  requestAnimationFrame(loop);
  if(!lastTS) lastTS=ts;
  let dt=ts-lastTS; lastTS=ts; if(dt>100) dt=100;
  acc+=dt;
  while(acc>=FIXED_DT){ step(FIXED_DT); acc-=FIXED_DT; }
  render(ts);
}

function step(dt){
  if(state!=="playing"||paused) return;
  spawnTimer += dt; const spawnEvery=1000; if(spawnTimer>spawnEvery){ spawnItem(); spawnTimer=0; }
  if(mascot.visible){ mascot.timer--; if(mascot.timer<=0) mascot.visible=false; }

  const {gravity}=DIFF[difficulty];
  for(let i=items.length-1;i>=0;i--){
    const it=items[i];
    let gAdd = gravity*(it.gMul||1);
    if(it.type==='rest'||it.type==='ban'){
      const px = player.x + player.w/2; const ix = it.x + it.w/2;
      const dx = Math.abs(ix - px); const maxDX = Math.max(1, player.w*0.9);
      let close = 1 - Math.min(dx/maxDX, 1);
      const boost = 1 + close * (difficulty==="hard" ? 0.70 : (difficulty==="normal" ? 0.45 : 0.0));
      gAdd *= boost;
    }
    it.vy += gAdd*(dt/1000); it.y += it.vy*(dt/1000);
    const neg=(it.type==='rest'||it.type==='ban'); const canHit=!neg || performance.now()>=iFramesUntil;
    if(canHit && smartCollide(player,it)){
      const val=ITEM_RULES[it.type].score; score+=val; playSound(it.type);
      if(it.type==="star"){
        starStreak++; if(starStreak%5===0){ score+=500; const tBonus = TIME_CFG[difficulty]||0; timeLeft = Math.min(timeLeft + tBonus, gameDuration + MAX_EXTRA_TIME); playSound("beep"); popups.push({type:"text",x:it.x+it.w/2,y:it.y-18,text:"+500",alpha:1,color:"#FFD84D",size:36}); if(tBonus>0){ popups.push({type:"text",x:it.x+it.w/2,y:it.y-42,text:`+${tBonus}s`,alpha:1,color:"#00C853",size:28}); } }
        popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:"+1",alpha:1,color:"#FFD84D",size:26});
        const hx=player.x+player.w/2, hy=player.y-8; popups.push({type:"text",x:hx,y:hy,text:`⭐×${starStreak}`,alpha:1,color:"#00C853",size:18});
        updateComboHUD();
      }else{
        if(it.type==="bird"){ player.mode="bird"; player.modeTimer=420; popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:"+500",alpha:1,color:"#28a745",size:28}); }
        else if(val>0){ player.toggle=true; setTimeout(()=>player.toggle=false,120); popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:`+${val}`,alpha:1,color:"#28a745",size:28}); }
        else{ starStreak=0; updateComboHUD(); iFramesUntil=performance.now()+650; if(it.type==="rest"){ player.mode="rest"; player.modeTimer=360; addHurtFlash(420,0.9);} else {player.mode="ban"; player.modeTimer=520; addHurtFlash(700,1);} popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:`${val}`,alpha:1,color:"#dc3545",size:28}); }
      }
      if(it.type==="dog"){ mascot.visible=true; mascot.timer=90; }
      items.splice(i,1);
    }else if(it.y>800){ items.splice(i,1); }
  }

  // 模式衰減 & 閃紅
  if(player.modeTimer>0){ player.modeTimer-=dt; if(player.modeTimer<=0) player.mode=null; }
  if(hurtFlash>0){ hurtFlash=Math.max(0, hurtFlash - dt/Math.max(1,hurtDecayMs)); }

  // 位移
  if(dash.active){ player.x += dash.dir*(DASH.speed*(dt/1000)); dash.timer-=dt; if(dash.timer<=0) dash.active=false; }
  else{ const move=0.45*dt; if(leftPressed) player.x -= move; if(rightPressed) player.x += move; }
  player.x=Math.max(0, Math.min(800-player.w, player.x));

  // 倒數
  timeLeft -= dt/1000; const sec=Math.ceil(timeLeft);
  if(sec!==prevSecond){ if(sec>0 && sec<=3) playSound("beep"); prevSecond=sec; }
  if(timeLeft<0){
    timeLeft=0; if(!timeupPlayed){ playSound("timeup"); timeupPlayed=true; } stopBGM();
    state="gameover"; const key=`bestScore_${difficulty}_${gameDuration}`; const best=Math.max(score, parseInt(localStorage.getItem(key)||"0",10)); if(score>best) localStorage.setItem(key,String(score));
    finalScoreEl.textContent=`${t("score")}: ${score}`; bestScoreEl.textContent=`${t("best")}: ${best}`;
    overlayGameOver.classList.add("show"); setHUDVisible(false); controls.hidden=true; layoutSquare();
  }
  topScoreEl.textContent=`${t("score")}: ${score}`; topTimeEl.textContent=`${t("time")}: ${Math.ceil(timeLeft)}`;
}

function dimgRound(img,x,y,w,h){ ctx.drawImage(img, Math.round(x), Math.round(y), w, h); }
function dimgFloat(img,x,y,w,h){ ctx.drawImage(img, x, y, w, h); }

function roundRect(ctx,x,y,w,h,r){ const rr=Math.min(r,w/2,h/2); ctx.beginPath(); ctx.moveTo(x+rr,y); ctx.arcTo(x+w,y,x+w,y+h,rr); ctx.arcTo(x+w,y+h,x,y+h,rr); ctx.arcTo(x,y+h,x,y,rr); ctx.arcTo(x,y,x+w,y,rr); ctx.closePath(); }

function render(ts){
  // 背景
  if(cache.bg && cache.bg.naturalWidth>0){ dimgRound(cache.bg, 0, 0, 800, 800); }
  else{ ctx.clearRect(0,0,800,800); ctx.fillStyle="#fff"; ctx.fillRect(0,0,800,800); }

  // MILLION（淡入淡出）
  if(mascot.visible){
    const m=SIZES.mascot; let a=1;
    if(!reduceMotion){ if(mascot.timer>60){a=1-(mascot.timer-60)/30;} else if(mascot.timer<30){a=mascot.timer/30;} }
    ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,a));
    if(cache.mascot?.naturalWidth>0) dimgRound(cache.mascot, 800-m.w, 0, m.w, m.h); ctx.restore();
  }

  // 掉落物（星星改黃光）
  for(const it of items){
    const img=getItemImage(it.type);
    if(img?.naturalWidth>0){
      if(it.type==="star" && !reduceMotion && !IS_TOUCH){
        ctx.save();
        const glow=6+3*Math.sin(ts*0.02+it.x*0.05);
        const a=0.88+0.12*Math.sin(ts*0.03+it.y*0.03);
        ctx.globalAlpha=a; ctx.shadowBlur=glow; ctx.shadowColor="rgba(255,215,0,0.95)"; // 黃金色
        dimgFloat(img, it.x, it.y, it.w, it.h);
        ctx.restore();
      }else{
        dimgFloat(img, it.x, it.y, it.w, it.h);
      }
    }
  }

  // 飄字 & Dash 標籤（半尺寸）
  for(let i=popups.length-1;i>=0;i--){
    const p=popups[i];
    if(p.type==="dash"){
      const text=i18n[lang].dash, padX=7, bh=16;
      ctx.save(); ctx.font="bold 11px Arial"; const w=ctx.measureText(text).width + padX*2;
      const x=p.x - w/2, y=p.y - bh; ctx.globalAlpha=0.9*p.alpha;
      ctx.fillStyle="#000"; ctx.strokeStyle="#00FF7F"; ctx.lineWidth=2;
      roundRect(ctx,x,y,w,bh,5); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#00FF7F"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(text, p.x, y+bh/2+0.5);
      ctx.restore(); p.ttl-=16.6; p.alpha-=0.02; if(p.ttl<=0||p.alpha<=0) popups.splice(i,1);
    }else{
      ctx.save(); ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color||"#28a745";
      let _fs = (p.size||26); if(IS_TOUCH && /ダッシュ|Dash|衝刺/.test(p.text)) _fs = Math.floor(_fs*1.6);
      ctx.font = `bold ${_fs}px Arial`; ctx.textAlign="center";
      if(!IS_TOUCH){ ctx.lineWidth=3; ctx.strokeStyle="rgba(0,0,0,0.35)"; ctx.strokeText(p.text,p.x,p.y); }
      ctx.fillText(p.text,p.x,p.y); ctx.restore();
      p.y-=0.5; p.alpha-=0.015; if(p.alpha<=0) popups.splice(i,1);
    }
  }

  // 玩家與受傷疊色
  const pimg=player.img; if(pimg?.naturalWidth>0) dimgRound(pimg, player.x, player.y, player.w, player.h);
  if(hurtFlash>0 && pimg?.naturalWidth>0){
    const alpha = 0.35 * Math.min(1,hurtFlash);
    fx.width = player.w; fx.height = player.h;
    fxCtx.clearRect(0,0,fx.width,fx.height);
    fxCtx.drawImage(pimg,0,0,player.w,player.h);
    fxCtx.globalCompositeOperation="source-atop";
    fxCtx.fillStyle=`rgba(255,0,51,${alpha})`;
    fxCtx.fillRect(0,0,fx.width,fx.height);
    ctx.drawImage(fx, Math.round(player.x), Math.round(player.y));
  }
}

// ====== 菜單控制 ======