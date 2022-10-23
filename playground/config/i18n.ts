export const languages = ['en', 'de', 'fr'] as const

export type Language = typeof languages[number]

export const English: Language = 'en'
