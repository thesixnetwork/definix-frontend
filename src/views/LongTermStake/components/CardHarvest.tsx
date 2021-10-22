/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import numeral from 'numeral'
import _ from 'lodash'
import { Card, Text, useMatchBreakpoints, Button } from '../../../uikit-dev'
import { useLockAmount, useHarvest, usePrivateData } from '../../../hooks/useLongTermStake'

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
//   const lockAmount = useLockAmount()
//   const pendingReward = usePendingReward()
  const { lockAmount, finixEarn } = usePrivateData()
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
    <Harvest className={`mt-5 pa-5 ${isMobile ? '' : 'flex'}`}>
      <div className={`${isMobile ? 'col-12' : 'col-8'}`}>
        <div className="flex justify-space-between">
          <Text fontSize="16px" color="#737375">
            Your total FINIX stake
          </Text>
          <Text fontWeight="800" fontSize="16px" color={textColor()} paddingRight="2" paddingLeft="2">
            {numeral(lockAmount).format('0,0.[000]')} FINIX
          </Text>
        </div>
        <div className="flex mt-2 justify-space-between">
          <Text fontSize="16px" color="#737375">
            Your FINIX earned
          </Text>
          <div className="flex">
            <Text fontWeight="800" fontSize="16px" color="success">
              {numeral(finixEarn).format('0,0.00')}
            </Text>
            <Text fontWeight="800" fontSize="16px" color={textColor()} paddingRight="2" paddingLeft="2">
              FINIX
            </Text>
          </div>
        </div>
      </div>
      <Button
        variant="success"
        fullWidth
        radii="small"
        disabled={!valueReward}
        onClick={onHarvest}
        className={`${isMobile ? 'col-12 mt-3' : 'col-4 text-right ml-8 mr-6'}`}
      >
        Harvest
      </Button>
    </Harvest>
  )
}

export default CardHarvest
