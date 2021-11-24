import React, { useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Button, Text, Heading, Dropdown } from 'uikit-dev'
import ModalSorry from 'uikit-dev/widgets/Modal/Modal'
import MenuButton from 'uikit-dev/widgets/Menu/MenuButton'
import tAra from 'uikit-dev/images/for-ui-v2/t-ara.png'
import { ChevronDownIcon } from 'uikit-dev/components/Svg'

interface Props {
  onDismiss?: () => void
}

const ChangeLanguage = styled(Button)`
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.backgroundBox} !important;
  background: transparent !important;
`

const Balance = styled.div`
  display: flex;
  flex-flow: row nowrap;
  // flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#E4E4E425'};
  margin-top: 0.5rem !important;
  border: ${({ theme }) => !theme.isDark && '1px solid #ECECEC'};
  box-shadow: unset;
  border-radius: ${({ theme }) => theme.radii.default};

  a {
    display: block;
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

const ListFillModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [hideCloseButton, setHideCloseButton] = useState(true)
  const langs = [
    { id: 1, name: 'TH' },
    { id: 2, name: 'EN' },
  ]
  console.log('Modal')
  return (
    <ModalSorry
      isRainbow={false}
      title=""
      onDismiss={onDismiss}
      hideCloseButton={hideCloseButton}
      classHeader="bd-b-n"
      bodyPadding="0px"
    >
      <div>
        <div className="bd-b pa-5">
          <Heading fontSize="34px !important" lineHeight="2">
            #02Fiil
          </Heading>
          <Heading fontSize="22px !important" lineHeight="2">
            T-ARA LEGENDARY Grade Limited
          </Heading>
          <Text fontSize="16px !important" color="textSubtle" lineHeight="2">
            Dingo x SIX Network NFT Project No.1
          </Text>
          {/* <Button fullWidth radii="small" className="mt-3">
            List
          </Button> */}
        </div>
        <div className="pa-5">
          <Text fontSize="16px !important" color="textSubtle" lineHeight="2">
            Currency
          </Text>
          <Balance style={{ flexWrap: 'wrap' }}>
            <NumberInput style={{ width: '45%' }} placeholder="0.00" value="" pattern="^[0-9]*[,]?[0-9]*$" />
          </Balance>

          <div className="mt-2">
            <Text fontSize="16px !important" color="textSubtle" lineHeight="2">
              Price
            </Text>
            <Balance style={{ flexWrap: 'wrap' }}>
              <NumberInput style={{ width: '45%' }} placeholder="0.00" value="" pattern="^[0-9]*[,]?[0-9]*$" />
            </Balance>
          </div>
          <div className="mt-2">
            <Text fontSize="16px !important" color="textSubtle" lineHeight="2">
              End date/time
            </Text>
            <Balance style={{ flexWrap: 'wrap' }}>
              <NumberInput style={{ width: '45%' }} placeholder="0.00" value="" pattern="^[0-9]*[,]?[0-9]*$" />
            </Balance>
          </div>
          {/* <Dropdown
            position="top-right"
            target={
              <ChangeLanguage
                variant="text"
                radii="card"
                endIcon={<ChevronDownIcon color="textDisabled" width="24px" />}
                padding="0 16px"
                // disabled
              >
                <Text color="textSubtle" bold>
                  TT
                </Text>
              </ChangeLanguage>
            }
          >
            {langs.map((lang) => (
              <MenuButton
                key={lang.id}
                fullWidth
                // onClick={() => setLang(lang)}
                // Safari fix
                style={{ minHeight: '32px', height: 'auto' }}
              >
                {lang.name}
              </MenuButton>
            ))}
          </Dropdown> */}
          {/* <Heading fontSize="22px !important" lineHeight="2">
            T-ARA LEGENDARY Grade Limited
          </Heading> */}
          <div className="flex justify-space-between mt-2">
            <Text fontSize="16px !important" lineHeight="2">
              Listing fee
            </Text>
            <Text fontSize="16px !important" lineHeight="2">
              2.5%
            </Text>
          </div>
          <Button fullWidth radii="small" className="mt-3">
            Submit
          </Button>
        </div>
      </div>
    </ModalSorry>
  )
}

export default ListFillModal
