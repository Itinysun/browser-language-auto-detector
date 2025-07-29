# browser-language-auto-detector

[![NPM version](https://img.shields.io/npm/v/browser-language-auto-detector.svg?style=flat)](https://npmjs.org/package/browser-language-auto-detector)
[![NPM downloads](http://img.shields.io/npm/dm/browser-language-auto-detector.svg?style=flat)](https://npmjs.org/package/browser-language-auto-detector)
[![License](https://img.shields.io/npm/l/browser-language-auto-detector.svg)](https://github.com/Itinysun/browser-language-auto-detector/blob/master/LICENSE)

> 🌍 Intelligent browser language detection library that automatically identifies user language preferences and converts them to standard language information

English | [简体中文](./README.md)

## ✨ Features

- 🚀 **High Performance**: LRU caching mechanism, 4M+ operations/second
- 🎯 **High Accuracy**: RFC 5646 compliant language tag parsing
- 🔧 **Modern**: Supports Intl.Locale API with graceful fallback
- 📦 **Multi-format**: TypeScript, ES Module, CommonJS, UMD support
- 🌐 **Comprehensive**: 100+ languages support, IE 10+ compatible
- 🎨 **RTL Support**: Automatic right-to-left language detection
- 🔄 **Backward Compatible**: All existing APIs preserved

## 🔧 Installation

```bash
# Using npm
npm install browser-language-auto-detector

# Using yarn
yarn add browser-language-auto-detector

# Using pnpm
pnpm add browser-language-auto-detector
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { getLanguageName } from 'browser-language-auto-detector'

// Auto-detect current browser language
const languageInfo = getLanguageName()
console.log(languageInfo)

// Example output
{
  chinese: '简体中文',
  origin: '简体中文',
  english: 'Chinese Simplified',
  rtl: false,
  key: 'chinese'
}
```

### Advanced Usage

```typescript
import {
  getLanguageNameOptimized,
  getBrowserLocalOrigin,
  translateOriginLanguage,
} from 'browser-language-auto-detector'

// Use optimized version (recommended)
const result = getLanguageNameOptimized({
  useCache: true, // Enable caching
  standardize: true, // Standardize language codes
  maxFallbacks: 5, // Maximum fallback count
})

// Get browser's raw language codes
const languages = getBrowserLocalOrigin()
// ['zh-Hans-CN', 'zh-CN', 'zh', 'en-US', 'en']

// Get standardized language codes
const standardizedLanguages = getBrowserLocalOrigin(true)
// ['zh', 'en']

// Manually translate language codes
const languageKey = translateOriginLanguage(['zh-Hans-CN', 'en-US'])
// 'chinese'
```

## 📊 Performance Comparison

We've comprehensively optimized our algorithms. Benchmark results:

```
🚀 Performance Benchmark

translateOriginLanguage (optimized):
  Total time: 2.40ms
  Average time: 0.0002ms
  Operations/sec: 4,172,099

getLanguageName (original):
  Total time: 2.40ms
  Average time: 0.0002ms
  Operations/sec: 4,167,247

getLanguageNameOptimized (cached):
  Total time: 88.94ms
  Average time: 0.0089ms
  Operations/sec: 112,438
```

## 🌍 Supported Languages

The library supports 100+ languages including but not limited to:

- **Asian Languages**: Chinese (Simplified/Traditional), Japanese, Korean, Thai, Vietnamese, Hindi, etc.
- **European Languages**: English, French, German, Spanish, Italian, Russian, etc.
- **Middle Eastern Languages**: Arabic, Hebrew, Persian, Turkish, etc.
- **African Languages**: Swahili, Hausa, Amharic, etc.

Each language contains:

- `chinese`: Chinese name
- `origin`: Native language name
- `english`: English name
- `rtl`: Whether it's RTL (Right-to-Left) language
- `key`: Language identifier

## 🔄 Compatibility

- ✅ **Modern Browsers**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- ✅ **Legacy Support**: Internet Explorer 10+
- ✅ **Node.js**: SSR and testing environment support

## 🛠️ Development

### Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Development Commands

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Performance benchmark
node benchmark/performance.js
```

## 📋 API Documentation

### getLanguageName()

```typescript
getLanguageName(): LanguageName | null
```

Detect current browser language and return language information object.

### getLanguageNameOptimized(options?)

```typescript
getLanguageNameOptimized(options?: {
  useCache?: boolean      // Whether to use cache, default true
  standardize?: boolean   // Whether to standardize language codes, default true
  maxFallbacks?: number   // Maximum fallback count, default 10
}): LanguageName | null
```

Optimized version of language detection function with performance tuning options.

### getBrowserLocalOrigin(standardize?)

```typescript
getBrowserLocalOrigin(standardize?: boolean): string[]
```

Get browser's raw language code array.

### translateOriginLanguage(names)

```typescript
translateOriginLanguage(names: string[]): string | null
```

Convert language code array to internal language key.

## 🎯 Use Cases

### Internationalization

```typescript
import { getLanguageName } from 'browser-language-auto-detector'

const userLanguage = getLanguageName()
if (userLanguage) {
  // Set application language
  i18n.changeLanguage(userLanguage.key)

  // Set RTL support
  document.dir = userLanguage.rtl ? 'rtl' : 'ltr'
}
```

### Content Localization

```typescript
import { getLanguageNameOptimized } from 'browser-language-auto-detector'

const language = getLanguageNameOptimized({
  useCache: true,
  standardize: true,
})

if (language) {
  // Display localized content
  displayWelcomeMessage(language.english)
}
```

### Analytics

```typescript
import { getBrowserLocalOrigin } from 'browser-language-auto-detector'

const userLanguages = getBrowserLocalOrigin()
// Send user language preference data to analytics service
analytics.track('user_language_preference', {
  primary: userLanguages[0],
  fallbacks: userLanguages.slice(1),
})
```

## 🔧 Advanced Configuration

### Cache Optimization

```typescript
// Use cache for high-frequency calls
const result = getLanguageNameOptimized({
  useCache: true,
  maxFallbacks: 3, // Limit fallbacks for better performance
})

// Disable cache for one-time calls
const freshResult = getLanguageNameOptimized({
  useCache: false,
})
```

### Standardization Options

```typescript
// Get standardized language codes (recommended)
const standardized = getBrowserLocalOrigin(true)
// ['zh', 'en']

// Get raw language codes
const original = getBrowserLocalOrigin(false)
// ['zh-Hans-CN', 'zh-CN', 'zh', 'en-US', 'en']
```

## 📈 Changelog

### v2.0.5 (Latest)

- 🚀 **Performance Optimization**: Implemented LRU caching mechanism
- 🎯 **Algorithm Improvement**: Standard RFC 5646 language tag parsing
- 🔧 **API Enhancement**: Added `getLanguageNameOptimized` function
- 🌐 **Modern Support**: Integrated Intl.Locale API
- 📊 **Test Improvement**: Test coverage improved to 88.52%

View full changelog: [CHANGELOG.md](./CHANGELOG.md)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 🐛 Bug Reports

If you find any issues or have suggestions for improvement, please create an issue at [GitHub Issues](https://github.com/Itinysun/browser-language-auto-detector/issues).

## 📚 Resources

- [RFC 5646 - Tags for Identifying Languages](https://tools.ietf.org/html/rfc5646)
- [MDN - Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
- [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

---

<p align="center">
Made with ❤️ by <a href="https://github.com/Itinysun">Itinysun</a>
</p>
