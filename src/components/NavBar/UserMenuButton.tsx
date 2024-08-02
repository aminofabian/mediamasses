
import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

interface UserMenuButtonProps {
  session: Session | null
}

export default function UserMenuButton({ session }: UserMenuButtonProps) {
  const user = session?.user
  
  return (
    <div className="flex items-center gap-4">
    {user ? (
      <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
      <Image
      src={user.image ?? "/profile-pic-placeholder.png"}
      width={40}
      height={40}
      alt="Profile picture"
      className="rounded-full"
      />
      </div>
      </label>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
      <li>
      <a className="justify-between">
      Profile
      <span className="badge">New</span>
      </a>
      </li>
      <li><a>Settings</a></li>
      <li><button onClick={()=>signOut({callbackUrl: '/'})}>Logout</button></li>
      </ul>
      </div>
    ) : (
      <>
      <button onClick={()=>signIn('google', { callbackUrl: 'http://localhost:3000/dashboard' })} className="btn btn-circle p-2 text-purple-700 bg-purple-100">Log in</button>
      {/* <Link href="/signup" className="btn btn-circle text-purple-700 bg-purple-100">Sign up</Link> */}
      </>
    )}
    </div>
  )
}