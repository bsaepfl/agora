import React, { Component } from 'react'

export default class extends Component {
  static async getInitialProps ({ query }) {
    return {
      user: {
        username: query.user.user,
        name: query.user.displayName,
        sciper: query.user.uniqueid
      },
      address: query.wallet.address
    }
  }

  render () {
    return (
      <section className='section has-text-centered'>
        <h1 className='title'>
          Hello {this.props.user.name}
        </h1>
        <p>Address: <code className='has-text-grey'>0x{this.props.address}</code></p>
        <p>🔓</p>
      </section>
    )
  }
}
