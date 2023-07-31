import Image from 'next/image'
import Link from 'next/link'
import talisLogo from '../public/talis-dice.png'

type NavbarProps = {
  title?: string
  children?: React.ReactNode
}

export const Navbar = ({ title, children }: NavbarProps) => {
  return (
    <div className="navbar bg-base-100 border-b-2">
      <div className="flex-1">
        <label htmlFor="talis-drawer" className="btn btn-ghost btn-square ">
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
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
