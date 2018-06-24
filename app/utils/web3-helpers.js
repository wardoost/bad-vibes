export const getCoinbase = web3 => {
  return new Promise((resolve, reject) => {
    if (!web3) {
      reject(new Error('Web3 is not initialised'))
    } else {
      web3.eth.getCoinbase((error, coinbase) => {
        if (error) {
          reject(error)
        } else if (!coinbase) {
          reject(new Error('MetaMask locked'))
        } else {
          resolve(coinbase)
        }
      })
    }
  })
}

export const getEmojiFromAddress = address => {
  const emojis = [
    '👿',
    '👹',
    '😢',
    '😈',
    '💩',
    '🖕',
    '💀',
    '⛈',
    '😵',
    '🤬',
    '😠',
    '😭',
    '😡',
    '😖',
    '👺',
    '🌧',
    '🥀',
    '👎',
    '🤮',
    '🙅‍',
    '🍂',
    '😿',
    '💔'
  ]

  return emojis[parseInt(address) % emojis.length]
}
