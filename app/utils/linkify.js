import Linkify from 'linkify-it'
import tlds from 'tlds'

const linkify = new Linkify()

linkify
  .tlds(tlds) // Reload with full tlds list
  .tlds('onion', true) // Add unofficial `.onion` domain

export default linkify
