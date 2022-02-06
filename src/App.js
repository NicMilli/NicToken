import React, { Component } from "react";
import NicToken from "./contracts/NicToken.json";
import NicTokenSale from "./contracts/NicTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded: false, kycAddress: "0x123...", tokenSaleAddr: "No address set yet", tokenAddr: null, userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.getChainId();

      this.NicTokenInstance = new this.web3.eth.Contract(
        NicToken.abi,
        NicToken.networks[this.networkId] && NicToken.networks[this.networkId].address,
      );

      this.NicTokenSaleInstance = new this.web3.eth.Contract(
        NicTokenSale.abi,
        NicTokenSale.networks[this.networkId] && NicTokenSale.networks[this.networkId].address,
      );

      this.KYCInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({loaded: true, tokenSaleAddr: NicTokenSale.networks[this.networkId].address, tokenAddr: NicToken.networks[this.networkId].address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async() => {
    let userTokens = await this.NicTokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  listenToTokenTransfer = () => {
    this.NicTokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async() => {
    await this.NicTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: this.web3.utils.toWei("1", "wei")});
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
    }

    handleKycWhitelisting = async() => {
      console.log(this.KYCInstance);
      //console.log(this.NicTokenInstance.methods.owner);
      await this.KYCInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
      alert("KYC for "+this.state.kycAddress+" has been completed.")
    }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Nic's Token Sale</h1>
        <p>Get your tokens today!</p>
        <h2>Kyc Whitelisting:</h2>
        Address to allow token buying: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange = {this.handleInputChange} />
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button> 
        <h2>Buy Tokens</h2>
        <p>Please send funds to the following address to buy tokens (If you are whitelisted): <br></br>{this.state.tokenSaleAddr}
        <br></br>check: {this.state.tokenAddr}</p>
        <p>You currently have: {this.state.userTokens} NIC tokens!</p>
        <button type="button" onClick={this.handleBuyTokens}>Buy More Tokens</button>
      </div>
    );
  }
}

export default App;
