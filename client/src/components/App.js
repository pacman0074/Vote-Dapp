import React, { Component } from "react";
import Voting from "../contracts/Voting.json"
import getWeb3 from "../getWeb3";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import StartingPage from "./StartingPage";
import RegistrationVoters from "./RegistrationVoters";
import RegistrationProposals from "./RegistrationProposals";
import getRequireError from "../utils/getRequireError";
import AdministrationWorkflow from "./AdministrationWorkflow";
import UserPendingPage from "./UserPendingPage";
import VotePage from "./VotePage";
import ResultVotePage from "./ResultVotePage";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, workflowStatus: -1, Owner : '' };

  componentDidMount = async () => {
    try {
      // Récupérer le provider web3
     const web3 = await getWeb3();
 
     // Utiliser web3 pour récupérer les comptes de l’utilisateur (MetaMask dans notre cas) 
     const accounts = await web3.eth.getAccounts();

     const networkId = await web3.eth.net.getId();
     const deployedNetwork = Voting.networks[networkId];
 
     const instance = new web3.eth.Contract(
       Voting.abi,
       deployedNetwork && deployedNetwork.address,
     ); 
     instance.handleRevert = true;
     
     // Récupérer le workflow courant
     const workflowStatus = await instance.methods.currentStatus().call();
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

  startVotersRegistration = async() => {
    // Mettre à jour le statut du workflow 
    this.setState({ workflowStatus: 0});  
  }

  startProposalsRegistration = async() => {
    const {accounts, contract} = this.state
    // commencer l'enregistrement des propositions
    await contract.methods.StartProposalsRegistration().send({from : accounts[0]}, (err) => getRequireError(err))
    // Mettre à jour le state sur le statut des workflows
    await contract.methods.currentStatus().call( (err, res) => {
      if(!err){
        this.setState({workflowStatus : res})
      }
    });
  }

  EndProposalsRegistration = async() => {
    const {accounts, contract} = this.state
    // Arrêter l'enregistrement des propositions
    await contract.methods.EndProposalsRegistration().send({from : accounts[0]}, (err) => getRequireError(err))
    // Mettre à jour le state sur le statut des workflows
    await contract.methods.currentStatus().call( (err, res) => {
      if(!err){
        this.setState({workflowStatus : res})
      }
    });

  }

  StartVoting = async() => {
    const {accounts, contract} = this.state
    //Commencer le vote
    await contract.methods.StartVoting().send({from : accounts[0]}, (err) => getRequireError(err))
    // Mettre à jour le state sur le statut des workflows
    await contract.methods.currentStatus().call( (err, res) => {
      if(!err){
        this.setState({workflowStatus : res})
      }
    });
  }


  Vote = async(proposalId) => {
    const {accounts, contract} = this.state
    // L'élécteur vote
    await contract.methods.Vote(proposalId).send({from : accounts[0]}, (err) => getRequireError(err))
  }


  EndVoting = async() => {
    const {accounts, contract} = this.state
    // Arrêter le vote
    await contract.methods.EndVoting().send({from : accounts[0]}, (err) => getRequireError(err))
    // Mettre à jour le state sur le statut des workflows
    await contract.methods.currentStatus().call( (err, res) => {
      if(!err){
        this.setState({workflowStatus : res})
      }
    });
  }

  countVotes = async() => {
    const {accounts, contract} = this.state
    // Déterminer la proposition gagnante
    await contract.methods.countVotes().send({from : accounts[0]}, (err) => getRequireError(err))
    // Mettre à jour le state sur le statut des workflows
    await contract.methods.currentStatus().call( (err, res) => {
      if(!err){
        this.setState({workflowStatus : res})
      }
    });
  }


  
 

  render() {
    const  {workflowStatus, contract, accounts, Owner} = this.state;
   
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    // Recharge la page quand on séléctionne un autre compte dans metamask
    window.ethereum.on('accountsChanged', () => window.location.reload());

    return (
      <div className="App">
        <div>
            <h2 className="text-center">Système de vote</h2>
            <hr></hr>
            <br></br>
        </div>
        {/*Page d'attente pour les utilisateurs en attendant que l'administrateur commence la session d'enregistrement des prospoition*/}
        <UserPendingPage workflowStatus={workflowStatus} Owner={Owner} accounts={accounts} />

        {/*Page d'accueil de la DAPP pour l'administrateur de l'éléction*/}
        <StartingPage  workflowStatus={workflowStatus} startVotersRegistration={this.startVotersRegistration} Owner={Owner} accounts={accounts}/>

        {/*Ecran d'enregistrement des élécteurs*/}
        <RegistrationVoters accounts={accounts} contract={contract} startProposalsRegistration={this.startProposalsRegistration}
          workflowStatus={workflowStatus} getRequireError={getRequireError} Owner={Owner} />

        {/*Page des élécteurs pour enregistrer les propositions*/}
        <RegistrationProposals accounts={accounts} contract={contract} workflowStatus={workflowStatus} getRequireError={getRequireError}
        Owner={Owner} />

        {/*Menu de l'administrateur lui permettant de déterminer l'enregistrement des propositions et de démarrer le vote*/}
        <AdministrationWorkflow workflowStatus={workflowStatus} getRequireError={getRequireError} Owner={Owner} accounts={accounts}
        EndProposalsRegistration={this.EndProposalsRegistration} StartVoting={this.StartVoting} EndVoting={this.EndVoting} countVotes={this.countVotes}/>

        {/*Page des élécteurs pour voter*/}
        <VotePage Owner={Owner} accounts={accounts} workflowStatus={workflowStatus} contract={contract} Vote={this.Vote} />

        {/*Page de résultat de l'éléction */}
        <ResultVotePage workflowStatus={workflowStatus} accounts={accounts} contract={contract}/>
      </div>
    );
  }
}

export default App;
