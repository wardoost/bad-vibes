import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component'

export const connectContext = Context => (
  getState,
  getActions
) => WrappedComponent => {
  class Connect extends Component {
    render() {
      return (
        <Context.Consumer>
          {({ state, actions }) => {
            const connectedProps = getState ? getState(state) || {} : {}
            const connectedActions = getActions ? getActions(actions) || {} : {}

            return (
              <WrappedComponent
                {...this.props}
                {...connectedProps}
                {...connectedActions}
              />
            )
          }}
        </Context.Consumer>
      )
    }
  }
  Connect.displayName = `connect(${getDisplayName(WrappedComponent)})`
  hoistNonReactStatics(Connect, WrappedComponent)
  return Connect
}
