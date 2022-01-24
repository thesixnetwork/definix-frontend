import React, { useState, useCallback, useEffect } from 'react'
import _ from 'lodash-es'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Coin, Text, CheckboxLabel, Checkbox } from '@fingerlabs/definixswap-uikit-v2'
import { useFarms, usePools, useToast } from 'state/hooks'
import {
  useHarvest,
  usePrivateData,
  useSuperHarvest,
  useSousHarvest,
  useLockTopup,
  useAllDataLock,
} from 'hooks/useLongTermStake'
import { useLockPlus } from 'hooks/useTopUp'
import useWallet from 'hooks/useWallet'

interface SuperFarmPoolProps {
  days: number
  inputFinix: string
  setInputHarvest: React.Dispatch<React.SetStateAction<string>>
  harvestProgress: number
  setHarvestProgress: React.Dispatch<React.SetStateAction<number>>
  show: boolean
  onDismiss: () => null
  setIsLoadingStake: React.Dispatch<React.SetStateAction<string>>
}

const Wrap = styled.div`
  width: 100%;
  max-height: 168px;
  overflow: auto;
`

const StyledCheckboxLabel = styled(CheckboxLabel)`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
`

const SuperFarmPool: React.FC<SuperFarmPoolProps> = ({
  days,
  inputFinix,
  setInputHarvest,
  harvestProgress,
  setHarvestProgress,
  show,
  onDismiss,
  setIsLoadingStake,
}) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const { finixEarn, balancevfinix } = usePrivateData()
  const { allLock } = useAllDataLock()
  const lockTopUp = useLockTopup()
  const [selectedToken, setSelectedToken] = useState({})
  const [idLast, setIdLast] = useState(0)
  const [lengthSelect, setLengthSelect] = useState(0)
  const [amount, setAmount] = useState('')
  const { toastSuccess, toastError } = useToast()

  const showToastSuperStake = useCallback(
    (success: boolean) => {
      if (success) toastSuccess(t('{{Action}} Complete', { Action: t('actioncStake') }))
      else toastError(t('{{Action}} Failed', { Action: t('actioncStake') }))
      onDismiss()
    },
    [onDismiss, t, toastError, toastSuccess],
  )

  const getLevel = (day: number) => {
    if (day === 90) return 0
    if (day === 180) return 1
    return 2
  }

  const { onLockPlus, status, loadings } = useLockPlus(getLevel(days), idLast, amount)
  const { onSuperHarvest } = useSuperHarvest()
  const { handleHarvest } = useHarvest()
  const { onReward } = useSousHarvest()

  useEffect(() => {
    if (status) showToastSuperStake(true)
  }, [status, showToastSuperStake])

  useEffect(() => {
    setIsLoadingStake(loadings)
  }, [loadings, setIsLoadingStake])

  useEffect(() => {
    return () => setSelectedToken({})
  }, [])

  // Farms
  const farmsLP = useFarms()
  const activeFarms = farmsLP.filter((farms) => farms.pid !== 0 && farms.pid !== 1 && farms.multiplier !== '0X')
  const stackedOnlyFarms = activeFarms.filter(
    (farms) => farms.userData && new BigNumber(farms.userData.stakedBalance).isGreaterThan(0),
  )

  // Pools
  const pools = usePools(account)
  const stackedOnlyPools = pools.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )

  // LongTermStake
  useEffect(() => {
    if (lockTopUp !== null && lockTopUp.length > 0) {
      const arrStr = lockTopUp.map((i) => Number(i))
      const removeTopUpId = allLock.filter((item) => !arrStr.includes(Number(_.get(item, 'id'))))
      let max = 0
      for (let i = 0; i < removeTopUpId.length; i++) {
        const selector = removeTopUpId[i]
        const selectorPeriod = getLevel(days) + 1
        if (
          _.get(selector, 'isUnlocked') === false &&
          _.get(selector, 'isPenalty') === false &&
          _.get(selector, 'level') === selectorPeriod
        ) {
          if (Number(_.get(selector, 'id')) >= max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    } else {
      let max = 0
      for (let i = 0; i < allLock.length; i++) {
        const selector = allLock[i]
        const selectorPeriod = getLevel(days) + 1
        if (
          _.get(selector, 'isUnlocked') === false &&
          _.get(selector, 'isPenalty') === false &&
          _.get(selector, 'level') === selectorPeriod
        ) {
          if (Number(_.get(selector, 'id')) > max) {
            max = Number(_.get(selector, 'id'))
            setIdLast(max)
          }
        }
      }
    }
  }, [lockTopUp, allLock, days])

  const _superHarvest = useCallback(async () => {
    const selected = Object.values(selectedToken).filter((d) => _.get(d, 'checked') === true)
    if (harvestProgress !== -1 && harvestProgress <= Object.values(selected).length) {
      if (_.get(Object.values(selected)[harvestProgress], 'checked')) {
        if (!_.get(Object.values(selected)[harvestProgress], 'pools')) {
          if (_.get(Object.values(selected)[harvestProgress], 'farms')) {
            // farm
            try {
              setIsLoadingStake('loading')
              await onSuperHarvest(_.get(Object.values(selected)[harvestProgress], 'pid'))
              setHarvestProgress(harvestProgress + 1)
            } catch {
              setHarvestProgress(-1)
              showToastSuperStake(false)
            } finally {
              setIsLoadingStake('')
            }
          } else {
            // vfinix
            try {
              setIsLoadingStake('loading')
              await handleHarvest()
              setHarvestProgress(harvestProgress + 1)
            } catch {
              setHarvestProgress(-1)
              showToastSuperStake(false)
            } finally {
              setIsLoadingStake('')
            }
          }
        } else {
          // pool
          try {
            setIsLoadingStake('loading')
            await onReward(_.get(Object.values(selected)[harvestProgress], 'sousId'))
            setHarvestProgress(harvestProgress + 1)
          } catch {
            setHarvestProgress(-1)
            showToastSuperStake(false)
          } finally {
            setIsLoadingStake('')
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestProgress, selectedToken, handleHarvest])

  const lockPlus = useCallback(async () => {
    try {
      const res = await onLockPlus()
      setAmount('')
      if (res === true) {
        setHarvestProgress(-1)
        setLengthSelect(0)
        setAmount('')
        setSelectedToken({})
      }
    } catch {
      setAmount('')
      showToastSuperStake(false)
    }
  }, [onLockPlus, setHarvestProgress, showToastSuperStake])

  useEffect(() => {
    if (harvestProgress !== -1 && harvestProgress === lengthSelect) {
      if (Object.values(selectedToken)[0]) {
        lockPlus()
      } else if (Object.values(selectedToken).length === 0 && inputFinix !== '' && inputFinix !== '0') {
        lockPlus()
      }
    } else if (harvestProgress !== -1) {
      _superHarvest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harvestProgress, _superHarvest])

  useEffect(() => {
    if (Object.values(selectedToken).length > 0 && inputFinix !== '' && inputFinix !== '0') {
      const dataArray = []
      for (let i = 0; i < Object.values(selectedToken).length; i++) {
        const selector = Object.values(selectedToken)[i]
        if (_.get(selector, 'checked')) {
          dataArray.push(_.get(selector, 'pendingReward'))
        } else {
          dataArray.splice(i)
        }
      }
      const sum = dataArray.reduce((r, n) => r + n, 0)
      setLengthSelect(dataArray.length)
      const total = Number(inputFinix) + sum
      setAmount(new BigNumber(parseFloat(total)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length === 0 && inputFinix !== '' && inputFinix !== '0') {
      setAmount(new BigNumber(Number(inputFinix)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length > 0 && inputFinix === '') {
      const dataArray = []
      for (let i = 0; i < Object.values(selectedToken).length; i++) {
        const selector = Object.values(selectedToken)[i]
        if (_.get(selector, 'checked')) {
          dataArray.push(_.get(selector, 'pendingReward'))
        } else {
          dataArray.splice(i)
        }
      }
      const sum = dataArray.reduce((r, n) => r + n, 0)
      setLengthSelect(dataArray.length)
      setAmount(new BigNumber(parseFloat(Number(inputFinix) + sum)).times(new BigNumber(10).pow(18)).toFixed())
    } else if (Object.values(selectedToken).length > 0 && Number(inputFinix) <= 0) {
      const dataArray = []
      for (let i = 0; i < Object.values(selectedToken).length; i++) {
        const selector = Object.values(selectedToken)[i]
        if (_.get(selector, 'checked')) {
          dataArray.push(_.get(selector, 'pendingReward'))
        } else {
          dataArray.splice(i)
        }
      }
      const sum = dataArray.reduce((r, n) => r + n, 0)
      setLengthSelect(dataArray.length)
      setAmount(new BigNumber(parseFloat(Number(inputFinix) + sum)).times(new BigNumber(10).pow(18)).toFixed())
    } else {
      setAmount('')
    }
  }, [selectedToken, inputFinix])

  useEffect(() => {
    let totalPendingReward = 0
    for (let i = 0; i < Object.values(selectedToken).length; i++) {
      const selector = Object.values(selectedToken)[i]
      if (_.get(selector, 'checked')) {
        totalPendingReward += Number(numeral(_.get(selector, 'pendingReward')).format('0,0.[00]'))
      }
    }
    setInputHarvest(String(totalPendingReward))
  }, [selectedToken, setInputHarvest])

  return (
    <>
      {show && (
        <>
          <Text mb="S_12" textStyle="R_16M" color="deepgrey">
            {t('Choose farm/pool')}
          </Text>
          <Wrap>
            {!!balancevfinix && balancevfinix > 0 && (
              <StyledCheckboxLabel
                control={
                  <Checkbox
                    scale="sm"
                    disabled={harvestProgress !== -1}
                    checked={_.get(selectedToken, `${18}.checked`) || false}
                    onChange={(event) => {
                      setSelectedToken({
                        ...selectedToken,
                        18: {
                          checked: event.target.checked,
                          pools: false,
                          farms: false,
                          status: false,
                          pendingReward: finixEarn,
                        },
                      })
                    }}
                  />
                }
              >
                <Flex alignItems="center" ml="S_4">
                  <Flex>
                    <Coin symbol="VFINIX" size="24px" />
                  </Flex>
                  <Text textStyle="R_14M" color="black" ml="26px">
                    {t('Long-term Stake')}
                  </Text>
                </Flex>
                <Flex style={{ position: 'absolute', right: '5px' }}>
                  <Text textStyle="R_14R" color="black">
                    {`${numeral(finixEarn).format('0,0.00')}`}
                  </Text>
                  <Text textStyle="R_14R" color="mediumgrey" ml="S_6">
                    {t('FINIX')}
                  </Text>
                </Flex>
              </StyledCheckboxLabel>
            )}

            {stackedOnlyFarms.map((d) => {
              const imgs = d.lpSymbol.split(' ')[0].split('-')
              return (
                <StyledCheckboxLabel
                  key={d.pid}
                  control={
                    <Checkbox
                      scale="sm"
                      disabled={harvestProgress !== -1}
                      checked={_.get(selectedToken, `${d.pid}.checked`) || false}
                      onChange={(event) => {
                        setSelectedToken({
                          ...selectedToken,
                          [d.pid]: {
                            checked: event.target.checked,
                            pools: false,
                            farms: true,
                            pid: d.pid,
                            status: false,
                            pendingReward: new BigNumber(d.userData.earnings).div(new BigNumber(10).pow(18)).toNumber(),
                          },
                        })
                      }}
                    />
                  }
                >
                  <Flex alignItems="center" ml="S_4">
                    <Flex>
                      {imgs[0] && <Coin symbol={imgs[0]} size="24px" />}
                      {imgs[1] && (
                        <Flex style={{ marginLeft: '-6px', zIndex: '-1' }}>
                          <Coin symbol={imgs[1]} size="24px" />
                        </Flex>
                      )}
                    </Flex>
                    <Text textStyle="R_14M" color="black" ml="S_8">
                      {(d.lpSymbol || '').replace(/ LP$/, '')}
                    </Text>
                  </Flex>
                  <Flex style={{ position: 'absolute', right: '5px' }}>
                    <Text textStyle="R_14R" color="black">
                      {new BigNumber(d.userData.earnings).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}{' '}
                    </Text>
                    <Text textStyle="R_14R" color="mediumgrey" ml="S_6">
                      {t('FINIX')}
                    </Text>
                  </Flex>
                </StyledCheckboxLabel>
              )
            })}

            {stackedOnlyPools.map((d, i) => {
              const imgs = d.tokenName.split(' ')[0].split('-')
              return (
                <StyledCheckboxLabel
                  key={d.sousId}
                  control={
                    <Checkbox
                      scale="sm"
                      checked={_.get(selectedToken, `${d.sousId}.checked`) || false}
                      disabled={harvestProgress !== -1}
                      onChange={(event) => {
                        setSelectedToken({
                          ...selectedToken,
                          [i]: {
                            checked: event.target.checked,
                            pools: true,
                            sousId: d.sousId,
                            farms: false,
                            status: false,
                            pendingReward: new BigNumber(d.userData.pendingReward)
                              .div(new BigNumber(10).pow(18))
                              .toNumber(),
                          },
                        })
                      }}
                    />
                  }
                >
                  <Flex alignItems="center" ml="S_4">
                    <Flex>
                      <Coin symbol={imgs[0]} size="24px" />
                    </Flex>
                    <Text textStyle="R_14M" color="black" ml="26px">
                      {d.tokenName}
                    </Text>
                  </Flex>
                  <Flex style={{ position: 'absolute', right: '5px' }}>
                    <Text textStyle="R_14R" color="black">
                      {new BigNumber(d.userData.pendingReward).div(new BigNumber(10).pow(18)).toNumber().toFixed(2)}
                    </Text>
                    <Text textStyle="R_14R" color="mediumgrey" ml="S_6">
                      {t('FINIX')}
                    </Text>
                  </Flex>
                </StyledCheckboxLabel>
              )
            })}
          </Wrap>
        </>
      )}
    </>
  )
}

export default SuperFarmPool
