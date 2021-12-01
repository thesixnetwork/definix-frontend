import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber } from 'utils/formatBalance'
import { PlusIcon, MinusIcon, Button, Text, ButtonVariants, ColorStyles, Flex, Box } from 'definixswap-uikit'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/CurrencyText'
import { StakeActionProps } from './types'

const StakeAction: React.FC<StakeActionProps> = ({
  componentType = 'pool',
  isOldSyrup,
  isFinished,
  sousId,
  tokenName,
  stakingTokenAddress,
  stakedBalance,
  needsApproval,
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  const { t } = useTranslation()
  const { convertToPriceFromSymbol, convertToBalanceFormat } = useConverter()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const stakedBalanceValue = useMemo(() => {
    return getBalanceNumber(stakedBalance)
  }, [stakedBalance])
  const displayBalance = useMemo(() => {
    return convertToBalanceFormat(stakedBalanceValue)
  }, [convertToBalanceFormat, stakedBalanceValue])
  const stakedBalancePrice = useMemo(() => {
    return new BigNumber(stakedBalanceValue).multipliedBy(price).toNumber()
  }, [stakedBalanceValue, price])

  const { onApprove } = useSousApprove(stakingTokenContract, sousId)

  const handleApprove = useCallback(async () => {
    try {
      setPendingTx(true)
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }, [onApprove, setRequestedApproval])

  const needApproveContract = useMemo(() => {
    return needsApproval && !isOldSyrup
  }, [needsApproval, isOldSyrup])

  const isEnableAddStake = useMemo(() => {
    return !isOldSyrup && !isFinished
  }, [isOldSyrup, isFinished])

  const TitleSection = styled(Text)`
    margin-bottom: ${({ theme }) => theme.spacing.S_8}px;
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_12R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-bottom: ${({ theme }) => theme.spacing.S_6}px;
    }
  `
  const BalanceText = styled(Text)`
    color: ${({ theme }) => theme.colors.black};
    ${({ theme }) => theme.textStyle.R_18M};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_16M};
    }
  `
  const PriceText = styled(CurrencyText)`
    color: ${({ theme }) => theme.colors.deepgrey};
    ${({ theme }) => theme.textStyle.R_14R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
  `

  return (
    <>
      <TitleSection>{t('My Staked')}</TitleSection>
      {account ? (
        <>
          {needApproveContract ? (
            <Button
              width="100%"
              md
              variant={ButtonVariants.BROWN}
              disabled={isFinished || requestedApproval}
              onClick={handleApprove}
            >
              {t('Approve Contract')}
            </Button>
          ) : (
            <Flex justifyContent="space-between">
              <Box>
                <BalanceText>
                  {displayBalance}
                </BalanceText>
                <PriceText value={stakedBalancePrice} prefix="=" />
              </Box>

              {componentType === 'pool' && (
                <Box>
                  <Button
                    minWidth="40px"
                    md
                    variant={ButtonVariants.LINE}
                    disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                    onClick={onPresentWithdraw}
                  >
                    <MinusIcon />
                  </Button>
                  {isEnableAddStake && (
                    <Button
                      minWidth="40px"
                      md
                      variant={ButtonVariants.LINE}
                      disabled={isFinished && sousId !== 0}
                      onClick={onPresentDeposit}
                      style={{ marginLeft: '4px' }}
                    >
                      <PlusIcon />
                    </Button>
                  )}
                </Box>
              )}
            </Flex>
          )}
        </>
      ) : (
        <UnlockButton fullWidth radii="small" />
      )}
    </>
  )
}

export default StakeAction
