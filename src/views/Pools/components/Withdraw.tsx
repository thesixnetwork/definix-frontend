import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSousUnstake } from 'hooks/useUnstake'
import useConverter from 'hooks/useConverter'
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
  useMatchBreakpoints,
} from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import ModalInput from 'components/ModalInput'
import ConfirmModal from './ConfirmModal'
import CardHeading from './PoolCard/CardHeading'

interface WithdrawProps {
  sousId: number
  isOldSyrup: boolean
  tokenName: string
  totalStaked: BigNumber
  myStaked: BigNumber
  max: BigNumber
  apy: BigNumber
  onBack: () => void
}

const Withdraw: React.FC<WithdrawProps> = ({
  sousId,
  isOldSyrup,
  tokenName,
  totalStaked,
  myStaked,
  max,
  onBack,
  apy,
}) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  const { onUnstake } = useSousUnstake(sousId)
  const [isPendingTX, setIsPendingTX] = useState(false)
  const [val, setVal] = useState('')

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const totalStakedValue = useMemo(() => {
    return getBalanceNumber(totalStaked)
  }, [totalStaked])

  const myStakedValue = useMemo(() => {
    return getBalanceNumber(myStaked)
  }, [myStaked])

  const myStakedPrice = useMemo(() => {
    return convertToUSD(new BigNumber(myStakedValue).multipliedBy(price), 0)
  }, [convertToUSD, myStakedValue, price])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = max.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [max, setVal],
  )

  const handleUnstake = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onUnstake(isOldSyrup ? '0' : val)
      // toast
      onBack()
    } catch (error) {
      // toast
    } finally {
      setIsPendingTX(false)
    }
  }, [isOldSyrup, onUnstake, val, isPendingTX, onBack])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Remove')}
      buttonName="Remove"
      tokenName={tokenName}
      stakedBalance={val}
      onOK={handleUnstake}
    />,
    false,
  )

  const cardStyle = useMemo((): {
    flexDirection: 'column' | 'row'
    margin: string
    padding: string
  } => {
    return {
      flexDirection: isMobile ? 'column' : 'row',
      margin: `mt-s${isMobile ? '28' : '40'}`,
      padding: `pa-s${isMobile ? '20' : '40'}`,
    }
  }, [isMobile])

  const columnStyle = useMemo((): {
    flexDirection: 'column' | 'row'
    width: string
    justifyContent: 'space-between' | 'normal'
    valueTextSize: string
    valueTextWidth: string
  } => {
    return {
      flexDirection: isMobile ? 'row' : 'column',
      width: isMobile ? '100%' : '50%',
      justifyContent: isMobile ? 'space-between' : 'normal',
      valueTextSize: isMobile ? 'R_16M' : 'R_18M',
      valueTextWidth: isMobile ? '65%' : '100%',
    }
  }, [isMobile])

  return (
    <>
      <Box className="mb-s20" style={{ cursor: 'pointer' }} display="inline-flex" onClick={onBack}>
        <Flex>
          <BackIcon />
          <Text textStyle="R_16M" color={ColorStyles.MEDIUMGREY} className="ml-s6">
            Back
          </Text>
        </Flex>
      </Box>

      <TitleSet title={t('Remove from the Pool')} description={t('Remove tokens from the pool')} />

      <Card className={`${cardStyle.margin} ${cardStyle.padding}`}>
        <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} />

        <Flex justifyContent="space-between" flexDirection={cardStyle.flexDirection} className="mt-s20">
          <Flex
            flexDirection={columnStyle.flexDirection}
            justifyContent={columnStyle.justifyContent}
            style={{ width: columnStyle.width }}
          >
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('Total staked')}
            </Text>
            <Text width={columnStyle.valueTextWidth} color={ColorStyles.BLACK} textStyle={columnStyle.valueTextSize}>
              {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </Flex>

          <Flex
            flexDirection={columnStyle.flexDirection}
            justifyContent={columnStyle.justifyContent}
            style={{ width: columnStyle.width }}
          >
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('My Staked')}
            </Text>
            <Box width={columnStyle.valueTextWidth}>
              <Text textStyle={columnStyle.valueTextSize} color={ColorStyles.BLACK}>
                {myStakedValue.toLocaleString()}
              </Text>
              <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
                = {myStakedPrice}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Divider className="mt-s20 mb-s28" />

        <ModalInput
          value={val}
          max={fullBalance}
          symbol={tokenName}
          buttonName="remove"
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          onClickButton={() => onPresentConfirmModal()}
        />
      </Card>
    </>
  )
}

export default Withdraw
