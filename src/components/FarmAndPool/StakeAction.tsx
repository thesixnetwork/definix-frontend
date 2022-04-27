import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { PlusIcon, MinusIcon, Button, Text, ButtonVariants, Flex, Box } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import UnlockButton from 'components/UnlockButton'
import { TitleSection } from 'components/FarmAndPool/Styled'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'


interface FarmStakeActionProps {
  componentType?: string
  hasAccount: boolean
  hasUserData: boolean
  hasAllowance: boolean
  onPresentDeposit?: any
  onPresentWithdraw?: any

  isEnableRemoveStake: boolean
  isEnableAddStake: boolean
  onApprove: () => Promise<any>
  stakedBalance: BigNumber
  stakedBalancePrice: number
  stakedBalanceUnit: string

}

const StakeAction: React.FC<FarmStakeActionProps> = ({
  componentType = 'farm',
  hasAccount,
  hasUserData,
  hasAllowance,
  onPresentDeposit,
  onPresentWithdraw,

  isEnableRemoveStake,
  isEnableAddStake,
  onApprove,
  stakedBalance,
  stakedBalancePrice,
  stakedBalanceUnit,


}) => {

  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const { convertToBalanceFormat } = useConverter()
  const [isLoadingApproveContract, setIsLoadingApproveContract] = useState(false)

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
        <BalanceText>
          {convertToBalanceFormat(getBalanceNumber(stakedBalance))}
          <UnitText>{stakedBalanceUnit}</UnitText>
        </BalanceText>
        <PriceText value={stakedBalancePrice} prefix="=" />
        </Box>
    </Flex>
  , [convertToBalanceFormat, stakedBalance, stakedBalancePrice, componentType, stakedBalanceUnit])

  const renderFarmAccordian = useMemo(() => hasAccount ? (hasUserData && hasAllowance ? <Flex justifyContent="space-between">
    {renderBalance}
    {componentType === 'accordian' && <Box>
      <Button
        minWidth="40px"
        md
        variant={ButtonVariants.LINE}
        disabled={isEnableRemoveStake}
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
  , [hasAccount, hasUserData, hasAllowance, renderBalance, componentType, isEnableAddStake, isEnableRemoveStake, onPresentDeposit, isLoadingApproveContract, handleApprove, onPresentWithdraw])

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
        componentType !== 'accordian' ? renderFarm : renderFarmAccordian
      }
    </>
  )
}

export default React.memo(StakeAction)

const BalanceText = styled(Text)`
  display: flex;
  align-items: flex-end;
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
const UnitText = styled(Text)`
  margin-left: 4px;
  ${({ theme }) => theme.textStyle.R_12M};
  color: ${({ theme }) => theme.colors.deepgrey};
  line-height: 1.9;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    line-height: 1.8;
  }
`