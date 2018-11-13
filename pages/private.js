import React, { Component } from 'react'

export default class extends Component {
  static async getInitialProps ({ req }) {
    return {
      user: {
        username: req.user.user,
        name: req.user.displayName,
        sciper: req.user.uniqueid
      }
    }
  }

  render () {
    return (
      <section className='section has-text-centered'>
        <h1 className='title'>
          Hello {this.props.user.name}
        </h1>
      </section>
    )
  }
}
