import React, { useMemo } from 'react'
import numeral from 'numeral'
import styled from 'styled-components'
// import useConverter from 'hooks/useConverter'
import { Flex, Box, Text, Coin } from '@fingerlabs/definixswap-uikit-v2'
import { useApr, usePrivateData } from 'hooks/useLongTermStake'
// import ApyButton from './ApyButton'

import { AllDataLockType } from '../types'

const StyledCoin = styled(Coin)`
  width: 40px;
  height: auto;
  object-fit: contain;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 36px;
  }
`

const MainInfoSection: React.FC = () => {
  // const { convertToPoolAPRFormat } = useConverter()
  // const displayApy = useMemo(() => {
  //   try {
  //     return `${convertToPoolAPRFormat(apy)}%`
  //   } catch (error) {
  //     return '-'
  //   }
  // }, [convertToPoolAPRFormat, apy])
  const { allDataLock } = usePrivateData()
  const apr = useApr()

  const getAPR = useMemo(() => {
    let multiple = 1

    const dataLength = allDataLock.reduce((acc: number, cur: AllDataLockType) => {
      if (!cur.isUnlocked) {
        if (cur.multiplier > multiple) {
          multiple = cur.multiplier
        }
        return acc + 1
      }
      return acc
    }, 0)

    if (dataLength === 0) return [0, 0]

    return [dataLength, numeral(multiple * apr).format('0,0.[00]')]
  }, [allDataLock, apr])

  return (
    <Flex position="relative" alignItems="center">
      <Box mr="S_12" width="70px">
        <StyledCoin symbol="VFINIX" size="" />
      </Box>

      <Flex flexDirection="column">
        <Text textStyle="R_18M">Long-term Stake</Text>

        <Flex alignItems="end">
          <Text textStyle="R_14M" color="orange" style={{ paddingBottom: '2px' }}>
            {getAPR[0] < 2 ? 'APR' : 'APR UP TO'}
          </Text>
          <Text textStyle="R_18B" color="orange" style={{ marginLeft: '4px' }}>
            {getAPR[1]}%
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MainInfoSection
