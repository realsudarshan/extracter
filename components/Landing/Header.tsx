import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (<>
  
    <div >
      <Link href="/" className='flex justify-center items-center'>
        <Shield className='w-6 h-6 text-black mr-6 bg-red' />
        <h1 className='text-xl font-semibold '>Extractor</h1>
        </Link>
    </div>
           <div>
      <SignedIn>
<SignOutButton/>
<UserButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'/>
      </SignedOut>
     </div>
     </>
  )
}

export default Header