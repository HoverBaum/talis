import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold">You&apos;re Offline</h1>
        <p className="text-muted-foreground">
          It looks like you&apos;re not connected to the internet. Don&apos;t worry, Talis works
          offline! You can still use all the dice rollers you&apos;ve already visited.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            To access new pages or features, please check your internet connection and try again.
          </p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

