import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Message, Input, Button } from 'semantic-ui-react'

import { withBadVibes } from '../providers/bad-vibes'

class Join extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.instanceOf(Error),
    join: PropTypes.func.isRequired
  }

  state = {
    username: ''
  }

  join = () => {
    this.props.join(this.state.username)
  }

  render() {
    return (
      <Fragment>
        {this.props.error && (
          <Message negative>{this.props.error.message}</Message>
        )}
        <h1>
          Choose your shitty username wisely, you won't be able to change it
          anymore
        </h1>
        <Form>
          <Form.Field>
            <Input
              placeholder="Your shitty username"
              value={this.state.username}
              onChange={evt => this.setState({ username: evt.target.value })}
              error={Boolean(this.props.error)}
              size="big"
              action
              fluid>
              <input />
              <Button
                type="submit"
                onClick={this.join}
                disabled={!this.state.username}
                loading={this.props.loading}
                size="big">
                Join
              </Button>
            </Input>
          </Form.Field>
        </Form>
      </Fragment>
    )
  }
}

export default withBadVibes(
  ({ loading, error }) => ({ loading, error }),
  ({ join }) => ({ join })
)(Join)
