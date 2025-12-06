type MainProps = {
  children: React.ReactNode
  props?: React.ComponentProps<'main'>
}

export default function MainContainer({ children, ...props }: MainProps) {
  return (
    <main className="w-100 p-4" {...props}>
      {children}
    </main>
  )
}
