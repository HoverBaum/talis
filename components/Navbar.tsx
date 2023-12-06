import Image from 'next/image'
import Link from 'next/link'
import talisLogo from '@/public/talis-dice.png'
import { MenuIcon } from '@/components/icons/MenuIcon'
import { ThemeSelect } from '../app/[lang]/ThemeSelect'

type NavbarProps = {
  title?: string
  children?: React.ReactNode
  fixed?: boolean
}

export const Navbar = ({ title, children, fixed }: NavbarProps) => {
  return (
    <>
      {fixed && <div className="h-16"></div>}
      <div
        className={`navbar bg-base-100 border-b-2 ${fixed && 'fixed top-0'}`}
      >
        <div className="flex-1">
          <label htmlFor="talis-drawer" className="btn btn-ghost btn-square ">
            <MenuIcon />
          </label>
          <Link href="/" className="text-xl flex items-center">
            <Image src={talisLogo} width={32} height={32} alt="Talis Logo" />
            Talis
          </Link>
          {title && <span className="text-xl ml-2">| {title}</span>}
        </div>
        <div className="flex-none">
          <ThemeSelect className="hidden md:block" />
          <div className="flex">{children}</div>
        </div>
      </div>
    </>
  )
}
