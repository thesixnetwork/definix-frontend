import React, { useState, useEffect, useMemo } from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Modal, Button, ModalBody, ModalFooter, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useApr, useAllLock, usePrivateData } from 'hooks/useLongTermStake'

import SuperConfirmStake from './SuperConfirmStake'
import SuperAprButton from './SuperAprButton'
import SuperFarmPool from './SuperFarmPool'
import SuperInput from './SuperInput'
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
  const [error, setError] = useState<string>('')
  const [next, setNext] = useState<boolean>(false)
  const [inputFinix, setInputFinix] = useState<string>('')
  const [inputHarvest, setInputHarvest] = useState<string>('')
  const [harvestProgress, setHarvestProgress] = useState<number>(-1)
  const [isLoadingStake, setIsLoadingStake] = useState<string>('')
  const totalFinix = useMemo(() => Number(inputFinix) + Number(inputHarvest), [inputFinix, inputHarvest])
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')
  const { balancefinix } = usePrivateData()

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

  useEffect(() => {
    return () => {
      setError('')
      setInputFinix('')
      setInputHarvest('')
    }
  }, [setError, setInputFinix, setInputHarvest])

  return (
    <Modal title={`${t('Super Stake')}`} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_16">
          {next && <SuperConfirmStake totalFinix={totalFinix} days={days} />}

          <>
            {!next && <SuperAprButton isMobile={isMobile} days={days} setDays={setDays} data={data} />}

            <SuperFarmPool
              days={days}
              inputFinix={inputFinix}
              setInputHarvest={setInputHarvest}
              harvestProgress={harvestProgress}
              setHarvestProgress={setHarvestProgress}
              show={!next}
              onDismiss={onDismiss}
              setIsLoadingStake={setIsLoadingStake}
            />

            {!next && (
              <>
                <SuperInput
                  isMobile={isMobile}
                  inputFinix={inputFinix}
                  setInputFinix={setInputFinix}
                  inputHarvest={inputHarvest}
                  error={error}
                  setError={setError}
                  balancefinix={balancefinix}
                />
                <SuperEstimate isMobile={isMobile} days={days} totalFinix={totalFinix} />
              </>
            )}
          </>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        {next ? (
          <Flex width="100%">
            <Button width="100%" variant="line" mr="S_8" onClick={() => setNext(false)}>
              {t('Back')}
            </Button>
            <Button
              width="100%"
              variant="red"
              ml="S_8"
              isLoading={isLoadingStake === 'loading'}
              onClick={() => setHarvestProgress(0)}
            >
              {t('Stake')}
            </Button>
          </Flex>
        ) : (
          <Button variant="red" disabled={!!error} onClick={() => setNext(true)}>
            {t('Next')}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default SuperStakeModal
