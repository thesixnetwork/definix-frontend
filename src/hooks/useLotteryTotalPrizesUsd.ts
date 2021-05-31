import { usePriceFinixKusdt } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalRewards } from './useTickets'

const useLotteryTotalPrizesUsd = () => {
  const totalRewards = useTotalRewards()
  const totalFinix = getBalanceNumber(totalRewards)
  const finixPriceBusd = usePriceFinixKusdt()

  return totalFinix * finixPriceBusd.toNumber()
}

export default useLotteryTotalPrizesUsd
