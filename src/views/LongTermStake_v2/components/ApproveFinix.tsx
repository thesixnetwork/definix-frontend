import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, useModal, ImgTokenFinixIcon, AlertIcon, Divider } from 'definixswap-uikit-v2'
import styled from 'styled-components'
import UnlockButton from 'components/UnlockButton'

import StakeModal from './StakeModal'
import { IsMobileType } from './types'

interface ApproveFinixProps extends IsMobileType {
  hasAccount: boolean
  inputBalance: string
  days: number
  endDay: string
  earn: number
  isError: boolean
}

const FlexApprove = styled(Flex)`
  flex-direction: column;
  width: 100%;
`

const FlexApprroveBtn = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  margin-bottom: 28px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 24px;
    margin-bottom: 32px;
  }
`

const ApproveFinix: React.FC<ApproveFinixProps> = ({
  isMobile,
  hasAccount,
  inputBalance,
  days,
  endDay,
  earn,
  isError,
}) => {
  const { t } = useTranslation()
  const [onPresentStakeModal] = useModal(
    <StakeModal balance={inputBalance} period={days} end={endDay} earn={earn} onOK={() => null} />,
    false,
  )
  const [approve] = useState<boolean>(true)
  const [error] = useState<string>('') // UX 상황별 버튼 상태 수정으로 인해 영역만 남겨둠

  return (
    <>
      <FlexApprove>
        {!approve && (
          <>
            <Divider width="100%" backgroundColor="lightGrey50" />
            <FlexApprroveBtn>
              <Flex mb={`${isMobile && 'S_8'}`} alignItems="center">
                <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
                <Text ml={`${isMobile ? 'S_10' : 'S_12'}`} textStyle="R_16M" color="mediumgrey">
                  {t('FINIX')}
                </Text>
              </Flex>
              {hasAccount && (
                <Button
                  width={`${isMobile ? '100%' : '186px'}`}
                  variant={`${approve ? 'line' : 'brown'}`}
                  disabled={approve}
                >
                  {t('Approve {{Token}}', { Token: t('FINIX') })}
                </Button>
              )}
            </FlexApprroveBtn>
          </>
        )}
        <Flex flexDirection="column">
          {hasAccount ? (
            <Button mb="S_12" disabled={!approve || isError} onClick={onPresentStakeModal}>
              {t('Stake')}
            </Button>
          ) : (
            <UnlockButton />
          )}
          {hasAccount && error && (
            <Flex alignItems="center">
              <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              <Text ml="S_4" textStyle="R_14R" color="red">
                {error}
              </Text>
            </Flex>
          )}
        </Flex>
      </FlexApprove>
    </>
  )
}

export default ApproveFinix
