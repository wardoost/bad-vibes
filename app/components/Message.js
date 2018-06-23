import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import linkify from '../utils/linkify'

export default class Message extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  }

  state = {
    originalMessage: '',
    formattedMessage: null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Format when the message changes
    if (nextProps.message !== prevState.originalMessage) {
      // Create clickable links
      const urlMatches = linkify.match(nextProps.message)

      return {
        originalMessage: nextProps.message,
        formattedMessage: !urlMatches
          ? nextProps.message
          : urlMatches.reduce((acc, match, index) => {
              const isFirstMatch = index - 1 < 0
              const isLastMatch = index + 1 === urlMatches.length
              const startIndex = isFirstMatch
                ? 0
                : urlMatches[index - 1].lastIndex

              return [
                ...acc,
                nextProps.message.slice(startIndex, match.index),
                <a key={index} href={match.url} target="_blank">
                  {match.text}
                </a>,
                isLastMatch ? nextProps.message.slice(match.lastIndex) : null
              ]
            }, [])
      }
    }
  }

  render() {
    return <Fragment>{this.state.formattedMessage}</Fragment>
  }
}
