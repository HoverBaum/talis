import React from 'react'

interface WrapperProps {
  children: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="max-w-[40rem] mx-auto">{children}</div>
}
