import BigNumber from 'bignumber.js'
import Address from './Address'
import Utils from './Utils'

class DefinixRouter extends Address {
  library

  constructor(_context, _library) {
    super(_context)
    this.library = _library
  }

  swapExactTokensForTokens = (amountIn, amountOutMin, path, from, to) => {
    const amounts = this.library.getAmountsOut(amountIn, path)
    this._require(
      amounts[amounts.length - 1].isGreaterThanOrEqualTo(amountOutMin),
      'DefinixRouter: INSUFFICIENT_OUTPUT_AMOUNT',
    )
    Utils.transferFrom(this.context, path[0], from, this.library.pairFor(path[0], path[1]), amounts[0])
    this._swap(amounts, path, to)
    return amounts
  }

  swapTokensForExactTokens = (
    amountOut,
    amountInMax,
    path,
    from,
    to, // external virtual override ensure(deadline) returns (uint256[] memory amounts)
  ) => {
    const amounts = this.library.getAmountsIn(amountOut, path)
    this._require(amounts[0].isLessThanOrEqualTo(amountInMax), 'DefinixRouter: EXCESSIVE_INPUT_AMOUNT')
    Utils.transferFrom(this.context, path[0], from, this.library.pairFor(path[0], path[1]), amounts[0])
    this._swap(amounts, path, to)
    return amounts
  }

  _swap = (amounts, path, _to) => {
    for (let i = 0; i < path.length - 1; i++) {
      const input = path[i]
      const output = path[i + 1]
      const pair = this.library.pairFor(input, output)
      const amountOut = amounts[i + 1]
      const [amount0Out, amount1Out] =
        input === pair.token0 ? [new BigNumber(0), amountOut] : [amountOut, new BigNumber(0)]

      const to = i < path.length - 2 ? pair : _to
      pair.swap(amount0Out, amount1Out, to)
    }
  }

  getAmountsOut = (amountIn, path) => {
    return this.library.getAmountsOut(amountIn, path)
  }

  getAmountsIn = (amountOut, path) => {
    return this.library.getAmountsIn(amountOut, path)
  }
}

export default DefinixRouter
