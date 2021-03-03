import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from 'uikit-dev'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
}

const StyledHarvestButton = styled(Button)`
  &:not(:disabled) {
    background: ${({ theme }) => theme.colors.harvest};
  }
`

const StyledDisplayBalance = styled.div`
  width: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.default};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <Flex justifyContent="space-between" alignItems="stretch">
      <StyledDisplayBalance>
        <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      </StyledDisplayBalance>
      <StyledHarvestButton
        disabled={rawEarningsBalance === 0 || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
      >
        {TranslateString(562, 'Harvest')}
      </StyledHarvestButton>
    </Flex>
  )
}

export default HarvestAction
