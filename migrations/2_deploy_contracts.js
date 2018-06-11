var Ownable = artifacts.require('./zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./zeppelin/lifecycle/Killable.sol')
var BadVibes = artifacts.require('./BadVibes.sol')

module.exports = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)
  deployer.link(Killable, BadVibes)
  deployer.deploy(BadVibes)
}
