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
} from 'definixswap-uikit-v2'
import { calculateFinixEarnedPerThousandDollarsOfPool, apyModalRoi } from 'utils/compoundApyHelpers'

interface ApyCalculatorModalProps {
  onDismiss?: () => void
  lpLabel?: string
  apy?: BigNumber
  addLiquidityUrl?: string
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({ onDismiss, lpLabel, apy, addLiquidityUrl }) => {
  const { t } = useTranslation()
  const { convertToPriceFromSymbol } = useConverter()
  const finixPrice = convertToPriceFromSymbol()
  const poolApy = apy.times(new BigNumber(1)).toNumber()

  const getEarnedPerThousand = useCallback(
    (day: number) => {
      return calculateFinixEarnedPerThousandDollarsOfPool({ numberOfDays: day, poolApy, finixPrice })
    },
    [poolApy, finixPrice],
  )

  const headerData = ['Timeframe', 'ROI', 'FINIX per $1000']
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
    <Modal title="ROI" onDismiss={onDismiss} mobileFull>
      <ModalBody style={{ maxWidth: '416px' }}>
        <Grid className="mt-s16 mb-s20">
          {headerData.map((header) => (
            <Box>
              <Text textStyle="R_12M" color={ColorStyles.MEDIUMGREY}>
                {t(header)}
              </Text>
            </Box>
          ))}
        </Grid>
        {bodyData.map((row, index) => (
          <Grid className={index === bodyData.length - 1 ? 'mb-s20' : 'mb-s12'}>
            <Box>
              <Text textStyle="R_14M" color={ColorStyles.BLACK}>
                {row.timeFrame}
              </Text>
            </Box>
            <Box>
              <Text textStyle="R_14M" color={ColorStyles.BLACK}>
                {apyModalRoi({ amountEarned: row.earned, amountInvested: 1000 / finixPrice })} %
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
      <ModalFooter>
        {addLiquidityUrl && (
          <Flex justifyContent="center">
            <LinkExternal href={addLiquidityUrl} textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
              {t('Get {{FINIX-KLAY}}', { 'FINIX-KLAY': lpLabel })}
            </LinkExternal>
          </Flex>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default ApyCalculatorModal
