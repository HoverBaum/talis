import { Navbar } from '@/components/Navbar'
import Link from 'next/link'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { Locale } from 'i18n-config'
import { getDictionary } from 'dictionaries/dictionanier'
import { D6Config } from './D6Config'
import { Wrapper } from '@/components/Wrapper'

export default async function ShadowrunConfigPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="D6 Config" fixed={true}>
        <Link href="/dice/d6">
          <button className="btn btn-square btn-ghost">
            <CloseIcon />
          </button>
        </Link>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <Wrapper>
          <h1>D6 Config</h1>
          <div className="mt-4">
            <D6Config dict={dict.Roller.D6.Config} />
          </div>
        </Wrapper>
      </main>
    </div>
  )
}
