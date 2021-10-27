import React, { useState, useEffect } from 'react'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import numeral from 'numeral'
import { Button, useMatchBreakpoints, Text, Heading } from 'uikit-dev'
import _ from 'lodash'
import { useAllLock, useApr } from '../../../hooks/useLongTermStake'

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

const CustomButton = ({ isMobile, days, period, setPeriod, level = 0, minimum, vFinixPrice, isDark, mr }) => {
  const onSelect1 = () => {
    return isDark ? '#333333' : '#00000014'
  }

  const themeWhite = (x, y) => {
    if (x === y) {
      return isDark ? 'white' : '#0973B9'
    }
    return isDark ? 'textSubtle' : 'textSubtle'
  }

  const handleBackgroud = (x, y) => {
    let color = '#0973B9'
    if (x === 4) {
      color = 'linear-gradient(#F3D36C, #E27D3A)'
    }
    return color
  }

  const handleBackgroud4 = (x, y) => {
    let color = '#0973B937'
    if (x === 4) {
      color = 'linear-gradient(#F3D36C37, #E27D3A37)'
    }
    return color
  }

  const themeGold = (x, y) => {
    let color = '#0973B9'
    if (x === 4) {
      color = '#70707030'
    }
    return color
  }

  return (
    <div className={`col-4 ${mr} ${!isMobile ? 'w-100' : ''}`}>
      <ButtonPeriod
        onClick={() => {
          setPeriod(level)
        }}
        radii="small"
        isStroke
        style={{
          background: period === level ? handleBackgroud4(period, level) : onSelect1(),
          border: `1px solid ${period === level ? themeGold(period, level) : '#737375'}`,
        }}
      >
        <BoxLevel
          className="col-4"
          style={{ background: period === level ? handleBackgroud(period, level) : '#737375' }}
        >
          <Heading color="white" as="h1" fontSize={`${isMobile ? '20px !important' : '30px !important'}`}>
            {level}x
          </Heading>
        </BoxLevel>
        <BoxPeriod className="col-8">
          <Text fontSize={`${isMobile ? '10px !important' : '14px !important'}`} color={themeWhite(period, level)}>
            {days} days
          </Text>
          <Text fontSize={`${isMobile ? '8px !important' : '10px !important'}`} color={themeWhite(period, level)}>
            APR {`${numeral(vFinixPrice * level || 0).format('0,0.[00]')}%`}
          </Text>
        </BoxPeriod>
      </ButtonPeriod>
      <Text
        fontSize={`${isMobile ? '8px !important' : '12px !important'}`}
        textAlign="center"
        className="mt-2"
        color={themeWhite(period, level)}
      >
        Minimum {minimum} FINIX
      </Text>
    </div>
  )
}

const StakePeriodButton = ({ setPeriod, status }) => {
  const { isDark } = useTheme()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg
  const { allLockPeriod } = useAllLock()
  const minimum = _.get(allLockPeriod, '0.minimum')
  const [_minimum1, setMinimum1] = useState(0)
  const [_minimum2, setMinimum2] = useState(0)
  const [_minimum4, setMinimum3] = useState(0)
  const apr = useApr()
  const [test, setTest] = useState(4)

  useEffect(() => {
    setMinimum1(_.get(minimum, '0') || 0)
    setMinimum2(_.get(minimum, '1') || 0)
    setMinimum3(_.get(minimum, '2') || 0)
  }, [_minimum1, _minimum2, _minimum4, minimum])

  useEffect(() => {
    if (status) {
      // setPeriod(0)
      // setTest(0)
      setPeriod(4)
      setTest(4)
    } else {
      setPeriod(test)
    }
  }, [test, setPeriod, status])

  return (
    <div className={`${!isMobile ? 'flex align-center justify-space-between' : 'flex align-items-center'} mt-2`}>
      <CustomButton
        isDark={isDark}
        isMobile={isMobile}
        setPeriod={setTest}
        level={1}
        days={90}
        period={test}
        minimum={_minimum1}
        vFinixPrice={apr}
        mr="mr-2"
      />
      <CustomButton
        isDark={isDark}
        isMobile={isMobile}
        setPeriod={setTest}
        level={2}
        days={180}
        period={test}
        minimum={_minimum2}
        vFinixPrice={apr}
        mr="mr-2"
      />
      <CustomButton
        isDark={isDark}
        isMobile={isMobile}
        setPeriod={setTest}
        level={4}
        days={365}
        period={test}
        minimum={_minimum4}
        vFinixPrice={apr}
        mr=""
      />
    </div>
  )
}

export default StakePeriodButton
