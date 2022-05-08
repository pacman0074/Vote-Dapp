import React from "react";
import Button from "react-bootstrap/esm/Button";

export default function AdministrationWorkflow({workflowStatus, Owner, accounts, EndProposalsRegistration, StartVoting, EndVoting, countVotes}){

    if((workflowStatus == 1 || workflowStatus == 2 || workflowStatus == 3 || workflowStatus == 4) && Owner == accounts[0] ){
        return (
            <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'space-evenly', marginTop : '100px'}}>
                <Button variant="primary" onClick={EndProposalsRegistration}>Fin de l'enregistrement des propositions</Button>
                <Button  variant="primary" onClick={StartVoting}>Démarrer le vote</Button>
                <Button  variant="primary" onClick={EndVoting}>Arrêter le vote</Button>
                <Button variant="primary" onClick={countVotes}>Résultat de l'éléction</Button>
            </div>
        )
    } else return null
}