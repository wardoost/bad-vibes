import React, { Component, Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import Layout from '../components/Layout'

export default class Error extends Component {
  render() {
    return (
      <Fragment>
        <Layout.Header>
          <Header as="h1">Page not found</Header>
        </Layout.Header>
      </Fragment>
    )
  }
}
