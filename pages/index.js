import React, { Component } from 'react'
import Eth from 'ethjs'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'

class App extends Component {
  constructor () {
    super()
    this.state = {
      eth: {},
      contract: {},
      storedData: 0
    }
    this.getValues = this.getValues.bind(this)
  }

  async componentDidMount () {
    try {
      const eth = new Eth(new Eth.HttpProvider('http://localhost:9545'))

      const contract = eth.contract(SimpleStorageContract.abi).at('0x345ca3e014aaf5dca488057592ee47305d9b3e10')

      this.setState({
        eth,
        contract
      }, async () => {
        await this.getValues()
        this.setState({ interval: setInterval(this.getValues, 1000) })
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error)
      window.alert(
        `Failed to load ethjs, accounts, or contract. Check console for details.`
      )
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.interval)
  }

  async getValues () {
    const { contract } = this.state
    const storedData = (await contract.get())[0].toNumber()
    this.setState({ storedData })
  }

  render () {
    return (
      <section className='section has-text-centered'>
        <h1 className='title'>Hello, world</h1>
        <a href='/me' className='button is-primary is-large' >LOG IN</a>
        <p>Smart contract value: {this.state.storedData}</p>
      </section>
    )
  }
}

export default App
