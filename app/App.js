import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import Web3Provider from './providers/web3'
import ContractProvider from './providers/contract'
import Layout from './components/Layout'
import Home from './pages/index'
import Join from './pages/join'
import Profile from './pages/profile'
import User from './pages/user'
import Error from './pages/error'
import badVibesContract from '../build/contracts/BadVibes.json'
import {
  requireInitialised,
  requireAuth,
  requireNoAuth
} from './utils/authentication'

class App extends Component {
  render() {
    return (
      <Web3Provider contract={badVibesContract}>
        <ContractProvider>
          <HashRouter>
            <Layout>
              <Switch>
                <Route path="/" exact component={requireInitialised(Home)} />
                <Route path="/join" component={requireNoAuth(Join)} />
                <Route path="/profile" component={requireAuth(Profile)} />
                <Route
                  path="/users/:address"
                  component={requireInitialised(User)}
                />
                <Route component={Error} />
              </Switch>
            </Layout>
          </HashRouter>
        </ContractProvider>
      </Web3Provider>
    )
  }
}

export default hot(module)(App)
