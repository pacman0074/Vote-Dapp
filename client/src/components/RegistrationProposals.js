import React, {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

export default function RegistrationProposals ({workflowStatus, accounts, contract,getRequireError, Owner}) {

    const [proposalList, setProposalList] = useState([]);
    var Proposal = '';


    const refreshProposalList = async() => {
        const listProposal = [];
        const countProposal = await contract.methods.countProposal().call()
        
        for (var i = 0; i <= countProposal; i++){
         await contract.methods.proposalList(i).call().then( (res) => listProposal.push(res.description));
          
        }
        
        setProposalList(listProposal);
    
    }
    
    
    const registerProposals = async() => {
        const proposal = Proposal.value;
    
        await contract.methods.registerProposal(proposal).send({from: accounts[0]}, async(error) => getRequireError(error));
        refreshProposalList();
    }

   

    useEffect( () => refreshProposalList(), [])
    console.log(Owner)
    console.log(accounts[0])
    if(workflowStatus == 1 && Owner != accounts[0]) {
        return (
            <div>
                <div className='dv-registration-voters-container'>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card style={{ width: '50rem' }}>
                        <Card.Header><strong>Liste des propositions</strong></Card.Header>
                        <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>@</th>
                                </tr>
                                </thead>
                                <tbody>
                                {proposalList !== null && 
                                    proposalList.map((a) => <tr><td>{a}</td></tr>)
                                }
                                </tbody>
                            </Table>
                            </ListGroup.Item>
                        </ListGroup>
                        </Card.Body>
                    </Card>
                    </div>
                    <br></br>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card style={{ width: '50rem' }}>
                        <Card.Header><strong>Ajouter une nouvelle proposition</strong></Card.Header>
                        <Card.Body>
                        <Form.Group controlId="formProposal">
                            <Form.Control type="text" id="proposal"
                            ref={ input => Proposal = input }
                            />
                        </Form.Group>
                        <Button style={{ marginTop : '15px'}} className='dv-registration-voters-button' onClick={ registerProposals } variant="dark" > Enregistrer une proposition </Button>
                        </Card.Body>
                    </Card>
                    </div>
                    <br></br>
                </div>
                <Button onClick={console.log('startProposalRegistration')} style={{marginTop : '10px'}  } >Commencer l'enregistrement des propositions</Button>
            </div>
        )
    } else return null
}