import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import DefinixFactory from './DefinixFactory'
import DefinixRouter from './DefinixRouter'
import RebalanceSwapper from './RebalanceSwapper'
import Context from './Context'
import Address from './Address'
import DefinixLibrary from './DefinixLibrary'
import { getLpNetwork } from '../config/constants/tokens'

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < (array.length || array.size); index++) {
    // eslint-disable-next-line
    await callback(array[index] || array.docs[index], index, array)
  }
}

const isStable = (tokenData) => {
  return tokenData.symbol === 'KUSDT' || tokenData.symbol === 'BUSD' || tokenData.symbol === 'USDT'
}

const getLowerAddress = (address) => {
  return getAddress(address).toLowerCase()
}

export const simulateInvest = async (tokens = []) => {
  if (tokens.length === 0) return []
  const stableTokenOnly = tokens.find((token) => isStable(token))
  const notStableToken = tokens.filter((token) => !isStable(token))

  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)
  context.setFactory(factory)

  await asyncForEach(notStableToken, async (token) => {
    await factory.loadPair(getLowerAddress(getLpNetwork(token.address, stableTokenOnly.address)))
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
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
  )
  let poolAmounts = swapper.getCurrentPoolAmount(getLowerAddress(stableTokenOnly.address), [
    ...notStableToken.map((token) => getLowerAddress(token.address)),
  ])

  swapper.rebalanceFund(
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
    [...notStableToken.map((token) => new BigNumber(token.ratioPoint))],
    new BigNumber(stableTokenOnly.ratioPoint),
    BigNumber.sum.apply(null, [
      ...notStableToken.map((token) => new BigNumber(token.ratioPoint)),
      new BigNumber(stableTokenOnly.ratioPoint),
    ]),
  )

  poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
  )

  poolAmounts = swapper.getCurrentPoolAmount(getLowerAddress(stableTokenOnly.address), [
    ...notStableToken.map((token) => getLowerAddress(token.address)),
  ])

  return [poolUSDBalances, poolAmounts]
}

export const simulateWithdraw = async (userInput, tokens = [], totalPoolSupply, allAsset = false) => {
  if (tokens.length === 0) return []
  const stableTokenOnly = tokens.find((token) => isStable(token))
  const notStableToken = tokens.filter((token) => !isStable(token))

  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)
  context.setFactory(factory)

  await asyncForEach(notStableToken, async (token) => {
    await factory.loadPair(getLowerAddress(getLpNetwork(token.address, stableTokenOnly.address)))
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
    if (userInput) {
      notStableToken.forEach((token) => {
        router.swapExactTokensForTokens(
          user.balances[getLowerAddress(token.address)],
          0,
          [getLowerAddress(token.address), getLowerAddress(stableTokenOnly.address)],
          pool,
          user,
        )
      })
    }

    return [
      [[], user.balances[getLowerAddress(stableTokenOnly.address)]],
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
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
  )
  let poolAmounts = swapper.getCurrentPoolAmount(getLowerAddress(stableTokenOnly.address), [
    ...notStableToken.map((token) => getLowerAddress(token.address)),
  ])

  swapper.rebalanceFund(
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
    [...notStableToken.map((token) => (token.isSelected ? new BigNumber(token.ratioPoint) : new BigNumber(0)))],
    new BigNumber(stableTokenOnly.isSelected ? stableTokenOnly.ratioPoint : new BigNumber(0)),
    BigNumber.sum.apply(null, [
      ...notStableToken.map((token) => new BigNumber(token.isSelected ? token.ratioPoint : 0)),
      new BigNumber(stableTokenOnly.isSelected ? stableTokenOnly.ratioPoint : 0),
    ]),
  )

  poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
  )
  poolAmounts = swapper.getCurrentPoolAmount(getLowerAddress(stableTokenOnly.address), [
    ...notStableToken.map((token) => getLowerAddress(token.address)),
  ])
  return [poolUSDBalances, poolAmounts]
}

export const getReserves = async (tokens = []) => {
  // eslint-disable-next-line
  // debugger
  if (tokens.length === 0) return []
  const stableTokenOnly = tokens.find((token) => isStable(token))
  const notStableToken = tokens.filter((token) => !isStable(token))

  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)
  context.setFactory(factory)

  await asyncForEach(notStableToken, async (token) => {
    await factory.loadPair(getLowerAddress(getLpNetwork(token.address, stableTokenOnly.address)))
  })

  const user = new Address(context)
  await asyncForEach(tokens, async (token) => {
    user.balances[getLowerAddress(token.address)] = token.balance
  })

  const swapper = new RebalanceSwapper(context)

  await asyncForEach(tokens, async (token) => {
    user.safeTransfer(getLowerAddress(token.address), swapper, new BigNumber(token.value))
  })

  const poolUSDBalances = swapper.getCurrentPoolUSDBalance(
    getLowerAddress(stableTokenOnly.address),
    [...notStableToken.map((token) => getLowerAddress(token.address))],
    notStableToken.map(() => router),
  )

  return poolUSDBalances
}

// simulateSwapper()
// simulateRemoveFund()
