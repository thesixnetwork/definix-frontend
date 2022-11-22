import BigNumber from 'bignumber.js'
import Address from './Address'

class DefinixLibrary extends Address {
  factory

  constructor(_context, _factory) {
    super(_context)
    this.factory = _factory
  }

  // performs chained getAmountOut calculations on any number of pairs
  getAmountsOut = (
    amountIn,
    path, // internal view returns (] memory amounts)
  ) => {
    this._require(path.length >= 2, 'DefinixLibrary: INVALID_PATH')
    const feeRateDenominator = new BigNumber(10000)
    const fee = 25
    const amounts = []
    amounts.push(amountIn)
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === path[i + 1]) return false
      const reserves = this.getReserves(path[i], path[i + 1])
      const amountOut = this.getAmountOut(amounts[i], reserves.reserve0, reserves.reserve1, fee, feeRateDenominator)
      amounts.push(amountOut)
    }
    return amounts
  }

  getAmountsIn = (
    amountOut,
    path, // internal view returns (uint256[] memory amounts)
  ) => {
    this._require(path.length >= 2, 'DefinixLibrary: INVALID_PATH')
    const feeRateDenominator = new BigNumber(10000)
    const fee = 25

    const amounts = Array(path.length).fill(new BigNumber(0))
    amounts[amounts.length - 1] = amountOut
    for (let i = path.length - 1; i > 0; i--) {
      const reserves = this.getReserves(path[i - 1], path[i])
      amounts[i - 1] = this.getAmountIn(amounts[i], reserves.reserve0, reserves.reserve1, fee, feeRateDenominator)
    }
    return amounts
  }

  pairFor = (token0, token1) => {
    return this.factory.pairFor(token0, token1)
  }

  getReserves = (token0, token1) => {
    return this.factory.getReserves(token0, token1)
  }

  getAmountIn = (
    amountOut,
    reserveIn,
    reserveOut,
    fee,
    feeRateDenominator, // internal pure returns (uint256 amountIn)
  ) => {
    this._require(amountOut.isGreaterThan(0), 'DefinixLibrary: INSUFFICIENT_OUTPUT_AMOUNT')
    this._require(reserveIn.isGreaterThan(0) && reserveOut.isGreaterThan(0), 'DefinixLibrary: INSUFFICIENT_LIQUIDITY')
    const numerator = reserveIn.multipliedBy(amountOut).multipliedBy(feeRateDenominator)
    const denominator = reserveOut.minus(amountOut).multipliedBy(feeRateDenominator.minus(fee))
    const amountIn = numerator.dividedBy(denominator).plus(1)
    return amountIn
  }

  getAmountOut = (
    amountIn,
    reserveIn,
    reserveOut,
    fee,
    feeRateDenominator, //  internal pure returns (amountOut)
  ) => {
    this._require(amountIn.isGreaterThan(0), 'DefinixLibrary: INSUFFICIENT_INPUT_AMOUNT')
    this._require(reserveIn.isGreaterThan(0) && reserveOut.isGreaterThan(0), 'DefinixLibrary: INSUFFICIENT_LIQUIDITY')
    const amountInWithFee = amountIn.multipliedBy(feeRateDenominator.minus(fee))
    const numerator = amountInWithFee.multipliedBy(reserveOut)
    const denominator = reserveIn.multipliedBy(feeRateDenominator).plus(amountInWithFee)
    const amountOut = numerator.dividedBy(denominator)
    return amountOut
  }
}

export default DefinixLibrary
