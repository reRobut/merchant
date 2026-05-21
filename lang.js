// ══════════════════════════════════
// 游商模拟器 · 多语言翻译模块
// 使用方法：在 index.html 中引入此文件
// <script src="lang.js"></script>
// ══════════════════════════════════

const LANG = { current: 'zh' };

const TEXTS = {
  zh: {
    // 语言选择屏
    langChoose: '选择语言 · Choose Language',
    // 标题屏
    titleCn: '游商模拟器', ornament: '— 行商四海，富甲天下 —',
    newGame: '开始新游戏', loadGame: '继续游戏', langSet: '语言设置',
    // 新游戏屏
    createChar: '创建角色', nameLabel: '角色名称', countryLabel: '选择国家',
    namePlaceholder: '请输入角色名...',
    start: '踏上旅途', back: '← 返回',
    // 游戏标签
    tabBuy:'买入', tabInv:'库存', tabWeapon:'武器', tabArmor:'防具',
    tabTransport:'交通', tabTeam:'团队', tabQuest:'任务',
    // 旅行模态框
    travelTitle: '选择目的地',
    travelHint: '旅行消耗时间与汽油，注意携带量',
    travelDays: '天', travelDist: '里', travelFuel: '油',
    // topbar
    dayLabel: '第', dayUnit: '天',
    // 交通标签
    transportOwned: '已拥有', transportBuy: '购买',
    // 错误提示
    errName: '请输入角色名称', errCountry: '请选择国家',
    errGold: '金币不足', errFuel: '汽油不足，无法出发',
    errNoGoods: '未选择商品', errNoSell: '未选择售出商品',
    // 成功提示
    toastBuy: '购买成功！花费', toastSell: '售出成功！获得',
    toastArrive: '抵达', toastTrip: '旅途耗时',
    toastDays: '天，消耗汽油',
    toastEquip: '装备成功！', toastTransport: '购买',
    toastTransportOk: '成功！',
    toastSave: '存档已保存',
    toastLoad: '存档加载成功，第',
    toastLoadDay: '天',
    toastCorrupt: '存档文件损坏',
    toastQuestAccept: '已接受任务:',
    gold: '金币',
  },
  en: {
    langChoose: '选择语言 · Choose Language',
    titleCn: 'MERCHANT', ornament: '— Trade the World, Rule the Market —',
    newGame: 'New Game', loadGame: 'Load Game', langSet: 'Language',
    createChar: 'Create Character', nameLabel: 'Character Name', countryLabel: 'Choose Country',
    namePlaceholder: 'Enter name...',
    start: 'Begin Journey', back: '← Back',
    tabBuy:'Buy', tabInv:'Inventory', tabWeapon:'Weapons', tabArmor:'Armor',
    tabTransport:'Transport', tabTeam:'Team', tabQuest:'Quests',
    travelTitle: 'Choose Destination',
    travelHint: 'Travel costs time and fuel — watch your supplies',
    travelDays: 'd', travelDist: 'km', travelFuel: 'fuel',
    dayLabel: 'Day ', dayUnit: '',
    transportOwned: 'Owned', transportBuy: 'Buy',
    errName: 'Enter a character name', errCountry: 'Choose a country',
    errGold: 'Not enough gold', errFuel: 'Not enough fuel to travel',
    errNoGoods: 'No goods selected', errNoSell: 'No goods selected to sell',
    toastBuy: 'Purchased! Spent', toastSell: 'Sold! Earned',
    toastArrive: 'Arrived at', toastTrip: 'Journey took',
    toastDays: 'd, used fuel',
    toastEquip: 'Equipped!', toastTransport: 'Bought',
    toastTransportOk: '!',
    toastSave: 'Game saved',
    toastLoad: 'Save loaded — Day',
    toastLoadDay: '',
    toastCorrupt: 'Save file corrupted',
    toastQuestAccept: 'Quest accepted:',
    gold: 'gold',
  },
};

function toggleLang() {
  document.getElementById('lang-panel').classList.toggle('open');
}

function setLang(lang) {
  LANG.current = lang;
  if (typeof G !== 'undefined') G.lang = lang;
  applyLang();
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
}

function applyLang() {
  const t = TEXTS[LANG.current] || TEXTS['zh'];
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const setAttr = (id, attr, val) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  };
  setText('t-title-cn', t.titleCn);
  setText('t-ornament', t.ornament);
  setText('t-new-game', t.newGame);
  setText('t-load-game', t.loadGame);
  setText('ng-title', t.createChar);
  setText('ng-name-label', t.nameLabel);
  setText('ng-country-label', t.countryLabel);
  setAttr('char-name', 'placeholder', t.namePlaceholder);
  setText('ng-start', t.start);
  setText('btn-back-newgame', t.back);
  setText('tab-buy', t.tabBuy);
  setText('tab-inv', t.tabInv);
  setText('tab-weapon', t.tabWeapon);
  setText('tab-armor', t.tabArmor);
  setText('tab-transport', t.tabTransport);
  setText('tab-team', t.tabTeam);
  setText('tab-quest', t.tabQuest);
  setText('travel-modal-title', t.travelTitle);
  setText('travel-modal-hint', t.travelHint);
}

function T(key) {
  return (TEXTS[LANG.current] || TEXTS['zh'])[key] || key;
}
