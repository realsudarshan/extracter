import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Shield } from 'lucide-react';
import Header from '@/components/Landing/Header';
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import Hero from '@/components/Landing/Hero';
import Pricing from '@/components/Landing/Pricing';
import Footer from '@/components/Landing/Footer';
import Feature from '@/components/Landing/Feature';
export default function Home() {
  return (
    <>
    <div className='flex flex-row justify-between px-8'>
     <Header/>
     </div>
     <Hero/>
     <Feature/>
     <Pricing/>
     <Footer/>


    </>
  )
}
