v19.8.6i — Author tag + Mobile dash text bigger + How-to scroll
- 在右上音量左側新增小字：X@kaixxxten（非可點擊）。
- 手機上「極限衝刺!! / Dash / ダッシュ」文字自動放大 1.6 倍，更好辨識。
- How-to 面板可滾動（#howtoBody 加 max-height + overflow），小螢幕自動縮字。
- pointerdown 攔截 e.preventDefault()，減少多餘焦點/高亮帶來的卡頓。
使用：覆蓋 game.js / style.css；上線加 ?v=19.8.6i 清快取。