import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import FlexLayout from 'components/layout/FlexLayout'
import useTheme from 'hooks/useTheme'
import axios from 'axios'
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
  Flex,
} from 'uikit-dev'
import { ChevronDown } from 'react-feather'
import MenuButton from 'uikit-dev/widgets/Menu/MenuButton'
import styled from 'styled-components'
import NFTCard from './NFTCard'
import Dropdown from './DropdownNFT/Dropdown'
import TypeTab from './TypeTab'
import OutsideClick from './OutsideClick'
import { State } from '../../../state/types'
import { fetchItemByCode } from '../../../state/actions'

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

const DropdownBtn = styled.button<{ border: string; color: string }>`
  position: relative;
  width: 140px;
  height: 40px;
  display: flex;
  padding: 0 16px;

  justify-content: flex-start;
  align-items: center;
  border-radius: 24px;
  text-align: center;
  color: ${({ color }) => color};
  overflow: hidden;
  background-color: transparent;
  border: solid 1px ${({ border }) => border};
  cursor: pointer;

  @media screen and (max-width: 768px) {
    justify-content: space-between;
    width: 130px;
    height: 32px;
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
  top: 45px;
  right: 0;
  z-index: 1;

  @media screen and (max-width: 768px) {
    top: 35px;
    width: 130px;
  }
`

const SubBtns = styled.div`
  width: 100%;
  border-radius: 8px;
  border: solid 1px var(--gray-scale-03);
  overflow: hidden;
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

  const nameGroup = [
    { id: 1, value: 'T-ARA' },
    { id: 2, value: 'QRI' },
    { id: 3, value: 'Eunjung' },
    { id: 4, value: 'Jiyeon' },
    { id: 5, value: 'Hyomin' },
  ]

  const level = [
    { id: 1, value: 'Normal' },
    { id: 2, value: 'Rare' },
    { id: 3, value: 'Epic' },
    { id: 4, value: 'Legendary' },
  ]

  const price = [
    { id: 1, value: 'Most recent' },
    { id: 2, value: 'Price up' },
    { id: 3, value: 'Price down' },
  ]
  const [isName, setIsName] = useState<boolean>(false)
  const [isLevel, setIsLevel] = useState<boolean>(false)
  const [isPrice, setIsPrice] = useState<boolean>(false)
  const [fillName, setFillName] = useState('T-ARA')
  const [fillLevel, setFillLevel] = useState('Legendary')
  const [fillPrice, setFillPrice] = useState('Most recent')
  const { isDark } = useTheme()
  const nftUser = useSelector((state: State) => state.nft)
  const orderItems = _.get(nftUser, 'orderItems')
  const orderOnSell = _.get(nftUser, 'orderOnSell')
  const owning = _.get(nftUser, 'owning')
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchItemByCode(account))
  // },[])

  useEffect(() => {
    async function fetchMerketplace() {
      const response = await axios.get(
        `${process.env.REACT_APP_API_NFT}/orderlist?sort=ASC&limit=10&pageNumber=1&startIndex=1&endIndex=60`,
      )
      if (response.status === 200) {
        const data = response.data
        data.map((v) => dispatch(fetchItemByCode(_.get(v, 'code'))))
      }
    }
    fetchMerketplace()
  }, [dispatch])

  const filterdList = useMemo(() => {
    return _.get(nftUser, 'nftListData')?.filter(
      (data) => typeof data?.userData?.amountOwn === 'number' && data?.userData?.amountOwn > 0,
    )
  }, [nftUser])

  const handleIsName = (val) => {
    setIsName(false)
    setFillName(val.value)
  }

  const handleIsLevel = (val) => {
    setIsLevel(false)
    setFillLevel(val.value)
  }

  const handleIsPrice = (val) => {
    setIsPrice(false)
    setFillPrice(val.value)
  }
  return (
    <div className="align-stretch mt-5">
      <TypeTab current="/nft/market-place" />
      <CardBox>
        <div className="flex">
          <OutsideClick
            onClick={() => setIsName(false)}
            as={
              <Flex position="relative" width="auto">
                <DropdownBtn border="#737375" color={isDark ? '#FFFFFF' : '#212121'} onClick={() => setIsName(!isName)}>
                  <Text className="R12M">{fillName}</Text>
                  <ArrowWrap>
                    <ChevronDown style={{ transform: `rotate(${isName ? 180 : 0}deg)` }} size="18px" />
                  </ArrowWrap>
                </DropdownBtn>
                {isName && (
                  <SubWrap>
                    <SubBtns>
                      {nameGroup.map((n) => (
                        <MenuButton key={n.id} fullWidth onClick={() => handleIsName(n)}>
                          {n.value}
                        </MenuButton>
                      ))}
                    </SubBtns>
                  </SubWrap>
                )}
              </Flex>
            }
          />{' '}
          &nbsp;
          <OutsideClick
            onClick={() => setIsLevel(false)}
            as={
              <Flex position="relative" width="auto">
                <DropdownBtn border="#737375" color="#FFFFFF" onClick={() => setIsLevel(!isLevel)}>
                  <Text className="R12M">{fillLevel}</Text>
                  <ArrowWrap>
                    <ChevronDown style={{ transform: `rotate(${isLevel ? 180 : 0}deg)` }} size="18px" />
                  </ArrowWrap>
                </DropdownBtn>
                {isLevel && (
                  <SubWrap>
                    <SubBtns>
                      {level.map((l) => (
                        <MenuButton key={l.id} fullWidth onClick={() => handleIsLevel(l)}>
                          {l.value}
                        </MenuButton>
                      ))}
                    </SubBtns>
                  </SubWrap>
                )}
              </Flex>
            }
          />
          &nbsp;
          <OutsideClick
            onClick={() => setIsPrice(false)}
            as={
              <Flex position="relative" width="auto">
                <DropdownBtn border="#737375" color="#FFFFFF" onClick={() => setIsPrice(!isPrice)}>
                  <Text className="R12M">{fillPrice}</Text>
                  <ArrowWrap>
                    <ChevronDown style={{ transform: `rotate(${isPrice ? 180 : 0}deg)` }} size="18px" />
                  </ArrowWrap>
                </DropdownBtn>
                {isPrice && (
                  <SubWrap>
                    <SubBtns>
                      {price.map((p) => (
                        <MenuButton key={p.id} fullWidth onClick={() => handleIsPrice(p)}>
                          {p.value}
                        </MenuButton>
                      ))}
                    </SubBtns>
                  </SubWrap>
                )}
              </Flex>
            }
          />
        </div>
        <Text className="my-4" fontSize="18px">
          6 results
        </Text>
        <FlexLayout cols={3}>
          {list.map((data) => (
            <NFTCard isHorizontal={listView} isMarketplace={isMarketplace} dataForGroup />
          ))}
        </FlexLayout>
      </CardBox>
    </div>
  )
}

export default CardMarketplace
