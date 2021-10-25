/* eslint-disable no-nested-ternary */
import React, { useCallback, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import numeral from 'numeral'
import _ from 'lodash'
import { Card, Text, useMatchBreakpoints, Button, Heading } from '../../../uikit-dev'
import { useHarvest, usePrivateData } from '../../../hooks/useLongTermStake'

const Harvest = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const CardHarvest = () => {
  // @ts-ignore
  const { isDark } = useTheme()
  const { lockAmount, finixEarn, balancefinix, balancevfinix } = usePrivateData()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg && !isMd
  const { handleHarvest } = useHarvest()
  const [status, setStatus] = useState(false)
  const valueReward = finixEarn > 0

  const onHarvest = useCallback(async () => {
    try {
      const res = await handleHarvest()
      if (res) {
        setStatus(!status)
      }
    } catch (e) {
      console.error(e)
    }
  }, [handleHarvest, status])

  const textColor = () => {
    return isDark ? 'white' : 'textSubtle'
  }

  return (
    <>
      <Heading className="bd-b pa-5">My Asset</Heading>
      <div className={`${isMobile ? 'col-12 pa-4' : 'col-12 flex bd-b py-4 px-2 '}`}>
        <div className={`${isMobile ? 'col-12 mb-4' : 'col-3 pa-2'}`}>
          <Text color="textSubtle">Your vFINIX balance</Text>
          <Heading as="h1" style={{ lineHeight: 2 }} fontSize="20px !important">
            {numeral(balancevfinix).format('0,0.[000]')} vFINIX
          </Heading>
        </div>
        <div className="bd-r" />
        <div className={`${isMobile ? 'col-12 mb-4' : 'col-3 py-2 pl-4 '}`}>
          <Text color="textSubtle">Your total FINIX stake</Text>
          <Heading as="h1" style={{ lineHeight: 2 }} fontSize="20px !important">
            {numeral(lockAmount).format('0,0.[000]')} FINIX
          </Heading>
        </div>
        <div className="bd-r" />
        <div className={`${isMobile ? 'col-12' : 'col-3 pa-2 pl-4'}`}>
          <Text color="textSubtle">Your FINIX earned</Text>
          <div className={`${isMobile ? 'flex' : 'flex'}`}>
            <Heading as="h1" style={{ lineHeight: 2 }} fontSize="20px !important" color="success">
              {`${numeral(finixEarn).format('0,0.00')}`}
            </Heading>
            &nbsp;
            <Heading as="h1" style={{ lineHeight: 2 }} fontSize="20px !important" color={textColor()}>
              FINIX
            </Heading>
          </div>
        </div>
        <div className={`${isMobile ? 'col-12' : 'col-3 pa-2 align-self-center'}`}>
          <Button variant="success" radii="small" disabled={!valueReward} onClick={onHarvest} fullWidth>
            Harvest
          </Button>
        </div>
      </div>
    </>
  )
}

export default CardHarvest
