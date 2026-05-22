
			const TEAM_TEMPLATES = [{ name: "__PLAYER__", wage: 0, weapon: null, armor: null, isPlayer: true }];

			// ── 名字生成（改用 data.js 中的 generateNpcName，按国家区分；如未加载则降级）──
			function genName() {
				if (typeof generateNpcName === "function") return generateNpcName(G.country || LANG.current);
				// 降级：按国家区分名字，直接使用 data.js 中的数组（若已加载）
				const country = G.country || "";
				if (country === "germany") {
					const first = typeof NPC_FIRST_DE !== "undefined" ? NPC_FIRST_DE : ["Anna","Clara","Emma","Hanna","Julia","Laura","Lena","Lisa","Maria","Mia","Nina","Sara","Sophie","Katrin","Petra","Hans","Karl","Klaus","Lukas","Markus","Michael","Peter","Stefan","Thomas","Tobias","Wolfgang","Erik","Felix","Georg","Heinz"];
					const last  = typeof NPC_LAST_DE  !== "undefined" ? NPC_LAST_DE  : ["Bauer","Beck","Braun","Fischer","Franke","Friedrich","Hoffmann","Kaiser","Klein","Koch","Krause","Lehmann","Meyer","Müller","Neumann","Peters","Richter","Schmidt","Schneider","Schröder","Schulz","Schwarz","Wagner","Weber","Werner","Wolf","Zimmermann","Becker","Huber","König"];
					return first[Math.floor(Math.random()*first.length)] + " " + last[Math.floor(Math.random()*last.length)];
				}
				if (country === "usa") {
					const first = typeof NPC_FIRST_US !== "undefined" ? NPC_FIRST_US : ["Alex","Blake","Casey","Dana","Ellis","Fran","Gray","Harper","Jamie","Jordan","Kendall","Logan","Morgan","Parker","Quinn","Riley","Skyler","Taylor","Tyler","Avery"];
					const last  = typeof NPC_LAST_US  !== "undefined" ? NPC_LAST_US  : ["Anderson","Brown","Davis","Garcia","Johnson","Jones","Martinez","Miller","Moore","Rodriguez","Smith","Taylor","Thomas","White","Williams","Wilson","Jackson","Lee","Harris","Clark"];
					return first[Math.floor(Math.random()*first.length)] + " " + last[Math.floor(Math.random()*last.length)];
				}
				// 默认中文（china 或其他）
				const sur  = typeof NPC_SURNAMES_ZH !== "undefined" ? NPC_SURNAMES_ZH : ["李","王","张","刘","陈","赵","孙","周","吴","郑","冯","蒋","谢","韩","唐","曹","许","邓","叶","傅"];
				const given = typeof NPC_GIVEN_ZH   !== "undefined" ? NPC_GIVEN_ZH   : ["明","伟","芳","洋","磊","颖","涛","静","博","浩","婷","杰","鑫","俊","雷","莹","峰","超","琳","坤"];
				return sur[Math.floor(Math.random()*sur.length)] + given[Math.floor(Math.random()*given.length)];
			}

			function genTalent() {
				const factor = Math.random() * Math.random() * Math.random();
				return Math.round((1.0 + 9.0 * factor) * 10) / 10;
			}

			function genNPC() {
				const atkBase = Math.floor(Math.random() * 101);
				const defBase = Math.floor(Math.random() * 101);
				const hpBase  = Math.floor(200 + Math.random() * 201);
				const talent  = genTalent();
				const roll    = Math.random();
				const talentOn = roll < 0.33 ? "atk" : roll < 0.66 ? "def" : "hp";
				const atkTotal = talentOn === "atk" ? Math.round(atkBase * talent) : atkBase;
				const defTotal = talentOn === "def" ? Math.round(defBase * talent) : defBase;
				const hpTotal  = talentOn === "hp"  ? Math.round(hpBase  * talent) : hpBase;
				const wage = Math.max(1, Math.round((atkTotal + defTotal + hpTotal) * talent / 10));
				return {
					name: genName(), icon: "🧑", role: "",
					atkBase, defBase, hpBase, talent, talentOn,
					atk: atkTotal, def: defTotal, hp: hpTotal, wage,
					weapon: null, armor: null, rescued: true,
				};
			}

			function memberCombatPower(m) {
				const armorDef = m.armor ? ARMORS.find((a) => a.id === m.armor)?.def || 0 : 0;
				const totalDef = (m.def || 0) + armorDef;
				return Math.max(Math.floor((m.atk || 0) * 0.05), (m.atk || 0) - totalDef);
			}

			function getTransportFreeSeats() {
				const transport = getActiveTransport();
				if (!transport) return 0;
				const occupied = G.team.filter((m) => m.wage > 0).length;
				return Math.max(0, (transport.passengers || 0) - occupied);
			}

			// 通缉令 / 绑架委托系统
			function generateWantedName() {
				const surnames = ["李","王","张","刘","陈","赵","孙","周","吴","郑","冯","蒋","谢","韩","唐","曹","许","邓","叶","傅"];
				const names    = ["明","伟","芳","洋","磊","颖","涛","静","博","浩","婷","杰","鑫","俊","雷","莹","峰","超","琳","坤"];
				const sur  = surnames[Math.floor(Math.random() * surnames.length)];
				const name = names[Math.floor(Math.random() * names.length)];
				return { surname: sur, givenName: name, fullName: sur + name };
			}

			function generateWantedQuest(id) {
				const isWanted = Math.random() < 0.5;
				const target   = generateWantedName();
				return {
					id,
					type: isWanted ? "wanted" : "kidnap",
					title: isWanted ? T("wantedTitle", target.fullName) : T("kidnapTitle", target.fullName),
					target,
					reward: 50000,
					accepted: false,
					submitted: false,
					torn: false,
					generatedDay: G.day,
				};
			}

			function checkAndRefreshWantedQuests() {
				if (!G.wantedQuests) G.wantedQuests = [];
				// 每50天生成一张
				const expectedCount = Math.floor(G.day / 50) + 1;
				const MAX_ACTIVE_QUESTS = 10;
				while (G.wantedQuests.filter(q => !q.torn).length < expectedCount && G.wantedQuests.filter(q => !q.torn).length < MAX_ACTIVE_QUESTS) {
					const id = "wanted_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
					G.wantedQuests.push(generateWantedQuest(id));
				}
			}

			function renderQuestList() {
				checkAndRefreshWantedQuests();
				const list = document.getElementById("quest-list");
				const activeWanted = (G.wantedQuests || []).filter(q => !q.torn);
				if (activeWanted.length === 0) {
					list.innerHTML = `<div style="color:var(--text3);text-align:center;padding:2rem;font-size:0.85rem;">${T("noQuest")}</div>`;
					return;
				}
				list.innerHTML = activeWanted.map(q => {
					const typeIcon = q.type === "wanted" ? "🔴" : "🔵";
					const typeLabel = q.type === "wanted" ? T("questTypeWanted") : T("questTypeKidnap");
					const hintHtml = `<div style="font-size:0.72rem;color:var(--text3);margin:0.4rem 0;line-height:1.7;">${T("questHint")}</div>`;
					const memberOptions = G.team.map((m, i) =>
						`<option value="${i}">${m.icon || "🧑"} ${m.name}</option>`
					).join("");
					const submitSection = q.submitted
						? `<div style="color:var(--green2);font-size:0.8rem;margin-top:0.5rem;">${T("questSubmitted")}</div>`
						: `<div style="display:flex;gap:0.4rem;align-items:center;margin-top:0.6rem;flex-wrap:wrap;">
							<select class="qty-input" id="submit-member-${q.id}" style="flex:1;font-size:0.72rem;min-width:80px;">${memberOptions}</select>
							<button class="btn-accept" style="flex:none;" onclick="submitWantedQuest('${q.id}')">${T("btnSubmit")}</button>
							<button class="btn-accept" style="flex:none;border-color:var(--red);color:var(--red2);" onclick="tearWantedQuest('${q.id}')">${T("btnTear")}</button>
						</div>`;
					return `<div class="quest-card" style="border-color:${q.type==='wanted'?'var(--red)':'#3a6ad4'};">
						<div class="quest-title">${typeIcon} ${typeLabel}</div>
						<div style="font-size:0.82rem;color:var(--text);line-height:1.8;margin:0.3rem 0;">
							<span style="color:var(--text3)">${T("questTargetLabel")}</span><strong>${q.target.fullName}</strong>
							&nbsp;·&nbsp;<span style="color:var(--text3)">${T("questSurnameLabel")}</span>${q.target.surname}
							&nbsp;·&nbsp;<span style="color:var(--text3)">${T("questGivenLabel")}</span>${q.target.givenName}
						</div>
						<div class="quest-reward"><span class="reward-item">${T("questRewardLabel", q.reward)}</span></div>
						${hintHtml}
						${submitSection}
					</div>`;
				}).join("");
			}

			function submitWantedQuest(qid) {
				const q = (G.wantedQuests || []).find(x => x.id === qid);
				if (!q || q.submitted || q.torn) return;
				const sel = document.getElementById("submit-member-" + qid);
				if (!sel) return;
				const memberIdx = parseInt(sel.value);
				const member = G.team[memberIdx];
				if (!member) { showToast(T("errSelectMember"), "red"); return; }

				// 比对姓名
				const mName = member.name || "";
				const surnameMatch  = mName.includes(q.target.surname);
				const givenMatch    = mName.includes(q.target.givenName);
				const fullMatch     = mName === q.target.fullName || mName.includes(q.target.fullName);

				let payout = 0, msg = "";
				if (fullMatch) {
					payout = q.reward;
					msg = T("toastSubmitFull", payout);
				} else if (surnameMatch || givenMatch) {
					payout = Math.floor(q.reward * 0.1);
					msg = T("toastSubmitPart", payout);
				} else {
					msg = T("toastSubmitFail");
				}

				G.gold += payout;
				q.submitted = true;
				showToast(msg, payout > 0 ? "gold" : "");
				renderGame();
			}

			function tearWantedQuest(qid) {
				const q = (G.wantedQuests || []).find(x => x.id === qid);
				if (!q) return;
				q.torn = true;
				showToast(T("toastTear"), "");
				renderQuestList();
			}

			const QUESTS = [];

			// ══════════════════════════════════
			// GAME STATE
			// ══════════════════════════════════
			let G = {
				lang: "zh", charName: "", country: "", city: "", prevCity: "",
				gold: 100, day: 1, rep: 0,
				inventory: {}, cityPrices: {}, cityStock: {},
				team: [], transports: [], quests: [], wantedQuests: [], activeNews: [],
				equipWarehouse: [],
			};

			// ══════════════════════════════════
			// SCREENS
			// ══════════════════════════════════
			function showScreen(id) {
				document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
				document.getElementById("screen-" + id).classList.add("active");
			}

			function showNewGame() { renderCountryGrid(); showScreen("newgame"); }

			// ══════════════════════════════════
			// NEW GAME
			// ══════════════════════════════════
			let selectedCountry = "";

			function renderCountryGrid() {
				const grid = document.getElementById("country-grid");
				grid.innerHTML = COUNTRIES.map((c) =>
					`<div class="country-card ${selectedCountry === c.id ? "selected" : ""}" onclick="selectCountry('${c.id}',this)">
						${LANG.current === "zh" ? c.name : c.nameEn}
					</div>`
				).join("");
			}

			function selectCountry(id, el) {
				selectedCountry = id;
				document.querySelectorAll(".country-card").forEach((c) => c.classList.remove("selected"));
				el.classList.add("selected");
			}

			function startGame() {
				const name = document.getElementById("char-name").value.trim();
				if (!name) { showToast(T("errName"), "red"); return; }
				if (!selectedCountry) { showToast(T("errCountry"), "red"); return; }
				G.charName = name;
				G.country  = selectedCountry;
				const cities = CITIES[selectedCountry];
				G.city     = cities[Math.floor(Math.random() * cities.length)];
				G.prevCity = G.city;
				G.gold = 100; G.day = 1; G.rep = 0; G.inventory = {}; G.wantedQuests = []; G.activeNews = [];
				G.team = TEAM_TEMPLATES.map((t) => { const m = {...t}; if (m.name === "__PLAYER__") m.name = name; return m; });
				G.transports = TRANSPORTS.map((t) => ({...t}));
			
				G.quests = QUESTS.map((q) => ({...q}));
				generateCityPrices();
				renderGame();
				showScreen("game");
				showToast(T("toastWelcome", name, G.city), "gold");
			}

			// ══════════════════════════════════
			// 时事新闻系统
			// ══════════════════════════════════
			const NEWS_EVENTS = [
				{
					id: "plague",
					get startMsg() { return T("newsPlague_start"); },
					get endMsg()   { return T("newsPlague_end"); },
					effect: (prices) => {
						// 医疗用品：medicine
						if (prices["medicine"] !== undefined) prices["medicine"] = Math.floor(500 + Math.random() * 301);
					},
				},
				{
					id: "mideast",
					get startMsg() { return T("newsMideast_start"); },
					get endMsg()   { return T("newsMideast_end"); },
					effect: (prices) => {
						// 黄金：gold_ingot / 汽油：fuel
						if (prices["gold_ingot"] !== undefined) prices["gold_ingot"] = Math.floor(5000 + Math.random() * 2001);
						if (prices["fuel"]       !== undefined) prices["fuel"]       = Math.floor(50   + Math.random() * 31);
					},
				},
			];

			function tickNews() {
				if (!G.activeNews) G.activeNews = [];
				// 到期检查
				G.activeNews = G.activeNews.filter(n => {
					if (G.day >= n.endDay) {
						const def = NEWS_EVENTS.find(x => x.id === n.id);
						if (def) showNewsToast(def.endMsg, "end");
						return false;
					}
					return true;
				});
			}

			function tryTriggerNews() {
				if (!G.activeNews) G.activeNews = [];
				if (Math.random() > 0.10) return; // 10% 概率
				// 不重复触发同类新闻
				const available = NEWS_EVENTS.filter(n => !G.activeNews.find(a => a.id === n.id));
				if (available.length === 0) return;
				const chosen = available[Math.floor(Math.random() * available.length)];
				const duration = Math.floor(10 + Math.random() * 191); // 10-200天
				G.activeNews.push({ id: chosen.id, startDay: G.day, endDay: G.day + duration });
				showNewsToast(chosen.startMsg, "start");
			}

			function showNewsToast(msg, type) {
				const old = document.getElementById("news-banner");
				if (old) old.remove();
				const el = document.createElement("div");
				el.id = "news-banner";
				el.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:9999;background:${type==="end"?"var(--bg4)":"var(--bg3)"};border-bottom:1px solid ${type==="end"?"var(--border2)":"var(--gold)"};color:${type==="end"?"var(--text3)":"var(--gold)"};font-size:0.78rem;padding:0.5rem 1rem;text-align:center;letter-spacing:0.05em;cursor:pointer;`;
				el.textContent = msg;
				el.onclick = () => el.remove();
				document.body.appendChild(el);
				setTimeout(() => { if (el.parentNode) el.remove(); }, 6000);
			}

			function applyNewsEffects(prices) {
				if (!G.activeNews) return;
				G.activeNews.forEach(n => {
					const def = NEWS_EVENTS.find(x => x.id === n.id);
					if (def) def.effect(prices);
				});
			}

			function getActiveNewsBulletins() {
				if (!G.activeNews || G.activeNews.length === 0) return [];
				return G.activeNews.map(n => {
					const def = NEWS_EVENTS.find(x => x.id === n.id);
					const daysLeft = n.endDay - G.day;
					return def ? { msg: def.startMsg, daysLeft } : null;
				}).filter(Boolean);
			}

			function generateCityPrices() {
				G.cityPrices = {}; G.cityStock = {};
				GOODS.forEach((g) => {
					G.cityPrices[g.id] = Math.round(g.priceMin + Math.random() * (g.priceMax - g.priceMin));
					G.cityStock[g.id]  = Math.floor(5 + Math.random() * 40);
				});
				applyNewsEffects(G.cityPrices);
			}

			function priceLevel(goodId) {
				const g = GOODS.find((x) => x.id === goodId);
				if (!g) return 0.5;
				const range = g.priceMax - g.priceMin;
				if (range === 0) return 0.5;
				return ((G.cityPrices[goodId] || g.priceMin) - g.priceMin) / range;
			}

			function priceLevelLabel(goodId) {
				const lvl = priceLevel(goodId);
				if (lvl <= 0.25) return { text: T("priceLow"),  cls: "lvl-low" };
				if (lvl <= 0.60) return { text: T("priceMid"),  cls: "lvl-mid" };
				if (lvl <= 0.85) return { text: T("priceHigh"), cls: "lvl-high" };
				return               { text: T("pricePeak"), cls: "lvl-peak" };
			}

			// ══════════════════════════════════
			// RENDER GAME
			// ══════════════════════════════════
			function renderGame() {
				updateTopbar();
				renderBuyTable();
				renderInvTable();
				renderWeaponTab();
				renderArmorTab();
				renderTransportGrid();
				renderTeamGrid();
				renderQuestList();
			}

			function updateTopbar() {
				document.getElementById("city-name").textContent = `📍 ${G.city}`;
				document.getElementById("stat-gold").textContent = G.gold.toLocaleString() + " " + T("gold");
				document.getElementById("stat-day").textContent  = T("statDay", G.day);
				document.getElementById("stat-rep").textContent  = T("repLabel") + ": " + G.rep;
				// 货物负载
				const transport = getActiveTransport ? getActiveTransport() : null;
				const cap = transport ? (transport.cap || 0) : 0;
				const used = Object.values(G.inventory).reduce((s, d) => s + (d.qty || 0), 0);
				const cargoEl = document.getElementById("stat-cargo");
				if (cargoEl) cargoEl.textContent = (LANG.current === "en" ? "Cargo" : "货物") + ": " + used + "/" + cap;
			}

			// ── BUY TABLE ──
			// 计算载具当前剩余容量
			function getCargoCapacity() {
				const transport = getActiveTransport ? getActiveTransport() : null;
				const cap = transport ? (transport.cap || 0) : 0;
				const used = Object.values(G.inventory).reduce((s, d) => s + (d.qty || 0), 0);
				return Math.max(0, cap - used);
			}

			function renderNewsBulletin() {
				const bulletins = getActiveNewsBulletins();
				const el = document.getElementById("news-bulletin-box");
				if (!el) return;
				if (bulletins.length === 0) { el.innerHTML = ""; el.style.display = "none"; return; }
				el.style.display = "block";
				el.innerHTML = bulletins.map(b =>
					`<div style="padding:0.35rem 0.6rem;border-bottom:1px solid var(--border2);font-size:0.75rem;">
						<span style="color:var(--gold)">${b.msg}</span>
					</div>`
				).join("");
			}

			function renderBuyTable() {
				renderNewsBulletin();
				const tbody = document.getElementById("buy-table-body");
				const freeSlots = getCargoCapacity();
				tbody.innerHTML = GOODS.map((g) => {
					const price = G.cityPrices[g.id] || g.priceMin;
					const stock = G.cityStock[g.id] || 0;
					const owned = G.inventory[g.id]?.qty || 0;
					// MAX 受三重限制：市场库存、现金可买量、载具剩余容量
					const affordableQty = price > 0 ? Math.floor(G.gold / price) : stock;
					const maxQty = Math.min(stock, affordableQty, freeSlots);
					const goodName = LANG.current === "zh" ? g.name : g.nameEn;
					return `<tr>
						<td><span class="item-name">${g.icon} ${goodName}</span></td>
						<td style="font-weight:500">${price.toLocaleString()}</td>
						<td>${stock}</td>
						<td class="qty-owned">${owned}</td>
						<td>
							<div class="qty-controls">
								<input type="number" class="qty-input" id="buy-qty-${g.id}" value="0" min="0" max="${stock}" oninput="calcBuyTotal()">
								<button class="qty-shortcut" onclick="setBuyQtyWithCapCheck('${g.id}',${maxQty},${freeSlots})">MAX</button>
								<button class="qty-shortcut" onclick="setBuyQty('${g.id}',0)">0</button>
							</div>
						</td>
						<td class="price-tag" id="buy-line-${g.id}">—</td>
					</tr>`;
				}).join("");
			}

			function setBuyQtyWithCapCheck(id, maxQty, freeSlots) {
				if (freeSlots <= 0) {
					showToast(T("errCargoFull"), "red");
					return;
				}
				// 检查当前其他商品已选数量，进一步收紧容量
				let otherSelected = 0;
				GOODS.forEach(g => {
					if (g.id === id) return;
					otherSelected += parseInt(document.getElementById("buy-qty-" + g.id)?.value || 0);
				});
				const remaining = Math.max(0, freeSlots - otherSelected);
				const finalQty = Math.min(maxQty, remaining);
				if (finalQty <= 0) {
					showToast(T("errCargoFull"), "red");
					return;
				}
				setBuyQty(id, finalQty);
			}

			function setBuyQty(id, qty) { const inp = document.getElementById("buy-qty-" + id); if (inp) { inp.value = qty; calcBuyTotal(); } }

			function calcBuyTotal() {
				let total = 0;
				GOODS.forEach((g) => {
					const qty = parseInt(document.getElementById("buy-qty-" + g.id)?.value || 0);
					const price = G.cityPrices[g.id] || g.priceMin;
					const sub = qty * price;
					total += sub;
					const lineEl = document.getElementById("buy-line-" + g.id);
					if (lineEl) lineEl.textContent = sub > 0 ? sub.toLocaleString() + " " + T("gold") : "—";
				});
				document.getElementById("buy-total").textContent = total.toLocaleString();
			}

			function executeBuy() {
				let total = 0;
				const purchases = [];
				GOODS.forEach((g) => {
					const qty = parseInt(document.getElementById("buy-qty-" + g.id)?.value || 0);
					if (qty <= 0) return;
					const price = G.cityPrices[g.id] || g.priceMin;
					const actualQty = Math.min(qty, G.cityStock[g.id] || 0);
					total += actualQty * price;
					purchases.push({ g, qty: actualQty, price });
				});
				if (total === 0) { showToast(T("errNoGoods"), "red"); return; }
				if (total > G.gold) { showToast(T("errGold"), "red"); return; }
				purchases.forEach(({ g, qty, price }) => {
					if (!G.inventory[g.id]) G.inventory[g.id] = { qty: 0, avgPrice: price };
					const prev = G.inventory[g.id];
					const newQty = prev.qty + qty;
					prev.avgPrice = Math.round((prev.avgPrice * prev.qty + price * qty) / newQty);
					prev.qty = newQty;
					G.cityStock[g.id] = (G.cityStock[g.id] || 0) - qty;
				});
				G.gold -= total;
				showToast(T("toastBuy", total.toLocaleString()), "gold");
				renderGame();
			}

			// ── INVENTORY TABLE ──
			function renderInvTable() {
				const tbody = document.getElementById("inv-table-body");
				const items = Object.entries(G.inventory).filter(([, d]) => d.qty > 0);
				if (items.length === 0) {
					tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:1.5rem;">${T("invEmpty")}</td></tr>`;
					return;
				}
				tbody.innerHTML = items.map(([id, data]) => {
					const g = GOODS.find((x) => x.id === id);
					if (!g) return "";
					const goodName = LANG.current === "zh" ? g.name : g.nameEn;
					const mktPrice = G.cityPrices[g.id] || g.priceMin;
					const profit = mktPrice - data.avgPrice;
					const profitPct = data.avgPrice > 0 ? Math.round((profit / data.avgPrice) * 100) : 0;
					const profitStr = profit >= 0
						? `<span class="price-sell">+${profit.toLocaleString()} (+${profitPct}%)</span>`
						: `<span class="price-buy">${profit.toLocaleString()} (${profitPct}%)</span>`;
					return `<tr>
						<td><span class="item-name">${g.icon} ${goodName}</span></td>
						<td>${data.avgPrice.toLocaleString()}</td>
						<td>
							<span class="${mktPrice > data.avgPrice ? "price-sell" : "price-buy"}">${mktPrice.toLocaleString()}</span><br>
							<span style="font-size:0.68rem">${profitStr}</span>
						</td>
						<td class="qty-owned">${data.qty}</td>
						<td>
							<div class="qty-controls">
								<input type="number" class="qty-input" id="sell-qty-${id}" value="0" min="0" max="${data.qty}" oninput="calcSellTotal()">
								<button class="qty-shortcut" onclick="setSellQty('${id}',${data.qty})">MAX</button>
								<button class="qty-shortcut" onclick="setSellQty('${id}',0)">0</button>
							</div>
						</td>
						<td class="price-tag" id="sell-line-${id}">—</td>
					</tr>`;
				}).join("");
			}

			function setSellQty(id, qty) { const inp = document.getElementById("sell-qty-" + id); if (inp) { inp.value = qty; calcSellTotal(); } }

			function calcSellTotal() {
				let total = 0;
				Object.entries(G.inventory).forEach(([id, data]) => {
					const qty = parseInt(document.getElementById("sell-qty-" + id)?.value || 0);
					const g = GOODS.find((x) => x.id === id);
					if (!g) return;
					const sub = qty * (G.cityPrices[g.id] || g.priceMin);
					total += sub;
					const lineEl = document.getElementById("sell-line-" + id);
					if (lineEl) lineEl.textContent = sub > 0 ? sub.toLocaleString() + " " + T("gold") : "—";
				});
				document.getElementById("sell-total").textContent = total.toLocaleString();
			}

			function executeSell() {
				let total = 0;
				const sells = [];
				Object.entries(G.inventory).forEach(([id, data]) => {
					const qty = parseInt(document.getElementById("sell-qty-" + id)?.value || 0);
					if (qty <= 0 || qty > data.qty) return;
					const g = GOODS.find((x) => x.id === id);
					if (!g) return;
					total += qty * (G.cityPrices[g.id] || g.priceMin);
					sells.push({ id, qty });
				});
				if (total === 0) { showToast(T("errNoSell"), "red"); return; }
				sells.forEach(({ id, qty }) => {
					G.inventory[id].qty -= qty;
					if (G.inventory[id].qty <= 0) delete G.inventory[id];
				});
				G.gold += total;
				G.rep += Math.floor(total / 200);
				showToast(T("toastSell", total.toLocaleString()), "gold");
				renderGame();
			}

			// ── WEAPON TAB ──
			function renderWeaponTab() {
				const list = document.getElementById("weapon-member-list");
				list.innerHTML = G.team.map((m, i) => {
					const wData = m.weapon ? WEAPONS.find((w) => w.id === m.weapon) : null;
					return `<div class="member-equip-card">
						<div class="member-equip-name">${m.icon} ${m.name}<span class="member-role-badge">${m.role}</span></div>
						<div class="equip-slots"><div>
							<span class="equip-slot-label">${T("slotWeapon")}</span>
							<div class="equip-slot filled" onclick="unequipWeapon(${i})">
								${wData ? wData.icon + " " + (LANG.current === "en" && wData.nameEn ? wData.nameEn : wData.name) : T("slotEmpty")}
							</div>
						</div></div>
					</div>`;
				}).join("");

				const shop = document.getElementById("weapon-shop");
				shop.innerHTML = WEAPONS.map((w) => {
					const wName = LANG.current === "zh" ? w.name : w.nameEn;
					return `<div class="shop-item-row">
						<div>
							<div class="shop-item-name">${w.icon} ${wName}</div>
							<div class="shop-item-stats">${T("statAtk_s")}${w.atk}</div>
						</div>
						<div style="display:flex;align-items:center;gap:0.3rem;">
							<span class="shop-item-price">${w.price}${T("gold")}</span>
							<button class="btn-buy-equip" onclick="buyWeapon('${w.id}',${w.price})">${T("btnBuyToWH")}</button>
						</div>
					</div>`;
				}).join("");

				renderEquipWarehouseSection('weapon');
			}

			function buyWeapon(weapId, price) {
				if (G.gold < price) { showToast(T("errGold"), "red"); return; }
				const w = WEAPONS.find(x => x.id === weapId);
				if (!w) return;
				G.gold -= price;
				if (!G.equipWarehouse) G.equipWarehouse = [];
				G.equipWarehouse.push({ type: 'weapon', id: weapId, name: w.name, nameEn: w.nameEn, icon: w.icon, stat: w.atk, buyPrice: price });
				showToast(T("toastBuyWH", w.icon, w.name), "gold");
				renderGame();
			}

			function unequipWeapon(i) {
				const m = G.team[i];
				if (!m || !m.weapon) return;
				const w = WEAPONS.find(x => x.id === m.weapon);
				if (w) { if (!G.equipWarehouse) G.equipWarehouse = []; G.equipWarehouse.push({ type: 'weapon', id: w.id, name: w.name, nameEn: w.nameEn, icon: w.icon, stat: w.atk, buyPrice: w.price }); }
				m.weapon = null;
				showToast(T("toastUnequipW"), "");
				renderGame();
			}

			// ── ARMOR TAB ──
			function renderArmorTab() {
				const list = document.getElementById("armor-member-list");
				list.innerHTML = G.team.map((m, i) => {
					const aData = m.armor ? ARMORS.find((a) => a.id === m.armor) : null;
					return `<div class="member-equip-card">
						<div class="member-equip-name">${m.icon} ${m.name}<span class="member-role-badge">${m.role}</span></div>
						<div class="equip-slots"><div>
							<span class="equip-slot-label">${T("slotArmor")}</span>
							<div class="equip-slot filled" onclick="unequipArmor(${i})">
								${aData ? aData.icon + " " + (LANG.current === "en" && aData.nameEn ? aData.nameEn : aData.name) : T("slotEmpty")}
							</div>
						</div></div>
					</div>`;
				}).join("");

				const shop = document.getElementById("armor-shop");
				shop.innerHTML = ARMORS.map((a) => {
					const aName = LANG.current === "zh" ? a.name : a.nameEn;
					return `<div class="shop-item-row">
						<div>
							<div class="shop-item-name">${a.icon} ${aName}</div>
							<div class="shop-item-stats">${T("statDef_s")}${a.def}${T("statDef_e")}</div>
						</div>
						<div style="display:flex;align-items:center;gap:0.3rem;">
							<span class="shop-item-price">${a.price}${T("gold")}</span>
							<button class="btn-buy-equip" onclick="buyArmor('${a.id}',${a.price})">${T("btnBuyToWH")}</button>
						</div>
					</div>`;
				}).join("");

				renderEquipWarehouseSection('armor');
			}

			function buyArmor(armorId, price) {
				if (G.gold < price) { showToast(T("errGold"), "red"); return; }
				const a = ARMORS.find(x => x.id === armorId);
				if (!a) return;
				G.gold -= price;
				if (!G.equipWarehouse) G.equipWarehouse = [];
				G.equipWarehouse.push({ type: 'armor', id: armorId, name: a.name, nameEn: a.nameEn, icon: a.icon, stat: a.def, buyPrice: price });
				showToast(T("toastBuyWH", a.icon, a.name), "gold");
				renderGame();
			}

			function unequipArmor(i) {
				const m = G.team[i];
				if (!m || !m.armor) return;
				const a = ARMORS.find(x => x.id === m.armor);
				if (a) { if (!G.equipWarehouse) G.equipWarehouse = []; G.equipWarehouse.push({ type: 'armor', id: a.id, name: a.name, nameEn: a.nameEn, icon: a.icon, stat: a.def, buyPrice: a.price }); }
				m.armor = null;
				showToast(T("toastUnequipA"), "");
				renderGame();
			}

			function equipFromWarehouse(whIdx, memberIdx) {
				if (!G.equipWarehouse) return;
				const item = G.equipWarehouse[whIdx];
				if (!item) return;
				const m = G.team[memberIdx];
				if (!m) return;
				if (item.type === 'weapon' && m.weapon) {
					const oldW = WEAPONS.find(x => x.id === m.weapon);
					if (oldW) G.equipWarehouse.push({ type: 'weapon', id: oldW.id, name: oldW.name, icon: oldW.icon, stat: oldW.atk, buyPrice: oldW.price });
				}
				if (item.type === 'armor' && m.armor) {
					const oldA = ARMORS.find(x => x.id === m.armor);
					if (oldA) G.equipWarehouse.push({ type: 'armor', id: oldA.id, name: oldA.name, icon: oldA.icon, stat: oldA.def, buyPrice: oldA.price });
				}
				if (item.type === 'weapon') m.weapon = item.id;
				if (item.type === 'armor')  m.armor  = item.id;
				G.equipWarehouse.splice(whIdx, 1);
				showToast(T("toastEquipWH", item.icon, item.name, m.name), "gold");
				renderGame();
			}

			function sellFromWarehouse(whIdx) {
				if (!G.equipWarehouse) return;
				const item = G.equipWarehouse[whIdx];
				if (!item) return;
				const sellPrice = Math.floor(item.buyPrice / 2);
				G.gold += sellPrice;
				G.equipWarehouse.splice(whIdx, 1);
				showToast(T("toastSellWH", sellPrice, item.name), "gold");
				renderGame();
			}

			function renderEquipWarehouseSection(typeFilter) {
				const el = document.getElementById(typeFilter === 'weapon' ? 'weapon-warehouse-section' : 'armor-warehouse-section');
				if (!el) return;
				if (!G.equipWarehouse) G.equipWarehouse = [];
				const items = G.equipWarehouse.map((item, idx) => ({...item, _idx: idx})).filter(item => item.type === typeFilter);
				if (items.length === 0) { el.innerHTML = `<div style="color:var(--text3);font-size:0.78rem;padding:0.5rem 0;">${T("whEmpty")}</div>`; return; }
				el.innerHTML = items.map(item => {
					const sellPrice = Math.floor(item.buyPrice / 2);
					const statLabel = typeFilter === 'weapon' ? `${T("statAtk_s")}${item.stat}` : `${T("statDef_s")}${item.stat}${T("statDef_e")}`;
					const memberOptions = G.team.map((m, i) => `<option value="${i}">${m.name}</option>`).join("");
					const displayName = (LANG.current === "en" && item.nameEn) ? item.nameEn : item.name;
					return `<div class="shop-item-row" style="flex-wrap:wrap;gap:0.3rem 0.5rem;">
						<div style="flex:1;min-width:80px;">
							<div class="shop-item-name">${item.icon} ${displayName}</div>
							<div class="shop-item-stats">${statLabel} · ${item.buyPrice}${T("gold")}</div>
						</div>
						<div style="display:flex;align-items:center;gap:0.3rem;flex-wrap:wrap;">
							<select class="qty-input" id="wh-target-${item._idx}" style="width:60px;font-size:0.68rem;">${memberOptions}</select>
							<button class="btn-buy-equip" onclick="equipFromWarehouse(${item._idx}, parseInt(document.getElementById('wh-target-${item._idx}').value))">${T("btnEquip")}</button>
							<button class="btn-buy-equip" style="border-color:var(--red2);color:var(--red2);" onclick="sellFromWarehouse(${item._idx})">${T("btnSellWH")} ${sellPrice}${T("gold")}</button>
						</div>
					</div>`;
				}).join("");
			}

			// ── TRANSPORT ──
			function renderTransportGrid() {
				const grid = document.getElementById("transport-grid");
				const activeId = getActiveTransport()?.id;
				grid.innerHTML = G.transports.map((t) => {
					const tName = LANG.current === "zh" ? t.name : t.nameEn;
					const isActive = activeId === t.id;
					const switchBtn = t.owned && !isActive ? `<button onclick="switchTransport('${t.id}')" style="margin-top:0.5rem;font-size:0.68rem;padding:0.25rem 0.7rem;background:none;border:1px solid var(--gold);color:var(--gold);cursor:pointer;font-family:inherit;letter-spacing:0.05em;">${T("btnSwitchTransport")}</button>` : "";
					return `<div class="transport-card ${t.owned ? "owned" : ""}" onclick="${t.owned ? '' : `buyTransport('${t.id}')`}" style="${t.owned ? '' : 'cursor:pointer'}">
						${t.owned ? `<div class="owned-badge">${isActive ? "▶ " : ""}${T("transportOwned")}</div>` : ""}
						<span class="transport-icon">${t.icon}</span>
						<div class="transport-name">${tName}</div>
						<div class="transport-stats" style="line-height:1.7">
							<div>📦 ${t.cap} &nbsp; 🚀 ${t.spd}</div>
							<div>👥 +${t.passengers} &nbsp; ⛽ ${t.fuelCost}/${T("travelDays")}</div>
						</div>
						<div class="transport-price">${t.owned ? "—" : t.price + " " + T("gold")}</div>
						${switchBtn}
					</div>`;
				}).join("");
			}

			function switchTransport(id) {
				const t = G.transports.find(x => x.id === id);
				if (!t || !t.owned) return;
				G.activeTransportId = id;
				const tName = LANG.current === "zh" ? t.name : t.nameEn;
				showToast(T("toastSwitchTransport", t.icon, tName), "gold");
				renderGame();
			}

			function buyTransport(id) {
				const t = G.transports.find((x) => x.id === id);
				if (!t || t.owned) return;
				if (G.gold < t.price) { showToast(T("errGold"), "red"); return; }
				G.gold -= t.price;
				t.owned = true;
				G.activeTransportId = id;
				showToast(T("toastTransport", LANG.current === "zh" ? t.name : t.nameEn), "gold");
				renderGame();
			}

			// ── TEAM ──
			function renderTeamGrid() {
				const grid = document.getElementById("team-grid");
				grid.innerHTML = G.team.map((m, idx) => {
					const isPlayer = m.isPlayer;
					const armorData = m.armor ? ARMORS.find((a) => a.id === m.armor) : null;
					const armorDef  = armorData ? armorData.def : 0;
					let statsHtml = "";
					if (isPlayer) {
						statsHtml = `<div style="font-size:0.72rem;color:var(--text3);margin-bottom:0.6rem;text-align:center;letter-spacing:0.05em;">${T("playerTag")}</div>`;
					} else {
						const atkLabel = m.talentOn === "atk" && m.atkBase !== undefined ? `${m.atk} <span style="color:var(--text3);font-size:0.68rem;">(${m.atkBase}×${m.talent})</span>` : `${m.atk ?? "-"}`;
						const defLabel = m.talentOn === "def" && m.defBase !== undefined ? `${m.def} <span style="color:var(--text3);font-size:0.68rem;">(${m.defBase}×${m.talent})</span>` : `${m.def ?? 0}${armorDef > 0 ? `<span style="font-size:0.68rem;color:var(--text3)"> +${armorDef}</span>` : ""}`;
						const hpVal    = m.hp ?? m.hpBase ?? 200;
						const hpLabel  = m.talentOn === "hp" && m.hpBase !== undefined ? `${hpVal} <span style="color:var(--text3);font-size:0.68rem;">(${m.hpBase}×${m.talent})</span>` : `${hpVal}`;
						statsHtml = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.35rem 0.5rem;font-size:0.75rem;margin-bottom:0.6rem;">
							<div style="color:var(--text3)">${T("labelATK")} <span style="color:var(--red2);font-weight:500">${atkLabel}</span></div>
							<div style="color:var(--text3)">${T("labelDEF")} <span style="color:var(--green2);font-weight:500">${defLabel}</span></div>
							<div style="color:var(--text3)">HP <span style="color:#6ab0f5;font-weight:500">${hpLabel}</span></div>
						</div>`;
					}
					const wData = m.weapon ? WEAPONS.find((w) => w.id === m.weapon) : null;
					const dismissBtn = !isPlayer ? `<button onclick="confirmDismiss(${idx})" style="background:none;border:1px solid var(--red);color:var(--red2);font-size:0.68rem;padding:0.2rem 0.6rem;cursor:pointer;font-family:inherit;transition:all 0.2s;" onmouseover="this.style.background='rgba(139,42,42,0.15)'" onmouseout="this.style.background='none'">${T("btnDismiss")}</button>` : "";
					return `<div class="team-card">
						<div class="team-member-header">
							<div style="flex:1"><div class="team-name">${m.name}</div>${m.role ? `<div class="team-role">${m.role}</div>` : ""}</div>
							${dismissBtn}
						</div>
						${statsHtml}
						<div class="team-footer">
							<div>
								${wData ? wData.icon + "·" + (LANG.current === "en" && wData.nameEn ? wData.nameEn : wData.name) : T("noWeapon")}
								&nbsp;
								${armorData ? armorData.icon + "·" + (LANG.current === "en" && armorData.nameEn ? armorData.nameEn : armorData.name) : T("noArmor")}
							</div>
							<div>
								<span class="wage-label">${T("wageLabel")}</span>
								<span class="wage-val">${m.wage > 0 ? m.wage + T("wageSuffix") : "—"}</span>
							</div>
						</div>
					</div>`;
				}).join("");
			}

			function confirmDismiss(idx) {
				const m = G.team[idx];
				if (!m || m.isPlayer) return;
				const old = document.getElementById("dismiss-confirm-modal");
				if (old) old.remove();
				const modal = document.createElement("div");
				modal.id = "dismiss-confirm-modal";
				modal.className = "modal-overlay open";
				modal.innerHTML = `<div class="modal-box" style="text-align:center;max-width:300px;">
					<div style="font-size:1.8rem;margin-bottom:0.5rem;">⚠️</div>
					<div class="modal-title" style="margin-bottom:0.7rem;">${T("confirmDismissTitle")}</div>
					<div style="font-size:0.85rem;color:var(--text);line-height:1.7;margin-bottom:1rem;">${T("confirmDismissBody", m.name)}</div>
					<div style="display:flex;gap:0.6rem;">
						<button class="btn-primary" style="margin-top:0;flex:1;border-color:var(--border2);color:var(--text2);" onclick="document.getElementById('dismiss-confirm-modal').remove();">${T("btnCancel")}</button>
						<button class="btn-primary" style="margin-top:0;flex:1;border-color:var(--red);color:var(--red2);" onclick="dismissMember(${idx})">${T("btnConfirmDismiss")}</button>
					</div>
				</div>`;
				document.body.appendChild(modal);
			}

			function dismissMember(idx) {
				const m = G.team[idx];
				if (!m || m.isPlayer) return;
				G.team.splice(idx, 1);
				const old = document.getElementById("dismiss-confirm-modal");
				if (old) old.remove();
				renderGame();
				showToast(T("toastDismissed", m.name), "");
			}

			function statBar(label, val, cls) {
				return `<div class="stat-row">
					<div class="stat-row-label">${label}</div>
					<div class="stat-bar-bg"><div class="stat-bar-fill ${cls}" style="width:${Math.min((val / 20) * 100, 100)}%"></div></div>
					<div class="stat-num">${val}</div>
				</div>`;
			}



			// ══════════════════════════════════
			// TRAVEL
			// ══════════════════════════════════
			function getActiveTransport() {
				const owned = G.transports.filter((t) => t.owned);
				if (!owned.length) return G.transports.find(t => t.id === "walk") || G.transports[0];
				if (G.activeTransportId) {
					const sel = owned.find(t => t.id === G.activeTransportId);
					if (sel) return sel;
				}
				return owned.reduce((best, t) => (t.spd > best.spd ? t : best), owned[0]);
			}

			function generateTravelOptions() {
				const allCities = (CITIES[G.country] || []).filter((c) => c !== G.city);
				const shuffled  = allCities.sort(() => Math.random() - 0.5).slice(0, 2);
				const transport = getActiveTransport();
				const options = shuffled.map((city) => {
					const dist = Math.floor(1 + Math.random() * 20);
					const days = Math.ceil(dist / transport.spd);
					return { city, dist, days, fuelNeeded: days * transport.fuelCost, crimeRate: Math.floor(15 + Math.random() * 66) };
				});
				G._travelOptions = options;
				G._travelOptionsCity = G.city;
			}

			function openTravel() {
				// 只有在城市变更时才重新生成目的地
				if (!G._travelOptions || G._travelOptionsCity !== G.city) {
					generateTravelOptions();
				}
				const options = G._travelOptions;
				const transport = getActiveTransport();
				const fuelOwned = G.inventory["fuel"]?.qty || 0;

				const grid = document.getElementById("city-grid");
				grid.innerHTML = options.map((o, i) => {
					const canGo = transport.fuelCost === 0 || fuelOwned >= o.fuelNeeded;
					const fuelStr = transport.fuelCost > 0 ? `<span style="color:var(--red2)">⛽ ${o.fuelNeeded}${T("travelFuel")}</span>` : `<span style="color:var(--green2)">⛽ 0</span>`;
					const crimeColor = o.crimeRate < 30 ? "var(--green2)" : o.crimeRate < 55 ? "var(--gold)" : "var(--red2)";
					return `<button class="city-btn ${canGo ? "" : "disabled-city"}" onclick="${canGo ? `confirmTravel(${i})` : ""}">
						<strong>${o.city}</strong>
						<div style="font-size:0.65rem;margin-top:4px;display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
							<span>📏 ${o.dist}${T("travelDist")}</span>
							<span>📅 ${o.days}${T("travelDays")}</span>
							${fuelStr}
							<span style="color:${crimeColor}">⚠️ ${T("travelCrimeLabel")} ${o.crimeRate}%</span>
						</div>
					</button>`;
				}).join("");

				const tName = LANG.current === "zh" ? transport.name : transport.nameEn;
				document.getElementById("travel-active-transport").textContent = `${transport.icon} ${tName} · ${T("travelSpeedLabel")}: ${transport.spd}`;
				document.getElementById("travel-modal").classList.add("open");
			}

			function closeTravel() { document.getElementById("travel-modal").classList.remove("open"); }

			function confirmTravel(idx) {
				const o = G._travelOptions[idx];
				const transport = getActiveTransport();
				if (transport.fuelCost > 0) {
					const fuelInv = G.inventory["fuel"];
					if (!fuelInv || fuelInv.qty < o.fuelNeeded) { showToast(T("errFuel"), "red"); return; }
					fuelInv.qty -= o.fuelNeeded;
					if (fuelInv.qty <= 0) delete G.inventory["fuel"];
				}
				G.prevCity = G.city;
				G.city  = o.city;
				G.day  += o.days;
				tickNews();       // 检查到期新闻
				tryTriggerNews(); // 10%概率触发新事件
				generateCityPrices();
				const wage = G.team.reduce((s, m) => s + m.wage, 0);
				G.gold -= wage * o.days;
				closeTravel();
				renderGame();
				setTimeout(() => triggerRoadEvents(o.crimeRate, o.days), 600);
			}

			// ── ROAD EVENTS ──
			function getRoadEvent(crimeRate) {
				const events = [
					{ id: "nothing",  weight: 180 - 2 * crimeRate },
					{ id: "steal",    weight: 0.6 * crimeRate },
					{ id: "police",   weight: 0.5 * crimeRate },
					{ id: "criminal", weight: crimeRate },
					{ id: "person",   weight: 25 },
					{ id: "merchant", weight: 25 },
				];
				const total = events.reduce((s, e) => s + e.weight, 0);
				let sum = 0, roll = Math.random() * total;
				for (const e of events) { sum += e.weight; if (roll <= sum) return e.id; }
				return "nothing";
			}

			function getPlayerCombatPower() {
				let totalAtk = 0, totalDef = 0;
				G.team.forEach(m => {
					totalAtk += (m.atk || 30) + (m.weapon ? (WEAPONS.find(w => w.id === m.weapon)?.atk || 0) : 0);
					totalDef += (m.def || 10) + (m.armor  ? (ARMORS.find(a => a.id === m.armor)?.def  || 0) : 0);
				});
				return { totalAtk, totalDef };
			}

			function generateEnemyWithTalent(typeStr, idx) {
				const atkBase = Math.floor(Math.random() * 101);
				const defBase = Math.floor(Math.random() * 101);
				const hpBase  = Math.floor(200 + Math.random() * 201);
				const factor  = Math.random() * Math.random() * Math.random();
				const talent  = Math.round((1.0 + 9.0 * factor) * 10) / 10;
				const roll    = Math.random();
				const talentOn = roll < 0.33 ? "atk" : roll < 0.66 ? "def" : "hp";
				const atkTotal = talentOn === "atk" ? Math.round(atkBase * talent) : atkBase;
				const defTotal = talentOn === "def" ? Math.round(defBase * talent) : defBase;
				const hpTotal  = talentOn === "hp"  ? Math.round(hpBase  * talent) : hpBase;
				const wIdx = Math.floor(Math.random() * 7);
				const aIdx = Math.floor(Math.random() * 7);
				const avg  = (wIdx + aIdx) / 2;
				const tier = avg <= 1 ? "E" : avg <= 2 ? "D" : avg <= 3 ? "C" : avg <= 4 ? "B" : avg <= 5 ? "A" : "S";
				const e = {
					name: `${typeStr}#${idx+1}`, type: typeStr,
					atk: atkTotal, def: defTotal, hp: hpTotal, maxHp: hpTotal,
					wIdx, aIdx, tier, hasAttemptedFlee: false,
					talent, talentOn,
				};
				return e;
			}

			function generateEliteSquad(typeStr, offset) {
				const eliteTiers = ["B", "A", "S"];
				const size = Math.random() < 0.5 ? 4 : 5;
				const party = [];
				for (let i = 0; i < size; i++) {
					const tier = eliteTiers[Math.floor(Math.random() * eliteTiers.length)];
					// 根据tier决定装备档次
					const tierWMin = tier === "B" ? 3 : tier === "A" ? 4 : 5;
					const wIdx = tierWMin + Math.floor(Math.random() * (7 - tierWMin));
					const aIdx = tierWMin + Math.floor(Math.random() * (7 - tierWMin));
					const atkBase = Math.floor(60 + Math.random() * 41); // 60-100
					const defBase = Math.floor(60 + Math.random() * 41);
					const hpBase  = Math.floor(300 + Math.random() * 201);
					const factor  = Math.random() * Math.random() * Math.random();
					const talent  = Math.round((1.0 + 9.0 * factor) * 10) / 10;
					const roll    = Math.random();
					const talentOn = roll < 0.33 ? "atk" : roll < 0.66 ? "def" : "hp";
					const atkTotal = talentOn === "atk" ? Math.round(atkBase * talent) : atkBase;
					const defTotal = talentOn === "def" ? Math.round(defBase * talent) : defBase;
					const hpTotal  = talentOn === "hp"  ? Math.round(hpBase  * talent) : hpBase;
					party.push({
						name: `${T('eliteMark')}${typeStr}#${offset+i+1}`, type: typeStr,
						atk: atkTotal, def: defTotal, hp: hpTotal, maxHp: hpTotal,
						wIdx, aIdx, tier, hasAttemptedFlee: false,
						talent, talentOn, isElite: true,
					});
				}
				return party;
			}

			function generateEnemyForce(typeStr, cnType) {
				const { totalAtk, totalDef } = getPlayerCombatPower();
				const isStrong = (totalAtk + totalDef) > 400;

				const size = Math.floor(Math.random() * 3) + 1;
				const party = [];
				for (let i = 0; i < size; i++) {
					if (isStrong) {
						party.push(generateEnemyWithTalent(typeStr, i));
					} else {
						const wIdx = Math.floor(Math.random() * 7);
						const aIdx = Math.floor(Math.random() * 7);
						const avg  = (wIdx + aIdx) / 2;
						const tier = avg <= 1 ? "E" : avg <= 2 ? "D" : avg <= 3 ? "C" : avg <= 4 ? "B" : avg <= 5 ? "A" : "S";
						const e = {
							name: `${typeStr}#${i+1}`, type: typeStr,
							atk: Math.floor(Math.random() * 101), def: Math.floor(Math.random() * 101),
							hp: Math.floor(200 + Math.random() * 201), maxHp: 0,
							wIdx, aIdx, tier, hasAttemptedFlee: false,
						};
						e.maxHp = e.hp;
						party.push(e);
					}
				}

				// 玩家战力超过400时，额外加入精英小队
				if (isStrong) {
					const elites = generateEliteSquad(typeStr, size);
					elites.forEach(e => party.push(e));
				}

				return party;
			}

			function getForceDesc(force) {
				const typeName = T("enemyType" + force[0].type.charAt(0).toUpperCase() + force[0].type.slice(1));
				const tiers = force.map(f => (f.isElite ? "★" : "") + f.tier + T("tierSuffix")).join(LANG.current === "zh" ? "，" : ", ");
				return T("forceDesc", force.length, typeName, tiers);
			}

			const ROAD_EVENT_DATA = {
				nothing: { icon: "🌄", choices: null,
					zh: () => T("roadNothing"), en: () => T("roadNothing") },
				steal: { icon: "🦹", choices: null,
					zh: () => T("roadSteal"), en: () => T("roadSteal"),
					resolve: () => {
						if (G.gold < 0) {
							return { text: T("roadStealBroke") };
						}
						const pct  = 0.01 + Math.random() * 0.19;
						const lost = Math.max(1, Math.floor(G.gold * pct));
						G.gold -= lost;
						return { goldDelta: -lost, text: T("roadStealResult", lost, Math.round(pct * 100)) };
					},
				},
				person: { icon: "🤕",
					zh: () => T("roadPerson"), en: () => T("roadPerson"),
					choices: [
						{ label: () => T("choiceRob_zh"),
							resolve: () => {
								const gold = Math.floor(10 + Math.random() * 60);
								G.gold += gold; G.rep -= 3;
								return { goldDelta: gold, repDelta: -3, text: T("roadPersonRob", gold) };
							},
						},
						{ label: () => T("choiceHelp_zh"),
							resolve: () => {
								const freeSeats = getTransportFreeSeats();
								G.rep += 2;
								if (freeSeats > 0) {
									const npc = genNPC();
									G.team.push(npc);
									renderGame();
									return { repDelta: 2, text: T("roadPersonHelpFull", npc.icon, npc.name, npc.atk, npc.def, npc.talent, npc.wage) };
								}
								return { repDelta: 2, text: T("roadPersonHelpNoSeat") };
							},
						},
						{ label: () => T("choiceIgnore_zh"),
							resolve: () => ({ text: T("roadPersonIgnore") }) },
					],
				},
				police: { icon: "👮",
					setup: function() { this.enemies = generateEnemyForce("police"); },
					zh: function() { return T("policeEventDesc", getForceDesc(this.enemies)); },
					en: function() { return T("policeEventDesc", getForceDesc(this.enemies)); },
					choices: [
						{ label: () => T("choiceComply_zh"),
							resolve: () => {
								const contraband = G.inventory["contraband"];
								if (contraband && contraband.qty > 0) {
									const fine = Math.floor(G.gold * 0.5);
									G.gold = Math.max(0, G.gold - fine);
									delete G.inventory["contraband"];
									return { goldDelta: -fine, text: T("roadPoliceFine", fine) };
								}
								return { text: T("roadPolicePass") };
							},
						},
						{ label: () => T("choiceResist_zh"), isCombatTrigger: true },
					],
				},
				merchant: { icon: "🤝",
					setup: function() { this.enemies = generateEnemyForce("merchant"); },
					zh: function() { return T("merchantEventDesc", getForceDesc(this.enemies)); },
					en: function() { return T("merchantEventDesc", getForceDesc(this.enemies)); },
					choices: [
						{ label: () => T("choiceRobMerchant_zh"), isCombatTrigger: true },
						{ label: () => T("choiceGreet_zh"),
							resolve: () => ({ text: T("roadMerchantGreet"), _autoAdvance: true }) },
					],
				},
				criminal: { icon: "🔫",
					setup: function() { this.enemies = generateEnemyForce("criminal"); },
					zh: function() { return T("criminalEventDesc", getForceDesc(this.enemies)); },
					en: function() { return T("criminalEventDesc", getForceDesc(this.enemies)); },
					choices: [
						{ label: () => T("choiceSurrender_zh"),
							resolve: () => {
								if (G.gold < 0) {
									return { text: T("roadCriminalBroke") };
								}
								const goldLost = Math.floor(G.gold * 0.5);
								G.gold -= goldLost;
								const invKeys = Object.keys(G.inventory);
								invKeys.filter(() => Math.random() < 0.5).forEach((k) => delete G.inventory[k]);
								return { goldDelta: -goldLost, text: T("roadCriminalSurrender", goldLost) };
							},
						},
						{ label: () => T("choiceFight_zh"), isCombatTrigger: true },
					],
				},
			};

			let _eventQueue = [], _autoAdvanceTimer = null;

			function triggerRoadEvents(crimeRate, days) {
				_eventQueue = [];
				for (let d = 0; d < days; d++) _eventQueue.push({ day: d + 1, totalDays: days, eventId: getRoadEvent(crimeRate) });
				renderGame();
				_showNextEvent();
			}

			function _showNextEvent() {
				if (_autoAdvanceTimer) { clearTimeout(_autoAdvanceTimer); _autoAdvanceTimer = null; }
				if (_eventQueue.length === 0) { const old = document.getElementById("road-event-modal"); if (old) old.remove(); return; }
				_renderEventModal(_eventQueue.shift());
			}

			function _resolveChoice(resolveFn) { const result = resolveFn(); renderGame(); _showOutcomeModal(result); }

			function _showOutcomeModal(result) {
				const old = document.getElementById("road-event-modal");
				if (old) old.remove();
				let effects = "";
				if (result.goldDelta > 0) effects += `<span style="color:var(--gold2)">💰 +${result.goldDelta}</span>`;
				if (result.goldDelta < 0) effects += `<span style="color:var(--red2)">💰 ${result.goldDelta}</span>`;
				if (result.repDelta   > 0) effects += `<span style="color:var(--green2)">⭐ +${result.repDelta}</span>`;
				if (result.repDelta   < 0) effects += `<span style="color:var(--red2)">⭐ ${result.repDelta}</span>`;
				const closeLabel = _eventQueue.length === 0 ? T("eventArrive") : T("eventContinue");
				const timerBarHtml = `<div id="event-timer-track" style="width:100%;height:3px;background:var(--bg5);border-radius:2px;margin-bottom:1rem;overflow:hidden;"><div id="event-timer-fill" style="height:100%;width:0%;background:var(--gold);transition:width 2s linear;"></div></div>`;
				const modal = document.createElement("div");
				modal.id = "road-event-modal"; modal.className = "modal-overlay open";
				modal.innerHTML = `<div class="modal-box" style="text-align:center;max-width:340px;padding-bottom:1.4rem;">
					<div style="font-size:1.6rem;margin-bottom:0.5rem;">📜</div>
					<div class="modal-title" style="margin-bottom:0.7rem;">${T("eventOutcomeTitle")}</div>
					${timerBarHtml}
					<div style="font-size:0.88rem;color:var(--text);line-height:1.7;margin-bottom:0.9rem;">${result.text}</div>
					${effects ? `<div style="display:flex;gap:0.8rem;justify-content:center;font-size:0.85rem;margin-bottom:1rem;">${effects}</div>` : ""}
					<button id="outcome-continue-btn" class="btn-primary" style="margin-top:0;opacity:0.45;transition:opacity 0.4s;" onclick="document.getElementById('road-event-modal').remove();_showNextEvent();">${closeLabel}</button>
					<div style="font-size:0.65rem;color:var(--text3);margin-top:0.5rem;letter-spacing:0.1em;">${T("eventAutoHint")}</div>
				</div>`;
				document.body.appendChild(modal);
				requestAnimationFrame(() => requestAnimationFrame(() => { const fill = document.getElementById("event-timer-fill"); if (fill) fill.style.width = "100%"; }));
				_autoAdvanceTimer = setTimeout(() => { const m = document.getElementById("road-event-modal"); if (m) m.remove(); _showNextEvent(); }, 2000);
				const btn = document.getElementById("outcome-continue-btn");
				if (btn) btn.onclick = () => { if (_autoAdvanceTimer) { clearTimeout(_autoAdvanceTimer); _autoAdvanceTimer = null; } const m = document.getElementById("road-event-modal"); if (m) m.remove(); _showNextEvent(); };
			}

			function _buildProgressBar(day, totalDays) {
				let html = '<div style="display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:1.1rem;">';
				for (let i = 1; i <= totalDays; i++) {
					if (i < day)       html += `<span style="display:inline-block;width:10px;height:10px;background:var(--gold);border:1px solid var(--gold);"></span>`;
					else if (i === day) html += `<span style="display:inline-block;width:16px;height:16px;background:transparent;border:2px solid var(--gold2);box-shadow:0 0 6px rgba(201,168,76,0.5);"></span>`;
					else               html += `<span style="display:inline-block;width:10px;height:10px;background:transparent;border:1px solid var(--border2);"></span>`;
				}
				return html + "</div>";
			}

			function _renderEventModal(item) {
				const old = document.getElementById("road-event-modal");
				if (old) old.remove();
				if (_autoAdvanceTimer) { clearTimeout(_autoAdvanceTimer); _autoAdvanceTimer = null; }

				const { day, totalDays, eventId } = item;
				const data = ROAD_EVENT_DATA[eventId];
				if (data.setup) data.setup();

				const isZh = LANG.current === "zh";
				const desc = isZh ? (typeof data.zh === 'function' ? data.zh() : data.zh) : (typeof data.en === 'function' ? data.en() : data.en);

				const hasChoices = data.choices && data.choices.length > 0;
				const isPassive  = !hasChoices;

				let passiveResult = null;
				if (isPassive && data.resolve) { passiveResult = data.resolve(); renderGame(); }

				const progressBar    = _buildProgressBar(day, totalDays);
				const isLast         = _eventQueue.length === 0;
				const continueLabel  = isLast ? T("eventArrive") : T("eventContinue");

				let choicesHtml = "";
				if (hasChoices) {
					choicesHtml = `<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.8rem;">`;
					data.choices.forEach((c, i) => {
						const label = typeof c.label === 'function' ? c.label() : c.label;
						if (c.isCombatTrigger) {
							choicesHtml += `<button class="btn-primary" style="margin-top:0;font-size:0.8rem;border-color:var(--red);" onclick="initiateCombatBridge('${eventId}')">${label}</button>`;
						} else {
							choicesHtml += `<button class="btn-primary" style="margin-top:0;font-size:0.8rem;" onclick="_resolveChoiceByIndex('${eventId}',${i})">${label}</button>`;
						}
					});
					choicesHtml += `</div>`;
				}

				let passiveEffectHtml = "";
				if (passiveResult) {
					if (passiveResult.goldDelta < 0) passiveEffectHtml += `<span style="color:var(--red2)">💰 ${passiveResult.goldDelta}</span> `;
					if (passiveResult.goldDelta > 0) passiveEffectHtml += `<span style="color:var(--gold2)">💰 +${passiveResult.goldDelta}</span> `;
					if (passiveEffectHtml) passiveEffectHtml = `<div style="margin-bottom:0.6rem;font-size:0.85rem;">${passiveEffectHtml}</div>`;
				}

				const bodyText = isPassive && passiveResult ? passiveResult.text : desc;
				const timerBarHtml = isPassive ? `<div id="event-timer-track" style="width:100%;height:3px;background:var(--bg5);border-radius:2px;margin-bottom:1rem;overflow:hidden;"><div id="event-timer-fill" style="height:100%;width:0%;background:var(--gold);transition:width 2s linear;"></div></div>` : "";

				const modal = document.createElement("div");
				modal.id = "road-event-modal"; modal.className = "modal-overlay open";
				modal.innerHTML = `<div class="modal-box" style="text-align:center;max-width:340px;padding-bottom:1.4rem;">
					<div style="margin-bottom:0.2rem;font-size:0.6rem;color:var(--text3);letter-spacing:0.15em;">${T("roadEventDayOf", day, totalDays)}</div>
					${progressBar}
					${timerBarHtml}
					<div style="font-size:2.4rem;margin-bottom:0.5rem;">${data.icon}</div>
					<div class="modal-title" style="margin-bottom:0.6rem;">${T("roadEventTitle")}</div>
					<div style="font-size:0.85rem;color:var(--text);line-height:1.6;margin-bottom:0.5rem;">${bodyText}</div>
					${passiveEffectHtml}
					${hasChoices ? choicesHtml : `<button id="event-continue-btn" class="btn-primary" style="margin-top:0.8rem;opacity:${isPassive ? 0.45 : 1};transition:opacity 0.4s;">${continueLabel}</button>`}
					${isPassive ? `<div id="event-auto-hint" style="font-size:0.65rem;color:var(--text3);margin-top:0.5rem;letter-spacing:0.1em;">${T("eventAutoHint")}</div>` : ""}
				</div>`;
				document.body.appendChild(modal);

				if (isPassive) {
					requestAnimationFrame(() => requestAnimationFrame(() => { const fill = document.getElementById("event-timer-fill"); if (fill) fill.style.width = "100%"; }));
					_autoAdvanceTimer = setTimeout(_showNextEvent, 2000);
					const btn = document.getElementById("event-continue-btn");
					if (btn) btn.onclick = () => { if (_autoAdvanceTimer) { clearTimeout(_autoAdvanceTimer); _autoAdvanceTimer = null; } _showNextEvent(); };
				}
			}

			function _resolveChoiceByIndex(eventId, idx) {
				const data = ROAD_EVENT_DATA[eventId];
				if (!data?.choices?.[idx]) return;
				_resolveChoice(data.choices[idx].resolve);
			}

			function initiateCombatBridge(eventId) {
				const old = document.getElementById("road-event-modal");
				if (old) old.remove();
				startCombatEngine(ROAD_EVENT_DATA[eventId].enemies);
			}

			// ══════════════════════════════════
			// CORE COMBAT ENGINE
			// ══════════════════════════════════
			let C = { allies: [], enemies: [], logLines: [], isAuto: false, combatTimer: null, preCombatGold: 0, selectedEnemyIdx: 0, isExecutingTurn: false };

			function startCombatEngine(enemyList) {
				C.preCombatGold = G.gold;
				C.enemies = JSON.parse(JSON.stringify(enemyList));
				C.isAuto = false; C.selectedEnemyIdx = 0; C.logLines = []; C.isExecutingTurn = false;
				if (C.combatTimer) clearInterval(C.combatTimer);

				let totalAtk = 0, totalDef = 0, totalHp = 0;
				G.team.forEach(m => {
					totalAtk += (m.atk || 30) + (m.weapon ? (WEAPONS.find(w => w.id === m.weapon)?.atk || 0) : 0);
					totalDef += (m.def || 10) + (m.armor  ? (ARMORS.find(a => a.id === m.armor)?.def  || 0) : 0);
					totalHp  += m.isPlayer ? 300 : (m.hp || m.hpBase || 200);
				});
				C.party  = { name: T("combatPartyName"), atk: totalAtk, def: totalDef, hp: totalHp, maxHp: totalHp };
				C.allies = [];
				document.getElementById("combat-modal").classList.add("open");
				// 确保进入战斗时所有按钮均可点击
				disableAllCombatButtons(false);
				combatLogAdd(T("combatStart", totalAtk, totalDef, totalHp));
				renderCombatScreen();
			}

			function renderCombatScreen() {
				const allyListEl = document.getElementById("combat-allies-list");
				if (C.party) {
					const hpPct = Math.max(0, (C.party.hp / C.party.maxHp) * 100);
					allyListEl.innerHTML = `<div class="combat-unit-row">
						<div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:2px;">
							<strong>🏕 ${C.party.name}</strong>
							<span style="color:var(--gold)">${Math.max(0, C.party.hp)} / ${C.party.maxHp}</span>
						</div>
						<div class="combat-hp-bar-bg"><div class="combat-hp-bar-fill" style="width: ${hpPct}%;"></div></div>
						<div style="font-size:0.65rem;color:var(--text3);margin-top:3px;">⚔ ${C.party.atk} &nbsp; 🛡 ${C.party.def} &nbsp; ${T("combatMemberCount", G.team.length)}</div>
					</div>`;
				} else {
					allyListEl.innerHTML = "";
				}

				document.getElementById("combat-enemies-list").innerHTML = C.enemies.map((e, idx) => {
					const hpPct = Math.max(0, (e.hp / e.maxHp) * 100);
					const eliteMark = e.isElite ? `<span style="color:var(--red2);font-size:0.6rem;margin-left:2px;">${T("eliteMark")}</span>` : "";
					const talentMark = e.talent ? `<span style="color:var(--gold);font-size:0.6rem;margin-left:2px;">${T("talentMark", e.talent)}</span>` : "";
					return `<div class="combat-unit-row ${e.hp <= 0 ? 'dead' : ''} ${C.selectedEnemyIdx === idx ? 'selected' : ''}" onclick="combatSelectEnemy(${idx})">
						<div style="display:flex; justify-content:space-between; font-size:0.75rem;">
							<span>${e.name}<span class="tier-badge tier-${e.tier}">${e.tier}</span>${eliteMark}${talentMark}</span>
							<span>${e.hp <= 0 ? '0' : e.hp}/${e.maxHp}</span>
						</div>
						<div class="combat-hp-bar-bg"><div class="combat-hp-bar-fill enemy-hp" style="width: ${hpPct}%;"></div></div>
					</div>`;
				}).join("");

				const autoBtn = document.getElementById("combat-btn-auto");
				if (C.isAuto) { autoBtn.classList.add("active-auto"); autoBtn.textContent = T("combatBtnAutoOff"); }
				else          { autoBtn.classList.remove("active-auto"); autoBtn.textContent = T("combatBtnAuto"); }
				const skipBtn = document.getElementById("combat-btn-skip");
				if (skipBtn) skipBtn.textContent = LANG.current === "en" ? "⏭ Skip" : "⏭ 跳至结果";

				if (C.enemies[C.selectedEnemyIdx] && C.enemies[C.selectedEnemyIdx].hp <= 0) {
					let nextTarget = C.enemies.findIndex(e => e.hp > 0);
					if (nextTarget !== -1) C.selectedEnemyIdx = nextTarget;
				}
			}

			function combatSelectEnemy(idx) { if (C.enemies[idx].hp <= 0) return; C.selectedEnemyIdx = idx; renderCombatScreen(); }

			function combatLogAdd(text) {
				const container  = document.getElementById("combat-log-container");
				const scrollWrap = document.getElementById("combat-log-scroll");
				const line = document.createElement("div");
				line.className = "combat-log-line"; line.innerHTML = text;
				container.appendChild(line);
				scrollWrap.scrollTop = scrollWrap.scrollHeight;
			}

			function combatToggleAuto() {
				C.isAuto = !C.isAuto; renderCombatScreen();
				if (C.isAuto && !C.isExecutingTurn) executeFullRoundTick();
			}

			function combatManualAttack() { if (C.isAuto || C.isExecutingTurn) return; executeFullRoundTick(); }

			function combatHeal() {
				if (C.isAuto || C.isExecutingTurn) return;
				const med = G.inventory["medicine"];
				if (!med || med.qty <= 0) { showToast(T("errNoMedicine"), "red"); return; }
				med.qty--;
				if (med.qty <= 0) delete G.inventory["medicine"];
				renderGame();
				let target = C.allies.filter(a => a.hp > 0).sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
				if (target) { const oldHp = target.hp; target.hp = Math.min(target.maxHp, target.hp + 100); combatLogAdd(T("combatHeal", target.name, target.hp - oldHp)); renderCombatScreen(); }
			}

			function combatFlee() {
				if (C.isAuto || C.isExecutingTurn) return;
				C.isExecutingTurn = true; disableAllCombatButtons(true);
				combatLogAdd(T("combatFleeAttempt"));
				setTimeout(() => {
					if (Math.random() < 0.5) { combatLogAdd(T("combatFleeOk")); setTimeout(closeCombatCleanup, 1500); }
					else { combatLogAdd(T("combatFleeFail")); setTimeout(() => executeEnemySidePhase(), 1000); }
				}, 1000);
			}

			function combatSurrender() {
				if (C.isAuto || C.isExecutingTurn) return;
				if (C.combatTimer) clearInterval(C.combatTimer);
				G.gold = 100 + Math.floor(C.preCombatGold * 0.1);
				G.inventory = {};
				G.transports.forEach(t => { if (t.id !== "walk") t.owned = false; });
				G.city = G.prevCity;
				combatLogAdd(T("combatSurrender"));
				renderGame();
				setTimeout(() => { document.getElementById("combat-modal").classList.remove("open"); _showNextEvent(); }, 2000);
			}

			function combatSkipToResult() {
				// 停止所有计时器和自动战斗
				if (C.combatTimer) clearInterval(C.combatTimer);
				C.isAuto = false;
				C.isExecutingTurn = false;
				disableAllCombatButtons(true);
				// 模拟战斗：双方互打直到一方倒下
				let partyHp = C.party.hp, partyAtk = C.party.atk, partyDef = C.party.def;
				let maxRounds = 200;
				while (maxRounds-- > 0) {
					const liveEnemies = C.enemies.filter(e => e.hp > 0);
					if (liveEnemies.length === 0) break;
					// 玩家攻击随机敌人
					const target = liveEnemies[Math.floor(Math.random() * liveEnemies.length)];
					const eDef = target.aIdx > 0 ? (ARMORS[target.aIdx - 1]?.def || 0) : 0;
					const playerDmg = Math.max(1, Math.floor(partyAtk * 0.05) + Math.max(0, partyAtk - (target.def + eDef)));
					target.hp -= playerDmg;
					// 存活敌人攻击玩家
					liveEnemies.filter(e => e.hp > 0).forEach(e => {
						const eAtk = e.wIdx > 0 ? (WEAPONS[e.wIdx - 1]?.atk || 0) : 0;
						const dmg = Math.max(1, Math.floor((e.atk + eAtk) * 0.05) + Math.max(0, (e.atk + eAtk) - partyDef));
						partyHp -= dmg;
					});
					if (partyHp <= 0) break;
				}
				C.party.hp = Math.max(0, partyHp);
				// 同步敌人 hp
				renderCombatScreen();
				if (C.enemies.every(e => e.hp <= 0)) {
					combatLogAdd(LANG.current === "en" ? "⏭ <em>Skipped to result — Victory!</em>" : "⏭ <em>跳至结果 — 胜利！</em>");
					handleCombatVictory();
				} else {
					combatLogAdd(LANG.current === "en" ? "⏭ <em>Skipped to result — Defeated...</em>" : "⏭ <em>跳至结果 — 战败...</em>");
					handlePlayerDefeat();
				}
			}

			function disableAllCombatButtons(disabled) {
				document.querySelectorAll(".combat-btn").forEach(b => {
					b.disabled = (b.id === "combat-btn-auto") ? false : disabled;
				});
			}

			function executeFullRoundTick() {
				C.isExecutingTurn = true; disableAllCombatButtons(true);
				let target = C.enemies[C.selectedEnemyIdx];
				if (!target || target.hp <= 0) { let liveIdx = C.enemies.findIndex(e => e.hp > 0); if (liveIdx !== -1) { C.selectedEnemyIdx = liveIdx; target = C.enemies[liveIdx]; } }
				if (!target) {
					// 没有活着的敌人，安全解锁
					C.isExecutingTurn = false; disableAllCombatButtons(false); return;
				}
				if (target) {
					const eDef = target.aIdx > 0 ? (ARMORS[target.aIdx - 1]?.def || 0) : 0;
					const dmg  = Math.max(1, Math.floor(C.party.atk * 0.05) + Math.max(0, C.party.atk - (target.def + eDef)));
					target.hp -= dmg;
					combatLogAdd(T("combatPartyHit", target.name, dmg, Math.max(0, target.hp)));
					if (target.hp <= 0) combatLogAdd(target.type === "criminal" ? T("combatEnemyCapture", target.name) : T("combatEnemyDead", target.name));
					renderCombatScreen();
				}
				setTimeout(() => {
					if (C.enemies.every(e => e.hp <= 0)) { handleCombatVictory(); return; }
					setTimeout(executeEnemySidePhase, 800);
				}, 1000);
			}

			function executeEnemySidePhase() {
				let enemyQueue = C.enemies.filter(e => e.hp > 0), step = 0;
				function nextEnemyStrike() {
					if (step >= enemyQueue.length) {
						C.isExecutingTurn = false;
						if (C.isAuto) setTimeout(executeFullRoundTick, 1000);
						else disableAllCombatButtons(false);
						return;
					}
					let enemy = enemyQueue[step];
					if (enemy.hp > 0 && (enemy.hp / enemy.maxHp) < 0.3 && !enemy.hasAttemptedFlee) {
						enemy.hasAttemptedFlee = true;
						if (Math.random() < 0.5) { C.isAuto = false; renderCombatScreen(); triggerEnemyEscapeIntervention(enemy, step, enemyQueue); return; }
					}
					if (enemy.hp > 0) {
						if (C.party.hp <= 0) { handlePlayerDefeat(); return; }
						const eAtk = enemy.wIdx > 0 ? (WEAPONS[enemy.wIdx - 1]?.atk || 0) : 0;
						const dmg  = Math.max(1, Math.floor((enemy.atk + eAtk) * 0.05) + Math.max(0, (enemy.atk + eAtk) - C.party.def));
						C.party.hp -= dmg;
						combatLogAdd(T("combatEnemyHit", enemy.name, dmg, Math.max(0, C.party.hp)));
						if (C.party.hp <= 0) { handlePlayerDefeat(); return; }
						renderCombatScreen();
					}
					step++;
					setTimeout(nextEnemyStrike, 1000);
				}
				nextEnemyStrike();
			}

			function triggerEnemyEscapeIntervention(enemy, currentStep, queueArr) {
				C._escapeResumeArgs = { step: currentStep + 1, queue: queueArr };
				const freeSeats = getTransportFreeSeats();
				const recruitBtn = freeSeats > 0
					? `<button class="btn-primary" style="margin-top:0; flex:1; border-color:var(--green2); color:var(--green2);" onclick="resolveEnemyEscapeChoice('recruit', '${enemy.name}', ${currentStep})">${T("recruitBtn")}</button>`
					: `<button class="btn-primary" style="margin-top:0; flex:1; border-color:var(--border2); color:var(--text3); cursor:not-allowed;" title="${T('transportFullBtn')}" disabled>${T("transportFullBtn")}</button>`;
				const modal = document.createElement("div");
				modal.id = "escape-intervene-modal"; modal.className = "modal-overlay open"; modal.style.zIndex = "4000";
				modal.innerHTML = `<div class="modal-box" style="text-align:center; max-width:340px;">
					<div style="font-size:2rem; margin-bottom:0.5rem;">🏃‍♂️</div>
					<div class="modal-title">${T("enemyFleeTitle")}</div>
					<div style="font-size:0.85rem; margin-bottom:1.2rem;">${T("enemyFleeBody", enemy.name)}</div>
					<div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
						<button class="btn-primary" style="margin-top:0; flex:1;" onclick="resolveEnemyEscapeChoice('pursue', '${enemy.name}', ${currentStep})">${T("btnPursue")}</button>
						${recruitBtn}
						<button class="btn-primary" style="margin-top:0; flex:1; border-color:var(--text3);" onclick="resolveEnemyEscapeChoice('letgo', '${enemy.name}', ${currentStep})">${T("btnLetGo")}</button>
					</div>
				</div>`;
				document.body.appendChild(modal);
			}

				function resolveEnemyEscapeChoice(choice, enemyName, currentStep) {
				document.getElementById("escape-intervene-modal").remove();
				let enemy = C.enemies.find(e => e.name === enemyName);
				if (choice === 'pursue') {
					if (Math.random() < 0.5) combatLogAdd(T("combatPursueOk", enemy.name));
					else { combatLogAdd(T("combatPursueFail", enemy.name)); enemy.hp = 0; }
				} else if (choice === 'recruit') {
					// 把敌人转化为 NPC 加入队伍
					const wData = enemy.wIdx > 0 ? WEAPONS[enemy.wIdx - 1] : null;
					const aData = enemy.aIdx > 0 ? ARMORS[enemy.aIdx - 1] : null;
					const newMember = {
						name: enemy.name.replace(/#\d+$/, "").trim() || enemy.name,
						icon: "😤", role: T("enemyRoleSuffix", enemy.tier),
						atk: enemy.atk, def: enemy.def, hp: enemy.hp || 100, hpBase: enemy.hp || 100,
						talent: enemy.talent || 1, talentOn: enemy.talentOn || "atk",
						weapon: wData ? wData.id : null,
						armor: aData ? aData.id : null,
						wage: Math.max(1, Math.round((enemy.atk + enemy.def) / 10)),
						rescued: false,
					};
					G.team.push(newMember);
					enemy.hp = 0;
					combatLogAdd(T("combatRecruitLog", enemy.name));
					renderGame();
				} else {
					combatLogAdd(T("combatLetGo", enemy.name)); enemy.hp = 0;
				}
				renderCombatScreen();
				// 若所有敌人都已倒下或逃脱，直接结束战斗进入下一回合
				if (C.enemies.every(e => e.hp <= 0)) { handleCombatVictory(); return; }
				const args = C._escapeResumeArgs;
				let step = args.step, enemyQueue = args.queue;
				function nextEnemyStrikeResume() {
					if (step >= enemyQueue.length) { C.isExecutingTurn = false; disableAllCombatButtons(false); return; }
					let nextEnemy = enemyQueue[step];
					if (nextEnemy && nextEnemy.hp > 0) {
						if (C.party.hp <= 0) { handlePlayerDefeat(); return; }
						const eAtk = nextEnemy.wIdx > 0 ? (WEAPONS[nextEnemy.wIdx - 1]?.atk || 0) : 0;
						const dmg  = Math.max(1, Math.floor((nextEnemy.atk + eAtk) * 0.05) + Math.max(0, (nextEnemy.atk + eAtk) - C.party.def));
						C.party.hp -= dmg;
						combatLogAdd(T("combatEnemyHitResume", nextEnemy.name, dmg, Math.max(0, C.party.hp)));
						if (C.party.hp <= 0) { handlePlayerDefeat(); return; }
						renderCombatScreen();
					}
					step++;
					setTimeout(nextEnemyStrikeResume, 1000);
				}
				setTimeout(nextEnemyStrikeResume, 1000);
			}

			function handleCombatVictory() {
				combatLogAdd(T("combatVictory"));
				if (!G.equipWarehouse) G.equipWarehouse = [];
				const TIER_REP = { E: 1, D: 2, C: 3, B: 4, A: 5, S: 6 };
				C.enemies.forEach(e => {
					if (e.hp <= 0 && !e.name.includes("逃脱")) {
						// 声誉变化
						if (e.type === "criminal") {
							const delta = TIER_REP[e.tier] || 1;
							G.rep += delta;
							combatLogAdd(`<span style='color:var(--green2);font-size:0.75rem;'>⭐ ${T("repGainCriminal", e.tier, delta)}</span>`);
						} else if (e.type === "merchant") {
							G.rep -= 5;
							combatLogAdd(`<span style='color:var(--red2);font-size:0.75rem;'>⭐ ${T("repLossMerchant")}</span>`);
						} else if (e.type === "police") {
							G.rep -= 10;
							combatLogAdd(`<span style='color:var(--red2);font-size:0.75rem;'>⭐ ${T("repLossPolice")}</span>`);
						}
						// 战利品（按装备类型区分掉落概率：圣剑/防暴盔甲10%，斧头/防弹衣20%，其余30%）
						if (e.wIdx > 0) {
							const lootW = WEAPONS[e.wIdx - 1];
							const wDropRate = (lootW.id === "holy_sword" || (lootW.name||"").includes("圣剑")) ? 0.1
								: (lootW.id === "axe" || (lootW.name||"").includes("斧头") || (lootW.name||"").includes("斧")) ? 0.2
								: 0.3;
							if (Math.random() < wDropRate) { const lootWName = (LANG.current === "en" && lootW.nameEn) ? lootW.nameEn : lootW.name; combatLogAdd(T("combatLootW", lootWName)); G.equipWarehouse.push({ type: 'weapon', id: lootW.id, name: lootW.name, nameEn: lootW.nameEn, icon: lootW.icon, stat: lootW.atk, buyPrice: lootW.price }); }
						}
						if (e.aIdx > 0) {
							const lootA = ARMORS[e.aIdx - 1];
							const aDropRate = (lootA.id === "riot_armor" || (lootA.name||"").includes("防暴")) ? 0.1
								: (lootA.id === "bulletproof" || (lootA.name||"").includes("防弹衣")) ? 0.2
								: 0.3;
							if (Math.random() < aDropRate) { const lootAName = (LANG.current === "en" && lootA.nameEn) ? lootA.nameEn : lootA.name; combatLogAdd(T("combatLootA", lootAName)); G.equipWarehouse.push({ type: 'armor', id: lootA.id, name: lootA.name, nameEn: lootA.nameEn, icon: lootA.icon, stat: lootA.def, buyPrice: lootA.price }); }
						}
					}
				});
				renderGame();
				setTimeout(closeCombatCleanup, 3000);
			}

			function handlePlayerDefeat() {
				if (C.combatTimer) clearInterval(C.combatTimer);
				C.isAuto = false;
				G.gold = 100; G.inventory = {};
				G.transports.forEach(t => { if (t.id !== "walk") t.owned = false; });
				G.city = G.prevCity;
				// 战败：清空装备仓库，并脱下所有成员装备
				G.equipWarehouse = [];
				G.team.forEach(m => { m.weapon = null; m.armor = null; });
				G.team = G.team.filter(m => m.isPlayer);
				_eventQueue = [];
				if (_autoAdvanceTimer) { clearTimeout(_autoAdvanceTimer); _autoAdvanceTimer = null; }
				combatLogAdd(T("combatDefeat"));
				renderGame();
				setTimeout(() => {
					document.getElementById("combat-modal").classList.remove("open");
					const old = document.getElementById("road-event-modal");
					if (old) old.remove();
				}, 3500);
			}

			function closeCombatCleanup() {
				document.getElementById("combat-modal").classList.remove("open");
				document.getElementById("combat-log-container").innerHTML = "";
				_showNextEvent();
			}

			// ══════════════════════════════════
			// TABS
			// ══════════════════════════════════
			function switchTab(id) {
				document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
				document.querySelectorAll(".tab-content").forEach((t) => t.classList.remove("active"));
				document.getElementById("tab-" + (id === "buy" ? "buy" : id === "inventory" ? "inv" : id)).classList.add("active");
				document.getElementById("tab-content-" + id).classList.add("active");
			}

			// ══════════════════════════════════
			// SAVE / LOAD
			// ══════════════════════════════════
			function saveGame() {
				const blob = new Blob([JSON.stringify(G, null, 2)], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url; a.download = `merchant_save_day${G.day}.json`; a.click();
				showToast(T("toastSave"), "gold");
			}

			function loadSaveFile(e) {
				const file = e.target.files[0];
				if (!file) return;
				const reader = new FileReader();
				reader.onload = (ev) => {
					try {
						G = JSON.parse(ev.target.result);
						LANG.current = G.lang || "zh";
						applyLang(); renderGame(); showScreen("game");
						showToast(T("toastLoad", G.day), "gold");
					} catch { showToast(T("toastCorrupt"), "red"); }
				};
				reader.readAsText(file);
			}

			// ══════════════════════════════════
			// TOAST
			// ══════════════════════════════════
			let toastTimer;
			function showToast(msg, type = "") {
				const old = document.querySelector(".toast");
				if (old) old.remove();
				clearTimeout(toastTimer);
				const t = document.createElement("div");
				t.className = "toast " + type; t.textContent = msg;
				document.body.appendChild(t);
				toastTimer = setTimeout(() => t.remove(), 2800);
			}

			// ══════════════════════════════════
			// INIT
			// ══════════════════════════════════
			applyLang();
	