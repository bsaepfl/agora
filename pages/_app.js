import React from 'react'
import App, { Container } from 'next/app'
import Link from 'next/link'
import 'blulma/blulma.css'

export default class AgoraApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <nav className='navbar is-primary' role='navigation' aria-label='main navigation'>
          <div className='navbar-brand title has-text-light'>
            <Link href='/'><a className='navbar-item'>AGORA</a></Link>
          </div>
        </nav>
        <div className='container'>
          <Component {...pageProps} />
        </div>
      </Container>
    )
  }
}