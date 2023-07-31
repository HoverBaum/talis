import Link from 'next/link'
import { Navbar } from '../Navbar'

export default function About() {
  return (
    <div>
      <Navbar title="About" />
      <div className="prose lg:prose-lg p-4 mx-auto">
        <h1>About</h1>
        <p>
          Talis is a dice rolling app developed to support multiple games or
          configurations of dice. It currently supports Shadowrun.
        </p>
        <p>
          It's a hobby project of mine. You can find it OpenSource on{' '}
          <Link
            className="link"
            target="_blank"
            href="https://github.com/HoverBaum/talis"
          >
            GitHub
          </Link>
          . I started this as a side project to relax, let's see where it will
          go.
        </p>
        <p>
          Feel free to{' '}
          <Link
            className="link"
            target="_blank"
            href="https://discord.gg/KYdHnpDeyw"
          >
            join our Discord
          </Link>{' '}
          to reach out.
        </p>
      </div>
    </div>
  )
}
