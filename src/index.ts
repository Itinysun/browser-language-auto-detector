import {bcp47Map} from './browser/bcp47.full'
import {bcp47MapMin} from "./browser/bcp47.min";


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
 * @returns Array<string>
 */
export function getBrowserLocalOrigin(): Array<string> {
    if (window.navigator.languages && window.navigator.languages.length)
        return [...window.navigator.languages]
    if (window.navigator.language)
        return [window.navigator.language]
    try {
        //treat ie 10 and older
        if (Reflect.has(window.navigator, 'userLanguage')) { // @ts-ignore
            return [window.navigator["userLanguage"].toString()]
        }
    } catch (e) {

    }
    return []
}

/**
 * detect language name from browser
 * Returns the object of LanguageName or null
 * @returns  {chinese: String,origin: String,rtl: Boolean,key: String,english: String} | null
 */
export function getLanguageName(): LanguageName | null {
    const locals = getBrowserLocalOrigin()
    const name = translateOriginLanguage(locals)
    if (name)
        return languageNames.get(name) || null
    return null
}

export const languageNames: Map<string, LanguageName> = new Map([
    ['albanian', {chinese: '阿尔巴尼亚语', origin: 'shqiptare', rtl: false, key: 'albanian', english: 'Albanian'}],
    ['arabic', {chinese: '阿拉伯语', origin: 'عربي', rtl: true, key: 'arabic', english: 'Arabic'}],
    ['bangla', {chinese: '孟加拉语', origin: 'বাংলা', rtl: false, key: 'bangla', english: 'Bangla'}],
    ['belarusian', {chinese: '白俄罗斯语', origin: 'беларускі', rtl: false, key: 'belarusian', english: 'Belarusian'}],
    ['bengali', {chinese: '孟加拉语', origin: 'বাংলা', rtl: false, key: 'bengali', english: 'Bengali'}],
    ['bulgarian', {chinese: '保加利亚语', origin: 'български', rtl: false, key: 'bulgarian', english: 'Bulgarian'}],
    ['cambodia', {chinese: '高棉语', origin: 'កម្ពុជា។', rtl: false, key: 'cambodia', english: 'Cambodia'}],
    ['cantonese', {
        chinese: '中文(繁体)',
        origin: '中文(繁體)',
        rtl: false,
        key: 'cantonese',
        english: 'Chinese (Traditional)'
    }],
    ['chinese', {chinese: '简体中文', origin: '简体中文', rtl: false, key: 'chinese', english: 'Chinese Simplified'}],
    ['croatian', {chinese: '克罗地亚语', origin: 'Hrvatski', rtl: false, key: 'croatian', english: 'Croatian'}],
    ['czech', {chinese: '捷克语', origin: 'čeština', rtl: false, key: 'czech', english: 'Czech'}],
    ['danish', {chinese: '丹麦语', origin: 'dansk', rtl: false, key: 'danish', english: 'Danish'}],
    ['dutch', {chinese: '荷兰语', origin: 'Nederlands', rtl: false, key: 'dutch', english: 'Dutch'}],
    ['english', {chinese: '英语', origin: 'English', rtl: false, key: 'english', english: 'English'}],
    ['esperanto', {chinese: '世界语', origin: 'Esperanto', rtl: false, key: 'esperanto', english: 'Esperanto'}],
    ['filipino', {chinese: '菲律宾语', origin: 'Filipino', rtl: false, key: 'filipino', english: 'Filipino'}],
    ['finnish', {chinese: '芬兰语', origin: 'Suomalainen', rtl: false, key: 'finnish', english: 'Finnish'}],
    ['french', {chinese: '法语', origin: 'Français', rtl: false, key: 'french', english: 'French'}],
    ['german', {chinese: '德语', origin: 'Deutsch', rtl: false, key: 'german', english: 'German'}],
    ['greek', {chinese: '希腊语', origin: 'Ελληνικά', rtl: false, key: 'greek', english: 'Greek'}],
    ['hausa', {chinese: '豪萨语', origin: 'Hausa', rtl: false, key: 'hausa', english: 'Hausa'}],
    ['hebrew', {chinese: '希伯来语', origin: 'עִברִית', rtl: true, key: 'hebrew', english: 'Hebrew'}],
    ['hindi', {chinese: '印地语', origin: 'हिंदी', rtl: false, key: 'hindi', english: 'Hindi'}],
    ['hungarian', {chinese: '匈牙利语', origin: 'húngaro', rtl: false, key: 'hungarian', english: 'Hungarian'}],
    ['indonesian', {
        chinese: '印尼语',
        origin: 'bahasa Indonesia',
        rtl: false,
        key: 'indonesian',
        english: 'Indonesian'
    }],
    ['italian', {chinese: '意大利语', origin: 'italiano', rtl: false, key: 'italian', english: 'Italian'}],
    ['japanese', {chinese: '日语', origin: '日本', rtl: false, key: 'japanese', english: 'Japanese'}],
    ['korean', {chinese: '韩语', origin: '한국인', rtl: false, key: 'korean', english: 'Korean'}],
    ['laos', {chinese: '老挝语', origin: 'ພາສາລາວ', rtl: false, key: 'laos', english: 'Laos'}],
    ['malay', {chinese: '马来语', origin: 'Melayu', rtl: false, key: 'malay', english: 'Malay'}],
    ['mongolian', {chinese: '蒙古语', origin: 'Монгол', rtl: false, key: 'mongolian', english: 'Mongolian'}],
    ['myanmar', {chinese: '缅甸语', origin: 'မြန်မာ', rtl: false, key: 'myanmar', english: 'Myanmar'}],
    ['norwegian', {chinese: '挪威语', origin: 'norsk', rtl: false, key: 'norwegian', english: 'Norwegian'}],
    ['nepali', {chinese: '尼泊尔语', origin: 'नेपाली', rtl: false, key: 'nepali', english: 'Nepali'}],
    ['pashto', {chinese: '普什图语', origin: 'پښتو', rtl: true, key: 'pashto', english: 'Pashto'}],
    ['persian', {chinese: '波斯语', origin: 'فارسی', rtl: true, key: 'persian', english: 'Persian'}],
    ['poland', {chinese: '波兰语', origin: 'Polski', rtl: false, key: 'poland', english: 'Poland'}],
    ['portuguese', {chinese: '葡萄牙语', origin: 'Português', rtl: false, key: 'portuguese', english: 'Portuguese'}],
    ['romanian', {chinese: '罗马尼亚语', origin: 'Română', rtl: false, key: 'romanian', english: 'Romanian'}],
    ['russian', {chinese: '俄语', origin: 'Русский', rtl: false, key: 'russian', english: 'Russian'}],
    ['serbian', {chinese: '塞尔维亚语', origin: 'Српски', rtl: false, key: 'serbian', english: 'Serbian'}],
    ['sinhalese', {chinese: '僧伽罗语', origin: 'සිංහල', rtl: false, key: 'sinhalese', english: 'Sinhalese'}],
    ['slovak', {chinese: '斯洛伐克语', origin: 'slovenský', rtl: false, key: 'slovak', english: 'Slovak'}],
    ['spanish', {chinese: '西班牙语', origin: 'español', rtl: false, key: 'spanish', english: 'Spanish'}],
    ['swahili', {chinese: '斯瓦希里语', origin: 'kiswahili', rtl: false, key: 'swahili', english: 'Swahili'}],
    ['swedish', {chinese: '瑞典语', origin: 'svenska', rtl: false, key: 'swedish', english: 'Swedish'}],
    ['tamil', {chinese: '泰米尔语', origin: 'தமிழ்', rtl: false, key: 'tamil', english: 'Tamil'}],
    ['thai', {chinese: '泰语', origin: 'แบบไทย', rtl: false, key: 'thai', english: 'Thai'}],
    ['turkish', {chinese: '土耳其语', origin: 'Türkçe', rtl: false, key: 'turkish', english: 'Turkish'}],
    ['ukrainian', {chinese: '乌克兰语', origin: 'українська', rtl: false, key: 'ukrainian', english: 'Ukrainian'}],
    ['urdu', {chinese: '乌尔都语', origin: 'اردو', rtl: true, key: 'urdu', english: 'Urdu'}],
    ['vietnamese', {chinese: '越南语', origin: 'Tiếng Việt', rtl: false, key: 'vietnamese', english: 'Vietnamese'}],
    
    ['afrikaans',{chinese: '南非荷兰语', origin: 'Afrikaans', rtl: false, key: 'afrikaans', english: 'Afrikaans'}],
    ['amharic',{chinese: '阿姆哈拉语', origin: 'አማርኛ', rtl: false, key: 'amharic', english: 'Amharic'}],
    ['azeri',{chinese: '阿塞拜疆语', origin: 'Azərbaycan', rtl: false, key: 'azeri', english: 'Azeri'}],
    ['bosnian',{chinese: '波斯尼亚语', origin: 'bosanski', rtl: false, key: 'bosnian', english: 'Bosnian'}],
    ['catalan',{chinese: '加泰罗尼亚语', origin: 'Catalana', rtl: false, key: 'catalan', english: 'Catalan'}],
    ['welsh',{chinese: '威尔士语', origin: 'Cymraeg', rtl: false, key: 'welsh', english: 'Welsh'}],
    // ['danish',{chinese: '丹麦语', origin: 'Danish', rtl: false, key: 'Danish', english: 'Danish'}],
    ['estonian',{chinese: '爱沙尼亚语', origin: 'eestlane', rtl: false, key: 'estonian', english: 'Estonian'}],
    ['basque',{chinese: '巴斯克语', origin: 'euskeraz', rtl: false, key: 'basque', english: 'Basque'}],
    // ['finnish',{chinese: '芬兰语', origin: 'Finnish', rtl: false, key: 'Finnish', english: 'Finnish'}],
    ['irish',{chinese: '爱尔兰语', origin: 'Gaeilge', rtl: false, key: 'irish', english: 'Irish'}],
    ['galician',{chinese: '加利西亚语', origin: 'Galega', rtl: false, key: 'galician', english: 'Galician'}],
    ['gujarati',{chinese: '古吉拉特语', origin: 'ગુજરાતી', rtl: false, key: 'gujarati', english: 'Gujarati'}],
    ['armenian',{chinese: '亚美尼亚语', origin: 'հայերեն', rtl: false, key: 'armenian', english: 'Armenian'}],
    ['icelandic',{chinese: '冰岛语', origin: 'íslenskur', rtl: false, key: 'Icelandic', english: 'Icelandic'}],
    ['javanese',{chinese: '爪哇语', origin: 'basa jawa', rtl: false, key: 'javanese', english: 'Javanese'}],
    ['georgian',{chinese: '格鲁吉亚语', origin: 'ქართული', rtl: false, key: 'georgian', english: 'Georgian'}],
    ['kazakh',{chinese: '哈萨克语', origin: 'қазақ', rtl: false, key: 'kazakh', english: 'Kazakh'}],
    // ['khmer',{chinese: '高棉语', origin: 'Khmer', rtl: false, key: 'Khmer', english: 'Khmer'}],
    ['kannada',{chinese: '卡纳达语', origin: 'ಕನ್ನಡ', rtl: false, key: 'Kannada', english: 'Kannada'}],
    // ['lao',{chinese: '老挝语', origin: 'Lao', rtl: false, key: 'lao', english: 'Lao'}],
    ['lithuanian',{chinese: '立陶宛语', origin: 'lietuvių', rtl: false, key: 'lithuanian', english: 'Lithuanian'}],
    ['latvian',{chinese: '拉脱维亚语', origin: 'Latvian', rtl: false, key: 'Latvian', english: 'Latvian'}],
    ['macedonian',{chinese: '马其顿语', origin: 'македонски', rtl: false, key: 'macedonian', english: 'Macedonian'}],
    ['marathi',{chinese: '马拉地语', origin: 'मराठी', rtl: false, key: 'marathi', english: 'Marathi'}],
    ['maltese',{chinese: '马耳他语', origin: 'Malti', rtl: false, key: 'maltese', english: 'Maltese'}],
    // ['norwegian',{chinese: '挪威语', origin: 'Norwegian', rtl: false, key: 'Norwegian', english: 'Norwegian'}],
    // ['dutch',{chinese: '荷兰语', origin: 'Dutch', rtl: false, key: 'Dutch', english: 'Dutch'}],
    ['punjabi',{chinese: '旁遮普语', origin: 'ਪੰਜਾਬੀ', rtl: false, key: 'punjabi', english: 'Punjabi'}],
    ['slovak',{chinese: '斯洛伐克语', origin: 'Slovenčina', rtl: false, key: 'slovak', english: 'Slovak'}],
    ['slovenian',{chinese: '斯洛文尼亚语', origin: 'Slovenščina', rtl: false, key: 'slovenian', english: 'Slovenian'}],
    ['somali',{chinese: '索马里语', origin: 'Soomaali', rtl: false, key: 'somali', english: 'Somali'}],
    ['swedish',{chinese: '瑞典语', origin: 'Svenskt', rtl: false, key: 'swedish', english: 'Swedish'}],
    ['telugu',{chinese: '泰卢固语', origin: 'తెలుగు', rtl: false, key: 'telugu', english: 'Telugu'}],
    ['uzbek',{chinese: '乌兹别克语', origin: 'o\'zbek', rtl: false, key: 'uzbek', english: 'Uzbek'}],
    ['zulu',{chinese: '祖鲁语', origin: 'Zulu', rtl: false, key: 'zulu', english: 'Zulu'}],
    ['sundanese',{chinese: '巽他语', origin: 'Basa Sunda', rtl: false, key: 'sundanese', english: 'Sundanese'}],

])

export interface LanguageName {  
    
    chinese: String,
    origin: String,
    rtl: Boolean,
    key: String,
    english: String
}

