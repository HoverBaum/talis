import { Navbar } from '@/app/Navbar'
import { ShadowrunConfig } from './ShadowrunConfig'

export default function ShadowrunConfigPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun Config" />
      <main className="flex-grow basis-0 p-2 md:p-4">
        <ShadowrunConfig />
      </main>
    </div>
  )
}
