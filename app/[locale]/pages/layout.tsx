export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {children}
    </div>
  )
}
