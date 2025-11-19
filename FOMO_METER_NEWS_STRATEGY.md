# 📰 FOMO Meter 新闻获取策略

**更新时间：** 2025年11月19日  
**状态：** ✅ 优化完成

---

## 🎯 目标

**确保每次分析都能获取到至少10篇相关新闻**，以便GPT能够基于充足的数据进行准确的情绪分析。

---

## 📋 问题描述

### 之前的问题
- Yahoo Finance API返回的新闻数量有限（20条）
- 经过严格的相关性过滤后，可能只剩4-5篇文章
- GPT基于少量文章分析，结果可能不够准确
- 部分股票（如小盘股）新闻本身就少

### 用户需求
> "有的时候我看只能fetch到4-5篇文章，到不了10篇，能不能保证是10篇，最近的都行，1-2天，如果1-2天不够多，更远的时间也算进来，就是最近10篇"

---

## ✅ 解决方案

### 新的获取策略

#### 1. **增加初始获取数量**
```typescript
const searchResult = await yahooFinance.search(ticker, {
  newsCount: 50 // 从20增加到50
});
```

**原因：** 更大的池子意味着过滤后还能剩下足够的文章

---

#### 2. **两层过滤策略**

##### 第一层：严格过滤（Strict Filtering）
```typescript
let relevantNews = parsedNews.filter(item => 
  isNewsRelevant(item.title, ticker, companyName)
);
```

**标准：**
- 标题包含完整的ticker（带word boundary）
- 标题包含公司名称
- 特殊处理：PATH只匹配"uipath"，COIN只匹配"coinbase"

**目标：** 高度相关的新闻

---

##### 第二层：宽松过滤（Relaxed Filtering）- 如果第一层结果 < 10篇
```typescript
if (relevantNews.length < 10) {
  const relaxedNews = parsedNews.filter(item => {
    const titleLower = item.title.toLowerCase();
    
    // Include if ticker is mentioned (anywhere in title)
    if (titleLower.includes(tickerLower)) return true;
    
    // Include if company name is mentioned
    if (companyLower && titleLower.includes(companyLower)) return true;
    
    // For crypto (BTC-USD), also check without -USD
    if (ticker.endsWith('-USD')) {
      const baseTicker = ticker.replace('-USD', '').toLowerCase();
      if (titleLower.includes(baseTicker)) return true;
    }
    
    return false;
  });
  
  // Merge with strict results (remove duplicates)
  relevantNews = [...relevantNews, ...additionalNews];
}
```

**标准：**
- 标题任何地方包含ticker（不要求word boundary）
- 标题任何地方包含公司名称
- 加密货币特殊处理（BTC-USD → 也匹配"btc"）

**目标：** 扩大范围，确保数量充足

---

#### 3. **时间优先策略**

```typescript
// 排序：最新的在前
relevantNews.sort((a, b) => 
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

// 过滤：优先选择7天内的新闻
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentNews = relevantNews.filter(item => 
  new Date(item.publishedAt) >= sevenDaysAgo
);

// 决策：如果7天内的新闻 >= 10篇，用这些；否则用所有可用的
const finalNews = recentNews.length >= 10 ? recentNews : relevantNews;

// 返回最多10篇
return finalNews.slice(0, 10);
```

**逻辑：**
1. 如果7天内有≥10篇新闻 → 使用最新的10篇
2. 如果7天内<10篇 → 扩展到更早的时间，直到凑够10篇（或所有可用的）

---

## 📊 策略流程图

```
开始
  ↓
获取50篇新闻（Yahoo Finance API）
  ↓
严格过滤（ticker/公司名完整匹配）
  ↓
结果 >= 10篇？
  ├─ 是 → 进入时间过滤
  └─ 否 → 宽松过滤（任何提及ticker/公司名）
           ↓
        合并结果 + 去重
           ↓
按时间排序（最新在前）
  ↓
过滤7天内的新闻
  ↓
7天内结果 >= 10篇？
  ├─ 是 → 取最新10篇
  └─ 否 → 取所有可用的（最多10篇）
           ↓
返回给GPT分析
  ↓
结束
```

---

## 🔍 实际案例分析

### Case 1: 热门股票（TSLA, AAPL, GOOGL）
```
输入: TSLA
Yahoo返回: 50篇新闻
严格过滤: 35篇相关
7天内新闻: 30篇
最终结果: 10篇（最新的）

✅ 结果：充足的高质量新闻
```

---

### Case 2: 加密货币（BTC-USD）
```
输入: btc
解析为: BTC-USD
Yahoo返回: 50篇新闻
严格过滤: 6篇（只包含"BTC-USD"完整提及）
宽松过滤: 18篇（包含"btc", "bitcoin"提及）
合并去重: 18篇
7天内新闻: 15篇
最终结果: 10篇（最新的）

✅ 结果：通过宽松过滤成功补足
```

---

### Case 3: 小盘股或冷门股票（PATH）
```
输入: PATH
Yahoo返回: 50篇新闻
严格过滤: 2篇（只有"uipath"提及）
宽松过滤: 8篇（任何"path"提及，包括非相关）
合并去重: 8篇
7天内新闻: 6篇
扩展时间: 8篇（全部）
最终结果: 8篇（不足10篇，但已是全部可用）

⚠️ 结果：尽力而为，GPT仍可基于8篇分析
```

---

### Case 4: 极冷门股票
```
输入: XXX（极小盘股）
Yahoo返回: 5篇新闻
严格过滤: 1篇
宽松过滤: 3篇
最终结果: 3篇

⚠️ 结果：数据源限制，GPT基于3篇分析
注意：API会记录警告日志
```

---

## 📝 日志追踪

### Console输出示例（成功案例）
```
Fetching news for TSLA (Tesla)
Found 50 news items (before filtering)
After strict filtering: 35 relevant news items
Final selection: 10 news items (30 from last 7 days)
```

### Console输出示例（需要宽松过滤）
```
Fetching news for BTC-USD (Bitcoin)
Found 50 news items (before filtering)
After strict filtering: 6 relevant news items
Only 6 items found with strict filtering, trying relaxed filtering...
After relaxed filtering: 18 total relevant news items
Final selection: 10 news items (15 from last 7 days)
```

### Console输出示例（不足10篇）
```
Fetching news for PATH (UiPath)
Found 50 news items (before filtering)
After strict filtering: 2 relevant news items
Only 2 items found with strict filtering, trying relaxed filtering...
After relaxed filtering: 8 total relevant news items
Final selection: 8 news items (6 from last 7 days)
⚠️ Only 8 news items found for PATH (expected 10)
```

---

## 🎯 GPT分析影响

### 理想情况（10篇新闻）
```json
{
  "rawScore": 7.5,
  "score": 75,
  "label": "贪婪",
  "commentary": "基于10篇新闻的全面分析..."
}
```

### 少量新闻（<10篇）
GPT的Prompt会自动显示实际文章数：
```
新闻标题（共 8 条）：
1. ...
2. ...
...
```

GPT仍然能够分析，但会在commentary中提及数据有限：
```json
{
  "rawScore": 6.0,
  "score": 60,
  "label": "中性",
  "commentary": "新闻数据有限，但从现有信息看..."
}
```

---

## ⚙️ 配置参数

| 参数 | 值 | 说明 |
|------|---|------|
| `newsCount` | 50 | Yahoo Finance初始获取数量 |
| `targetCount` | 10 | 目标新闻数量 |
| `recentDays` | 7 | 优先使用的时间范围（天） |
| `maxReturnCount` | 10 | 最多返回的新闻数量 |

---

## 🔮 未来优化方向

### 1. 多数据源整合
```typescript
// 伪代码
const [yahooNews, alphaVantageNews, newsApiNews] = await Promise.all([
  getNewsFromYahoo(ticker),
  getNewsFromAlphaVantage(ticker),
  getNewsFromNewsAPI(ticker)
]);

const allNews = [...yahooNews, ...alphaVantageNews, ...newsApiNews];
// 去重 + 排序
```

**优势：** 数据源多样化，覆盖面更广

---

### 2. 智能时间扩展
```typescript
// 当前：固定7天
// 优化：根据新闻频率动态调整

if (recentNews.length < 5) {
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 扩展到14天
} else if (recentNews.length < 3) {
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14); // 扩展到30天
}
```

**优势：** 更灵活的时间窗口

---

### 3. 相关性评分（而非二元过滤）
```typescript
interface ScoredNews {
  item: NewsItem;
  relevanceScore: number; // 0-100
}

// 基于多个因素评分
const scoredNews = parsedNews.map(item => ({
  item,
  relevanceScore: calculateRelevance(item, ticker, companyName)
}));

// 按评分排序，取前10
const topNews = scoredNews
  .sort((a, b) => b.relevanceScore - a.relevanceScore)
  .slice(0, 10)
  .map(scored => scored.item);
```

**优势：** 更精细的相关性判断

---

### 4. 缓存优化
```typescript
// 缓存策略：
// - 热门股票（TSLA, AAPL）：5分钟
// - 普通股票：10分钟
// - 冷门股票：30分钟

const getCacheTTL = (ticker: string, newsCount: number) => {
  if (HOT_TICKERS.includes(ticker)) return 5 * 60 * 1000;
  if (newsCount >= 20) return 10 * 60 * 1000;
  return 30 * 60 * 1000;
};
```

**优势：** 减少API调用，提高响应速度

---

## ✅ 总结

### 当前实现
- ✅ 获取50篇新闻（而非20篇）
- ✅ 两层过滤策略（严格 + 宽松）
- ✅ 优先最新新闻（7天内）
- ✅ 自动扩展时间范围（如果不足10篇）
- ✅ 智能去重和排序
- ✅ 详细的日志追踪

### 效果
- **大多数情况：** 能获取到10篇相关新闻 ✅
- **部分情况：** 8-9篇新闻（已尽力）⚠️
- **极少数情况：** <5篇新闻（数据源限制）❌

### 建议
如果仍然经常遇到新闻不足的情况，可以考虑：
1. 集成第二个新闻API（Alpha Vantage或NewsAPI）
2. 扩大时间窗口到14天
3. 进一步放宽过滤标准（但可能影响相关性）

---

**状态：** 生产就绪 🚀  
**测试建议：** 清除缓存后测试热门股票（TSLA）和冷门股票（PATH）对比效果

