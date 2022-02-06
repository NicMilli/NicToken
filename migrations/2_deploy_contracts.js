var NicToken = artifacts.require("NicToken.sol");
var NicTokenSale = artifacts.require("NicTokenSale.sol");
var NicKYC = artifacts.require("KycContract.sol");
require("dotenv").config({path: "../.env"});

module.exports = async function(deployer) {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(NicToken, process.env.INITIAL_TOKENS);
    await deployer.deploy(NicKYC);
    await deployer.deploy(NicTokenSale, 1, addr[0], NicToken.address, NicKYC.address);
    let instance = await NicToken.deployed();
    await instance.transfer(NicTokenSale.address, process.env.INITIAL_TOKENS);
};