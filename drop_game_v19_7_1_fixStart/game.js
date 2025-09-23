// ====== 基本設定（DPR 銳利化） ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
function setupCanvasDPR(){
  const ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  canvas.style.width = "800px";
  canvas.style.height = "800px";
  canvas.width = 800 * ratio;
  canvas.height = 800 * ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
  ctx.imageSmoothingEnabled = true;
}
setupCanvasDPR();

// Top HUD
const topScoreEl = document.getElementById("topScore");
const topTimeEl = document.getElementById("topTime");
const topComboEl = document.getElementById("topCombo");
const btnMute = document.getElementById("btnMute");
const topHUD = document.getElementById("topHUD");

// Menu refs
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
const btnRestartSame = document.getElementById("btnRestartSame");
const btnBackToMenu = document.getElementById("btnBackToMenu");

const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnDash = document.getElementById("btnDash");

const W = 800, H = 800;

// ====== 多語系 ======
const i18n = {
  zh: {
    title: "掉落遊戲",
    start: "開始遊戲",
    loading: "載入中…",
    how: "玩法說明",
    close: "關閉",
    difficulty: "難度：",
    easy: "簡單", normal: "普通", hard: "困難",
    timeLabel: "時間：", t30: "30 秒", t60: "60 秒",
    lang: "語言：",
    howTitle: "玩法說明",
    howItems: [
      "操作艾克斯和巨龍移動吃東西",
      "PC：鍵盤 ← → / A D 移動；按下 Shift（依當前/最後方向）觸發「極限衝刺!!」",
      "手機：點住下方 ◀ ▶ 移動；按「DASH」鍵依當前方向觸發",
      "在 30 或 60 秒內盡量吃高分：star +1、dog +50、sushi +200、bird +500",
      "rest -50、ban -200；吃到 dog 會讓右上角 MILLION 現身",
      "星星連擊：避開 rest/ban；每累積 5 顆額外 +500（可連續觸發）"
    ],
    over: "時間到！", restartSame: "再玩一次（同難度）", backToMenu: "回到標題",
    score: "分數", time: "時間", best: "最佳", comboHUD: "⭐ ",
    dash: "極限衝刺!!"
  },
  ja: {
    title: "キャッチして食べるゲーム",
    start: "ゲーム開始", loading: "読み込み中…",
    how: "遊び方", close: "閉じる",
    difficulty: "難易度：", easy:"かんたん", normal:"ふつう", hard:"むずかしい",
    timeLabel: "時間：", t30:"30秒", t60:"60秒",
    lang: "言語：",
    howTitle: "遊び方",
    howItems: [
      "エクスとドラゴンを操作して落ちてくるものを食べよう",
      "PC：キーボード ← → / A D で移動；Shift で「エクストリームダッシュ」",
      "スマホ：下の ◀ ▶ ボタンで移動；「DASH」ボタンで現在方向にダッシュ",
      "30秒または60秒で高得点を狙おう：スター +1、犬 +50、寿司 +200、バード +500",
      "休憩 -50、出場禁止 -200；犬を食べると右上にミリオンさんが登場",
      "スターコンボ：rest/ban に当たらなければ、5個ごとに +500（連続発動）"
    ],
    over: "時間切れ！", restartSame:"もう一度（同じ難易度）", backToMenu:"タイトルへ",
    score:"スコア", time:"時間", best:"ベスト", comboHUD:"⭐ ",
    dash: "エクストリームダッシュ"
  },
  en: {
    title: "Catch & Chow",
    start: "Start Game", loading: "Loading…",
    how: "How to Play", close: "Close",
    difficulty: "Difficulty:", easy:"Easy", normal:"Normal", hard:"Hard",
    timeLabel: "Time:", t30:"30s", t60:"60s",
    lang: "Language:",
    howTitle: "How to Play",
    howItems: [
      "Control X and the Dragon to move and eat falling items.",
      "PC: Use ← → / A D to move; press Shift to trigger \"Xtreme Dash!!\"",
      "Mobile: Hold ◀ ▶ to move; press the DASH button to dash in the current direction",
      "Go for a high score in 30 or 60 seconds: star +1, dog +50, sushi +200, bird +500",
      "rest −50, ban −200; eating a dog makes MILLION appear in the top‑right",
      "Star combo: avoid rest/ban; every 5 stars adds +500 (chainable)"
    ],
    over: "Time Up!", restartSame:"Play Again (Same)", backToMenu:"Back to Title",
    score:"Score", time:"Time", best:"Best", comboHUD:"⭐ ",
    dash: "Xtreme Dash!!"
  }
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
  btnRestartSame.textContent = t("restartSame");
  btnBackToMenu.textContent = t("backToMenu");
  topScoreEl.textContent = `${t("score")}: ${score}`;
  topTimeEl.textContent = `${t("time")}: ${Math.ceil(timeLeft)}`;
  updateComboHUD();
  langButtons.forEach(b=> b.classList.toggle("active", b.dataset.lang===lang));
}

// ====== 尺寸（星星 50%） ======
const SIZES = {
  ban:   { w:163/2, h:81/2 },
  bird:  { w:211/2, h:168/2 },
  dog:   { w:265/2, h:203/2 },
  mascot:{ w:364/2, h:389/2 },
  player_1:{ w:688/2, h:373/2 },
  player_2:{ w:688/2, h:373/2 },
  player_rest:{ w:688/2, h:373/2 },
  player_ban:{ w:688/2, h:373/2 },
  player_bird:{ w:688/2, h:373/2 },
  rest:  { w:163/2, h:81/2 },
  sushi: { w:126/2, h:113/2 },
  star:  { w:37, h:34 },
};

// ====== 圖片 ======
const IMGS = {
  ban: "images/ban.png",
  ban_zh: "images/ban_zh.png",
  ban_ja: "images/ban_ja.png",
  ban_en: "images/ban_en.png",
  bird: "images/bird.png",
  dog: "images/dog.png",
  mascot: "images/mascot.png",
  player_1: "images/player_1.png",
  player_2: "images/player_2.png",
  player_rest: "images/player_rest.png",
  player_ban: "images/player_ban.png",
  player_bird: "images/player_bird.png",
  rest: "images/rest.png",
  rest_zh: "images/rest_zh.png",
  rest_ja: "images/rest_ja.png",
  rest_en: "images/rest_en.png",
  sushi: "images/sushi.png",
  star: "images/star.png",
};
const cache = {};
let assetsReady = false;
function preloadImages(map){
  const entries = Object.entries(map);
  const promises = entries.map(([k,src])=> new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>resolve([k,img]);
    img.onerror = ()=>{ resolve([k,img]); };
    img.src = src;
  }));
  return Promise.all(promises).then(list=>{
    list.forEach(([k,img])=> cache[k]=img);
    if(cache.star && cache.star.naturalWidth>0){
      SIZES.star = { w: cache.star.naturalWidth/2, h: cache.star.naturalHeight/2 };
    }
  });
}
function getItemImage(type){
  if(type==="rest" || type==="ban"){
    const locKey = `${type}_${lang}`;
    const locImg = cache[locKey];
    if(locImg && locImg.complete && locImg.naturalWidth>0) return locImg;
  }
  return cache[type];
}

// ====== 音效 ======
const sounds = {
  dog:   new Audio("sounds/dog.mp3"),
  sushi: new Audio("sounds/sushi.mp3"),
  bird:  new Audio("sounds/bird.mp3"),
  rest:  new Audio("sounds/rest.mp3"),
  ban:   new Audio("sounds/ban.mp3"),
  star:  new Audio("sounds/star.mp3"),
  timeup:new Audio("sounds/timeup.mp3"),
  beep:  new Audio("sounds/beep.mp3"),
};
const bgm = new Audio("sounds/bgm.mp3");
bgm.loop = true; bgm.volume = 0.4;
let muted = localStorage.getItem("muted") === "1";
function updateMuteUI(){ btnMute.textContent = muted ? "🔇" : "🔊"; bgm.muted = muted; }
updateMuteUI();
btnMute.addEventListener("click", ()=>{
  muted = !muted; localStorage.setItem("muted", muted ? "1" : "0"); updateMuteUI();
  if(muted) { try{ bgm.pause(); }catch(e){} } else { if(state==="playing") startBGM(); }
});
function playSound(name){
  if(muted) return;
  const src = sounds[name]; if(!src) return;
  try{ const a = src.cloneNode(); a.volume = 0.8; a.play(); }catch(e){}
}
function startBGM(){ if(!muted) { try{ bgm.currentTime=0; bgm.volume=0.4; bgm.play(); }catch(e){} } }
function stopBGM(){ try{ bgm.pause(); }catch(e){} }

// ====== 遊戲狀態 ======
let state="menu",score=0,timeLeft=30,spawnTimer=0,items=[],mascot={visible:false,timer:0};
let popups=[];
let difficulty = "normal";
let gameDuration = 30;
let prevSecond = null;
let timeupPlayed = false;
let paused = false;
let reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// star 連擊總數（不中斷；負面才清零）
let starStreak = 0;

// 無敵時間（負面命中後 650ms）
let iFramesUntil = 0;

// Dash（Shift 或 DASH 鈕）
const DASH = { duration:180, speed:900, cooldown:380 };
let dash = { active:false, dir:0, timer:0, cooldownUntil:0 };
let leftPressed=false, rightPressed=false, lastDir=+1;

// 本機最佳分數（依難度與時長）
function keyBest(){ return `bestScore_${difficulty}_${gameDuration}`; }
function getBest(){ return parseInt(localStorage.getItem(keyBest())||"0",10); }
function setBest(v){ localStorage.setItem(keyBest(), String(v)); }

const DIFF = {
  easy:   { initVy: 60,  gravity: 80  },
  normal: { initVy: 100, gravity: 120 },
  hard:   { initVy: 150, gravity: 180 },
};

// 玩家
const player={
  x:(W - SIZES.player_1.w)/2, y:H - SIZES.player_1.h,
  w:SIZES.player_1.w, h:SIZES.player_1.h,
  toggle:false, mode:null, modeTimer:0,
  get img(){
    if(this.mode==="rest" && cache.player_rest?.naturalWidth>0) return cache.player_rest;
    if(this.mode==="ban"  && cache.player_ban ?.naturalWidth>0) return cache.player_ban;
    if(this.mode==="bird" && cache.player_bird?.naturalWidth>0) return cache.player_bird;
    return this.toggle?cache.player_2:cache.player_1;
  }
};

// 物件
const ITEM_RULES={
  star:{score:+1, size:()=>SIZES.star},
  dog:{score:+50,size:()=>SIZES.dog},
  sushi:{score:+200,size:()=>SIZES.sushi},
  bird:{score:+500,size:()=>SIZES.bird},
  rest:{score:-50,size:()=>SIZES.rest},
  ban:{score:-200,size:()=>SIZES.ban},
};

// 權重（星星：Easy=3, Normal=2, Hard=1；其餘 1）
function weightFor(type){
  if(type==="star"){
    if(difficulty==="easy") return 3;
    if(difficulty==="normal") return 2;
    return 1; // hard
  }
  return 1;
}
function pickWeightedKey(){
  const keys = Object.keys(ITEM_RULES);
  let total=0, wts={};
  for(const k of keys){ const w=weightFor(k); wts[k]=w; total+=w; }
  let r=Math.random()*total;
  for(const k of keys){ r-=wts[k]; if(r<0) return k; }
  return "dog";
}

// ====== 碰撞（柔性 hitbox） ======
function shrinkRect(x,y,w,h,shrink){ const dx=w*shrink, dy=h*shrink; return {x:x+dx, y:y+dy, w:w-2*dx, h:h-2*dy}; }
function overlap(a,b){ return a.x<b.x+b.w && a.x+a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y; }
function smartCollide(player,it){
  const sA = 0.22; // 玩家縮小 22%
  const sB = (it.type==='rest'||it.type==='ban') ? 0.35 : 0.18; // 負面更小
  const A = shrinkRect(player.x,player.y,player.w,player.h,sA);
  const B = shrinkRect(it.x,it.y,it.w,it.h,sB);
  return overlap(A,B);
}

// ====== 產生物件（負面避開玩家；負面速度更慢） ======
let lastSpawnX = null;
function spawnItem(){
  const key = pickWeightedKey();
  const sz = ITEM_RULES[key].size();
  const {initVy} = DIFF[difficulty];
  const negative = (key==='rest'||key==='ban');

  let x=0, tries=0;
  const minDX = 120;
  const avoidCenter = player.x + player.w/2;
  const avoidRadius = player.w * 0.95;

  do{
    x = Math.random()*(W - sz.w);
    const farFromLast = (lastSpawnX===null) || Math.abs(x - lastSpawnX) >= minDX;
    const farFromPlayer = !negative || Math.abs((x+sz.w/2) - avoidCenter) >= avoidRadius;
    if(farFromLast && farFromPlayer) break;
    tries++;
  }while(tries<40);

  lastSpawnX = x;
  const vy0 = initVy * (negative ? 0.9 : 1.0);
  const gMul = negative ? 0.85 : 1.0;

  items.push({type:key,x,y:-sz.h,w:sz.w,h:sz.h,vy:vy0,gMul});
}

// 助手
function dimgRound(img,x,y,w,h){ ctx.drawImage(img, Math.round(x), Math.round(y), w, h); }
function dimgFloat(img,x,y,w,h){ ctx.drawImage(img, x, y, w, h); }

// Dash
function triggerDash(dir){
  const now = performance.now();
  if(now < dash.cooldownUntil) return;
  dash.active = true; dash.dir = dir; dash.timer = DASH.duration; dash.cooldownUntil = now + DASH.cooldown;
  // 50% 小的黑框綠字
  const headX = player.x + player.w/2, headY = player.y - 12;
  popups.push({type:"dash", x:headX, y:headY, alpha:1, ttl:620});
  playSound("beep");
}

// 鍵盤控制（Shift 觸發）
document.addEventListener("keydown",e=>{
  if(state==="menu"&&(e.key==="Enter"||e.key===" ")) startGame();
  if(state==="gameover"&&(e.key==="Enter"||e.key===" ")) goToMenu();
  if(state!=="playing" || paused) return;
  if(e.key==="ArrowLeft"||e.code==="KeyA"){ leftPressed=true; lastDir=-1; }
  if(e.key==="ArrowRight"||e.code==="KeyD"){ rightPressed=true; lastDir=+1; }
  if(e.key==="Shift"||e.code==="ShiftLeft"||e.code==="ShiftRight"){
    const dir = leftPressed ? -1 : (rightPressed ? +1 : lastDir||+1);
    triggerDash(dir);
  }
});
document.addEventListener("keyup",e=>{
  if(e.key==="ArrowLeft"||e.code==="KeyA"){ leftPressed=false; }
  if(e.key==="ArrowRight"||e.code==="KeyD"){ rightPressed=false; }
});

// 手機控制 + DASH 鈕
function preventTouch(handler){ return (e)=>{ e.preventDefault(); handler(); }; }
btnLeft.addEventListener("touchstart", preventTouch(()=>{ leftPressed=true; lastDir=-1; }), {passive:false});
btnLeft.addEventListener("touchend",   preventTouch(()=>{ leftPressed=false; }), {passive:false});
btnRight.addEventListener("touchstart",preventTouch(()=>{ rightPressed=true; lastDir=+1; }), {passive:false});
btnRight.addEventListener("touchend",  preventTouch(()=>{ rightPressed=false; }), {passive:false});
btnDash.addEventListener("touchstart", preventTouch(()=>{
  const dir = leftPressed ? -1 : (rightPressed ? +1 : lastDir||+1); triggerDash(dir);
}), {passive:false});
btnDash.addEventListener("click", ()=>{
  const dir = leftPressed ? -1 : (rightPressed ? +1 : lastDir||+1); triggerDash(dir);
});

// 自動暫停
document.addEventListener("visibilitychange", ()=>{
  if(document.hidden && state==="playing"){ paused = true; stopBGM(); }
  else if(!document.hidden && state==="playing"){ paused=false; startBGM(); lastTS=performance.now(); }
});
function setHUDVisible(v){ topHUD.hidden=!v; }

// ====== 預載 & 菜單 Wiring（v19.7 修正載入中） ======
preloadImages(IMGS).then(()=>{
  assetsReady = true;
  menuStart.disabled = false;
  menuStart.textContent = i18n[lang].start;
}).finally(()=>{ applyLang(); });

menuHow.addEventListener("click", ()=>{ howToEl.hidden=false; });
closeHow.addEventListener("click", ()=>{ howToEl.hidden=true; });
menuStart.addEventListener("click", ()=>{ if(!assetsReady) return; startGame(); });
diffButtons.forEach(btn=> btn.addEventListener("click", ()=>{
  diffButtons.forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); difficulty = btn.dataset.d;
}));
timeButtons.forEach(btn=> btn.addEventListener("click", ()=>{
  timeButtons.forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); gameDuration = parseInt(btn.dataset.t,10);
}));
langButtons.forEach(btn=> btn.addEventListener("click", ()=>{
  lang = btn.dataset.lang; localStorage.setItem("lang", lang); applyLang();
}));
btnRestartSame.addEventListener("click", ()=>{ overlayGameOver.classList.remove("show"); startGame(); });
btnBackToMenu.addEventListener("click", ()=>{ goToMenu(); });

function goToMenu(){
  state="menu"; paused=false;
  items=[]; popups=[]; mascot.visible=false; spawnTimer=0;
  score=0; timeLeft=gameDuration; prevSecond=null; timeupPlayed=false;
  starStreak=0; iFramesUntil=0; dash.active=false; dash.timer=0;
  topScoreEl.textContent = `${t("score")}: 0`;
  topTimeEl.textContent = `${t("time")}: ${gameDuration}`;
  player.mode=null; player.modeTimer=0; hurtFlash=0;
  overlayGameOver.classList.remove("show");
  menu.classList.add("show");
  stopBGM(); setHUDVisible(false);
}
function unlockAudio(){ [...Object.values(sounds), bgm].forEach(a=>{ try{ a.play().then(()=>a.pause()).catch(()=>{}); }catch(e){} }); }

function startGame(){
  unlockAudio();
  state="playing"; score=0; timeLeft=gameDuration; items=[]; mascot.visible=false; popups=[];
  prevSecond=null; timeupPlayed=false; paused=false; spawnTimer=0;
  player.mode=null; player.modeTimer=0; hurtFlash=0; starStreak=0; iFramesUntil=0;
  dash.active=false; dash.timer=0;
  applyLang();
  menu.classList.remove("show"); overlayGameOver.classList.remove("show");
  setHUDVisible(true); startBGM();
}

// ====== 固定時間步長（更順） ======
const FIXED_DT = 1000/60; // 60Hz
let lastTS = 0, acc = 0;
requestAnimationFrame(loop);
function loop(ts){
  requestAnimationFrame(loop);
  if(!lastTS) lastTS = ts;
  let frameDt = ts - lastTS; lastTS = ts;
  if(frameDt > 100) frameDt = 100; // 防掉幀爆衝
  acc += frameDt;
  while(acc >= FIXED_DT){ step(FIXED_DT); acc -= FIXED_DT; }
  render(ts);
}

// ====== 一步更新 ======
let hurtFlash=0, hurtDecayMs=300;
const fx = document.createElement("canvas");
const fxCtx = fx.getContext("2d");
fx.width = SIZES.player_1.w; fx.height = SIZES.player_1.h;
function addHurtFlash(ms=300, strength=1){ hurtFlash=Math.min(1,strength); hurtDecayMs=ms; }

function step(dt){ // dt: 毫秒
  if(state!=="playing" || paused) return;

  // 產生物件
  spawnTimer += dt;
  const spawnEvery = 1000;
  if(spawnTimer > spawnEvery){ spawnItem(); spawnTimer = 0; }

  // MILLION 計時
  if(mascot.visible){
    mascot.timer--;
    if(mascot.timer<=0) mascot.visible=false;
  }

  // 掉落 + 碰撞
  const {gravity} = DIFF[difficulty];
  for(let i=items.length-1;i>=0;i--){
    const it=items[i];
    it.vy += gravity * (it.gMul||1) * (dt/1000);
    it.y  += it.vy * (dt/1000);

    const negative = (it.type==='rest'||it.type==='ban');
    const canHitNegative = !negative || performance.now() >= iFramesUntil;
    if(canHitNegative && smartCollide(player,it)){
      const val=ITEM_RULES[it.type].score;
      score += val; playSound(it.type);

      if(it.type==="star"){
        starStreak += 1;
        if(starStreak % 5 === 0){ score += 500; playSound("beep");
          popups.push({type:"text",x:it.x+it.w/2,y:it.y-18,text:"+500",alpha:1,color:"#00FF7F",size:36});
        }
        popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:"+1",alpha:1,color:"#C6FF4D",size:26});
        const headX = player.x + player.w/2, headY = player.y - 8;
        popups.push({type:"text",x:headX,y:headY,text:`⭐×${starStreak}`,alpha:1,color:"#00FF7F",size:18});
        updateComboHUD();
      }else{
        if(it.type==="bird"){
          player.mode="bird"; player.modeTimer=420;
          popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:"+500",alpha:1,color:"#28a745",size:28});
        }else if(val>0){
          player.toggle=true; setTimeout(()=>{player.toggle=false;},120);
          popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:`+${val}`,alpha:1,color:"#28a745",size:28});
        }else{
          starStreak = 0; updateComboHUD();
          iFramesUntil = performance.now() + 650;
          if(it.type==="rest"){ player.mode="rest"; player.modeTimer=360; addHurtFlash(420,0.9); }
          else { player.mode="ban"; player.modeTimer=520; addHurtFlash(700,1.0); }
          popups.push({type:"text",x:it.x+it.w/2,y:it.y,text:`${val}`,alpha:1,color:"#dc3545",size:28});
        }
      }
      if(it.type==="dog"){ mascot.visible=true; mascot.timer=90; }
      items.splice(i,1);
    }else if(it.y>H){ items.splice(i,1); }
  }

  // 模式衰減
  if(player.modeTimer>0){ player.modeTimer -= dt; if(player.modeTimer<=0) player.mode=null; }
  if(hurtFlash>0){ hurtFlash = Math.max(0, hurtFlash - dt/Math.max(1,hurtDecayMs)); }

  // Dash 運動 or 一般移動
  if(dash.active){
    player.x += dash.dir * (DASH.speed * (dt/1000));
    dash.timer -= dt;
    if(dash.timer <= 0){ dash.active = false; }
  }else{
    const moveStep = 0.45*dt;
    if(leftPressed)  player.x -= moveStep;
    if(rightPressed) player.x += moveStep;
  }
  player.x=Math.max(0,Math.min(W-player.w,player.x));

  // 倒數與音
  timeLeft -= dt/1000;
  const currentSec = Math.ceil(timeLeft);
  if(currentSec !== prevSecond){ if(currentSec>0 && currentSec<=3){ playSound("beep"); } prevSecond=currentSec; }
  if(timeLeft<0){
    timeLeft=0; if(!timeupPlayed){ playSound("timeup"); timeupPlayed=true; }
    try{ const startVol=bgm.volume, start=performance.now(); (function fade(){ const p=Math.min(1,(performance.now()-start)/800); bgm.volume=startVol*(1-p); if(p<1 && !bgm.paused) requestAnimationFrame(fade); else { stopBGM(); bgm.volume=startVol; } })(); }catch(e){}
    state="gameover";
    const best = Math.max(score, getBest()); if(score>getBest()) setBest(score);
    finalScoreEl.textContent=`${t("score")}: ${score}`;
    bestScoreEl.textContent=`${t("best")}: ${best}`;
    overlayGameOver.classList.add("show"); setHUDVisible(false);
  }
  topScoreEl.textContent = `${t("score")}: ${score}`;
  topTimeEl.textContent = `${t("time")}: ${Math.ceil(timeLeft)}`;
}

// ====== 繪圖 ======
function render(ts){
  ctx.clearRect(0,0,W,H);

  // MILLION（淡入淡出）
  if(mascot.visible){
    const msz=SIZES.mascot;
    let alpha=1;
    if(!reduceMotion){
      if(mascot.timer>60){alpha=1-(mascot.timer-60)/30;}
      else if(mascot.timer<30){alpha=mascot.timer/30;}
    }
    ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,alpha));
    if(cache.mascot?.naturalWidth>0){ dimgRound(cache.mascot, W - msz.w, 0, msz.w, msz.h); }
    ctx.restore();
  }

  // 掉落物（浮點繪製更順）
  for(const it of items){
    const img = getItemImage(it.type);
    if(img?.complete && img.naturalWidth>0){
      if(it.type==="star" && !reduceMotion){
        ctx.save();
        const glow = 6 + 3 * Math.sin(ts * 0.02 + it.x * 0.05);
        const alpha = 0.85 + 0.15 * Math.sin(ts * 0.03 + it.y * 0.03);
        ctx.globalAlpha = alpha; ctx.shadowBlur = glow; ctx.shadowColor = "rgba(0,255,127,0.95)";
        dimgFloat(img, it.x, it.y, it.w, it.h);
        ctx.restore();
      }else{
        dimgFloat(img, it.x, it.y, it.w, it.h);
      }
    }
  }

  // 飄字 & Dash Banner（縮 50%）
  for(let i=popups.length-1;i>=0;i--){
    const p=popups[i];
    if(p.type==="dash"){
      const text = t("dash");
      const padX = 7, bh = 16; // 半尺寸
      ctx.save();
      ctx.font="bold 11px Arial"; const metrics = ctx.measureText(text);
      const bw = metrics.width + padX*2; const x = p.x - bw/2, y = p.y - bh;
      ctx.globalAlpha = 0.9 * p.alpha;
      ctx.fillStyle = "#000"; ctx.strokeStyle="#00FF7F"; ctx.lineWidth=2;
      roundRect(ctx, x, y, bw, bh, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#00FF7F"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(text, p.x, y+bh/2+0.5);
      ctx.restore();
      p.ttl -= 16.6; p.alpha -= 0.02;
      if(p.ttl<=0 || p.alpha<=0){ popups.splice(i,1); }
    }else{
      ctx.save(); ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color||"#28a745";
      ctx.font=`bold ${p.size||26}px Arial`; ctx.textAlign="center";
      ctx.lineWidth=3; ctx.strokeStyle="rgba(0,0,0,0.35)";
      ctx.strokeText(p.text, p.x, p.y); ctx.fillText(p.text, p.x, p.y);
      ctx.restore();
      p.y-=0.5; p.alpha-=0.015;
      if(p.alpha<=0) popups.splice(i,1);
    }
  }

  // 玩家繪製
  const pimg = player.img;
  if(pimg?.complete && pimg.naturalWidth>0){ dimgRound(pimg, player.x, player.y, player.w, player.h); }

  // 受傷紅閃遮罩
  if(hurtFlash>0 && pimg?.complete && pimg.naturalWidth>0){
    const alpha = 0.35 * Math.min(1,hurtFlash);
    fx.width = player.w; fx.height = player.h;
    fxCtx.clearRect(0,0,fx.width,fx.height);
    fxCtx.drawImage(pimg, 0, 0, player.w, player.h);
    fxCtx.globalCompositeOperation = "source-atop";
    fxCtx.fillStyle = `rgba(255,0,51,${alpha})`;
    fxCtx.fillRect(0,0,fx.width,fx.height);
    ctx.drawImage(fx, Math.round(player.x), Math.round(player.y));
  }
}

// 圓角工具
function roundRect(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

// 初始語系套用
applyLang();

// 重新計算 DPR（裝置縮放/旋轉）
window.addEventListener("resize", setupCanvasDPR);

// Combo HUD
function updateComboHUD(){ topComboEl.textContent = `${i18n[lang].comboHUD}${starStreak}`; }
