import React, { useState } from 'react'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'
import { ChevronDown } from 'react-feather'
import { Button, Text, useMatchBreakpoints, Card, Flex, Image } from 'uikit-dev'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import MenuButton from 'uikit-dev/widgets/Menu/MenuButton'
import Helper from 'uikit-dev/components/Helper'
import { ChevronDownIcon } from 'uikit-dev/components/Svg'
import calendarWhite from 'uikit-dev/images/for-ui-v2/nft/calendar-white.png'
import calendarBlack from 'uikit-dev/images/for-ui-v2/nft/calendar-black.png'
import DropdownList from '../DropdownNFT/DropdownList'
import { useSellNFTOneItem } from '../../../../hooks/useGetMyNft'
import OutsideClick from '../OutsideClick'

interface Props {
  onDismiss?: () => void
  data: any
}

const Balance = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: start;
  padding: 0.75rem;
  border: 1px solid #737375;
  box-shadow: unset;
  border-radius: ${({ theme }) => theme.radii.default};
  background-color: ${({ theme }) => (theme.isDark ? '#57575B' : '#ECECEC')};

  a {
    display: block;
  }
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 18px;
  font-weight: bold;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};
  -webkit-flex: 1 1 auto;
  padding: 0px;
`

const CardField = styled.div`
  width: 480px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: unset;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 480px;
  }
`

const DropdownBtn = styled.button<{ border: string; color: string }>`
  position: relative;
  width: 100%;
  height: 52px;
  display: flex;
  padding: 0 16px;

  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  text-align: center;
  color: ${({ color }) => color};
  overflow: hidden;
  background-color: ${({ theme }) => (theme.isDark ? '#57575B' : '#ECECEC')};
  border: solid 1px ${({ border }) => border};
  cursor: pointer;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 0 0 10px;
  }
`

const ArrowWrap = styled.span`
  position: absolute;
  right: 12px;
  float: right;
  align-items: center;
  display: flex;
  cursor: pointer;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};

  @media screen and (max-width: 768px) {
    right: 6px;
  }
`

const SubWrap = styled(Card)`
  position: absolute;
  top: 55px;
  right: 0;
  z-index: 1;
  width: 100%;
  border: 1px solid #737375;

  // @media screen and (max-width: 768px) {
  //   top: 35px;
  // }
`

const SubBtns = styled.div`
  width: 100%;
  border-radius: 8px;
  border: solid 1px var(--gray-scale-03);
  overflow: hidden;
`

const Flatpicker = styled(Flatpickr)`
  width: 100%;
  height: 52px;
  border-radius: 8px;
  border: 1px solid #737375;
  background-color: ${({ theme }) => (theme.isDark ? '#57575B' : '#ECECEC')};
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#737375')};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  padding: 0.75rem;
`

const ListFillModal: React.FC<Props> = ({ onDismiss = () => null, data }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [values, setValues] = useState('')
  const [lang, setLang] = useState('')
  const [price, setPrice] = useState('')
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { isDark } = useTheme()
  const [dates, setDate] = useState()
  const [timeStamp, setTimeStamp] = useState('-')
  const { onSell } = useSellNFTOneItem(
    '0xB7cdb5199d9D8be847d9B7d9e111977652E53307',
    data.tokenID,
    price,
    '0x1FD5a30570b384f03230595E31a4214C9bEdC964',
    '1',
    timeStamp === '-' ? '0' : Math.round(new Date(timeStamp).getTime() / 1000),
  )

  const currency = [{ id: 1, value: 'SIX' }]
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setValues(nextUserInput)
    }
  }

  const handleChange = (e) => {
    setPrice(new BigNumber(parseFloat(e.target.value)).times(new BigNumber(10).pow(18)).toFixed())
    enforcer(e.target.value.replace(/,/g, '.'))
  }

  const [isCurrency, setIsCurrency] = useState<boolean>(false)
  const [fillCurrency, setFillCurrency] = useState('SIX')

  const handleIsCurrency = (val) => {
    setIsCurrency(false)
    setFillCurrency(val.value)
  }

  const test = (date) => {
    setDate(date)
    setTimeStamp(date)
  }

  return (
    <ModalNFT
      isRainbow={false}
      title=""
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      classHeader="bd-b-n"
      bodyPadding="0px"
    >
      <CardField>
        <div className="bd-b px-5 pt-2 pb-3">
          <Text bold fontSize={isMobile ? '26px !important' : '30px !important'} lineHeight="1">
            #{data.tokenID}
          </Text>
          <Text bold fontSize={isMobile ? '14px !important' : '18px !important'} lineHeight="2">
            {data.name} {data.title}
          </Text>
          <Text fontSize="14px !important" color="textSubtle" lineHeight="1.5">
            Dingo x SIX Network NFT Project No.1
          </Text>
        </div>
        <div className="pa-5 pt-3">
          <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
            Currency
          </Text>
          <OutsideClick
            onClick={() => setIsCurrency(false)}
            as={
              <Flex position="relative" width="auto">
                <DropdownBtn
                  border="#737375"
                  color={isDark ? '#FFFFFF' : '#212121'}
                  onClick={() => setIsCurrency(!isCurrency)}
                >
                  <img src={`/images/coins/${'SIX'}.png`} alt="" width="20px" />
                  &nbsp;
                  <Text bold fontSize="16px">
                    {fillCurrency}
                  </Text>
                  <ArrowWrap>
                    <ChevronDown style={{ transform: `rotate(${isCurrency ? 180 : 0}deg)` }} size="18px" />
                  </ArrowWrap>
                </DropdownBtn>
                {isCurrency && (
                  <SubWrap>
                    <SubBtns>
                      {currency.map((c) => (
                        <MenuButton
                          key={c.id}
                          fullWidth
                          onClick={() => handleIsCurrency(c)}
                          style={{ justifyContent: 'flex-start' }}
                        >
                          <img src={`/images/coins/${c.value}.png`} alt="" width="20px" />
                          &nbsp;
                          {c.value}
                        </MenuButton>
                      ))}
                    </SubBtns>
                  </SubWrap>
                )}
              </Flex>
            }
          />
          <div className="mt-2">
            <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
              Price
            </Text>
            <Balance style={{ flexWrap: 'wrap', height: 52 }}>
              <NumberInput placeholder="0.00" value={values} onChange={handleChange} pattern="^[0-9]*[,]?[0-9]*$" />
            </Balance>
          </div>
          <div className="mt-2 w-100">
            <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
              End date/time (Optional)
            </Text>
            <div className="flex align-center">
              <Flatpicker
                data-enable-time
                value={dates}
                options={{
                  dateFormat: 'dd-mm-yyyy H:i:s',
                  altFormat: 'd-m-y h:i K',
                  altInput: true,
                }}
                onChange={([date]) => {
                  test(date)
                }}
              />
              <img
                alt=""
                src={isDark ? calendarWhite : calendarBlack}
                width="20px"
                height="18px"
                style={{ marginLeft: '-30px', cursor: 'pointer' }}
              />
            </div>
          </div>
          <div className="flex justify-space-between mt-2">
            <div className="flex align-center">
              <Text fontSize="14px !important" lineHeight="2">
                Listing fee
              </Text>
              <Helper text="Something" className="ml-2" position="right" />
            </div>
            <Text fontSize="14px !important" lineHeight="2">
              2.5%
            </Text>
          </div>
          <div className="flex justify-space-between">
            <Text fontSize="14px !important" lineHeight="2">
              Net received
            </Text>
            <Text fontSize="14px !important" lineHeight="2">
              {values !== '' ? (parseFloat(values) * (100 - 2.5)) / 100 : '-'} FINIX
            </Text>
          </div>
          <Button fullWidth radii="small" className="mt-3" onClick={onSell}>
            Submit
          </Button>
        </div>
      </CardField>
    </ModalNFT>
  )
}

export default ListFillModal
