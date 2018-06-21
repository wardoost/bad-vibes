import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Header, Container, Message, Button } from 'semantic-ui-react'

import { withBadVibes } from '../providers/bad-vibes'
import Layout from '../components/Layout'
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
      <Layout>
        <Layout.Header>
          <Header as="h1">
            {this.props.username}, you have posted {this.props.total} time{this
              .props.total !== 1 && 's'}
          </Header>
        </Layout.Header>
        <Layout.Content>
          {this.props.error && (
            <Message negative>{this.props.error.message}</Message>
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
              <Fragment>
                <p style={{ margin: '4rem 0 1rem' }}>
                  {this.props.posts.length
                    ? 'Why are you reading your own messed up 💩 posts?'
                    : `You don't have any 💩 to say?`}
                </p>
                {!this.props.posts.length && (
                  <CreatePost placeholder={'Share a shitty thing'} />
                )}
              </Fragment>
            )}
          </Container>
        </Layout.Content>
      </Layout>
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
