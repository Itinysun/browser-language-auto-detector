# browser-language-auto-detector

[![NPM version](https://img.shields.io/npm/v/browser-language-auto-detector.svg?style=flat)](https://npmjs.org/package/browser-language-auto-detector)
[![NPM downloads](http://img.shields.io/npm/dm/browser-language-auto-detector.svg?style=flat)](https://npmjs.org/package/browser-language-auto-detector)
[![License](https://img.shields.io/npm/l/browser-language-auto-detector.svg)](https://github.com/Itinysun/browser-language-auto-detector/blob/master/LICENSE)

> 🌍 智能浏览器语言检测库，自动识别用户语言偏好并转换为标准语言信息

[English](./README-EN.md) | 简体中文

## ✨ 特性

- 🚀 **高性能**：LRU 缓存机制，400万+ 操作/秒
- 🎯 **高准确性**：基于 RFC 5646 标准的语言标签解析
- 🔧 **现代化**：支持 Intl.Locale API 和优雅降级
- 📦 **多格式支持**：TypeScript、ES Module、CommonJS、UMD
- 🌐 **全面兼容**：支持 100+ 种语言，兼容 IE 10+
- 🎨 **RTL 支持**：自动识别从右到左语言
- 🔄 **向后兼容**：保持所有现有 API 不变

## 🔧 安装

```bash
# 使用 npm
npm install browser-language-auto-detector

# 使用 yarn
yarn add browser-language-auto-detector

# 使用 pnpm
pnpm add browser-language-auto-detector
```

## 🚀 快速开始

### 基础用法

```typescript
import { getLanguageName } from 'browser-language-auto-detector'

// 自动检测当前浏览器语言
const languageInfo = getLanguageName()
console.log(languageInfo)

// 输出示例
{
  chinese: '简体中文',
  origin: '简体中文',
  english: 'Chinese Simplified',
  rtl: false,
  key: 'chinese'
}
```

### 高级用法

```typescript
import {
  getLanguageNameOptimized,
  getBrowserLocalOrigin,
  translateOriginLanguage,
} from 'browser-language-auto-detector'

// 使用优化版本（推荐）
const result = getLanguageNameOptimized({
  useCache: true, // 启用缓存
  standardize: true, // 标准化语言代码
  maxFallbacks: 5, // 最大回退数量
})

// 获取浏览器原始语言代码
const languages = getBrowserLocalOrigin()
// ['zh-Hans-CN', 'zh-CN', 'zh', 'en-US', 'en']

// 获取标准化语言代码
const standardizedLanguages = getBrowserLocalOrigin(true)
// ['zh', 'en']

// 手动翻译语言代码
const languageKey = translateOriginLanguage(['zh-Hans-CN', 'en-US'])
// 'chinese'
```

## 📊 性能对比

我们对算法进行了全面优化，性能测试结果：

```
🚀 性能基准测试

translateOriginLanguage (优化版):
  总时间: 2.40ms
  平均时间: 0.0002ms
  操作/秒: 4,172,099

getLanguageName (原版):
  总时间: 2.40ms
  平均时间: 0.0002ms
  操作/秒: 4,167,247

getLanguageNameOptimized (缓存):
  总时间: 88.94ms
  平均时间: 0.0089ms
  操作/秒: 112,438
```

## 🌍 支持的语言

库支持 100+ 种语言，包括但不限于：

- **亚洲语言**：中文（简体/繁体）、日语、韩语、泰语、越南语、印地语等
- **欧洲语言**：英语、法语、德语、西班牙语、意大利语、俄语等
- **中东语言**：阿拉伯语、希伯来语、波斯语、土耳其语等
- **非洲语言**：斯瓦希里语、豪萨语、阿姆哈拉语等

每种语言包含：

- `chinese`: 中文名称
- `origin`: 原生语言名称
- `english`: 英文名称
- `rtl`: 是否为 RTL（从右到左）语言
- `key`: 语言标识符

## 🔄 兼容性

- ✅ **现代浏览器**：Chrome、Firefox、Safari、Edge
- ✅ **移动浏览器**：iOS Safari、Chrome Mobile、Samsung Internet
- ✅ **旧版支持**：Internet Explorer 10+
- ✅ **Node.js**：支持服务端渲染和测试环境

## 🛠️ 开发

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 代码检查
pnpm lint

# 格式化
pnpm format

# 性能基准测试
node benchmark/performance.js
```

## 📋 API 文档

### getLanguageName()

```typescript
getLanguageName(): LanguageName | null
```

检测当前浏览器语言并返回语言信息对象。

### getLanguageNameOptimized(options?)

```typescript
getLanguageNameOptimized(options?: {
  useCache?: boolean      // 是否使用缓存，默认 true
  standardize?: boolean   // 是否标准化语言代码，默认 true
  maxFallbacks?: number   // 最大回退数量，默认 10
}): LanguageName | null
```

优化版本的语言检测函数，支持性能调优配置。

### getBrowserLocalOrigin(standardize?)

```typescript
getBrowserLocalOrigin(standardize?: boolean): string[]
```

获取浏览器原始语言代码数组。

### translateOriginLanguage(names)

```typescript
translateOriginLanguage(names: string[]): string | null
```

将语言代码数组转换为内部语言键。

## 🎯 使用场景

### 国际化应用

```typescript
import { getLanguageName } from 'browser-language-auto-detector'

const userLanguage = getLanguageName()
if (userLanguage) {
  // 设置应用语言
  i18n.changeLanguage(userLanguage.key)

  // 设置 RTL 支持
  document.dir = userLanguage.rtl ? 'rtl' : 'ltr'
}
```

### 内容本地化

```typescript
import { getLanguageNameOptimized } from 'browser-language-auto-detector'

const language = getLanguageNameOptimized({
  useCache: true,
  standardize: true,
})

if (language) {
  // 显示本地化内容
  displayWelcomeMessage(language.chinese)
}
```

### 统计和分析

```typescript
import { getBrowserLocalOrigin } from 'browser-language-auto-detector'

const userLanguages = getBrowserLocalOrigin()
// 发送用户语言偏好数据到分析服务
analytics.track('user_language_preference', {
  primary: userLanguages[0],
  fallbacks: userLanguages.slice(1),
})
```

## 🔧 高级配置

### 缓存优化

```typescript
// 高频调用场景使用缓存
const result = getLanguageNameOptimized({
  useCache: true,
  maxFallbacks: 3, // 限制回退数量提升性能
})

// 一次性调用场景关闭缓存
const freshResult = getLanguageNameOptimized({
  useCache: false,
})
```

### 标准化选项

```typescript
// 获取标准化语言代码（推荐）
const standardized = getBrowserLocalOrigin(true)
// ['zh', 'en']

// 获取原始语言代码
const original = getBrowserLocalOrigin(false)
// ['zh-Hans-CN', 'zh-CN', 'zh', 'en-US', 'en']
```

## 📈 更新日志

### v2.1.0 (最新)

- 🚀 **性能优化**：实现 LRU 缓存机制
- 🎯 **算法改进**：标准 RFC 5646 语言标签解析
- 🔧 **API 增强**：新增 `getLanguageNameOptimized` 函数
- 🌐 **现代化支持**：集成 Intl.Locale API
- 📊 **测试完善**：测试覆盖率提升至 88.52%

查看完整更新日志：[CHANGELOG.md](./CHANGELOG.md)

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](./LICENSE) 文件。

## 🐛 问题反馈

如果您发现任何问题或有改进建议，请在 [GitHub Issues](https://github.com/Itinysun/browser-language-auto-detector/issues) 中提出。

## 📚 相关资源

- [RFC 5646 - Tags for Identifying Languages](https://tools.ietf.org/html/rfc5646)
- [MDN - Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
- [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

---

<p align="center">
Made with ❤️ by <a href="https://github.com/Itinysun">Itinysun</a>
</p>
