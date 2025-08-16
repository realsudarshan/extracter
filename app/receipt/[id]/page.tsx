"use client"
import { useParams } from 'next/navigation'
import React from 'react'

function Receipt() {
    const params=useParams<{id:string}>()
  return (
    <div>Receipt:{params.id}</div>
    //reciept name
    //reciept file detail ,view pdf
    //reciept extracted data
    //reciept summary
    //download,delete button
  )
}

export default Receipt
