var Migrations = artifacts.require("./Svalin.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
