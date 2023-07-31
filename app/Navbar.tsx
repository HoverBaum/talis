import Image from 'next/image'
import Link from 'next/link'
import talisLogo from '../public/talis-dice.png'
import { MenuIcon } from '@/components/icons/MenuIcon'

type NavbarProps = {
  title?: string
  children?: React.ReactNode
}

export const Navbar = ({ title, children }: NavbarProps) => {
  return (
    <div className="navbar bg-base-100 border-b-2">
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
      <div className="flex-none">{children}</div>
    </div>
  )
}
