import UserProfile from '@/components/UserProfile'

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
          <UserProfile />
      </div>
    </div>
  )
}
