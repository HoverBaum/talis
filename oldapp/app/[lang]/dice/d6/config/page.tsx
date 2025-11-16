import Link from 'next/link'
import { CloseIcon } from '@/components/icons/CloseIcon'
import { Locale } from 'i18n-config'
import { getDictionary } from 'dictionaries/dictionanier'
import { D6Config } from './D6Config'
import { Wrapper } from '@/components/Wrapper'
import { Button } from '@/components/ui/button'

export default async function ShadowrunConfigPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b">
        <Link href="/dice/d6">
          <Button variant="ghost" size="icon">
            <CloseIcon />
          </Button>
        </Link>
        <h2 className="text-lg font-semibold">D6 Config</h2>
      </div>
      <main className="flex-grow p-2 md:p-4 overflow-auto">
        <Wrapper>
          <div className="mt-4">
            <D6Config dict={dict.Roller.D6.Config} />
          </div>
        </Wrapper>
      </main>
    </div>
  )
}
