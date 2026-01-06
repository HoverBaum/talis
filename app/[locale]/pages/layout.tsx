export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="prose prose-sm md:prose-base p-4 md:p-8 max-w-3xl mx-auto">
      {children}
    </div>
  )
}
