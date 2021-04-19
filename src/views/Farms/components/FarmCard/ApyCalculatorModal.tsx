import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Modal, Text, LinkExternal, Flex } from 'uikit-dev'
import useI18n from 'hooks/useI18n'
import { calculateFinixEarnedPerThousandDollars, apyModalRoi } from 'utils/compoundApyHelpers'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  lpLabel?: string
  finixPrice?: BigNumber
  apy?: BigNumber
  addLiquidityUrl?: string
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`

const GridItem = styled.div`
  margin-bottom: '10px';
`

const Description = styled(Text)`
  max-width: 320px;
  margin-bottom: 28px;
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({
  onDismiss,
  lpLabel,
  finixPrice,
  apy,
  addLiquidityUrl,
}) => {
  const TranslateString = useI18n()
  const farmApy = apy.times(new BigNumber(100)).toNumber()
  const oneThousandDollarsWorthOfFinix = 1000 / finixPrice.toNumber()

  const finixEarnedPerThousand1D = calculateFinixEarnedPerThousandDollars({ numberOfDays: 1, farmApy, finixPrice })
  const finixEarnedPerThousand7D = calculateFinixEarnedPerThousandDollars({ numberOfDays: 7, farmApy, finixPrice })
  const finixEarnedPerThousand30D = calculateFinixEarnedPerThousandDollars({ numberOfDays: 30, farmApy, finixPrice })
  const finixEarnedPerThousand365D = calculateFinixEarnedPerThousandDollars({ numberOfDays: 365, farmApy, finixPrice })

  return (
    <Modal title="ROI" onDismiss={onDismiss} isRainbow>
      <Grid>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            {TranslateString(860, 'Timeframe')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            {TranslateString(858, 'ROI')}
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase" mb="20px">
            {TranslateString(864, 'FINIX per $1000')}
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem>
          <Text>1d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: finixEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfFinix })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{finixEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text>7d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: finixEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfFinix })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{finixEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text>30d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: finixEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfFinix })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{finixEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem>
          <Text>365d(APY)</Text>
        </GridItem>
        <GridItem>
          <Text>
            {apyModalRoi({ amountEarned: finixEarnedPerThousand365D, amountInvested: oneThousandDollarsWorthOfFinix })}%
          </Text>
        </GridItem>
        <GridItem>
          <Text>{finixEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Description fontSize="12px" color="textSubtle">
        {TranslateString(
          866,
          'Calculated based on current rates. Compounding once daily. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
        )}
      </Description>
      <Flex justifyContent="center">
        <LinkExternal href={addLiquidityUrl}>
          {TranslateString(999, 'Get')} {lpLabel}
        </LinkExternal>
      </Flex>
    </Modal>
  )
}

export default ApyCalculatorModal
