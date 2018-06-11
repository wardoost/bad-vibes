import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { Loader } from 'semantic-ui-react'

import { BadVibesContext } from '../providers/bad-vibes'
import { getDisplayName } from './react-helpers'

export const requireAuth = WrappedComponent => {
  class RequireAuth extends Component {
    render() {
      return (
        <BadVibesContext.Consumer>
          {({ state }) => {
            if (state.authenticating) {
              return <Loader active>Authenticating</Loader>
            }

            if (!state.username) {
              return <Redirect to="/join" />
            }

            return <WrappedComponent {...this.props} />
          }}
        </BadVibesContext.Consumer>
      )
    }
  }
  RequireAuth.displayName = `requireAuth(${getDisplayName(WrappedComponent)})`
  hoistNonReactStatics(RequireAuth, WrappedComponent)
  return RequireAuth
}

export const requireNoAuth = WrappedComponent => {
  class RequireNoAuth extends Component {
    render() {
      return (
        <BadVibesContext.Consumer>
          {({ state }) => {
            if (state.authenticating) {
              return <Loader active>Authenticating</Loader>
            }

            if (state.username) {
              return <Redirect to="/" />
            }

            return <WrappedComponent {...this.props} />
          }}
        </BadVibesContext.Consumer>
      )
    }
  }

  RequireNoAuth.displayName = `requireNoAuth(${getDisplayName(
    WrappedComponent
  )})`
  hoistNonReactStatics(RequireNoAuth, WrappedComponent)
  return RequireNoAuth
}
