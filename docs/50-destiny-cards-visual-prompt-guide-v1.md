# 50 张命运卡视觉 Prompt 指南 V1

## 1. 文档定位

本文件定义 50 张命运卡的视觉生产规范与 AI 插画 Prompt 指南。

本文件服务于：

- AI 插画生成
- 卡牌视觉统一
- 实体卡牌设计
- 数字卡牌展示页
- 品牌视觉规范

本文件不负责卡牌分值与算法字段。卡牌数据以 [docs/50-destiny-cards-data-table-v1.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/50-destiny-cards-data-table-v1.md) 为准。

## 2. 视觉总方向

统一风格：

`Cosmic Eastern Mysticism`

中文可定义为：

`东方宇宙命理风`

核心要求：

- 不做传统塔罗复刻
- 不做廉价网红玄学风
- 不做纯西式中世纪奇幻风
- 要有原创命运体系辨识度

## 3. 核心视觉元素

统一元素建议：

- 星图
- 神话人物原型
- 宫殿 / 王座 / 门 / 阵法
- 光轨 / 能量环 / 星尘
- 金属符文
- 东方脸谱与宇宙几何结合

整体气质：

- 神秘
- 高级
- 有秩序
- 不俗艳
- 不廉价
- 不卡通化

## 4. 通用 Prompt 基底

### 4.1 主基底 Prompt

```text
mystical cosmic tarot card, eastern mythology style, golden lines, deep blue space background, sacred geometry, ultra detailed, cinematic lighting
```

### 4.2 建议补充参数

可按模型补充：

- `ornate frame`
- `celestial symbols`
- `high contrast lighting`
- `symmetrical composition`
- `cosmic dust particles`
- `imperial mystical costume`

### 4.3 负面约束建议

若模型支持 negative prompt，可建议避免：

- cartoon
- anime face
- low detail
- blurry
- modern city casual style
- cheap fantasy card art
- western medieval church aesthetic

## 5. 卡面统一结构

每张卡建议固定 6 个视觉层：

1. 顶部：卡名
2. 中央：主视觉角色或场景
3. 背后：星图 / 符号阵
4. 底部：关键词
5. 左下：数值或属性标识
6. 右下：正向 / 阴影图标

说明：

- 即使由 AI 出图，后续排版时也应遵守这套结构。
- 画面主体不要被文字区挤压，因此建议留白边界明确。

## 6. 卡背设计规范

卡背是整套系统的统一识别核心。

建议元素：

- 中心：五维命运轮
- 外圈：五个维度符号
- 次外圈：十二宫环
- 四角：四大主题符号

五维符号：

- Structure
- Timing
- Energy
- Mind
- Action

四大主题：

- 事业
- 财富
- 感情
- 健康

建议卡背标语：

- `命运非定数，而是结构、时运、能量、心念与行动的交汇`
- 或简版：`Destiny is Dynamic`

## 7. 三类卡牌的视觉规则

### 7.1 主星原型卡

主星卡是“宇宙角色牌”。

规则：

- 角色为主体
- 要有原型神格感
- 背景必须出现王座、星门、阵法、圣器、宇宙结构之一
- 色调偏深，带金属光
- 姿态要稳定、强中心性

### 7.2 能量状态卡

能量卡是“状态场景牌”。

规则：

- 不一定需要人物主体
- 更适合抽象场景、光束、几何结构、情绪空间
- 强调气氛与动势
- 画面核心是状态，不是角色身份

### 7.3 事件触发卡

事件卡是“现实触发牌”。

规则：

- 强调事件感与现实世界对应物
- 可以有人物，但重点是事件发生本身
- 应有明显叙事动作，如开启、损失、合作、离开、重启

## 8. 14 张主星卡 Prompt

### A01 紫微帝星

- 关键词：统御 / 中心 / 权威
- Prompt：

```text
cosmic emperor sitting on a throne made of galaxies, golden crown of stars, deep space background, sacred geometry halo, eastern imperial armor, mystical cosmic tarot card, ultra detailed, cinematic lighting
```

### A02 天府宝库

- 关键词：财富 / 积累 / 安定
- Prompt：

```text
guardian of a celestial treasury, floating golden cubes and treasure chests in space, cosmic vault doors behind, eastern fantasy style, mystical tarot card illustration
```

### A03 天相秩序

- 关键词：规则 / 平衡 / 合作
- Prompt：

```text
cosmic judge holding a balance scale of stars, standing in a celestial court hall, silver blue cosmic light, sacred geometry background
```

### A04 武曲执行

- 关键词：行动 / 商业 / 决策
- Prompt：

```text
armored cosmic warrior with golden sword, standing on glowing strategic grid, dark blue universe background, futuristic eastern armor
```

### A05 太阳光耀

- 关键词：成功 / 名气 / 光芒
- Prompt：

```text
radiant hero standing before a giant cosmic sun, golden light rays spreading across the galaxy, celestial aura, epic lighting
```

### A06 太阴月华

- 关键词：情感 / 资源 / 内在
- Prompt：

```text
moon priestess holding a silver mirror, standing under a giant glowing moon, cosmic water reflections, mystical atmosphere
```

### A07 天机智谋

- 关键词：策略 / 思考 / 变化
- Prompt：

```text
cosmic strategist manipulating floating star gears, celestial machine of destiny behind, blue silver lighting, sacred mechanism
```

### A08 天梁守护

- 关键词：贵人 / 守护 / 指导
- Prompt：

```text
celestial guardian with luminous wings, protective shield of light surrounding him, ancient cosmic bridge background
```

### A09 天同福乐

- 关键词：快乐 / 轻松 / 人缘
- Prompt：

```text
joyful celestial figure sitting in floating sky garden, flowers and stars around, soft pastel cosmic colors
```

### A10 廉贞权欲

- 关键词：权力 / 欲望 / 控制
- Prompt：

```text
mysterious ruler holding a burning red scepter, half face in shadow half in light, cosmic palace background
```

### A11 贪狼魅力

- 关键词：魅力 / 欲望 / 社交
- Prompt：

```text
charismatic cosmic figure wearing star mask, surrounded by neon flowers and glowing wine, dark galaxy nightlife aesthetic
```

### A12 巨门争议

- 关键词：语言 / 辩论 / 真相
- Prompt：

```text
giant cosmic gate opening with floating words and symbols, speaker standing before the gate, mystical blue light
```

### A13 破军革命

- 关键词：破局 / 重启 / 变革
- Prompt：

```text
warrior breaking a shattered planet, cosmic explosion of light and fragments, epic action pose
```

### A14 七杀锋刃

- 关键词：决断 / 战斗 / 风险
- Prompt：

```text
lone cosmic swordsman standing in frozen galaxy, blade glowing with blue light, dramatic dark space background
```

## 9. 22 张能量卡 Prompt 规则

能量卡优先做“状态场景”，减少固定人物重复。

### 正向能量示例

#### E01 觉醒

```text
third eye opening with cosmic light beam, galaxy expanding behind the head, mystical awakening scene
```

#### E02 机会

```text
golden doorway opening in space, bright light beyond the gate, cosmic opportunity portal
```

#### E03 希望

```text
distant star rising above cosmic horizon, soft light spreading across galaxy
```

#### E04 连接

```text
two beams of light linking across space, forming sacred geometry bridge
```

#### E05 灵感

```text
spark of cosmic energy exploding from mind, geometric light patterns, luminous idea forming in dark space
```

#### E06 成长

```text
tree growing roots through stars and planets, cosmic life expansion, luminous growth pattern
```

#### E07 稳定

```text
floating stone balanced perfectly in space, calm cosmic atmosphere, symmetrical sacred geometry
```

#### E08 学习

```text
ancient glowing book floating in galaxy, golden runes emerging, celestial knowledge field
```

#### E09 恢复

```text
cracked sphere slowly repairing with light, healing cosmic energy, gentle blue-gold particles
```

### 阻滞能量示例

#### E14 冲突

```text
two cosmic energy waves colliding violently, red lightning explosion, unstable sacred geometry
```

#### E17 迷失

```text
person walking in endless cosmic labyrinth, stars fading into darkness, isolated dreamlike path
```

说明：

- 其余能量卡建议沿用同样模式生成。
- 正向卡以“打开、连接、修复、扩张”为视觉动词。
- 阻滞卡以“断裂、碰撞、模糊、封闭”为视觉动词。

## 10. 14 张事件卡 Prompt 规则

事件卡更强调现实触发动作。

### 示例

#### V01 贵人

```text
luminous mentor figure reaching out a hand in cosmic space, golden supportive aura, celestial assistance scene
```

#### V02 机会窗口

```text
wide portal opening between stars, bright path appearing ahead, cosmic opportunity window
```

#### V03 资源

```text
floating containers of light, cosmic treasury streams converging, material support in space
```

#### V04 团队

```text
multiple celestial figures forming a circle around a glowing core, coordinated cosmic teamwork scene
```

#### V05 合作

```text
two cosmic figures joining hands over sacred geometry, partnership energy field, harmonious collaboration
```

#### V06 订单

```text
golden contract made of light appearing in space, streams of value converging, achievement and transaction symbolism
```

#### V07 曝光

```text
celestial stage flooded with light, one figure becoming visible across the galaxy, rising public attention
```

#### V08 挑战

```text
massive mountain-like obstacle floating in space, traveler confronting it, pressure and resistance theme
```

#### V09 竞争

```text
two rival energy forces racing toward the same glowing target, tension and pressure in cosmic space
```

#### V10 损失

```text
shattered golden object drifting into darkness, resources dispersing across the void, loss event symbolism
```

#### V11 冲突

```text
two figures turning away amid fractured light, red-blue collision field, relationship conflict scene
```

#### V12 变动

```text
cosmic environment shifting, structures rotating and breaking into a new formation, major environmental change
```

#### V13 离开

```text
single figure walking away through a fading star gate, separation and ending scene, dim cosmic light
```

#### V14 重启

```text
new cosmic engine reigniting with brilliant light, system reboot scene, fresh start symbolism
```

## 11. 逐类生成建议

### 11.1 先生成原型卡

顺序建议：

1. 14 张主星卡
2. 22 张能量卡
3. 14 张事件卡

原因：

- 主星卡最决定整套牌的视觉语言
- 能量卡和事件卡可以在其基础上延展

### 11.2 每类先跑 3 张测试卡

先测试：

- 紫微帝星
- 觉醒
- 贵人

确认风格稳定后，再批量生成。

### 11.3 保留统一参数

每次生成都应保留：

- 同一长宽比
- 同一边框风格
- 同一配色系统
- 同一材质感

## 12. 与其他文档的关系

本文件应和以下文档配套使用：

- [docs/destiny-card-system-v1.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/destiny-card-system-v1.md)
- [docs/50-destiny-cards-data-table-v1.md](/Users/rms/Desktop/Ai Project/Ai5Ddestiny/docs/50-destiny-cards-data-table-v1.md)

关系分工：

- `destiny-card-system-v1.md`：定义体系与算法位置
- `50-destiny-cards-data-table-v1.md`：定义逐张卡的数据结构
- `50-destiny-cards-visual-prompt-guide-v1.md`：定义视觉生产方式

## 13. 当前版本结论

这份视觉 Prompt 指南的价值，不在于“帮 AI 出图”，而在于让 50 张命运卡形成统一的原创视觉语言。

如果没有这份文档，卡牌很容易变成 50 张风格各异的散图。

