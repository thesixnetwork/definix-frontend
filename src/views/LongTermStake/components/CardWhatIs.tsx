/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import React from 'react'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Card, Heading, Text } from '../../../uikit-dev'
import finixLocks from '../../../uikit-dev/images/for-ui-v2/finix-lock.png'
import vFinix from '../../../uikit-dev/images/for-ui-v2/vFinix.png'
import arrowWhite from '../../../uikit-dev/images/for-ui-v2/arrow-white.png'
import arrowBlack from '../../../uikit-dev/images/for-ui-v2/arrow-black.png'
import plusBlack from '../../../uikit-dev/images/for-ui-v2/plus-black.png'
import plusWhite from '../../../uikit-dev/images/for-ui-v2/plus-white.png'

const StyledBanner = styled(Card)`
  width: 100%;
  padding: 64px 0 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 700px;
  flex-grow: 1;
  color: #fff;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;
    position: absolute;
    bottom: 0;
    right: 24px;
    pointer-events: none;
  }

  h2 {
    font-size: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 32px !important;
    }
  }
`

const Overflow = styled.div`
  flex-grow: 1;
  padding: 0 40px 40px 40px;
`

const ElementsLock = styled.div`
  width: 80%;
  padding: 10px 0 10px 0;
  position: absolute;
  display: flex;
  flex-direction: column;
  max-height: 820px;
  flex-grow: 1;
  color: #fff;
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.colors.textSubtle};
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ElementVFinix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 2rem !important;
`

const Element = () => {
  const { isDark } = useTheme()
  return (
    <ElementsLock className="mt-6">
      <img src={finixLocks} alt="" width="80px" height="76px" className="pos-relative" />
      <img src={isDark ? arrowWhite : arrowBlack} alt="" width="20%" className="mx-1"/>
      <img src={`/images/coins/${'FINIX'}.png`} alt="" width="40px" height="40px" className="pos-relative" />
      <img src={isDark ? plusWhite : plusBlack} alt="" width="5%" className="mx-1"/>
      <img src={vFinix} alt="finixLocks" width="40px" height="40px" className="pos-relative" />
    </ElementsLock>
  )
}

const BeforeStart = () => {
  const { isDark } = useTheme()
  return (
    <Overflow>
      <Heading color="primary">Stake FINIX</Heading>
      <Heading color="primary">Earn vFINIX</Heading>
      <Text className="mt-4" color={isDark ? 'white' : 'textSubtle'}>
        You can earn additional FINIX rewards and transaction fee benefits by contributing to the ecosystem through
        FINIX staking and pool voting.
      </Text>
      <Element />
      <Text color={isDark ? 'white' : 'textSubtle'} style={{ marginTop: 164 }}>
        You must first stake your FINIX with a lock duration of 90, 180, or 365 days. As a rewards, youll get FINIX and
        vFINIX.
      </Text>
      <ElementVFinix>
        <img src={vFinix} alt="vfinix" width="53px" height="53px" className="mr-2" />
        <Heading color="primary">vFINIX</Heading>
      </ElementVFinix>
      <Text className="mt-6 mb-4" color={isDark ? 'white' : 'textSubtle'}>
        vFINIX is a bonus governance token that will be used for voting and lowering transaction fees in rebalancing
        farms.
      </Text>
    </Overflow>
  )
}

const CardWhatIs = ({ className = '' }) => {
  return (
    <StyledBanner className={className}>
      <BeforeStart />
    </StyledBanner>
  )
}

export default CardWhatIs
