import { Navbar } from '@/app/Navbar'
import { D6Roller } from './D6Roller'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun" />
      <main className="flex-grow basis-0 p-2 md:p-4">
        <D6Roller />
      </main>
    </div>
  )
}
