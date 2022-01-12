import axios from 'axios'
import { getAddress } from 'utils/addressHelpers'
import { findIndex } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'

const useComineAmount = (rebalance, account, currentBalance) => {
  const api = process.env.REACT_APP_DEFINIX_TOTAL_TXN_AMOUNT_API
  const [diffAmount, setDiffAmount] = useState(0)
  const [percentage, setPercentage] = useState(0)

  const combinedAmount = useCallback(async () => {
    if (!account) {
      return
    }
    const sharedprice = +(currentBalance * rebalance.sharedPrice)
    const rebalanceAddress = getAddress(rebalance?.address)

    const myInvestTxnLocalStorage = JSON.parse(
      localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
    )

    const myInvestTxns = myInvestTxnLocalStorage[rebalanceAddress] ? myInvestTxnLocalStorage[rebalanceAddress] : []
    const resTotalTxn = await axios
      .get(`${api}/total_txn_amount?pool=${rebalanceAddress}&address=${account}`)
      .then(({ data }) => data)
      .catch((error) => error.response?.data)

    const latestTxns = resTotalTxn?.latest_txn
    const totalUsd = resTotalTxn?.total_usd_amount
    const totalLps = resTotalTxn?.total_lp_amount

    const indexTx = findIndex(myInvestTxns, (investTxs) => investTxs === latestTxns)
    const transactionsSlice = myInvestTxns.slice(indexTx + 1)
    myInvestTxnLocalStorage[rebalanceAddress] = transactionsSlice
    localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxnLocalStorage))

    if (!resTotalTxn?.success) {
      return
    }

    const txHash = {
      txns: transactionsSlice,
    }
    let lastTotalAmt = 0
    let lastTotalLp = 0
    if (transactionsSlice.length > 0) {
      const datas = (await axios.post(`${api}/txns_usd_amount`, txHash)).data
      lastTotalAmt = datas?.total_usd_amount
      lastTotalLp = datas?.total_lp_amount
    }

    const totalLpAmount = totalLps + lastTotalLp
    if (sharedprice > 0 && totalUsd > 0 && totalLpAmount > 0) {
      const totalUsdAmount = lastTotalAmt + totalUsd
      const diff = sharedprice - totalUsdAmount
      const diffNewAmount = ((sharedprice - totalUsdAmount) / totalUsdAmount) * 100
      setDiffAmount(diff)
      setPercentage(diffNewAmount)
    }
  }, [currentBalance, rebalance, account, api])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  return { diffAmount, percentage }
}

export default useComineAmount
