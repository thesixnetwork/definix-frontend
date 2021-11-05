import React, { useCallback, useState } from 'react'
import { Button, Heading, Skeleton, Text } from 'uikit-dev'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'

import { useAllHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { usePoolsIsFetched, useFarmsIsFetched } from 'state/hooks'

import UnlockButton from 'components/UnlockButton'
import FinixHarvestAllBalance from './FinixHarvestTotalBalance'
import FinixHarvestBalance from './FinixHarvestBalance'
import FinixHarvestPool from './FinixHarvestPool'

const StatAll = styled.div`
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.white};

  h2 {
    margin: 4px 0;
  }
`

const StatSkeleton = () => {
  return (
    <>
      <Skeleton animation="pulse" variant="rect" height="26px" className="my-1" />
      <Skeleton animation="pulse" variant="rect" height="21px" />
    </>
  )
}

const Earned = () => {
  const { account } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()

  const [pendingTx, setPendingTx] = useState(false)

  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const isPoolFetched = usePoolsIsFetched()
  const isFarmFetched = useFarmsIsFetched()

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <div className="flex">
      <StatAll>
        <Heading color="textSubtle">Total Finix Earned</Heading>
        <Heading fontSize="24px !important" color="textInvert">
          <FinixHarvestAllBalance />
        </Heading>
        {account ? (
          <Button
            className="ml-2"
            id="harvest-all"
            size="sm"
            disabled={balancesWithValue.length <= 0 || pendingTx}
            onClick={harvestAllFarms}
          >
            {pendingTx ? TranslateString(548, 'Collecting FINIX') : TranslateString(532, `Harvest`)}
          </Button>
        ) : (
          <UnlockButton />
        )}
      </StatAll>
      <div className="flex">
        <StatAll>
          <Text color="textSubtle">Farm</Text>
          {isFarmFetched ? (
            <>
              <Heading fontSize="24px !important" color="textInvert">
                <FinixHarvestBalance />
              </Heading>
            </>
          ) : (
            <StatSkeleton />
          )}
        </StatAll>
        <StatAll>
          <Text color="textSubtle">Pool</Text>
          {isPoolFetched ? (
            <>
              <Heading fontSize="24px !important" color="textInvert">
                <FinixHarvestPool />
              </Heading>
            </>
          ) : (
            <StatSkeleton />
          )}
        </StatAll>
      </div>
    </div>
  )
}

export default Earned
