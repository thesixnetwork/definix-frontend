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
  // position: absolute;
  // li:before {
  //   list-style: none;
  //   width: 40px;
  //   height: 40px;
  //   background: #fff;
  //   border-radius: 50%;
  //   animation: animate 1.6s ease-in-out infinite;
  // }
  // @keyframes animate {
  //   0%,
  //   40%,
  //   100% {
  //     transform: scale(0.2);
  //   }
  //   20% {
  //     transform: scale(1);
  //   }
  // }
  // li:nth-child(1) {
  //   animation-delay: -1.4s;
  //   background: #ffff00;
  //   box-shadow: 0 0 50px #ffff00;
  // }
  // li:nth-child(2) {
  //   animation-delay: -1.2s;
  //   background: #76ff03;
  //   box-shadow: 0 0 50px #76ff03;
  // }
`

const GlowingAnimation = styled.ul`
  position: absolute;
  top: 26%;
  left: 57%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  display: flex;
  // background-color: #eee;

  li {
    list-style: none;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    animation: animate 1.6s ease-in-out infinite;
  }
  @keyframes animate {
    0%,
    40%,
    100% {
      transform: scale(0.2);
    }
    20% {
      transform: scale(1);
    }
  }
  li:nth-child(1) {
    animation-delay: -1.5s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(2) {
    animation-delay: -1.49s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(3) {
    animation-delay: -1.48s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(4) {
    animation-delay: -1.47s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(5) {
    animation-delay: -1.46s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(6) {
    animation-delay: -1.45s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(7) {
    animation-delay: -1.44s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(8) {
    animation-delay: -1.43s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(9) {
    animation-delay: -1.42s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(10) {
    animation-delay: -1.41s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(11) {
    animation-delay: -1.41s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(12) {
    animation-delay: -1.4s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(13) {
    animation-delay: -1.39s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(14) {
    animation-delay: -1.38s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(15) {
    animation-delay: -1.37s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
`

const GlowingUnderAnimation = styled.ul`
  position: absolute;
  top: 32%;
  left: 57%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  display: flex;
  // background-color: #eee;

  li {
    list-style: none;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    animation: animate 1.6s ease-in-out infinite;
  }
  @keyframes animate {
    0%,
    40%,
    100% {
      transform: scale(0.2);
    }
    20% {
      transform: scale(1);
    }
  }
  li:nth-child(1) {
    animation-delay: -1.36s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(2) {
    animation-delay: -1.35s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(3) {
    animation-delay: -1.34s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(4) {
    animation-delay: -1.33s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(5) {
    animation-delay: -1.32s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(6) {
    animation-delay: -1.31s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(7) {
    animation-delay: -1.3s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(8) {
    animation-delay: -1.28s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(9) {
    animation-delay: -1.27s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(10) {
    animation-delay: -1.26s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(11) {
    animation-delay: -0.09s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
`

const GlowingLeftAnimation = styled.ul`
  position: absolute;
  top: 28%;
  left: 46%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  // background-color: #eee;

  li {
    list-style: none;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    animation: animate 1.6s ease-in-out infinite;
  }
  @keyframes animate {
    0%,
    40%,
    100% {
      transform: scale(0.2);
    }
    20% {
      transform: scale(1);
    }
  }
  li:nth-child(1) {
    animation-delay: -1.4s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(2) {
    animation-delay: -1.2s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(3) {
    animation-delay: -1s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(4) {
    animation-delay: -0.8s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(5) {
    animation-delay: -0.6s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(6) {
    animation-delay: -0.4s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(7) {
    animation-delay: -0.2s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(8) {
    animation-delay: -0.1s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(9) {
    animation-delay: -0.09s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(10) {
    animation-delay: -0.1s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
  li:nth-child(11) {
    animation-delay: -0.09s;
    background: #ffff00;
    box-shadow: 0 0 50px #ffff00;
  }
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

  return (
    <div className={`col-4 ${mr} ${!isMobile ? 'w-100' : ''}`}>
      <ButtonPeriod
        onClick={() => {
          setPeriod(level)
        }}
        radii="small"
        isStroke
        style={{
          backgroundColor: period === level ? '#0973B937' : onSelect1(),
          border: `1px solid ${period === level ? '#0973B9' : '#737375'}`,
        }}
      >
        <BoxLevel className="col-4" color={period === level ? '#0973B9' : '#737375'}>
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
      setPeriod(0)
      setTest(0)
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
