import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Message, Button } from 'semantic-ui-react'

import { withBadVibes } from '../providers/bad-vibes'
import CreatePost from '../components/CreatePost'
import Timeline from '../components/Timeline'

class Profile extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string.isRequired
      })
    ).isRequired,
    username: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    loadMyPosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired,
    resetPosts: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.loadMyPosts()
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
        <h1>
          {this.props.username}, you have posted {this.props.total} times
        </h1>
        <Timeline posts={this.props.posts} />
        <div style={{ textAlign: 'center' }}>
          {!this.props.posts.length ||
          this.props.posts.length < this.props.total ? (
            <Button
              onClick={() => this.props.loadMorePosts()}
              loading={this.props.loading}>
              More
            </Button>
          ) : (
            <Fragment>
              <p style={{ margin: '4rem 0 1rem' }}>
                Why are you reading your own messed up posts? Post more 👎 shit.
              </p>
              <CreatePost placeholder="Post more shitty things" />
            </Fragment>
          )}
        </div>
      </Fragment>
    )
  }
}

export default withBadVibes(
  ({ username, posts, total, loading, error }) => ({
    username,
    posts,
    total,
    loading,
    error
  }),
  ({ loadMyPosts, loadMorePosts, resetPosts }) => ({
    loadMyPosts,
    loadMorePosts,
    resetPosts
  })
)(Profile)
