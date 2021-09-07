/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import React, { useRef, useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Lottie from 'react-lottie'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { AbiItem } from 'web3-utils'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiRebalanceByName, getAbiERC20ByName } from 'hooks/hookHelper'
import { provider } from 'web3-core'
import { ArrowBackIcon, Button, Card, ChevronRightIcon, Link as UiLink, Text, useMatchBreakpoints } from 'uikit-dev'
import _ from 'lodash'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import rebalanceAbi from 'config/abi/rebalance.json'
import { getContract, getCustomContract } from 'utils/erc20'
import success from 'uikit-dev/animation/complete.json'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { useDispatch } from 'react-redux'
import useTheme from 'hooks/useTheme'
import { Rebalance } from '../../state/types'
import { useBalances, useAllowances, useSlippage } from '../../state/hooks'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import { fetchRebalances } from '../../state/rebalance'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import PriceUpdate from './components/PriceUpdate'
import SettingButton from './components/SettingButton'
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import TwoLineFormat from './components/TwoLineFormat'
import VerticalAssetRatio from './components/VerticalAssetRatio'
import { simulateInvest } from '../../offline-pool'

interface InvestType {
  rebalance: Rebalance | any
}

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const MaxWidth = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

const CardInput = ({
  isSimulating,
  balances,
  allowances,
  onNext,
  rebalance,
  setCurrentInput,
  currentInput,
  totalUSDAmount,
}) => {
  const [isApproving, setIsApproving] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const dispatch = useDispatch()
  const { account, klaytn, connector } = useWallet()
  const { isDark } = useTheme()
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
  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4 pt-2' : 'pa-6 pt-4'}>
        <div className="flex justify-space-between align-center mb-2">
          <Button
            variant="text"
            as={Link}
            to="/rebalancing/detail"
            ml="-12px"
            padding="0 12px"
            size="sm"
            startIcon={<ArrowBackIcon color="textSubtle" />}
          >
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
          <SettingButton />
        </div>

        <TwoLineFormat
          title="Share price"
          subTitle="(Since inception)"
          subTitleFontSize="11px"
          titleColor={isDark ? '#ADB4C2' : ''}
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
          large
          className="mb-4"
        />

        <div className="flex">
          <Text className="mb-2">Invest</Text>
        </div>

        <div className="mb-4">
          {rebalance.ratio.map((c) => (
            <CurrencyInputPanel
              currency={c}
              balance={_.get(balances, findAddress(c))}
              id={`invest-${c.symbol}`}
              key={`invest-${c.symbol}`}
              showMaxButton={
                String((_.get(balances, findAddress(c)) || new BigNumber(0)).toNumber()) !==
                currentInput[getAddress(c.address)]
              }
              className="mb-2"
              value={currentInput[getAddress(c.address)]}
              label=""
              onMax={() => {
                const max = String((_.get(balances, findAddress(c)) || new BigNumber(0)).toNumber())

                const testMax = toFixedCustom(max)
                // eslint-disable-next-line
                // debugger
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address)]: testMax,
                })
              }}
              onQuarter={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address)]: String(
                    (_.get(balances, findAddress(c)) || new BigNumber(0)).times(0.25).toNumber(),
                  ),
                })
              }}
              onHalf={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address)]: String(
                    (_.get(balances, findAddress(c)) || new BigNumber(0)).times(0.5).toNumber(),
                  ),
                })
              }}
              onUserInput={(value) => {
                setCurrentInput({ ...currentInput, [getAddress(c.address)]: value })
              }}
            />
          ))}
        </div>

        <SpaceBetweenFormat
          className="mb-4"
          title="Total value"
          value={`$${numeral(totalUSDAmount).format('0,0.[0000]')}`}
        />

        {(() => {
          const totalInput = rebalance.ratio.map((c) => currentInput[getAddress(c.address)]).join('')
          const needsApproval = rebalance.ratio.find((c) => {
            const currentValue = parseFloat(currentInput[getAddress(c.address)])
            const currentAllowance = (_.get(allowances, getAddress(c.address)) || new BigNumber(0)).toNumber()
            return currentAllowance < currentValue && c.symbol !== 'WKLAY' && c.symbol !== 'WBNB'
          })
          if (needsApproval) {
            return (
              <Button fullWidth radii="small" disabled={isApproving} onClick={onApprove(needsApproval)}>
                Approve {needsApproval.symbol}
              </Button>
            )
          }
          return (
            <Button fullWidth radii="small" disabled={isSimulating || totalInput.length === 0} onClick={onNext}>
              Calculate invest amount
            </Button>
          )
        })()}
      </div>
    </Card>
  )
}

const CardCalculate = ({
  setTx,
  currentInput,
  isInvesting,
  setIsInvesting,
  isSimulating,
  recalculate,
  poolUSDBalances,
  poolAmounts,
  onBack,
  onNext,
  rebalance,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const slippage = useSlippage()
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  const totalUserUsdAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  // const minUserUsdAmount = totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))
  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply
  const priceImpact = Math.round((totalUserUsdAmount / totalUsdPool) * 10) / 10
  const priceImpactDisplay = (() => {
    if (priceImpact === Number.POSITIVE_INFINITY || priceImpact === Number.NEGATIVE_INFINITY) return 0
    return priceImpact
  })()

  const handleLocalStorage = async (tx) => {
    const rebalanceAddress: string = getAddress(_.get(rebalance, 'address'))
    const { transactionHash } = tx
    const myInvestTxns = JSON.parse(
      localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
    )

    if (myInvestTxns[rebalanceAddress]) {
      myInvestTxns[rebalanceAddress].push(transactionHash)
    } else {
      myInvestTxns[rebalanceAddress] = [transactionHash]
    }

    localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxns))
  }
  const onInvest = async () => {
    const rebalanceContract = getCustomContract(
      klaytn as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsInvesting(true)
    try {
      let containMainCoin = false
      let mainCoinValue = '0'
      const arrayTokenAmount = ((rebalance || {}).tokens || []).map((token) => {
        if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') {
          containMainCoin = true
          mainCoinValue = new BigNumber((currentInput[token.address] || '0') as string)
            .times(new BigNumber(10).pow(token.decimals))
            .toJSON()
        }
        return new BigNumber((currentInput[token.address] || '0') as string)
          .times(new BigNumber(10).pow(token.decimals))
          .toJSON()
      })

      const usdTokenAmount = new BigNumber((currentInput[usdToken.address] || '0') as string)
        .times(new BigNumber(10).pow(usdToken.decimals))
        .toJSON()
      // const minUsdAmount = new BigNumber(minUserUsdAmount).times(new BigNumber(10).pow(usdToken.decimals)).toJSON()
      if (connector === 'klip') {
        const valueNumber = (Number(mainCoinValue) / 10 ** 18).toString()
        const valueklip = Number.parseFloat(valueNumber).toFixed(6)
        let expectValue = `${(Number(valueklip) + 0.00001) * 10 ** 18}`
        expectValue = expectValue.slice(0, -13)
        const valueKlipParam = mainCoinValue !== '0' ? `${expectValue}0000000000000` : '0'

        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('addFund')),
          // JSON.stringify([arrayTokenAmount, usdTokenAmount, minUsdAmount]),
          JSON.stringify([arrayTokenAmount, usdTokenAmount, 0]),
          setShowModal,
          valueKlipParam,
        )

        const tx = {
          transactionHash: await klipProvider.checkResponse(),
        }
        setShowModal(false)
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          // .addFund(arrayTokenAmount, usdTokenAmount, minUsdAmount)
          .addFund(arrayTokenAmount, usdTokenAmount, 0)
          .send({ from: account, gas: 5000000, ...(containMainCoin ? { value: mainCoinValue } : {}) })
        setTx(tx)
        handleLocalStorage(tx)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalances())
      onNext()
      setIsInvesting(false)
    } catch {
      setIsInvesting(false)
    }
  }

  return (
    <Card className="mb-4">
      <div className={`bd-b ${isMobile ? 'pa-4 pt-2' : 'px-6 py-4'} `}>
        <Button variant="text" ml="-12px" mb="8px" padding="0 12px" startIcon={<ArrowBackIcon />} onClick={onBack}>
          <Text fontSize="14px" color="textSubtle">
            Back
          </Text>
        </Button>

        <CardHeading rebalance={rebalance} />
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        <Text fontSize="24px" bold lineHeight="1.3" className="mb-3">
          Invest
        </Text>

        <div className="flex align-center flex-wrap mb-3">
          <VerticalAssetRatio
            rebalance={rebalance}
            poolAmounts={poolAmounts}
            className={isMobile ? 'col-12' : 'col-5'}
          />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share
              share={
                currentShare <= 0 || Number.isNaN(currentShare)
                  ? numeral(totalUserUsdAmount).format('0,0.[00]')
                  : numeral(currentShare).format('0,0.[00]')
              }
              usd={`~${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
            {false && <PriceUpdate className="mt-3" onClick={recalculate} />}
          </div>
        </div>

        <Text fontSize="12px" textAlign={isMobile ? 'center' : 'left'}>
          Output is estimated. You will receive at least{' '}
          <strong>
            {numeral(totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))).format('0,0.[00]')} USD
          </strong>{' '}
          or the transaction will revert.
        </Text>
      </div>

      <div className={isMobile ? 'pa-4' : 'pa-6 pt-4'}>
        <SpaceBetweenFormat
          className="mb-2"
          title="Minimum Received"
          value={`${numeral(currentShare).format('0,0.[00]')} SHARE`}
        />
        <SpaceBetweenFormat
          className="mb-2"
          title="Price Impact"
          value={`${priceImpactDisplay <= 0.1 ? '< 0.1' : priceImpactDisplay}%`}
          valueColor="success" /* || failure */
        />
        {/* <SpaceBetweenFormat className="mb-2" title="Liquidity Provider Fee" value="0.003996 SIX" /> */}

        <Button fullWidth radii="small" className="mt-2" disabled={isInvesting || isSimulating} onClick={onInvest}>
          Invest
        </Button>
      </div>
    </Card>
  )
}

const CardResponse = ({ tx, rebalance, poolUSDBalances }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { transactionHash } = tx

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  const totalUserUsdAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply

  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4' : 'pa-6'}>
        <div className="flex flex-column align-center justify-center mb-6">
          <Lottie options={SuccessOptions} height={120} width={120} />
          {/* <ErrorIcon width="80px" color="failure" className="mb-3" /> */}
          <Text fontSize="24px" bold textAlign="center">
            Invest Complete
          </Text>
          <Text color="textSubtle" textAlign="center" className="mt-1" fontSize="12px">
            {moment(new Date()).format('DD MMM YYYY, HH:mm')}
          </Text>

          <CardHeading className="mt-6" rebalance={rebalance} />
        </div>

        <div className="flex align-center flex-wrap mb-6">
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share
              share={
                currentShare <= 0 || Number.isNaN(currentShare)
                  ? numeral(totalUserUsdAmount).format('0,0.[00]')
                  : numeral(currentShare).format('0,0.[00]')
              }
              usd={`~${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
          </div>
        </div>

        <SpaceBetweenFormat
          titleElm={
            <div className="flex">
              <Text fontSize="12px" color="textSubtle" className="mr-2">
                Transaction Hash
              </Text>
              <Text fontSize="12px" color="primary" bold>
                {`${transactionHash.slice(0, 4)}...${transactionHash.slice(
                  transactionHash.length - 4,
                  transactionHash.length,
                )}`}
              </Text>
            </div>
          }
          valueElm={
            <UiLink
              href={`https://scope.klaytn.com/tx/${transactionHash}`}
              fontSize="12px"
              color="textSubtle"
              style={{ marginRight: '-4px' }}
            >
              KlaytnScope
              <ChevronRightIcon color="textSubtle" />
            </UiLink>
          }
          className="mb-2"
        />

        <Button as={Link} to="/rebalancing/detail" fullWidth radii="small" className="mt-3">
          Back to Rebalancing
        </Button>
      </div>
    </Card>
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
  const [tx, setTx] = useState({})
  const [poolUSDBalances, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [isInputting, setIsInputting] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isInvested, setIsInvested] = useState(false)
  const [isInvesting, setIsInvesting] = useState(false)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(_.get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})

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
      setIsInputting(true)
      setIsCalculating(false)
      setIsInvested(false)
      setTx({})
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (
      !_.isEqual(rebalance, prevRebalance) ||
      !_.isEqual(balances, prevBalances) ||
      !_.isEqual(currentInput, prevCurrentInput)
    ) {
      setIsSimulating(true)
      const [poolUSDBalancesData, poolAmountsData] = await simulateInvest(
        _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
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
            balance: _.get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )
      setPoolUSDBalances(poolUSDBalancesData)
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
    }
  }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  const totalUSDAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()

  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            {isInputting && (
              <CardInput
                rebalance={rebalance}
                currentInput={currentInput}
                setCurrentInput={setCurrentInput}
                balances={balances}
                allowances={allowances}
                onNext={() => {
                  setIsInputting(false)
                  setIsCalculating(true)
                }}
                totalUSDAmount={totalUSDAmount}
                isSimulating={isSimulating}
              />
            )}{' '}
            {isCalculating && (
              <CardCalculate
                setTx={setTx}
                currentInput={currentInput}
                isInvesting={isInvesting}
                setIsInvesting={setIsInvesting}
                isSimulating={isSimulating}
                recalculate={fetchData}
                poolUSDBalances={poolUSDBalances}
                poolAmounts={poolAmounts}
                rebalance={rebalance}
                onBack={() => {
                  setIsCalculating(false)
                  setIsInputting(true)
                }}
                onNext={() => {
                  setIsCalculating(false)
                  setIsInvested(true)
                }}
              />
            )}
            {isInvested && <CardResponse poolUSDBalances={poolUSDBalances} tx={tx} rebalance={rebalance} />}
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Invest
