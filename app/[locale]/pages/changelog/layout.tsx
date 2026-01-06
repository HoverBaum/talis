export default function ChangelogLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="prose prose-sm md:prose-base">
            {children}
        </div>
    )
}

