import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import DefinixFactory from './DefinixFactory'
import DefinixRouter from './DefinixRouter'
import RebalanceSwapper from './RebalanceSwapper'
import Context from './Context'
import Address from './Address'
import DefinixLibrary from './DefinixLibrary'
import { BNB, BUSD, getCustomLpNetwork } from '../config/constants/tokens'
import { customFactory, customInitCodeHash } from '../config/constants/rebalances'

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < (array.length || array.size); index++) {
    // eslint-disable-next-line
    await callback(array[index] || array.docs[index], index, array)
  }
}

const isBNB = (tokenData) => {
  return tokenData.symbol === 'BNB' || tokenData.symbol === 'WBNB'
}

const getLowerAddress = (address) => {
  return getAddress(address).toLowerCase()
}

const BUSDToken = {
  symbol: 'BUSD',
  address: BUSD,
}

const BNBToken = {
  symbol: 'BNB',
  address: BNB,
}

export const simulateInvest = async (tokens = []) => {
  if (tokens.length === 0) return []
  const notBnbToken = tokens.filter((token) => !isBNB(token))

  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)
  context.setFactory(factory)

  await factory.loadPair(
    getLowerAddress(
      getCustomLpNetwork(BNBToken.address, BUSDToken.address, customFactory.pancake, customInitCodeHash.pancake),
    ),
  )
  await asyncForEach(notBnbToken, async (token) => {
    await factory.loadPair(
      getLowerAddress(getCustomLpNetwork(token.address, BNBToken.address, token.factory, token.initCodeHash)),
    )
  })

  const user = new Address(context)
  await asyncForEach(tokens, async (token) => {
    user.balances[getLowerAddress(token.address)] = token.balance
  })

  const swapper = new RebalanceSwapper(context)

  await asyncForEach(tokens, async (token) => {
    user.safeTransfer(getLowerAddress(token.address), swapper, new BigNumber(token.value))
  })

  let poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(BUSDToken.address),
    getLowerAddress(BNBToken.address),
    tokens.map(() => router),
  )
  let poolAmounts = swapper.getCurrentPoolAmount([...tokens.map((token) => getLowerAddress(token.address))])

  swapper.rebalanceFund(
    getLowerAddress(BUSDToken.address),
    getLowerAddress(BNBToken.address),
    [...tokens.map((token) => getLowerAddress(token.address))],
    tokens.map(() => router),
    [...tokens.map((token) => new BigNumber(token.ratioPoint))],
    BigNumber.sum.apply(null, [...tokens.map((token) => new BigNumber(token.ratioPoint))]),
  )

  poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(BUSDToken.address),
    getLowerAddress(BNBToken.address),
    [...tokens.map((token) => getLowerAddress(token.address))],
  )
  poolAmounts = swapper.getCurrentPoolAmount([...tokens.map((token) => getLowerAddress(token.address))])
  return [poolUSDBalances, poolAmounts]
}

export const simulateWithdraw = async (userInput, tokens = [], totalPoolSupply, allAsset = false) => {
  if (tokens.length === 0) return []
  const notBnbToken = tokens.filter((token) => !isBNB(token))

  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)
  context.setFactory(factory)

  await factory.loadPair(
    getLowerAddress(
      getCustomLpNetwork(BNBToken.address, BUSDToken.address, customFactory.pancake, customInitCodeHash.pancake),
    ),
  )
  await asyncForEach(notBnbToken, async (token) => {
    await factory.loadPair(
      getLowerAddress(getCustomLpNetwork(token.address, BNBToken.address, token.factory, token.initCodeHash)),
    )
  })

  const pebUnit = new BigNumber(10).pow(18)

  const userRemoveLP = (userInput || new BigNumber(0)).multipliedBy(pebUnit)
  const feePercentage = new BigNumber(0)
  const totalLP = userRemoveLP.multipliedBy(new BigNumber(100).minus(feePercentage)).dividedBy(new BigNumber(100))

  const totalSupply = new BigNumber(totalPoolSupply)
  const share = totalLP.dividedBy(totalSupply)

  const pool = new Address(context)
  tokens.forEach((token) => {
    pool.balances[getLowerAddress(token.address)] = new BigNumber(token.totalBalance.toJSON())
  })

  if (allAsset) {
    const user = new Address(context)
    tokens.forEach((token) => {
      const currentAmount = pool.balances[getLowerAddress(token.address)].multipliedBy(share)
      user.balances[getLowerAddress(token.address)] = currentAmount
    })
    let totalUSDAmount_ = 0
    if (userInput) {
      tokens.forEach((token) => {
        totalUSDAmount_ += router.getAmountsOut(user.balances[getLowerAddress(token.address)], [
          getLowerAddress(token.address),
          getLowerAddress(BNBToken.address),
          getLowerAddress(BUSDToken.address),
        ])
      })
    }
    return [
      [[], totalUSDAmount_],
      tokens.map((token) => {
        return pool.balances[getLowerAddress(token.address)].multipliedBy(share)
      }),
    ]
  }
  const swapper = new RebalanceSwapper(context)
  tokens.forEach((token) => {
    pool.safeTransfer(
      getLowerAddress(token.address),
      swapper,
      pool.balances[getLowerAddress(token.address)].multipliedBy(share),
    )
  })

  let poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(BNBToken.address),
    [...tokens.map((token) => getLowerAddress(token.address))],
    tokens.map(() => router),
  )
  let poolAmounts = swapper.getCurrentPoolAmount([...tokens.map((token) => getLowerAddress(token.address))])

  swapper.rebalanceFund(
    getLowerAddress(BUSDToken.address),
    getLowerAddress(BNBToken.address),
    [...tokens.map((token) => getLowerAddress(token.address))],
    tokens.map(() => router),
    [...tokens.map((token) => (token.isSelected ? new BigNumber(1000) : new BigNumber(0)))],
    BigNumber.sum.apply(null, [...tokens.map((token) => new BigNumber(token.isSelected ? 1000 : 0))]),
  )

  poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(BUSDToken.address),
    getLowerAddress(BNBToken.address),
    [...tokens.map((token) => getLowerAddress(token.address))],
  )
  poolAmounts = swapper.getCurrentPoolAmount([...tokens.map((token) => getLowerAddress(token.address))])
  return [poolUSDBalances, poolAmounts]
}

// simulateSwapper()
// simulateRemoveFund()
