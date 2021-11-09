import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSousStake } from 'hooks/useStake'
import useConverter from 'hooks/useConverter'
import {
  ColorStyles,
  Text,
  Box,
  TitleSet,
  Card,
  Flex,
  Divider,
  Button,
  ButtonVariants,
  BackIcon,
  useModal,
  useMatchBreakpoints,
} from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import ModalInput from 'components/ModalInput'
import ConfirmModal from './ConfirmModal'
import CardHeading from './PoolCard/CardHeading'

interface DepositProps {
  sousId: number
  isOldSyrup: boolean
  isBnbPool: boolean
  tokenName: string
  totalStaked: BigNumber
  myStaked: BigNumber
  max: BigNumber
  apy: BigNumber
  onBack: () => void
}

const Deposit: React.FC<DepositProps> = ({
  sousId,
  isOldSyrup,
  isBnbPool,
  tokenName,
  totalStaked,
  myStaked,
  max,
  apy,
  onBack,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  const { onStake } = useSousStake(sousId, isBnbPool)
  const [ isPendingTX, setIsPendingTX ] = useState(false)
  const [ val, setVal ] = useState('')

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

  const handleStake = useCallback(
    async () => {
      if (isPendingTX) return;
      try {
        setIsPendingTX(true)
        await onStake(val)
        // toast
        onBack()
      } catch (error) {
        // toast
      } finally {
        setIsPendingTX(false)
      }
    },
    [onStake, val, onBack, isPendingTX]
  )

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Deposit')}
      buttonName={t('Deposit')}
      tokenName={tokenName}
      stakedBalance={val}
      onOK={handleStake}
    />,
    false,
  )

  const cardStyle = useMemo((): {
    flexDirection: 'column' | 'row';
    margin: string;
    padding: string;
  } => {
    return {
      flexDirection: isMobile ? 'column' : 'row',
      margin: `my-s${isMobile ? '28' : '40'}`,
      padding: `pa-s${isMobile ? '20' : '40'}`
    }
  }, [isMobile])

  const columnStyle = useMemo((): {
    flexDirection: 'column' | 'row';
    width: string;
    justifyContent: 'space-between' | 'normal'
    valueTextSize: string
    valueTextWidth: string
  } => {
    return {
      flexDirection: isMobile ? 'row' : 'column',
      width: isMobile ? '100%' : '50%',
      justifyContent: isMobile ? 'space-between' : 'normal',
      valueTextSize: isMobile ? 'R_16M' : 'R_18M',
      valueTextWidth: isMobile ? '65%' : '100%'
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

      <TitleSet title={t('Deposit in the Pool')} description={t('By depositing a single token')} />

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
            <Text
              width={columnStyle.valueTextWidth}
              color={ColorStyles.BLACK}
              textStyle={columnStyle.valueTextSize}
            >
              {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </Flex>

          <Flex 
            flexDirection={columnStyle.flexDirection}
            justifyContent={columnStyle.justifyContent}
            style={{ width: columnStyle.width }}>
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
          onSelectBalanceRateButton={handleSelectBalanceRate}
          onChange={handleChange}
          max={fullBalance}
          symbol={tokenName}
          inputTitle="stake"
        />

        <Box className="mt-s40">
          <Button variant={ButtonVariants.RED} lg onClick={() => onPresentConfirmModal()} width="100%">
            Deposit
          </Button>
        </Box>
      </Card>
      {/* <p>totalStakedPrice: {totalStakedPrice}</p>
      <p>myStaked: {myStakedValue.toLocaleString()}</p>
      <p>myStakedPrice: {myStakedPrice}</p> */}
    </>
  )
}

export default Deposit
