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
  Button,
  ButtonScales,
  ButtonVariants,
  BackIcon,
  useModal,
} from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
// import useModal from 'uikit-dev/widgets/Modal/useModal'
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

const Withdraw: React.FC<WithdrawProps> = ({ sousId, isOldSyrup, tokenName, totalStaked, myStaked, max, onBack, apy }) => {
  const { t } = useTranslation()
  console.groupCollapsed('Withdraw data: ')
  console.log('tokenName: ', tokenName)
  console.log('totalStakedPrice: ', totalStaked)
  console.log('myStaked: ', myStaked)
  console.log('max: ', max)
  console.groupEnd()
  const [val, setVal] = useState('')
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  const { onUnstake } = useSousUnstake(sousId)

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

  const handleUnstake = useCallback(() => {
    onUnstake(isOldSyrup ? '0' : val)
  }, [isOldSyrup, onUnstake, val])

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

      <Card className="mt-s40 pa-s40">
        <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} />

        <Flex justifyContent="space-between" className="mt-s20">
          <Box style={{ width: '50%' }}>
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('Total staked')}
            </Text>
            <Text color={ColorStyles.BLACK} textStyle="R_18M">
              {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </Box>
          <Box style={{ width: '50%' }}>
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('My Staked')}
            </Text>
            <Text textStyle="R_18M" color={ColorStyles.BLACK}>
              {myStakedValue.toLocaleString()}
            </Text>
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_14R">
              = {myStakedPrice}
            </Text>
          </Box>
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
          <Button
            variant={ButtonVariants.RED}
            scale={ButtonScales.S_48}
            onClick={() => onPresentConfirmModal()}
            width="100%"
          >
            Remove
          </Button>
        </Box>
      </Card>
    </>
  )
}

export default Withdraw
