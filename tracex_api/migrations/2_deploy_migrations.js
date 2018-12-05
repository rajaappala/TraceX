var Epedigree = artifacts.require("./contracts/Epedigree.sol");

module.exports = function(deployer) {
  deployer.deploy(Epedigree);
};
