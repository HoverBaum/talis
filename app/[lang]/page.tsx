import * as fs from 'fs'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Navbar } from '../../components/Navbar'
import { Locale } from 'i18n-config'
import { getDictionary } from '../../dictionaries/dictionanier'
import { Wrapper } from '@/components/Wrapper'

// Read the two most recent entries from changelog.
const mdxContent = fs
  .readFileSync('./app/[lang]/changelog/page.mdx', 'utf8')
  .split('##')
  .slice(0, 3)
  .join('##')

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <>
      <Navbar fixed={true} />
      <Wrapper>
        <main className="p-4">
          <h1>{dict.Home.title}</h1>
          <p>{dict.Home.description}</p>
          <div className="mt-4">
            <ul>
              <li className="my-4">
                <Link className="link" href="dice/shadowrun">
                  Shadowrun
                </Link>
              </li>
              <li className="my-4">
                <Link className="link" href="dice/d6">
                  D6 Roller
                </Link>
              </li>
            </ul>
          </div>

          <article className="mt-24">
            <MDXRemote source={mdxContent} />

            <Link className="link block mt-6" href="/changelog">
              Read full Changelog
            </Link>
          </article>
        </main>
      </Wrapper>
    </>
  )
}
