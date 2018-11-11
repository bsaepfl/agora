import Web3 from 'web3'

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        try {
          await window.ethereum.enable()
          resolve(web3)
        } catch (error) {
          reject(new Error('Dapp was not authorized'))
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider)
        resolve(web3)
      } else {
        reject(new Error('Could not find web3 instance, please install Metamask'))
      }
    })
  })

export default getWeb3
