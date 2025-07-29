import React from 'react'
import { getTemporaryAccessToken } from '@/app/actions/getTemporaryAcessToken'
import SchematicEmbed from './SchematicEmbed';

async function SchematicComponent({componentId}:{componentId:string}) {
    if(!componentId){
        return null
    }
    const accessToken=await getTemporaryAccessToken();
    
    if(!accessToken){
        throw new Error("No acess token")
    }
  
  
  
    return (
<SchematicEmbed accessToken={accessToken} componentId={componentId}/>
  )
}

export default SchematicComponent