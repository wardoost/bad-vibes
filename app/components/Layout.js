import React, { Component } from 'react'
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
    authenticed: PropTypes.bool.isRequired,
    authenticating: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    children: PropTypes.node
  }

  static defaultProps = {
    menu: [
      { label: 'My Profile', path: '/profile', requireAuth: true },
      { label: 'Join', path: '/join', requireNoAuth: true }
    ]
  }

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
      <div>
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
        <Container text style={{ padding: '6rem 0 2rem' }}>
          {this.props.error ? (
            <Message negative>{this.props.error.message}</Message>
          ) : this.props.loading ? (
            <Loader active>Connecting to MetaMask</Loader>
          ) : this.props.authenticating ? (
            <Loader active>Logging in</Loader>
          ) : (
            this.props.children
          )}
        </Container>
      </div>
    )
  }
}

export default withRouter(
  withWeb3(({ loading, error }) => ({
    loading,
    error
  }))(
    withBadVibes(({ username, authenticating }) => ({
      authenticed: Boolean(username),
      authenticating
    }))(Layout)
  )
)
