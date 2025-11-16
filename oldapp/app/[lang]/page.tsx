import { promises as fs } from 'fs'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Locale } from 'i18n-config'
import { getDictionary } from '../../dictionaries/dictionanier'
import { Wrapper } from '@/components/Wrapper'
import changelog from './changelog/page.mdx'

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  // Prep Changelog for rendering.
  // We need to do this via an import and logic for it to work on prod.
  const CHANGELOG_ITEMS_TO_SHOW = 2
  const changelogEntries = changelog({}).props.children
  const h2Indexes = changelogEntries.reduce(
    (acc: number[], curr: JSX.Element, index: number) => {
      if (curr.type === 'h2') {
        acc.push(index)
      }
      return acc
    },
    [] as number[]
  )
  const Changelog = changelogEntries.slice(
    0,
    h2Indexes[CHANGELOG_ITEMS_TO_SHOW]
  )

  return (
    <div className="h-full overflow-y-auto">
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
              <li className="my-4">
                <Link className="link" href="dice/daggerheart">
                  Daggerheart (beta)
                </Link>
              </li>
            </ul>
          </div>

          <article className="mt-24">
            {Changelog}

            <Link className="link block mt-6" href="/changelog">
              Read full Changelog
            </Link>
          </article>
        </main>
      </Wrapper>
    </div>
  )
}
