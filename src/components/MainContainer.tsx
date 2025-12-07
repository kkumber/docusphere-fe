type MainProps = {
  children: React.ReactNode
  props?: React.ComponentProps<'main'>
}

export default function MainContainer({ children, ...props }: MainProps) {
  return (
    <main className="w-full p-4" {...props}>
      {children}
    </main>
  )
}
