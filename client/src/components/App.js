import React, { Component } from "react";
import Voting from "../contracts/Voting.json"
import getWeb3 from "../getWeb3";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartingPage from "./StartingPage";
import RegistrationVoters from "./RegistrationVoters";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, workflowStatus: -1, whitelist: [] };

  componentWillMount = async () => {
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
     console.log(instance)
     
    

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runInit);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Non-Ethereum browser detected. Can you please try to install MetaMask before starting.`,
      );
      console.error(error);
    }
  };

  runInit = async() => {
    const { contract } = this.state;
    // récupérer le statut du workflow
    const workflowStatus = await contract.methods.currentStatus().call();
    // Mettre à jour le state 
    this.setState({ workflowStatus: workflowStatus - 1});
  }


  refreshWhitelist = async() => {
    const {contract} = this.state
    await contract.methods.countVoter().call( async(err, countVoters) => {
      if(err) {
        alert (err);
      } 
      else {
        
        const listeVoters = [];
        for ( let i =0 ; i <= countVoters ; i++ ){
          let voter = await contract.methods.Voteraddresse(i).call()
          listeVoters.push(voter)
          console.log('dans la boucle')
        }
        console.log('juste avant le setstate')
        this.setState({ whitelist : listeVoters});
      } 
    })
  }


  startVotersRegistration = async() => {
    // Mettre à jour le state 
    
    this.setState({ workflowStatus: 1});
    //this.refreshWhitelist();
    
  }

  startProposalsRegistration = async() => {
    const {accounts, contract} = this.state
    // commencer l'enregistrement des propositions
    await contract.methods.StartProposalsRegistration().send({from : accounts[0]});
    
    const workflowStatus = await contract.methods.currentStatus().call();
    this.setState({ workflowStatus: workflowStatus + 1});
    
    
  }


  addVoters = async() => {
    const { accounts, contract } = this.state;
    const address = this.address.value;
    
    // Interaction avec le smart contract pour ajouter un compte 
    await contract.methods.addVoter(address).send({from: accounts[0]}, async(error) => {
      if(error){
        let errorMessageString = JSON.stringify(error.message).toString()
        let indexStart = errorMessageString.indexOf('VM Exception')

        let message = errorMessageString.substring(indexStart)
        let indexEnd = message.indexOf('\\\"')

        let errorMessage = message.substring(0,indexEnd)
        alert('Transaction failed : '+errorMessage);
      
      } else {
        this.refreshWhitelist();
      } 

    })

  }


  addProposals = async() => {
    const { accounts, contract } = this.state;
  }
 

  render() {
    console.log('tototototo')
    const  {whitelist, workflowStatus} = this.state;
    
    
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
        <RegistrationVoters owner={this.owner} startProposalsRegistration={this.startProposalsRegistration}  workflowStatus={workflowStatus} whitelistVoters={whitelist} addVoters={this.addVoters} 
        address={ address => this.address = address}/>
      </div>
    );
  }
}

export default App;
