import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

export default function RegistrationProposals ({workflowStatus, listProposals, registerProposals, proposal}) {

    

    if(workflowStatus == 2) {
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
                                {listProposals !== null && 
                                    listProposals.map((a) => <tr><td>{a}</td></tr>)
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
                            ref={ input => proposal(input) }
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