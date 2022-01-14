import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import { rgba } from 'polished'
import {
  Flex,
  Coin,
  Text,
  AnountButton,
  Noti,
  NotiType,
  ModalProps,
  VDivider,
} from '@fingerlabs/definixswap-uikit-v2'
import NumericalInput from 'components/NumericalInput'
import { usePrivateData } from 'hooks/useLongTermStake'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'
import VoteOptionLabel from './VoteOptionLabel'

interface Props extends ModalProps {
  selectedVotes: string[];
  setBalances: (balances: string[]) => void;
  balances: string[];
  showNotis: string[];
  setShowNotis: (showNotis: string[]) => void;
}

const WrapScroll = styled(Flex)`
  flex-direction: column;
  margin-top: 14px;
  max-height: 382px;
  overflow-y: auto;
`

const InputBox = styled(Flex)`
  display: flex;
  flex-flow: row nowrap;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const StyledAnountButton = styled(AnountButton)`
  margin-left: ${({ theme }) => theme.spacing.S_6}px;
  background: ${({ theme }) => rgba(theme.colors.lightgrey, 0.3)};
`

const VotingContentModal: React.FC<Props> = ({ selectedVotes, balances, setBalances, showNotis, setShowNotis }) => {
  const { t } = useTranslation();
  const { balancevfinix } = usePrivateData()
  const myVFinixBalance = useMemo(() => getBalanceOverBillion(balancevfinix), [balancevfinix]);
  const [remainVFinix, setRemainVFinix] = useState<string>(myVFinixBalance);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);
  const balancesRef = useRef<string[]>([]);

  const onUserInput = useCallback((index: number, input: string) => {
    const temp = balances.slice(0);
    temp[index] = input;
    setActiveInputIndex(index);
    setBalances(temp);
    balancesRef.current = temp;
  }, [balances, setBalances])

  const handlePercent = useCallback((index: number, percent: number) => {
    const total = numeral(remainVFinix).add(+balances[index] > -1 ? +balances[index] : 0);
    onUserInput(index, total.multiply(percent * 1 / 100).format('0,0.00'))
  }, [balances, onUserInput, remainVFinix])

  useEffect(() => {
    function setShowNoti(index: number, message: string) {
      const temp = showNotis.slice(0);
      temp[index] = message;
      setShowNotis(temp);
    }

    const resultVFinix = numeral(myVFinixBalance).subtract(balances.reduce((sum, cur) => {
      // eslint-disable-next-line no-param-reassign
      sum += +cur;
      return sum;
    }, 0));

    if (new BigNumber(balances[activeInputIndex]).decimalPlaces() > 18) {
      setShowNoti(activeInputIndex, t('The value entered is out of the valid range'))
    } else if (resultVFinix.value() < 0) {
      setShowNoti(activeInputIndex, t('Insufficient balance'))
    } else {
      setShowNoti(activeInputIndex, '')
    }

    setRemainVFinix(resultVFinix.format('0,0.00'))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, myVFinixBalance]);

  return (
    <>
      <Flex flexDirection="column">
        <Flex alignItems="center">
          <Coin symbol="VFINIX" size="40px" />
          <Flex flexDirection="column" ml="16px">
            <Text textStyle="R_14R" color="mediumgrey">{t('Balance')}</Text>
            <Flex mt="2px" alignItems="flex-end">
              <Text textStyle="R_20M" color="black">{myVFinixBalance}</Text>
              <Text textStyle="R_14R" color="black" ml="6px">{t('vFINIX')}</Text>
              <Flex alignItems="center">
                <VDivider mx="12px" mb="2px" style={{
                  height: '12px',
                  alignSelf: 'center'
                }} />
                <Text textStyle="R_14R" color="mediumgrey">{t('Available')}</Text>
                <Text textStyle="R_14M" color="mediumgrey" ml="6px">{numeral(remainVFinix).format('0,0.00')}</Text>
                <Text textStyle="R_14R" color="mediumgrey" ml="2px">{t('vFINIX')}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <WrapScroll>
        {selectedVotes.map((vote, index) => <Flex flexDirection="column" pt="32px">
          <VoteOptionLabel label={vote} />
          <InputBox mt="12px">
            <NumericalInput
              value={balances[index]}
              onUserInput={(input) => onUserInput(index, input)}
            />
            <div className="flex align-center justify-end">
              <StyledAnountButton onClick={() => handlePercent(index, 100)}>MAX</StyledAnountButton>
            </div>
          </InputBox>
          {!showNotis[index] || showNotis[index] !== '' && <Noti mt="12px" type={NotiType.ALERT}>
            {showNotis[index]}
          </Noti>}
        </Flex>)}
      </WrapScroll>
    </>
  )
}

export default VotingContentModal
