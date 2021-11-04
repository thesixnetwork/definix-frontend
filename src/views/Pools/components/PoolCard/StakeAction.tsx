import React, { useCallback, useState, useMemo } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import {
  PlusIcon,
  MinusIcon,
  Button,
  Text,
  ButtonVariants,
  ButtonScales,
  ColorStyles,
  Flex,
  Box,
} from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import numeral from 'numeral'
import { StakeActionProps } from './types'

const StakeAction: React.FC<StakeActionProps> = ({
  sousId,
  isOldSyrup,
  tokenName,
  stakingTokenAddress,
  stakedBalance,
  needsApproval,
  isFinished,
  onPresentDeposit,
  onPresentWithdraw,
  className = '',
}) => {
  const TranslateString = useI18n()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const displayBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance, { fixed: 6 })
  }, [stakedBalance])

  const { onApprove } = useSousApprove(stakingTokenContract, sousId)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const hasContract = useMemo(() => {
    return needsApproval && !isOldSyrup
  }, [needsApproval, isOldSyrup])

  const isEnableAddStake = useMemo(() => {
    return !isOldSyrup && !isFinished
  }, [isOldSyrup, isFinished])

  return (
    <div className={className}>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R">
        My Staked
      </Text>
      {account ? (
        <>
          {hasContract ? (
            <Button
              scale={ButtonScales.S40}
              variant={ButtonVariants.BROWN}
              disabled={isFinished || requestedApproval}
              onClick={handleApprove}
            >
              Approve Contract
            </Button>
          ) : (
            <Flex justifyContent="space-between">
              <Text textStyle="R_18M" color={ColorStyles.BLACK}>
                {displayBalance}
              </Text>

              <Box>
                <Button
                  minWidth="40px"
                  scale={ButtonScales.S40}
                  variant={ButtonVariants.LINE}
                  disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                  onClick={onPresentWithdraw}
                >
                  <MinusIcon />
                </Button>
                {isEnableAddStake && (
                  <Button
                    minWidth="40px"
                    scale={ButtonScales.S40}
                    variant={ButtonVariants.LINE}
                    disabled={isFinished && sousId !== 0}
                    onClick={onPresentDeposit}
                  >
                    <PlusIcon />
                  </Button>
                )}
              </Box>
            </Flex>
          )}
        </>
      ) : (
        <UnlockButton fullWidth radii="small" />
      )}
    </div>
  )
}

export default StakeAction
