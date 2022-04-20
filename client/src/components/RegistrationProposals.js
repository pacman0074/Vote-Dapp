import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

export default function RegistrationProposals ({workflowStatus, accounts, contract}) {

    const [proposalList, setProposalList] = useState([]);
    var Proposal = '';

    const registerProposals = async() => {
        const proposal = Proposal.value;
    
        await contract.methods.registerProposal(proposal).send({from: accounts[0]}, async(error) => {
            if(error){
              // Récupérer le message de l'erreur et la position du début de l'erreur 'VM Exception'
              let errorMessageString = JSON.stringify(error.message).toString()
              let indexStart = errorMessageString.indexOf('VM Exception')
      
              //Récupérer le message de l'erreur à partir de la chaine 'VM Exception' et la position de la fin du message d'erreur
              let message = errorMessageString.substring(indexStart)
              let indexEnd = message.indexOf('\\\"')
      
              //Récupération de l'erreur
              let errorMessage = message.substring(0,indexEnd)
              alert('Transaction failed : '+errorMessage);
            
            } else {
              //Mettre à jour la liste des propositions
              refreshProposalList();
            } 
      
        });


    
    const refreshProposalList = async() => {
        const listProposal = [];
        const listeVoters = [];
        const countVoter = await contract.methods.countVoter().call()
        // Récupérer la liste d'élécteur
        for ( let i =0 ; i < countVoter ; i++ ){
          await contract.methods.Voteraddresse(i).call().then( (res) => listeVoters.push(res));
        }
        
        for (let i = 0; i < listeVoters.length(); i++){
          let voter = await contract.methods.whitelist(listeVoters[i]).call()
          let proposal = await contract.methods.proposalList(voter.votedProposalId).call()
          listProposal.push(proposal.description)
        }
        
        setProposalList(listProposal);
    
      }
    }
    

    if(workflowStatus == 1) {
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