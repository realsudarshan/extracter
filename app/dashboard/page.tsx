"use client"

import CustomDropzone from '@/components/comp-548'
import ReciptList from '@/components/Dashboard/ReciptList'
import CreditDisplay from '@/components/Dashboard/CreditDisplay'
import React from 'react'

function Dashboard() {

  return (
    <>
      <CreditDisplay />
      <CustomDropzone landingpage={false} dashboard={true} />
      <ReciptList />
    </>
  )
}

export default Dashboard