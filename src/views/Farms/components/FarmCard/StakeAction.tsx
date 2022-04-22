import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useApprove } from 'hooks/useApprove'
import useConverter from 'hooks/useConverter'
import { useFarmUnlockDate, useToast } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { PlusIcon, MinusIcon, Button, Text, ButtonVariants, Flex, Box } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import UnlockButton from 'components/UnlockButton'


interface FarmStakeActionProps {
  componentType?: string
  hasAccount: boolean
  hasUserData: boolean
  hasAllowance: boolean
  myLiquidity: BigNumber
  myLiquidityPrice: BigNumber
  lpContract: Contract
  onPresentDeposit?: any
  onPresentWithdraw?: any
}

const StakeAction: React.FC<FarmStakeActionProps> = ({
  componentType = 'farm',
  hasAccount,
  hasUserData,
  hasAllowance,
  myLiquidity,
  myLiquidityPrice,
  lpContract,
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const { convertToBalanceFormat } = useConverter()
  const [isLoadingApproveContract, setIsLoadingApproveContract] = useState(false)

  const farmUnlockDate = useFarmUnlockDate()
  const isEnableAddStake = useMemo(() => {
    return (
      typeof farmUnlockDate === 'undefined' ||
      (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())
    )
  }, [farmUnlockDate])
  const myLiquidityValue = useMemo(() => getBalanceNumber(myLiquidity), [myLiquidity])

  const { onApprove } = useApprove(lpContract)
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
      toastError(t('{{Action}} Failed', { Action: t('actionApprove') }))
    } finally {
      setIsLoadingApproveContract(false)
    }
  }, [onApprove, toastError, toastSuccess, t])

  const renderBalance = useMemo(() => <Flex justifyContent="space-between">
      <Box>
        <BalanceText>{convertToBalanceFormat(myLiquidityValue)}</BalanceText>
        <PriceText value={myLiquidityPrice.toNumber()} prefix="=" />
        </Box>
    </Flex>
  , [myLiquidityValue, myLiquidityValue, componentType])

  const renderFarmAccordian = useMemo(() => hasAccount ? (hasUserData && hasAllowance ? <Flex justifyContent="space-between">
    {renderBalance}
    {componentType == 'farm-accordian' && <Box>
      <Button
        minWidth="40px"
        md
        variant={ButtonVariants.LINE}
        disabled={myLiquidity.eq(new BigNumber(0)) || isLoadingApproveContract}
        onClick={onPresentWithdraw}
      >
        <MinusIcon />
      </Button>
      {isEnableAddStake && (
        <Button
          minWidth="40px"
          md
          variant={ButtonVariants.LINE}
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
    </Button>) : <UnlockButton />
  , [hasAccount, hasUserData, hasAllowance, renderBalance, componentType, myLiquidity, isEnableAddStake, onPresentDeposit, isLoadingApproveContract, handleApprove, onPresentWithdraw])

const renderFarm = useMemo(() => <Flex justifyContent="space-between">
  {hasAccount ? renderBalance : <Box>
      <BalanceText>-</BalanceText>
      </Box>}
    </Flex>
  , [hasAccount, renderBalance])
  

  return (
    <>
      <TitleSection>{t('My Staked')}</TitleSection>
      {
        componentType !== 'farm-accordian' ? renderFarm : renderFarmAccordian
      }
    </>
  )
}

export default React.memo(StakeAction)

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