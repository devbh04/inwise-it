import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <SignIn
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
