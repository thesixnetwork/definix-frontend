import React from 'react'
import { Flex, Text } from 'definixswap-uikit'
import styled from 'styled-components'

import ArrowLeftIcon from '../../../assets/images/ico-16-arrow-left-g.png'
import ArrowLeftIcon2x from '../../../assets/images/ico-16-arrow-left-g@2x.png'
import ArrowLeftIcon3x from '../../../assets/images/ico-16-arrow-left-g@3x.png'
import ArrowRightIcon from '../../../assets/images/ico-16-arrow-right-g.png'
import ArrowRightIcon2x from '../../../assets/images/ico-16-arrow-right-g@2x.png'
import ArrowRightIcon3x from '../../../assets/images/ico-16-arrow-right-g@3x.png'

import { IsMobileType } from './types'

const StyledText = styled(Text)`
  margin: 0 2px;
  width: 24px;
  text-align: center;
  cursor: pointer;
`

const StakeListPagination: React.FC<IsMobileType> = ({ isMobile }) => {
  return (
    <>
      <Flex mt={`${isMobile ? 'S_12' : 'S_20'}`}>
        <img
          style={{ marginRight: '10px', cursor: 'pointer' }}
          width={16}
          height={16}
          src={ArrowLeftIcon}
          srcSet={`${ArrowLeftIcon2x} 2x, ${ArrowLeftIcon3x} 3x`}
          alt="Arrow-Left"
        />

        <StyledText textStyle="R_14B" color="black">
          6
        </StyledText>
        <StyledText textStyle="R_14R" color="mediumgrey">
          7
        </StyledText>
        <StyledText textStyle="R_14R" color="mediumgrey">
          8
        </StyledText>
        <StyledText textStyle="R_14R" color="mediumgrey">
          9
        </StyledText>
        <StyledText textStyle="R_14R" color="mediumgrey">
          10
        </StyledText>

        <img
          style={{ marginLeft: '10px', cursor: 'pointer' }}
          width={16}
          height={16}
          src={ArrowRightIcon}
          srcSet={`${ArrowRightIcon2x} 2x, ${ArrowRightIcon3x} 3x`}
          alt="Arrow-Right"
        />
      </Flex>
    </>
  )
}

export default StakeListPagination
