/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Box } from 'definixswap-uikit'
import { Rebalance } from '../../../state/types'

interface CardHeadingType {
  isHorizontal?: boolean
  onlyTitle?: boolean
  className?: string
  rebalance: Rebalance | any
  componentType?: string
}

const FocusImg = styled.img<{ isHorizontal: boolean, isInRebalance: boolean }>`
  border-radius: ${({ isInRebalance }) => (isInRebalance ? '6px' : '3px')};
  border: solid 1px #979797;
  width: ${({ isHorizontal }) => (isHorizontal ? '100%' : '160px')};
  height: auto;
  object-fit: contain;
  margin-right: ${({ isHorizontal }) => (isHorizontal ? '' : '32px')};
  margin-bottom: ${({ isHorizontal }) => (isHorizontal ? '24px' : '')};
  background: ${({ theme }) => theme.colors.backgroundBox};
`

const CardHeading: React.FC<CardHeadingType> = ({
  isHorizontal = false,
  className = '',
  onlyTitle = false,
  rebalance = {},
  componentType = 'rebalance'
}) => {
  const { t } = useTranslation()
  const isInRebalance = useMemo(() => componentType === 'rebalance', [componentType])

  return (
    <Flex justifyContent="space-between" className={className}>
      <Flex
        flexDirection={isHorizontal && isInRebalance ? 'column' : 'row'}
        justifyContent={isHorizontal ? 'center' : ''}
        alignItems={!isHorizontal && onlyTitle ? 'center' : 'start'}
      >
        <Box width={isInRebalance ? 'auto' : 70} className={isInRebalance ? '' : 'mr-s16'}>
          <FocusImg src={rebalance.icon[0]} alt="" isHorizontal={isHorizontal} isInRebalance={isInRebalance}/>
        </Box>

        {onlyTitle ? (
          <div>
            <Text textStyle="R_20B" textTransform="uppercase" className="mb-1">
              {t(rebalance.title)}
            </Text>
          </div>
        ) : (
          <div>
            <Text textStyle="R_16B" textTransform="uppercase" className="mb-1">
              {t(rebalance.title)}
            </Text>
            <Text textStyle="R_12R">{t(rebalance.description)}</Text>
          </div>
        )}
      </Flex>
    </Flex>
  )
}

export default CardHeading
