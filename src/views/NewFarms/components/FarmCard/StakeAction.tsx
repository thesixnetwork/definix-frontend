import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import styled from 'styled-components'
import { useApprove } from 'hooks/useApprove'
import { useFarmFromSymbol, useFarmUnlockDate } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { getFullDisplayBalance } from 'utils/formatBalance'
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
import UnlockButton from 'components/UnlockButton'

interface FarmStakeActionProps {
  klaytn?: provider
  account?: string
  onPresentDeposit?: any
  onPresentWithdraw?: any
  isApproved: boolean
  hasAllowance: boolean
  lpSymbol: string
  myLiquidity: BigNumber
  myLiquidityUSD: any
}

const StakeAction: React.FC<FarmStakeActionProps> = ({
  isApproved,
  hasAllowance,
  myLiquidity,
  myLiquidityUSD,
  lpSymbol,
  klaytn,
  account,
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  const { t } = useTranslation()

  const [pendingTx, setPendingTx] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)

  const { lpAddresses } = useFarmFromSymbol(lpSymbol)
  const lpAddress = getAddress(lpAddresses)
  const lpContract = useMemo(() => getContract(klaytn as provider, lpAddress), [klaytn, lpAddress])
  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setPendingTx(true)
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }, [onApprove])

  const needApproveContract = useMemo(() => !isApproved, [isApproved])

  const farmUnlockDate = useFarmUnlockDate()
  const isEnableAddStake = useMemo(() => {
    return (
      typeof farmUnlockDate === 'undefined' ||
      (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())
    )
  }, [farmUnlockDate])

  const myLiquidityValue = useMemo(() => {
    try {
      return getFullDisplayBalance(myLiquidity, { fixed: 10 })
    } catch (error) {
      return '-'
    }
  }, [myLiquidity])

  return (
    // <div className={className}>
    //   {account ? (
    //     <>
    //       {isApproved ? (
    //         <div>
    //           <Text color="textSubtle">My Liquidity</Text>
    //           <Heading fontSize="20px !important" textAlign="left" color="text" className="col-6 pr-3">
    //             {myLiquidityValue}
    //           </Heading>
    //           <Text color="textSubtle">= {myLiquidityUSD}</Text>

    //           <div className="col-6">
    //             <IconButtonWrapper>
    //               <Button
    //                 variant="secondary"
    //                 disabled={myLiquidity.eq(new BigNumber(0))}
    //                 onClick={onPresentWithdraw}
    //                 className="btn-secondary-disable col-6 mr-1"
    //               >
    //                 <MinusIcon color="primary" />
    //               </Button>
    //               {(typeof farmUnlockDate === 'undefined' ||
    //                 (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())) && (
    //                 <Button variant="secondary" className="btn-secondary-disable col-6 ml-1" onClick={onPresentDeposit}>
    //                   <AddIcon color="primary" />
    //                 </Button>
    //               )}
    //             </IconButtonWrapper>
    //           </div>
    //         </div>
    //       ) : (
    //         <Button fullWidth radii="small" disabled={pending} onClick={handleApprove}>
    //           {TranslateString(758, 'Approve Contract')}
    //         </Button>
    //       )}
    //     </>
    //   ) : (
    //     <UnlockButton fullWidth radii="small" />
    //   )}
    // </div>
    <>
      <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
        My Liquidity
      </Text>
      {account ? (
        <>
          {hasAllowance ? (
            <>
              {needApproveContract ? (
                <Button
                  width="100%"
                  md
                  variant={ButtonVariants.BROWN}
                  disabled={requestedApproval}
                  onClick={handleApprove}
                >
                  Approve Contract
                </Button>
              ) : (
                <Flex justifyContent="space-between">
                  <Box>
                    <Text textStyle="R_18M" color={ColorStyles.BLACK}>
                      {myLiquidityValue}
                    </Text>
                    <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
                      = {myLiquidityUSD}
                    </Text>
                  </Box>

                  <Box>
                    <Button
                      minWidth="40px"
                      md
                      variant={ButtonVariants.LINE}
                      disabled={myLiquidity.eq(new BigNumber(0)) || pendingTx}
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
                  </Box>
                </Flex>
              )}
            </>
          ) : (
            <p>loading...</p>
          )}
        </>
      ) : (
        <UnlockButton />
      )}
    </>
  )
}

export default StakeAction
