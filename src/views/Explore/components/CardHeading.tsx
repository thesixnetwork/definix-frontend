/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { Text, ChevronUpIcon, ChevronDownIcon } from 'uikit-dev'
import { Rebalance } from '../../../state/types'

interface CardHeadingType {
  isSkew?: boolean
  isHorizontal?: boolean
  showAccordion?: boolean
  isOpenAccordion?: boolean
  className?: string
  setIsOpenAccordion?: (open: boolean) => void
  rebalance: Rebalance | any
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

const CardHeading: React.FC<CardHeadingType> = ({
  isSkew = false,
  isHorizontal = false,
  className = '',
  showAccordion = false,
  isOpenAccordion = false,
  setIsOpenAccordion,
  rebalance = {},
}) => {
  return (
    <CardHeadingStyle
      className={`${className} flex justify-space-between pos-relative`}
      onClick={
        showAccordion
          ? () => {
              setIsOpenAccordion(!isOpenAccordion)
            }
          : undefined
      }
      isSkew={isSkew}
    >
      <div className={`flex ${isHorizontal ? 'flex-column justify-center' : 'align-center'}`}>
        {!isSkew ? (
          <FocusImg src={rebalance.icon[0]} alt="" isHorizontal={isHorizontal} />
        ) : (
          <SkewImg src={rebalance.icon[1]} alt="" />
        )}

        <div>
          <Text color="primary" bold fontSize="16px" textTransform="uppercase">
            {rebalance.title}
          </Text>
          <Text fontSize="10px">{rebalance.description}</Text>
        </div>
      </div>

      {showAccordion && (
        <>{isOpenAccordion ? <ChevronUpIcon color="textSubtle" /> : <ChevronDownIcon color="textSubtle" />}</>
      )}
    </CardHeadingStyle>
  )
}

export default CardHeading
