const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

// 視圖/覆蓋
const menu = document.getElementById("menu");
const overlayGameOver = document.getElementById("overlayGameOver");
const menuStart = document.getElementById("menuStart");
const menuHow = document.getElementById("menuHow");
const closeHow = document.getElementById("closeHow");
const finalScoreEl = document.getElementById("finalScore");
const diffButtons = [...document.querySelectorAll(".diff")];

// 控制
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnRestart = document.getElementById("btnRestart");

const W = canvas.width, H = canvas.height;

// 尺寸（50%）
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

// 圖片
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
for (const k in IMGS){ const img = new Image(); img.src = IMGS[k]; cache[k]=img; }

// 音效（檔名請放在 sounds/）
const sounds = {
  dog:   new Audio("sounds/dog.mp3"),
  sushi: new Audio("sounds/sushi.mp3"),
  bird:  new Audio("sounds/bird.mp3"),
  rest:  new Audio("sounds/rest.mp3"),
  ban:   new Audio("sounds/ban.mp3"),
};
function playSound(name){
  const a = sounds[name];
  if (!a) return;
  try { a.currentTime = 0; a.play(); } catch(e){ /* 行動裝置未互動前可能被擋 */ }
}

// 狀態
let state="menu",score=0,timeLeft=30,spawnTimer=0,items=[],mascot={visible:false,timer:0};
let popups=[];
let difficulty = "normal";
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
  if(state==="gameover"&&(e.key==="Enter"||e.key===" ")) restartGame();
  if(state!=="playing") return;
  const step=30;
  if(e.key==="ArrowLeft")  player.x-=step;
  if(e.key==="ArrowRight") player.x+=step;
  player.x=Math.max(0,Math.min(W-player.w,player.x));
});

// 手機控制（阻止晃動）
let moveLeft=false,moveRight=false;
function preventTouch(handler){
  return (e)=>{ e.preventDefault(); handler(); };
}
btnLeft.addEventListener("touchstart", preventTouch(()=>{moveLeft=true;}), {passive:false});
btnLeft.addEventListener("touchend",   preventTouch(()=>{moveLeft=false;}), {passive:false});
btnRight.addEventListener("touchstart",preventTouch(()=>{moveRight=true;}), {passive:false});
btnRight.addEventListener("touchend",  preventTouch(()=>{moveRight=false;}), {passive:false});

// HUD
const hudLeft=document.createElement("div");
hudLeft.className="hud";hudLeft.innerHTML=`<p id="hudScore">Score: 0</p>`;
const hudBottom=document.createElement("div");
hudBottom.className="hud-bottom";hudBottom.innerHTML=`<p id="hudTime">Time: 30</p>`;
document.getElementById("wrap").appendChild(hudLeft);
document.getElementById("wrap").appendChild(hudBottom);
const hudScoreEl=document.getElementById("hudScore"),hudTimeEl=document.getElementById("hudTime");

// 菜單事件
onTap(menuStart, startGame);
onTap(menuHow, ()=>{ document.getElementById("howTo").hidden = false; });
onTap(closeHow, ()=>{ document.getElementById("howTo").hidden = true; });
diffButtons.forEach(btn=>{
  onTap(btn, ()=>{
    diffButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.d;
  });
});
onTap(btnRestart, ()=>{ restartGame(); });

function startGame(){
  // 嘗試解鎖音效（行動裝置需互動）
  Object.values(sounds).forEach(a=>{ try{ a.play().then(()=>a.pause()); }catch(e){} });
  state="playing";score=0;timeLeft=30;items=[];mascot.visible=false;popups=[];
  spawnTimer=0;
  menu.classList.remove("show");
  overlayGameOver.classList.remove("show");
}
function restartGame(){ overlayGameOver.classList.remove("show"); startGame(); }

function spawnItem(){
  const keys=Object.keys(ITEM_RULES);
  const key=keys[Math.floor(Math.random()*keys.length)];
  const sz=ITEM_RULES[key].size;
  const {initVy} = DIFF[difficulty];
  items.push({type:key,x:Math.random()*(W-sz.w),y:-sz.h,w:sz.w,h:sz.h,vy:initVy});
}

function collide(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

let last=0;
function loop(ts){
  requestAnimationFrame(loop);
  let dt = ts - last; last = ts;
  if(dt > 100) dt = 100; // 保護

  ctx.clearRect(0,0,W,H);
  if(state==="playing"){
    spawnTimer+=dt;
    const spawnEvery = 1000; // ms
    if(spawnTimer>spawnEvery){ spawnItem(); spawnTimer=0; }

    // mascot 淡入淡出
    if(mascot.visible){
      const msz=SIZES.mascot;
      let alpha=1;
      if(mascot.timer>60){alpha=1-(mascot.timer-60)/30;}
      else if(mascot.timer<30){alpha=mascot.timer/30;}
      ctx.save();
      ctx.globalAlpha=Math.max(0,Math.min(1,alpha));
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
        // 音效
        playSound(it.type);
        // 咬合
        player.toggle=true; setTimeout(()=>{player.toggle=false;},100);
        // dog 觸發 mascot
        if(it.type==="dog"){ mascot.visible=true; mascot.timer=90; }
        // 浮動分數
        popups.push({x:it.x+it.w/2,y:it.y,val:val,alpha:1});
        items.splice(i,1);
      }else if(it.y>H){
        items.splice(i,1);
      }
    }

    // HUD
    hudScoreEl.textContent=`Score: ${score}`;
    timeLeft-=dt/1000;
    if(timeLeft<0){
      timeLeft=0; state="gameover";
      finalScoreEl.textContent=`Score: ${score}`;
      overlayGameOver.classList.add("show");
    }
    hudTimeEl.textContent=`Time: ${Math.ceil(timeLeft)}`;

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

  // 玩家
  ctx.drawImage(player.img,player.x,player.y,player.w,player.h);
}
requestAnimationFrame(loop);
