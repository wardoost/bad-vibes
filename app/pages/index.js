import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message, Button } from 'semantic-ui-react'

import { withBadVibes } from '../providers/bad-vibes'
import CreatePost from '../components/CreatePost'
import Timeline from '../components/Timeline'

class Home extends Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    loadAllPosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired,
    resetPosts: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.loadAllPosts()
  }

  componentWillUnmount() {
    this.props.resetPosts()
  }

  render() {
    return (
      <Fragment>
        {this.props.error && (
          <Message negative>{this.props.error.message}</Message>
        )}
        {this.props.authenticated ? (
          <CreatePost />
        ) : (
          <Message
            icon="user"
            onDismiss={this.handleDismiss}
            header={`You look like you're up to no good`}
            content={
              <p>
                <Link to="/join">Join our community</Link> and share negativity
              </p>
            }
          />
        )}
        <Timeline posts={this.props.posts} />
        <Container textAlign="center">
          {this.props.posts.length < this.props.total ? (
            <Button
              onClick={() => this.props.loadMorePosts()}
              loading={this.props.loading}>
              More
            </Button>
          ) : (
            <p style={{ margin: '4rem 0', textAlign: 'center' }}>
              You have seen all {this.props.total} posts, so 🖕 off now!
            </p>
          )}
        </Container>
      </Fragment>
    )
  }
}

export default withBadVibes(
  ({ username, posts, total, loading, error }) => ({
    authenticated: Boolean(username),
    posts,
    total,
    loading,
    error
  }),
  ({ loadAllPosts, loadMorePosts, resetPosts }) => ({
    loadAllPosts,
    loadMorePosts,
    resetPosts
  })
)(Home)
