import React, { Component } from "react";
import Voting from "../contracts/Voting.json"
import getWeb3 from "../getWeb3";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartingPage from "./StartingPage";
import RegistrationVoters from "./RegistrationVoters";
import RegistrationProposals from "./RegistrationProposals";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, workflowStatus: -1, proposals : [] };

  componentDidMount = async () => {
    try {
      // Récupérer le provider web3
     const web3 = await getWeb3();
 
     // Utiliser web3 pour récupérer les comptes de l’utilisateur (MetaMask dans notre cas) 
     const accounts = await web3.eth.getAccounts();

     // Récupérer l’instance du smart contract “Whitelist” avec web3 et les informations du déploiement du fichier (client/src/contracts/Whitelist.json)
     const networkId = await web3.eth.net.getId();
     const deployedNetwork = Voting.networks[networkId];
 
     const instance = new web3.eth.Contract(
       Voting.abi,
       deployedNetwork && deployedNetwork.address,
     ); 
     instance.handleRevert = true;
     
     const workflowStatus = await instance.methods.currentStatus().call();
     // Mettre à jour le workflow courant
     const countVoter = await instance.methods.countVoter().call();
 
     if(countVoter == 0){
       this.setState({ web3, accounts, contract: instance, workflowStatus: workflowStatus - 1 });
 
     }
     else{
       this.setState({ web3, accounts, contract: instance, workflowStatus: workflowStatus });
       console.log(this.state.workflowStatus)
 
     } 

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Non-Ethereum browser detected. Can you please try to install MetaMask before starting.`,
      );
      console.error(error);
    }
  };

  startVotersRegistration = async() => {
    // Mettre à jour le state 
    this.setState({ workflowStatus: 1});
    // Rafraichit la liste des élécteurs
    //this.refreshWhitelist();
    
    
  }

  startProposalsRegistration = async() => {
    const {accounts, contract} = this.state
    // commencer l'enregistrement des propositions
    await contract.methods.StartProposalsRegistration().send({from : accounts[0]});
    
    // Mettre à jour le state sur le statut des workflows
    const workflowStatus = parseInt( await contract.methods.currentStatus().call()) + 1;
    
    console.log('juste avant le setstate = '+workflowStatus)
    this.setState({ workflowStatus: workflowStatus});
    
    
  }


  registerProposals = async() => {
    const { accounts, contract, whitelist } = this.state;
    const proposal = this.proposal.value;

    await contract.methods.registerProposal(proposal).send({from : accounts[0]});

    const listProposal = []
    for (let i = 0; i < whitelist.length(); i++){
      let voter = await contract.methods.whitelist(whitelist[i]).call()
      let proposal = await contract.methods.proposalList(voter.votedProposalId).call()
      listProposal.push(proposal.description)
    }
    this.setState({ proposals : listProposal})

  }
 

  render() {
    const  {proposals ,workflowStatus, contract} = this.state;
   
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
            <h2 className="text-center">Système de vote</h2>
            <hr></hr>
            <br></br>
        </div>
        <StartingPage  workflowStatus={workflowStatus} startVotersRegistration={this.startVotersRegistration} />
        <RegistrationVoters accounts={this.state.accounts}contract={contract} /*owner={this.owner}*/ startProposalsRegistration={this.startProposalsRegistration}  workflowStatus={workflowStatus} /*whitelistVoters={whitelist} addVoters={this.addVoters}*/ 
        /*address={ address => this.address = address}*//>
        <RegistrationProposals workflowStatus={workflowStatus} listProposals={proposals} registerProposals={this.registerProposals} proposal={  proposal => this.proposal = proposal}/>
      </div>
    );
  }
}

export default App;
