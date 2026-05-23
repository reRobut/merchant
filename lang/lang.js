// ══════════════════════════════════
// 游商模拟器 · 多语言核心模块
// ══════════════════════════════════
// 加载顺序：lang.js → lang.zh.js → lang.en.js → lang.xx.js → ...

const LANG = { current: 'zh' };

// 各语言包注册到这个对象
// 每个语言文件负责往里写 TEXTS.xx = { ... }
const TEXTS = {};

function T(key, ...args) {
  const t = (TEXTS[LANG.current] || TEXTS['zh'])[key];
  if (t === undefined) return key;
  if (typeof t === 'function') return t(...args);
  return t;
}

function applyLang() {
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };

  // 标题屏
  setText('t-title-cn', T('titleCn'));
  setText('t-ornament', T('ornament'));
  setText('t-new-game', T('newGame'));
  setText('t-load-game', T('loadGame'));

  // 新游戏屏
  setText('ng-title', T('createChar'));
  setText('ng-name-label', T('nameLabel'));
  setText('ng-country-label', T('countryLabel'));
  setAttr('char-name', 'placeholder', T('namePlaceholder'));
  setText('ng-start', T('start'));
  setText('btn-back-newgame', T('back'));

  // 游戏标签
  setText('tab-buy', T('tabBuy'));
  setText('tab-inv', T('tabInv'));
  setText('tab-weapon', T('tabWeapon'));
  setText('tab-armor', T('tabArmor'));
  setText('tab-transport', T('tabTransport'));
  setText('tab-team', T('tabTeam'));
  setText('tab-quest', T('tabQuest'));
  setText('tab-achievements', T('tabAchievements'));

  // Topbar 按钮
  setText('btn-travel', T('travelBtn'));
  setText('btn-save', T('saveBtn'));

  // 买入表格
  setText('sl-market', T('sectionMarket'));
  setText('th-goods', T('thGoods'));
  setText('th-price', T('thPrice'));
  setText('th-stock', T('thStock'));
  setText('th-owned', T('thOwned'));
  setText('th-buyqty', T('thBuyQty'));
  setText('th-subtotal', T('thSubtotal'));
  setText('buy-total-label-text', T('buyTotal'));
  setText('btn-confirm-buy', T('btnBuy'));

  // 库存表格
  setText('sl-inventory', T('sectionInventory'));
  setText('th-goods2', T('thGoods'));
  setText('th-costprice', T('thCostPrice'));
  setText('th-mktprice', T('thMarketPrice'));
  setText('th-qty', T('thQty'));
  setText('th-sellqty', T('thSellQty'));
  setText('th-subtotal2', T('thSubtotal'));
  setText('sell-total-label-text', T('sellTotal'));
  setText('btn-confirm-sell', T('btnSell'));

  // 武器/防具
  setText('es-team-weapon', T('sectionTeamWeapon'));
  setText('es-weapon-shop', T('sectionWeaponShop'));
  setText('es-weapon-wh', T('sectionWeaponWH'));
  setText('es-team-armor', T('sectionTeamArmor'));
  setText('es-armor-shop', T('sectionArmorShop'));
  setText('es-armor-wh', T('sectionArmorWH'));

  // 交通/团队/任务
  setText('sl-transport', T('sectionTransport'));
  setText('sl-team', T('sectionTeam'));
  setText('sl-quest', T('sectionQuest'));

  // 旅行/战斗模态框
  setText('travel-modal-title', T('travelTitle'));
  setText('travel-modal-hint', T('travelHint'));
  setText('combat-title', T('combatTitle'));
  setText('combat-subtitle', T('combatSubtitle'));
  setText('combat-ally-title', T('combatAllyTitle'));
  setText('combat-enemy-title', T('combatEnemyTitle'));
  setText('combat-btn-auto', T('combatBtnAuto'));
  setText('combat-btn-attack', T('combatBtnAttack'));
  setText('combat-btn-flee', T('combatBtnFlee'));
  setText('combat-btn-surrender', T('combatBtnSurrender'));

  // 重新渲染国家/地区格子（如果存在）
  if (typeof renderCountryGrid === 'function' && document.getElementById('country-grid')) {
    renderCountryGrid();
  }
}

function chooseLang(lang) {
  LANG.current = lang;
  if (typeof G !== 'undefined') G.lang = lang;
  document.documentElement.lang = lang;
  applyLang();
  document.querySelectorAll('.lang-inline-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('lang-btn-' + lang);
  if (btn) btn.classList.add('active');
}

// 根据当前语言取物品名称
function itemName(item) {
  const map = { en: 'nameEn', ja: 'nameJa', ko: 'nameKo', ru: 'nameRu', es: 'nameEs', pt: 'namePt' };
  const key = map[LANG.current];
  return (key && item[key]) ? item[key] : item.name;
}

// 根据当前语言取国家/地区名称
function countryName(country) {
  const map = { en: 'nameEn', ja: 'nameJa', ko: 'nameKo', ru: 'nameRu', es: 'nameEs', pt: 'namePt' };
  const key = map[LANG.current];
  return (key && country[key]) ? country[key] : country.name;
}
