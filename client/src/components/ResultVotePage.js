import React, { useEffect, useState } from "react";

export default function ResultVotePage({workflowStatus, accounts, contract}){

    const [state, setState] = useState({winningProposal : {}, winningProposalId : null })

    const getWinningProposal = async() => {
        // Retourner l'ID de la proposition gagante 
        const winningProposalId = await contract.methods.winningProposalId().call({from : accounts[0]})
        await contract.methods.proposalList(winningProposalId).call({from : accounts[0]}, (err, res) => {
            if(!err){
                setState({winningProposal : res,winningProposalId : winningProposalId})
            }
        })
    }

    useEffect( () => getWinningProposal(), [] )

    if(workflowStatus == 5){
    return(
        <div style={{marginTop : '100px'}} >
            {state.winningProposalId == 0 ? <h1>Aucune proposition gagnante car personne n'a voté !</h1> : 
            <div>
                <h2>La proposition gagnante est</h2>
                <h1>Proposition n°{state.winningProposalId} : {state.winningProposal.description}</h1>
            </div>
            }
        </div>
    ) 
    }else return null
}