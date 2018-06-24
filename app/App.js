import React, { Component } from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { hot } from 'react-hot-loader'

import Web3Provider from './providers/web3'
import BadVibesProvider from './providers/bad-vibes'
import Home from './pages/index'
import Join from './pages/join'
import Profile from './pages/profile'
import User from './pages/user'
import Error from './pages/error'
import BadVibesContract from '../build/contracts/BadVibes.json'
import {
  requireInitialised,
  requireAuth,
  requireNoAuth
} from './utils/authentication'

class App extends Component {
  render() {
    return (
      <Web3Provider contract={BadVibesContract}>
        <BadVibesProvider>
          <HashRouter>
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
          </HashRouter>
        </BadVibesProvider>
      </Web3Provider>
    )
  }
}

export default hot(module)(App)
