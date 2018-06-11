import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'semantic-ui-react'

import { withBadVibes } from '../providers/bad-vibes'
import { validateMessage } from '../utils/validation'

class CreatePost extends Component {
  static propTypes = {
    initialMessage: PropTypes.string,
    placeholder: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    createPost: PropTypes.func.isRequired
  }

  static defaultProps = {
    placeholder: 'Share a shitty message'
  }

  state = {
    message: this.props.initialMessage || '',
    error: null
  }

  createPost = async () => {
    let validationError

    try {
      await validateMessage(this.state.message)
    } catch (error) {
      validationError = error
    }

    if (!validationError) {
      const result = await this.props.createPost(this.state.message)
      console.log(result)
      this.setState({ message: '', error: null })
    } else {
      this.setState({ error: validationError })
    }
  }

  render() {
    return (
      <Fragment>
        <Form>
          <Form.Field>
            <Input
              placeholder={this.props.placeholder}
              value={this.state.message}
              onChange={evt => this.setState({ message: evt.target.value })}
              error={Boolean(this.props.error || this.state.error)}
              size="big"
              action
              fluid>
              <input />
              <Button
                type="submit"
                onClick={this.createPost}
                loading={this.props.loading}
                disabled={!this.state.message}
                size="big">
                Share
              </Button>
            </Input>
          </Form.Field>
        </Form>
        {this.state.error && (
          <p style={{ color: '#9f3a38' }}>{this.state.error.message}</p>
        )}
      </Fragment>
    )
  }
}

export default withBadVibes(
  ({ loading, error }) => ({ loading, error }),
  ({ createPost }) => ({
    createPost
  })
)(CreatePost)
