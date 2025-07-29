import {
  translateOriginLanguage,
  getLanguageName,
  getLanguageNameOptimized,
  getBrowserLocalOrigin,
  languageNames,
} from '../src'
import { expect, test, describe } from '@jest/globals'
import { bcp47Map } from '../src/browser/bcp47.full'
import { bcp47MapMin } from '../src/browser/bcp47.min'

describe('function model', () => {
  test('translate en-xx to language name', () => {
    expect(translateOriginLanguage(['en-xx'])).toBe('english')
  })
  test('translate en-us to language name', () => {
    expect(translateOriginLanguage(['en-us'])).toBe('english')
  })
  test('translate xx to NO language name', () => {
    expect(translateOriginLanguage(['xx'])).toBe(null)
  })
  test('get origin lang array by language', () => {
    ;(global.window as any) = { navigator: { language: 'lang' } }
    expect(getBrowserLocalOrigin()).toEqual(['lang'])
  })
  test('get origin lang array by languages', () => {
    ;(global.window as any) = { navigator: { languages: ['lang'] } }
    expect(getBrowserLocalOrigin()).toEqual(['lang'])
  })
  test('get origin lang array by ie userLanguage', () => {
    ;(global.window as any) = { navigator: { userLanguage: 'lang' } }
    expect(getBrowserLocalOrigin()).toEqual(['lang'])
  })
  test('get origin lang array by ie userLanguage', () => {
    ;(global.window as any) = { navigator: { userLanguage: undefined } }
    expect(getBrowserLocalOrigin()).toEqual([])
  })
  test('get origin lang array by nothing', () => {
    ;(global.window as any) = { navigator: {} }
    expect(getBrowserLocalOrigin())
  })

  test('get translated name object', () => {
    ;(global.window as any) = { navigator: { language: 'x' } }
    expect(getLanguageName()).toBeNull()
  })

  test('get translated name object', () => {
    ;(global.window as any) = { navigator: { language: 'en-US' } }
    expect(getLanguageName()).toEqual({
      chinese: '英语',
      origin: 'English',
      rtl: false,
      key: 'english',
      english: 'English',
    })
  })
})

const checkBcp47Min = (): Array<string> => {
  const missLanguage: Array<string> = []
  bcp47MapMin.forEach(v => {
    if (languageNames.get(v) == undefined) missLanguage.push(v)
  })
  return missLanguage
}
const checkBcp47Full = (): Array<string> => {
  const missLanguage: Array<string> = []
  bcp47Map.forEach(v => {
    if (languageNames.get(v) == undefined) missLanguage.push(v)
  })
  return missLanguage
}

describe('check browser language typo', () => {
  test('check bcp47.min list', () => {
    expect(checkBcp47Min()).toEqual([])
  })
  test('check bcp47.full list', () => {
    expect(checkBcp47Full()).toEqual([])
  })
})

describe('optimized language detection', () => {
  test('complex language tags with fallbacks', () => {
    expect(translateOriginLanguage(['zh-Hans-CN'])).toBe('chinese')
    expect(translateOriginLanguage(['en-US-POSIX'])).toBe('english')
    expect(translateOriginLanguage(['fr-CA-x-ca'])).toBe('french')
  })

  test('multiple language codes with priority', () => {
    expect(translateOriginLanguage(['unknown-XX', 'en-US'])).toBe('english')
    expect(translateOriginLanguage(['invalid', 'zh-CN', 'en'])).toBe('chinese')
  })

  test('cache effectiveness', () => {
    const codes1 = ['zh-Hans-CN', 'en-US']
    const codes2 = ['en-US', 'zh-Hans-CN']

    // First call should populate cache
    const result1 = translateOriginLanguage(codes1)
    expect(result1).toBe('chinese') // zh-Hans-CN has priority

    // Second call with same order should use cache
    const result2 = translateOriginLanguage(codes1)
    expect(result2).toBe('chinese')

    // Different order should get different result (no cache hit due to different order)
    const result3 = translateOriginLanguage(codes2)
    expect(result3).toBe('english') // en-US has priority in this order

    // Verify cache works for the second order too
    const result4 = translateOriginLanguage(codes2)
    expect(result4).toBe('english') // Should use cached result
  })

  test('optimized getLanguageName function', () => {
    ;(global.window as any) = { navigator: { language: 'zh-Hans-CN' } }

    const result = getLanguageNameOptimized()
    expect(result).toEqual({
      chinese: '简体中文',
      origin: '简体中文',
      rtl: false,
      key: 'chinese',
      english: 'Chinese Simplified',
    })
  })

  test('optimized function with options', () => {
    ;(global.window as any) = { navigator: { languages: ['fr-CA', 'en-US'] } }

    // With cache
    const resultCached = getLanguageNameOptimized({ useCache: true })
    expect(resultCached?.key).toBe('french')

    // Without cache
    const resultUncached = getLanguageNameOptimized({ useCache: false })
    expect(resultUncached?.key).toBe('french')

    // With standardization
    const resultStandardized = getLanguageNameOptimized({ standardize: true })
    expect(resultStandardized?.key).toBe('french')
  })

  test('enhanced getBrowserLocalOrigin with standardization', () => {
    ;(global.window as any) = {
      navigator: { languages: ['zh-Hans-CN', 'zh-CN', 'zh', 'en-US'] },
    }

    // Without standardization
    const original = getBrowserLocalOrigin(false)
    expect(original).toEqual(['zh-Hans-CN', 'zh-CN', 'zh', 'en-US'])

    // With standardization (should remove duplicates and standardize)
    const standardized = getBrowserLocalOrigin(true)
    expect(standardized.length).toBeLessThanOrEqual(original.length)
    expect(standardized).toContain('zh')
    expect(standardized).toContain('en')
  })

  test('performance with large language arrays', () => {
    const largeCodes = [
      'unknown-1',
      'unknown-2',
      'unknown-3',
      'unknown-4',
      'unknown-5',
      'zh-Hans-CN-x-test',
      'zh-Hans-CN',
      'zh-Hans',
      'zh-CN',
      'zh',
    ]

    const start = performance.now()
    const result = translateOriginLanguage(largeCodes)
    const end = performance.now()

    expect(result).toBe('chinese')
    expect(end - start).toBeLessThan(10) // Should be very fast
  })
})
