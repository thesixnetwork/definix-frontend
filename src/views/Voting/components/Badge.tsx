import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { keyframes } from "styled-components";
import { Flex, Text, CheckBIcon, Box } from '@fingerlabs/definixswap-uikit-v2'
import { BadgeType } from '../types'

interface Props {
  type: BadgeType;
  isLoading?: boolean;
}

const bounce = keyframes`
  0% {
    opacity: 1;
  }
  60% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BADGES = {
  [BadgeType.CORE]: {
    label: 'Core',
  },
  [BadgeType.PARTICIPATION]: {
    label: 'Participation',
  },
}

const StyledLoadingDot = styled.div<{ index: number }>`
  width: 3px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.mediumgrey};
  border-radius: 3px;
  animation: ${bounce} 1.5s ${({ index }) => index * 0.2}s infinite;
`;

const StyledLoading = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 4px;
`;

const Wrap = styled(Flex)<{ type: BadgeType }>`
  align-items: center;
  padding: 2px 10px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ theme, type }) =>
    type === BadgeType.CORE ? theme.colors.yellow20 : theme.colors.lightGrey30};
`

const Badge: React.FC<Props> = ({ type, isLoading }) => {
  const { t } = useTranslation()
  return (
    <Wrap type={type} className="badge">
      {
        isLoading ? <StyledLoading>
        {Array(3)
          .fill(0)
          .map((val, index) => (
            <StyledLoadingDot key={index} index={index} />
          ))}
        </StyledLoading> : <>
          {type === BadgeType.PARTICIPATION && (
            <Box mr="4px">
              <CheckBIcon />
            </Box>
          )}
          <Text textStyle="R_12M" color={type === BadgeType.CORE ? 'orange' : 'mediumgrey'}>
            {t(BADGES[type].label)}
          </Text>
        </>
      }
    </Wrap>
  )
}

export default Badge
