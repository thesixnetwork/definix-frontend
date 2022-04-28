import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { PlusIcon, MinusIcon, Button, Text, ButtonVariants, Flex, Box } from '@fingerlabs/definixswap-uikit-v2'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/Text/CurrencyText'
import { StakeActionProps } from './types'

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
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`

const StakeAction: React.FC<StakeActionProps> = ({
  componentType = 'pool',
  pool,
  isOldSyrup,
  isBnbPool,
  hasAccount,
  hasUserData,
  hasAllowance,
  stakedBalance,
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const { convertToPriceFromSymbol, convertToBalanceFormat } = useConverter()
  const [isLoadingApproveContract, setIsLoadingApproveContract] = useState(false)

  const stakingTokenContract = useERC20(pool.stakingTokenAddress)
  const stakedBalanceValue = useMemo(() => getBalanceNumber(stakedBalance), [stakedBalance])
  const displayBalance = useMemo(() => {
    return convertToBalanceFormat(stakedBalanceValue)
  }, [convertToBalanceFormat, stakedBalanceValue])
  const stakedBalancePrice = useMemo(() => {
    const price = convertToPriceFromSymbol(pool.tokenName)
    return new BigNumber(stakedBalanceValue).multipliedBy(price).toNumber()
  }, [stakedBalanceValue, convertToPriceFromSymbol, pool.tokenName])

  const { onApprove } = useSousApprove(stakingTokenContract, pool.sousId)

  const handleApprove = useCallback(async () => {
    try {
      setIsLoadingApproveContract(true)
      const txHash = await onApprove()
      if (txHash) {
        toastSuccess(t('{{Action}} Complete', { Action: t('actionApprove') }))
      } else {
        // user rejected tx or didn't go thru
        throw new Error()
      }
    } catch (e) {
      console.error(e)
      toastError(t('{{Action}} Failed', { Action: t('actionApprove') }))
    } finally {
      setIsLoadingApproveContract(false)
    }
  }, [onApprove, toastError, toastSuccess, t])

  // const needApproveContract = useMemo(() => {
  //   return needsApprovalContract && !isOldSyrup
  // }, [needsApprovalContract, isOldSyrup])

  const isEnableAddStake = useMemo(() => {
    return !isOldSyrup && !pool.isFinished && !isBnbPool
  }, [isOldSyrup, pool.isFinished, isBnbPool])

  const renderBalance = useMemo(() => <Box>
    <BalanceText>{displayBalance}</BalanceText>
    <PriceText value={stakedBalancePrice} prefix="=" />
  </Box>
  , [displayBalance, stakedBalancePrice, componentType])

  const renderPoolAccordian = useMemo(() => hasAccount ? (hasUserData && hasAllowance ? <Flex justifyContent="space-between">
    {renderBalance}
    {componentType == 'pool-accordian' && <Box>
        <Button
          minWidth="40px"
          md
          variant={ButtonVariants.LINE}
          disabled={stakedBalance.eq(new BigNumber(0)) || isLoadingApproveContract}
          onClick={onPresentWithdraw}
        >
          <MinusIcon />
        </Button>
        {isEnableAddStake && (
          <Button
            minWidth="40px"
            md
            variant={ButtonVariants.LINE}
            disabled={pool.isFinished && pool.sousId !== 0}
            onClick={onPresentDeposit}
            style={{ marginLeft: '4px' }}
          >
            <PlusIcon />
          </Button>
        )}
      </Box>}
    </Flex> : <Button
      width="100%"
      md
      variant={ButtonVariants.BROWN}
      isLoading={!hasUserData || isLoadingApproveContract}
      onClick={handleApprove}
    >
      {t('Approve Contract')}
    </Button>) : <UnlockButton fullWidth radii="small" />
  , [hasAccount, hasUserData, hasAllowance, renderBalance, componentType, stakedBalance, isEnableAddStake, onPresentDeposit, isLoadingApproveContract, handleApprove, onPresentWithdraw])

  const renderPool = useMemo(() => <Flex justifyContent="space-between">
    {hasAccount ? renderBalance : <Box>
        <BalanceText>-</BalanceText>
        </Box>}
      </Flex>
  , [hasAccount, renderBalance])

  return (
    <>
      <TitleSection>{t('My Staked')}</TitleSection>
      {
        componentType !== 'pool-accordian' ? renderPool : renderPoolAccordian
      }
    </>
  )
}

export default StakeAction
