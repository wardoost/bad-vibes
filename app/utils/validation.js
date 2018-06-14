const getSentiment = async string => {
  if (!string) {
    throw new Error(`String is empty`)
  }

  const response = await fetch(
    `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${
      process.env.GOOGLE_API_KEY
    }`,
    {
      method: 'POST',
      body: JSON.stringify({
        document: {
          content: string,
          type: 'PLAIN_TEXT'
        }
      })
    }
  )

  // TODO: add bonus for all caps messages
  // TODO: add bonus for negative emojis

  const result = await response.json()
  return result.documentSentiment.score
}

export const validateMessage = async message => {
  const sentiment = await getSentiment(message)

  if (sentiment >= 0) {
    throw new Error('Message is too positive')
  }

  return true
}

export const validateUsername = async username => {
  const sentiment = await getSentiment(username)

  if (sentiment >= 0) {
    throw new Error('Username sounds too nice')
  }

  return true
}
