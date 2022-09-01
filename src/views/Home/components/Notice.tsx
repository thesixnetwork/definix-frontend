import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Slider from 'react-slick'

import { IconButton } from '@mui/material'
import {
  Text,
  Box,
  Flex,
  ImgHomeTopFinix1x,
  ImgHomeTopFinix2x,
  ImgHomeTopFinix3x,
  ImageSet,
  ArrowLeftGIcon,
  ArrowRightGIcon,
} from '@fingerlabs/definixswap-uikit-v2'
import NoticeItem from './NoticeItem'

export interface NoticeProps {
  id: number
  title: string
  content: string
  link?: string
  linkLabel?: string
}

const Wrap = styled(Flex)`
  @media screen and (max-width: 960px) {
    width: 100%;
    flex-direction: column;
  }
`

const NoticeSlider = styled(Slider)`
  grid-column-start: 1;
  grid-column-end: 8;
  margin-top: 48px;

  .slick-dots {
    position: relative;
    justify-content: flex-start;
  }

  .slick-list,
  .slick-slide {
    min-height: 60px;
  }
  .slick-list {
    // margin-bottom: 20px;
  }

  .slick-dots li {
    width: 20px;
    height: 100%;
    padding: 0;
  }

  .slick-dots li.slick-active {
    width: 28px;
  }
  .slick-dots li button:before {
    width: 12px;
    height: 6px;
    border-radius: 3px;
    background: #dad0c5;
  }
  .slick-dots li.slick-active button:before {
    width: 20px;
    background: #fea948;
  }

  @media screen and (max-width: 960px) {
    z-index: 2;
    margin-top: 0;
    .slick-list {
      margin-bottom: 0;
    }
    .slick-dots {
      height: 4px;
    }
    .slick-slider {
      margin-top: 20px;
    }
  }
`

const Notice = styled(Text)`
  white-space: pre-line;
  font-size: 20px;
  font-weight: 500;
  font-stretch: 'normal';
  font-style: 'normal';
  line-height: 1.4;
  letter-spacing: 'normal';
  color: black;
  @media screen and (max-width: 960px) {
    font-size: 14px;
    font-weight: 500;
    font-stretch: 'normal';
    font-style: 'normal';
    line-height: 1.43;
    letter-spacing: 'normal';
  }
`

const OneNotice = styled(Notice)`
  margin-top: 20px;
  margin-bottom: 20px;
`

const NoticeBox = styled(Box)`
  width: 55%;
  @media screen and (max-width: 960px) {
    width: 100%;
  }
`

const Character = styled(ImageSet)`
  display: flex;
  width: 434px;
  height: 200px;
  align-self: flex-end;

  > img {
    top: auto;
    bottom: 0 !important;
    height: auto;
  }

  @media screen and (max-width: 960px) {
    margin-top: -20px;
    width: 260px;
    height: 120px;
  }
`

const WrapIndicator = styled(Flex)`
  margin-bottom: 40px;

  @media screen and (max-width: 960px) {
    position: absolute;
    z-index: 1;
    right: 20px;
    margin-top: -24px;

    > button {
      display: none;
    }
  }
`

const WrapPage = styled(Flex)`
  align-items: center;
  padding: 0 4px;
`

const StyledArrowLeftGIcon = styled(ArrowLeftGIcon)`
  fill: 'rgb(218, 208, 197)';
`

const StyledArrowRightGIcon = styled(ArrowRightGIcon)`
  fill: 'rgb(218, 208, 197)';
`

const SliderOptions = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000,
  speed: 500,
  dots: false,
  dotsClass: 'slick-dots slick-thumb',
}

const HomeNotice: React.FC = () => {
  const [notices, setNotices] = useState([])
  const [slideIndex, setSlideIndex] = useState(0)
  const sliderRef = useRef(null)

  useEffect(() => {
    setNotices([
      {
        id: 1,
        title: 'Definix - Official DeFi protocol of Klaytn chain',
        content:
          'Welcome to the decentralized multi-chain Defi protocol Definix.\nManage your crypto assets safely and enjoy exclusive benefits for Long-term staking!',
        link: 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/',
        linkLabel: 'Learn more',
      },
      {
        id: 2,
        title: 'Definix - Official DeFi protocol of Klaytn chain',
        content:
          'Welcome to the decentralized multi-chain Defi protocol Definix.\nManage your crypto assets safely and enjoy exclusive benefits for Long-term staking!',
        link: 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/',
        linkLabel: 'Learn more',
      },
    ])
  }, [])

  return (
    <Wrap>
      <NoticeBox>
        {notices.length === 1 ? (
          <OneNotice>
            <NoticeItem {...notices[0]} />
          </OneNotice>
        ) : (
          <NoticeSlider
            ref={(slickSlider) => {
              sliderRef.current = slickSlider
            }}
            {...SliderOptions}
            beforeChange={(oldInex, newIndex) => {
              setSlideIndex(newIndex)
            }}
          >
            {notices.map((notice, index) => (
              <NoticeItem {...notice} />
            ))}
          </NoticeSlider>
        )}
        {notices.length === 1 ? (
          <></>
        ) : (
          <WrapIndicator>
            <IconButton
              //   width="16px"
              onClick={() => {
                sliderRef.current.slickPrev()
              }}
            >
              <StyledArrowLeftGIcon />
            </IconButton>
            <WrapPage>
              <Text color="brown" textStyle="R_12M">
                {slideIndex + 1}
              </Text>
              <Text mx="4px" color="lightbrown" textStyle="R_12R">
                /
              </Text>
              <Text color="lightbrown" textStyle="R_12R">
                {notices.length}
              </Text>
            </WrapPage>
            <IconButton
              //   width="16px"\
              onClick={() => {
                sliderRef.current.slickNext()
              }}
            >
              <StyledArrowRightGIcon />
            </IconButton>
          </WrapIndicator>
        )}
      </NoticeBox>
      <Character srcSet={[ImgHomeTopFinix1x, ImgHomeTopFinix2x, ImgHomeTopFinix3x]} alt="" width={434} height={200} />
    </Wrap>
  )
}

export default HomeNotice
