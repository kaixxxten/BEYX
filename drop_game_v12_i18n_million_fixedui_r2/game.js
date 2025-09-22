// ====== 基本設定 ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

// 視圖/元素參考
const menu = document.getElementById("menu");
const overlayGameOver = document.getElementById("overlayGameOver");
const titleEl = document.getElementById("title");
const menuStart = document.getElementById("menuStart");
const menuHow = document.getElementById("menuHow");
const closeHow = document.getElementById("closeHow");
const finalScoreEl = document.getElementById("finalScore");
const diffLabelEl = document.getElementById("diffLabel");
const diffButtons = [...document.querySelectorAll(".diff")];
const langButtons = [...document.querySelectorAll(".langbtn")];
const howToEl = document.getElementById("howTo");
const howTitleEl = document.getElementById("howTitle");
const howListEl = document.getElementById("howList");
const overTitleEl = document.getElementById("overTitle");
const btnRestartSame = document.getElementById("btnRestartSame");
const btnBackToMenu = document.getElementById("btnBackToMenu");

// 手機控制按鈕（已存在於 HTML）
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");

const W = canvas.width, H = canvas.height;

// ====== 多語系 ======
const i18n = {
  zh: {
    title: "掉落遊戲",
    start: "開始遊戲",
    loading: "載入中…",
    how: "玩法說明",
    close: "關閉",
    difficulty: "難度：",
    easy: "簡單",
    normal: "普通",
    hard: "困難",
    lang: "語言：",
    howTitle: "玩法說明",
    howItems: [
      "操作艾克斯和巨龍移動吃東西",
      "PC：鍵盤 ← → 移動",
      "手機：點住下方 ◀ ▶ 按鈕移動",
      "30 秒內盡量吃高分：dog +50、sushi +200、bird +500",
      "rest -50、ban -200；吃到 dog 會讓右上角 MILLION 現身"
    ],
    over: "時間到！",
    restartSame: "再玩一次（同難度）",
    backToMenu: "回到標題",
    score: "分數",
    time: "時間"
  },
  ja: {
    title: "キャッチして食べるゲーム",
    start: "ゲーム開始",
    loading: "読み込み中…",
    how: "遊び方",
    close: "閉じる",
    difficulty: "難易度：",
    easy: "かんたん",
    normal: "ふつう",
    hard: "むずかしい",
    lang: "言語：",
    howTitle: "遊び方",
    howItems: [
      "エクスとドラゴンを操作して落ちてくるものを食べよう",
      "PC：キーボード ← → で移動",
      "スマホ：下の ◀ ▶ ボタンを押して移動",
      "30秒以内に高得点を狙おう：犬 +50、寿司 +200、バード +500",
      "休憩 -50、出場禁止 -200；犬を食べると右上にミリオンさんが登場"
    ],
    over: "時間切れ！",
    restartSame: "もう一度（同じ難易度）",
    backToMenu: "タイトルへ",
    score: "スコア",
    time: "時間"
  },
  en: {
    title: "Catch & Chow",
    start: "Start Game",
    loading: "Loading…",
    how: "How to Play",
    close: "Close",
    difficulty: "Difficulty:",
    easy: "Easy",
    normal: "Normal",
    hard: "Hard",
    lang: "Language:",
    howTitle: "How to Play",
    howItems: [
      "Control X and the Dragon to move and eat falling items.",
      "PC: Use ← → to move",
      "Mobile: Hold the ◀ ▶ buttons to move",
      "Score big in 30 seconds: dog +50, sushi +200, bird +500",
      "rest −50, ban −200; eating a dog makes MILLION appear in the top‑right"
    ],
    over: "Time Up!",
    restartSame: "Play Again (Same)",
    backToMenu: "Back to Title",
    score: "Score",
    time: "Time"
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
  document.getElementById("langLabel").textContent = t("lang");
  howTitleEl.textContent = t("howTitle");
  howListEl.innerHTML = i18n[lang].howItems.map(li=>`<li>${li}</li>`).join("");
  closeHow.textContent = t("close");
  overTitleEl.textContent = t("over");
  btnRestartSame.textContent = t("restartSame");
  btnBackToMenu.textContent = t("backToMenu");
  if (typeof hudScoreEl !== "undefined" && hudScoreEl)
    hudScoreEl.textContent = `${t("score")}: ${score}`;
  if (typeof hudTimeEl !== "undefined" && hudTimeEl)
    hudTimeEl.textContent = `${t("time")}: ${Math.ceil(timeLeft)}`;
  langButtons.forEach(b=> b.classList.toggle("active", b.dataset.lang===lang));
}
langButtons.forEach(b=>{
  b.addEventListener("click", ()=>{
    lang = b.dataset.lang;
    localStorage.setItem("lang", lang);
    applyLang();
  });
});

// ====== 圖片尺寸（50%） ======
const SIZES = {
  ban:   { w:163/2, h:81/2 },
  bird:  { w:211/2, h:168/2 },
  dog:   { w:265/2, h:203/2 },
  mascot:{ w:364/2, h:389/2 },
  player_1:{ w:688/2, h:373/2 },
  player_2:{ w:688/2, h:373/2 },
  rest:  { w:163/2, h:81/2 },
  sushi: { w:126/2, h:113/2 },
};

// ====== 圖片路徑與預載 ======
const IMGS = {
  ban: "images/ban.png",
  bird: "images/bird.png",
  dog: "images/dog.png",
  mascot: "images/mascot.png",
  player_1: "images/player_1.png",
  player_2: "images/player_2.png",
  rest: "images/rest.png",
  sushi: "images/sushi.png",
};
const cache = {};
let assetsReady = false;
function preloadImages(map){
  const entries = Object.entries(map);
  const promises = entries.map(([k,src])=> new Promise((resolve)=>{
    const img = new Image();
    img.onload = ()=>resolve([k,img]);
    img.onerror = ()=>{ console.warn("圖片載入失敗", src); resolve([k,img]); };
    img.src = src;
  }));
  return Promise.all(promises).then(list=>{
    list.forEach(([k,img])=> cache[k]=img);
  });
}

// ====== 音效與 BGM ======
const sounds = {
  dog:   new Audio("sounds/dog.mp3"),
  sushi: new Audio("sounds/sushi.mp3"),
  bird:  new Audio("sounds/bird.mp3"),
  rest:  new Audio("sounds/rest.mp3"),
  ban:   new Audio("sounds/ban.mp3"),
  timeup:new Audio("sounds/timeup.mp3"),
  beep:  new Audio("sounds/beep.mp3"),
};
const bgm = new Audio("sounds/bgm.mp3");
bgm.loop = true; bgm.volume = 0.4;

const volumes = { dog:0.9, sushi:0.8, bird:0.8, rest:0.6, ban:0.9, timeup:0.8, beep:0.6 };
function playSound(name){
  const src = sounds[name];
  if(!src) return;
  try{ const a = src.cloneNode(); a.volume = volumes[name] ?? 0.8; a.play(); }catch(e){}
}
function startBGM(){ try{ bgm.currentTime=0; bgm.volume=0.4; bgm.play(); }catch(e){} }
function stopBGM(){ try{ bgm.pause(); bgm.currentTime=0; }catch(e){} }
function fadeOutBGM(ms=800){
  const startVol = bgm.volume;
  const start = performance.now();
  function step(t){
    const p = Math.min(1, (t - start) / ms);
    bgm.volume = startVol * (1 - p);
    if(p < 1 && !bgm.paused){ requestAnimationFrame(step); }
    else { stopBGM(); bgm.volume = startVol; }
  }
  requestAnimationFrame(step);
}

// ====== 遊戲狀態 ======
let state="menu",score=0,timeLeft=30,spawnTimer=0,items=[],mascot={visible:false,timer:0};
let popups=[];
let difficulty = "normal";
let prevSecond = null;
let timeupPlayed = false;

const DIFF = {
  easy:   { initVy: 60,  gravity: 80  },
  normal: { initVy: 100, gravity: 120 },
  hard:   { initVy: 150, gravity: 180 },
};

// 玩家
const player={
  x:(W - SIZES.player_1.w)/2,
  y:H - SIZES.player_1.h - 20,
  w:SIZES.player_1.w,
  h:SIZES.player_1.h,
  toggle:false,
  get img(){return this.toggle?cache.player_2:cache.player_1;}
};

// 物件
const ITEM_RULES={
  dog:{score:+50,size:SIZES.dog},
  sushi:{score:+200,size:SIZES.sushi},
  bird:{score:+500,size:SIZES.bird},
  rest:{score:-50,size:SIZES.rest},
  ban:{score:-200,size:SIZES.ban},
};

// 小工具：同時綁 click + touchstart
function onTap(el, handler){
  if (!el) return;
  el.addEventListener("click", handler);
  el.addEventListener("touchstart", (e)=>{ e.preventDefault(); handler(); }, {passive:false});
}

// PC 控制
document.addEventListener("keydown",e=>{
  if(state==="menu"&&(e.key==="Enter"||e.key===" ")) startGame();
  if(state==="gameover"&&(e.key==="Enter"||e.key===" ")) goToMenu();
  if(state!=="playing") return;
  const step=30;
  if(e.key==="ArrowLeft")  player.x-=step;
  if(e.key==="ArrowRight") player.x+=step;
  player.x=Math.max(0,Math.min(W-player.w,player.x));
});

// 手機控制（阻止晃動）
let moveLeft=false,moveRight=false;
function preventTouch(handler){ return (e)=>{ e.preventDefault(); handler(); }; }
btnLeft.addEventListener("touchstart", preventTouch(()=>{moveLeft=true;}), {passive:false});
btnLeft.addEventListener("touchend",   preventTouch(()=>{moveLeft=false;}), {passive:false});
btnRight.addEventListener("touchstart",preventTouch(()=>{moveRight=true;}), {passive:false});
btnRight.addEventListener("touchend",  preventTouch(()=>{moveRight=false;}), {passive:false});

// HUD（固定寬度以避免語系切換晃動）
const hudLeft=document.createElement("div");
hudLeft.className="hud";hudLeft.innerHTML=`<p id="hudScore">Score: 0</p>`;
const hudBottom=document.createElement("div");
hudBottom.className="hud-bottom";hudBottom.innerHTML=`<p id="hudTime">Time: 30</p>`;
document.getElementById("wrap").appendChild(hudLeft);
document.getElementById("wrap").appendChild(hudBottom);
const hudScoreEl=document.getElementById("hudScore"),hudTimeEl=document.getElementById("hudTime");

// 預載流程 + 語系套用
preloadImages(IMGS).then(()=>{
  assetsReady = true;
  menuStart.disabled = false;
  menuStart.textContent = i18n[lang].start;
}).finally(()=>{ applyLang(); });

// 菜單事件
onTap(menuStart, ()=>{ if(!assetsReady) return; startGame(); });
onTap(menuHow, ()=>{ howToEl.hidden = false; });
onTap(closeHow, ()=>{ howToEl.hidden = true; });
diffButtons.forEach(btn=>{
  onTap(btn, ()=>{
    diffButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.d;
  });
});
langButtons.forEach(btn=>{
  onTap(btn, ()=>{ lang = btn.dataset.lang; localStorage.setItem("lang", lang); applyLang(); });
});
onTap(btnRestartSame, ()=>{ overlayGameOver.classList.remove("show"); startGame(); });
onTap(btnBackToMenu, ()=>{ goToMenu(); });

function goToMenu(){
  state="menu";
  items=[]; popups=[]; mascot.visible=false; spawnTimer=0;
  score=0; timeLeft=30; prevSecond=null; timeupPlayed=false;
  hudScoreEl.textContent = `${t("score")}: 0`;
  hudTimeEl.textContent = `${t("time")}: 30`;
  overlayGameOver.classList.remove("show");
  menu.classList.add("show");
  stopBGM();
}

function startGame(){
  // 行動裝置音效解鎖
  [...Object.values(sounds), bgm].forEach(a=>{ try{ a.play().then(()=>a.pause()); }catch(e){} });
  state="playing";score=0;timeLeft=30;items=[];mascot.visible=false;popups=[];
  prevSecond=null; timeupPlayed=false;
  spawnTimer=0;
  menu.classList.remove("show");
  overlayGameOver.classList.remove("show");
  startBGM();
}

let last=0;
function spawnItem(){
  const keys=Object.keys(ITEM_RULES);
  const key=keys[Math.floor(Math.random()*keys.length)];
  const sz=ITEM_RULES[key].size;
  const {initVy} = DIFF[difficulty];
  items.push({type:key,x:Math.random()*(W-sz.w),y:-sz.h,w:sz.w,h:sz.h,vy:initVy});
}
function collide(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

function loop(ts){
  requestAnimationFrame(loop);
  let dt = ts - last; last = ts;
  if(dt > 100) dt = 100; // 保護

  ctx.clearRect(0,0,W,H);
  if(state==="playing"){
    spawnTimer+=dt;
    const spawnEvery = 1000;
    if(spawnTimer>spawnEvery){ spawnItem(); spawnTimer=0; }

    // MILLION 淡入淡出（原 mascot）
    if(mascot.visible){
      const msz=SIZES.mascot;
      let alpha=1;
      if(mascot.timer>60){alpha=1-(mascot.timer-60)/30;}
      else if(mascot.timer<30){alpha=mascot.timer/30;}
      ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,alpha));
      ctx.drawImage(cache.mascot,W-msz.w-20,20,msz.w,msz.h);
      ctx.restore();
      mascot.timer--;
      if(mascot.timer<=0)mascot.visible=false;
    }

    // 掉落&碰撞
    const {gravity} = DIFF[difficulty];
    for(let i=items.length-1;i>=0;i--){
      let it=items[i];
      it.vy += gravity * (dt/1000);
      it.y  += it.vy * (dt/1000);
      ctx.drawImage(cache[it.type],it.x,it.y,it.w,it.h);
      if(collide(player,it)){
        const val=ITEM_RULES[it.type].score;
        score+=val;
        playSound(it.type);
        player.toggle=true; setTimeout(()=>{player.toggle=false;},100);
        if(it.type==="dog"){ mascot.visible=true; mascot.timer=90; }
        popups.push({x:it.x+it.w/2,y:it.y,val:val,alpha:1});
        items.splice(i,1);
      }else if(it.y>H){
        items.splice(i,1);
      }
    }

    // HUD & 倒數聲（固定寬度，避免語系切換跳動）
    hudScoreEl.textContent=`${t("score")}: ${score}`;
    timeLeft-=dt/1000;
    const currentSec = Math.ceil(timeLeft);
    if(currentSec !== prevSecond){
      if(currentSec > 0 && currentSec <= 3){
        playSound("beep");
      }
      prevSecond = currentSec;
    }
    if(timeLeft<0){
      timeLeft=0; 
      if(!timeupPlayed){ playSound("timeup"); timeupPlayed=true; }
      fadeOutBGM(800);
      state="gameover";
      finalScoreEl.textContent=`${t("score")}: ${score}`;
      overlayGameOver.classList.add("show");
    }
    hudTimeEl.textContent=`${t("time")}: ${Math.ceil(timeLeft)}`;

    // 觸控移動（持續）
    const moveStep = 0.45*dt;
    if(moveLeft)  player.x -= moveStep;
    if(moveRight) player.x += moveStep;
    player.x=Math.max(0,Math.min(W-player.w,player.x));
  }

  // 浮動分數繪製
  for(let i=popups.length-1;i>=0;i--){
    const p=popups[i];
    ctx.save();
    ctx.globalAlpha=p.alpha;
    ctx.fillStyle=p.val>0?"#28a745":"#dc3545";
    ctx.font="bold 30px Arial";
    ctx.textAlign="center";
    ctx.fillText((p.val>0?"+":"")+p.val,p.x,p.y);
    ctx.restore();
    p.y-=0.05*dt;
    p.alpha-=0.02*(dt/16.6);
    if(p.alpha<=0) popups.splice(i,1);
  }

  // 玩家：若圖片尚未就緒，用佔位圖避免「看不到主角」
  const pimg = player.img;
  if(pimg && pimg.complete && pimg.naturalWidth>0){
    ctx.drawImage(pimg,player.x,player.y,player.w,player.h);
  }else{
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(player.x+player.w/2, player.y+player.h/2, player.w/2.2, player.h/2.2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#111";
    ctx.font="bold 16px sans-serif";
    ctx.textAlign="center";
    ctx.fillText("loading...", player.x+player.w/2, player.y+player.h/2+6);
    ctx.restore();
  }
}
requestAnimationFrame(loop);

// 初始語系套用（HUD 已建立）
applyLang();
