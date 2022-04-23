import React, {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion'

export default function RegistrationProposals ({workflowStatus, accounts, contract,getRequireError, Owner}) {

    const [proposalList, setProposalList] = useState([]);
    var Proposal = '';


    const refreshProposalList = async() => {
        const listProposal = [];
        const countProposal = await contract.methods.countProposal().call()
        
        for (var i = 1; i <= countProposal; i++){
            await contract.methods.proposalList(i).call((err,res) => {
                if(!err)
                listProposal.push(res.description)
            })
          
        }
        
        setProposalList(listProposal);
    
    }
    
    
    const registerProposals = async() => {
        const proposal = Proposal.value;
    
        await contract.methods.registerProposal(proposal).send({from: accounts[0]}, async(error) => getRequireError(error));
        refreshProposalList();
    }

   

    useEffect( () => refreshProposalList(), [])
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
                                <thead/>
                               
                                <tbody>
                                {console.log(proposalList)}
                                {proposalList.length !== 0 &&
                                    proposalList.map((a, index) => 
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item  eventKey={index} style={{border : '1px gray solid'}}>
                                            <Accordion.Header>Proposition n°{index + 1}</Accordion.Header>
                                            <Accordion.Body>{a}</Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                    )
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
            </div>
        )
    } else return null
}