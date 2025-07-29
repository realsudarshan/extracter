import SchematicComponent from '@/components/schematic/SchematicComponent'
import React from 'react'

function ManagePlan() {
  return (
    <div>
        <SchematicComponent componentId={process.env.NEXT_PUBLIC_SCHEMATIC_COMPONENT_ID!}/>
    </div>
  )
}

export default ManagePlan