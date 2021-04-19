import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Flex, Text, InjectedModalProps } from 'uikit-dev'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getDefinixProfileAddress } from 'utils/addressHelpers'
import { useFinix } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import { useProfile } from 'state/hooks'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import useHasFinixBalance from 'hooks/useHasFinixBalance'
import { UseEditProfileResponse } from './reducer'
import ProfileAvatar from '../ProfileAvatar'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const DangerOutline = styled(Button).attrs({ variant: 'secondary', fullWidth: true })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const StartPage: React.FC<StartPageProps> = ({ goToApprove, goToChange, goToRemove, onDismiss }) => {
  const [needsApproval, setNeedsApproval] = useState(null)
  const { profile } = useProfile()
  const { numberFinixToUpdate, numberFinixToReactivate } = useGetProfileCosts()
  const hasMinimumFinixRequired = useHasFinixBalance(profile.isActive ? numberFinixToUpdate : numberFinixToReactivate)
  const TranslateString = useI18n()
  const { account } = useWallet()
  const finixContract = useFinix()
  const cost = profile.isActive ? numberFinixToUpdate : numberFinixToReactivate

  /**
   * Check if the wallet has the required FINIX allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const response = await finixContract.methods.allowance(account, getDefinixProfileAddress()).call()
      const currentAllowance = new BigNumber(response)
      setNeedsApproval(currentAllowance.lt(cost))
    }

    if (account) {
      checkApprovalStatus()
    }
  }, [account, cost, setNeedsApproval, finixContract])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <ProfileAvatar profile={profile} />
      <Flex alignItems="center" style={{ height: '48px' }} justifyContent="center">
        <Text as="p" color="failure">
          {!hasMinimumFinixRequired &&
            TranslateString(999, `${getFullDisplayBalance(numberFinixToUpdate)} FINIX required to change profile pic`)}
        </Text>
      </Flex>
      {profile.isActive ? (
        <>
          <Button
            fullWidth
            mb="8px"
            onClick={needsApproval === true ? goToApprove : goToChange}
            disabled={!hasMinimumFinixRequired || needsApproval === null}
          >
            {TranslateString(999, 'Change Profile Pic')}
          </Button>
          <DangerOutline onClick={goToRemove}>{TranslateString(999, 'Remove Profile Pic')}</DangerOutline>
        </>
      ) : (
        <Button
          fullWidth
          mb="8px"
          onClick={needsApproval === true ? goToApprove : goToChange}
          disabled={!hasMinimumFinixRequired || needsApproval === null}
        >
          {TranslateString(999, 'Reactivate Profile')}
        </Button>
      )}
      <Button variant="text" fullWidth onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Flex>
  )
}

export default StartPage
