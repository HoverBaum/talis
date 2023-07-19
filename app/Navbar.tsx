import Link from 'next/link'

type NavbarProps = {
  title?: string
}

export const Navbar = ({ title }: NavbarProps) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1 ml-2">
        <Link href="/" className="text-xl">
          Talis
        </Link>
        {title && <span className="text-xl ml-2">| {title}</span>}
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}
