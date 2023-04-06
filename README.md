# browser-language-auto-detector

[![NPM version](https://img.shields.io/npm/v/browser-language-auto-detector.svg?style=flat)](https://npmjs.org/package/browser-language-auto-detector)
[![NPM downloads](http://img.shields.io/npm/dm/browser-language-auto-detector.svg?style=flat)](https://npmjs.org/package/browser-language-auto-detector)

## Auto-detect language name for browser , turn origin name to language name and more detail
### such as english/chinese/origin translate for the language name, and whether the language is RTL(Right to Left)
### detector using BCP47 collector , and common names

## support TS \ UMD \ CommonJS \ ESModule

## Install

```bash
//use npm
npm i browser-language-auto-detector

//use yarn
yarn add browser-language-auto-detector
```

## Develop

### install
```bash
$ yarn install
```
### run & build
```bash
$ yarn run dev
$ yarn run build
```
### test

```bash
$ yarn test
```

## usage

### get language name

```text
import {getLanguageName} from 'browser-language-auto-detector'
console.log(getLanguageName());

//success
{chinese: '简体中文', origin : '简体中文', rtl: false, key: 'chinese', english: 'Chinese'}
//faild
null

```
### get browser's origin language
```text
import {getBrowserLocalOrigin} from 'browser-language-auto-detector'

//success
['zh-CN', 'zh', 'zh-Hans', 'en', 'und']
    
//faild for empty array
[]
```

### for umd version
```text
Please download form git release:
https://github.com/Itinysun/browser-language-auto-detector/releases
```

## LICENSE

MIT

## BUG report
Please tell us at
https://github.com/Itinysun/browser-language-auto-detector/issues

