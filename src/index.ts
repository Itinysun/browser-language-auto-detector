import { bcp47Map } from './browser/bcp47.full'
import { bcp47MapMin } from './browser/bcp47.min'

/**
 * LRU Cache for language detection results
 */
class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private maxSize: number

  constructor(maxSize = 100) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return undefined
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    this.cache.set(key, value)
  }
}

/**
 * Parse language tag according to RFC 5646 and generate fallback sequence
 * @param tag Language tag like 'zh-Hans-CN' or 'en-US'
 * @returns Array of fallback language codes ['zh-Hans-CN', 'zh-Hans', 'zh']
 */
function parseLanguageTag(tag: string): string[] {
  const variants: string[] = []
  const normalized = tag.trim().toLowerCase()

  if (!normalized) return variants

  variants.push(normalized)

  const parts = normalized.split('-')

  // Generate fallback sequence: zh-hans-cn -> zh-hans -> zh
  for (let i = parts.length - 1; i > 0; i--) {
    const fallback = parts.slice(0, i).join('-')
    if (fallback && !variants.includes(fallback)) {
      variants.push(fallback)
    }
  }

  return variants
}

/**
 * Standardize language code using Intl.Locale API with fallback
 * @param languageCode Raw language code
 * @returns Standardized language code
 */
function standardizeLanguageCode(languageCode: string): string {
  try {
    // Use Intl.Locale for standardization if available
    if (typeof Intl !== 'undefined' && Intl.Locale) {
      const locale = new Intl.Locale(languageCode)
      return locale.language
    }
  } catch {
    // Fallback to simple parsing
  }

  // Simple fallback: extract language part before first hyphen
  return languageCode.split('-')[0].toLowerCase()
}

// Combined language mapping for better performance
const combinedLanguageMap = new Map([...bcp47MapMin, ...bcp47Map])

// Cache for language detection results
const languageDetectionCache = new LRUCache<string, string | null>(100)

/**
 * Get first matched language name from browser language codes
 * Optimized version with caching and better fallback strategy
 * @param names Array of language codes from browser
 * @returns Language key string or null
 */
export function translateOriginLanguage(names: Array<string>): string | null {
  if (!names.length) return null

  // Create cache key preserving order since priority matters
  const cacheKey = names.join(',')

  // Check cache first
  const cached = languageDetectionCache.get(cacheKey)
  if (cached !== undefined) {
    return cached
  }

  // Generate expanded language codes with fallbacks
  const expandedCodes: string[] = []
  const seen = new Set<string>()

  for (const name of names) {
    const variants = parseLanguageTag(name)
    for (const variant of variants) {
      if (!seen.has(variant)) {
        seen.add(variant)
        expandedCodes.push(variant)
      }
    }
  }

  // Search in priority order using combined map
  for (const code of expandedCodes) {
    const result = combinedLanguageMap.get(code)
    if (result) {
      // Cache the result
      languageDetectionCache.set(cacheKey, result)
      return result
    }
  }

  // Cache negative result to avoid repeated computation
  languageDetectionCache.set(cacheKey, null)
  return null
}

/**
 * Get the origin language codes from browser with enhanced fallback support
 * @param standardize Whether to standardize language codes using Intl.Locale
 * @returns Array of language codes in priority order
 */
export function getBrowserLocalOrigin(standardize = false): Array<string> {
  const languages: string[] = []

  try {
    // Modern browsers: navigator.languages (priority order)
    if (window.navigator.languages && window.navigator.languages.length) {
      languages.push(...window.navigator.languages)
    }
    // Fallback: single language
    else if (window.navigator.language) {
      languages.push(window.navigator.language)
    }
    // IE 10 and older compatibility
    else if (Reflect.has(window.navigator, 'userLanguage')) {
      // @ts-expect-error - IE compatibility
      const userLang = window.navigator['userLanguage']
      if (userLang) {
        languages.push(userLang.toString())
      }
    }
  } catch {
    // Ignore errors and return empty array
  }

  if (standardize && languages.length > 0) {
    // Standardize language codes while preserving order and removing duplicates
    const standardized = new Set<string>()
    const result: string[] = []

    for (const lang of languages) {
      try {
        const normalized = standardizeLanguageCode(lang)
        if (!standardized.has(normalized)) {
          standardized.add(normalized)
          result.push(normalized)
        }
      } catch {
        // If standardization fails, use original code
        if (!standardized.has(lang)) {
          standardized.add(lang)
          result.push(lang)
        }
      }
    }

    return result
  }

  return languages
}

/**
 * Detect language name from browser (original API, maintained for compatibility)
 * Returns the object of LanguageName or null
 * @returns Language information object or null
 */
export function getLanguageName(): LanguageName | null {
  const locals = getBrowserLocalOrigin()
  const name = translateOriginLanguage(locals)
  if (name) return languageNames.get(name) || null
  return null
}

/**
 * Enhanced language detection with performance optimizations
 * @param options Configuration options for language detection
 * @returns Language information object or null
 */
export function getLanguageNameOptimized(
  options: {
    useCache?: boolean
    standardize?: boolean
    maxFallbacks?: number
  } = {}
): LanguageName | null {
  const { useCache = true, standardize = true, maxFallbacks = 10 } = options

  if (!useCache) {
    // Bypass cache for fresh detection
    const locals = getBrowserLocalOrigin(standardize)
    const limitedLocals = locals.slice(0, maxFallbacks) // Limit fallbacks for performance
    const name = translateOriginLanguageUncached(limitedLocals)
    if (name) return languageNames.get(name) || null
    return null
  }

  // Use cached version (default behavior)
  const locals = getBrowserLocalOrigin(standardize)
  const limitedLocals = locals.slice(0, maxFallbacks)
  const name = translateOriginLanguage(limitedLocals)
  if (name) return languageNames.get(name) || null
  return null
}

/**
 * Uncached version of translateOriginLanguage for testing and benchmarking
 */
function translateOriginLanguageUncached(names: Array<string>): string | null {
  if (!names.length) return null

  // Generate expanded language codes with fallbacks
  const expandedCodes: string[] = []
  const seen = new Set<string>()

  for (const name of names) {
    const variants = parseLanguageTag(name)
    for (const variant of variants) {
      if (!seen.has(variant)) {
        seen.add(variant)
        expandedCodes.push(variant)
      }
    }
  }

  // Search in priority order using combined map
  for (const code of expandedCodes) {
    const result = combinedLanguageMap.get(code)
    if (result) {
      return result
    }
  }

  return null
}

export const languageNames: Map<string, LanguageName> = new Map([
  [
    'albanian',
    {
      chinese: '阿尔巴尼亚语',
      origin: 'Shqip',
      rtl: false,
      key: 'albanian',
      english: 'Albanian',
    },
  ],
  [
    'arabic',
    {
      chinese: '阿拉伯语',
      origin: 'عربي',
      rtl: true,
      key: 'arabic',
      english: 'Arabic',
    },
  ],
  [
    'bangla',
    {
      chinese: '孟加拉语',
      origin: 'বাংলা',
      rtl: false,
      key: 'bangla',
      english: 'Bangla',
    },
  ],
  [
    'belarusian',
    {
      chinese: '白俄罗斯语',
      origin: 'беларускі',
      rtl: false,
      key: 'belarusian',
      english: 'Belarusian',
    },
  ],
  [
    'bengali',
    {
      chinese: '孟加拉语',
      origin: 'বাংলা',
      rtl: false,
      key: 'bengali',
      english: 'Bengali',
    },
  ],
  [
    'bulgarian',
    {
      chinese: '保加利亚语',
      origin: 'български',
      rtl: false,
      key: 'bulgarian',
      english: 'Bulgarian',
    },
  ],
  [
    'cambodia',
    {
      chinese: '高棉语',
      origin: 'ខ្មែរ',
      rtl: false,
      key: 'cambodia',
      english: 'Khmer',
    },
  ],
  [
    'cantonese',
    {
      chinese: '中文(繁体)',
      origin: '中文(繁體)',
      rtl: false,
      key: 'cantonese',
      english: 'Chinese (Traditional)',
    },
  ],
  [
    'chinese',
    {
      chinese: '简体中文',
      origin: '简体中文',
      rtl: false,
      key: 'chinese',
      english: 'Chinese Simplified',
    },
  ],
  [
    'croatian',
    {
      chinese: '克罗地亚语',
      origin: 'Hrvatski',
      rtl: false,
      key: 'croatian',
      english: 'Croatian',
    },
  ],
  [
    'czech',
    {
      chinese: '捷克语',
      origin: 'čeština',
      rtl: false,
      key: 'czech',
      english: 'Czech',
    },
  ],
  [
    'danish',
    {
      chinese: '丹麦语',
      origin: 'dansk',
      rtl: false,
      key: 'danish',
      english: 'Danish',
    },
  ],
  [
    'dutch',
    {
      chinese: '荷兰语',
      origin: 'Nederlands',
      rtl: false,
      key: 'dutch',
      english: 'Dutch',
    },
  ],
  [
    'english',
    {
      chinese: '英语',
      origin: 'English',
      rtl: false,
      key: 'english',
      english: 'English',
    },
  ],
  [
    'esperanto',
    {
      chinese: '世界语',
      origin: 'Esperanto',
      rtl: false,
      key: 'esperanto',
      english: 'Esperanto',
    },
  ],
  [
    'filipino',
    {
      chinese: '菲律宾语',
      origin: 'Filipino',
      rtl: false,
      key: 'filipino',
      english: 'Filipino',
    },
  ],
  [
    'finnish',
    {
      chinese: '芬兰语',
      origin: 'suomi',
      rtl: false,
      key: 'finnish',
      english: 'Finnish',
    },
  ],
  [
    'french',
    {
      chinese: '法语',
      origin: 'Français',
      rtl: false,
      key: 'french',
      english: 'French',
    },
  ],
  [
    'german',
    {
      chinese: '德语',
      origin: 'Deutsch',
      rtl: false,
      key: 'german',
      english: 'German',
    },
  ],
  [
    'greek',
    {
      chinese: '希腊语',
      origin: 'Ελληνικά',
      rtl: false,
      key: 'greek',
      english: 'Greek',
    },
  ],
  [
    'hausa',
    {
      chinese: '豪萨语',
      origin: 'Hausa',
      rtl: false,
      key: 'hausa',
      english: 'Hausa',
    },
  ],
  [
    'hebrew',
    {
      chinese: '希伯来语',
      origin: 'עִברִית',
      rtl: true,
      key: 'hebrew',
      english: 'Hebrew',
    },
  ],
  [
    'hindi',
    {
      chinese: '印地语',
      origin: 'हिंदी',
      rtl: false,
      key: 'hindi',
      english: 'Hindi',
    },
  ],
  [
    'hungarian',
    {
      chinese: '匈牙利语',
      origin: 'magyar',
      rtl: false,
      key: 'hungarian',
      english: 'Hungarian',
    },
  ],
  [
    'indonesian',
    {
      chinese: '印尼语',
      origin: 'bahasa Indonesia',
      rtl: false,
      key: 'indonesian',
      english: 'Indonesian',
    },
  ],
  [
    'italian',
    {
      chinese: '意大利语',
      origin: 'italiano',
      rtl: false,
      key: 'italian',
      english: 'Italian',
    },
  ],
  [
    'japanese',
    {
      chinese: '日语',
      origin: '日本語',
      rtl: false,
      key: 'japanese',
      english: 'Japanese',
    },
  ],
  [
    'korean',
    {
      chinese: '韩语',
      origin: '한국어',
      rtl: false,
      key: 'korean',
      english: 'Korean',
    },
  ],
  [
    'laos',
    {
      chinese: '老挝语',
      origin: 'ພາສາລາວ',
      rtl: false,
      key: 'laos',
      english: 'Lao',
    },
  ],
  [
    'malay',
    {
      chinese: '马来语',
      origin: 'Melayu',
      rtl: false,
      key: 'malay',
      english: 'Malay',
    },
  ],
  [
    'mongolian',
    {
      chinese: '蒙古语',
      origin: 'Монгол',
      rtl: false,
      key: 'mongolian',
      english: 'Mongolian',
    },
  ],
  [
    'myanmar',
    {
      chinese: '缅甸语',
      origin: 'မြန်မာ',
      rtl: false,
      key: 'myanmar',
      english: 'Myanmar',
    },
  ],
  [
    'norwegian',
    {
      chinese: '挪威语',
      origin: 'norsk',
      rtl: false,
      key: 'norwegian',
      english: 'Norwegian',
    },
  ],
  [
    'nepali',
    {
      chinese: '尼泊尔语',
      origin: 'नेपाली',
      rtl: false,
      key: 'nepali',
      english: 'Nepali',
    },
  ],
  [
    'pashto',
    {
      chinese: '普什图语',
      origin: 'پښتو',
      rtl: true,
      key: 'pashto',
      english: 'Pashto',
    },
  ],
  [
    'persian',
    {
      chinese: '波斯语',
      origin: 'فارسی',
      rtl: true,
      key: 'persian',
      english: 'Persian',
    },
  ],
  [
    'poland',
    {
      chinese: '波兰语',
      origin: 'Polski',
      rtl: false,
      key: 'poland',
      english: 'Polish',
    },
  ],
  [
    'portuguese',
    {
      chinese: '葡萄牙语',
      origin: 'Português',
      rtl: false,
      key: 'portuguese',
      english: 'Portuguese',
    },
  ],
  [
    'romanian',
    {
      chinese: '罗马尼亚语',
      origin: 'Română',
      rtl: false,
      key: 'romanian',
      english: 'Romanian',
    },
  ],
  [
    'russian',
    {
      chinese: '俄语',
      origin: 'Русский',
      rtl: false,
      key: 'russian',
      english: 'Russian',
    },
  ],
  [
    'serbian',
    {
      chinese: '塞尔维亚语',
      origin: 'Српски',
      rtl: false,
      key: 'serbian',
      english: 'Serbian',
    },
  ],
  [
    'sinhalese',
    {
      chinese: '僧伽罗语',
      origin: 'සිංහල',
      rtl: false,
      key: 'sinhalese',
      english: 'Sinhalese',
    },
  ],
  [
    'slovak',
    {
      chinese: '斯洛伐克语',
      origin: 'slovenský',
      rtl: false,
      key: 'slovak',
      english: 'Slovak',
    },
  ],
  [
    'spanish',
    {
      chinese: '西班牙语',
      origin: 'español',
      rtl: false,
      key: 'spanish',
      english: 'Spanish',
    },
  ],
  [
    'swahili',
    {
      chinese: '斯瓦希里语',
      origin: 'kiswahili',
      rtl: false,
      key: 'swahili',
      english: 'Swahili',
    },
  ],
  [
    'swedish',
    {
      chinese: '瑞典语',
      origin: 'svenska',
      rtl: false,
      key: 'swedish',
      english: 'Swedish',
    },
  ],
  [
    'tamil',
    {
      chinese: '泰米尔语',
      origin: 'தமிழ்',
      rtl: false,
      key: 'tamil',
      english: 'Tamil',
    },
  ],
  [
    'thai',
    {
      chinese: '泰语',
      origin: 'ไทย',
      rtl: false,
      key: 'thai',
      english: 'Thai',
    },
  ],
  [
    'turkish',
    {
      chinese: '土耳其语',
      origin: 'Türkçe',
      rtl: false,
      key: 'turkish',
      english: 'Turkish',
    },
  ],
  [
    'ukrainian',
    {
      chinese: '乌克兰语',
      origin: 'українська',
      rtl: false,
      key: 'ukrainian',
      english: 'Ukrainian',
    },
  ],
  [
    'urdu',
    {
      chinese: '乌尔都语',
      origin: 'اردو',
      rtl: true,
      key: 'urdu',
      english: 'Urdu',
    },
  ],
  [
    'vietnamese',
    {
      chinese: '越南语',
      origin: 'Tiếng Việt',
      rtl: false,
      key: 'vietnamese',
      english: 'Vietnamese',
    },
  ],

  [
    'afrikaans',
    {
      chinese: '南非荷兰语',
      origin: 'Afrikaans',
      rtl: false,
      key: 'afrikaans',
      english: 'Afrikaans',
    },
  ],
  [
    'amharic',
    {
      chinese: '阿姆哈拉语',
      origin: 'አማርኛ',
      rtl: false,
      key: 'amharic',
      english: 'Amharic',
    },
  ],
  [
    'azeri',
    {
      chinese: '阿塞拜疆语',
      origin: 'Azərbaycan',
      rtl: false,
      key: 'azeri',
      english: 'Azeri',
    },
  ],
  [
    'bosnian',
    {
      chinese: '波斯尼亚语',
      origin: 'bosanski',
      rtl: false,
      key: 'bosnian',
      english: 'Bosnian',
    },
  ],
  [
    'catalan',
    {
      chinese: '加泰罗尼亚语',
      origin: 'Catalana',
      rtl: false,
      key: 'catalan',
      english: 'Catalan',
    },
  ],
  [
    'welsh',
    {
      chinese: '威尔士语',
      origin: 'Cymraeg',
      rtl: false,
      key: 'welsh',
      english: 'Welsh',
    },
  ],
  [
    'estonian',
    {
      chinese: '爱沙尼亚语',
      origin: 'eestlane',
      rtl: false,
      key: 'estonian',
      english: 'Estonian',
    },
  ],
  [
    'basque',
    {
      chinese: '巴斯克语',
      origin: 'euskeraz',
      rtl: false,
      key: 'basque',
      english: 'Basque',
    },
  ],
  [
    'irish',
    {
      chinese: '爱尔兰语',
      origin: 'Gaeilge',
      rtl: false,
      key: 'irish',
      english: 'Irish',
    },
  ],
  [
    'galician',
    {
      chinese: '加利西亚语',
      origin: 'Galega',
      rtl: false,
      key: 'galician',
      english: 'Galician',
    },
  ],
  [
    'gujarati',
    {
      chinese: '古吉拉特语',
      origin: 'ગુજરાતી',
      rtl: false,
      key: 'gujarati',
      english: 'Gujarati',
    },
  ],
  [
    'armenian',
    {
      chinese: '亚美尼亚语',
      origin: 'հայերեն',
      rtl: false,
      key: 'armenian',
      english: 'Armenian',
    },
  ],
  [
    'icelandic',
    {
      chinese: '冰岛语',
      origin: 'íslenskur',
      rtl: false,
      key: 'icelandic',
      english: 'Icelandic',
    },
  ],
  [
    'javanese',
    {
      chinese: '爪哇语',
      origin: 'basa jawa',
      rtl: false,
      key: 'javanese',
      english: 'Javanese',
    },
  ],
  [
    'georgian',
    {
      chinese: '格鲁吉亚语',
      origin: 'ქართული',
      rtl: false,
      key: 'georgian',
      english: 'Georgian',
    },
  ],
  [
    'kazakh',
    {
      chinese: '哈萨克语',
      origin: 'қазақ',
      rtl: false,
      key: 'kazakh',
      english: 'Kazakh',
    },
  ],
  [
    'kannada',
    {
      chinese: '卡纳达语',
      origin: 'ಕನ್ನಡ',
      rtl: false,
      key: 'kannada',
      english: 'Kannada',
    },
  ],
  [
    'lithuanian',
    {
      chinese: '立陶宛语',
      origin: 'lietuvių',
      rtl: false,
      key: 'lithuanian',
      english: 'Lithuanian',
    },
  ],
  [
    'latvian',
    {
      chinese: '拉脱维亚语',
      origin: 'latviešu',
      rtl: false,
      key: 'latvian',
      english: 'Latvian',
    },
  ],
  [
    'macedonian',
    {
      chinese: '马其顿语',
      origin: 'македонски',
      rtl: false,
      key: 'macedonian',
      english: 'Macedonian',
    },
  ],
  [
    'marathi',
    {
      chinese: '马拉地语',
      origin: 'मराठी',
      rtl: false,
      key: 'marathi',
      english: 'Marathi',
    },
  ],
  [
    'maltese',
    {
      chinese: '马耳他语',
      origin: 'Malti',
      rtl: false,
      key: 'maltese',
      english: 'Maltese',
    },
  ],
  [
    'punjabi',
    {
      chinese: '旁遮普语',
      origin: 'ਪੰਜਾਬੀ',
      rtl: false,
      key: 'punjabi',
      english: 'Punjabi',
    },
  ],
  [
    'slovenian',
    {
      chinese: '斯洛文尼亚语',
      origin: 'Slovenščina',
      rtl: false,
      key: 'slovenian',
      english: 'Slovenian',
    },
  ],
  [
    'somali',
    {
      chinese: '索马里语',
      origin: 'Soomaali',
      rtl: false,
      key: 'somali',
      english: 'Somali',
    },
  ],
  [
    'telugu',
    {
      chinese: '泰卢固语',
      origin: 'తెలుగు',
      rtl: false,
      key: 'telugu',
      english: 'Telugu',
    },
  ],
  [
    'uzbek',
    {
      chinese: '乌兹别克语',
      origin: "o'zbek",
      rtl: false,
      key: 'uzbek',
      english: 'Uzbek',
    },
  ],
  [
    'zulu',
    {
      chinese: '祖鲁语',
      origin: 'Zulu',
      rtl: false,
      key: 'zulu',
      english: 'Zulu',
    },
  ],
  [
    'sundanese',
    {
      chinese: '巽他语',
      origin: 'Basa Sunda',
      rtl: false,
      key: 'sundanese',
      english: 'Sundanese',
    },
  ],
  [
    'assamese',
    {
      chinese: '阿萨姆语',
      origin: 'অসমীয়া',
      rtl: false,
      key: 'assamese',
      english: 'Assamese',
    },
  ],
  [
    'fijian',
    {
      chinese: '斐济语',
      origin: 'Fijian',
      rtl: false,
      key: 'fijian',
      english: 'Fijian',
    },
  ],
  [
    'haitian',
    {
      chinese: '海地克里奥尔语',
      origin: 'Kreyòl Ayisyen',
      rtl: false,
      key: 'haitian',
      english: 'Haitian',
    },
  ],
  [
    'hmong',
    {
      chinese: '苗语',
      origin: 'Hmoob',
      rtl: false,
      key: 'hmong',
      english: 'Hmong',
    },
  ],
  [
    'inuktitut',
    {
      chinese: '因纽特语',
      origin: 'ᐃᓄᒃᑎᑐᑦ',
      rtl: false,
      key: 'inuktitut',
      english: 'Inuktitut',
    },
  ],
  [
    'klingon',
    {
      chinese: '克林贡语',
      origin: 'tlhIngan',
      rtl: false,
      key: 'klingon',
      english: 'Klingon',
    },
  ],
  [
    'kurdish',
    {
      chinese: '库尔德语',
      origin: 'Kurdî',
      rtl: true,
      key: 'kurdish',
      english: 'Kurdish',
    },
  ],
  [
    'malagasy',
    {
      chinese: '马尔加什语',
      origin: 'Malagasy',
      rtl: false,
      key: 'malagasy',
      english: 'Malagasy',
    },
  ],
  [
    'maori',
    {
      chinese: '毛利语',
      origin: 'Māori',
      rtl: false,
      key: 'maori',
      english: 'Maori',
    },
  ],
  [
    'oriya',
    {
      chinese: '奥里亚语',
      origin: 'ଓଡ଼ିଆ',
      rtl: false,
      key: 'oriya',
      english: 'Oriya',
    },
  ],
  [
    'queretaro',
    {
      chinese: '克雷塔罗瓦克语',
      origin: 'Queretaro',
      rtl: false,
      key: 'queretaro',
      english: 'Queretaro',
    },
  ],
  [
    'samoan',
    {
      chinese: '萨摩亚语',
      origin: 'Samoan',
      rtl: false,
      key: 'samoan',
      english: 'Samoan',
    },
  ],
  [
    'tahitian',
    {
      chinese: '大溪地语',
      origin: 'Tahitian',
      rtl: false,
      key: 'tahitian',
      english: 'Tahitian',
    },
  ],
  [
    'tigrinya',
    {
      chinese: '提格利尼亚语',
      origin: 'ትግርኛ',
      rtl: false,
      key: 'tigrinya',
      english: 'Tigrinya',
    },
  ],
  [
    'tongan',
    {
      chinese: '汤加语',
      origin: 'Tongan',
      rtl: false,
      key: 'tongan',
      english: 'Tongan',
    },
  ],
  [
    'yucatec',
    {
      chinese: '尤卡坦玛雅语',
      origin: 'Yucatec',
      rtl: false,
      key: 'yucatec',
      english: 'Yucatec',
    },
  ],
])

export interface LanguageName {
  chinese: string
  origin: string
  rtl: boolean
  key: string
  english: string
}
