import { PropsWithChildren } from "react"

const Page = (props: PropsWithChildren) => {
  return (
    <div className="bg-white p-4 shadow-lg min-h-loose">
      {props.children}
    </div>
  )
}

export default Page