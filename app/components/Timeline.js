import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Feed } from 'semantic-ui-react'

import { withWeb3 } from '../providers/web3'
import { getEmojiFromAddress } from '../utils/web3-helpers'

const Timeline = ({ coinbase, posts }) => (
  <Feed size="large">
    {posts.map(({ message, author, authorUsername }, index) => {
      const authorLink = {
        pathname: coinbase === author ? '/profile' : `/users/${author}`,
        state: {
          authorUsername
        }
      }

      return (
        <Feed.Event key={index}>
          <Feed.Label as={Link} to={authorLink}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'lightGray',
                borderRadius: '50%'
              }}>
              <span
                role="img"
                aria-label="User"
                style={{ fontSize: '1.6rem', height: '1.2rem' }}>
                {getEmojiFromAddress(author)}
              </span>
            </div>
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>{message}</Feed.Summary>
            <Feed.Meta as={Link} to={authorLink}>
              by <b>{coinbase === author ? 'you' : authorUsername || author}</b>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>
      )
    })}
  </Feed>
)

Timeline.propTypes = {
  coinbase: PropTypes.string.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired
    })
  ).isRequired
}

export default withWeb3(({ coinbase }) => ({ coinbase }))(Timeline)
