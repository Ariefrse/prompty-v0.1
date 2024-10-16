import SignUp from '@/components/SignUp'

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <SignUp />
      </div>
    </div>
  )
}
