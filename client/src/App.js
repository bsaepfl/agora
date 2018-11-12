import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Eth from 'ethjs'
import SimpleStorageContract from './contracts/SimpleStorage.json'
import Home from './Home'
import Login from './Login'
import './App.css'

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

  async getValues () {
    const { contract } = this.state
    const storedData = (await contract.get())[0].toNumber()
    this.setState({ storedData })
  }

  render () {
    return (
      <Router className='container'>
        <section className='section has-text-centered'>
          <Route path='/' exact component={Home} />
          <Route path='/login' component={Login} />
        </section>
      </Router>
    )
  }
}

export default App
