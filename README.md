

# 战斗

1. 战斗采用回合制。攻击方为先手。
2. 到玩家回合的时候，玩家可以选择自动攻击（一直默认攻击，中途又到玩家回合的时候可以取消），攻击，投降，治疗和逃跑。逃跑成功率50%。投降会剩下100金+战斗前资金的10%回到上一座城市，失去所有货物和载具。治疗需要身上有医疗用品。
3. 页面显示文字进展，1秒1条，比如 玩家名字 对 犯罪分子 造成了XX点的伤害。犯罪分子 剩余HP为XX点。
4. 对手hp低于30%会开始逃走，也是50%的成功几率。玩家可以选择追杀或者放过。
5. 犯罪分子HP为零的时候被抓捕归案。执法者和普通商人HP为零则是死亡。玩家HP为零的时候则是失去所有货物和载具，剩下100金回到之前的城市。
6. 路上会遇到3种队伍。普通商人，执法者和犯罪分子。人数1-3人，每个人的攻击防御数值也是0-100随机。装备从0-6嘛。0是没有，1是树枝，2是铁棍等等，6是圣剑，防具以此类推。取武器和防具的平均值。E级0-1，D级1-2，C级2-3，B级3-4，A级4-5，S级：5-6。也就是说，显示遇到信息的时候就是举个例子：
前方设有执法检查站，3名执法者（E级，D级，C级）示意你停下接受盘查。
路上遇到2名商人（A级，S级），他向你友好地点头示意。
2名歹徒（B级，S级）拦住了去路，眼神凶狠地盯着你的货物。
7. 敌人被打败，他们每个人的武器和防具各自有30%的几率会掉落，直接收进玩家的仓库。文字会提示玩家获得了什么。

 交通方式

| 交通工具 | 额外载人 | 载货 | 价格 | 出行成本 | 速度 |
|----------|----------|------|------|----------|------|
| 步行     | 0        | 10   | 0    | 0        | 1    |
| 自行车   | 0        | 30   | 200  | 0        | 2    |
| 摩托车   | 1        | 30   | 600  | 1        | 3    |
| 三轮车   | 1        | 100  | 400  | 0        | 2    |
| 小轿车   | 3        | 250  | 2000 | 3        | 5    |
| 小货车   | 2        | 500  | 1500 | 5        | 4    |
| 大货车   | 2        | 1000 | 3000 | 15       | 4    |

商品

| 商品   | 价格区间  |
|--------|-----------|
| 汽油   | 30-50     |
| 医用品 | 200-400   |
| 违禁品 | 5-5000    |
| 纺织品 | 50-100    |
| 宝石   | 1000-2000 |
| 谷物   | 5-10      |
| 黄金   | 3000-5000 |

# 路上事件

- 捡到遗失物
- 被盗窃（丢失1-20%的金钱）
- 失去意识的人（抢劫/救助/无视）
- 执法检查（接受检查/对抗/贿赂）有无违禁品。无违禁品不能贿赂。
- 遇到普通商人（打劫/友好地打招呼）
- 遇到犯罪分子（投降损失50%金钱和货物/迎战/逃跑成功几率50%）
- 无事发生

# 人物面板
- 工资：（攻击+防御+HP）x天赋值/10
- 攻击和防御0-100随机，HP200-400随机
- 天赋值（1-10）乘以攻击或防御或HP
连抽三次 0-1 之间的随机数并相乘
只有当三次都抽到接近 1 的数，乘积才会接近 1，这个概率是极其恐怖的低
'''
factor = random.random() * random.random() * random.random()
映射到 1.0 - 10.0
talent = 10.0 - (9.0 * factor)
talent = round(talent, 1)
'''
- 

Max(攻击 * 5%, 攻击 - 防御)


# 装备

| 武器 | 攻击 | 买价 |
|------|------|------|
| 树枝 | 3    | 10   |
| 铁棍 | 10   | 50   |
| 小刀 | 25   | 200  |
| 砍刀 | 50   | 500  |
| 斧头 | 70   | 1500 |
| 圣剑 | 100  | 6000  |

| 防具     | 防御 | 买价 |
|----------|------|------|
| T恤      | 3    | 10   |
| 卫衣     | 10   | 50   |
| 皮夹克   | 25   | 200  |
| 战术马甲 | 50   | 500  |
| 防弹衣   | 70   | 1500 |
| 防暴盔甲 | 100  | 6000 |

# 存档
用 JSON + Base64 编码

# 初始界面
中文标题：游商模拟器
英文标题：Merchant

选项：开始新游戏/继续游戏（上传存档文件）/语言设置 

选择开始新游戏后
input：
角色名
选择国家

城内界面：
tab：买/库存/武器/防具/交通工具/团队/任务

买：
表格表头：商品/价格/数量/已拥有/购买数量输入（快捷max和none）/计价
表格下方：总价，购买按钮

库存：
商品/价格/已拥有/售出数量输入（快捷max和none）/计价
表格下方：总价，售出按钮

武器/防具：
团队人员装备栏
商店购买
库存（拖动穿戴，卖出，同项堆叠）

团队：
每个人数值，装备，工资

# 城市
| 中国   | 德国          | 美国        |
|--------|---------------|-------------|
| 董庆   | Altendorf     | Derbyson    |
| 土海   | Freibach      | Middlewood  |
| 白京   | Bergstadt     | Oakford     |
| 咸都   | Bernberg      | Forestland  |
| 厂州   | Ebersburg     | Rockester   |
| 探圳   | Falkenstein   | Laketown    |
| 文汉   | Frankensee    | Bowlington  |
| 天律   | Freudental    | Poormond    |
| 东安   | Friedheim     | Mochevue    |
| 邓州   | Geisenfeld    | Polymouth   |
| 办州   | Glückingen    | New City    |
| 航州   | Großwald      | Califlora   |
| 红岛   | Grünau        | Fallfield   |
| 右家庄 | Hagenhausen   | St. Taylor  |
| 长汐   | Herzhafen     | Dryington   |
| 台巴   | Heilenkirchen | Redville    |
| 昆朋   | Kirchmar      | Loud Hills  |
| 南晶   | Laufzig       | Las Vacas   |
| 高阳   | Lichtenfurt   | San Donaldo |
| 金川   | Lessen        | Philosophia |

# 人名

| 姓 | 名 | Nach       | Vor       | last      | first       |
|----|----|------------|-----------|-----------|-------------|
| 王 | 泽 | Müller     | Sabine    | Smith     | Michael     |
| 李 | 宇 | Schmidt    | Michael   | Johnson   | John        |
| 张 | 涵 | Fischer    | Susanne   | Williams  | James       |
| 刘 | 晨 | Meyer      | Thomas    | Brown     | David       |
| 陈 | 艺 | Weber      | Petra     | Jones     | Robert      |
| 杨 | 嘉 | Schulz     | Andreas   | Garcia    | William     |
| 黄 | 雨 | Wagner     | Monika    | Miller    | Mary        |
| 赵 | 欣 | Becker     | Peter     | Davis     | Maria       |
| 吴 | 佳 | Hoffmann   | Claudia   | Rodriguez | Daniel      |
| 周 | 浩 | Schäfer    | Stefan    | Martinez  | Joseph      |
| 徐 | 轩 | Bauer      | Stefanie  | Hernandez | Richard     |
| 孙 | 语 | Koch       | Christian | Lopez     | Thomas      |
| 马 | 诺 | Schröder   | Andrea    | Gonzalez  | Christopher |
| 朱 | 思 | Klein      | Hans      | Wilson    | Jennifer    |
| 胡 | 博 | Richter    | Birgit    | Anderson  | Matthew     |
| 郭 | 文 | Wolf       | Jan       | Thomas    | Jose        |
| 何 | 熙 | Neumann    | Wolfgang  | Moore     | Charles     |
| 林 | 俊 | Schwarz    | Klaus     | Jackson   | Elizabeth   |
| 罗 | 然 | Krüger     | Karin     | Martin    | Patricia    |
| 高 | 彤 | Zimmermann | Julia     | Lee       | Linda       |
