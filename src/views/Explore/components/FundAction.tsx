import React, { useCallback, useMemo } from 'react'
import UnlockButton from 'components/UnlockButton'
import { get } from 'lodash'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Button, Card, Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import { getAddress } from 'utils/addressHelpers'
import useComineAmount from 'hooks/useCombineAmount'
import CurrencyText from 'components/CurrencyText'
import { useRebalanceBalances, useBalances } from '../../../state/hooks'
import LabelAndValue from './LabelAndValue'
import { Rebalance } from '../../../state/types'
import SignNumber from './SignNumber'

interface FundActionType {
  className?: string
  rebalance?: Rebalance | any
  isMobile?: boolean
}

const CardStyled = styled(Card)`
  position: sticky;
  top: initial;
  bottom: 20px;
  align-self: start;
  left: 0;
  width: 100%;
  overflow: hidden;
`

const Overlay = styled(Flex)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgb(180 169 168 / 90%);
  pointer-events: initial;
`

const FundAction: React.FC<FundActionType> = ({ className = '', rebalance, isMobile = false }) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)
  const size = isMobile
    ? {
        paddingX: 'S_20',
        paddingY: 'S_20',
      }
    : {
        paddingX: 'S_32',
        paddingY: 'S_24',
      }

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()
  const { diffAmount, percentage } = useComineAmount(rebalance, account, currentBalanceNumber)

  const shares = useMemo(() => {
    return numeral(currentBalanceNumber).format('0,0.[00]')
  }, [currentBalanceNumber])

  const Action = useCallback(
    () => (
      <>
        <Button
          scale="md"
          width="100%"
          minWidth="auto"
          as={Link}
          to="/rebalancing/invest"
          className={isMobile ? 'mr-s12' : 'mb-s12'}
          variant="red"
        >
          {t('Invest')}
        </Button>
        {shares === '0' ? (
          <Button scale="md" width="100%" minWidth="auto" variant="lightbrown" disabled>
            {t('Withdraw')}
          </Button>
        ) : (
          <Button scale="md" width="100%" minWidth="auto" variant="lightbrown" as={Link} to="/rebalancing/withdraw">
            {t('Withdraw')}
          </Button>
        )}
      </>
    ),
    [isMobile, shares, t],
  )

  return (
    <CardStyled mt="S_20" px={size.paddingX} py={size.paddingY} className={className}>
      {isMobile ? (
        <>
          <Flex alignItems="center" justifyContent="space-between" flex="1 1 0" className="mb-s16">
            <Text textStyle="R_14M">{t('Current Investment')}</Text>
            <LabelAndValue label={t('Shares')} value={shares} />
          </Flex>
          <CurrencyText textStyle="R_18B" marginBottom="2px" value={currentBalanceNumber * rebalance.sharedPrice} />
          <Text className="mb-s20">
            {diffAmount !== 0 && (
              <SignNumber textStyle="R_12M" value={diffAmount}>
                {numeral(diffAmount).format('0,0.[00]')}
              </SignNumber>
            )}
            {percentage !== 0 && (
              <SignNumber textStyle="R_12M" value={percentage}>
                {' '}
                ({numeral(percentage).format('0,0.[00]')}%)
              </SignNumber>
            )}
          </Text>
          <Flex>
            <Action />
          </Flex>
        </>
      ) : (
        <Flex justifyContent="space-between">
          <Text textStyle="R_16M" minWidth="216px">
            {t('Current Investment')}
          </Text>
          <Flex flexDirection="column" flexGrow={1}>
            <Flex className="mb-s16">
              <LabelAndValue label={t('Shares')} value={shares} className="pr-s24" />
              {diffAmount !== 0 && (
                <LabelAndValue
                  label={t('Change')}
                  value={numeral(diffAmount).format('0,0.[000]')}
                  signValue={diffAmount}
                  className="bd-l px-s24"
                />
              )}
              {percentage !== 0 && (
                <LabelAndValue
                  label={t('Yield')}
                  value={`${numeral(percentage).format('0,0.[00]')}%`}
                  signValue={percentage}
                  className="bd-l px-s24"
                />
              )}
            </Flex>
            <Text textStyle="R_14R" color="mediumgrey" marginBottom="4px">
              {t('Total Value')}
            </Text>
            <CurrencyText value={currentBalanceNumber * rebalance.sharedPrice} textStyle="R_20B" />
          </Flex>
          <Flex minWidth="160px" flexDirection="column">
            <Action />
          </Flex>
        </Flex>
      )}
      {!account && (
        <Overlay justifyContent="center" alignItems="center">
          <UnlockButton scale="sm" variant="red" maxWidth="160px" />
        </Overlay>
      )}
    </CardStyled>
  )
}

export default FundAction
