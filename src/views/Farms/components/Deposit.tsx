import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useStake from 'hooks/useStake'
import useConverter from 'hooks/useConverter'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useHistory } from 'react-router-dom'

import {
  ColorStyles,
  Text,
  Box,
  TitleSet,
  Card,
  Flex,
  Divider,
  BackIcon,
  useModal,
  Button,
} from '@fingerlabs/definixswap-uikit-v2'
import ModalInput from 'components/ModalInput'
import CurrencyText from 'components/Text/CurrencyText'
import ConfirmModal from './ConfirmModal'
import CardHeading from './FarmCard/CardHeading'
import { FarmWithStakedValue } from './FarmCard/types'

const CardWrap = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.S_40}px;
  padding: ${({ theme }) => theme.spacing.S_40}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: ${({ theme }) => theme.spacing.S_28}px;
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`
const CardBody = styled(Flex)`
  justify-content: space-between;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.S_20}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
  }
`
const LiquidityInfo = styled(Flex)<{ hasMb: boolean }>`
  flex-direction: column;
  justify-content: normal;
  width: 50%;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: ${({ theme, hasMb }) => (hasMb ? theme.spacing.S_16 : 0)}px;
    width: 100%;
  }
`
const LiquidityTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.S_4}px;
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_12R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: 0;
  }
`
const LiquidityValue = styled(Text)`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 65%;
  }
`
const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`
const TotalLiquidityText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`
const PriceText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.deepgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`
const StyledDivider = styled(Divider)`
  margin-top: ${({ theme }) => theme.spacing.S_20}px;
  margin-bottom: ${({ theme }) => theme.spacing.S_28}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin: ${({ theme }) => theme.spacing.S_24}px 0;
  }
`

const Deposit: React.FC<{
  farm: FarmWithStakedValue
  lpTokenName: string
  myLiquidityPrice: BigNumber
  addLiquidityUrl: string
  onBack: () => void
}> = ({ farm, lpTokenName, myLiquidityPrice, addLiquidityUrl, onBack }) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { convertToBalanceFormat } = useConverter()
  const { pid } = useFarmFromSymbol(farm.lpSymbol)
  const { tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStake(pid)
  const [val, setVal] = useState('')

  const totalLiquidity: number = useMemo(() => farm.totalLiquidityValue, [farm.totalLiquidityValue])
  const myLiquidityValue = useMemo(() => getBalanceNumber(stakedBalance), [stakedBalance])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = rate === 100 ? tokenBalance : tokenBalance.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [tokenBalance, setVal],
  )

  const handleStake = useCallback(() => onStake(val), [onStake, val])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal type="deposit" lpSymbol={lpTokenName} stakedBalance={val} onOK={handleStake} goList={onBack} />,
    false,
  )

  return (
    <>
      <Box className="mb-s20" style={{ cursor: 'pointer' }} display="inline-flex" onClick={onBack}>
        <Flex>
          <BackIcon />
          <Text textStyle="R_16M" color={ColorStyles.MEDIUMGREY} className="ml-s6">
            {t('Back')}
          </Text>
        </Flex>
      </Box>

      <TitleSet title={t('Deposit')} description={t('Deposit LP on the farm')} />

      <CardWrap>
        <CardHeading farm={farm} lpLabel={lpTokenName} addLiquidityUrl={addLiquidityUrl} componentType="deposit" />

        <CardBody>
          <LiquidityInfo hasMb>
            <LiquidityTitle>{t('Total staked')}</LiquidityTitle>
            <LiquidityValue>
              <TotalLiquidityText value={totalLiquidity} />
            </LiquidityValue>
          </LiquidityInfo>

          <LiquidityInfo hasMb={false}>
            <LiquidityTitle>{t('My Staked')}</LiquidityTitle>
            <LiquidityValue>
              <BalanceText>{convertToBalanceFormat(myLiquidityValue)}</BalanceText>
              <PriceText value={myLiquidityPrice.toNumber()} prefix="=" />
            </LiquidityValue>
          </LiquidityInfo>
        </CardBody>

        <StyledDivider />

        <ModalInput
          type="deposit"
          value={val}
          max={tokenBalance}
          // symbol={lpTokenName}
          buttonName={t('Deposit')}
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          onClickButton={() => onPresentConfirmModal()}
          disabled={lpTokenName.includes('Favor')}
        />

        <Flex justifyContent="space-between" alignItems="center" mt="S_20">
          <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
            {t(`Don't have an LP?`)}
          </Text>
          <Button
            type="button"
            variant="line"
            onClick={() => {
              history.push(addLiquidityUrl)
            }}
          >
            {t('Add Liquidity')}
          </Button>
        </Flex>
      </CardWrap>
    </>
  )
}

export default Deposit
