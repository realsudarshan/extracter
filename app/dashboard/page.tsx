import CustomDropzone from '@/components/comp-548'
import ReciptList from '@/components/Dashboard/ReciptList'
import React from 'react'

function Dashboard() {
  return (
    <>
    
    <CustomDropzone landingpage={false} dashboard={true} />
    <ReciptList/>
    </>
  )
}

export default Dashboard