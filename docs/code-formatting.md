# 代码格式化配置说明

## 概述

项目使用 Prettier 进行代码格式化，配合 ESLint 进行代码质量检查，确保代码风格的一致性和质量。

## 工具配置

### Prettier 配置

`.prettierrc.json` 配置：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 80,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### ESLint 配置

`eslint.config.js` 配置：

- 使用 TypeScript ESLint 规则
- 集成 Prettier 规则
- 针对不同文件类型设置不同规则
- 支持浏览器和 Node.js 环境

## 可用命令

### 格式化代码

```bash
pnpm format
```

使用 Prettier 格式化所有代码文件

### 检查格式

```bash
pnpm format:check
```

检查代码格式是否符合 Prettier 规则

### 代码检查

```bash
pnpm lint
```

运行 ESLint 检查并自动修复可修复的问题

### 检查代码质量

```bash
pnpm lint:check
```

运行 ESLint 检查，不进行自动修复

## VSCode 配置

### 设置文件

`.vscode/settings.json`：

- 保存时自动格式化
- 使用 Prettier 作为默认格式化工具
- 保存时自动运行 ESLint 修复

### 推荐插件

`.vscode/extensions.json`：

- Prettier - Code formatter
- ESLint
- TypeScript

## 代码风格规范

### 基本规范

- 使用 2 空格缩进
- 使用单引号
- 不使用分号
- 行宽限制 80 字符
- 使用 ES5 尾随逗号

### TypeScript 规范

- 禁止使用 any 类型（警告）
- 未使用变量报错
- 使用 `@ts-expect-error` 而非 `@ts-ignore`
- 优先使用原始类型而非包装类型

### 环境特定规则

#### 源代码 (src/)

- 支持浏览器全局变量 (window, document, navigator)
- 严格的 TypeScript 规则

#### 测试代码 (test/)

- 支持 Jest 和 Node.js 全局变量
- 放宽 any 类型限制

#### 配置文件

- 支持 Node.js 全局变量 (\_\_dirname)
- 基础格式化规则

## 集成到开发流程

### 预提交钩子

建议配置 Git 预提交钩子：

```bash
# 在提交前运行格式化和检查
pnpm format && pnpm lint:check
```

### CI/CD 集成

在 CI 流程中添加格式化检查：

```bash
pnpm format:check
pnpm lint:check
```

## 忽略文件

### .prettierignore

忽略以下文件和目录：

- node_modules
- dist
- coverage
- 日志文件
- 临时文件

### ESLint 忽略

在配置中忽略：

- dist/
- node_modules/
- 配置文件（根据需要）

## 最佳实践

1. **保存时格式化**：配置编辑器保存时自动格式化
2. **提交前检查**：提交代码前运行格式化和检查
3. **团队一致性**：确保团队成员使用相同配置
4. **渐进式修复**：对现有代码逐步应用格式化规则
