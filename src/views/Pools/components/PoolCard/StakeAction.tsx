import React, { useCallback, useState, useMemo } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useSousApprove } from 'hooks/useApprove'
import { useERC20 } from 'hooks/useContract'
import useConverter from 'hooks/useConverter'
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
}) => {
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const stakingTokenContract = useERC20(stakingTokenAddress)

  const displayBalance = useMemo(() => {
    return getFullDisplayBalance(stakedBalance, { fixed: 6 })
  }, [stakedBalance])
  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])
  const stakedBalancePrice = useMemo(() => {
    return convertToUSD(new BigNumber(getBalanceNumber(stakedBalance)).multipliedBy(price), 2)
  }, [stakedBalance, price, convertToUSD])

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

  return (
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        My Staked
      </Text>
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
              Approve Contract
            </Button>
          ) : (
            <Flex justifyContent="space-between">
              <Box>
                <Text textStyle="R_18M" color={ColorStyles.BLACK}>
                  {displayBalance}
                </Text>
                <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
                  = {stakedBalancePrice}
                </Text>
              </Box>

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
