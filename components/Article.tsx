import { Wrapper } from './Wrapper'

export const Article = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <article className="my-8 mx-2 prose lg:prose-lg">{children}</article>
    </Wrapper>
  )
}
