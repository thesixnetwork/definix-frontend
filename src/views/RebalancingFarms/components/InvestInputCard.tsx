/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { get, compact, debounce } from 'lodash-es'
import { provider } from 'web3-core'

import {
  Box,
  Button,
  Card,
  CardBody,
  CheckBIcon,
  Divider,
  Flex,
  Noti,
  NotiType,
  Text,
  useModal,
} from '@fingerlabs/definixswap-uikit-v2'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useBalances, useAllowances, useToast } from 'state/hooks'
import { fetchAllowances, fetchBalances } from 'state/wallet'
import { simulateInvest, getReserves } from 'offline-pool'

import useWallet from 'hooks/useWallet'
import useKlipContract from 'hooks/useKlipContract'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiERC20ByName } from 'hooks/hookHelper'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import { useDispatch } from 'react-redux'

import { useDeepEqualMemo } from 'hooks/useDeepEqualMemo'
import CurrencyText from 'components/Text/CurrencyText'
import CurrencyInputPanel from './CurrencyInputPanel'
import CalculateModal from './CalculateModal'
import CoinWrap from './CoinWrap'
import { isKlipConnector } from 'hooks/useApprove'

interface InvestInputCardProp {
  isMobile?: boolean
  rebalance
  onNext
}

const InvestInputCard: React.FC<InvestInputCardProp> = ({ isMobile, rebalance, onNext }) => {
  const { t } = useTranslation()
  const [approvingCoin, setApprovingCoin] = useState<string | null>(null)
  const [poolUSDBalances, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [sumPoolAmount, setSumPoolAmount] = useState(0)
  const [isSimulating, setIsSimulating] = useState(true)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const [inputError, setInputError] = useState<Record<string, boolean>>({})
  const [, setTx] = useState({})
  const dispatch = useDispatch()
  const { account, klaytn, connector } = useWallet()
  const { isKlip, request } = useKlipContract()
  const { toastSuccess, toastError } = useToast()
  const balances = useBalances(account)
  const mBalances = useDeepEqualMemo(balances)
  const mRebalance = useDeepEqualMemo(rebalance)
  const allowances = useAllowances(account, getAddress(get(mRebalance, 'address', {})))
  const [calNewImpact, setCalNewImpact] = useState(0)
  const hasError = useMemo(() => Object.values(inputError).some((value) => value), [inputError])

  const fetchData = useCallback(async (value, myBalances, rebalanceInfo) => {
    setIsSimulating(true)
    try {
      const datas = compact([...((rebalanceInfo || {}).tokens || []), ...((rebalanceInfo || {}).usdToken || [])]).map(
        (c, index) => {
          const ratioPoint = (
            ((rebalanceInfo || {}).tokenRatioPoints || [])[index] ||
            ((rebalanceInfo || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalanceInfo || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((value[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(myBalances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        },
      )
      const [, poolAmountsData] = await simulateInvest(datas)
      const poolUSDBalancesDataProcess = getReserves(datas)

      const reservePoolAmountProcess = getReserves(
        datas.map((c, index) => ({
          ...c,
          value: new BigNumber((poolAmountsData[index] || '0') as string).times(new BigNumber(10).pow(c.decimals)),
        })),
      )
      let sumUsd = new BigNumber(0)

      const [poolUSDBalancesData, reservePoolAmount] = await Promise.all([
        poolUSDBalancesDataProcess,
        reservePoolAmountProcess,
      ])
      // Promise.all([poolUSDBalancesDataProcess, reservePoolAmountProcess]).then(data => {
      // const [poolUSDBalancesData,reservePoolAmount]  = data
      // @ts-ignore
      for (let i = 0; i < reservePoolAmount[0]?.length || 0; i++) {
        const decimal = rebalanceInfo.tokens[i]?.decimals || 6
        sumUsd = sumUsd.plus(reservePoolAmount[0][i].dividedBy(10 ** (decimal + 6)))
      }
      const usdToken = ((rebalanceInfo || {}).usdToken || [])[0] || {}
      // @ts-ignore
      const totalUserUsdAmount = new BigNumber(get(poolUSDBalancesData, 1, '0'))
        .div(new BigNumber(10).pow(usdToken.decimals || 18))
        .toNumber()
      const calNewImpactPrice = Math.abs(((totalUserUsdAmount - +sumUsd.toFixed()) / +sumUsd.toFixed()) * 100)

      setCalNewImpact(calNewImpactPrice)
      setPoolUSDBalances(poolUSDBalancesData)
      setSumPoolAmount(+sumUsd.toFixed())
      setPoolAmounts(poolAmountsData)
      // })
    } catch (e) {
      console.error(e)
    }
    setIsSimulating(false)
  }, [])

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), [fetchData])

  const usdToken = ((mRebalance || {}).usdToken || [])[0] || {}
  const totalUsdPool = useMemo(
    () =>
      mRebalance?.sumCurrentPoolUsdBalance
        ? // @ts-ignore
          new BigNumber([mRebalance.sumCurrentPoolUsdBalance])
            .div(new BigNumber(10).pow(usdToken.decimals || 18))
            .toNumber()
        : 0,
    [mRebalance.sumCurrentPoolUsdBalance, usdToken.decimals],
  )

  const totalUserUsdAmount = useMemo(
    () => new BigNumber(get(poolUSDBalances, 1, '0')).div(new BigNumber(10).pow(usdToken.decimals || 18)).toNumber(),
    [poolUSDBalances, usdToken.decimals],
  )
  // const minUserUsdAmount = totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))

  const totalSupply = useMemo(
    () =>
      mRebalance?.totalSupply?.[0]
        ? // @ts-ignore
          new BigNumber([mRebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
        : 0,
    [mRebalance.totalSupply],
  )

  const currentShare = useMemo(
    () => (totalUsdPool > 0 ? (totalUserUsdAmount / totalUsdPool) * totalSupply : 0),
    [totalSupply, totalUsdPool, totalUserUsdAmount],
  )

  // const priceImpact = Math.round((totalUserUsdAmount / totalUsdPool) * 10) / 10
  // const calNewImpact = Math.abs(((totalUserUsdAmount - sumPoolAmount) / sumPoolAmount) * 100)
  const shares = useMemo(
    () =>
      currentShare <= 0 || Number.isNaN(currentShare)
        ? numeral(sumPoolAmount).format('0,0.[00]')
        : numeral(currentShare).format('0,0.[00]'),
    [currentShare, sumPoolAmount],
  )

  const underMinimum = useMemo(() => shares === '0', [shares])

  const onApprove = (token) => async () => {
    const tokenContract = getContract(klaytn as provider, getAddress(token.address))
    setApprovingCoin(token.symbol)
    try {
      if (isKlip()) {
        await request({
          contractAddress: getAddress(token.address),
          abi: JSON.stringify(getAbiERC20ByName('approve')),
          input: JSON.stringify([getAddress(mRebalance.address), klipProvider.MAX_UINT_256_KLIP]),
        })
      } else {
        await approveOther(tokenContract, getAddress(mRebalance.address), account)
      }
      const assets = mRebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(mRebalance.address)))
      toastSuccess(t('{{Action}} Complete', { Action: t('actionApprove') }))
      setApprovingCoin(null)
    } catch {
      toastError(t('{{Action}} Failed', { Action: t('actionApprove') }))
      setApprovingCoin(null)
    }
  }

  const findAddress = useCallback((token) => {
    if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') return 'main'
    return getAddress(token.address)
  }, [])

  const coins = useMemo(
    () =>
      mRebalance.ratio
        .filter((coin) => coin.value)
        .map((c) => {
          const balance = get(mBalances, findAddress(c))
          return {
            ...c,
            cMax: balance || new BigNumber(0),
            cAddress: getAddress(c.address),
            cBalance: balance,
          }
        }),
    [mBalances, findAddress, mRebalance.ratio],
  )

  const needsApprovalCoins = useMemo(
    () =>
      coins
        .map((c) => {
          const currentValue = parseFloat((currentInput[c.cAddress] as string) ?? '')
          const currentAllowance = (get(allowances, c.cAddress) || new BigNumber(0)).toNumber()
          const needsApproval = currentAllowance < currentValue && c.symbol !== 'WKLAY' && c.symbol !== 'WBNB'
          return {
            ...c,
            currentValue,
            needsApproval,
          }
        })
        .filter(({ currentValue }) => currentValue > 0),
    [currentInput, coins, allowances],
  )

  const allApproved = useMemo(
    () => needsApprovalCoins.every(({ needsApproval }) => !needsApproval),
    [needsApprovalCoins],
  )

  const [onPresentCalcModal] = useModal(
    <CalculateModal
      setTx={setTx}
      currentInput={currentInput}
      shares={shares}
      poolAmounts={poolAmounts}
      rebalance={mRebalance}
      sumPoolAmount={sumPoolAmount}
      calNewImpact={calNewImpact}
      onNext={onNext}
    />,
    false,
  )

  const setError = useCallback((error, c) => setInputError((cur) => ({ ...cur, [c.cAddress]: error })), [])

  useEffect(() => {
    if (account && mRebalance) {
      const assets = mRebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(mRebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(mRebalance.address)))
    }
  }, [dispatch, account, mRebalance])

  useEffect(() => {
    return () => {
      setTx({})
    }
  }, [])

  useEffect(() => {
    debouncedFetchData(currentInput, mBalances, mRebalance)
  }, [debouncedFetchData, mBalances, currentInput, mRebalance])

  return (
    <Card mb={isMobile ? 'S_40' : 'S_80'}>
      <CardBody p={isMobile ? 'S_20' : 'S_40'}>
        <Box mb="S_40">
          {coins.map((c) => {
            return (
              <CurrencyInputPanel
                currency={c}
                balance={c.cBalance}
                id={`invest-${c.symbol}`}
                key={`invest-${c.symbol}`}
                showMaxButton
                className="mb-s24"
                value={currentInput[c.cAddress] as string}
                setError={setError}
                max={c.cMax}
                onUserInput={(value) => {
                  setCurrentInput({ ...currentInput, [c.cAddress]: value })
                }}
              />
            )
          })}
        </Box>

        <Box mb="S_32">
          <Text textStyle="R_16M" mb="S_12" color="textSubtle">
            {t('Total Amount')}
          </Text>
          {needsApprovalCoins.length ? (
            needsApprovalCoins.map((coin) => {
              const approved = !coin.needsApproval || !coin.currentValue
              return (
                <Flex
                  key={`approval-${coin.symbol}`}
                  textStyle="R_16M"
                  mb={isMobile ? 'S_24' : 'S_8'}
                  alignItems={isMobile ? 'flex-start' : 'center'}
                  flexDirection={isMobile ? 'column' : 'row'}
                >
                  <CoinWrap mb={isMobile ? 'S_8' : ''} symbol={coin.symbol} size="lg">
                    <Text mr="S_8" ml="S_12">
                      {coin.currentValue}
                    </Text>
                    <Text color="textSubtle">{coin.symbol}</Text>
                  </CoinWrap>
                  <Button
                    ml="auto"
                    width={isMobile ? '100%' : '200px'}
                    variant={approved ? 'line' : 'brown'}
                    isLoading={coin.needsApproval && approvingCoin === coin.symbol}
                    disabled={approved}
                    onClick={onApprove(coin)}
                  >
                    {coin.needsApproval ? (
                      t('Approve {{Token}}', { Token: coin.symbol })
                    ) : (
                      <>
                        <CheckBIcon opacity=".5" style={{ marginRight: '6px' }} />
                        {t('{{Token}} Approved', { Token: coin.symbol })}
                      </>
                    )}
                  </Button>
                </Flex>
              )
            })
          ) : (
            <Flex py="S_28" justifyContent="center">
              <Text textStyle="R_14R" color="textSubtle" style={{ opacity: 0.6 }}>
                {t('Please input the investment amount.')}
              </Text>
            </Flex>
          )}
        </Box>
        <Divider mb="S_32" />
        <Box mb={isMobile ? 'S_32' : 'S_40'}>
          <Text textStyle="R_16M" mb="S_8" color="textSubtle">
            {t('Total Value')}
          </Text>
          <Flex flexWrap="wrap" alignItems="baseline">
            <CurrencyText
              textStyle="R_23M"
              style={{ whiteSpace: 'nowrap' }}
              mr="S_8"
              mb="S_2"
              value={sumPoolAmount}
              toFixed={6}
            />
            <Text color="textSubtle" textStyle="R_14R">
              {t('EST. {{number}} share', { number: shares })}
            </Text>
          </Flex>
        </Box>

        <Button
          scale="lg"
          width="100%"
          disabled={hasError || isSimulating || underMinimum || !allApproved || !needsApprovalCoins.length}
          onClick={onPresentCalcModal}
        >
          {t('Calculate invest amount')}
        </Button>
        {underMinimum && (
          <Noti mt="S_12" type={NotiType.ALERT}>
            {t('Less than a certain amount')}
          </Noti>
        )}
      </CardBody>
    </Card>
  )
}

export default InvestInputCard
