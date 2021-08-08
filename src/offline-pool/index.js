import BigNumber from 'bignumber.js'
import DefinixFactory from './DefinixFactory'
import DefinixRouter from './DefinixRouter'
import RebalanceSwapper from './RebalanceSwapper'
import Context from './Context'
import Address from './Address'
import DefinixLibrary from './DefinixLibrary'

const _SIX = '0xfD7ce123dc38cDe88041a5d42ffBEc99B5B5363c'
const _KUSDT = '0x72f58bF36Ce713D408a854C060FbF89A25F87C4C'
const _WKLAY = '0xf223E26B018AE1917E84DD73b515620e36a75596'

// const main = async () => {
//   const context = new Context()
//
//   const factory = new DefinixFactory(context)
//   const library = new DefinixLibrary(context, factory)
//   const router = new DefinixRouter(context, library)
//
//   await factory.loadPair('0xAe40cBE28F034C3DD2ECbe7ECf653B89fAb0665d')
//
//   const pair = library.pairFor(_SIX, _KUSDT)
//
//   console.log('pair', JSON.stringify(pair, undefined, '    '))
//
//   const amountOut = library.getAmountsOut(new BigNumber(10 * Math.pow(10, 18)), [_SIX, _KUSDT])
//   console.log('amountOut', amountOut[1].dividedBy(Math.pow(10, 18)).toFixed())
//   const user = new Address(context)
//   user.balances[_SIX] = new BigNumber(10 * Math.pow(10, 18))
//   user.balances[_KUSDT] = new BigNumber(0)
//   console.log('USER : _KUSDT : ', user.getBalance(_KUSDT).toFixed())
//   console.log('PAIR : _SIX : ', pair.getBalance(_SIX).dividedBy(Math.pow(10, 18)).toFixed())
//   console.log('PAIR : _KUSDT : ', pair.getBalance(_KUSDT).dividedBy(Math.pow(10, 18)).toFixed())
//
//   router.swapExactTokensForTokens(new BigNumber(10 * Math.pow(10, 18)), 0, [_SIX, _KUSDT], user, user)
//
//   // console.log(pair.getBalance(_KUSDT))
//   console.log('USER : _KUSDT : ', user.getBalance(_KUSDT).dividedBy(Math.pow(10, 18)).toFixed())
//   console.log('PAIR : _SIX : ', pair.getBalance(_SIX).dividedBy(Math.pow(10, 18)).toFixed())
//   console.log('PAIR : _KUSDT : ', pair.getBalance(_KUSDT).dividedBy(Math.pow(10, 18)).toFixed())
// }

const simulateSwapper = async () => {
  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)

  await factory.loadPair('0xAe40cBE28F034C3DD2ECbe7ECf653B89fAb0665d')
  await factory.loadPair('0x2d9e61CFD6620b42Cf55f76c7C0D647909bA415F')

  // Mockup user
  const user = new Address(context)
  user.balances[_SIX] = new BigNumber(10).times(new BigNumber(10).pow(18))
  user.balances[_KUSDT] = new BigNumber(10).times(new BigNumber(10).pow(18))
  user.balances[_WKLAY] = new BigNumber(0)

  const swapper = new RebalanceSwapper(context)
  user.safeTransfer(_SIX, swapper, new BigNumber(10).times(new BigNumber(10).pow(18)))
  user.safeTransfer(_KUSDT, swapper, new BigNumber(10).times(new BigNumber(10).pow(18)))

  let poolUSDBalances = swapper.getCurrentPoolUSDBalance(_KUSDT, [_SIX, _WKLAY], [router, router])
  let poolAmounts = swapper.getCurrentPoolAmount(_KUSDT, [_SIX, _WKLAY])

  console.log('poolUSDBalances', JSON.stringify(poolUSDBalances, null, '   '))
  console.log('poolAmounts', JSON.stringify(poolAmounts, null, '   '))

  swapper.rebalanceFund(
    _KUSDT,
    [_SIX, _WKLAY],
    [router, router],
    [new BigNumber(1000), new BigNumber(1000)],
    new BigNumber(1000),
    new BigNumber(3000),
  )

  poolUSDBalances = swapper.getCurrentPoolUSDBalance(_KUSDT, [_SIX, _WKLAY], [router, router])
  poolAmounts = swapper.getCurrentPoolAmount(_KUSDT, [_SIX, _WKLAY])
  // console.log("Total USD",poolUSDBalances[1].dividedBy(Math.pow(10,18)).toFixed())
  console.log('poolUSDBalances', JSON.stringify(poolUSDBalances, null, '   '))
  console.log('poolAmounts', JSON.stringify(poolAmounts, null, '   '))
}

const simulateRemoveFund = async () => {
  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)

  await factory.loadPair('0xAe40cBE28F034C3DD2ECbe7ECf653B89fAb0665d')
  await factory.loadPair('0x2d9e61CFD6620b42Cf55f76c7C0D647909bA415F')

  const pebUnit = new BigNumber(10).pow(18)

  const userRemoveLP = new BigNumber(10).multipliedBy(pebUnit)
  const feePercentage = new BigNumber(0)
  const totalLP = userRemoveLP.multipliedBy(new BigNumber(100).minus(feePercentage)).dividedBy(new BigNumber(100))

  const totalSupply = new BigNumber('392250035446448577755')
  const share = totalLP.dividedBy(totalSupply)

  // Mockup pool
  const pool = new Address(context)
  pool.balances[_SIX] = new BigNumber('357765453918320044471')
  pool.balances[_KUSDT] = new BigNumber('120175680570644739087')
  pool.balances[_WKLAY] = new BigNumber('41641151321439997580')

  const sixAmount = pool.balances[_SIX].multipliedBy(share)
  const kusdtAmount = pool.balances[_KUSDT].multipliedBy(share)
  const wklayAmount = pool.balances[_WKLAY].multipliedBy(share)

  const allAsset = false
  if (allAsset) {
    console.log('SIX Amount: ', sixAmount.dividedBy(pebUnit).toFixed())
    console.log('KUSDT Amount: ', kusdtAmount.dividedBy(pebUnit).toFixed())
    console.log('WKLAY Amount: ', wklayAmount.dividedBy(pebUnit).toFixed())
  } else {
    const swapper = new RebalanceSwapper(context)
    pool.safeTransfer(_SIX, swapper, sixAmount)
    pool.safeTransfer(_KUSDT, swapper, kusdtAmount)
    pool.safeTransfer(_WKLAY, swapper, wklayAmount)

    let poolUSDBalances = swapper.getCurrentPoolUSDBalance(_KUSDT, [_SIX, _WKLAY], [router, router])
    let poolAmounts = swapper.getCurrentPoolAmount(_KUSDT, [_SIX, _WKLAY])

    console.log('poolUSDBalances', JSON.stringify(poolUSDBalances, null, '   '))
    console.log('poolAmounts', JSON.stringify(poolAmounts, null, '   '))

    swapper.rebalanceFund(
      _KUSDT,
      [_SIX, _WKLAY],
      [router, router],
      [new BigNumber(2000), new BigNumber(1000)],
      new BigNumber(0),
      new BigNumber(3000),
    )

    poolUSDBalances = swapper.getCurrentPoolUSDBalance(_KUSDT, [_SIX, _WKLAY], [router, router])
    poolAmounts = swapper.getCurrentPoolAmount(_KUSDT, [_SIX, _WKLAY])

    console.log('poolUSDBalances', JSON.stringify(poolUSDBalances, null, '   '))
    console.log('poolAmounts', JSON.stringify(poolAmounts, null, '   '))
  }
}

export const simulateInvest = (tokens = []) => {
  const testtokens = [
    {
      symbol: 'SIX',
      address: 'xx',
      amount: '20',
    },
  ]
  console.log(testtokens)
  const context = new Context()

  const factory = new DefinixFactory(context)
  const library = new DefinixLibrary(context, factory)
  const router = new DefinixRouter(context, library)

  await factory.loadPair('0xAe40cBE28F034C3DD2ECbe7ECf653B89fAb0665d')
  await factory.loadPair('0x2d9e61CFD6620b42Cf55f76c7C0D647909bA415F')

  // Mockup user
  const user = new Address(context)
  user.balances[_SIX] = new BigNumber(10).times(new BigNumber(10).pow(18))
  user.balances[_KUSDT] = new BigNumber(10).times(new BigNumber(10).pow(18))
  user.balances[_WKLAY] = new BigNumber(0)

  const swapper = new RebalanceSwapper(context)
  user.safeTransfer(_SIX, swapper, new BigNumber(10).times(new BigNumber(10).pow(18)))
  user.safeTransfer(_KUSDT, swapper, new BigNumber(10).times(new BigNumber(10).pow(18)))

  let poolUSDBalances = swapper.getCurrentPoolUSDBalance(_KUSDT, [_SIX, _WKLAY], [router, router])
  let poolAmounts = swapper.getCurrentPoolAmount(_KUSDT, [_SIX, _WKLAY])

  console.log('poolUSDBalances', JSON.stringify(poolUSDBalances, null, '   '))
  console.log('poolAmounts', JSON.stringify(poolAmounts, null, '   '))

  swapper.rebalanceFund(
    _KUSDT,
    [_SIX, _WKLAY],
    [router, router],
    [new BigNumber(1000), new BigNumber(1000)],
    new BigNumber(1000),
    new BigNumber(3000),
  )

  poolUSDBalances = swapper.getCurrentPoolUSDBalance(_KUSDT, [_SIX, _WKLAY], [router, router])
  poolAmounts = swapper.getCurrentPoolAmount(_KUSDT, [_SIX, _WKLAY])
  // console.log("Total USD",poolUSDBalances[1].dividedBy(Math.pow(10,18)).toFixed())
  console.log('poolUSDBalances', JSON.stringify(poolUSDBalances, null, '   '))
  console.log('poolAmounts', JSON.stringify(poolAmounts, null, '   '))
}
// simulateSwapper()
simulateRemoveFund()
