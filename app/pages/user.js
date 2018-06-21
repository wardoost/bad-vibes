import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'
import { Header, Container, Message, Button } from 'semantic-ui-react'

import { withWeb3 } from '../providers/web3'
import { withBadVibes } from '../providers/bad-vibes'
import Layout from '../components/Layout'
import Timeline from '../components/Timeline'

class User extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        address: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        authorUsername: PropTypes.string
      }).isRequired
    }).isRequired,
    coinbase: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired
      })
    ).isRequired,
    authorUsername: PropTypes.string,
    total: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    loadUserPosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired,
    resetPosts: PropTypes.func.isRequired
  }

  componentDidMount() {
    if (this.props.coinbase !== this.props.match.params.address) {
      this.props.loadUserPosts(this.props.match.params.address)
    }
  }

  componentWillUnmount() {
    this.props.resetPosts()
  }

  render() {
    if (this.props.coinbase === this.props.match.params.address) {
      return <Redirect to="/profile" />
    }

    return (
      <Layout>
        <Layout.Header>
          <Header as="h1">
            {this.props.total} message{this.props.total !== 1 && 's'} by{' '}
            {this.props.authorUsername ||
              this.props.location.state.authorUsername ||
              this.props.match.params.address}
          </Header>
        </Layout.Header>
        <Layout.Content>
          {this.props.error && (
            <Message negative>{this.props.error.message}</Message>
          )}
          <Timeline posts={this.props.posts} />
          <Container textAlign="center">
            {this.props.posts.length < this.props.total && (
              <Button
                onClick={() => this.props.loadMorePosts()}
                loading={this.props.loading}>
                More
              </Button>
            )}
          </Container>
        </Layout.Content>
      </Layout>
    )
  }
}

export default withWeb3(({ coinbase }) => ({ coinbase }))(
  withBadVibes(
    ({ posts, addressUsername, total, loading, error }) => ({
      posts,
      authorUsername: addressUsername,
      total,
      loading,
      error
    }),
    ({ getUsername, loadUserPosts, loadMorePosts, resetPosts }) => ({
      getUsername,
      loadUserPosts,
      loadMorePosts,
      resetPosts
    })
  )(User)
)
