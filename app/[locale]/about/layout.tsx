import { Card, CardContent } from '@/components/ui/card'

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Card>
        <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

