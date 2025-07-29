# Vite 7 构建配置说明

## 概述

项目已从 `father` 迁移至 `Vite 7` 进行构建管理，提供更快的构建速度和更好的开发体验。

## 构建配置

### vite.config.ts

主要配置包括：

- **Library Mode**: 配置为库模式，生成多种格式的输出
- **TypeScript 支持**: 使用 `vite-plugin-dts` 生成类型定义文件
- **多格式输出**: 支持 ES、CJS、UMD 三种格式
- **Source Maps**: 生成源码映射文件

### 输出文件

构建后会在 `dist` 目录生成以下文件：

```
dist/
├── browser-language-auto-detector.es.js     # ES 模块
├── browser-language-auto-detector.cjs.js    # CommonJS 模块
├── browser-language-auto-detector.umd.js    # UMD 模块
├── index.d.ts                              # TypeScript 类型定义
└── *.map                                   # Source Maps
```

## Package.json 配置

### 模块入口

```json
{
  "main": "dist/browser-language-auto-detector.cjs.js",
  "module": "dist/browser-language-auto-detector.es.js",
  "types": "dist/index.d.ts",
  "browser": "dist/browser-language-auto-detector.umd.js"
}
```

### Exports 字段

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/browser-language-auto-detector.es.js",
      "require": "./dist/browser-language-auto-detector.cjs.js"
    }
  }
}
```

## 可用命令

### 开发模式

```bash
pnpm dev
```

启动 Vite 开发服务器

### 构建

```bash
pnpm build
```

构建生产版本

### 预览

```bash
pnpm preview
```

预览构建结果

## 技术栈

- **Vite 7**: 构建工具
- **TypeScript**: 类型支持
- **vite-plugin-dts**: 类型定义生成
- **@rollup/plugin-typescript**: TypeScript 编译支持

## 构建特性

- ✅ 快速构建速度
- ✅ 多格式输出支持
- ✅ 自动类型定义生成
- ✅ Source Maps 支持
- ✅ Tree-shaking 优化
- ✅ 外部依赖处理
- ✅ 开发时热更新
