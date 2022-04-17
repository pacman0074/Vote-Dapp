var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Whitelist = artifacts.require("../contracts/Whitelist.sol")

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Whitelist)
};
