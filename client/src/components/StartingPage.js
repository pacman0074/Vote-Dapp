import '../styles/StartingPage.css'
import Button from 'react-bootstrap/Button'
import React from 'react'


export default function StartingPage({workflowStatus,startVotersRegistration}){

    if(workflowStatus == -1){
        return(
            <div className='dv-starting-page-container'>
                <Button onClick={startVotersRegistration} variant='primary' size='lg'>Commencer une nouvelle éléction</Button>
            </div>
        )
    } else return null
}