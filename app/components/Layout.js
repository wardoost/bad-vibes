import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { Container, Menu, Message, Loader, Icon } from 'semantic-ui-react'

import { withWeb3 } from '../providers/web3'
import { withBadVibes } from '../providers/bad-vibes'

class Layout extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    menu: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        url: PropTypes.string.isRequired,
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
      { label: 'My Profile', url: '/profile', requireAuth: true },
      { label: 'Join', url: '/join', requireNoAuth: true },
      {
        label: 'Wtf?',
        icon: PropTypes.string,
        url: 'https://github.com/wardoost/bad-vibes#why',
        external: true
      }
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

  renderMenuItem = (
    { label, url, requireAuth, requireNoAuth, external },
    index
  ) => {
    if (
      (requireAuth && !this.props.authenticed) ||
      (requireNoAuth && this.props.authenticed)
    ) {
      return null
    }

    if (external) {
      return (
        <Menu.Item key={index} href={url} target="_blank">
          {label}
        </Menu.Item>
      )
    }

    return (
      <Menu.Item
        key={index}
        as={Link}
        to={url}
        active={url === this.props.location.pathname}>
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
        <div style={{ padding: '4rem 0 0', minHeight: 'calc(100% - 4rem)' }}>
          {this.props.error && (
            <Message negative>{this.props.error.message}</Message>
          )}
          {this.props.loading ? (
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
        <footer
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '4rem',
            backgroundColor: '#f6f6f6'
          }}>
          <Container>
            <a
              href="https://github.com/wardoost/bad-vibes/issues/new"
              target="_blank"
              style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,.87)' }}>
              <Icon name="bug" />
              Report an issue
            </a>
          </Container>
        </footer>
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
