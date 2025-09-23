v19.8.6l — Smaller author tag + visible how-to scrollbar + smoother fall + dash micro-optimizations
- 作者標示（右下）字級改更小（10px）。
- 說明面板 #howtoBody：加入可見的右側滾動條（Chrome/Edge/Firefox 都支援），小螢幕自動縮字。
- 掉落更平滑：對所有物件的物理步進加 dt 上限（<=30ms），減少幀尖峰造成的抖動。
- 手機 DASH：節流衝刺飄字（<=300ms 一次）避免尖峰；其餘先前優化（音效池、DPR≤2 等）保留。
使用：覆蓋 game.js 與 style.css；上線加 ?v=19.8.6l 清快取。