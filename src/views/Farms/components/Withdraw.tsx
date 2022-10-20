import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { QuoteToken } from 'config/constants/types'
import {
  useFarmFromSymbol,
  useFarmUser,
  useFarms,
  usePriceBnbBusd,
  usePriceEthBusd,
  usePriceFinixUsd,
  usePriceSixUsd,
} from 'state/hooks'
import { useSousStake } from 'hooks/useStake'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { Text, Box, Flex } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import ConfirmModal from './ConfirmModal'
import CardHeading from './FarmCard/CardHeading'
import { FarmWithStakedValue } from './FarmCard/types'
import { mediaQueries, spacing } from 'uikitV2/base'
import { textStyle } from 'uikitV2/text'
import ModalInput from 'uikitV2/components/ModalInput'
import { useModal } from 'uikitV2/Modal'
import Card from 'uikitV2/components/Card'
import { ArrowBackIcon } from 'uikit-dev'
import PageTitle from 'uikitV2/components/PageTitle'
import { ColorStyles } from 'uikitV2/colors'
import { Button } from '@mui/material'
import SmallestLayout from 'uikitV2/components/SmallestLayout'

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
  farm?: FarmWithStakedValue
  addSwapUrl?: string
  onBack: () => void
  renderCardHeading: () => void
}> = ({ farm, onBack, renderCardHeading, addSwapUrl }) => {
  const history = useHistory()

  const bnbPrice = usePriceBnbBusd()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const ethPrice = usePriceEthBusd()

  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { stakedBalance } = useFarmUser(pid)
  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const ratio = new BigNumber(stakedBalance).div(new BigNumber(farm.lpTotalSupply))

  const stakedTotalInQuoteToken = new BigNumber(farm.quoteTokenBlanceLP)
    .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
    .times(ratio)
    .times(new BigNumber(2))

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [sixPrice, bnbPrice, finixPrice, ethPrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const stakedBalanceValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return new BigNumber(0)
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
      return finixPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(stakedTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.SIX) {
      return sixPrice.times(stakedTotalInQuoteToken)
    }
    return stakedTotalInQuoteToken
  }, [
    sixPrice,
    finixPrice,
    farm.lpTotalInQuoteToken,
    farm.quoteTokenSymbol,
    stakedTotalInQuoteToken,
    bnbPrice,
    ethPrice,
  ])

  // const { convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()
  // const { onStake } = useSousStake(pool.sousId, isBnbPool)
  // const [val, setVal] = useState('')

  // const tokenName = useMemo(() => {
  //   return pool.stakingLimit ? `${pool.stakingTokenName} (${pool.stakingLimit} max)` : pool.stakingTokenName
  // }, [pool.stakingLimit, pool.stakingTokenName])

  // const stakingTokenBalance = useMemo(() => new BigNumber(pool.userData?.stakingTokenBalance || 0), [pool.userData])
  // const stakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])
  // const stakingLimit = useMemo(
  //   () => new BigNumber(pool.stakingLimit).multipliedBy(new BigNumber(10).pow(pool.tokenDecimals)),
  //   [pool.stakingLimit, pool.tokenDecimals],
  // )

  // const maxValue = useMemo(() => {
  //   return pool.stakingLimit && stakingTokenBalance.isGreaterThan(stakingLimit) ? stakingLimit : stakingTokenBalance
  // }, [pool.stakingLimit, stakingLimit, stakingTokenBalance])

  // const totalStakedValue = useMemo(() => {
  //   return convertToBalanceFormat(getBalanceNumber(pool.totalStaked))
  // }, [pool.totalStaked, convertToBalanceFormat])

  // const myStakedValue = useMemo(() => getBalanceNumber(stakedBalance), [stakedBalance])
  // const myStakedDisplayValue = useMemo(() => {
  //   return convertToBalanceFormat(myStakedValue)
  // }, [myStakedValue, convertToBalanceFormat])
  // const myStakedPrice = useMemo(() => {
  //   const price = convertToPriceFromSymbol(tokenName)
  //   return convertToPriceFormat(new BigNumber(myStakedValue).multipliedBy(price).toNumber())
  // }, [convertToPriceFromSymbol, tokenName, myStakedValue, convertToPriceFormat])

  // const handleChange = useCallback(
  //   (e: React.FormEvent<HTMLInputElement>) => {
  //     setVal(e.currentTarget.value)
  //   },
  //   [setVal],
  // )

  // const handleSelectBalanceRate = useCallback(
  //   (rate: number) => {
  //     const balance = rate === 100 ? maxValue : maxValue.times(rate / 100)
  //     setVal(getFullDisplayBalance(balance))
  //   },
  //   [maxValue, setVal],
  // )

  // const handleStake = useCallback(() => onStake(val), [onStake, val])

  // /**
  //  * confirm modal
  //  */
  // const [onPresentConfirmModal] = useModal(
  //   <ConfirmModal type="deposit" tokenName={tokenName} stakedBalance={val} onOK={handleStake} goList={onBack} />,
  //   false,
  // )

  return (
    <SmallestLayout>
      <Box style={{ cursor: 'pointer', marginBottom: 20, display: 'inline-flex' }} onClick={onBack}>
        <Flex>
          <ArrowBackIcon color="#999" />
          <Text style={{ ...textStyle.R_16M, marginLeft: 6, color: '#999' }}>Back</Text>
        </Flex>
      </Box>
      <PageTitle
        title="Deposit"
        caption="Deposit LP on the farm and get high interest income."
        // linkLabel="Learn how to stake in Pool"
        // link="https://sixnetwork.gitbook.io/definix/syrup-pools/how-to-stake-to-definix-pool"
        // img={poolImg}
      />
      <CardWrap>
        {renderCardHeading()}
        <CardBody>
          <LiquidityInfo hasMb>
            <LiquidityTitle>Total staked</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{totalValueFormated}</BalanceText>
            </LiquidityValue>
          </LiquidityInfo>

          <LiquidityInfo hasMb={false}>
            <LiquidityTitle>My Staked</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{displayBalance}</BalanceText>
              <PriceText value={stakedBalanceValue} prefix="=" />
            </LiquidityValue>
          </LiquidityInfo>
        </CardBody>

        <StyledDivider />

        <ModalInput
          type="deposit"
          value={''}
          max={new BigNumber(100)}
          // symbol={tokenName}
          buttonName="Deposit"
          onChange={() => {
            console.log(1)
          }}
          onSelectBalanceRateButton={() => {
            console.log(1)
          }}
          onClickButton={() => {
            console.log(1)
          }}
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
    </SmallestLayout>
  )
}

export default Deposit
