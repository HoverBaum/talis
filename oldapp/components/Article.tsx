import { Wrapper } from './Wrapper'

export const Article = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full overflow-y-auto">
      <Wrapper>
        <article className="my-8 mx-2">{children}</article>
      </Wrapper>
    </div>
  )
}
