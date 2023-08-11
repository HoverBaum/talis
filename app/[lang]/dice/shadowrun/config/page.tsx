import { Navbar } from '@/app/Navbar'
import { ShadowrunConfig } from './ShadowrunConfig'
import Link from 'next/link'
import { CloseIcon } from '@/components/icons/CloseIcon'

export default function ShadowrunConfigPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun Config" fixed={true}>
        <Link href="/dice/shadowrun">
          <button className="btn btn-square btn-ghost">
            <CloseIcon />
          </button>
        </Link>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <ShadowrunConfig />
      </main>
    </div>
  )
}
