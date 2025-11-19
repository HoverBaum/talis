export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto prose prose-sm md:prose-base dark:prose-invert ">
      {children}
    </div>
  )
}
