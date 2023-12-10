import { promises as fs } from 'fs'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Navbar } from '../../components/Navbar'
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

  // Read the two most recent entries from changelog.
  console.log(await fs.readdir(process.cwd()))
  let mdxContent = ''
  try {
    mdxContent = (
      await fs.readFile(
        process.cwd() + '/app/[lang]/changelog/page.mdx',
        'utf8'
      )
    )
      .split('##')
      .slice(0, 3)
      .join('##')
  } catch (e) {
    console.error(e)
  }

  // const componentToString = (component: JSX.Element): string[] => {
  //   if (typeof component === 'string') {
  //     return [component]
  //   }

  //   if (Array.isArray(component)) {
  //     return component.map(componentToString).flat()
  //   }

  //   if (typeof component === 'object') {
  //     if (component.props.children) {
  //       return componentToString(component.props.children)
  //     }
  //   }

  //   return []
  // }

  // const mdxContent = componentToString(changelog({})).join('')

  // console.log(componentToString(changelog({})))

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
