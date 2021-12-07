import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import TwoLineFormat from './TwoLineFormat'

import { ReactComponent as MediumImg } from '../../../assets/svg/ico_48_risk_medium.svg'

interface RiskOMeterType {
  grade: string
  small?: boolean
}

const StyledMediumImg = styled(MediumImg)<{ small?: boolean }>`
  width: ${({ small }) => (small ? '24px' : '48px')};
  margin-left: ${({ small }) => (small ? '6px' : '25px')};
  height: auto;
  align-self: end;
  margin-bottom: 6px;
  margin-top: -6px;
`

const RiskOMeter: React.FC<RiskOMeterType> = ({ grade, small }) => {
  const { t } = useTranslation()
  return (
    <TwoLineFormat
      title={t('Risk-O-Meter')}
      value={t(grade)}
      large={!small}
      subfix={<StyledMediumImg small={small} />}
    />
  )
}

export default RiskOMeter
