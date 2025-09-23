v19.8.6n — Menu fixed width, smaller how-to fonts, scroll works
- 固定選單寬與按鈕高度，切換語言不再跳動。
- 「遊玩方式」標題字降一半（18px）、內文降兩級（14px）。
- 說明面板可滾動：進入選單（menu 模式）時解鎖 touch-action，並在 #howtoBody 顯示可見捲動條。
- JS：切換 startGame()/goToMenu() 時同步加/移除 body.menu；另外在 #howtoBody 上攔截 touch 事件，避免被全域監聽擋掉。
使用：覆蓋 style.css / game.js；上線加 ?v=19.8.6n 清快取。