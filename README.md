# 城市地图
可选国家，使用恶搞真实城市名，人名名单

每个城市参数：
- 人口规模：交易商品数量和资金上限
- 犯罪率
- 距离（1-20）
- 

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

| 商品   | 成本区间  | 利润率 |
|--------|-----------|--------|
| 汽油   | 30-50     | 30%    |
| 医用品 | 200-400   | 50%    |
| 违禁品 | 5-2000    | 400%   |
| 纺织品 | 50-100    | 70%    |
| 宝石   | 1000-2000 | 80%    |
| 谷物   | 5-10      | 20%    |
| 黄金   | 3000-5000 | 100%   |

# 路上事件

- 被盗窃
- 拾捡
- 失去意识的人（抢劫/救助/无视）
- 执法检查（对抗/贿赂/认罚）
- 是否打劫普通商人
- 被打劫（投降损失50%金钱和货物，攻击，逃跑）

# 人物面板
- 工资：（攻击+防御）x天赋值
- 攻击和防御0-100随机
- 天赋值（1-10）乘以攻击或者防御，随机分配
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




# 词条


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
| 中国   | 德国          |
|--------|---------------|
| 董庆   | Altendorf     |
| 土海   | Freibach      |
| 白京   | Bergstadt     |
| 咸都   | Bernberg      |
| 厂州   | Ebersburg     |
| 探圳   | Falkenstein   |
| 文汉   | Frankensee    |
| 天律   | Freudental    |
| 东安   | Friedheim     |
| 邓州   | Geisenfeld    |
| 办州   | Glückingen    |
| 航州   | Großwald      |
| 红岛   | Grünau        |
| 右家庄 | Hagenhausen   |
| 长汐   | Herzhafen     |
| 台巴   | Heilenkirchen |
| 昆朋   | Kirchmar      |
| 南晶   | Laufzig       |
| 高阳   | Lichtenfurt   |
| 金川   | Lessen        |

# 人名

| 姓 | 名 | Nach       | Vor       |
|----|----|------------|-----------|
| 王 | 泽 | Müller     | Sabine    |
| 李 | 宇 | Schmidt    | Michael   |
| 张 | 涵 | Fischer    | Susanne   |
| 刘 | 晨 | Meyer      | Thomas    |
| 陈 | 艺 | Weber      | Petra     |
| 杨 | 嘉 | Schulz     | Andreas   |
| 黄 | 雨 | Wagner     | Monika    |
| 赵 | 欣 | Becker     | Peter     |
| 吴 | 佳 | Hoffmann   | Claudia   |
| 周 | 浩 | Schäfer    | Stefan    |
| 徐 | 轩 | Bauer      | Stefanie  |
| 孙 | 语 | Koch       | Christian |
| 马 | 诺 | Schröder   | Andrea    |
| 朱 | 思 | Klein      | Hans      |
| 胡 | 博 | Richter    | Birgit    |
| 郭 | 文 | Wolf       | Jan       |
| 何 | 熙 | Neumann    | Wolfgang  |
| 林 | 俊 | Schwarz    | Klaus     |
| 罗 | 然 | Krüger     | Karin     |
| 高 | 彤 | Zimmermann | Julia     |
