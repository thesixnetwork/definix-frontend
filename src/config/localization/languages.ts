export interface Language {
  code: string
  language: string
  locale: string
}

export const EN: Language = { locale: 'en-US', language: 'English', code: 'en' }
export const KO: Language = { locale: 'ko-KR', language: '한국어', code: 'ko' }
export const TH: Language = { locale: 'th-TH', language: 'ภาษาไทย', code: 'th' }
// export const CN: Language = { locale: 'zh-CN', language: '简体中文', code: 'cn' }

export const languages = {
  'en-US': EN,
  'ko-KR': KO,
  'th-TH': TH,
  // 'zh-CN': CN,
}

export const languageList = Object.values(languages)