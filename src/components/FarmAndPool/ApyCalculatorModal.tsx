import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import useConverter from 'hooks/useConverter'
import styled from 'styled-components'
import {
  Modal,
  Text,
  LinkExternal,
  Flex,
  ColorStyles,
  Divider,
  Box,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'
import { calculateFinixEarnedPerThousandDollars, apyModalRoi } from 'utils/compoundApyHelpers'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  lpLabel?: string
  apy?: BigNumber
  addLiquidityUrl?: string
  coin: string
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({ onDismiss, lpLabel, apy, addLiquidityUrl, coin }) => {
  const { t } = useTranslation()
  const { convertToPriceFromSymbol } = useConverter()
  const price = convertToPriceFromSymbol(coin)
  const farmApy = useMemo(() => apy.times(new BigNumber(100)).toNumber(), [apy])

  const getEarnedPerThousand = useCallback(
    (day: number) => {
      return calculateFinixEarnedPerThousandDollars({ numberOfDays: day, farmApy, finixPrice: price })
    },
    [farmApy, price],
  )

  const headerData = useMemo(() => ['Timeframe', 'ROI', `${coin} per $1000`], [coin])
  const bodyData = useMemo(() => {
    return [
      {
        timeFrame: '1d',
        earned: getEarnedPerThousand(1),
      },
      {
        timeFrame: '7d',
        earned: getEarnedPerThousand(7),
      },
      {
        timeFrame: '30d',
        earned: getEarnedPerThousand(30),
      },
      {
        timeFrame: '365d(APY)',
        earned: getEarnedPerThousand(365),
      },
    ]
  }, [getEarnedPerThousand])

  return (
    <Modal title={t('ROI')} onDismiss={onDismiss}>
      <ModalBody isBody style={{ maxWidth: '416px' }}>
        <Grid className="mt-s16 mb-s20">
          {headerData.map((header, index) => (
            <Box key={index}>
              <Text textStyle="R_12M" color={ColorStyles.MEDIUMGREY}>
                {t(header)}
              </Text>
            </Box>
          ))}
        </Grid>
        {bodyData.map((row, index) => (
          <Grid key={index} className={index === bodyData.length - 1 ? 'mb-s20' : 'mb-s12'}>
            <Box>
              <Text textStyle="R_14M" color={ColorStyles.BLACK}>
                {row.timeFrame}
              </Text>
            </Box>
            <Box>
              <Text textStyle="R_14M" color={ColorStyles.BLACK}>
                {apyModalRoi({ amountEarned: row.earned, amountInvested: 1000 / price })} %
              </Text>
            </Box>
            <Box>
              <Text textStyle="R_14M" color={ColorStyles.BLACK}>
                {row.earned}
              </Text>
            </Box>
          </Grid>
        ))}
        <Divider />
        <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY} className="my-s20">
          {t('Calculated based on current rates')}
        </Text>
      </ModalBody>
      <ModalFooter isFooter>
        {addLiquidityUrl && (
          <Flex justifyContent="center">
            <LinkExternal href={addLiquidityUrl} textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
              {t('Get {{FINIX-KLAY}} LP', { 'FINIX-KLAY': lpLabel })}
            </LinkExternal>
          </Flex>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default ApyCalculatorModal
