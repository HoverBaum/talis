'use client'

import Link from 'next/link'
import { ThemeSelect } from './ThemeSelect'
import { LanguageSelect } from './LanguageSelect'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useDrawer } from '@/components/drawer-context'

export const Drawer = () => {
  const { isOpen, setIsOpen } = useDrawer()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-80 flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">Talis</SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto">
          <nav className="space-y-2">
            <Link 
              href="/" 
              className="block px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Talis - Home
            </Link>
            <Link 
              href="/about" 
              className="block px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/changelog" 
              className="block px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Changelog
            </Link>

            <h2 className="text-lg mt-4 px-2 font-semibold">Rollers</h2>
            <Link 
              href="/dice/shadowrun" 
              className="block px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Shadowrun
            </Link>
            <Link 
              href="/dice/d6" 
              className="block px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              D6 Roller
            </Link>
            <Link 
              href="/dice/daggerheart" 
              className="block px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Daggerheart (beta)
            </Link>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t pt-4 space-y-4">
          <LanguageSelect />
          <ThemeSelect withLabel={true} />
          <div className="text-sm opacity-75">
            Build by{' '}
            <Link
              className="underline"
              target="_blank"
              href="https://hendrikwallbaum.de/"
            >
              Hendrik
            </Link>{' '}
            on{' '}
            <Link
              className="underline"
              target="_blank"
              href="https://github.com/HoverBaum/talis"
            >
              GitHub
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
