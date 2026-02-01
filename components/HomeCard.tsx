import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'

interface HomeCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
}

export function HomeCard({ href, icon: Icon, title, description }: HomeCardProps) {
  return (
    <Link
      href={href}
      className="transition-transform hover:scale-105 active:scale-95"
    >
      <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
