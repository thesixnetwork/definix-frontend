import React, { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flex, Button, useModal } from '@fingerlabs/definixswap-uikit-v2'
import { useApprove } from 'hooks/useLongTermStake'
import { useToast } from 'state/hooks'
import styled from 'styled-components'
import UnlockButton from 'components/UnlockButton'

import StakeModal from './StakeModal'
import { IsMobileType } from './types'
import { MAX_UINT_256_KLIP } from 'hooks/useKlipContract'

interface ApproveFinixProps extends IsMobileType {
  hasAccount: boolean
  isApproved: boolean
  inputBalance: string
  setInputBalance: React.Dispatch<React.SetStateAction<string>>
  days: number
  earn: number
  isError: boolean
  possibleSuperStake: boolean
}

const FlexApprove = styled(Flex)`
  flex-direction: column;
  width: 100%;
`

const ApproveFinix: React.FC<ApproveFinixProps> = ({
  hasAccount,
  isApproved,
  inputBalance,
  setInputBalance,
  days,
  earn,
  isError,
  possibleSuperStake,
}) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isSuperStake = useMemo(() => /super/.test(pathname), [pathname])
  const [onPresentStakeModal] = useModal(
    <StakeModal balance={inputBalance} setInputBalance={setInputBalance} days={days} earn={earn} pathname={pathname} />,
    false,
  )
  // const [error] = useState<string>('') // UX 상황별 버튼 상태 수정으로 인해 영역만 남겨둠

  const { onApprove } = useApprove(MAX_UINT_256_KLIP)
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const handleApprove = useCallback(async () => {
    try {
      setIsLoadingApprove(true)
      await onApprove()
      toastSuccess(t('{{Action}} Complete', { Action: t('actionApprove') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('actionApprove') }))
    } finally {
      setIsLoadingApprove(false)
    }
  }, [onApprove, toastSuccess, toastError, t])

  const disabledStakeButton = () => {
    if (!isApproved || isError) return true
    if (isSuperStake && !possibleSuperStake) return true
    return false
  }

  const statusApprove = () => {
    return !isApproved ? (
      <Button height="48px" mb="S_12" variant="brown" isLoading={isLoadingApprove} onClick={handleApprove}>
        {t('Approve Contract')}
      </Button>
    ) : (
      <Button height="48px" mb="S_12" disabled={disabledStakeButton()} onClick={onPresentStakeModal}>
        {t('Stake')}
      </Button>
    )
  }

  return (
    <>
      <FlexApprove>
        <Flex flexDirection="column">
          {hasAccount ? statusApprove() : <UnlockButton />}

          {/* {hasAccount && error && (
            <Flex alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red">
                {error}
              </Text>
            </Flex>
          )} */}
        </Flex>
      </FlexApprove>
    </>
  )
}

export default ApproveFinix
