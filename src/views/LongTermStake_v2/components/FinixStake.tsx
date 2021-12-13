import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Box, Text, ImgTokenFinixIcon } from 'definixswap-uikit-v2'

import ImgTokenVFinix from '../../../assets/images/img-token-vfinix.png'
import ImgTokenVFinix2x from '../../../assets/images/img-token-vfinix@2x.png'
import ImgTokenVFinix3x from '../../../assets/images/img-token-vfinix@3x.png'

import { IsMobileType } from './types'

interface FinixStakeProps extends IsMobileType {
  totalFinixLock: number
  totalSupplyAllTimeMint: number
}

const FlexStake = styled(Flex)`
  width: 50%;
  flex-direction: column;

  > :first-child {
    margin-bottom: 22px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding-bottom: 20px;

    > :first-child {
      margin-bottom: 0;
      margin-right: 45px;
    }
  }
`

const FlexItem = styled(Flex)`
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.mobile} {
    flex-direction: column;
    align-items: flex-start;

    img {
      margin-bottom: 12px;
    }
  }
`

const FinixStake: React.FC<FinixStakeProps> = ({ isMobile, totalFinixLock, totalSupplyAllTimeMint }) => {
  const { t } = useTranslation()

  return (
    <>
      <FlexStake>
        <FlexItem>
          <Flex mb={`${isMobile && 'S_12'}`}>
            <ImgTokenFinixIcon viewBox="0 0 48 48" width="40px" height="40px" />
          </Flex>
          <Box ml={`${!isMobile && 'S_12'}`}>
            <Text mb="S_2" textStyle={`R_14${isMobile ? 'R' : 'M'}`} color="mediumgrey">
              {t('Total FINIX staked')}
            </Text>
            <Text textStyle="R_20B" color="black">
              {numeral(totalFinixLock).format('0,0')}
            </Text>
          </Box>
        </FlexItem>
        <FlexItem>
          <img
            width={40}
            height={40}
            src={ImgTokenVFinix}
            srcSet={`${ImgTokenVFinix2x} 2x, ${ImgTokenVFinix3x} 3x`}
            alt="VFINIX-TOKEN"
          />
          <Box ml={`${!isMobile && 'S_12'}`}>
            <Text mb="S_2" textStyle={`R_14${isMobile ? 'R' : 'M'}`} color="mediumgrey">
              {t('Total vFINIX supply')}
            </Text>
            <Text textStyle="R_20B" color="black">
              {numeral(totalSupplyAllTimeMint).format('0,0')}
            </Text>
          </Box>
        </FlexItem>
      </FlexStake>
    </>
  )
}

export default FinixStake
