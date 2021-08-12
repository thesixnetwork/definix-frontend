import BigNumber from 'bignumber.js'
import Address from './Address'
import Utils from './Utils'

class DefinixPair extends Address {
  symbol0

  symbol1

  decimals0

  decimals1

  token0

  token1

  reserve0

  reserve1

  init = (_symbol0, _symbol1, _token0, _token1, _decimals0, _decimals1, _balance0, _balance1, _reserve0, _reserve1) => {
    this.symbol0 = _symbol0
    this.symbol1 = _symbol1
    this.decimals0 = _decimals0
    this.decimals1 = _decimals1
    this.token0 = _token0
    this.token1 = _token1
    this.balances[_token0] = _balance0
    this.balances[_token1] = _balance1
    this.reserve0 = _reserve0
    this.reserve1 = _reserve1
  }

  // constructor(_context) {
  //   super(_context)
  // }

  initFromPair = async (_pairAddress) => {
    const pairData = await Utils.getPairData(_pairAddress)

    this.symbol0 = pairData.symbol0
    this.symbol1 = pairData.symbol1
    this.decimals0 = pairData.decimals0
    this.decimals1 = pairData.decimals1
    this.token0 = pairData.token0
    this.token1 = pairData.token1
    this.balances[pairData.token0] = new BigNumber(pairData.balanceOf0 * 1)
    this.balances[pairData.token1] = new BigNumber(pairData.balanceOf1 * 1)
    this.reserve0 = new BigNumber(pairData.reserve0)
    this.reserve1 = new BigNumber(pairData.reserve1)
  }

  swap = (amount0Out, amount1Out, to) => {
    this._require(amount0Out.isGreaterThan(0) || amount1Out.isGreaterThan(0), 'Definix: INSUFFICIENT_OUTPUT_AMOUNT')
    this._require(
      amount0Out.isLessThan(this.reserve0) && amount1Out.isLessThan(this.reserve1),
      'Definix: INSUFFICIENT_LIQUIDITY',
    )
    // console.log(JSON.stringify(this.balances))
    if (amount0Out > 0) this.safeTransfer(this.token0, to, amount0Out) // optimistically transfer tokens
    if (amount1Out > 0) this.safeTransfer(this.token1, to, amount1Out) // optimistically transfer tokens

    const balance0 = this.getBalance(this.token0)
    const balance1 = this.getBalance(this.token1)

    const amount0In = balance0.minus(this.reserve0.minus(amount0Out))
    const amount1In = balance1.minus(this.reserve1.minus(amount1Out))
    this._require(amount0In.isGreaterThan(0) || amount1In.isGreaterThan(0), 'Definix: INSUFFICIENT_INPUT_AMOUNT')
    // this.checkBalanceAdjust(
    //   amount0Out,
    //   amount1Out,
    //   amount0In,
    //   amount1In,
    //   this.reserve0,
    //   this.reserve1,
    //   balance0,
    //   balance1,
    // )
    this._update(balance0, balance1, this.reserve0, this.reserve1)
  }

  _update = (balance0, balance1) => {
    this.reserve0 = balance0
    this.reserve1 = balance1
  }

  checkBalanceAdjust = (amount0Out, amount1Out, amount0In, amount1In, _reserve0, _reserve1, balance0, balance1) => {
    const _feeRateDenominator = 10000
    const balance0Adjusted = balance0.multipliedBy(_feeRateDenominator).minus(amount0In.multipliedBy(25))
    const balance1Adjusted = balance1.multipliedBy(_feeRateDenominator).minus(amount1In.multipliedBy(25))
    this._require(
      balance0Adjusted
        .multipliedBy(balance1Adjusted)
        .isGreaterThanOrEqualTo(_reserve0.multipliedBy(_reserve1).multipliedBy(_feeRateDenominator ** 2)),
      'Definix: K',
    )
  }
}

export default DefinixPair
