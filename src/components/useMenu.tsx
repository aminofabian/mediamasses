// UserMenu.tsx
'use client'

import { useSession } from 'next-auth/react'
import UserMenuButton from './NavBar/UserMenuButton'

export default function UserMenu() {
  const { data: session } = useSession()
  return <UserMenuButton session={session} />
}