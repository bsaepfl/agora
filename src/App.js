import React, { Component } from 'react';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from './utils/getWeb3'
import truffleContract from 'truffle-contract'
import './App.css';

class App extends Component {
  constructor () {
    super()
    this.state = {
      web3: {},
      contract: {},
      address: '',
      storedData: 0
    }
    this.getValues = this.getValues.bind(this)
  }
  
  async componentDidMount () {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract)
      Contract.setProvider(web3.currentProvider)
      const instance = await Contract.deployed()

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        contract: instance
      })

      await this.getValues()
      this.setState({ interval: setInterval(this.getValues, 1000) })
    } catch (error) {
      // Catch any errors for any of the above operations.
      window.alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.log(error)
    }
  }
  
  async getValues () {
    const { contract, web3 } = this.state
    const address = (await web3.eth.getAccounts())[0]
    const storedData = (await contract.get()).toNumber()
    this.setState({ address, storedData })
  }
  
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Stored value: {this.state.storedData}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
