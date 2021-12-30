/* eslint-disable no-nested-ternary */
import React, { useCallback, useState, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import numeral from 'numeral'
import { Text, useMatchBreakpoints, Button, Heading, useModal } from '../../../uikit-dev'
import { useHarvest, usePrivateData } from '../../../hooks/useLongTermStake'
import SuperStakeModal from '../../../uikit-dev/widgets/WalletModal/SuperStakeModal'
import StartLongTermStakeModal from '../../../uikit-dev/widgets/WalletModal/StartLongTermStakeModal'

const SuperHarvestButton = styled(Button)`
  background: linear-gradient(#fad961, #f76b1c);
  color: #fff;
  padding: 0px 16px;
  margin-top: 10px;
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  height: 34px;
`

const HarvestButton = styled(Button)`
  font-style: italic;
  font-weight: normal;
  font-size: 14px;
  height: 34px;
`

const CardHarvest = () => {
  // @ts-ignore
  const { isDark } = useTheme()
  const { lockAmount, finixEarn, balancevfinix } = usePrivateData()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg && !isMd
  const { handleHarvest } = useHarvest()
  const [status, setStatus] = useState(false)
  const valueReward = useMemo(() => finixEarn > 0, [finixEarn])

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

  const [onPresentConnectModal] = useModal(
    !!balancevfinix && balancevfinix > 0 ? <SuperStakeModal /> : <StartLongTermStakeModal />,
  )

  return (
    <>
      <Heading fontSize="18px !important" className="bd-b pa-5">
        My Asset
      </Heading>
      <div className={`${isMobile ? 'col-12 pa-4' : 'col-12 flex bd-b py-4 px-3 '}`}>
        <div className={`align-self-center ${isMobile ? 'col-12 mb-4' : 'col-3 py-2 pl-2'}`}>
          <Text color="textSubtle" fontSize="12px !important">
            {' '}
            Your vFINIX balance
          </Text>
          <Heading as="h1" style={{ lineHeight: 2 }} fontSize="16px !important">
            {numeral(balancevfinix).format('0,0.[00]')} vFINIX
          </Heading>
        </div>
        <div className="bd-r" />
        <div className={`align-self-center ${isMobile ? 'col-12 mb-4' : 'col-3 py-2 pl-3'}`}>
          <Text color="textSubtle" fontSize="12px !important">
            {' '}
            Your total FINIX stake
          </Text>
          <Heading as="h1" style={{ lineHeight: 2 }} fontSize="16px !important">
            {numeral(lockAmount).format('0,0.[00]')} FINIX
          </Heading>
        </div>
        <div className="bd-r" />
        <div className={`align-self-center ${isMobile ? 'col-12' : 'col-3 pa-2 pl-3'}`}>
          <Text color="textSubtle" fontSize="12px !important">
            {' '}
            Your FINIX earned
          </Text>
          <div className={`${isMobile ? 'flex' : 'flex'}`}>
            <Heading as="h1" style={{ lineHeight: 2 }} fontSize="16px !important" color="success">
              {`${numeral(finixEarn).format('0,0.00')}`}
            </Heading>
            &nbsp;
            <Heading as="h1" style={{ lineHeight: 2 }} fontSize="16px !important" color={textColor()}>
              FINIX
            </Heading>
          </div>
        </div>
        <div className={`align-self-center ${isMobile ? 'col-12 pt-5' : 'col-3 pa-2 align-self-center'}`}>
          <HarvestButton
            variant="success"
            radii="small"
            disabled={!valueReward}
            onClick={onHarvest}
            fullWidth
            size="sm"
          >
            Harvest
          </HarvestButton>
          <SuperHarvestButton
            radii="small"
            fullWidth
            size="sm"
            onClick={() => {
              onPresentConnectModal()
            }}
          >
            Super Stake
          </SuperHarvestButton>
        </div>
      </div>
    </>
  )
}

export default CardHarvest
