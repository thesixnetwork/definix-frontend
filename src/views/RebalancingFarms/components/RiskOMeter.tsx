import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import TwoLineFormat from './TwoLineFormat'

import { ReactComponent as MediumImg } from '../../../assets/svg/ico_48_risk_medium.svg'

interface RiskOMeterType {
  grade: string
  small?: boolean
}

const StyledImageBox = styled.div<{ small?: boolean }>`
  height: auto;
  align-self: end;
  ${({ small }) =>
    small
      ? `
    width: 24px;
    margin-left: 6px;
    margin-top: 6px;
    margin-bottom: 3px;
    `
      : `
    width: 48px;
    margin-left: 25px;
    margin-top: -4px;
    margin-bottom: 2px;
  `};
`

const RiskOMeter: React.FC<RiskOMeterType> = ({ grade, small }) => {
  const { t } = useTranslation()
  return (
    <TwoLineFormat
      title={t('Risk-O-Meter')}
      value={t(grade)}
      large={!small}
      subfix={
        <StyledImageBox small={small}>
          <MediumImg width="100%" height="auto" />
        </StyledImageBox>
      }
    />
  )
}

export default RiskOMeter
