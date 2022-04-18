var SimpleStorage = artifacts.require("SimpleStorage.sol");
var Whitelist = artifacts.require("Whitelist.sol");
var Voting = artifacts.require("Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Whitelist);
  deployer.deploy(Voting);
};
