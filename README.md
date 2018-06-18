# 🖕 Bad Vibes

![Version - 0.0.1](https://img.shields.io/badge/version-0.0.1-brightgreen.svg)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style - Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Summary

A decentralised social network where we only allow offensive and negative content.

## Why?

Most dapp creators have very specific reasons why they want to create an app on decentralised infrastructure. Some apps require verifiability or ownership while others want to create an unstoppable platform. A large amount of dapps probably only want to benefit of the hype around blockchain and cryptocurrencies. Bad Vibes doesn't build on 1 of those properties, it will use and abuse all of them.

While this doesn't answer the question of why Bad Vibes should exist, it does answer the question of why it hasn't been build before ([does it?](https://github.com/wardoost/bad-vibes/issues/1)). The current generation of social media platforms have strong policies regarding which content can be posted. Bad Vibes has a very similar mechanic in content curation but works in the opposite way. So what makes this social media platform any different besides being aimed at negative content creation?

This experiment tries to challenge the way we think about uncensorable apps. All negative content will be tied to the users's account as long as the Ethereum blockchain exists. This is not true for Twitter or Facebook accounts even though it might seem like it is. This becomes very clear hen you look at the large amount of scam accounts that spam the comment section of high profile accounts within the cryptocurrency community on Twitter for example.

## MVP

### Authorisation

Users can log in to their account using [MetaMask](https://metamask.io/). Before a user can post they will have to register with a negative or offensive username.

### Content creation

When a user creates a post it is validated by the smart contract. If the content is marked as negative it will be saved in the contract.

### Content feed

The main content feed is a stream of all messages ever posted on the platform. You can also click a username to see all posts belonging to a user.

### Reporting system

In the future we might add a voting system that can change the way the smart contract approves content. This could lead to the platform only allowing mildly negative or even positive content!

## Beta Testing

A beta version is running on [IPFS](https://ipfs.io/) and the [Ropsten testnet](https://ropsten.etherscan.io/address/0xe4ab0ef28faf00d79e1cc49fbc5e4eb316f067bf): https://ipfs.io/ipfs/QmeMkcHQxwWRue4k1zHQ4es8i8yufvt9CqT31XzBBaH6TY

Read [this article](https://medium.com/@FairGameOnline/meta-mask-install-and-rosten-test-eth-request-guide-3fddf2c3df52) if you need guidance using MetaMask on the Ropsten testnet.

## Development

You will need to install [Node.js](https://nodejs.org/) and [Truffle](http://truffleframework.com/). Clone this repo and `cd` to the project directory in your command line. Start by installing JS dependencies with [npm](https://www.npmjs.com/)

```bash
npm install
```

Start a development blockchain using Truffle

```bash
truffle develop
```

Compile and deploy the smart contract

```bash
truffle compile && truffle migrate
```

Create a `.env` file in the root of the project and add your environment variables by following the example file `.env.example`. Start a development server for the frontend application using [Webpack](https://webpack.js.org/) dev server

```bash
npm start
```

## Deployment

Start up a geth client that is synced with the Ropsten blockchain following [this guide](https://medium.com/@guccimanepunk/how-to-deploy-a-truffle-contract-to-ropsten-e2fb817870c1). Make sure your Ropsten account has a little bit of ether which you can get for free at the [MetaMask Ether Faucet](https://faucet.metamask.io/) and run

```bash
truffle migrate --network ropsten
```

After the contract is succesfully deployed you can create a production build of the app with the build command

```bash
npm run build
```

Install [IPFS](https://ipfs.io/docs/install/) and upload this build to IPFS using

```bash
ipfs add -r ./build/app
```
