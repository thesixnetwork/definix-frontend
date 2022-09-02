import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { useSousStake } from 'hooks/useStake'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { Text, Box, Flex } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import ConfirmModal from './ConfirmModal'
import CardHeading from './PoolCard/CardHeading'
import { PoolWithApy } from './PoolCard/types'
import { mediaQueries, spacing } from 'uikitV2/base'
import { textStyle } from 'uikitV2/text'
import ModalInput from 'uikitV2/components/ModalInput'
import { useModal } from 'uikitV2/Modal'
import Card from 'uikitV2/components/Card'
import { ArrowBackIcon } from 'uikit-dev'
import PageTitle from 'uikitV2/components/PageTitle'
import { ColorStyles } from 'uikitV2/colors'
import { Button } from '@mui/material'

const CardWrap = styled(Card)`
  margin-top: ${spacing.S_40}px;
  padding: ${spacing.S_40}px;
  ${mediaQueries.mobileXl} {
    margin-top: ${spacing.S_28}px;
    padding: ${spacing.S_20}px;
  }
`
const CardBody = styled(Flex)`
  justify-content: space-between;
  flex-direction: row;
  margin-top: ${spacing.S_20}px;
  ${mediaQueries.mobileXl} {
    flex-direction: column;
  }
`
const LiquidityInfo = styled(Flex)<{ hasMb: boolean }>`
  flex-direction: column;
  justify-content: normal;
  width: 50%;
  ${mediaQueries.mobileXl} {
    margin-bottom: ${({ hasMb }) => (hasMb ? spacing.S_16 : 0)}px;
    width: 100%;
  }
`
const LiquidityTitle = styled(Text)`
  margin-bottom: ${spacing.S_4}px;
  color: #999;
  ${textStyle.R_12R};
  ${mediaQueries.mobileXl} {
    margin-bottom: 0;
  }
`
const LiquidityValue = styled(Text)`
  width: 100%;
  ${mediaQueries.mobileXl} {
    width: 65%;
  }
`
const BalanceText = styled(Text)`
  color: #222;
  ${textStyle.R_18M};
  ${mediaQueries.mobileXl} {
    ${textStyle.R_16M};
  }
`
const PriceText = styled(CurrencyText)`
  color: #666;
  ${textStyle.R_14R};
  ${mediaQueries.mobileXl} {
    ${textStyle.R_12R};
  }
`
const StyledDivider = styled.div`
  margin-top: ${spacing.S_20}px;
  margin-bottom: ${spacing.S_28}px;
  ${mediaQueries.mobileXl} {
    margin: ${spacing.S_24}px 0;
  }
`

const Deposit: React.FC<{
  isOldSyrup: boolean
  isBnbPool: boolean
  pool: PoolWithApy
  addSwapUrl?: string
  onBack: () => void
  renderCardHeading: () => void
}> = ({ isOldSyrup, isBnbPool, pool, onBack, renderCardHeading, addSwapUrl }) => {
  const history = useHistory()
  const { convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()
  const { onStake } = useSousStake(pool.sousId, isBnbPool)
  const [val, setVal] = useState('')

  const tokenName = useMemo(() => {
    return pool.stakingLimit ? `${pool.stakingTokenName} (${pool.stakingLimit} max)` : pool.stakingTokenName
  }, [pool.stakingLimit, pool.stakingTokenName])

  const stakingTokenBalance = useMemo(() => new BigNumber(pool.userData?.stakingTokenBalance || 0), [pool.userData])
  const stakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])
  const stakingLimit = useMemo(
    () => new BigNumber(pool.stakingLimit).multipliedBy(new BigNumber(10).pow(pool.tokenDecimals)),
    [pool.stakingLimit, pool.tokenDecimals],
  )

  const maxValue = useMemo(() => {
    return pool.stakingLimit && stakingTokenBalance.isGreaterThan(stakingLimit) ? stakingLimit : stakingTokenBalance
  }, [pool.stakingLimit, stakingLimit, stakingTokenBalance])

  const totalStakedValue = useMemo(() => {
    return convertToBalanceFormat(getBalanceNumber(pool.totalStaked))
  }, [pool.totalStaked, convertToBalanceFormat])

  const myStakedValue = useMemo(() => getBalanceNumber(stakedBalance), [stakedBalance])
  const myStakedDisplayValue = useMemo(() => {
    return convertToBalanceFormat(myStakedValue)
  }, [myStakedValue, convertToBalanceFormat])
  const myStakedPrice = useMemo(() => {
    const price = convertToPriceFromSymbol(tokenName)
    return convertToPriceFormat(new BigNumber(myStakedValue).multipliedBy(price).toNumber())
  }, [convertToPriceFromSymbol, tokenName, myStakedValue, convertToPriceFormat])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = rate === 100 ? maxValue : maxValue.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [maxValue, setVal],
  )

  const handleStake = useCallback(() => onStake(val), [onStake, val])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal type="deposit" tokenName={tokenName} stakedBalance={val} onOK={handleStake} goList={onBack} />,
    false,
  )

  return (
    <>
      <Box style={{ cursor: 'pointer', marginBottom: 20, display: 'inline-flex' }} onClick={onBack}>
        <Flex>
          <ArrowBackIcon color="#999" />
          <Text style={{ ...textStyle.R_16M, marginLeft: 6, color: '#999' }}>Back</Text>
        </Flex>
      </Box>
      <PageTitle
        title="Deposit in the Pool"
        caption="By depositing a single token"
        // linkLabel="Learn how to stake in Pool"
        // link="https://sixnetwork.gitbook.io/definix/syrup-pools/how-to-stake-to-definix-pool"
        // img={poolImg}
      >
        <CardWrap>
          {renderCardHeading()}
          <CardBody>
            <LiquidityInfo hasMb>
              <LiquidityTitle>Total staked</LiquidityTitle>
              <LiquidityValue>
                <BalanceText>{totalStakedValue}</BalanceText>
              </LiquidityValue>
            </LiquidityInfo>

            <LiquidityInfo hasMb={false}>
              <LiquidityTitle>My Staked</LiquidityTitle>
              <LiquidityValue>
                <BalanceText>{myStakedDisplayValue}</BalanceText>
                <PriceText value={myStakedPrice} prefix="=" />
              </LiquidityValue>
            </LiquidityInfo>
          </CardBody>

          <StyledDivider />

          <ModalInput
            type="deposit"
            value={val}
            max={maxValue}
            // symbol={tokenName}
            buttonName="Deposit"
            onChange={handleChange}
            onSelectBalanceRateButton={handleSelectBalanceRate}
            onClickButton={() => onPresentConfirmModal()}
          />

          <Flex justifyContent="space-between" alignItems="center" style={{ marginTop: 20 }}>
            <Text style={{ ...textStyle.R_14R, color: '#999' }}>Don't have a token?</Text>
            <Button
              // type="button"
              variant="outlined"
              color="secondary"
              onClick={() => {
                history.push(addSwapUrl)
                // window.location.href = `${addSwapUrl}`
              }}
            >
              Swap
            </Button>
          </Flex>
        </CardWrap>
      </PageTitle>
    </>
  )
}

export default Deposit
