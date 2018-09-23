import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { Loader } from 'semantic-ui-react'

import { Web3Context } from '../providers/web3'
import { ContractContext } from '../providers/contract'
import { getDisplayName } from './react-helpers'

export const requireInitialised = WrappedComponent => {
  class RequireInitialised extends Component {
    render() {
      return (
        <Web3Context.Consumer>
          {({ state }) => {
            if (!state.web3) {
              return <Loader active>Initialising</Loader>
            }

            return <WrappedComponent {...this.props} />
          }}
        </Web3Context.Consumer>
      )
    }
  }

  RequireInitialised.displayName = `requireInitialised(${getDisplayName(
    WrappedComponent
  )})`
  hoistNonReactStatics(RequireInitialised, WrappedComponent)
  return RequireInitialised
}

export const requireAuth = WrappedComponent => {
  class RequireAuth extends Component {
    render() {
      return (
        <ContractContext.Consumer>
          {({ state }) => {
            if (state.needAuth) {
              return <Loader active>Authenticating</Loader>
            }

            if (!state.username) {
              return <Redirect to="/join" />
            }

            return <WrappedComponent {...this.props} />
          }}
        </ContractContext.Consumer>
      )
    }
  }
  RequireAuth.displayName = `requireAuth(${getDisplayName(WrappedComponent)})`
  hoistNonReactStatics(RequireAuth, WrappedComponent)
  return requireInitialised(RequireAuth)
}

export const requireNoAuth = WrappedComponent => {
  class RequireNoAuth extends Component {
    render() {
      return (
        <ContractContext.Consumer>
          {({ state }) => {
            if (state.needAuth) {
              return <Loader active>Authenticating</Loader>
            }

            if (state.username) {
              return <Redirect to="/" />
            }

            return <WrappedComponent {...this.props} />
          }}
        </ContractContext.Consumer>
      )
    }
  }

  RequireNoAuth.displayName = `requireNoAuth(${getDisplayName(
    WrappedComponent
  )})`
  hoistNonReactStatics(RequireNoAuth, WrappedComponent)
  return requireInitialised(RequireNoAuth)
}
