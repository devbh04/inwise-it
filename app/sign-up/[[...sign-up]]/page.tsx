import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            cardBox: "shadow-xl",
          },
        }}
      />
    </div>
  )
}
