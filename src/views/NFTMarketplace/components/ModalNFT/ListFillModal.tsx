import React, { useState } from 'react'
import _ from 'lodash'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import moment from "moment";
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button, Text, Heading, useMatchBreakpoints } from 'uikit-dev'
import ModalNFT from 'uikit-dev/widgets/Modal/Modal'
import MenuButton from 'uikit-dev/widgets/Menu/MenuButton'
import tAra from 'uikit-dev/images/for-ui-v2/t-ara.png'
import Helper from 'uikit-dev/components/Helper'
import { ChevronDownIcon } from 'uikit-dev/components/Svg'
import DropdownList from '../DropdownNFT/DropdownList'

interface Props {
  onDismiss?: () => void
}

const ChangeLanguage = styled(Button)`
  height: 56px;
  width: 100%;
  border: 1px solid #737375 !important;
  background: #57575b;
  justify-content: space-between;
  border-radius: 8px;
`

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

const Coin = styled.div`
  min-width: 80px;
  display: flex;
  align-items: center;
  margin: 4px 0;
  justify-content: start;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};
  // width: 45%;
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

const ListFillModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const [isFullWidth, setIsFullWidth] = useState(true)
  const [date, setDate] = useState(new Date())
  const [value, onChange] = useState(new Date())
  const [touchUi, setTouchUi] = useState(true)
  const [values, setValues] = useState('')
  const [lang, setLang] = useState('')

  const [startDate, setStartDate] = useState(new Date());
  const [dateFrom, setDateFrom] = useState(moment().format("YYYY-MM-DD"));

  const langs = [
    { id: 1, name: 'TH' },
    { id: 2, name: 'EN' },
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
  console.log('Modal')
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { isDark } = useTheme()

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
          <DropdownList
            isFullWidth={isFullWidth}
            position="bottom"
            target={
              <ChangeLanguage
                variant="text"
                radii="card"
                endIcon={<ChevronDownIcon color="#fff" width="24px" />}
                padding="0 16px"
              >
                <Coin>
                  <img src={`/images/coins/${'FINIX'}.png`} alt="" />
                  <Heading as="h1" fontSize="16px !important">
                    {lang}
                  </Heading>
                </Coin>
              </ChangeLanguage>
            }
          >
            {langs.map((item) => (
              <MenuButton
                key={item.id}
                fullWidth
                onClick={() => setLang(item.name)}
                // Safari fix
                style={{
                  minHeight: '32px',
                  padding: 4,
                  height: 'auto',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Coin>
                  <img src={`/images/coins/${'FINIX'}.png`} alt="" />
                  <Heading as="h1" fontSize="16px !important">
                    {item.name}
                  </Heading>
                </Coin>
              </MenuButton>
            ))}
          </DropdownList>

          <div className="mt-2">
            <Text fontSize="14px !important" color="textSubtle" lineHeight="2">
              Price
            </Text>
            <Balance style={{ flexWrap: 'wrap', height: 56 }}>
              <NumberInput
                style={{ width: '45%' }}
                placeholder="0.00"
                value={values}
                onChange={handleChange}
                pattern="^[0-9]*[,]?[0-9]*$"
              />
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
              <Helper
                text="Somthing"
                className="ml-2"
                position="right"
              />
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
