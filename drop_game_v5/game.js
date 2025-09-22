const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

const overlay = document.getElementById("overlay");
const overlayGameOver = document.getElementById("overlayGameOver");
const btnStart = document.getElementById("btnStart");
const btnRestart = document.getElementById("btnRestart");
const finalScoreEl = document.getElementById("finalScore");

const W = canvas.width, H = canvas.height;

// 原始像素，縮減50%
const SIZES = {
  ban:   { w:163/2, h:81/2 },
  bird:  { w:211/2, h:168/2 },
  dog:   { w:265/2, h:203/2 },
  mascot:{ w:364/2, h:389/2 },
  player_1:{ w:688/2, h:373/2 },
  player_2:{ w:688/2, h:373/2 },
  rest:  { w:163/2, h:81/2 },
  sushi: { w:126/2, h:113/2 }, // 修正為 126x113 再縮小
};

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
for (const k in IMGS){const img=new Image();img.src=IMGS[k];cache[k]=img;}

let state="menu",score=0,timeLeft=30,spawnTimer=0,items=[],mascot={visible:false,timer:0};
const player={
  x:(W - SIZES.player_1.w)/2,
  y:H - SIZES.player_1.h - 20,
  w:SIZES.player_1.w,
  h:SIZES.player_1.h,
  toggle:false,
  get img(){return this.toggle?cache.player_2:cache.player_1;}
};

const ITEM_RULES={
  dog:{score:+50,size:SIZES.dog},
  sushi:{score:+200,size:SIZES.sushi},
  bird:{score:+500,size:SIZES.bird},
  rest:{score:-50,size:SIZES.rest},
  ban:{score:-200,size:SIZES.ban},
};

document.addEventListener("keydown",e=>{
  if(state==="menu"&&(e.key==="Enter"||e.key===" "))startGame();
  if(state==="gameover"&&(e.key==="Enter"||e.key===" "))restartGame();
  if(state!=="playing")return;
  const step=30;
  if(e.key==="ArrowLeft")player.x-=step;
  if(e.key==="ArrowRight")player.x+=step;
  player.x=Math.max(0,Math.min(W-player.w,player.x));
});

btnStart?.addEventListener("click",startGame);
btnRestart?.addEventListener("click",restartGame);

function startGame(){state="playing";score=0;timeLeft=30;items=[];mascot.visible=false;overlay.classList.remove("show");}
function restartGame(){overlayGameOver.classList.remove("show");startGame();}

function spawnItem(){
  const keys=Object.keys(ITEM_RULES);
  const key=keys[Math.floor(Math.random()*keys.length)];
  const sz=ITEM_RULES[key].size;
  items.push({type:key,x:Math.random()*(W-sz.w),y:-sz.h,w:sz.w,h:sz.h});
}

function collide(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

// HUD
const hudLeft=document.createElement("div");
hudLeft.className="hud";hudLeft.innerHTML=`<p id="hudScore">Score: 0</p>`;
const hudBottom=document.createElement("div");
hudBottom.className="hud-bottom";hudBottom.innerHTML=`<p id="hudTime">Time: 30</p>`;
document.getElementById("wrap").appendChild(hudLeft);
document.getElementById("wrap").appendChild(hudBottom);
const hudScoreEl=document.getElementById("hudScore"),hudTimeEl=document.getElementById("hudTime");

let last=0;
function loop(ts){
  requestAnimationFrame(loop);
  const dt=Math.min(33,ts-last);last=ts;
  ctx.clearRect(0,0,W,H);
  if(state==="playing"){
    spawnTimer+=dt;if(spawnTimer>900){spawnItem();spawnTimer=0;}
    if(mascot.visible){const msz=SIZES.mascot;ctx.drawImage(cache.mascot,W-msz.w-20,20,msz.w,msz.h);mascot.timer--;if(mascot.timer<=0)mascot.visible=false;}
    for(let i=items.length-1;i>=0;i--){let it=items[i];it.y+=4;ctx.drawImage(cache[it.type],it.x,it.y,it.w,it.h);
      if(collide(player,it)){
        score+=ITEM_RULES[it.type].score;
        // 玩家咬合效果
        player.toggle=true;
        setTimeout(()=>{player.toggle=false;},100);
        // dog 觸發 mascot 出現
        if(it.type==="dog"){
          mascot.visible=true;mascot.timer=90; // 約1.5秒
        }
        items.splice(i,1);
      }
      else if(it.y>H){items.splice(i,1);}}
    hudScoreEl.textContent=`Score: ${score}`;
    timeLeft-=dt/1000;if(timeLeft<0){timeLeft=0;state="gameover";finalScoreEl.textContent=`Score: ${score}`;overlayGameOver.classList.add("show");}
    hudTimeEl.textContent=`Time: ${Math.ceil(timeLeft)}`;
  }
  ctx.drawImage(player.img,player.x,player.y,player.w,player.h);
}
requestAnimationFrame(loop);
