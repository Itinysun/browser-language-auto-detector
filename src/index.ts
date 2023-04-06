import {bcp47Map} from './browser/bcp47.full'
import {bcp47MapMin} from "./browser/bcp47.min";
import {languageNames, LanguageName} from './languageNames'
import {MockBrowser} from "./browser/helper";


/**
 * get first matched language name from browser
 * Returns the translated name of origin name
 * @returns  string | null
 */
export function translateOriginLanguage(names: Array<string>): string | null {
    if (names.length) {
        let ret;
        if (names.some(v => {
            const lang = bcp47MapMin.get(v)
            if (lang !== undefined) {
                ret = lang
                return true
            }
        })) {
            return ret || null
        }
        //append prefix of local item to local
        //like zh-CN would calc zh again
        names.forEach(v => {
            const pos = v.indexOf('-')
            if (pos > -1) {
                const pre = v.substring(0, pos)
                names.indexOf(pre) > -1 || names.push(pre)
            }
        })
        //find first matched language name

        if (names.some(v => {
            const lang = bcp47Map.get(v.toLowerCase())
            if (lang !== undefined) {
                ret = lang
                return true
            }
        })) {
            return ret || null
        }
    }
    return null
}

/**
 * get the origin language code form browser , empty if not found
 * @param wid Window |MockBrowser please don't use this param , it's just for test only
 * @returns Array<string>
 */
export function getBrowserLocalOrigin(wid: Window | MockBrowser = window):Array<string> {
    if (wid.navigator.languages && wid.navigator.languages.length)
        return [...wid.navigator.languages]
    if (wid.navigator.language)
        return [wid.navigator.language]
    try {
        //treat ie 10 and older
        if (Reflect.has(wid.navigator, 'userLanguage')) { // @ts-ignore
            return [wid.navigator["userLanguage"].toString()]
        }
    } catch (e) {
        console.warn('failed to get userLanguage from ie')
    }
    return []
}

/**
 * detect language name from browser
 * Returns the object of LanguageName or null
 * @param wid Window |MockBrowser please don't use this param , it's just for test only
 * @returns  {chinese: String,origin: String,rtl: Boolean,key: String,english: String} | null
 */
export function getLanguageName(wid: Window | MockBrowser = window): LanguageName | null {
    const locals = getBrowserLocalOrigin(wid)
    const name = translateOriginLanguage(locals)
    if (name)
        return languageNames.get(name) || null
    else
        console.warn('Language name not found for browser local value :', locals)
    return null
}
