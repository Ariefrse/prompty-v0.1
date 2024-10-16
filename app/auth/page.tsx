import Auth from '@/components/Auth'

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login / Sign Up</h1>
        <Auth />
      </div>
    </div>
  )
}
