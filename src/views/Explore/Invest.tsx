/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { get, isEqual, compact } from 'lodash'
import { provider } from 'web3-core'

import { ArrowBackIcon } from 'uikit-dev'
import {
  Box,
  Button,
  Card,
  CardBody,
  CheckBIcon,
  Flex,
  Text,
  ToastContainer,
  useMatchBreakpoints,
  useModal,
} from 'definixswap-uikit'

import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiERC20ByName } from 'hooks/hookHelper'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import { useDispatch } from 'react-redux'
import { Rebalance } from '../../state/types'
import { useBalances, useAllowances, usePriceFinixUsd } from '../../state/hooks'
import { fetchAllowances, fetchBalances } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import TwoLineFormat from './components/TwoLineFormat'
import { simulateInvest, getReserves } from '../../offline-pool'
import CalculateModal from './components/CalculateModal'

interface InvestType {
  rebalance: Rebalance | any
}

const CardInput = ({
  isSimulating,
  balances,
  allowances,
  onNext,
  rebalance,
  setCurrentInput,
  currentInput,
  sumPoolAmount,
}) => {
  const { t } = useTranslation()
  const [isApproving, setIsApproving] = useState(false)
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const dispatch = useDispatch()
  const { account, klaytn, connector } = useWallet()
  const finixPrice = usePriceFinixUsd()
  const { setShowModal } = React.useContext(KlipModalContext())

  const onApprove = (token) => async () => {
    const tokenContract = getContract(klaytn as provider, getAddress(token.address))
    setIsApproving(true)
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
      setIsApproving(false)
    } catch {
      setIsApproving(false)
    }
  }

  const findAddress = (token) => {
    if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') return 'main'
    return getAddress(token.address)
  }

  function toFixedCustom(num) {
    return num.toString().match(/^-?\d+(?:\.\d{0,7})?/)[0]
  }

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
    [balances, rebalance],
  )

  const needsApprovalCoins = useMemo(
    () =>
      coins
        .map((c) => {
          const currentValue = parseFloat(currentInput[c.cAddress])
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

  return (
    <>
      <Card mb="S_16">
        <CardBody>
          <CardHeading
            rebalance={rebalance}
            isHorizontal={isMobile}
            className={`mb-s24 ${isMobile ? 'pb-s28' : 'pb-s24 bd-b'}`}
          />

          <Flex justifyContent="space-between" flexWrap="wrap">
            <TwoLineFormat
              className={isMobile ? 'col-6 mb-s20' : 'col-4'}
              title={t('Yield APR')}
              value={`${numeral(
                finixPrice
                  .times(get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                  .div(get(rebalance, 'totalAssetValue', new BigNumber(0)))
                  .times(100)
                  .toFixed(2),
              ).format('0,0.[00]')}%`}
              hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />

            <TwoLineFormat
              className={isMobile ? 'col-6' : 'col-4 bd-l pl-s32'}
              title={t('Share Price(Since Inception)')}
              value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
              percent={`${
                rebalance.sharedPricePercentDiff >= 0
                  ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                  : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
              }%`}
              percentClass={(() => {
                if (rebalance.sharedPricePercentDiff < 0) return 'failure'
                if (rebalance.sharedPricePercentDiff > 0) return 'success'
                return ''
              })()}
            />
            <TwoLineFormat
              className={isMobile ? 'col-6' : 'col-4 bd-l pl-s32'}
              title={t('Risk-0-Meter')}
              value="Medium"
            />
          </Flex>
        </CardBody>
      </Card>

      <Card p={isMobile ? 'S_20' : 'S_40'}>
        <Box mb="S_40">
          {coins.map((c) => (
            <CurrencyInputPanel
              currency={c}
              balance={c.cBalance}
              id={`invest-${c.symbol}`}
              key={`invest-${c.symbol}`}
              showMaxButton={String(c.cMax.toNumber()) !== currentInput[c.cAddress]}
              className="mb-s24"
              value={currentInput[c.cAddress]}
              onMax={() => {
                const max = String(c.cMax.toNumber())

                const testMax = toFixedCustom(max)
                setCurrentInput({
                  ...currentInput,
                  [c.cAddress]: testMax,
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
          ))}
        </Box>

        <Box className="bd-b" pb="S_32" mb="S_32">
          <Text textStyle="R_16M" mb="S_12" color="textSubtle">
            {t('Total Amount')}
          </Text>
          {needsApprovalCoins.length ? (
            needsApprovalCoins.map((coin) => (
              <Flex textStyle="R_16M" mb="S_8" alignItems="center">
                <Flex alignItems="center" className="col-9">
                  <img width="32px" src={`/images/coins/${coin.symbol}.png`} alt="" />
                  <Text mr="S_8" ml="S_12">
                    {0.2264627858327316}
                  </Text>
                  <Text color="textSubtle">{coin.symbol}</Text>
                </Flex>
                <Button
                  ml="auto"
                  width="200px"
                  variant="brown"
                  disabled={isApproving || !coin.needsApproval || !coin.currentValue}
                  onClick={onApprove(coin)}
                >
                  {coin.needsApproval || <CheckBIcon opacity=".5" style={{ marginRight: '6px' }} />} Approve{' '}
                  {coin.symbol}
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

        <Box mb="S_40">
          <Text textStyle="R_16M" mb="S_8" color="textSubtle">
            {t('Total Value')}
          </Text>
          <Text textStyle="R_23M">$ {numeral(sumPoolAmount).format('0,0.[0000]')}</Text>
        </Box>

        <Button
          scale="lg"
          width="100%"
          disabled={isSimulating || !allApproved || !needsApprovalCoins.length}
          onClick={onNext}
        >
          {t('Calculate invest amount')}
        </Button>
      </Card>
    </>
  )
}

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const Invest: React.FC<InvestType> = ({ rebalance }) => {
  const { t } = useTranslation()
  const [tx, setTx] = useState({})
  const [poolUSDBalancesState, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [sumPoolAmount, setSumPoolAmount] = useState(0)
  const [isSimulating, setIsSimulating] = useState(true)
  const [isInvesting, setIsInvesting] = useState(false)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})
  const [calNewImpact, setCalNewImpact] = useState(0)
  const [toasts, setToasts] = useState([])

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  }

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

  const [onPresentCalcModal] = useModal(
    <CalculateModal
      setTx={setTx}
      currentInput={currentInput}
      isInvesting={isInvesting}
      setIsInvesting={setIsInvesting}
      isSimulating={isSimulating}
      recalculate={fetchData}
      poolUSDBalances={poolUSDBalancesState}
      poolAmounts={poolAmounts}
      rebalance={rebalance}
      sumPoolAmount={sumPoolAmount}
      onNext={() => {
        fetchData()
        setToasts((prevToasts) => [
          {
            title: t('Invest Complete'),
            type: 'success',
          },
          ...prevToasts,
        ])
      }}
      calNewImpact={calNewImpact}
    />,
    false,
  )

  useEffect(() => {
    fetchData()
    // calReserve()
  }, [fetchData])

  if (!rebalance) return <Redirect to="/rebalancing" />

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
        {t('Invest')}
      </Text>

      <CardInput
        rebalance={rebalance}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        balances={balances}
        allowances={allowances}
        onNext={() => {
          onPresentCalcModal()
        }}
        // totalUSDAmount={totalUSDAmount}
        isSimulating={isSimulating}
        sumPoolAmount={sumPoolAmount}
      />
      <ToastContainer toasts={toasts} onRemove={handleRemove} />
    </Box>
  )
}

export default Invest
