'use client'

import Image from 'next/image'
import Link from 'next/link'
import talisLogo from '@/public/talis-dice.png'
import { MenuIcon } from '@/components/icons/MenuIcon'
import { ThemeSelect } from '../app/[lang]/ThemeSelect'
import { Button } from '@/components/ui/button'
import { useDrawer } from '@/components/drawer-context'

type NavbarProps = {
  title?: string
  children?: React.ReactNode
  fixed?: boolean
}

export const Navbar = ({ title, children, fixed }: NavbarProps) => {
  const { toggle } = useDrawer()
  
  return (
    <>
      {fixed && <div className="h-16"></div>}
      <div
        className={`flex items-center justify-between h-16 px-4 border-b bg-background ${fixed && 'fixed top-0 left-0 right-0 z-40'}`}
      >
        <div className="flex items-center flex-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggle}
            className="mr-2"
          >
            <MenuIcon />
          </Button>
          <Link href="/" className="text-xl flex items-center">
            <Image src={talisLogo} width={32} height={32} alt="Talis Logo" />
            <span className="ml-2">Talis</span>
          </Link>
          {title && <span className="text-xl ml-2">| {title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeSelect />
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
