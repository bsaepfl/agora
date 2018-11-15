import React, { Component } from 'react'
import Router from 'next/router'
import axios from 'axios'
import Accounts from 'web3-eth-accounts'

export default class extends Component {
  constructor (props) {
    super(props)
    this.state = { password: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static async getInitialProps ({ req }) {
    return {
      user: {
        username: req.user.user,
        name: req.user.displayName,
        sciper: req.user.uniqueid
      }
    }
  }

  async handleChange (e) {
    const password = e.target.value
    this.setState({ password })
  }

  async handleSubmit (e) {
    e.preventDefault()
    const accounts = new Accounts()
    const account = accounts.create()
    accounts.wallet.add(account)
    const encrypted = accounts.wallet.encrypt(this.state.password)
    await axios.post('/me', { wallet: encrypted })
    Router.push('/me')
  }

  render () {
    return (
      <section className='section has-text-centered'>
        <div className='columns is-centered'>
          <div className='column is-one-quarter'>
            <h1 className='title'>
              Generate 🔑
            </h1>
            <form onSubmit={this.handleSubmit}>
              <div className='field has-addons'>
                <div className='control' style={{ width: '100%' }}>
                  <input className='input' type='password' value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className='control'>
                  <input type='submit' className='button' value='🔒' />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}
