import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
  <>
    <h1 className='title is-1'>Agora</h1>
    <h2 className='subtitle is-3'>the EPFL reputation system</h2>
    <Link className='button is-primary is-large' to='/login'>LOG IN</Link>
  </>
)
