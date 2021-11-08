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
  console.groupCollapsed('Deposit data: ')
  console.log('tokenName: ', tokenName)
  console.log('totalStakedPrice: ', totalStaked)
  console.log('myStaked: ', myStaked)
  console.log('max: ', max)
  console.groupEnd()
  const [val, setVal] = useState('')
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  const { onStake } = useSousStake(sousId, isBnbPool)

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

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Deposit')}
      buttonName={t('Deposit')}
      tokenName={tokenName}
      stakedBalance={val}
      onOK={() => onStake(val)}
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

      <TitleSet title={t('Deposit in the Pool')} description={t('By depositing a single token')} />

      <Card className="mt-s40 pa-s40">
        <CardHeading tokenName={tokenName} isOldSyrup={isOldSyrup} apy={apy} />

        <Flex justifyContent="space-between" className="mt-s20">
          <Box style={{ width: '50% ' }}>
            <Text color={ColorStyles.MEDIUMGREY} textStyle="R_12R" className="mb-s8">
              {t('Total staked')}
            </Text>
            <Text color={ColorStyles.BLACK} textStyle="R_18M">
              {totalStakedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </Box>
          <Box style={{ width: '50% ' }}>
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
            lg
            onClick={() => onPresentConfirmModal()}
            width="100%"
          >
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
