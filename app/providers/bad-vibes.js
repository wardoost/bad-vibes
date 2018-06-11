import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'

import { connectContext } from '../utils/react-helpers'
import { validateMessage, validateUsername } from '../utils/validation'
import { withWeb3 } from './web3'

// Create context with React Context API
export const BadVibesContext = createContext()

// Export HOC to connect state and actions to any child component
export const withBadVibes = connectContext(BadVibesContext)

// Create provider which holds all state and actions
class BadVibesProvider extends Component {
  static propTypes = {
    coinbase: PropTypes.string,
    contract: PropTypes.object,
    initialised: PropTypes.bool.isRequired,
    children: PropTypes.node
  }

  state = {
    coinbase: null,
    username: '',
    posts: [],
    address: null,
    addressUsername: '',
    total: 0,
    pageLimit: 10,
    needAuth: false,
    authenticating: false,
    loading: false,
    error: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      coinbase: nextProps.coinbase,
      needAuth:
        !nextProps.initialised || nextProps.coinbase !== prevState.coinbase
    }
  }

  componentDidUpdate() {
    if (this.props.initialised && this.state.needAuth) {
      // Authenticate and hook up event listeners
      this.authenticate().then(() => {
        this.props.contract.LogNewPost((error, result) => {
          console.log('LogNewPost', this.state, error || result)

          if (!this.state.loading) {
            if (result) {
              const { message, author, index } = result.args

              this.setState(prevState => ({
                count: index.toNumber() + 1,
                posts:
                  !prevState.address || author !== prevState.address
                    ? [{ message, author }, ...prevState.posts]
                    : prevState.posts
              }))
            } else if (error) {
              this.setState({ error })
            }
          }
        })
      })
    }
  }

  authenticate = async () => {
    this.setState({
      username: '',
      needAuth: false,
      authenticating: true
    })

    try {
      if (!this.props.initialised) {
        throw new Error('Web3 or contract is not initialised')
      }

      // Try logging in with current wallet
      const authenticated = await this.props.contract.isUser(
        this.props.coinbase
      )

      if (authenticated) {
        const username = await this.props.contract.getUsername(
          this.props.coinbase
        )

        this.setState({
          username,
          authenticating: false,
          error: null
        })
      } else {
        this.setState({ authenticating: false, error: null })
      }
    } catch (error) {
      this.setState({ error, authenticating: false })
    }
  }

  join = async username => {
    try {
      if (this.state.loading) {
        throw new Error('Already loading data')
      }

      this.setState({ loading: true })

      if (!this.props.initialised) {
        throw new Error('Web3 or contract is not initialised')
      }

      await validateUsername(username)

      const { isUser, join } = this.props.contract
      const authenticated = await isUser(this.props.coinbase)

      if (authenticated) {
        throw new Error('You are already a member')
      }

      const result = await join(username, {
        from: this.props.coinbase
      })
      console.log(result)

      this.setState(prevState => ({
        username,
        users: {
          ...prevState.users,
          [this.props.coinbase]: username
        },
        loading: false,
        error: null
      }))
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  formatPost = async ([message, author]) => {
    if (!this.props.initialised) {
      throw new Error('Web3 or contract is not initialised')
    }

    const { isUser, getUsername } = this.props.contract
    const authenticated = await isUser(author)

    if (!authenticated) {
      return {
        message,
        author
      }
    }

    const username = await getUsername(author)

    return {
      message,
      author,
      authorUsername: username
    }
  }

  loadMyPosts = async (page = 1, limit = this.state.pageLimit) => {
    try {
      this.loadUserPosts(this.props.coinbase, page, limit)
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  loadUserPosts = async (address, page = 1, limit = this.state.pageLimit) => {
    try {
      if (this.state.loading) {
        throw new Error('Already loading data')
      }

      this.setState({ address, loading: true })

      if (!this.props.initialised) {
        throw new Error('Web3 or contract is not initialised')
      }

      const {
        isUser,
        getUsername,
        getPostAtIndex,
        getPostOfUserCount,
        getPostOfUserAtIndex
      } = this.props.contract

      const postPromises = []
      const count = await getPostOfUserCount(address)
      const total = count.toNumber()

      if (total) {
        const start = Math.max(total - 1 - (page - 1) * limit, 0)
        const end = Math.max(start - (limit - 1), 0)

        for (let i = start; i >= end; i--) {
          postPromises.push(
            getPostOfUserAtIndex(address, i).then(postIndex =>
              getPostAtIndex(postIndex).then(this.formatPost)
            )
          )
        }
      }

      const posts = await Promise.all(postPromises)

      let addressUsername = ''
      const authenticated = await isUser(address)

      if (authenticated) {
        addressUsername = await getUsername(address)
      }

      this.setState(prevState => ({
        total,
        pageLimit: limit,
        posts: [...prevState.posts, ...posts],
        addressUsername,
        loading: false,
        error: null
      }))
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  loadAllPosts = async (page = 1, limit = this.state.pageLimit) => {
    try {
      if (this.state.loading) {
        throw new Error('Already loading data')
      }

      this.setState({ loading: true })

      if (!this.props.initialised) {
        throw new Error('Web3 or contract is not initialised')
      }

      const { getPostCount, getPostAtIndex } = this.props.contract
      const postPromises = []
      const count = await getPostCount()
      const total = count.toNumber()

      if (total) {
        const start = Math.max(total - 1 - (page - 1) * limit, 0)
        const end = Math.max(start - (limit - 1), 0)

        for (let i = start; i >= end; i--) {
          postPromises.push(getPostAtIndex(i).then(this.formatPost))
        }
      }

      const posts = await Promise.all(postPromises)

      this.setState(prevState => ({
        total,
        pageLimit: limit,
        posts: [...prevState.posts, ...posts],
        loading: false,
        error: null
      }))
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  loadMorePosts = () => {
    if (
      this.state.posts.length &&
      this.state.posts.length >= this.state.total
    ) {
      this.setState({
        error: new Error('All posts already loaded')
      })
    } else {
      const page = this.state.posts.length / this.state.pageLimit + 1

      if (this.state.address) {
        this.loadUserPosts(this.state.address, page)
      } else {
        this.loadAllPosts(page)
      }
    }
  }

  createPost = async message => {
    try {
      if (this.state.loading) {
        throw new Error('Already loading data')
      }

      this.setState({ loading: true })

      if (!this.props.initialised) {
        throw new Error('Web3 or contract is not initialised')
      }

      await validateMessage(message)

      const { createPost } = this.props.contract
      const result = await createPost(message, {
        from: this.props.coinbase
      })

      this.setState({
        loading: false,
        error: null
      })

      return result
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  resetPosts = () => {
    this.setState({
      address: null,
      addressUsername: '',
      total: 0,
      posts: [],
      error: null
    })
  }

  render() {
    return (
      <BadVibesContext.Provider
        value={{
          state: this.state,
          actions: {
            join: this.join,
            loadAllPosts: this.loadAllPosts,
            loadMyPosts: this.loadMyPosts,
            loadUserPosts: this.loadUserPosts,
            loadMorePosts: this.loadMorePosts,
            createPost: this.createPost,
            resetPosts: this.resetPosts
          }
        }}>
        {this.props.children}
      </BadVibesContext.Provider>
    )
  }
}

export default withWeb3(({ contract, coinbase, initialised }) => ({
  contract,
  coinbase,
  initialised
}))(BadVibesProvider)
