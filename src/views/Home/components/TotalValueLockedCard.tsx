import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from 'uikit-dev'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/api'
import { usePriceTVL } from 'state/hooks'
import total from '../../../assets/images/total-value.png'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
  background: url(${total});
  background-size: contain;
  background-repeat: no-repeat;
  background-color: ${({ theme }) => theme.colors.white};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 160px;
  }
`

const TotalValueLockedCard = () => {
  const totalTVL = usePriceTVL().toNumber()
  const TranslateString = useI18n()
  const data = useGetStats()
  const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null

  return (
    <StyledTotalValueLockedCard isRainbow>
      <CardBody className="flex flex-column align-center pa-6 mx-auto">
        <Heading mb="16px">{TranslateString(762, 'Total Value Locked (TVL)')}</Heading>
        <Heading fontSize="28px !important" mb="12px">
          ${(totalTVL || 0) <= 0 ? 'N/A' : totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </Heading>
        <Text small>(Across all LPs and Pools)</Text>
        {/* data ? (
          <>
            <Heading fontSize="28px !important" mb="12px">
              No data
            </Heading>
            <Text small>(Across all LPs and Pools)</Text>
          </>
        ) : (
          <>
            <Skeleton height={66} />
          </>
        ) */}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
