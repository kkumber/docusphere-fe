type MainProps = {
  children: React.ReactNode
  props?: React.ComponentProps<'main'>
}

export default function MainContainer({ children, ...props }: MainProps) {
  return (
    <div className="p-4 flex-1 min-w-0 overflow-x-hidden" {...props}>
      {children}
    </div>
  )
}
