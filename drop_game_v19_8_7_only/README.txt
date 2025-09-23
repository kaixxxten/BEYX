v19.8.6m — How-to panel scroll fix (mobile)
- 明確對 #howto / #howtoBody 解除 touch-action:none，改為 touch-action: pan-y；確保可以上下捲動。
- 強制 overflow-y:auto、max-height、與可見右側捲動條（含 Chrome/Edge/Firefox 樣式）。
使用：覆蓋 style.css（game.js 無變更）；上線加 ?v=19.8.6m 清快取。