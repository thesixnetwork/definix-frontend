/* eslint-disable no-nested-ternary */
import { compact, get } from 'lodash'
import BigNumber from 'bignumber.js'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
import { getAddress } from 'utils/addressHelpers'
import { useDispatch } from 'react-redux'
import { AbiItem } from 'web3-utils'
import { provider } from 'web3-core'
import rebalanceAbi from 'config/abi/rebalance.json'
import { getCustomContract } from 'utils/erc20'
import numeral from 'numeral'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Button, Card, CardBody, ButtonGroup, Divider, Flex, Text, ToastContainer, useMatchBreakpoints, CheckboxLabel, Checkbox, Radio } from 'definixswap-uikit'
import { ArrowBackIcon } from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
import { useTranslation } from 'react-i18next'
import { useRebalanceBalances, useBalances, usePriceFinixUsd } from '../../state/hooks'
import { fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import { Rebalance } from '../../state/types'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import TwoLineFormat from './components/TwoLineFormat'
import { simulateWithdraw } from '../../offline-pool'
import Coin from './components/Coin'
import CardHeading from './components/CardHeading'

interface WithdrawType {
  rebalance: Rebalance | any
}

const InlineAssetRatioLabel = ({ coin, className = '' }) => {
  const thisName = (() => {
    if (coin.symbol === 'WKLAY') return 'KLAY'
    if (coin.symbol === 'WBNB') return 'BNB'
    return coin.symbol
  })()
  return (
    <Flex justifyContent="space-between" alignItems="center" py="S_8" className={className} flexGrow={1}>
      <Coin size="lg" symbol={coin.symbol}>
        <Text textStyle="R_16M">{thisName}</Text>
      </Coin>

      <Text textStyle="R_16R" color="mediumgrey" ml="auto">
        Ratio : {coin.valueRatioCal.toFixed(2)} %
      </Text>
      |
      <Text textStyle="R_16M" color="deepgrey">
        {coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[0000]') : '-'}
      </Text>
    </Flex>
  )
}

enum RatioType {
  Original = 'Original',
  Equal = 'Equal',
  Single = 'Single'
}
const ratioTypes = Object.keys(RatioType);

const CardInput = ({
  setTx,
  isWithdrawing,
  setIsWithdrawing,
  rebalance,
  poolAmounts,
  isSimulating,
  currentInput,
  setCurrentInput,
  onNext,
  ratioType,
  setRatioType,
  currentBalance,
  currentBalanceNumber,
  selectedToken,
  setSelectedToken,
}) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()
  const finixPrice = usePriceFinixUsd()
  const { isDark } = useTheme()

  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice

  const tokens = useMemo(() => compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]), [rebalance])

  const handleLocalStorage = async (tx) => {
    const rebalanceAddress: string = getAddress(get(rebalance, 'address'))
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

  const onWithdraw = async () => {
    const rebalanceContract = getCustomContract(
      klaytn as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsWithdrawing(true)
    try {
      const thisInput = currentBalance.isLessThan(new BigNumber(currentInput))
        ? currentBalance
        : new BigNumber(currentInput)
      const usdToken = get(rebalance, 'usdToken.0', {})
      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('removeFund')),
          JSON.stringify([
            thisInput.times(new BigNumber(10).pow(18)).toJSON(),
            ratioType === RatioType.Original,
            ((rebalance || {}).tokens || []).map((token, index) => {
              const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
              return selectedToken[tokenAddress]
                ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
                : 0
            }),
            selectedToken[typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)]
              ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
              : 0,
          ]),
          setShowModal,
        )
        const tx = await klipProvider.checkResponse()
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          .removeFund(
            thisInput.times(new BigNumber(10).pow(18)).toJSON(),
            ratioType === RatioType.Original,
            ((rebalance || {}).tokens || []).map((token, index) => {
              const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
              return selectedToken[tokenAddress]
                ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
                : 0
            }),
            selectedToken[typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)]
              ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
              : 0,
          )
          .send({ from: account, gas: 5000000 })
        setTx(tx)
        handleLocalStorage(tx)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      onNext()
      setIsWithdrawing(false)
    } catch {
      setIsWithdrawing(false)
    }
  }

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
      
      <Card p={isMobile ?  'S_20' : 'S_40'}>
        <Box mb="S_40">
          <TwoLineFormat
            title={t('Current Investment')}
            titleColor={isDark ? '#ADB4C2' : ''}
            value={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
            subTitle={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
            large
            className="mb-4"
          />

          <CurrencyInputPanel
            currency={{ symbol: 'Shares', hide: true }}
            id="withdraw-fund"
            showMaxButton
            hideBalance
            value={currentInput}
            onUserInput={setCurrentInput}
            onMax={() => {
              setCurrentInput(new BigNumber(currentBalance).toJSON())
            }}
            onQuarter={() => {
              setCurrentInput(new BigNumber(currentBalance).times(0.25).toJSON())
            }}
            onHalf={() => {
              setCurrentInput(new BigNumber(currentBalance).times(0.5).toJSON())
            }}
          />
          <Text fontSize="12px" color="textSubtle" className="mt-1" textAlign="right">
            ~ ${numeral(usdToBeRecieve).format('0,0.[00]')}
          </Text>
        </Box>

        <Box>
          {/* <SpaceBetweenFormat
            className="mb-2"
            title="Price Impact"
            value="< 0.1%"
            valueColor="success"
          /> */}
          <SpaceBetweenFormat
            className="mb-2"
            title={`Management fee ${get(rebalance, 'fee.management', 0.2)}%`}
            value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.management', 0.2))).format('0,0.[0000]')}`}
            hint="Fee collected for vault management."
          />
          <SpaceBetweenFormat
            className="mb-2"
            title={`FINIX buy back fee ${get(rebalance, 'fee.buyback', 1.5)}%`}
            value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.buyback', 1.5))).format('0,0.[0000]')}`}
            hint="Fee collected for buyback and burn of FINIX as deflationary purpose."
          />
          <SpaceBetweenFormat
            title={`Ecosystem fee ${get(rebalance, 'fee.bounty', 0.3)}%`}
            value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.bounty', 0.3))).format('0,0.[0000]')}`}
            hint="Reservation fee for further development of the ecosystem."
          />
        </Box>
        {/* <SpaceBetweenFormat
          className="mb-2"
          titleElm={
            <div className="flex pr-3">
              <Text fontSize="12px" color="textSubtle">
                Early withdrawal fee
              </Text>
              <Helper text="" className="mx-2" position="top" />
              <Text fontSize="12px" color="textSubtle">
                00:00
              </Text>
            </div>
          }
          title="Early withdrawal fee 0.5%"
          value="$00 "
          hint="xx"
        /> */}

        <Divider my="S_32" />

        <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" mb="S_32">
          <Text textStyle="R_16M" color="mediumgrey">{t('Withdrawal ratio')}</Text>
          <ButtonGroup>
            {ratioTypes.map((label) => (
              <Button
                scale="sm"
                variant={label === ratioType ? 'primary' : 'text'}
                onClick={() => {
                  setRatioType(label)
                }}
              >
                {t(label)}
              </Button>
            ))}
          </ButtonGroup>
        </Flex>
        <Box mb="S_40">
          {ratioType === RatioType.Original ? (
            tokens
              .map((token, index) => {
                const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
                const ratios = get(rebalance, `ratioCal`)
                // eslint-disable-next-line
                const ratioMerge = Object.assign({ valueRatioCal: ratios ? ratios[index] : 0 }, ratioObject)
                return {
                  ...token,
                  ...ratioMerge,
                  amount: ((poolAmounts || [])[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
                }
              })
              .filter((rt) => rt.value)
              .map((c) => <InlineAssetRatioLabel coin={c} />)
          ) :
          ratioType === RatioType.Equal ? (
            <>equal</>
          ) :
          (
            <>
              {tokens
                .map((token, index) => {
                  const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)

                  let countSelect = 0

                  const keys = Object.keys(selectedToken)
                  for (let i = 0; i < keys.length; i++) {
                    if (selectedToken[keys[i]] === true) ++countSelect
                  }

                  let valueCalRatio = 0
                  for (let i = 0; i < keys.length; i++) {
                    if (selectedToken[keys[i]] === true && keys[i] === getAddress(ratioObject.address))
                      valueCalRatio = 100 / countSelect
                  }
                  // eslint-disable-next-line
                  const ratioMerge = Object.assign({ valueRatioCal: valueCalRatio }, ratioObject)

                  return {
                    ...token,
                    ...ratioMerge,
                    amount: (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
                  }
                })
                .filter((rt) => rt.value)
                .map((c) => (
                  <CheckboxLabel
                    width="100%"
                    className="flex align-center"
                    control={
                      <Checkbox
                        scale="sm"
                        color="primary"
                        checked={!!selectedToken[getAddress(c.address)]}
                        onChange={(event) => {
                          setSelectedToken({[getAddress(c.address)]: event.target.checked })
                        }}
                      />
                    }
                    >
                    <InlineAssetRatioLabel coin={c} />
                  </CheckboxLabel>
                ))}
            </>
          )}
        </Box>

        <Button scale="lg" width="100%" disabled={isWithdrawing || isSimulating} onClick={onWithdraw}>
          Withdraw
        </Button>
      </Card>
    </>
  )
}


const Withdraw: React.FC<WithdrawType> = ({ rebalance }) => {
  const { t } = useTranslation()
  const [tx, setTx] = useState({})
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


  const [toasts, setToasts] = useState([]);
  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
  };

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
        <CardInput
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
            setToasts((prevToasts) => [{
              title: t('Withdraw Complete'),
              type: "success",
            }, ...prevToasts]);
          }}
        />
      </div>
      <ToastContainer toasts={toasts} onRemove={handleRemove} />
    </Box>
  )
}

export default Withdraw
