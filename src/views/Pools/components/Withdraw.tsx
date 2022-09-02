import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useSousUnstake } from 'hooks/useUnstake'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { Text, Box, Card, Flex, useModal } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/Text/CurrencyText'
import ConfirmModal from './ConfirmModal'
import { PoolWithApy } from './PoolCard/types'
import { spacing, mediaQueries } from 'uikitV2/base'
import { textStyle } from 'uikitV2/text'
import ModalInput from 'uikitV2/components/ModalInput'
import { ArrowBackIcon } from 'uikit-dev'
import PageTitle from 'uikitV2/components/PageTitle'
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

const Withdraw: React.FC<{
  isOldSyrup: boolean
  pool: PoolWithApy
  onBack: () => void
  renderCardHeading: () => void
}> = ({ isOldSyrup, pool, onBack, renderCardHeading }) => {
  const { convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()
  const { onUnstake } = useSousUnstake(pool.sousId)
  const [val, setVal] = useState('')

  const price = useMemo(() => {
    return convertToPriceFromSymbol(pool.stakingTokenName)
  }, [convertToPriceFromSymbol, pool.stakingTokenName])

  const totalStakedValue = useMemo(() => {
    return convertToBalanceFormat(getBalanceNumber(pool.totalStaked))
  }, [pool.totalStaked, convertToBalanceFormat])

  const myStakedBalance = useMemo(() => new BigNumber(pool.userData?.stakedBalance || 0), [pool.userData])

  const myStakedValue = useMemo(() => {
    return getBalanceNumber(myStakedBalance)
  }, [myStakedBalance])

  const myStakedDisplayValue = useMemo(() => {
    return convertToBalanceFormat(myStakedValue)
  }, [myStakedValue, convertToBalanceFormat])

  const myStakedPrice = useMemo(() => {
    return convertToPriceFormat(new BigNumber(myStakedValue).multipliedBy(price).toNumber())
  }, [convertToPriceFormat, myStakedValue, price])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = rate === 100 ? myStakedBalance : myStakedBalance.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [myStakedBalance, setVal],
  )

  const handleUnstake = useCallback(() => onUnstake(isOldSyrup ? '0' : val), [isOldSyrup, onUnstake, val])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      type="withdraw"
      tokenName={pool.stakingTokenName}
      stakedBalance={val}
      onOK={handleUnstake}
      goList={onBack}
    />,
    false,
  )

  return (
    <SmallestLayout>
      <Box className="mb-s20" style={{ cursor: 'pointer' }} display="inline-flex" onClick={onBack}>
        <Flex>
          <ArrowBackIcon color="#999" />
          <Text style={{ ...textStyle.R_16M, marginLeft: 6, color: '#999' }}>Back</Text>
        </Flex>
      </Box>

      <PageTitle title="Remove from the Pool" caption="Remove tokens from the pool">
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
            type="withdraw"
            value={val}
            max={myStakedBalance}
            balanceLabel={'Removable'}
            // symbol={pool.stakingTokenName}
            buttonName="Remove"
            onSelectBalanceRateButton={handleSelectBalanceRate}
            onChange={handleChange}
            onClickButton={() => onPresentConfirmModal()}
          />
        </CardWrap>
      </PageTitle>
    </SmallestLayout>
  )
}

export default Withdraw
