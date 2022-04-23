import React, { Component } from "react";
import Voting from "../contracts/Voting.json"
import getWeb3 from "../getWeb3";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartingPage from "./StartingPage";
import RegistrationVoters from "./RegistrationVoters";
import RegistrationProposals from "./RegistrationProposals";
import getRequireError from "../utils/getRequireError";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, workflowStatus: -1, proposals : [], Owner : '' };

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
     const owner = await instance.methods.owner().call();
 
     if(countVoter == 0){
       this.setState({ web3, accounts, contract: instance, workflowStatus: workflowStatus - 1 , Owner : owner});
 
     }
     else{
       this.setState({ web3, accounts, contract: instance, workflowStatus: workflowStatus, Owner : owner });
 
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


  getOwner = async() => {
    const {contract} = this.state
    await contract.methods.owner().call( (err, res) => {
    if(!err){
        this.Owner = res
    }
  })
}

  startVotersRegistration = async() => {
    // Mettre à jour le state 
    this.setState({ workflowStatus: 0});
    // Rafraichit la liste des élécteurs
    //this.refreshWhitelist();
    
    
  }

  startProposalsRegistration = async() => {
    const {accounts, contract} = this.state
    // commencer l'enregistrement des propositions
    await contract.methods.StartProposalsRegistration().send({from : accounts[0]});
    
    // Mettre à jour le state sur le statut des workflows
    await contract.methods.currentStatus().call( (err, res) => this.setState({ workflowStatus: res}));
  }


  
 

  render() {
    const  {proposals ,workflowStatus, contract, accounts, Owner} = this.state;
   
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
        <RegistrationVoters accounts={accounts} contract={contract} startProposalsRegistration={this.startProposalsRegistration}
          workflowStatus={workflowStatus} getRequireError={getRequireError} />
        <RegistrationProposals accounts={accounts} contract={contract} workflowStatus={workflowStatus} getRequireError={getRequireError} Owner={Owner} />
      </div>
    );
  }
}

export default App;
