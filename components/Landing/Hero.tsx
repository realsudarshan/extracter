"use client"
import Image from 'next/image'
import React from 'react'
import  Dropzone  from '../comp-548'
import { SignedOut } from '@clerk/nextjs'
import { useUser, SignUp } from "@clerk/nextjs";
import CustomDropzone from '../comp-548'


function Hero() {
  const { isSignedIn, isLoaded } = useUser();

  return (
 <div className='flex flex-col md:flex-row '>
  <div className='flex w-full flex-col items-center'>
    <h1 className='font-bold text-8xl  '>
      Extractor
    </h1>
    <h3 className=''>Intelligent Receipt Scanning</h3>
    <div>
   {isSignedIn?<CustomDropzone landingpage={false}/>:<CustomDropzone landingpage={true}/>}
    
      </div>
  </div>
  <div className='w-full'>
    <Image src="/extract.svg" alt='Extracted image' width={500} height={800} className='mx-auto'/>

  </div>
 </div>
  )
}

export default Hero