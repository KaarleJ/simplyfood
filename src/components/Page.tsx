import { PropsWithChildren } from "react"

interface PageProps extends PropsWithChildren {
  className?: string
}

const Page = ({ className, children}: PageProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default Page