import React, { useState } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Box, Modal, Button, ModalBody, ModalFooter, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useApr, useAllLock } from 'hooks/useLongTermStake'

import SuperAprButton from './SuperAprButton'
import SuperEstimate from './SuperEstimate'

interface ModalProps {
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 520px) {
    width: 472px;
  }
`

const SuperStakeModal: React.FC<ModalProps> = ({ onDismiss = () => null }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [days, setDays] = useState<number>(365)
  const [inputFinix, setInputFinix] = useState<string>('')
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')

  const data = [
    {
      multiple: 1,
      day: 90,
      apr: apr * 1,
      minStake: _.get(minimum, '0'),
      level: 1,
    },
    {
      multiple: 2,
      day: 180,
      apr: apr * 2,
      minStake: _.get(minimum, '1'),
      level: 2,
    },
    {
      multiple: 4,
      day: 365,
      apr: apr * 4,
      minStake: _.get(minimum, '2'),
      level: 3,
    },
  ]

  return (
    <Modal title={`${t('Super Stake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_16">
          <SuperAprButton isMobile={isMobile} days={days} setDays={setDays} data={data} />
          <SuperEstimate isMobile={isMobile} days={days} inputFinix={inputFinix} />
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        <Button onClick={() => null}>{t('Next')}</Button>
      </ModalFooter>
    </Modal>
  )
}

export default SuperStakeModal
