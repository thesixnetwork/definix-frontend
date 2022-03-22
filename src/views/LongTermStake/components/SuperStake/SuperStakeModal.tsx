import React, { useState, useEffect, useMemo } from 'react'
import { get } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Modal, Button, ModalBody, ModalFooter, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'
import { useApr, useAllLock, usePrivateData } from 'hooks/useLongTermStake'

import SuperConfirmStake from './SuperConfirmStake'
import SuperAprButton from './SuperAprButton'
import SuperFarmPool from './SuperFarmPool'
import SuperInput from './SuperInput'
import SuperEstimate from './SuperEstimate'
import moment, { Moment } from 'moment'
interface ModalProps {
  onDismiss?: () => any
}

const StyledBox = styled(Box)`
  width: 100%;

  @media (min-width: 520px) {
    width: 472px;
  }
`
type SelectedSuperStakOption = {
  multiple?: number
  day?: number
  endDay?: string
  apr?: number
  minStake?: number
  level?: number
}

const SuperStakeModal: React.FC<ModalProps> = ({ onDismiss = () => null }) => {
  const { t, i18n } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const [selectedSuperStakOption, setSelectedSuperStakOption] = useState<SelectedSuperStakOption>({});
  console.log(selectedSuperStakOption);
  const [error, setError] = useState<string>('')
  const [next, setNext] = useState<boolean>(false)
  const [inputFinix, setInputFinix] = useState<string>('')
  const [inputHarvest, setInputHarvest] = useState<string>('')
  const [harvestProgress, setHarvestProgress] = useState<number>(-1)
  const [isLoadingStake, setIsLoadingStake] = useState<string>('')
  const totalFinix = useMemo(() => Number(inputFinix) + Number(inputHarvest), [inputFinix, inputHarvest])
  const apr = useApr()
  const { allLockPeriod } = useAllLock()
  const minimum = get(allLockPeriod, '0.minimum')
  const { balancefinix, allDataLock } = usePrivateData()
  
  const getEndDay = (level) => {
    const myPeriodSuperStakes = allDataLock.filter(e => get(e, 'isTopup') && !get(e, 'isUnlocked') && !get(e, 'isPenalty') && level === get(e, 'level'));
    
    const levelByDay = {
      1: 90,
      2: 180,
      3: 365
    }
    let day;
    if(myPeriodSuperStakes) {
      myPeriodSuperStakes.forEach(e => {
        const topupTimeStamp = get(e, 'topupTimeStamp');
        const lockTimestamp = get(e, 'lockTimestamp');
        if( moment(topupTimeStamp).diff(moment(), 'milliseconds') > 0 && moment(lockTimestamp).diff(moment(), 'milliseconds') > 0) {
          day = moment(lockTimestamp);
        }
      })
    }
    return (day || moment().add(levelByDay[level], 'days')).format(i18n.language === 'ko' ? `YYYY-MM-DD HH:mm:ss` : `DD-MMM-YYYY HH:mm:ss`);
  }

  const data = [
    {
      multiple: 1,
      day: 90,
      endDay: getEndDay(1),
      apr: apr * 1,
      minStake: get(minimum, '0'),
      level: 1,
    },
    {
      multiple: 2,
      day: 180,
      endDay: getEndDay(2),
      apr: apr * 2,
      minStake: get(minimum, '1'),
      level: 2,
    },
    {
      multiple: 4,
      day: 365,
      endDay: getEndDay(3),
      apr: apr * 4,
      minStake: get(minimum, '2'),
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
    <Modal title={next ? t('Confirm Super Stake') : t('Super Stake')} onDismiss={onDismiss} mobileFull>
      <ModalBody isBody>
        <StyledBox mb="S_16">
          {next && <SuperConfirmStake totalFinix={totalFinix} days={selectedSuperStakOption?.day} />}

          <>
            {!next && <SuperAprButton isMobile={isMobile} days={selectedSuperStakOption?.day} setSelectedSuperStakOption={setSelectedSuperStakOption} data={data} />}
            
            <SuperFarmPool
              days={selectedSuperStakOption?.day}
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
                <SuperEstimate isMobile={isMobile} days={selectedSuperStakOption?.day} endDay={selectedSuperStakOption?.endDay} totalFinix={totalFinix} />
              </>
            )}
          </>
        </StyledBox>
      </ModalBody>
      <ModalFooter isFooter>
        {next ? (
          <Flex width="100%">
            <Button width="100%" height="48px" variant="line" mr="S_8" onClick={() => setNext(false)}>
              {t('Back')}
            </Button>
            <Button
              width="100%"
              height="48px"
              variant="red"
              ml="S_8"
              isLoading={isLoadingStake === 'loading'}
              onClick={() => setHarvestProgress(0)}
            >
              {t('Stake')}
            </Button>
          </Flex>
        ) : (
          <Button height="48px" variant="red" disabled={!!error} onClick={() => setNext(true)}>
            {t('Next')}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

export default SuperStakeModal