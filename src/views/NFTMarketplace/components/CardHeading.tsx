/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import badgeLock from '../../../uikit-dev/images/for-ui-v2/badge-lock.png'
import { Flex, Text, ChevronUpIcon, ChevronDownIcon, Image } from '../../../uikit-dev'
import { Rebalance } from '../../../state/types'

interface CardHeadingType {
  isSkew?: boolean
  isHorizontal?: boolean
  showAccordion?: boolean
  isOpenAccordion?: boolean
  className?: string
  setIsOpenAccordion?: (open: boolean) => void
}

const CardHeadingStyle = styled.div<{ isSkew?: boolean }>`
  padding-left: ${({ isSkew }) => (isSkew ? '116px !important' : '0')};
`

const FocusImg = styled.img<{ isHorizontal: boolean }>`
  width: 120px;
  height: auto;
  margin-right: ${({ isHorizontal }) => (isHorizontal ? '' : '16px')};
  margin-bottom: ${({ isHorizontal }) => (isHorizontal ? '8px' : '')};
  background: ${({ theme }) => theme.colors.backgroundBox};
`

const SkewImg = styled.img`
  width: 106px;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
`
const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
  }
`

const CardHeading: React.FC<CardHeadingType> = ({
  isSkew = false,
  isHorizontal = false,
  className = '',
  showAccordion = false,
  isOpenAccordion = false,
  setIsOpenAccordion,
}) => {
  return (
    <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
      <StyledFarmImages>
        <img alt="" src={badgeLock} />
      </StyledFarmImages>
    </Flex>
  )
}

export default CardHeading
