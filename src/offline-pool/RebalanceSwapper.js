import BigNumber from 'bignumber.js'
import Address from './Address'

class RebalanceSwapper extends Address {
  // constructor(_context) {
  //   super(_context)
  // }

  rebalanceFund = (usdToken, tokens, routers, tokenRatioPoints, usdTokenRatioPoint, totalRatioPoint) => {
    const [usdAmounts, totalUSDAmount] = this.getCurrentPoolUSDBalance(usdToken, tokens, routers)
    // debugger
    // sale first buy after
    for (let i = 0; i < usdAmounts.length - 1; i++) {
      const usdEachValue = totalUSDAmount.multipliedBy(tokenRatioPoints[i]).dividedBy(totalRatioPoint)
      if (usdAmounts[i].isGreaterThan(usdEachValue)) {
        // sell

        const paths = [tokens[i], usdToken]
        if (tokenRatioPoints[i].isEqualTo(0)) {
          // Deplete balance of the token
          const sellingBalance = this.getBalance(tokens[i])

          const amountOutMins = routers[i].getAmountsOut(sellingBalance, paths)

          routers[i].swapExactTokensForTokens(sellingBalance, amountOutMins[1], paths, this, this)
        } else {
          const amountOut = usdAmounts[i].minus(usdEachValue)

          const amountInMaxs = routers[i].getAmountsIn(amountOut, paths)
          routers[i].swapTokensForExactTokens(amountOut, amountInMaxs[0], paths, this, this)
        }
      }
    }

    let lastTokenWithAllocationIndex = usdAmounts.length - 2
    if (usdTokenRatioPoint.isEqualTo(0)) {
      for (let index = lastTokenWithAllocationIndex; index >= 0; index--) {
        if (tokenRatioPoints[index].isGreaterThan(0)) {
          lastTokenWithAllocationIndex = index
          break
        }
      }
    }

    for (let i = 0; i < usdAmounts.length - 1; i++) {
      const usdEachValue = totalUSDAmount.multipliedBy(tokenRatioPoints[i]).dividedBy(totalRatioPoint)

      const paths = [usdToken, tokens[i]]

      if (usdAmounts[i].isLessThan(usdEachValue)) {
        let amountIn = usdEachValue.minus(usdAmounts[i])
        if (i === lastTokenWithAllocationIndex && usdTokenRatioPoint.isEqualTo(0)) {
          amountIn = this.getBalance(usdToken)
        }
        // buy

        const amountOutMins = routers[i].getAmountsOut(amountIn, paths)
        routers[i].swapExactTokensForTokens(amountIn, amountOutMins[1], paths, this, this)
      }
    }
  }

  getCurrentPoolUSDBalance = (
    usdToken,
    tokens,
    routers, // public view returns (uint256[] memory, uint256)
  ) => {
    const amounts = Array(tokens.length).fill(new BigNumber(0))
    for (let index = 0; index < tokens.length; index++) {
      amounts[index] = this.getBalance(tokens[index])
    }
    const usdAmount = this.getBalance(usdToken)
    return this.getUSDBalance(amounts, usdAmount, usdToken, tokens, routers)
  }

  getUSDBalance = (
    amounts,
    usdAmount,
    usdToken,
    tokens,
    routers, // returns (uint256[] memory usdAmounts, uint256 totalUSDAmount)
  ) => {
    let totalUSDAmount = new BigNumber(0)
    const usdAmounts = Array(amounts.length + 1).fill(new BigNumber(0))
    for (let i = 0; i < amounts.length; i++) {
      if (amounts[i].isEqualTo(0)) {
        usdAmounts[i] = new BigNumber(0)
      } else {
        const paths = []
        paths.push(tokens[i])
        paths.push(usdToken)

        const amountOuts = routers[i].getAmountsOut(amounts[i], paths)
        totalUSDAmount = totalUSDAmount.plus(amountOuts[amountOuts.length - 1])
        usdAmounts[i] = amountOuts[amountOuts.length - 1]
      }
    }
    usdAmounts[usdAmounts.length - 1] = usdAmount
    totalUSDAmount = totalUSDAmount.plus(usdAmount)

    return [usdAmounts, totalUSDAmount]
  }

  getCurrentPoolAmount = (
    usdToken,
    tokens, // public // view
  ) =>
    // returns (uint256[] memory poolAmounts)
    {
      const poolAmounts = Array(tokens.length + 1).fill(0)
      for (let index = 0; index < tokens.length; index++) {
        poolAmounts[index] = this.getBalance(tokens[index])
      }
      const usdAmount = this.getBalance(usdToken)
      poolAmounts[poolAmounts.length - 1] = usdAmount
      return poolAmounts
    }
}

export default RebalanceSwapper
