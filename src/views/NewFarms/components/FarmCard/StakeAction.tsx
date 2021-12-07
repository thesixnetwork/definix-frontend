import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useApprove } from 'hooks/useApprove'
import useConverter from 'hooks/useConverter'
import { useFarmUnlockDate } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { PlusIcon, MinusIcon, Button, Text, ButtonVariants, Flex, Box } from 'definixswap-uikit'
import CurrencyText from 'components/CurrencyText'
import UnlockButton from 'components/UnlockButton'

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

interface FarmStakeActionProps {
  componentType?: string
  hasAccount: boolean
  hasAllowance: boolean
  myLiquidity: BigNumber
  myLiquidityPrice: BigNumber
  lpContract: Contract
  onPresentDeposit?: any
  onPresentWithdraw?: any
}

const StakeAction: React.FC<FarmStakeActionProps> = ({
  componentType = 'farm',
  hasAccount,
  hasAllowance,
  myLiquidity,
  myLiquidityPrice,
  lpContract,
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  const { t } = useTranslation()
  const { convertToBalanceFormat } = useConverter()

  const [pendingTx, setPendingTx] = useState(false)
  const [requestedApproval, setRequestedApproval] = useState(false)

  const farmUnlockDate = useFarmUnlockDate()
  const isEnableAddStake = useMemo(() => {
    return (
      typeof farmUnlockDate === 'undefined' ||
      (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())
    )
  }, [farmUnlockDate])
  const myLiquidityValue = useMemo(() => getBalanceNumber(myLiquidity), [myLiquidity])

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

  return (
    <>
      <TitleSection>{t('My Liquidity')}</TitleSection>
      {hasAccount ? (
        <>
          {/* // hasAllowance로 loading 상태 구분 */}
          {hasAllowance ? (
            <Flex justifyContent="space-between">
              <Box>
                <BalanceText>{convertToBalanceFormat(myLiquidityValue)}</BalanceText>
                <PriceText value={myLiquidityPrice.toNumber()} prefix="=" />
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
          ) : (
            <Button width="100%" md variant={ButtonVariants.BROWN} disabled={requestedApproval} onClick={handleApprove}>
              {t('Approve Contract')}
            </Button>
          )}
        </>
      ) : (
        <UnlockButton />
      )}
    </>
  )
}

export default React.memo(StakeAction)
