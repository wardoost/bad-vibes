import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Header, Form, Message, Input, Button } from 'semantic-ui-react'

import { withContract } from '../providers/contract'
import Layout from '../components/Layout'

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
        <Layout.Header>
          <Header as="h1">
            Choose your shitty username wisely, you won't be able to change it
            anymore
          </Header>
        </Layout.Header>
        <Layout.Content>
          {this.props.error && (
            <Message negative>{this.props.error.message}</Message>
          )}
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
        </Layout.Content>
      </Fragment>
    )
  }
}

export default withContract(
  ({ loading, error }) => ({ loading, error }),
  ({ join }) => ({ join })
)(Join)
