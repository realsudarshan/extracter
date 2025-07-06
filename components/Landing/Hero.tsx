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
 <div className='flex flex-col md:flex-row w-full max-w-screen overflow-x-hidden'>
  <div className='flex w-full flex-col items-center px-2 sm:px-4'>
    <h1 className='font-bold text-4xl sm:text-6xl md:text-8xl text-center break-words w-full'>
      Extractor
    </h1>
    <h3 className='text-base sm:text-lg md:text-xl text-center w-full'>Intelligent Receipt Scanning</h3>
    <div className='w-full flex justify-center'>
   {isSignedIn?<CustomDropzone landingpage={false}/>:<CustomDropzone landingpage={true}/>}  
      </div>
  </div>
  <div className='w-full flex justify-center items-center mt-4 md:mt-0'>
    <Image src="/extract.svg" alt='Extracted image' width={300} height={480} className='mx-auto max-w-full h-auto'/>
  </div>
 </div>
  )
}

export default Hero