import {translateOriginLanguage, getLanguageName, getBrowserLocalOrigin,languageNames} from '../src'
import {expect, test, describe} from '@jest/globals'
import {bcp47Map} from "../src/browser/bcp47.full";
import {bcp47MapMin} from "../src/browser/bcp47.min";

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
        (global.window as any)={navigator: {language: 'lang'}}
        expect(getBrowserLocalOrigin()).toEqual(['lang'])
    })
    test('get origin lang array by languages', () => {
        (global.window as any) = {navigator: {languages: ['lang']}}
        expect(getBrowserLocalOrigin()).toEqual(['lang'])
    })
    test('get origin lang array by ie userLanguage', () => {
        (global.window as any) = {navigator: {userLanguage: 'lang'}}
        expect(getBrowserLocalOrigin()).toEqual(['lang'])
    })
    test('get origin lang array by ie userLanguage', () => {
        (global.window as any) = {navigator: {userLanguage: undefined}}
        expect(getBrowserLocalOrigin()).toEqual([])
    })
    test('get origin lang array by nothing', () => {
        (global.window as any) = {navigator: {}}
        expect(getBrowserLocalOrigin())
    })

    test('get translated name object', () => {
        (global.window as any)  = {navigator: {language: 'x'}}
        expect(getLanguageName()).toBeNull()
    })

    test('get translated name object', () => {
        (global.window as any)  = {navigator: {language: 'en-US'}}
        expect(getLanguageName()).toEqual({
            chinese: '英语',
            origin: 'English',
            rtl: false,
            key: 'english',
            english: 'English'
        })
    })
})


const checkBcp47Min = (): Array<string> => {
    const missLanguage: Array<string> = []
    bcp47MapMin.forEach(v => {
        if (languageNames.get(v) == undefined)
            missLanguage.push(v)
    })
    return missLanguage
}
const checkBcp47Full = (): Array<string> => {
    const missLanguage: Array<string> = []
    bcp47Map.forEach(v => {
        if (languageNames.get(v) == undefined)
            missLanguage.push(v)
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
