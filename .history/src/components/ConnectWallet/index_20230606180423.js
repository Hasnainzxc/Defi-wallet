import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import { providers } from 'ethers'
import Web3Modal from 'web3modal'

const maticChainValues = [
  {
    int: 137,
    hex: '0x89',
    network: 'mainnet',
  },
]

/* WALLET ADAPTER VIA WALLETCONNECT */
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // required
    },
  },
}

let web3ModalMatic

const initialState = {
  matic: {
    address: null,
    addressCheckSum: null,
    chainId: null,
    provider: null,
    web3: null,
    web3Provider: null,
    chainError: false,
    network: '',
  },
}

function reducer(state, action) {
  let chain = {}
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      chain = maticChainValues.find((chain) => chain.int === action.chainId)

      return {
        ...state,
        matic: {
          address: action.address.toLowerCase(),
          addressCheckSum: action.address,
          chainId: chain.chainId,
          provider: action.provider,
          web3: action.web3,
          web3Provider: action.web3Provider,
          network: chain.network,
        },
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        matic: {
          address: action.address.toLowerCase(),
          addressCheckSum: action.address,
        },
      }
    case 'SET_CHAIN_ID':
      chain = maticChainValues.find((chain) => chain.int === action.chainId)

      return {
        ...state,
        matic: {
          chainId: action.chainId,
          network: chain.network,
        },
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    case 'SET_CHAIN_ERROR':
      return {
        ...initialState,
        matic: {
          chainError: true,
        },
      }
    default:
      throw new Error()
  }
}

/* END WALLET ADAPTER */

const MaticContext = createContext({
  address: '',
  web3: '',
  connect: () => {},
  disconnect: () => {},
  chainError: false,
})

export function MaticAdapterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, address, web3, chainError, network } = state.matic

  /* WALLET ADAPTER VIA WALLETCONNECT */
  if (!web3ModalMatic && typeof window !== 'undefined') {
    web3ModalMatic = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions,
    })
  }

  const connect = useCallback(async function () {
    // await disconnect()
    const useChain = maticChainValues[0]

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: useChain.hex }], // chainId in hexadecimal
      })
    }

    let provider = await detectEthereumProvider()
    let web3Provider, signer, address, network, web3

    if (provider) {
      web3Provider = new providers.Web3Provider(provider)
    } else {
      await web3ModalMatic.clearCachedProvider()
      provider = await web3ModalMatic.connect()
      web3Provider = new providers.Web3Provider(provider)
    }

    try {
      signer = web3Provider.getSigner()
      address = await signer.getAddress()
      network = await web3Provider.getNetwork()
      web3 = new Web3(provider)

      const checkChain = maticChainValues.find((chain) => chain.int === network.chainId)

      if (!network || !checkChain) {
        await web3ModalMatic.clearCachedProvider()
        dispatch({
          type: 'SET_CHAIN_ERROR',
          chainError: true,
        })
      } else {
        dispatch({
          type: 'SET_WEB3_PROVIDER',
          provider,
          web3Provider,
          address,
          web3,
          chainId: network.chainId,
          chainError: false,
        })
      }
    } catch (err) {
      await web3ModalMatic.clearCachedProvider()
      provider = await web3ModalMatic.connect()
      connect()
    }
  }, [])

  const disconnect = useCallback(
    async function () {
      await web3ModalMatic.clearCachedProvider()

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('walletconnect')
        window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
      }

      if (provider?.on) {
        await web3ModalMatic.clearCachedProvider()
        if (provider?.disconnect && typeof provider.disconnect === 'function') {
          await provider.disconnect()
        }
        dispatch({
          type: 'RESET_WEB3_PROVIDER',
        })
      }
    },
    [provider]
  )

  useEffect(() => {
    if (web3ModalMatic.cachedProvider) {
      connect()
    }
  }, [connect])

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        connect()
      }

      const handleChainChanged = async (_hexChainId) => {
        window.location.reload() // documentation strongly recommend reloading the page
        const chainToInt = parseInt(_hexChainId, 16)
        const chain = maticChainValues.find((chain) => chain.int === chainToInt)

        if (chain) {
          dispatch({
            type: 'SET_CHAIN_ID',
            chainId: chain.int,
          })
        }
      }

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  useEffect(() => {
    connect()
  }, [])

  return (
    <MaticContext.Provider value={{ address, connect, disconnect, web3, chainError, network }}>
      <>{children}</>
    </MaticContext.Provider>
  )
}

export function useMaticAdapterContext() {
  return useContext(MaticContext)
}
