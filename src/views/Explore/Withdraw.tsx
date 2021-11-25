/* eslint-disable no-nested-ternary */
import { compact, get } from 'lodash'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import { useDispatch } from 'react-redux'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { Box, Button, Flex, Text } from 'definixswap-uikit'
import { ArrowBackIcon } from 'uikit-dev'
import { useTranslation } from 'react-i18next'
import { useToast } from 'state/hooks'
import { useRebalanceBalances, useBalances } from '../../state/hooks'
import { fetchBalances } from '../../state/wallet'
import { Rebalance } from '../../state/types'
import { simulateWithdraw } from '../../offline-pool'
import WithdrawSummaryCard from './components/WithdrawSummaryCard'
import WithdrawInputCard, { RatioType } from './components/WithdrawInputCard'

interface WithdrawType {
  rebalance: Rebalance | any
}

const Withdraw: React.FC<WithdrawType> = ({ rebalance }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [tx, setTx] = useState({})
  const { toastSuccess } = useToast()
  const [selectedToken, setSelectedToken] = useState({})
  const [currentInput, setCurrentInput] = useState('')
  const [isInputting, setIsInputting] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [poolAmounts, setPoolAmounts] = useState([])
  const [ratioType, setRatioType] = useState(RatioType.Original)

  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setIsInputting(true)
      setRatioType(RatioType.Original)
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (rebalance && new BigNumber(currentInput).toNumber() > 0) {
      setIsSimulating(true)
      const thisRebalanceBalance = get(rebalance, 'enableAutoCompound', false) ? rebalanceBalances : balances
      const myBalance = get(thisRebalanceBalance, getAddress(rebalance.address), new BigNumber(0))
      const thisInput = myBalance.isLessThan(new BigNumber(currentInput)) ? myBalance : new BigNumber(currentInput)
      const [, poolAmountsData] = await simulateWithdraw(
        thisInput,
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber(currentInput as string).times(new BigNumber(10).pow(decimal)),
            isSelected: !!selectedToken[getAddress(ratioObject.address)],
          }
        }),
        [((rebalance || {}).totalSupply || [])[0]],
        ratioType === RatioType.Original,
      )
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
    }
    if (new BigNumber(currentInput).toNumber() <= 0) {
      setPoolAmounts([])
    }
  }, [selectedToken, currentInput, rebalance, ratioType, balances, rebalanceBalances])

  useEffect(() => {
    fetchData()
  }, [selectedToken, currentInput, rebalance, fetchData, ratioType])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const thisBalance = get(rebalance, 'enableAutoCompound', false) ? rebalanceBalances : balances
  const currentBalance = get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  return (
    <Box maxWidth="630px" mx="auto">
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <Flex className="mb-s20">
        <Button
          variant="text"
          as={Link}
          to="/rebalancing/detail"
          height="24px"
          p="0"
          startIcon={<ArrowBackIcon color="textSubtle" />}
        >
          <Text textStyle="R_16R" color="textSubtle">
            {t('Back')}
          </Text>
        </Button>
      </Flex>
      <Text as="h2" textStyle="R_32B" className="mb-s40">
        {t('Withdraw')}
      </Text>

      <div>
        <WithdrawSummaryCard rebalance={rebalance} currentBalanceNumber={currentBalanceNumber} />
        <WithdrawInputCard
          setTx={setTx}
          isWithdrawing={isWithdrawing}
          setIsWithdrawing={setIsWithdrawing}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          rebalance={rebalance}
          poolAmounts={poolAmounts}
          isSimulating={isSimulating}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          currentBalance={currentBalance}
          currentBalanceNumber={currentBalanceNumber}
          ratioType={ratioType}
          setRatioType={setRatioType}
          onNext={() => {
            setIsInputting(false)
            toastSuccess(t('Withdraw Complete'))
            history.goBack()
          }}
        />
      </div>
    </Box>
  )
}

export default Withdraw
