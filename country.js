
						const COUNTRIES = [
				{ id: "china",   name: "中国",   nameEn: "China",         nameJa: "中国",           nameKo: "중국",         nameRu: "Китай",             nameEs: "China",         namePt: "China" },
				{ id: "germany", name: "德国",   nameEn: "Germany",       nameJa: "ドイツ",         nameKo: "독일",         nameRu: "Германия",          nameEs: "Alemania",      namePt: "Alemanha" },
				{ id: "usa",     name: "美国",   nameEn: "USA",           nameJa: "アメリカ",       nameKo: "미국",         nameRu: "США",               nameEs: "EE.UU.",        namePt: "EUA" },
				{ id: "japan",   name: "日本",   nameEn: "Japan",         nameJa: "日本",           nameKo: "일본",         nameRu: "Япония",            nameEs: "Japón",         namePt: "Japão" },
				{ id: "korea",   name: "韩国",   nameEn: "Korea",         nameJa: "韓国",           nameKo: "한국",         nameRu: "Корея",             nameEs: "Corea",         namePt: "Coreia" },
				{ id: "russia",  name: "俄罗斯", nameEn: "Russia",        nameJa: "ロシア",         nameKo: "러시아",       nameRu: "Россия",            nameEs: "Rusia",         namePt: "Rússia" },
				{ id: "lm",      name: "拉美",   nameEn: "Latin America", nameJa: "ラテンアメリカ", nameKo: "라틴아메리카", nameRu: "Латинская Америка", nameEs: "Latinoamérica", namePt: "América Latina" },
			];

			const CITIES = {
				china: ["董庆", "土海", "白京", "咸都", "厂州", "探圳", "文汉", "天律", "东安", "邓州", "办州", "航州", "红岛", "右家庄", "长汐", "台巴", "昆朋", "南晶", "高阳", "金川", "李家口", "恒水", "大原", "太同", "小连", "安山", "长夏", "吉森", "鸡岗", "汤州", "真江", "无溪", "常生", "招兴", "丁波", "文乌", "无湖", "珠港", "秋门", "蜜庄", "井封", "各阳", "商兵", "黑冈", "青壁", "山头", "东馆", "二亚", "海田", "理江", "梅朵林", "贡嘎错", "克孜苏"],
				germany: ["Freibach", "Bergstadt", "Frankensee", "Glückingen", "Großwald", "Herzhafen", "Heilenkirchen", "Kirchmar", "Laufzig", "Lichtenfurt", "Schweinsfeld", "Eisburg", "Saumagen", "Bengelsrode", "Dirneln","Görental","Pfostenau","Hopfenhausen", "Drölfen", "Wurstdorf", "Altenheim", "Pilsberg", "Bolzenstein", "Bad Rostlaub", "Mettstätt", "Scheinheiligen", "Bürokratnitz", "Gurkenhain", "Schwalbenhorst","Knochenmark","Wampenbrück","Lotterleben","Hüttenholz", "Rüffelberge","Schelmenhof", "Bierig", "Frechlingen", "Überbrücken", "Nudelbuden", "Hundehütte"],
                usa: ["Derbyson", "Middlewood", "Oakford", "Forestland", "Rockester", "Laketown", "Bowlington", "Poormond", "Mochevue", "Polymouth", "New City", "Califlora", "Fallfield", "St. Taylor", "Dryington", "Redville", "Loud Hills", "Las Vacas", "San Donaldo", "Philosophia"],
				japan: ["霜松市", "残月市", "寒木町", "蛍見沢", "結守町", "蝉時雨村", "第四新江户市", "百鬼夜町", "春芽市", "暮潮市", "鸣神市", "霜夜ノ里", "八重垣市", "隠菊町", "白夜街", "学園都市", "唐红市", "有明ノ丘", "浅間ヶ原", "天原市", "涙川市", "浮世谷", "雲居ノ坂"],
                korea: ["봉산시", "단암시", "문청시", "경안시", "전명시", "강문시", "통양시", "진양시", "화안시", "안남시", "경명시", "화원시", "신천시", "성원시", "청산시", "한천시", "임진시", "무진시", "음월시", "연신시", "명해시", "성야시", "세명시"],
			    russia: ["Путинград", "Криоград", "Стальгород", "Атомград", "Кварцегорск", "Глухолесье", "Космоград", "Вечнозимск", "Туманск", "Люмино́вск", "Медноре́ченск", "Метеоритск", "Рудого́рск", "Ветроду́йск", "Волков", "Глухо́неж", "Владигор", "Гагариславль", "Угольнецк", "Ясенецк", "Студено́в", "Святодо́л", "Огнесла́вль"],
			    lm: ["Paulistania", "Santiagito", "Guadalmar", "Baía das Almas","Platabamba",
                    "Villa de la Eterna","Riodouro","Rosarión",  "Pluvialia","Porto Quase",
                    "Panamagua", "Oro Blanco","Puerto Eldorado", "Velho Progresso","Techichi",
                    "Rio Titán","Jaguaratenango","Volcanango","Haalala","Mazatoto"],
                
            };

			// ── NPC 生成 ──
			// ── 名字生成 ──

			// 中国：姓 + 名
			const NPC_SURNAMES_ZH = ["王","李","张","刘","陈","杨","黄","赵","吴","周","徐","孙","马","朱","胡","郭","何","林","罗","高"];
			const NPC_GIVEN_ZH    = ["泽","宇","晨","艺","嘉","雨","欣","佳","浩","轩","豆","迷糊","博","文","司机","俊","然","伞","芳","明","伟","静","磊","燕","洋","涛","霞","勇","娜","峰","梅","超","丽","辉","欣","杰"];

			// 德国：Vorname + Nachname
			const NPC_FIRST_DE = ["Sabine","Michael","Susanne","Thomas","Petra","Andreas","Monika","Peter","Claudia","Stefan","Stefanie","Christian","Andrea","Hans","Birgit","Jan","Wolfgang","Klaus","Karin","Julia"];
			const NPC_LAST_DE  = ["Müller","Schmidt","Fischer","Meyer","Weber","Schulz","Wagner","Becker","Hoffmann","Schäfer","Bauer","Koch","Schröder","Klein","Richter","Wolf","Neumann","Schwarz","Krüger","Zimmermann"];

			// 美国：first + last
			const NPC_FIRST_US = ["Michael","John","James","David","Robert","William","Mary","Maria","Daniel","Joseph","Richard","Thomas","Christopher","Jennifer","Matthew","Jose","Charles","Elizabeth","Patricia","Linda"];
			const NPC_LAST_US  = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Moore","Jackson","Martin","Lee"];

			// 日本：first + last
			const NPC_FIRST_JP = ["蓮","蒼","陽翔","樹","湊","大翔","悠真","律","朝陽","伊織","ひなた","紬","りん","芽依","結月","結菜","葵","りこ","澪","陽菜"];
			const NPC_LAST_JP  = ["佐藤","鈴木","高橋","田中","渡辺","伊藤","山本","中村","小林","斋藤","加藤","吉田","山田","佐々木","山口","松本","井上","木村","林","清水"];

			const NPC_FIRST_KR = ["이준","서준","하준","도윤","은우","시우","지호","예준","유준","수호","서아","하윤","이서","지안","지아","서윤","아린","아윤","하린","하은"];
			const NPC_LAST_KR  = ["김","이","박","최","정","강","조","윤","장","임","한","오","서","신","권","황","안","전","송","홍"];

            const NPC_FIRST_RU = ["Максим", "Михаил", "Александр", "Дмитрий", "Денис", "Илья", "Андрей", "Даниил", "Артём", "Иван", "Анна", "Мария", "Юлия", "Алёна", "Анастасия", "Екатерина", "Дарья", "Ксения", "Кристина", "Алиса"];
            const NPC_LAST_RU = ["Смирнов", "Иванов", "Кузнецов", "Соколов", "Попов", "Лебедев", "Козлов", "Новиков", "Морозов", "Петров", "Волков", "Соловьёв", "Васильев", "Зайцев", "Павлов", "Семёнов", "Голубев", "Виноградов", "Богданов", "Воробьёв"];

            const NPC_FIRST_LM = ["Isabella", "Emma", "Valentina", "Sofía", "Antonella", "Mia", "Amelia", "Olivia", "Emilia", "Camila", "Aitana", "Luciana", "Aurora", "Zoe", "Liam", "Mateo", "Noah", "Santiago", "Thiago", "Benjamín", "Gael", "Lucas", "Samuel", "Enzo"];
            const NPC_LAST_LM = ["Fernández", "Pérez", "Álvarez", "Gómez", "Sánchez", "Silva", "Santos", "Oliveira", "Sousa", "Ferreira", "Muñoz", "Rojas", "Díaz", "Persaud", "Benítez", "Quispe", "Flores"];

        

			function generateNpcName(country) {
				if (country === "germany") {
					return NPC_FIRST_DE[Math.floor(Math.random()*NPC_FIRST_DE.length)] + " " + NPC_LAST_DE[Math.floor(Math.random()*NPC_LAST_DE.length)];
				}
				if (country === "usa") {
					return NPC_FIRST_US[Math.floor(Math.random()*NPC_FIRST_US.length)] + " " + NPC_LAST_US[Math.floor(Math.random()*NPC_LAST_US.length)];
				}
				if (country === "japan") {
					return NPC_LAST_JP[Math.floor(Math.random()*NPC_LAST_JP.length)] + NPC_FIRST_JP[Math.floor(Math.random()*NPC_FIRST_JP.length)];
				}
				if (country === "korea") {
					return NPC_LAST_KR[Math.floor(Math.random()*NPC_LAST_KR.length)] + " " + NPC_FIRST_KR[Math.floor(Math.random()*NPC_FIRST_KR.length)];
				}
				if (country === "russia") {
					return NPC_FIRST_RU[Math.floor(Math.random()*NPC_FIRST_RU.length)] + " " + NPC_LAST_RU[Math.floor(Math.random()*NPC_LAST_RU.length)];
				}
				if (country === "lm") {
					return NPC_FIRST_LM[Math.floor(Math.random()*NPC_FIRST_LM.length)] + " " + NPC_LAST_LM[Math.floor(Math.random()*NPC_LAST_LM.length)];
				}
				// 默认中文（china 或其他）
				return NPC_SURNAMES_ZH[Math.floor(Math.random()*NPC_SURNAMES_ZH.length)] + NPC_GIVEN_ZH[Math.floor(Math.random()*NPC_GIVEN_ZH.length)];
			}

			