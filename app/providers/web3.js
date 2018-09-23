import React, { Component, createContext } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import Contract from 'truffle-contract'

import { connectContext } from '../core/react-helpers'
import { getCoinbase } from '../core/web3-helpers'

// Create context with React Context API
export const Web3Context = createContext()

// Export HOC to connect state and actions to any child component
export const withWeb3 = connectContext(Web3Context)

// Create provider which holds all state and actions
export default class Web3Provider extends Component {
  static propTypes = {
    contract: PropTypes.object,
    children: PropTypes.node
  }

  state = {
    web3: null,
    contract: null,
    coinbase: null,
    initialised: false,
    loading: true,
    error: null
  }

  componentDidMount() {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', dispatch => {
      let web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        web3 = new Web3(web3.currentProvider)

        console.log('Injected web3 detected')

        this.initialise(web3)
      } else {
        // Fallback to localhost if no web3 injection. We've configured this to
        // use the development console's port by default.
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:9545'
        )

        web3 = new Web3(provider)

        console.log('No web3 instance injected, using local web3')

        this.initialise(web3)
      }
    })
  }

  initialise = async web3 => {
    try {
      const coinbase = await getCoinbase(web3)
      let contract = null

      if (this.props.contract) {
        const instance = Contract(this.props.contract)
        instance.setProvider(web3.currentProvider)
        contract = await instance.deployed()
      }

      this.setState({
        web3,
        contract,
        coinbase,
        initialised: true,
        loading: false,
        error: null
      })

      web3.currentProvider.publicConfigStore.on(
        'update',
        ({ selectedAddress }) => {
          this.setState({ coinbase: selectedAddress })
        }
      )
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  render() {
    return (
      <Web3Context.Provider
        value={{
          state: this.state,
          actions: {}
        }}>
        {this.props.children}
      </Web3Context.Provider>
    )
  }
}
