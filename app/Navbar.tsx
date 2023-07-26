import Link from 'next/link'

type NavbarProps = {
  title?: string
  children?: React.ReactNode
}

export const Navbar = ({ title, children }: NavbarProps) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 ml-2">
        <Link href="/" className="text-xl">
          Talis
        </Link>
        {title && <span className="text-xl ml-2">| {title}</span>}
      </div>
      <div className="flex-none">{children}</div>
    </div>
  )
}
