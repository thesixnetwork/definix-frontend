import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Box, Text } from 'definixswap-uikit'

import ImgTokenFinix from '../../../assets/images/img-token-finix.png'
import ImgTokenFinix2x from '../../../assets/images/img-token-finix@2x.png'
import ImgTokenFinix3x from '../../../assets/images/img-token-finix@3x.png'
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

  const data = [
    {
      img: [ImgTokenFinix, ImgTokenFinix2x, ImgTokenFinix3x],
      title: 'Total FINIX staked',
      value: numeral(totalFinixLock).format('0,0'),
    },
    {
      img: [ImgTokenVFinix, ImgTokenVFinix2x, ImgTokenVFinix3x],
      title: 'Total vFINIX supply',
      value: numeral(totalSupplyAllTimeMint).format('0,0'),
    },
  ]

  return (
    <>
      <FlexStake>
        {data.map((v) => {
          return (
            <FlexItem key={v.title}>
              <img
                style={{ marginRight: '12px' }}
                width={40}
                height={40}
                src={`${v.img[0]}`}
                srcSet={`${v.img[1]} 2x, ${v.img[2]} 3x`}
                alt={`${v.title}`}
              />
              <Box>
                <Text mb="S_2" textStyle={`R_14${isMobile ? 'R' : 'M'}`} color="mediumgrey">
                  {t(`${v.title}`)}
                </Text>
                <Text textStyle="R_20B" color="black">
                  {`${v.value}`}
                </Text>
              </Box>
            </FlexItem>
          )
        })}
      </FlexStake>
    </>
  )
}

export default FinixStake
