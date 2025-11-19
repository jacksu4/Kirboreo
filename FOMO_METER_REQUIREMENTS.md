# 😱 FOMO Meter 需求文档

## 核心概念
一个极简的情绪仪表盘，分析股票/加密货币的最新新闻，用**可视化温度计 + 动画 + 表情符号**展示市场情绪，作为**反向指标**提醒用户冷静。

---

## 🎯 MVP 功能（今晚实现）

### 1. 搜索输入框
- 大号居中搜索框
- 支持股票代码：`TSLA`, `AAPL`, `NVDA` 等
- 自动转大写，去掉 `$` 符号
- 占位符：`"输入股票代码... (例如 TSLA, NVDA)"`

### 2. 新闻抓取 + AI 分析
**数据源（选一个最快的）：**
- ✅ **Yahoo Finance RSS** (免费，无需 API key)
- ⚠️ NewsAPI.org (需要注册，免费 100 次/天)
- ⚠️ Alpha Vantage (需要 API key)

**分析流程：**
```
1. 用户输入 TSLA
2. 抓取最近 10 条新闻标题
3. 调用 OpenAI GPT-4o 分析情绪
4. 返回 0-100 分数 + 评语
```

**OpenAI Prompt：**
```
分析以下关于 ${ticker} 的新闻标题，返回 JSON：

标题：
${headlines}

返回格式：
{
  "score": 0-100,  // 0=极度恐慌, 50=中性, 100=极度贪婪
  "label": "极度贪婪" | "贪婪" | "中性" | "恐惧" | "极度恐惧",
  "emoji": "🚀" | "😏" | "😐" | "😰" | "😱",
  "commentary": "一句话犀利点评，最多50字",
  "keywords": ["关键词1", "关键词2", ...]
}

评分标准：
- 90-100: 全是"突破"、"暴涨"、"革命性"等词 → 极度贪婪
- 70-89: 正面新闻居多
- 40-69: 中性，正负面混合
- 20-39: 负面新闻较多
- 0-19: 全是"暴跌"、"崩盘"、"危机"等词 → 极度恐惧
```

### 3. 情绪温度计（核心可视化）

**温度计设计：**
```
┌─────────────────┐
│   😱 FOMO 🚀   │
│                 │
│  ┌───────────┐  │
│  │🚀🚀🚀🚀🚀│  │ 100 ← 极度贪婪（红色）
│  │███████░░░│  │  92
│  │          │  │
│  │          │  │  50 ← 中性线（灰色）
│  │          │  │
│  │          │  │
│  │          │  │   0 ← 极度恐惧（深蓝）
│  └───────────┘  │
│                 │
│ "冷静，钢铁侠   │
│  也需要睡觉😴"  │
└─────────────────┘
```

**情绪分级：**
| 分数 | 标签 | 表情 | 背景色 | 动画效果 |
|------|------|------|--------|----------|
| 90-100 | 极度贪婪 | 🚀😱🔥 | `#ff6b6b` 红色 | 火箭飞过，轻微震动 |
| 70-89 | 贪婪 | 😏🤑 | `#ff8e53` 橙色 | 脉搏跳动 |
| 40-69 | 中性 | 😐🤔 | `#6c757d` 灰色 | 平静呼吸 |
| 20-39 | 恐惧 | 😰📉 | `#4a5568` 深灰 | 微微颤抖 |
| 0-19 | 极度恐惧 | 😱💀 | `#2d3748` 深紫 | 渐变暗淡 |

### 4. 新闻列表展示
```
📰 分析的新闻 (10 条)

┌────────────────────────────────┐
│ 🔴 特斯拉 Robotaxi 将改变世界  │
│    来源: Bloomberg · 2小时前    │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 🟢 特斯拉股价创历史新高         │
│    来源: CNBC · 5小时前         │
└────────────────────────────────┘
```

**新闻卡片：**
- 🔴 牛市标题（积极）
- 🟡 中性标题
- 🟢 熊市标题（消极）
- 标题最多 80 字符，超出省略
- 显示来源 + 时间

### 5. 犀利点评生成器

**模板库（快速版）：**
```typescript
const commentaries = {
  'extreme-greed': [
    "冷静，钢铁侠也需要睡觉 😴",
    "树不会长到天上去 🌳",
    "记住：高处不胜寒 🏔️",
    "这不就是那个著名的 '这次不一样' 吗？🤡",
  ],
  'extreme-fear': [
    "别人恐惧我贪婪 💎🙌",
    "街头血流成河时，正是买入良机 🛒",
    "恐慌性抛售？这就是财富转移的时刻 📈",
    "也许是 DCA 的好时候？🤷",
  ],
  'neutral': [
    "没啥可看的，散了吧 🚶",
    "市场很理性。无聊。😴",
    "金发姑娘区间 - 不冷不热 🐻",
  ]
};
```

**或者用 GPT 生成（更有趣）：**
- 让 GPT 根据具体新闻内容生成个性化点评
- 限制 50 字以内
- 风格：犀利、幽默、略带讽刺

---

## 📐 页面结构

### Route: `/labs/fomo-meter`

**布局：**
```
┌────────────────────────────────────┐
│        FOMO METER 😱               │  ← Hero
│   了解市场在疯狂还是恐慌            │
│                                    │
│   ┌──────────────────────────┐    │
│   │  [搜索框: 输入股票代码]  │    │
│   └──────────────────────────┘    │
│         [🔍 分析情绪] 按钮         │
└────────────────────────────────────┘

        ↓ 加载中... 🔍

┌────────────────────────────────────┐
│     结果区域                        │
│                                    │
│   ┌──────────────┐                 │
│   │  [温度计]    │  ← 左侧         │
│   │   92/100     │                 │
│   │   🚀🚀🚀     │                 │
│   └──────────────┘                 │
│                                    │
│   当前价格: $242.50 (+5.2%)        │
│   情绪等级: 极度贪婪 🚀            │
│   点评: "冷静，钢铁侠也需要睡觉"   │
│                                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│   📰 分析的新闻                    │
│                                    │
│   [新闻卡片 1]                     │
│   [新闻卡片 2]                     │
│   [新闻卡片 3]                     │
│   ...                              │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│   [再试一个股票] 按钮              │
└────────────────────────────────────┘
```

---

## 🛠️ 技术实现

### 文件结构
```
app/
  labs/
    fomo-meter/
      page.tsx                    # 主页面
      components/
        SearchBar.tsx             # 搜索输入框
        Thermometer.tsx           # 温度计组件
        SentimentCard.tsx         # 结果卡片
        HeadlineList.tsx          # 新闻列表
        HeadlineCard.tsx          # 单条新闻
      fomo-meter.module.css       # 样式
      
api/
  fomo-meter/
    route.ts                      # 后端 API
    
__tests__/
  labs/
    fomo-meter/
      components.test.tsx         # 组件测试
      api.test.ts                 # API 测试
```

### API Endpoint

**请求：**
```typescript
POST /api/fomo-meter
{
  "ticker": "TSLA"
}
```

**响应：**
```typescript
{
  "success": true,
  "data": {
    "ticker": "TSLA",
    "currentPrice": 242.50,
    "priceChange": "+5.2%",
    "sentiment": {
      "score": 92,
      "label": "极度贪婪",
      "emoji": "🚀",
      "commentary": "冷静，钢铁侠也需要睡觉 😴",
      "keywords": ["robotaxi", "突破", "看涨", "AI", "增长"]
    },
    "headlines": [
      {
        "title": "特斯拉 Robotaxi 将改变世界",
        "source": "Bloomberg",
        "publishedAt": "2025-11-19T14:30:00Z",
        "url": "https://...",
        "sentiment": "bullish"  // bullish/neutral/bearish
      },
      // ... 9 more
    ]
  }
}
```

**错误响应：**
```typescript
{
  "success": false,
  "error": {
    "code": "TICKER_NOT_FOUND",
    "message": "找不到这个股票代码，试试 AAPL, TSLA, NVDA 🤔"
  }
}
```

---

## 🎨 样式设计

### 配色方案
```css
/* 沿用 Kirboreo 主题 */
--primary-gradient: linear-gradient(135deg, #06b6d4, #9333ea);
--extreme-greed: #ff6b6b;
--greed: #ff8e53;
--neutral: #6c757d;
--fear: #4a5568;
--extreme-fear: #2d3748;
```

### 温度计设计（用 SVG）
```tsx
<svg viewBox="0 0 100 400" className={styles.thermometer}>
  {/* 外框 */}
  <rect x="30" y="20" width="40" height="350" rx="20" 
        fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="2"/>
  
  {/* 水银柱（动态高度） */}
  <rect x="32" y={380 - score * 3.5} width="36" height={score * 3.5} 
        fill={getColorByScore(score)} rx="18">
    <animate attributeName="height" from="0" to={score * 3.5} dur="1s"/>
  </rect>
  
  {/* 刻度线 */}
  <line x1="70" y1="20" x2="80" y2="20" stroke="white"/>  {/* 100 */}
  <line x1="70" y1="195" x2="80" y2="195" stroke="white"/> {/* 50 */}
  <line x1="70" y1="370" x2="80" y2="370" stroke="white"/> {/* 0 */}
</svg>
```

### 动画效果（用 Framer Motion）
```tsx
// 震动效果（极度贪婪时）
<motion.div
  animate={score >= 90 ? {
    x: [0, -5, 5, -5, 5, 0],
  } : {}}
  transition={{ repeat: Infinity, duration: 0.5 }}
>
  {children}
</motion.div>

// 背景渐变（根据情绪）
<motion.div
  animate={{
    background: getBackgroundByScore(score)
  }}
  transition={{ duration: 2 }}
/>
```

---

## 📊 数据源方案

### 方案 1: Yahoo Finance RSS（推荐，最快）
```typescript
// 使用已有的 yahoo-finance2 库
import yahooFinance from 'yahoo-finance2';

async function getNews(ticker: string) {
  try {
    const news = await yahooFinance.search(ticker, {
      newsCount: 10
    });
    return news.news || [];
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    return [];
  }
}
```

**优点：**
- ✅ 免费，无限制
- ✅ 已经集成在项目里
- ✅ 返回标题 + URL + 时间
- ✅ 速度快

**缺点：**
- ⚠️ 有时新闻数量较少
- ⚠️ 英文新闻为主

### 方案 2: NewsAPI.org（备选）
```typescript
// 需要注册：https://newsapi.org/
// 免费：100 请求/天

const response = await fetch(
  `https://newsapi.org/v2/everything?q=${ticker}&apiKey=${API_KEY}&pageSize=10&sortBy=publishedAt`
);
```

**优点：**
- ✅ 新闻更全面
- ✅ 支持多语言

**缺点：**
- ⚠️ 需要注册 API Key
- ⚠️ 免费版有限制（100次/天）

### 方案 3: Alpha Vantage（高级，可选）
```typescript
// 有专门的 News Sentiment API
const response = await fetch(
  `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${API_KEY}`
);
```

**优点：**
- ✅ 直接返回情绪分数（省了 OpenAI 调用）
- ✅ 专业金融新闻

**缺点：**
- ⚠️ 需要 API Key
- ⚠️ 免费版限制更严格

---

## 🔐 环境变量

**需要添加到 `.env.local`：**
```bash
# 已有
OPENAI_API_KEY=sk-...

# 新增（根据选择的数据源）
NEWSAPI_KEY=xxx            # 如果用 NewsAPI
ALPHA_VANTAGE_KEY=xxx      # 如果用 Alpha Vantage
```

---

## ⚡ 性能优化

### 缓存策略
```typescript
// 缓存新闻结果 5 分钟
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

// 用简单的内存缓存（MVP）
const cache = new Map<string, { data: any; timestamp: number }>();

function getCachedData(ticker: string) {
  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
```

### 限流
```typescript
// 简单的 IP 限流：5 次/分钟
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  
  // 清理 1 分钟前的请求
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 5) {
    return false; // 超过限制
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}
```

---

## 🧪 测试清单

### 手动测试
- [ ] 输入 `TSLA` 能正常显示结果
- [ ] 输入 `AAPL` 能正常显示结果
- [ ] 输入不存在的股票显示错误
- [ ] 温度计动画流畅
- [ ] 背景颜色根据分数变化
- [ ] 极度贪婪时有震动效果
- [ ] 新闻列表正确显示
- [ ] 移动端响应式正常

### 单元测试
```typescript
// __tests__/labs/fomo-meter/api.test.ts
describe('FOMO Meter API', () => {
  it('should return sentiment for valid ticker', async () => {
    const response = await POST('/api/fomo-meter', {
      body: { ticker: 'TSLA' }
    });
    expect(response.success).toBe(true);
    expect(response.data.sentiment.score).toBeGreaterThanOrEqual(0);
    expect(response.data.sentiment.score).toBeLessThanOrEqual(100);
  });

  it('should handle invalid ticker', async () => {
    const response = await POST('/api/fomo-meter', {
      body: { ticker: 'INVALID' }
    });
    expect(response.success).toBe(false);
  });
});
```

---

## 🚀 部署清单

- [ ] 代码提交到 GitHub
- [ ] 在 Vercel 添加环境变量（`OPENAI_API_KEY`, `NEWSAPI_KEY` 等）
- [ ] 部署到生产环境
- [ ] 测试生产环境 API 正常
- [ ] 更新 `/labs` 页面，把 "Coming Soon" 改成 "Live"
- [ ] 在社交媒体分享 🎉

---

## 📝 后续优化（非今晚）

### Phase 2 功能
- [ ] 历史情绪图表（折线图显示过去一周情绪变化）
- [ ] 对比功能（同时分析 2 个股票）
- [ ] 分享功能（生成 OG 图片分享到社交媒体）
- [ ] Reddit/Twitter 集成（抓取社交媒体情绪）
- [ ] 支持加密货币（BTC, ETH）

### 长期优化
- [ ] 用 Vercel KV 存储历史数据
- [ ] 邮件提醒（极端情绪时发邮件）
- [ ] 移动端 PWA 支持
- [ ] 多语言支持（中英文切换）

---

## ✅ 今晚目标

**最小可用版本（2-3 小时）：**
1. ✅ 创建 `/labs/fomo-meter` 页面
2. ✅ 搜索框 + 输入验证
3. ✅ 调用 Yahoo Finance 获取新闻
4. ✅ 调用 OpenAI 分析情绪
5. ✅ 温度计可视化（基础版）
6. ✅ 显示新闻列表
7. ✅ 显示犀利点评
8. ✅ 基础动画（背景色变化）
9. ✅ 部署到 Vercel

**拉伸目标（如果时间够）：**
- 🎯 震动/粒子特效
- 🎯 更复杂的动画
- 🎯 移动端优化
- 🎯 加载动画

---

## 🎨 灵感参考

### Fear & Greed Index (CNN)
- 网站: https://edition.cnn.com/markets/fear-and-greed
- 借鉴：半圆形仪表盘设计
- 区别：我们加入表情符号和幽默点评

### Crypto Fear & Greed Index
- 网站: https://alternative.me/crypto/fear-and-greed-index/
- 借鉴：简洁的数字展示
- 区别：我们针对个股，而非整体市场

---

## 🤝 协作方式

### 今晚开发流程
1. **我先确认这个需求文档** → 你看完回复"OK"或提出修改
2. **开始搭建骨架** → 创建文件结构、路由、基础组件
3. **实现 API** → 先搞定后端数据抓取 + OpenAI 调用
4. **实现前端** → 搜索框 → 温度计 → 新闻列表
5. **调试 + 美化** → 动画、响应式、错误处理
6. **部署测试** → 推到 Vercel，真实环境测试
7. **上线庆祝** 🎉

### 你需要做什么
- **确认需求**：这个文档看完，告诉我哪里需要调整
- **提供 API Key**（如果需要）：NewsAPI 或 Alpha Vantage
- **测试反馈**：开发过程中试用，告诉我哪里不爽
- **最终验收**：上线前一起测试

---

## 📞 快速决策点

### ❓ 问题 1: 数据源选哪个？
**选项：**
- A. Yahoo Finance（免费，已集成，推荐）
- B. NewsAPI（需注册，新闻更全）
- C. Alpha Vantage（有情绪 API，但限制多）

**你的选择：** _______

### ❓ 问题 2: 点评方式？
**选项：**
- A. 模板库（快，但千篇一律）
- B. GPT 生成（有趣，但贵 ~$0.02/次）
- C. 混合（模板为主，偶尔 GPT）

**你的选择：** _______

### ❓ 问题 3: 动画强度？
**选项：**
- A. 极简（只有颜色变化）
- B. 中等（颜色 + 温度计动画）
- C. 浮夸（颜色 + 动画 + 震动 + 粒子特效）

**你的选择：** _______

### ❓ 问题 4: 今晚是否支持加密货币？
**选项：**
- A. 是（BTC, ETH 等）
- B. 否（先做股票，之后再加）

**你的选择：** _______

---

## 🎯 准备开始了吗？

**确认后我会立即：**
1. 创建所有文件结构
2. 写好 API 路由代码
3. 实现前端组件
4. 添加测试

**你只需要回复：**
- "OK，开始吧！" → 我直接按这个文档开发
- "等等，需要改 XXX" → 我先调整需求

---

**Let's vibe coding! 🚀**

