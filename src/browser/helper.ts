export interface MockBrowser {
    navigator: {
        language?: string,
        userLanguage?: any,
        languages?: Array<string>
    }
}