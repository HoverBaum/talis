import { Navbar } from '@/app/Navbar'
import { ShadowrunConfig } from './ShadowrunConfig'
import Link from 'next/link'

export default function ShadowrunConfigPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun Config">
        <Link href="/dice/shadowrun">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Link>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <ShadowrunConfig />
      </main>
    </div>
  )
}
