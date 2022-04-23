import '../styles/StartingPage.css'
import Button from 'react-bootstrap/Button'
import React from 'react'


export default function StartingPage({workflowStatus, startVotersRegistration, accounts, Owner}){
    
    if((workflowStatus == -1) && (accounts[0] == Owner)){
        return(
            <div className='dv-starting-page-container'>
                <Button onClick={startVotersRegistration} variant='primary' size='lg'>Commencer une nouvelle éléction</Button>
            </div>
        )
    } else return null
}