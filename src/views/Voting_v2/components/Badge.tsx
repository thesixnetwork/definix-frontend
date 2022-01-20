import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Text, CheckBIcon, Box } from '@fingerlabs/definixswap-uikit-v2'
import { BadgeType } from '../types'

interface Props {
  type: BadgeType
}

const BADGES = {
  [BadgeType.CORE]: {
    label: 'Core',
  },
  [BadgeType.PARTICIPATION]: {
    label: 'Participation',
  },
}

const Wrap = styled(Flex)<{ type: BadgeType }>`
  align-items: center;
  padding: 2px 10px;
  border-radius: 12px;
  background-color: ${({ theme, type }) =>
    type === BadgeType.CORE ? theme.colors.yellow20 : theme.colors.lightGrey30};
`

const Badge: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation()
  return (
    <Wrap type={type} className="badge">
      {type === BadgeType.PARTICIPATION && (
        <Box mr="4px">
          <CheckBIcon />
        </Box>
      )}
      <Text textStyle="R_12M" color={type === BadgeType.CORE ? 'orange' : 'mediumgrey'}>
        {t(BADGES[type].label)}
      </Text>
    </Wrap>
  )
}

export default Badge
