
			const GOODS = [
				{ id: "grain", name: "谷物", nameEn: "Grain", icon: "🌾", cat: "粮食", priceMin: 5, priceMax: 10 },
				{ id: "fuel", name: "汽油", nameEn: "Fuel", icon: "⛽", cat: "能源", priceMin: 30, priceMax: 50 },
				{ id: "textile", name: "纺织品", nameEn: "Textiles", icon: "🧵", cat: "纺织", priceMin: 50, priceMax: 100 },
				{ id: "medicine", name: "医用品", nameEn: "Medicine", icon: "💊", cat: "医疗", priceMin: 200, priceMax: 400 },
				{ id: "gems", name: "宝石", nameEn: "Gems", icon: "💎", cat: "奢侈", priceMin: 1000, priceMax: 2000 },
				{ id: "gold_bar", name: "黄金", nameEn: "Gold", icon: "🥇", cat: "贵金属", priceMin: 3000, priceMax: 5000 },
				{ id: "contraband", name: "违禁品", nameEn: "Illegal stuff", icon: "🔞", cat: "违禁", priceMin: 5, priceMax: 5000 },
			];

			const WEAPONS = [
				{ id: "branch", name: "树枝", nameEn: "Branch", icon: "🪵", atk: 3, price: 10 },
				{ id: "ironrod", name: "铁棍", nameEn: "Iron Rod", icon: "🔩", atk: 10, price: 50 },
				{ id: "knife", name: "小刀", nameEn: "Knife", icon: "🔪", atk: 25, price: 200 },
				{ id: "machete", name: "砍刀", nameEn: "Machete", icon: "⚔️", atk: 50, price: 500 },
				{ id: "axe", name: "斧头", nameEn: "Axe", icon: "🪓", atk: 70, price: 1500 },
				{ id: "holysword", name: "圣剑", nameEn: "Holy Sword", icon: "✨", atk: 100, price: 6000 },
			];

			const ARMORS = [
				{ id: "tshirt", name: "T恤", nameEn: "T-Shirt", icon: "👕", def: 3, price: 10 },
				{ id: "hoodie", name: "卫衣", nameEn: "Hoodie", icon: "🧥", def: 10, price: 50 },
				{ id: "jacket", name: "皮夹克", nameEn: "Leather Jacket", icon: "🥋", def: 25, price: 200 },
				{ id: "vest", name: "战术马甲", nameEn: "Tactical Vest", icon: "🦺", def: 50, price: 500 },
				{ id: "kevlar", name: "防弹衣", nameEn: "Kevlar Vest", icon: "🛡️", def: 70, price: 1500 },
				{ id: "riot", name: "防暴盔甲", nameEn: "Riot Armor", icon: "🦾", def: 100, price: 6000 },
			];

			const TRANSPORTS = [
				{ id: "walk", name: "步行", nameEn: "Walking", icon: "🚶", passengers: 0, cap: 10, spd: 1, fuelCost: 0, price: 0, owned: true },
				{ id: "bike", name: "自行车", nameEn: "Bicycle", icon: "🚲", passengers: 0, cap: 30, spd: 2, fuelCost: 0, price: 200, owned: false },
				{ id: "moto", name: "摩托车", nameEn: "Motorbike", icon: "🏍️", passengers: 1, cap: 30, spd: 3, fuelCost: 1, price: 600, owned: false },
				{ id: "trike", name: "三轮车", nameEn: "Tricycle", icon: "🛺", passengers: 1, cap: 100, spd: 2, fuelCost: 0, price: 400, owned: false },
				{ id: "car", name: "小轿车", nameEn: "Car", icon: "🚗", passengers: 3, cap: 250, spd: 5, fuelCost: 3, price: 2000, owned: false },
				{ id: "van", name: "小货车", nameEn: "Van", icon: "🚐", passengers: 2, cap: 500, spd: 4, fuelCost: 5, price: 1500, owned: false },
				{ id: "truck", name: "大货车", nameEn: "Truck", icon: "🚚", passengers: 2, cap: 1000, spd: 4, fuelCost: 15, price: 3000, owned: false },
				{ id: "bus", name: "大巴车", nameEn: "Bus", icon: "🚌", passengers: 10, cap: 500, spd: 4, fuelCost: 10, price: 10000, owned: false },
			];
