/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from 'lodash'
import { provider } from 'web3-core'

import { Box, Button, Card, CardBody, CheckBIcon, Divider, Flex, Text, useMatchBreakpoints } from 'definixswap-uikit'

import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiERC20ByName } from 'hooks/hookHelper'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import { useDispatch } from 'react-redux'
import { usePriceFinixUsd } from 'state/hooks'
import { fetchAllowances, fetchBalances } from 'state/wallet'
import CurrencyInputPanel from './CurrencyInputPanel'
import SummaryCard, { SummaryItem } from './SummaryCard'

interface InvestInputCardProp {
  isSimulating
  balances
  allowances
  onNext
  rebalance
  setCurrentInput
  currentInput
  sumPoolAmount
}

const InvestInputCard: React.FC<InvestInputCardProp> = ({
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
      <SummaryCard
        rebalance={rebalance}
        isMobile={isMobile}
        typeB
        items={[SummaryItem.YIELD_APR, SummaryItem.SHARE_PRICE, SummaryItem.RISK_O_METER]}
      />

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
                  showMaxButton={max !== currentInput[c.cAddress]}
                  className="mb-s24"
                  value={currentInput[c.cAddress]}
                  max={c.cMax}
                  onMax={() => {
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
          <Divider mb="S_32" />
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
        </CardBody>
      </Card>
    </>
  )
}

export default InvestInputCard
