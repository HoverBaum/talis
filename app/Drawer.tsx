'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const Drawer = () => {
  const pathname = usePathname()

  useEffect(() => {
    const checkbox = document.getElementById('talis-drawer') as HTMLInputElement
    if (checkbox) {
      checkbox.checked = false
    }
  }, [pathname])

  return (
    <div className="drawer-side">
      <label htmlFor="talis-drawer" className="drawer-overlay"></label>
      <div className="menu p-4 w-80 h-full bg-base-200 text-base-content flex flex-col">
        {/* Sidebar content here */}
        <ul className="flex-grow">
          <h1 className="text-2xl mb-4">Talis</h1>
          <li className="mb-2">
            <Link href="/">Talis - Home</Link>
          </li>
          <li className="mb-2">
            <Link href="/tipps">Tipps</Link>
          </li>

          <h2 className="text-lg mt-4">Rollers</h2>
          <li className="mb-2">
            <Link href="/dice/shadowrun">Shadowrun</Link>
          </li>
        </ul>

        {/* Bottom section */}
        <div>
          <span className="opacity-75">
            Build by{' '}
            <Link
              className="link"
              target="_blank"
              href="https://hendrikwallbaum.de/"
            >
              Hendrik
            </Link>{' '}
            on{' '}
            <Link
              className="link"
              target="_blank"
              href="https://github.com/HoverBaum/talis"
            >
              GitHub
            </Link>{' '}
            -{' '}
            <Link
              className="link"
              target="_blank"
              href="https://discord.gg/KYdHnpDeyw"
            >
              Join Discord
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
