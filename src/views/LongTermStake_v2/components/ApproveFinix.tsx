import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, useModal, AlertIcon } from '@fingerlabs/definixswap-uikit-v2'
import { useApprove } from 'hooks/useLongTermStake'
import * as klipProvider from 'hooks/klipProvider'
import { useToast } from 'state/hooks'
import styled from 'styled-components'
import UnlockButton from 'components/UnlockButton'

import StakeModal from './StakeModal'
import { IsMobileType } from './types'

interface ApproveFinixProps extends IsMobileType {
  hasAccount: boolean
  isApproved: boolean
  inputBalance: string
  setInputBalance: React.Dispatch<React.SetStateAction<string>>
  days: number
  endDay: string
  earn: number
  isError: boolean
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
  endDay,
  earn,
  isError,
}) => {
  const { t } = useTranslation()
  const [onPresentStakeModal] = useModal(
    <StakeModal balance={inputBalance} setInputBalance={setInputBalance} period={days} end={endDay} earn={earn} />,
    false,
  )
  const [error] = useState<string>('') // UX 상황별 버튼 상태 수정으로 인해 영역만 남겨둠

  const [transactionHash, setTransactionHash] = useState<string>('')
  const { onApprove } = useApprove(klipProvider.MAX_UINT_256_KLIP)
  const [isLoadingApprove, setIsLoadingApprove] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const handleApprove = useCallback(async () => {
    try {
      setIsLoadingApprove(true)
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(_.get(txHash, 'transactionHash'))
      }
      toastSuccess(t('{{Action}} Complete', { Action: t('Approve') }))
    } catch (e) {
      toastError(t('{{Action}} Failed', { Action: t('Approve') }))
    } finally {
      setIsLoadingApprove(false)
    }
  }, [onApprove, toastSuccess, toastError, t])

  return (
    <>
      <FlexApprove>
        {!isApproved && transactionHash === '' ? (
          <Button height="48px" mb="S_12" variant="brown" isLoading={isLoadingApprove} onClick={handleApprove}>
            {t('Approve {{Token}}', { Token: t('FINIX') })}
          </Button>
        ) : (
          <Flex flexDirection="column">
            {hasAccount ? (
              <Button
                height="48px"
                mb="S_12"
                disabled={(!isApproved && transactionHash === '') || isError}
                onClick={onPresentStakeModal}
              >
                {t('Stake')}
              </Button>
            ) : (
              <UnlockButton />
            )}
            {hasAccount && error && (
              <Flex alignItems="flex-start">
                <Flex mt="S_2">
                  <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
                </Flex>
                <Text ml="S_4" textStyle="R_14R" color="red">
                  {error}
                </Text>
              </Flex>
            )}
          </Flex>
        )}
      </FlexApprove>
    </>
  )
}

export default ApproveFinix
