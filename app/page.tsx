import Link from 'next/link'
import { Navbar } from './Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-4 max-w-prose mx-auto">
        <h1 className="text-2xl">Dice Roller</h1>
        <p>Choose a Dice Roller from the list below.</p>
        <div className="mt-4">
          <Link className="link" href="/dice/shadowrun">
            Shadowrun
          </Link>
        </div>
      </main>
    </>
  )
}
