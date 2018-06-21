import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Container, Menu, Message, Loader } from 'semantic-ui-react'

import { withWeb3 } from '../providers/web3'
import { withBadVibes } from '../providers/bad-vibes'

class Layout extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    menu: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        requireAuth: PropTypes.bool,
        requireNoAuth: PropTypes.bool
      })
    ).isRequired,
    initialised: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    authenticed: PropTypes.bool.isRequired,
    authenticating: PropTypes.bool.isRequired,
    children: PropTypes.node
  }

  static defaultProps = {
    menu: [
      { label: 'My Profile', path: '/profile', requireAuth: true },
      { label: 'Join', path: '/join', requireNoAuth: true }
    ]
  }

  static Header = ({ style, children }) => (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '20vh',
        backgroundColor: '#f6f6f6',
        ...style
      }}>
      <Container>{children}</Container>
    </header>
  )

  static Content = ({ style, children }) => (
    <Container style={{ padding: '2rem 0', ...style }} as="main">
      {children}
    </Container>
  )

  renderMenuItem = ({ label, path, requireAuth, requireNoAuth }, index) => {
    if (
      (requireAuth && !this.props.authenticed) ||
      (requireNoAuth && this.props.authenticed)
    ) {
      return null
    }

    return (
      <Menu.Item
        key={index}
        as={Link}
        to={path}
        active={path === this.props.location.pathname}>
        {label}
      </Menu.Item>
    )
  }

  render() {
    return (
      <Fragment>
        <Menu fixed="top" inverted style={{ height: '4rem' }}>
          <Container>
            <Menu.Item as={Link} to="/" header>
              <span role="img" aria-label="Home" style={{ fontSize: '2rem' }}>
                🖕
              </span>
            </Menu.Item>
            <Menu.Menu position="right">
              {this.props.menu.map(this.renderMenuItem)}
            </Menu.Menu>
          </Container>
        </Menu>
        <div style={{ padding: '4rem 0 0' }}>
          {this.props.error ? (
            <Message negative>{this.props.error.message}</Message>
          ) : this.props.loading ? (
            <Loader active>Connecting to MetaMask</Loader>
          ) : !this.props.initialised ? (
            <Container textAlign="center" style={{ padding: '4rem 0' }}>
              Could not connect to{' '}
              <a href="https://metamask.io/" target="_blank">
                MetaMask
              </a>{' '}
              😭
            </Container>
          ) : this.props.authenticating ? (
            <Loader active>Logging in</Loader>
          ) : (
            this.props.children
          )}
        </div>
      </Fragment>
    )
  }
}

export default withRouter(
  withWeb3(({ initialised, loading, error }) => ({
    initialised,
    loading,
    error
  }))(
    withBadVibes(({ username, authenticating }) => ({
      authenticed: Boolean(username),
      authenticating
    }))(Layout)
  )
)
