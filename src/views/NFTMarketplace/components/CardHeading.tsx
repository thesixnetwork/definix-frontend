/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
import { Flex } from '../../../uikit-dev'

interface CardHeadingType {
  isSkew?: boolean
  isHorizontal?: boolean
  showAccordion?: boolean
  isOpenAccordion?: boolean
  className?: string
  setIsOpenAccordion?: (open: boolean) => void
}

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

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
      <LazyLoad offset={100}>
        <StyledFarmImages>
          <img
            src="https://dryotus.definix.com/ipfs/QmWg7NKe3JvSC62JXnotVPRkA5JBiyuPEgcmS7cZfUWB9F/Legendary_T-ARA.png"
            alt="tAra"
          />
        </StyledFarmImages>
      </LazyLoad>
    </Flex>
  )
}

export default CardHeading
