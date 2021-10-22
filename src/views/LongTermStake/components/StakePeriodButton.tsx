import React, { useState, useEffect } from 'react'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Button, useMatchBreakpoints, Text, Heading } from 'uikit-dev'
import _ from 'lodash'
import {
  useBalances,
  useAllowance,
  useApr,
  useTotalSupply,
  useAllLockPeriods,
  useLock,
  useApprove,
  usePrivateData,
  useUnstakeId,
} from '../../../hooks/useLongTermStake'

const BoxLevel = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  border-radius: 6px;
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  background-color: ${(props) => props.color};
  justify-content: center;
  align-items: center;
`

const BoxPeriod = styled.div`
  align-self: center;
  text-align: center;
`

const ButtonPeriod = styled(Button)`
  margin-right: 0.5rem !important;
  display: flex;
  padding: 0;
  width: 100%;
`

const StakePeriodButton = ({ period, setPeriod }) => {
  const { isDark } = useTheme()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const allLock = useAllLockPeriods()
  const isMobile = !isXl && !isLg && !isMd
  const [_minimum1, setMinimum1] = useState(0)
  const [_minimum2, setMinimum2] = useState(0)
  const [_minimum3, setMinimum3] = useState(0)

  useEffect(() => {
    setMinimum1(new BigNumber(_.get(allLock, '0._minimum1')).dividedBy(new BigNumber(10).pow(18)).toNumber())
    setMinimum2(new BigNumber(_.get(allLock, '0._minimum2')).dividedBy(new BigNumber(10).pow(18)).toNumber())
    setMinimum3(new BigNumber(_.get(allLock, '0._minimum3')).dividedBy(new BigNumber(10).pow(18)).toNumber())
  }, [_minimum1, _minimum2, _minimum3, allLock])

  const onSelect1 = () => {
    return isDark ? '#333333' : '#00000014'
  }

  const onSelect2 = () => {
    return isDark ? '#333333' : '#00000014'
  }

  const onSelect4 = () => {
    return isDark ? '#333333' : '#00000014'
  }

  const selectDay1 = () => {
    if (period === 1) {
      return isDark ? 'white' : '#0973B9'
    }
    return isDark ? 'textSubtle' : 'textSubtle'
  }

  const selectDay2 = () => {
    if (period === 2) {
      return isDark ? 'white' : '#0973B9'
    }
    return isDark ? 'textSubtle' : 'textSubtle'
  }

  const selectDay3 = () => {
    if (period === 4) {
      return isDark ? 'white' : '#0973B9'
    }
    return isDark ? 'textSubtle' : 'textSubtle'
  }

  return (
    <div className={`${!isMobile && 'flex align-center justify-space-between'} mt-2`}>
      <div className={`${isMobile ? 'col-12' : 'col-4'} w-100 mr-2`}>
        <ButtonPeriod
          onClick={() => {
            setPeriod(1)
          }}
          radii="small"
          isStroke
          style={{
            backgroundColor: period === 1 ? '#0973B937' : onSelect1(),
            border: `1px solid ${period === 1 ? '#0973B9' : '#737375'}`,
          }}
        >
          <BoxLevel className="col-4" color={period === 1 ? '#0973B9' : '#737375'}>
            <Heading color="white" as="h1" fontSize="30px !important">
              1x
            </Heading>
          </BoxLevel>
          <BoxPeriod className="col-8">
            <Text fontSize="14px !important" color={selectDay1()}>
              90 days
            </Text>
          </BoxPeriod>
        </ButtonPeriod>
        <Text fontSize="12px !important" textAlign="center" className="mt-2" color={selectDay1()}>
          Minimum {_minimum1} FINIX
        </Text>
      </div>
      <div className={`${isMobile ? 'col-12' : 'col-4'} w-100 mr-2`}>
        <ButtonPeriod
          onClick={() => {
            setPeriod(2)
          }}
          radii="small"
          isStroke
          style={{
            backgroundColor: period === 2 ? '#0973B937' : onSelect2(),
            border: `1px solid ${period === 2 ? '#0973B9' : '#737375'}`,
          }}
        >
          <BoxLevel className="col-4" color={period === 2 ? '#0973B9' : '#737375'}>
            <Heading color="white" as="h1" fontSize="30px !important">
              2x
            </Heading>
          </BoxLevel>
          <BoxPeriod className="col-8">
            <Text fontSize="14px !important" color={selectDay2()}>
              180 days
            </Text>
          </BoxPeriod>
        </ButtonPeriod>
        <Text fontSize="12px !important" textAlign="center" className="mt-2" color={selectDay2()}>
          Minimum {_minimum2} FINIX
        </Text>
      </div>
      <div className={`${isMobile ? 'col-12' : 'col-4'} w-100`}>
        <ButtonPeriod
          onClick={() => {
            setPeriod(4)
          }}
          radii="small"
          isStroke
          style={{
            backgroundColor: period === 4 ? '#0973B937' : onSelect4(),
            border: `1px solid ${period === 4 ? '#0973B9' : '#737375'}`,
          }}
        >
          <BoxLevel className="col-4" color={period === 4 ? '#0973B9' : '#737375'}>
            <Heading color="white" as="h1" fontSize="30px !important">
              4x
            </Heading>
          </BoxLevel>
          <BoxPeriod className="col-8">
            <Text fontSize="14px !important" color={selectDay3()}>
              365 days
            </Text>
          </BoxPeriod>
        </ButtonPeriod>
        <Text fontSize="12px !important" textAlign="center" className="mt-2" color={selectDay3()}>
          Minimum {_minimum3} FINIX
        </Text>
      </div>
    </div>
  )
}

export default StakePeriodButton
