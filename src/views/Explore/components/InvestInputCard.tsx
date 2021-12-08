/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { get, isEqual, compact } from 'lodash'
import { provider } from 'web3-core'

import { Box, Button, Card, CardBody, CheckBIcon, Divider, Flex, Text, useModal } from 'definixswap-uikit'

import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useBalances, useAllowances, useToast } from 'state/hooks'
import { fetchAllowances, fetchBalances } from 'state/wallet'
import { simulateInvest, getReserves } from 'offline-pool'

import * as klipProvider from 'hooks/klipProvider'
import { getAbiERC20ByName } from 'hooks/hookHelper'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import { useDispatch } from 'react-redux'

import CurrencyInputPanel from './CurrencyInputPanel'
import CalculateModal from './CalculateModal'

interface InvestInputCardProp {
  isMobile?: boolean
  rebalance
  onNext
}

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const InvestInputCard: React.FC<InvestInputCardProp> = ({ isMobile, rebalance, onNext }) => {
  const { t } = useTranslation()
  const [approvingCoin, setApprovingCoin] = useState<string | null>(null)
  const [poolUSDBalances, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [sumPoolAmount, setSumPoolAmount] = useState(0)
  const [isSimulating, setIsSimulating] = useState(true)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const [tx, setTx] = useState({})
  const dispatch = useDispatch()
  const { account, klaytn, connector } = useWallet()
  const { setShowModal } = React.useContext(KlipModalContext())
  const { toastSuccess, toastError } = useToast()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})
  const [calNewImpact, setCalNewImpact] = useState(0)

  const fetchData = useCallback(async () => {
    if (
      !isEqual(rebalance, prevRebalance) ||
      !isEqual(balances, prevBalances) ||
      !isEqual(currentInput, prevCurrentInput)
    ) {
      setIsSimulating(true)
      // eslint-disable-next-line
      const [__, poolAmountsData] = await simulateInvest(
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
            value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )

      const poolUSDBalancesDataProcess = getReserves(
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
            value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )

      const reservePoolAmountProcess = getReserves(
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
            value: new BigNumber((poolAmountsData[index] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
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
        const decimal = rebalance.tokens[i]?.decimals ? rebalance.tokens[i].decimals : 6
        sumUsd = sumUsd.plus(reservePoolAmount[0][i].dividedBy(10 ** (decimal + 6)))
      }
      const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
      // @ts-ignore
      const totalUserUsdAmount = new BigNumber(get(poolUSDBalancesData, 1, '0'))
        .div(new BigNumber(10).pow(usdToken.decimals || 18))
        .toNumber()
      const calNewImpactPrice = Math.abs(((totalUserUsdAmount - +sumUsd.toFixed()) / +sumUsd.toFixed()) * 100)

      setCalNewImpact(calNewImpactPrice)
      setPoolUSDBalances(poolUSDBalancesData)
      setSumPoolAmount(+sumUsd.toFixed())
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
      // })
    }
  }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput])

  // const calReserve = useCallback(async () => {
  //   if (
  //     !isEqual(rebalance, prevRebalance) ||
  //     !isEqual(balances, prevBalances) ||
  //     !isEqual(currentInput, prevCurrentInput)
  //   ) {
  //     setIsSimulating(false)

  //     const poolUSDBalancesData = await getReserves(
  //       compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
  //         const ratioPoint = (
  //           ((rebalance || {}).tokenRatioPoints || [])[index] ||
  //           ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
  //           new BigNumber(0)
  //         ).toNumber()
  //         const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
  //         const decimal = c.decimals
  //         return {
  //           ...c,
  //           symbol: c.symbol,
  //           address: ratioObject.address,
  //           ratioPoint,
  //           value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
  //           balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
  //         }
  //       }),
  //     )
  //     const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  //     const totalUserUsdAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
  //       .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //       .toNumber()
  //     console.log("diff", totalUserUsdAmount, sumPoolAmount)
  //     const calNewImpactPrice = Math.abs(((totalUserUsdAmount - sumPoolAmount) / sumPoolAmount) * 100)
  //     setCalNewImpact(calNewImpactPrice)
  //     setPoolUSDBalances(poolUSDBalancesData)
  //     setIsSimulating(true)
  //   }
  // }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput, poolUSDBalances, sumPoolAmount])

  // const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // const totalUSDAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
  //   .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //   .toNumber()

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  const totalUsdPool = useMemo(
    () =>
      rebalance?.sumCurrentPoolUsdBalance
        ? // @ts-ignore
          new BigNumber([rebalance.sumCurrentPoolUsdBalance])
            .div(new BigNumber(10).pow(usdToken.decimals || 18))
            .toNumber()
        : 0,
    [rebalance.sumCurrentPoolUsdBalance, usdToken.decimals],
  )

  const totalUserUsdAmount = useMemo(
    () => new BigNumber(get(poolUSDBalances, 1, '0')).div(new BigNumber(10).pow(usdToken.decimals || 18)).toNumber(),
    [poolUSDBalances, usdToken.decimals],
  )
  // const minUserUsdAmount = totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))

  const totalSupply = useMemo(
    () =>
      rebalance?.totalSupply?.[0]
        ? // @ts-ignore
          new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
        : 0,
    [rebalance.totalSupply],
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

  const onApprove = (token) => async () => {
    const tokenContract = getContract(klaytn as provider, getAddress(token.address))
    setApprovingCoin(token.symbol)
    try {
      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(token.address),
          JSON.stringify(getAbiERC20ByName('approve')),
          JSON.stringify([getAddress(rebalance.address), klipProvider.MAX_UINT_256_KLIP]),
          setShowModal,
        )
        await klipProvider.checkResponse()
        setShowModal(false)
      } else {
        await approveOther(tokenContract, getAddress(rebalance.address), account)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      toastSuccess(t('Approve Complete'))
      setApprovingCoin(null)
    } catch {
      toastError(t('Approve Failed'))
      setApprovingCoin(null)
    }
  }

  const findAddress = useCallback((token) => {
    if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') return 'main'
    return getAddress(token.address)
  }, [])

  const coins = useMemo(
    () =>
      rebalance.ratio
        .filter((coin) => coin.value)
        .map((c) => {
          const balance = get(balances, findAddress(c))
          return {
            ...c,
            cMax: balance || new BigNumber(0),
            cAddress: getAddress(c.address),
            cBalance: balance,
          }
        }),
    [balances, findAddress, rebalance.ratio],
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
      // recalculate={fetchData}
      shares={shares}
      poolAmounts={poolAmounts}
      rebalance={rebalance}
      sumPoolAmount={sumPoolAmount}
      calNewImpact={calNewImpact}
      onNext={onNext}
    />,
    false,
  )

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setTx({})
    }
  }, [])

  useEffect(() => {
    fetchData()
    // calReserve()
  }, [fetchData])

  return (
    <Card mb={isMobile ? 'S_40' : 'S_80'}>
      <CardBody p={isMobile ? 'S_20' : 'S_40'}>
        <Box mb="S_40">
          {coins.map((c) => {
            const max = String(c.cMax.toNumber())
            return (
              <CurrencyInputPanel
                currency={c}
                balance={c.cBalance}
                id={`invest-${c.symbol}`}
                key={`invest-${c.symbol}`}
                showMaxButton
                className="mb-s24"
                value={currentInput[c.cAddress] as string}
                max={c.cMax}
                onMax={() => {
                  setCurrentInput({
                    ...currentInput,
                    [c.cAddress]: max,
                  })
                }}
                onQuarter={() => {
                  setCurrentInput({
                    ...currentInput,
                    [c.cAddress]: String(c.cMax.times(0.25).toNumber()),
                  })
                }}
                onHalf={() => {
                  setCurrentInput({
                    ...currentInput,
                    [c.cAddress]: String(c.cMax.times(0.5).toNumber()),
                  })
                }}
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
            needsApprovalCoins.map((coin) => (
              <Flex
                key={`approval-${coin.symbol}`}
                textStyle="R_16M"
                mb={isMobile ? 'S_24' : 'S_8'}
                alignItems={isMobile ? 'flex-start' : 'center'}
                flexDirection={isMobile ? 'column' : 'row'}
              >
                <Flex alignItems="center" mb={isMobile ? 'S_8' : ''}>
                  <img width="32px" src={`/images/coins/${coin.symbol}.png`} alt="" />
                  <Text mr="S_8" ml="S_12">
                    {coin.currentValue}
                  </Text>
                  <Text color="textSubtle">{coin.symbol}</Text>
                </Flex>
                <Button
                  ml="auto"
                  width={isMobile ? '100%' : '200px'}
                  variant="brown"
                  isLoading={coin.needsApproval && approvingCoin === coin.symbol}
                  disabled={!coin.needsApproval || !coin.currentValue}
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
            ))
          ) : (
            <Flex py="S_28" justifyContent="center">
              <Text textStyle="R_14R" color="textSubtle">
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
            <Text textStyle="R_23M" style={{ whiteSpace: 'nowrap' }} mr="S_8" mb="S_2">
              $ {numeral(sumPoolAmount).format('0,0.[0000]')}
            </Text>
            <Text color="textSubtle" textStyle="R_14R">
              {t('EST. {{number}} share', { number: shares })}
            </Text>
          </Flex>
        </Box>

        <Button
          scale="lg"
          width="100%"
          isLoading={isSimulating}
          disabled={!allApproved || !needsApprovalCoins.length}
          onClick={onPresentCalcModal}
        >
          {t('Calculate invest amount')}
        </Button>
      </CardBody>
    </Card>
  )
}

export default InvestInputCard
