import Link from 'next/link'
import { Navbar } from './Navbar'
import { Locale } from 'i18n-config'
import { getDictionary } from './dictionanier'

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <Navbar fixed={true} />
      <main className="p-4 max-w-prose mx-auto">
        <h1 className="text-2xl">{dict.Home.title}</h1>
        <p>{dict.Home.description}</p>
        <div className="mt-4">
          <Link className="link" href="dice/shadowrun">
            Shadowrun
          </Link>
        </div>
      </main>
    </>
  )
}
