import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { Shield } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';
import Hero from '@/components/Landing/Hero';
import Pricing from '@/components/Landing/Pricing';
import Footer from '@/components/Landing/Footer';
import Feature from '@/components/Landing/Feature';
import PricingSection from '@/components/Landing/PricingSwitch';
export default function Home() {
  return (
    <>

      <Hero />
      <Feature />
      <PricingSection />
      <Footer />


    </>
  )
}
