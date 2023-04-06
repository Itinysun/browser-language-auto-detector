import {translateOriginLanguage, getLanguageName, getBrowserLocalOrigin} from '../src'
import {expect, test, describe} from '@jest/globals'
import {bcp47Map} from "../src/browser/bcp47.full";
import {bcp47MapMin} from "../src/browser/bcp47.min";
import {languageNames} from "../src/languageNames";
import {MockBrowser} from "../src/browser/helper";

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
        const wid = {navigator: {language: 'lang'}}
        expect(getBrowserLocalOrigin(wid)).toEqual(['lang'])
    })
    test('get origin lang array by languages', () => {
        const wid = {navigator: {languages: ['lang']}}
        expect(getBrowserLocalOrigin(wid)).toEqual(['lang'])
    })
    test('get origin lang array by ie userLanguage', () => {
        const wid: MockBrowser = {navigator: {userLanguage: 'lang'}}
        expect(getBrowserLocalOrigin(wid)).toEqual(['lang'])
    })
    test('get origin lang array by ie userLanguage', () => {
        const wid: MockBrowser = {navigator: {userLanguage: undefined}}
        expect(getBrowserLocalOrigin(wid)).toEqual([])
    })
    test('get origin lang array by nothing', () => {
        const wid: MockBrowser = {navigator: {}}
        expect(getBrowserLocalOrigin(wid)).toEqual([])
    })

    test('get translated name object', () => {
        const wid = {navigator: {language: 'x'}}
        expect(getLanguageName(wid)).toBeNull()
    })

    test('get translated name object', () => {
        const wid = {navigator: {language: 'en-US'}}
        expect(getLanguageName(wid)).toEqual({
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
