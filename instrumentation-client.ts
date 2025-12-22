// Only load PostHog on the client in production
if (process.env.NODE_ENV === 'production') {
  void (async () => {
    const posthog = (await import('posthog-js')).default
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://eu.posthog.com',
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: false,
    })
  })()
} else {
  console.log('PostHog not initialized due to env not being production.')
}
