import {
  translateOriginLanguage,
  getLanguageName,
  getLanguageNameOptimized,
} from '../lib/index.js'

// Mock browser environment
global.window = {
  navigator: {
    languages: ['zh-Hans-CN', 'zh-CN', 'zh', 'en-US', 'en'],
    language: 'zh-Hans-CN',
  },
}

console.log('🚀 Performance Benchmark\n')

// Test data
const testCases = [
  ['zh-Hans-CN'],
  ['en-US'],
  ['fr-CA'],
  ['zh-Hans-CN', 'en-US'],
  ['unknown-XX', 'zh-CN', 'en'],
  ['de-DE', 'fr-FR', 'es-ES', 'it-IT', 'pt-BR'],
  ['zh-Hans-CN-x-test', 'zh-Hans-CN', 'zh-Hans', 'zh-CN', 'zh'],
]

function benchmark(name, fn, iterations = 10000) {
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    const testCase = testCases[i % testCases.length]
    fn(testCase)
  }

  const end = performance.now()
  const duration = end - start
  const avgTime = duration / iterations

  console.log(`${name}:`)
  console.log(`  Total time: ${duration.toFixed(2)}ms`)
  console.log(`  Average time: ${avgTime.toFixed(4)}ms`)
  console.log(`  Operations/sec: ${(1000 / avgTime).toFixed(0)}`)
  console.log()
}

// Run benchmarks
benchmark('translateOriginLanguage (optimized)', translateOriginLanguage)

benchmark('getLanguageName (original)', getLanguageName)

benchmark('getLanguageNameOptimized (cached)', () => getLanguageNameOptimized())

benchmark('getLanguageNameOptimized (uncached)', () =>
  getLanguageNameOptimized({ useCache: false })
)

benchmark('getLanguageNameOptimized (standardized)', () =>
  getLanguageNameOptimized({ standardize: true })
)

console.log('✅ Benchmark completed!')
