import en from '../../l10n/en.json'
import zhCN from '../../l10n/zh-CN.json'
import zhTW from '../../l10n/zh-TW.json'

export type Messages = typeof en

const messagesByLocale: Record<string, Messages> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
}

export function resolveMessages(locale?: string): Messages {
  if (!locale) {
    return en
  }

  return messagesByLocale[locale] ?? messagesByLocale[locale.split('-')[0]] ?? en
}
