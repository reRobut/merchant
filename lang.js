// ══════════════════════════════════
// 游商模拟器 · 多语言翻译模块
// ══════════════════════════════════

const LANG = { current: 'zh' };

const TEXTS = {
  zh: {
    // 标题屏
    titleCn: '游商模拟器', ornament: '— 行商四海，富甲天下 —',
    newGame: '开始新游戏', loadGame: '继续游戏',
    // 新游戏屏
    createChar: '创建角色', nameLabel: '角色名称', countryLabel: '选择国家',
    namePlaceholder: '请输入角色名...',
    start: '踏上旅途', back: '← 返回',
    // 游戏标签
    tabBuy:'买入', tabInv:'库存', tabWeapon:'武器', tabArmor:'防具',
    tabTransport:'交通', tabTeam:'团队', tabQuest:'任务', tabAchievements:'成就',
    // Topbar
    travelBtn: '前往城市 ▸', saveBtn: '保存存档',
    repLabel: '声誉',
    gold: '币', coins: '币',
    statDay: (day) => `第 ${day} 天`,
    // 买入表格
    sectionMarket: '市场商品',
    thGoods: '商品', thPrice: '单价', thStock: '库存', thOwned: '已拥有', thBuyQty: '购买数量', thSubtotal: '计价',
    buyTotal: '总价：', buyCurrency: '币',
    btnBuy: '确认购买',
    newsRemaining: (days) => `剩余 ${days} 天`,
    // 库存表格
    sectionInventory: '我的库存',
    thCostPrice: '进价', thMarketPrice: '市价', thQty: '数量', thSellQty: '售出数量',
    sellTotal: '售出总额：',
    btnSell: '确认售出',
    invEmpty: '库存为空',
    // 武器/防具标签
    sectionTeamWeapon: '团队武器装备', sectionWeaponShop: '武器商店', sectionWeaponWH: '武器仓库',
    sectionTeamArmor: '团队防具装备', sectionArmorShop: '防具商店', sectionArmorWH: '防具仓库',
    slotWeapon: '武器', slotArmor: '身甲', slotEmpty: '空',
    statAtk: '攻击', statAtk_s: '攻击 +', statDef: '防御', statDef_s: '+', statDef_e: ' 防御',
    btnBuyToWH: '购买入库', btnEquip: '装备', btnSellWH: '卖出',
    whEmpty: '仓库为空',
    // 交通标签
    sectionTransport: '可用交通工具',
    transportOwned: '已拥有',
    btnSwitchTransport: '切换使用',
    errCargoFull: '超出载具容量，请升级载具',
    // 团队标签
    sectionTeam: '团队成员',
    playerTag: '（玩家角色）',
    labelATK: '攻击', labelDEF: '防御',
    noWeapon: '无武器', noArmor: '无甲',
    wageLabel: '日薪：', wageSuffix: '币',
    btnDismiss: '开除',
    eliteMark: '★精英',
    talentMark: (t) => `天赋×${t}`,
    // 开除确认弹窗
    confirmDismissTitle: '确认开除',
    confirmDismissBody: (name) => `确定要开除 <strong style="color:var(--gold2)">${name}</strong> 吗？<br><span style="color:var(--red2);font-size:0.78rem;">一旦开除将永远无法恢复。</span>`,
    btnCancel: '取消', btnConfirmDismiss: '确认开除',
    toastDismissed: (name) => `${name} 已离队。`,
    // 任务标签
    sectionQuest: '可接任务',
    noQuest: '暂无任务',
    btnAcceptQuest: '接受任务', btnQuestAccepted: '✓ 已接受',
    // 通缉任务
    questTypeWanted: '通缉令', questTypeKidnap: '绑架委托',
    questTargetLabel: '目标：', questSurnameLabel: '姓：', questGivenLabel: '名：',
    questRewardLabel: (r) => `💰 奖励 ${r.toLocaleString()} 币`,
    questHint: '💡 提示：姓或名能对上 → 奖励 <span style="color:var(--gold)">×0.1</span>；姓名完全匹配 → <span style="color:var(--gold)">全额奖励</span>',
    questSubmitted: '✅ 已提交',
    btnSubmit: '提交', btnTear: '撕毁',
    errSelectMember: '请选择团队成员',
    toastTear: '已撕毁任务委托',
    toastSubmitFull: (amt) => `✅ 姓名完全匹配！获得全额奖励 ${amt.toLocaleString()} 币！`,
    toastSubmitPart: (amt) => `🔍 姓名部分匹配，获得 1/10 奖励 ${amt.toLocaleString()} 币。`,
    toastSubmitFail: '❌ 姓名不符，未获得奖励。',
    // 通缉令生成
    wantedTitle: (name) => `🔴 通缉令：${name}`,
    kidnapTitle: (name) => `🔵 绑架委托：${name}`,
    // 敌方招募
    recruitBtn: '收入队伍',
    transportFullBtn: '载具已满',
    combatRecruitLog: (name) => `<span style='color:var(--green2)'>✅ ${name} 投降加入了队伍！</span>`,
    enemyRoleSuffix: (tier) => `${tier}级降兵`,
    // 旅行模态框
    travelTitle: '选择目的地',
    travelHint: '旅行消耗时间与汽油，注意携带量',
    travelDays: '天', travelDist: '里', travelFuel: '油',
    travelSpeedLabel: '速度',
    travelCrimeLabel: '犯罪率',
    // 战斗模态框
    combatTitle: '⚔️ 遭遇战斗 ⚔️',
    combatSubtitle: '回合制策略交锋',
    combatAllyTitle: '我的团队', combatEnemyTitle: '敌方队列',
    combatBtnAuto: '自动攻击', combatBtnAutoOff: '取消自动',
    combatBtnAttack: '攻击', combatBtnFlee: '逃跑', combatBtnSurrender: '投降',
    // 路途事件
    roadEventTitle: '途中事件',
    roadEventDayOf: (day, total) => `第 ${day} 天 · 共 ${total} 天`,
    eventOutcomeTitle: '结果',
    eventAutoHint: '2秒后自动继续…',
    eventContinue: '继续前行', eventArrive: '抵达目的地',
    // 敌方逃跑弹窗
    enemyFleeTitle: '残血逃跑预警',
    enemyFleeBody: (name) => `敌方 <strong>${name}</strong> 斗志崩溃，正试图开溜脱离战场！是否进行生死截杀？`,
    btnPursue: '绝地追杀', btnLetGo: '放其一条生路',
    // 警察事件描述（含兵力）
    policeEventDesc: (force) => `前方设有执法检查站，${force}示意你停下接受盘查。`,
    merchantEventDesc: (force) => `路上遇到${force}，向你友好地点头示意。`,
    criminalEventDesc: (force) => `${force}拦住了去路，眼神凶狠地盯着你的货物。`,
    // 新闻系统
    newsPlague_start: '📰 时事新闻：疫情爆发！医疗用品价格暴涨。',
    newsPlague_end:   '📰 时事新闻：疫情结束，局势逐渐平稳。',
    newsMideast_start: '📰 时事新闻：中东地区发生摩擦！黄金与石油价格飙升。',
    newsMideast_end:   '📰 时事新闻：地缘政治关系缓和，市场恢复正常。',
    // 错误提示
    errName: '请输入角色名称', errCountry: '请选择国家',
    errGold: '金币不足', errFuel: '汽油不足，无法出发',
    errNoGoods: '未选择商品', errNoSell: '未选择售出商品',
    errNoMedicine: '背囊中缺乏[医用品]！',
    // 成功/通知提示
    toastBuy: (amt) => `购买成功！花费 ${amt} 币`,
    toastSell: (amt) => `售出成功！获得 ${amt} 币`,
    toastBuyWH: (icon, name) => `${icon} ${name} 已购入仓库`,
    toastUnequipW: '武器已卸下存入仓库',
    toastUnequipA: '防具已卸下存入仓库',
    toastEquipWH: (icon, name, mName) => `${icon} ${name} 已装备给 ${mName}`,
    toastSellWH: (price, name) => `以 ${price} 币卖出 ${name}`,
    toastTransport: (name) => `购买 ${name} 成功！`,
    toastSave: '存档已保存',
    toastLoad: (day) => `存档加载成功，第 ${day} 天`,
    toastCorrupt: '存档文件损坏',
    toastQuestAccept: (title) => `已接受任务: ${title}`,
    toastWelcome: (name, city) => `欢迎，${name}！你抵达了 ${city}`,
    // 战斗日志
    combatStart: (atk, def, hp) => `⚔️ 战斗开始！商队出战：攻击 ${atk} · 防御 ${def} · 体力 ${hp}`,
    combatPartyName: '商队',
    combatPartyHit: (name, dmg, hp) => `⚔️ 商队齐发，对 <strong>${name}</strong> 造成了 ${dmg} 点伤害。（剩余 ${hp} HP）`,
    combatEnemyCapture: (name) => `<span style='color:var(--green2);'>⛓️ 敌方 [${name}] 已无力抵抗，被当场抓捕归案。</span>`,
    combatEnemyDead: (name) => `<span style='color:var(--red2);'>💀 敌方 [${name}] 伤势过重，已确认死亡。</span>`,
    combatEnemyHit: (name, dmg, hp) => `💥 <strong>${name}</strong> 猛攻商队，造成 ${dmg} 点伤害。（商队体力剩余 ${hp}）`,
    combatEnemyHitResume: (name, dmg, hp) => `💥 <strong>${name}</strong> 继续猛攻商队，造成 ${dmg} 点伤害。（商队体力剩余 ${hp}）`,
    combatVictory: `<span style='color:var(--green2); font-weight:bold; font-size:0.9rem;'>🏆 战役大捷！敌方已丧失全部反抗火种。</span>`,
    combatLootW: (name) => `<span style='color:var(--gold);'>🎁 战利品搜刮：斩获敌方配备的 [${name}]！已存入装备仓库。</span>`,
    combatLootA: (name) => `<span style='color:var(--gold);'>🎁 战利品搜刮：扒下敌方配备的 [${name}]！已存入装备仓库。</span>`,
    combatDefeat: `<span style='color:var(--red2); font-weight:bold; font-size:0.9rem;'>🚨 团队全灭！主角受重伤昏迷，队友四散失联，物资被抢劫一空，仅剩100保底金退回原点。</span>`,
    combatFleeAttempt: '🏃 试图在混乱中紧急撤离逃跑...',
    combatFleeOk: `<span style='color:var(--green2);'>✓ 逃跑成功！团队安然撤离战场。</span>`,
    combatFleeFail: `<span style='color:var(--red2);'>❌ 逃跑失败！敌方早已封锁死角，攻势倒灌。</span>`,
    combatSurrender: `<span style='color:var(--red2);'>🏳 投降输一半。你被洗劫一空，仅剩微薄盘缠退回上个城市。</span>`,
    combatPursueOk: (name) => `🎯 追杀成功！我方合围将 <strong>${name}</strong> 强行截留封锁。`,
    combatPursueFail: (name) => `💨 逃跑跟丢！<strong>${name}</strong> 虚晃一枪闪入树林，成功逃脱。`,
    combatLetGo: (name) => `🕊️ 纵虎归山。你作壁上观，任由 <strong>${name}</strong> 仓皇逃离。`,
    combatHeal: (name, hp) => `🩹 使用医用品！<strong>${name}</strong> 恢复了 ${hp} 点HP。`,
    // 路途事件文案
    roadNothing: '无事发生，一路平静如水。',
    roadSteal: '发现有人在暗中翻你的包囊——你的钱袋变轻了。',
    roadPerson: '路边躺着一个失去意识的旅人，气息微弱。',
    roadPolice: '前方设有执法检查站，官员示意你停下接受盘查。',
    roadMerchant: '路上遇到一位独行的商人，他向你友好地点头示意。',
    roadCriminal: '几名持械歹徒拦住了去路，眼神凶狠地盯着你的货物。',
    roadStealResult: (lost, pct) => `被盗走了 ${lost} 币（${pct}%）。`,
    roadPolicePass: '检查顺利通过，未发现任何问题。',
    roadPoliceFine: (fine) => `发现违禁品！货物被没收，并被罚款 ${fine} 币（现金50%）。`,
    roadPersonRob: (gold) => `搜得 ${gold} 币，但此事有损名誉。`,
    roadPersonHelpFull: (icon, name, atk, def, talent, wage) => `你将其救醒，对方感激涕零。${icon} ${name} 决定暂时加入你的队伍，搭乘你的载具前往下一座城市。（攻击 ${atk} · 防御 ${def} · 天赋 ${talent} · 日薪 ${wage}币）`,
    roadPersonHelpNoSeat: '你将其安置在路边安全处，留下一些干粮。载具已无空位，无法同行。声誉提升。',
    roadPersonIgnore: '你选择继续赶路，对此视而不见。',
    roadMerchantGreet: '你们互相道好，交流了沿途见闻，继续各自赶路。',
    roadCriminalSurrender: (gold) => `损失 ${gold} 币及部分货物，换得平安离开。`,
    choiceRob_zh: '🗡 搜身打劫', choiceHelp_zh: '🩹 施以援手', choiceIgnore_zh: '👋 视而不见',
    choiceComply_zh: '✅ 配合检查', choiceResist_zh: '⚔️ 强行对抗',
    choiceRobMerchant_zh: '🗡 拦路打劫', choiceGreet_zh: '😊 友好打招呼',
    choiceSurrender_zh: '🏳 投降交出财物', choiceFight_zh: '⚔️ 迎战',
    // 价格档位
    priceLow: '低价', priceMid: '正常', priceHigh: '高价', pricePeak: '暴涨',
    // 交通切换
    toastSwitchTransport: (icon, name) => `已切换为 ${icon} ${name}`,
    // 战斗界面
    combatMemberCount: (n) => `成员 ${n} 人`,
    // 敌方力量描述
    forceDesc: (count, typeName, tiers) => `${count}名${typeName}（${tiers}）`,
    tierSuffix: '级',
    enemyTypePolice: '执法者', enemyTypeMerchant: '普通商人', enemyTypeCriminal: '犯罪分子',
    // 路途事件-特殊结局
    roadStealBroke: '小偷靠近后翻了翻你的钱袋，发现你比他还穷——失望地摇摇头，悻悻离去。',
    roadCriminalBroke: '歹徒搜遍你全身，发现你比他们还惨——他们面面相觑，失望地扬长而去。',
    // 声誉变化
    repGainCriminal: (tier, delta) => `击毙 ${tier} 级犯罪分子，声誉 +${delta}`,
    repLossMerchant: '袭击商人，声誉 -5',
    repLossPolice: '对抗执法者，声誉 -10',
  },
  en: {
    titleCn: '游商模拟器', ornament: '— Trade the World, Rule the Market —',
    newGame: 'New Game', loadGame: 'Load Game',
    createChar: 'Create Character', nameLabel: 'Character Name', countryLabel: 'Choose Country',
    namePlaceholder: 'Enter name...',
    start: 'Begin Journey', back: '← Back',
    tabBuy:'Buy', tabInv:'Inventory', tabWeapon:'Weapons', tabArmor:'Armor',
    tabTransport:'Transport', tabTeam:'Team', tabQuest:'Quests', tabAchievements:'Achiev.',
    travelBtn: 'Travel ▸', saveBtn: 'Save Game',
    repLabel: 'Rep',
    gold: 'coins', coins: 'coins',
    statDay: (day) => `Day ${day}`,
    sectionMarket: 'Market',
    thGoods: 'Goods', thPrice: 'Price', thStock: 'Stock', thOwned: 'Owned', thBuyQty: 'Qty', thSubtotal: 'Subtotal',
    buyTotal: 'Total:', buyCurrency: 'coins',
    btnBuy: 'Confirm Purchase',
    newsRemaining: (days) => `${days}d left`,
    sectionInventory: 'Inventory',
    thCostPrice: 'Cost', thMarketPrice: 'Market', thQty: 'Qty', thSellQty: 'Sell Qty',
    sellTotal: 'Sell Total:',
    btnSell: 'Confirm Sale',
    invEmpty: 'Inventory empty',
    sectionTeamWeapon: 'Team Weapons', sectionWeaponShop: 'Weapon Shop', sectionWeaponWH: 'Weapon Storage',
    sectionTeamArmor: 'Team Armor', sectionArmorShop: 'Armor Shop', sectionArmorWH: 'Armor Storage',
    slotWeapon: 'Weapon', slotArmor: 'Armor', slotEmpty: 'Empty',
    statAtk: 'ATK', statAtk_s: 'ATK +', statDef: 'DEF', statDef_s: '+', statDef_e: ' DEF',
    btnBuyToWH: 'Buy', btnEquip: 'Equip', btnSellWH: 'Sell',
    whEmpty: 'Storage empty',
    sectionTransport: 'Available Transport',
    transportOwned: 'Owned',
    btnSwitchTransport: 'Switch',
    errCargoFull: 'Cargo full! Upgrade your transport.',
    sectionTeam: 'Team Members',
    playerTag: '(Player character)',
    labelATK: 'ATK', labelDEF: 'DEF',
    noWeapon: 'No weapon', noArmor: 'No armor',
    wageLabel: 'Wage: ', wageSuffix: ' coins',
    btnDismiss: 'Dismiss',
    eliteMark: '★Elite',
    talentMark: (t) => `Talent×${t}`,
    confirmDismissTitle: 'Confirm Dismiss',
    confirmDismissBody: (name) => `Dismiss <strong style="color:var(--gold2)">${name}</strong>?<br><span style="color:var(--red2);font-size:0.78rem;">This cannot be undone.</span>`,
    btnCancel: 'Cancel', btnConfirmDismiss: 'Confirm',
    toastDismissed: (name) => `${name} has left the party.`,
    sectionQuest: 'Available Quests',
    noQuest: 'No quests available',
    btnAcceptQuest: 'Accept', btnQuestAccepted: '✓ Accepted',
    questTypeWanted: 'Wanted', questTypeKidnap: 'Kidnap Contract',
    questTargetLabel: 'Target:', questSurnameLabel: 'Surname:', questGivenLabel: 'Given:',
    questRewardLabel: (r) => `💰 Reward: ${r.toLocaleString()} coins`,
    questHint: '💡 Tip: Surname or given name match → reward <span style="color:var(--gold)">×0.1</span>; Full name match → <span style="color:var(--gold)">full reward</span>',
    questSubmitted: '✅ Submitted',
    btnSubmit: 'Submit', btnTear: 'Discard',
    errSelectMember: 'Please select a team member',
    toastTear: 'Quest discarded',
    toastSubmitFull: (amt) => `✅ Full name match! Full reward: ${amt.toLocaleString()} coins!`,
    toastSubmitPart: (amt) => `🔍 Partial match, received 1/10 reward: ${amt.toLocaleString()} coins.`,
    toastSubmitFail: '❌ Name mismatch, no reward.',
    wantedTitle: (name) => `🔴 Wanted: ${name}`,
    kidnapTitle: (name) => `🔵 Kidnap Contract: ${name}`,
    recruitBtn: 'Recruit',
    transportFullBtn: 'No seats',
    combatRecruitLog: (name) => `<span style='color:var(--green2)'>✅ ${name} surrendered and joined your party!</span>`,
    enemyRoleSuffix: (tier) => `Tier ${tier} Defector`,
    travelTitle: 'Choose Destination',
    travelHint: 'Travel costs time and fuel — watch your supplies',
    travelDays: 'd', travelDist: 'km', travelFuel: 'fuel',
    travelSpeedLabel: 'Speed',
    travelCrimeLabel: 'Crime',
    combatTitle: '⚔️ Combat ⚔️',
    combatSubtitle: 'Turn-based tactical combat',
    combatAllyTitle: 'Your Team', combatEnemyTitle: 'Enemies',
    combatBtnAuto: 'Auto Attack', combatBtnAutoOff: 'Stop Auto',
    combatBtnAttack: 'Attack', combatBtnFlee: 'Flee', combatBtnSurrender: 'Surrender',
    roadEventTitle: 'Road Event',
    roadEventDayOf: (day, total) => `Day ${day} of ${total}`,
    eventOutcomeTitle: 'Outcome',
    eventAutoHint: 'Continuing in 2s…',
    eventContinue: 'Continue', eventArrive: 'Arrive',
    enemyFleeTitle: 'Enemy Fleeing',
    enemyFleeBody: (name) => `<strong>${name}</strong> is trying to escape! Pursue?`,
    btnPursue: 'Pursue', btnLetGo: 'Let them go',
    policeEventDesc: (force) => `A checkpoint ahead. ${force} signals you to stop for inspection.`,
    merchantEventDesc: (force) => `You encounter ${force} on the road. They nod at you in greeting.`,
    criminalEventDesc: (force) => `${force} blocks your path, eyeing your goods with menace.`,
    newsPlague_start: '📰 News: Epidemic outbreak! Medical supply prices surge.',
    newsPlague_end:   '📰 News: Epidemic over, situation stabilizing.',
    newsMideast_start: '📰 News: Middle East tensions rise! Gold and oil prices spike.',
    newsMideast_end:   '📰 News: Geopolitical relations ease, markets return to normal.',
    errName: 'Enter a character name', errCountry: 'Choose a country',
    errGold: 'Not enough gold', errFuel: 'Not enough fuel to travel',
    errNoGoods: 'No goods selected', errNoSell: 'No goods selected to sell',
    errNoMedicine: 'No [Medicine] in inventory!',
    toastBuy: (amt) => `Purchased! Spent ${amt} coins`,
    toastSell: (amt) => `Sold! Earned ${amt} coins`,
    toastBuyWH: (icon, name) => `${icon} ${name} added to storage`,
    toastUnequipW: 'Weapon stored in warehouse',
    toastUnequipA: 'Armor stored in warehouse',
    toastEquipWH: (icon, name, mName) => `${icon} ${name} equipped to ${mName}`,
    toastSellWH: (price, name) => `Sold ${name} for ${price} coins`,
    toastTransport: (name) => `Bought ${name}!`,
    toastSave: 'Game saved',
    toastLoad: (day) => `Save loaded — Day ${day}`,
    toastCorrupt: 'Save file corrupted',
    toastQuestAccept: (title) => `Quest accepted: ${title}`,
    toastWelcome: (name, city) => `Welcome, ${name}! Arrived at ${city}`,
    combatStart: (atk, def, hp) => `⚔️ Combat begins! Party: ATK ${atk} · DEF ${def} · HP ${hp}`,
    combatPartyName: 'Party',
    combatPartyHit: (name, dmg, hp) => `⚔️ Party attacks <strong>${name}</strong> for ${dmg} damage. (${hp} HP left)`,
    combatEnemyCapture: (name) => `<span style='color:var(--green2);'>⛓️ [${name}] overpowered and captured.</span>`,
    combatEnemyDead: (name) => `<span style='color:var(--red2);'>💀 [${name}] has been defeated.</span>`,
    combatEnemyHit: (name, dmg, hp) => `💥 <strong>${name}</strong> attacks the party for ${dmg} damage. (Party HP: ${hp})`,
    combatEnemyHitResume: (name, dmg, hp) => `💥 <strong>${name}</strong> continues attacking for ${dmg} damage. (Party HP: ${hp})`,
    combatVictory: `<span style='color:var(--green2); font-weight:bold; font-size:0.9rem;'>🏆 Victory! All enemies defeated.</span>`,
    combatLootW: (name) => `<span style='color:var(--gold);'>🎁 Loot: seized enemy [${name}]! Stored in warehouse.</span>`,
    combatLootA: (name) => `<span style='color:var(--gold);'>🎁 Loot: stripped enemy [${name}]! Stored in warehouse.</span>`,
    combatDefeat: `<span style='color:var(--red2); font-weight:bold; font-size:0.9rem;'>🚨 Party wiped! You wake up with only 100 coins and retreat to the previous city.</span>`,
    combatFleeAttempt: '🏃 Attempting to flee...',
    combatFleeOk: `<span style='color:var(--green2);'>✓ Escaped successfully!</span>`,
    combatFleeFail: `<span style='color:var(--red2);'>❌ Escape failed! Enemies cut off your retreat.</span>`,
    combatSurrender: `<span style='color:var(--red2);'>🏳 Surrendered. Stripped of goods, barely escaped with your life.</span>`,
    combatPursueOk: (name) => `🎯 Pursuit successful! <strong>${name}</strong> is cornered.`,
    combatPursueFail: (name) => `💨 Lost them! <strong>${name}</strong> slipped into the trees.`,
    combatLetGo: (name) => `🕊️ You let <strong>${name}</strong> flee.`,
    combatHeal: (name, hp) => `🩹 Used Medicine! <strong>${name}</strong> recovered ${hp} HP.`,
    roadNothing: 'The road was quiet. Nothing happened.',
    roadSteal: 'Someone has been picking your pockets. Your coin pouch is lighter.',
    roadPerson: 'An unconscious traveler lies by the roadside, barely breathing.',
    roadPolice: 'A checkpoint ahead. Officials signal you to stop for inspection.',
    roadMerchant: 'You encounter a lone merchant on the road. He nods at you in greeting.',
    roadCriminal: 'Armed bandits block your path, eyeing your goods with menace.',
    roadStealResult: (lost, pct) => `A thief stole ${lost} coins from you.`,
    roadPolicePass: 'Inspection passed without issue.',
    roadPoliceFine: (fine) => `Contraband found! Goods confiscated and fined ${fine} coins (50% of cash).`,
    roadPersonRob: (gold) => `Found ${gold} coins, but your reputation suffers.`,
    roadPersonHelpFull: (icon, name, atk, def, talent, wage) => `You revived them. ${icon} ${name} is grateful and joins your group to the next city. (ATK ${atk} · DEF ${def} · Talent ${talent} · Wage ${wage}/day)`,
    roadPersonHelpNoSeat: 'You moved them to safety and left some food. No seats in your vehicle. Reputation improved.',
    roadPersonIgnore: 'You walk past without a second glance.',
    roadMerchantGreet: 'You exchange pleasantries and road news, then part ways.',
    roadCriminalSurrender: (gold) => `Lost ${gold} coins and some goods, but left unharmed.`,
    choiceRob_zh: '🗡 Rob them', choiceHelp_zh: '🩹 Help them', choiceIgnore_zh: '👋 Ignore',
    choiceComply_zh: '✅ Comply', choiceResist_zh: '⚔️ Resist',
    choiceRobMerchant_zh: '🗡 Rob them', choiceGreet_zh: '😊 Greet him',
    choiceSurrender_zh: '🏳 Surrender', choiceFight_zh: '⚔️ Fight',
    priceLow: 'Low', priceMid: 'Normal', priceHigh: 'High', pricePeak: 'Peak',
    toastSwitchTransport: (icon, name) => `Switched to ${icon} ${name}`,
    combatMemberCount: (n) => `${n} member${n !== 1 ? 's' : ''}`,
    forceDesc: (count, typeName, tiers) => `${count} ${typeName} (${tiers})`,
    tierSuffix: '',
    enemyTypePolice: 'Officers', enemyTypeMerchant: 'Merchants', enemyTypeCriminal: 'Criminals',
    roadStealBroke: 'The thief rummaged through your purse, only to find you poorer than them — they shook their head and slunk away.',
    roadCriminalBroke: 'The bandits searched you thoroughly, then realized you were worse off than them — they exchanged glances and left in disappointment.',
    repGainCriminal: (tier, delta) => `Killed tier-${tier} criminal, REP +${delta}`,
    repLossMerchant: 'Attacked a merchant, REP -5',
    repLossPolice: 'Fought law enforcement, REP -10',
  },
};

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
}

function chooseLang(lang) {
  LANG.current = lang;
  if (typeof G !== 'undefined') G.lang = lang;
  applyLang();
  document.querySelectorAll('.lang-inline-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('lang-btn-' + lang);
  if (btn) btn.classList.add('active');
}
