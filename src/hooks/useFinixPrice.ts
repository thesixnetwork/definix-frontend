import BigNumber from 'bignumber.js'
import { useCallback, useState, useEffect } from 'react'
import _ from 'lodash'
import { useActiveWeb3React } from './index'
import multicall from '../utils/multicall'
import { allTokenAddresses, getLpNetwork, MULTICALL_ADDRESS } from '../constants'
import erc20 from '../constants/abis/erc20.json'

const getTotalBalanceLp = async input => {
  const { lpAddress, pair1, pair2, multicallAddress } = input
  let pair1Amount = 0
  let pair2Amount = 0
  try {
    const calls = [
      {
        address: pair1,
        name: 'balanceOf',
        params: [lpAddress]
      },
      {
        address: pair2,
        name: 'balanceOf',
        params: [lpAddress]
      },
      {
        address: pair1,
        name: 'decimals'
      },
      {
        address: pair2,
        name: 'decimals'
      }
    ]

    const [pair1BalanceLP, pair2BalanceLP, pair1Decimals, pair2Decimals] = await multicall(
      multicallAddress,
      erc20,
      calls
    )

    pair1Amount = new BigNumber(pair1BalanceLP).div(new BigNumber(10).pow(pair1Decimals)).toNumber()
    pair2Amount = new BigNumber(pair2BalanceLP).div(new BigNumber(10).pow(pair2Decimals)).toNumber()
  } catch (error) {
    // console.log(error)
  }
  return [pair1Amount, pair2Amount]
}

const pairObjectCombination = inputObject => {
  const result = []
  const mark = {}
  Object.keys(inputObject).forEach(a => {
    Object.keys(inputObject).forEach(b => {
      if (a !== b) {
        if (!_.get(mark, `${a}.${b}`) && !_.get(mark, `${b}.${a}`)) {
          if (mark[a]) {
            mark[a][b] = true
          } else {
            mark[a] = { [b]: true }
          }
          // @ts-ignore
          result.push([a, b])
        }
      }
    })
  })
  return result
}

const findAndSelectPair = pair => {
  if (pair.indexOf('KUSDT') >= 0) {
    const firstKey = pair[0] === 'KUSDT' ? pair[1] : pair[0]
    const secondKey = pair[0] === 'KUSDT' ? pair[0] : pair[1]
    return [firstKey, secondKey]
  }
  if (pair.indexOf('FINIX') >= 0) {
    const firstKey = pair[0] === 'FINIX' ? pair[0] : pair[1]
    const secondKey = pair[0] === 'FINIX' ? pair[1] : pair[0]
    return [firstKey, secondKey]
  }
  return undefined
}

export default function useFinixPrice(): number {
  const [currentPrice, setCurrentPrice] = useState(0)
  const { chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '0') } = useActiveWeb3React()
  const multicallContractAddress = MULTICALL_ADDRESS[chainId || process.env.REACT_APP_CHAIN_ID || '56']
  const getAddress = useCallback(
    input => {
      try {
        return input[chainId]
      } catch {
        return undefined
      }
    },
    [chainId]
  )
  const fetchCurrentFinixPrice = useCallback(async () => {
    const allTokenCombinationKeys = pairObjectCombination(allTokenAddresses)
    const allFinixPair = allTokenCombinationKeys.filter(
      // @ts-ignore
      item => item.indexOf('FINIX') >= 0 || item.indexOf('KUSDT') >= 0
    )
    const sortedPair = _.compact(allFinixPair.map(pair => findAndSelectPair(pair)))
    const searchablePair = {}
    sortedPair.forEach((pair, index) => {
      if (!searchablePair[pair[0]]) {
        searchablePair[pair[0]] = {}
      }
      searchablePair[pair[0]][pair[1]] = index
    })
    const fetchPromise = []
    sortedPair.forEach(pair => {
      // @ts-ignore
      const [firstKey, secondKey] = findAndSelectPair(pair)
      const firstTokenAddress = allTokenAddresses[firstKey]
      const secondTokenAddress = allTokenAddresses[secondKey]
      fetchPromise.push(
        // @ts-ignore
        getTotalBalanceLp({
          lpAddress: getAddress(getLpNetwork(firstTokenAddress, secondTokenAddress)),
          pair1: getAddress(firstTokenAddress),
          pair2: getAddress(secondTokenAddress),
          multicallAddress: multicallContractAddress
        })
      )
    })
    const allFetchedData = await Promise.all(fetchPromise)
    const allRatio = allFetchedData.map(data => {
      if (data) {
        const ratio = data[1] / data[0] || 0
        return ratio
      }
      return undefined
    })
    const allPrices = allFetchedData.map((data, index) => {
      const currentPair = sortedPair[index]
      if (data && currentPair[0] === 'FINIX') {
        if (currentPair[1] === 'KUSDT') {
          return [allRatio[index], allFetchedData[index][1]]
        }
        const pairIndex = searchablePair[currentPair[1]].KUSDT
        // @ts-ignore
        return [allRatio[index] * allRatio[pairIndex], allFetchedData[index][1]]
      }
      return undefined
    })
    const availAllPrices = _.compact(allPrices)
    // @ts-ignore
    const calPrice = availAllPrices.reduce((sum, pair) => sum + pair[0] * pair[1], 0)
    // @ts-ignore
    const quoteSum = availAllPrices.reduce((sum, pair) => sum + pair[1], 0)
    const finixPrice = calPrice / quoteSum || 0
    setCurrentPrice(finixPrice)
  }, [getAddress, setCurrentPrice, multicallContractAddress])
  useEffect(() => {
    fetchCurrentFinixPrice()
  }, [fetchCurrentFinixPrice])
  return currentPrice || 0
}
