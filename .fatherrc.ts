import {defineConfig} from 'father';

export default defineConfig({
    esm: {
        input: 'src', // 默认编译目录
        platform: 'browser', // 默认构建为 Browser 环境的产物
        transformer: 'babel', // 默认使用 babel 以提供更好的兼容性
        sourcemap:true
    },
    cjs: {
        input: 'src', // 默认编译目录
        platform: 'node', // 默认构建为 Node.js 环境的产物
        transformer: 'esbuild', // 默认使用 esbuild 以获得更快的构建速度
        sourcemap:true
    },
    umd: {
        name: 'browser-language-auto-detector',
        platform: 'browser', // 默认构建为 Browser 环境的产物
    },
});
