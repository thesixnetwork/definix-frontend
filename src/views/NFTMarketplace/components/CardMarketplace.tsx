import React, { useState } from 'react'
import _ from 'lodash'
import FlexLayout from 'components/layout/FlexLayout'
import moment from 'moment'
import {
  ArrowBackIcon,
  Button,
  Card,
  ChevronRightIcon,
  Image,
  Link as UiLink,
  Text,
  ChevronDownIcon,
  useMatchBreakpoints,
} from 'uikit-dev'
import MenuButton from 'uikit-dev/widgets/Menu/MenuButton'
import styled from 'styled-components'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/long-term-stake-opacity.png'
import NFTCard from './NFTCard'
import Dropdown from './DropdownNFT/Dropdown'
import TypeTab from './TypeTab'

const CardBox = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  padding: 1.5rem !important;

  a {
    display: block;
  }
`

const BoxDropdown = styled(Button)`
  height: 40px;
  border: 2px solid ${({ theme }) => theme.colors.backgroundBox} !important;
  background: ${({ theme }) => theme.colors.border} !important;
  border-radius: ${({ theme }) => theme.radii.large};
`

const CardMarketplace = () => {
  const [listView, setListView] = useState(false)
  const [isMarketplace, setIsMarketplace] = useState(true)
  const list = [
    {
      id: 1,
      name: 'toon',
    },
    {
      id: 2,
      name: 'mo',
    },
    {
      id: 3,
      name: 'mo',
    },
    {
      id: 4,
      name: 'mo',
    },
  ]

  const name = [
    { id: 1, name: 'T-ARA' },
    { id: 2, name: 'QRI' },
    { id: 3, name: 'Eunjung' },
    { id: 4, name: 'Jiyeon' },
    { id: 5, name: 'Hyomin' },
  ]

  const level = [
    { id: 1, name: 'Normal' },
    { id: 2, name: 'Rare' },
    { id: 3, name: 'Epic' },
    { id: 4, name: 'Legendary' },
  ]

  const info = [
    { id: 1, name: ' Most recent' },
    { id: 2, name: 'Price up' },
    { id: 3, name: 'Price down' },
  ]

  return (
    <div className="align-stretch mt-5">
      <TypeTab current="/NFT/market-place" />
      <CardBox>
        <div className="flex">
          <Dropdown
            position="bottom"
            target={
              <BoxDropdown
                variant="text"
                radii="card"
                endIcon={<ChevronDownIcon color="text" width="24px" />}
                padding="0 13px"
              >
                <Text color="text" bold>
                  T-ARA
                </Text>
              </BoxDropdown>
            }
          >
            {name.map((lang) => (
              <MenuButton
                key={lang.id}
                fullWidth
                // onClick={() => setname(lang)}
                // Safari fix
                style={{ minHeight: '32px', height: 'auto' }}
              >
                {lang.name}
              </MenuButton>
            ))}
          </Dropdown>
          &nbsp;
          <Dropdown
            position="bottom"
            target={
              <BoxDropdown
                variant="text"
                radii="card"
                endIcon={<ChevronDownIcon color="text" width="24px" />}
                padding="0 12px"
              >
                <Text color="text" bold>
                  Legendary
                </Text>
              </BoxDropdown>
            }
          >
            {level.map((lev) => (
              <MenuButton
                key={lev.id}
                fullWidth
                // onClick={() => setname(lang)}
                // Safari fix
                style={{ minHeight: '32px', height: 'auto' }}
              >
                {lev.name}
              </MenuButton>
            ))}
          </Dropdown>
          &nbsp;
          <Dropdown
            position="bottom"
            target={
              <BoxDropdown
                variant="text"
                radii="card"
                endIcon={<ChevronDownIcon color="text" width="24px" />}
                padding="0 12px"
              >
                <Text color="text" bold>
                  Most recent
                </Text>
              </BoxDropdown>
            }
          >
            {info.map((inf) => (
              <MenuButton
                key={inf.id}
                fullWidth
                // onClick={() => setname(lang)}
                // Safari fix
                style={{ minHeight: '32px', height: 'auto' }}
              >
                {inf.name}
              </MenuButton>
            ))}
          </Dropdown>
        </div>
        <Text className="my-4" fontSize="18px">
          6 results
        </Text>
        <FlexLayout cols={3}>
          {list.map((data) => (
            <NFTCard isHorizontal={listView} isMarketplace={isMarketplace} />
          ))}
        </FlexLayout>
      </CardBox>
    </div>
  )
}

export default CardMarketplace
