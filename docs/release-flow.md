# Release-It 发布流程说明

## 概述

项目已从 `np` 迁移至 `release-it` 进行版本发布管理，提供更加灵活和可配置的发布流程。

## 配置文件

### .release-it.json

主配置文件包含以下核心配置：

- **Git 配置**: 自动创建标签和提交
- **NPM 发布**: 自动发布到 npm registry
- **GitHub 发布**: 自动创建 GitHub Release
- **Hooks**: 构建前预检查和构建
- **Conventional Changelog**: 自动生成变更日志

## 可用命令

### 正式发布

```bash
pnpm release
```

执行完整的发布流程，包括版本升级、构建、发布到 npm 和创建 GitHub Release。

### 预览模式

```bash
pnpm release:dry
```

以干运行模式执行，预览发布流程但不实际执行发布操作。

## 发布流程

1. **预检查**: 执行 `pnpm test` 检查项目状态
2. **版本升级**: 根据提交类型自动确定版本号
3. **变更日志**: 基于 conventional commits 自动生成
4. **构建**: 执行 `pnpm build` 使用 Vite 构建项目
5. **发布**: 发布到 npm registry
6. **标签创建**: 创建 git 标签并推送
7. **GitHub Release**: 创建 GitHub Release

## 注意事项

- 确保工作目录干净（没有未提交的更改）
- 需要在 `master` 分支执行发布
- GitHub Release 需要设置 `GITHUB_TOKEN` 环境变量
- 提交信息建议遵循 conventional commits 规范

## 环境变量

```bash
export GITHUB_TOKEN=your_github_token
```

## 升级内容

- ✅ 移除了 `np` 依赖
- ✅ 添加了 `release-it` 和 `@release-it/conventional-changelog`
- ✅ 新增了配置驱动的发布流程
- ✅ 支持自动生成变更日志
- ✅ 集成了 GitHub Release 自动创建
- ✅ 迁移到 pnpm 包管理器
- ✅ 升级了开发依赖到最新版本
- ✅ 添加了 engines 字段和 .npmrc 配置
- ✅ 移除了 father 构建工具，改用 Vite 7
- ✅ 配置了多格式输出：ES、CJS、UMD
- ✅ 优化了 TypeScript 配置和类型定义生成
