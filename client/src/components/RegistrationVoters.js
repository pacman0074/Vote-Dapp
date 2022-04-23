import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

export default function RegistrationVoters ({contract, workflowStatus, startProposalsRegistration, accounts, getRequireError, Owner}) {

    const [whitelist, setWhitelist] = useState([]);
    var Address = 0;


    const refreshWhitelist = async() => {
        // Récupérer le nombre d'élécteur de la whitelist
        await contract.methods.countVoter().call( async(err, countVoters) => {
          if(err) {
            alert (err);
          } 
    
          else {
            const listeVoters = [];
            // Récupérer la liste d'élécteur
            for ( let i =0 ; i < countVoters ; i++ ){
              await contract.methods.Voteraddresse(i).call((err,res) => {
                if(!err) {
                  listeVoters.push(res);
                }
              })
            }
            // Mettre à jour le state sur la liste des élécteurs
            setWhitelist(listeVoters)
          } 
        })
    }


    const addVoters = async() => {
        const address = Address.value;
        // Interaction avec le smart contract pour ajouter un compte 
        await contract.methods.addVoter(address).send({from: accounts[0]}, async(error) => getRequireError(error))
        refreshWhitelist();
    }

      
    useEffect(() => refreshWhitelist(), [])

    if(workflowStatus == 0 && accounts[0] == Owner) {
        
        return (
            <div>
                <div className='dv-registration-voters-container'>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Card style={{ width: '50rem' }}>
                        <Card.Header><strong>Liste des comptes autorisés</strong></Card.Header>
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
                                {whitelist !== null && 
                                    whitelist.map((a) => <tr><td>{a}</td></tr>)
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
                        <Card.Header><strong>Autoriser un nouveau compte</strong></Card.Header>
                        <Card.Body>
                        <Form.Group controlId="formAddress">
                            <Form.Control type="text" id="address"
                            ref={ input => Address = input }
                            />
                        </Form.Group>
                        <Button style={{ marginTop : '15px'}} className='dv-registration-voters-button' onClick={ addVoters } variant="dark" > Autoriser </Button>
                        </Card.Body>
                    </Card>
                    </div>
                    <br></br>
                </div>
                <Button onClick={startProposalsRegistration} style={{marginTop : '10px', marginBottom : '10px'}  } >Commencer l'enregistrement des propositions</Button>
            </div>
        )
    } else return null
}