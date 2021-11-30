import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import { useApprove } from 'hooks/useApprove'
import useConverter from 'hooks/useConverter'
import { useFarmFromSymbol, useFarmUnlockDate } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { getBalanceNumber } from 'utils/formatBalance'
import { PlusIcon, MinusIcon, Button, Text, ButtonVariants, Flex, Box } from 'definixswap-uikit'
import CurrencyText from 'components/CurrencyText'
import UnlockButton from 'components/UnlockButton'

interface FarmStakeActionProps {
  componentType?: string
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
  componentType = 'farm',
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
  const { convertToBalanceFormat } = useConverter()

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
    return getBalanceNumber(myLiquidity)
  }, [myLiquidity])

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
    color: ${({ theme }) => theme.colors.deepgrey};
    ${({ theme }) => theme.textStyle.R_14R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
  `

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
      <TitleSection>
        {t('My Liquidity')}
      </TitleSection>
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
                    <BalanceText>
                      {convertToBalanceFormat(myLiquidityValue)}
                    </BalanceText>
                    <PriceText value={myLiquidityValue} prefix="="/>
                  </Box>

                  {componentType === 'farm' && (
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
                  )}
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
