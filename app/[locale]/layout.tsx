import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { i18n } from '@/i18n/config'
import { ProvidersWrapper } from '@/components/providers-wrapper'

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!i18n.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return <ProvidersWrapper messages={messages} locale={locale}>{children}</ProvidersWrapper>
}

