import { Metadata } from 'next'
import { SetPageTitle } from '@/components/PageTitleProvider'
import AboutEN from './about.en.mdx'
import AboutDE from './about.de.mdx'

export const metadata: Metadata = {
  title: 'About - Talis',
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const AboutContent = locale === 'de' ? AboutDE : AboutEN
  
  return (
    <>
      <SetPageTitle title={locale === 'de' ? 'Über' : 'About'} />
      <AboutContent />
    </>
  )
}
