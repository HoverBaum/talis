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
      <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
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
    </div>
  )
}
