# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个浏览器语言自动检测库，用于检测浏览器语言并转换为多种格式的语言名称（中文、英文、原生名称），同时支持判断是否为RTL（从右到左）语言。

## 开发命令

### 基本命令

- `pnpm install` - 安装依赖
- `pnpm dev` - 启动 Vite 开发服务器
- `pnpm build` - 构建生产版本到 lib 目录
- `pnpm test` - 运行 Jest 测试套件
- `pnpm preview` - 预览构建结果

### 代码质量

- `pnpm lint` - 自动修复 ESLint 问题
- `pnpm lint:check` - 检查代码规范不修复
- `pnpm format` - 格式化代码
- `pnpm format:check` - 检查代码格式

### 发布相关

- `pnpm pre-release` - 发布前预检查脚本
- `pnpm release` - 执行完整发布流程（使用 release-it）
- `pnpm release:dry` - 预览发布流程
- `pnpm verify-release` - 验证发布结果

## 项目架构

### 核心文件结构

- `src/index.ts` - 主入口，导出核心API
- `src/browser/bcp47.full.ts` - 完整的 BCP47 语言代码映射表
- `src/browser/bcp47.min.ts` - 精简的 BCP47 语言代码映射表
- `test/main.test.ts` - 测试文件

### 核心功能

1. `getLanguageName()` - 自动检测浏览器语言并返回语言信息对象
2. `getBrowserLocalOrigin()` - 获取浏览器原生语言代码数组
3. `translateOriginLanguage(names)` - 将语言代码数组转换为语言key
4. `languageNames` Map - 包含100+种语言的详细信息映射

### 构建系统

- 使用 Vite 7 作为构建工具
- 输出格式：ES模块 (`lib/index.js`)、CommonJS (`lib/index.cjs`)
- 自动生成 TypeScript 类型定义文件
- 支持 Source Maps

### 语言数据结构

每种语言包含以下信息：

- `chinese`: 中文名称
- `origin`: 原生语言名称
- `english`: 英文名称
- `rtl`: 是否为从右到左语言
- `key`: 语言标识符

### BCP47 映射系统

使用两级映射系统：

1. `bcp47MapMin` - 精简映射，优先匹配
2. `bcp47Map` - 完整映射，包含所有BCP47代码变体

### 发布流程

使用 release-it 管理版本发布：

- 自动生成 conventional changelog
- 自动创建 GitHub Release
- 支持多种版本升级策略
- 发布前自动运行测试和构建

### 包管理

- 使用 pnpm 作为包管理器
- 支持 Node.js >= 18.0.0
- 输出支持多种模块格式 (ES/CommonJS/TypeScript)
