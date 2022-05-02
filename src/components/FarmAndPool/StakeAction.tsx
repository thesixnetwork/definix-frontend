import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useConverter from 'hooks/useConverter'
import { useToast } from 'state/hooks'
import { PlusIcon, MinusIcon, Button, ButtonVariants, Flex, Box } from '@fingerlabs/definixswap-uikit-v2'
import UnlockButton from 'components/UnlockButton'
import { PriceText, StyledBalanceText, TitleSection } from 'components/FarmAndPool/Styled'
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
        <StyledBalanceText value={getBalanceNumber(stakedBalance)} fixed="6" postfix={stakedBalanceUnit} />
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
      <StyledBalanceText value="-" />
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
