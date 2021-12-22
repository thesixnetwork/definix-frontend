/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Box, BoxProps } from '@fingerlabs/definixswap-uikit-v2'
import { Rebalance } from '../../../state/types'

interface CardHeadingType extends BoxProps {
  isHorizontal?: boolean
  onlyTitle?: boolean
  className?: string
  xspacing?: string
  yspacing?: string
  rebalance: Rebalance | any
  componentType?: string
}

const StyledImg = styled.img<{ isMediumSize: boolean }>`
  border-radius: 6px;
  width: ${({ isMediumSize }) => (isMediumSize ? '100%' : '160px')};
  height: auto;
  object-fit: contain;
  background: ${({ theme }) => theme.colors.backgroundBox};
`

export const CardImage = ({
  isMediumSize = true,
  imageUrls,
  title,
}: {
  isMediumSize: boolean
  imageUrls: string[]
  title: string
}) => (
  <StyledImg
    src={imageUrls[0]}
    srcSet={`${imageUrls[1]} 2x, ${imageUrls[2]} 3x`}
    alt={title}
    isMediumSize={isMediumSize}
  />
)

export const CardTitle: React.FC<{ title: string; textStyle?: string }> = ({ title, textStyle = 'R_16B' }) => {
  const { t } = useTranslation()
  return (
    <Text textStyle={textStyle} textTransform="uppercase">
      {t(title)}
    </Text>
  )
}

const CardHeading: React.FC<CardHeadingType> = ({
  isHorizontal = false,
  className = '',
  onlyTitle = false,
  xspacing = 'S_32',
  yspacing = 'S_24',
  rebalance = {},
  ...props
}) => {
  const { t } = useTranslation()
  const cardboxProps = isHorizontal
    ? {
        width: '100%',
        maxWidth: '414px',
        mb: yspacing,
      }
    : {
        mr: xspacing,
      }

  return (
    <Flex justifyContent="space-between" className={className} {...props}>
      <Flex
        flexDirection={isHorizontal ? 'column' : 'row'}
        justifyContent={isHorizontal ? 'center' : ''}
        alignItems={!isHorizontal && onlyTitle ? 'center' : 'start'}
      >
        <Box {...cardboxProps}>
          <CardImage imageUrls={rebalance.icon} title={rebalance.title} isMediumSize={isHorizontal} />
        </Box>

        {onlyTitle ? (
          <Box>
            <CardTitle title={t(rebalance.title)} textStyle="R_20B" />
          </Box>
        ) : (
          <Box mt="S_4">
            <Box mb="S_4">
              <CardTitle title={t(rebalance.title)} />
            </Box>
            <Text textStyle="R_12R" color="textSubtle">
              {t(rebalance.description)}
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default CardHeading
