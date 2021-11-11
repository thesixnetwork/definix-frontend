import BigNumber from 'bignumber.js'
import Address from './Address'

class RebalanceSwapper extends Address {
  // constructor(_context) {
  //   super(_context)
  // }

  rebalanceFund = (usdToken, WBNB, tokens, routers, tokenRatioPoints, totalRatioPoint) => {
    const [usdAmounts, totalUSDAmount] = this.getCurrentPoolUSDBalance(usdToken, WBNB, routers)
    // debugger
    // sale first buy after
    let isContainBNB = false
    let bnbRatioPoint = new BigNumber(0)
    for (let i = 0; i < usdAmounts.length; i++) {
      if (WBNB == tokens[i]) {
        isContainBNB = true
        bnbRatioPoint = tokenRatioPoints[i]
        continue
      }

      const usdEachValue = totalUSDAmount.multipliedBy(tokenRatioPoints[i]).dividedBy(totalRatioPoint)
      if (usdAmounts[i].isGreaterThan(usdEachValue)) {
        // sell

        const paths = [tokens[i], WBNB]
        if (tokenRatioPoints[i].isEqualTo(0)) {
          // Deplete balance of the token
          const sellingBalance = this.getBalance(tokens[i])

          const amountOutMins = routers[i].getAmountsOut(sellingBalance, paths)

          routers[i].swapExactTokensForTokens(sellingBalance, amountOutMins[1], paths, this, this)
        } else {
          let amountOut = usdAmounts[i].minus(usdEachValue)

          const pair = this.context.getFactory().pairFor(WBNB, usdToken)
          const _reserve0 = pair.reserve0
          const _reserve1 = pair.reserve1
          const token0 = pair.token0

          amountOut =
            token0 == WBNB
              ? amountOut.multipliedBy(_reserve0).dividedBy(_reserve1)
              : amountOut.multipliedBy(_reserve1).dividedBy(_reserve0)

          const amountInMaxs = routers[i].getAmountsIn(amountOut, paths)
          routers[i].swapTokensForExactTokens(amountOut, amountInMaxs[0], paths, this, this)
        }
      }
    }

    let lastTokenWithAllocationIndex = usdAmounts.length - 1
    if (!isContainBNB || bnbRatioPoint.isEqualTo(0)) {
      for (let index = lastTokenWithAllocationIndex; index >= 0; index--) {
        if (tokenRatioPoints[index].isGreaterThan(0)) {
          lastTokenWithAllocationIndex = index
          break
        }
      }
    }

    for (let i = 0; i < usdAmounts.length; i++) {
      if (WBNB == tokens[i]) {
        continue
      }
      if (tokenRatioPoints[i].isEqualTo(0)) {
        continue
      }

      const usdEachValue = totalUSDAmount.multipliedBy(tokenRatioPoints[i]).dividedBy(totalRatioPoint)

      const paths = [WBNB, tokens[i]]

      if (usdAmounts[i].isLessThan(usdEachValue)) {
        let amountIn = usdEachValue.minus(usdAmounts[i])
        if (i === lastTokenWithAllocationIndex && (!isContainBNB || bnbRatioPoint.isEqualTo(0))) {
          amountIn = this.getBalance(WBNB)
        } else {
          const pair = this.context.getFactory().pairFor(WBNB, usdToken)
          const _reserve0 = pair.reserve0
          const _reserve1 = pair.reserve1

          const token0 = pair.token0

          amountIn =
            token0 == WBNB
              ? amountIn.multipliedBy(_reserve0).dividedBy(_reserve1)
              : amountIn.multipliedBy(_reserve1).dividedBy(_reserve0)
        }
        // buy

        const amountOutMins = routers[i].getAmountsOut(amountIn, paths)
        routers[i].swapExactTokensForTokens(amountIn, amountOutMins[1], paths, this, this)
      }
    }
  }

  getCurrentPoolUSDBalance = (
    usdToken,
    WBNB,
    tokens, // public view returns (uint256[] memory, uint256)
  ) => {
    const amounts = Array(tokens.length).fill(new BigNumber(0))
    for (let index = 0; index < tokens.length; index++) {
      amounts[index] = this.getBalance(tokens[index])
    }
    return this.getUSDBalanceReserves(amounts, tokens, usdToken, WBNB)
  }

  getUSDBalanceReserves = (
    amounts,
    tokens,
    usdToken,
    WBNB, // returns (uint256[] memory usdAmounts, uint256 totalUSDAmount)
  ) => {
    let totalUSDAmount = new BigNumber(0)
    let usdAmounts = Array(amounts.length).fill(new BigNumber(0))
    for (let i = 0; i < amounts.length; i++) {
      let tokenBalance = new BigNumber(amounts[i])

      if (tokenBalance.isEqualTo(0)) {
        usdAmounts[i] = new BigNumber(0)
      } else {
        if (WBNB != tokens[i] && usdToken != tokens[i]) {
          const pair = this.context.getFactory().pairFor(WBNB, tokens[i])

          const _reserve0 = new BigNumber(pair.reserve0)
          const _reserve1 = new BigNumber(pair.reserve1)

          const token0 = pair.token0

          tokenBalance =
            token0 == WBNB
              ? tokenBalance.multipliedBy(_reserve0).dividedBy(_reserve1)
              : tokenBalance.multipliedBy(_reserve1).dividedBy(_reserve0)
        }

        if (usdToken != tokens[i]) {
          const pair = this.context.getFactory().pairFor(WBNB, usdToken)

          const _reserve0 = new BigNumber(pair.reserve0)
          const _reserve1 = new BigNumber(pair.reserve1)

          const token0 = pair.token0

          const amountInUSD =
            token0 == WBNB
              ? tokenBalance.multipliedBy(_reserve1).dividedBy(_reserve0)
              : tokenBalance.multipliedBy(_reserve0).dividedBy(_reserve1)

          totalUSDAmount = totalUSDAmount.plus(amountInUSD)
          usdAmounts[i] = amountInUSD
        } else {
          totalUSDAmount = totalUSDAmount.plus(tokenBalance)
          usdAmounts[i] = tokenBalance
        }
      }
    }
    usdAmounts[usdAmounts.length - 1] = usdAmount
    totalUSDAmount = totalUSDAmount.plus(usdAmount)

    return [usdAmounts, totalUSDAmount]
  }

  getCurrentPoolAmount(
    tokens, // public // view // returns (uint256[] memory poolAmounts)
  ) {
    let poolAmounts = Array(tokens.length).fill(0)
    for (let index = 0; index < tokens.length; index++) {
      poolAmounts[index] = this.getBalance(tokens[index])
    }
    return poolAmounts
  }
}

export default RebalanceSwapper
