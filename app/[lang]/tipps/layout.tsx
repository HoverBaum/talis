import { Article } from '@/components/Article'
import { Navbar } from '@/components/Navbar'

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <>
      <Navbar title="Changelog" fixed />
      <Article>{children}</Article>
    </>
  )
}
