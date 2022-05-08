import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';


export default function VotePage({workflowStatus, accounts, Owner, contract, Vote}){

    const [proposalList, setProposalList] = useState([])
    var proposalId = 0;

    const getProposalList = async() => {
        const countProposal = await contract.methods.countProposal().call()
        const tabProposal = []
        for (var i = 1; i <= countProposal; i++){
            await contract.methods.proposalList(i).call( (err,res) => {
                if(!err)
                tabProposal.push(res.description)
            })
        }
        setProposalList(tabProposal)
    }

    const handleChange = async (event) => {
        const {id} = event.target
        proposalId = id
    }

    useEffect( () => getProposalList(), [] )

    if(workflowStatus == 3  && accounts[0] !== Owner ){
        return(
            <div>
                <Form>
                {proposalList.map( (proposal, index) => 
                    <Form.Check 
                    key={index}
                    inline
                    name="Liste de propositions"
                    label={proposal}
                    type='radio'
                    id={index + 1}
                    onChange={handleChange}
                    />
                )}
                </Form>
                <Button onClick={ () => Vote(proposalId)} className="mt-5">Voter</Button>
            </div>
        )
    }else return null
}