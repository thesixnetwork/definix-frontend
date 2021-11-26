import React, { useState } from 'react'
import _ from 'lodash'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ChevronDown } from 'react-feather'
import { Button, Text, Heading, useMatchBreakpoints, Card, Flex } from 'uikit-dev'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import MenuButton from 'uikit-dev/widgets/Menu/MenuButton'
import Helper from 'uikit-dev/components/Helper'
import { ChevronDownIcon } from 'uikit-dev/components/Svg'
import DropdownList from '../DropdownNFT/DropdownList'
import OutsideClick from '../OutsideClick'

interface Props {
  onDismiss?: () => void
}

const Balance = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: start;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#57575B'};
  margin-top: 0.5rem !important;
  border: 1px solid #737375;
  box-shadow: unset;
  border-radius: ${({ theme }) => theme.radii.default};

  a {
    display: block;
  }
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 18px;
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
  background-color: #57575b;
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

const ListFillModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(true)
  const [date, setDate] = useState(new Date())
  const [value, onChange] = useState(new Date())
  const [touchUi, setTouchUi] = useState(true)
  const [values, setValues] = useState('')
  const [lang, setLang] = useState('')

  const [startDate, setStartDate] = useState(new Date())
  const [dateFrom, setDateFrom] = useState(moment().format('YYYY-MM-DD'))

  const currency = [
    { id: 1, value: 'FINIX' },
    { id: 2, value: 'SIX' },
    { id: 3, value: 'xxx' },
  ]

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
    enforcer(e.target.value.replace(/,/g, '.'))
  }

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { isDark } = useTheme()

  const [isCurrency, setIsCurrency] = useState<boolean>(false)
  const [fillCurrency, setFillCurrency] = useState('FINIX')

  const handleIsCurrency = (val) => {
    setIsCurrency(false)
    setFillCurrency(val.value)
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
            #02Fiil
          </Text>
          <Text bold fontSize={isMobile ? '14px !important' : '18px !important'} lineHeight="2">
            T-ARA LEGENDARY Grade Limited
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
                  <img src={`/images/coins/${'FINIX'}.png`} alt="" width="20px" />
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
                          // style={{border: '1px solid #737375', borderRadius: 'unset' }}
                        >
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
          <div className="mt-2">
            <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
              End date/time (Optional)
            </Text>
            {/* <Flatpickr
              className="form-control"
              value={dateFrom}
              options={{
                altInput: true,
                altFormat: "d/m/Y hh:mm:ss",
                dateFromat: "Y-m-d hh:mm:ss",
              }}
              showTimeSelect
              onChange={( dateStr) => {
                setDateFrom(dateStr);
              }}
            /> */}
            <DatePicker
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mmaa"
              selected={startDate}
              // dateFormat="YYYY-MM-DD HH:mm:ss"
              // selectsEnd
              startDate={startDate}
              // endDate={endDate}
              minDate={startDate}
              onChange={(dates) => setStartDate(dates)}
            />
            {/* <Balance style={{ flexWrap: 'wrap', height: 56 }}>
              <NumberInput style={{ width: '45%' }} placeholder="0.00" value="" pattern="^[0-9]*[,]?[0-9]*$" />
            </Balance> */}
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
              1,125 FINIX
            </Text>
          </div>
          <Button fullWidth radii="small" className="mt-3">
            Submit
          </Button>
        </div>
      </CardField>
    </ModalNFT>
  )
}

export default ListFillModal
