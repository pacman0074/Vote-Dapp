import React from "react";
import Button from "react-bootstrap/esm/Button";

export default function RegistrationProposalsOwnerPage({workflowStatus, Owner, accounts, EndProposalsRegistration, StartVoting}){

    if((workflowStatus == 1 || workflowStatus == 2) && Owner == accounts[0] ){
        return (
            <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'space-evenly', marginTop : '100px'}}>
                <Button variant="danger" onClick={EndProposalsRegistration}>Fin de l'enregistrement des propositions</Button>
                <Button  variant="primary" onClick={StartVoting}>Démarrer le vote</Button>
            </div>
        )
    } else return null
}