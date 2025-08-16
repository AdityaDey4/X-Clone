'use client'

import { useClerk } from '@clerk/nextjs'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <div className='flex justify-end'>

    <button className="text-red-600" onClick={() => signOut({ redirectUrl: '/sign-in' })}>Sign out</button>
    </div>
  )
}