import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import axios from 'axios'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

import { Label, Text, textStyle, Box, ImgHomeTopFinixIcon, Flex } from 'definixswap-uikit'

const Wrap = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    flex-direction: column;
  }
`

const NoticeSlider = styled(Slider)`
  grid-column-start: 1;
  grid-column-end: 8;
  margin-top: ${({ theme }) => theme.space.S_20}px;

  .slick-dots {
    position: relative;
    justify-content: flex-start;
  }

  .slick-list,
  .slick-slide {
    min-height: 60px;
  }
  .slick-list {
    margin-bottom: 28px;
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
    background: ${({ theme }) => theme.colors.pale};
  }
  .slick-dots li.slick-active button:before {
    width: 20px;
    background: ${({ theme }) => theme.colors.yellow};
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    .slick-list {
      margin-bottom: 20px;
    }
    .slick-dots {
      height: 4px;
    }
  }
`

const Notice = styled(Text)`
  white-space: pre-line;
  ${css(textStyle.R_20M)}
  color: black;
  ${({ theme }) => theme.mediaQueries.mobile} {
    ${css(textStyle.R_14M)}
  }
`

const OneNotice = styled(Notice)`
  margin-top: ${({ theme }) => theme.space.S_20}px;
  margin-bottom: ${({ theme }) => theme.space.S_20}px;
`

const NoticeBox = styled(Box)`
  width: 55%;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
  }
`

const Character = styled(Flex)`
  max-width: 434px;
  width: 45%;
  align-self: flex-end;
  ${({ theme }) => theme.mediaQueries.mobile} {
    max-width: 260px;
    align-self: flex-end;
    width: 81%;
  }
`

const SliderOptions = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000,
  speed: 500,
  vertical: true,
  dots: true,
  dotsClass: 'slick-dots slick-thumb',
}

const HomeNotice: React.FC = () => {
  const { t } = useTranslation()
  const [notices, setNotices] = useState([])

  useEffect(() => {
    async function fetchNotice() {
      const captionTextAPI = process.env.REACT_APP_API_CAPTION_TEXT_KLAYTN
      const response = await axios.get(captionTextAPI)
      if (response.data.data) {
        // setNotices(
        //   new Array(3).fill(true).map((val, index) => ({
        //     id: index,
        //     model: index,
        //     text: '9,757,423 (24% of total FINIX supply) has been staked in Long-term staking pool. \nWhat a number!',
        //   })),
        // )
        setNotices(response.data.data?.data?.map(({ id, model, text}) => ({
          id, model, text
        })))
      }
    }
    fetchNotice()
  }, [])

  return (
    <Wrap>
      <NoticeBox>
        <Label type="noti">{t('NOTICE')}</Label>
        {(notices.length === 1 ? <OneNotice>{notices[0].text}</OneNotice> : <NoticeSlider {...SliderOptions}>{notices.map(({ text }) => <Notice>{text}</Notice>)}</NoticeSlider>)}
      </NoticeBox>
      <Character>
        <ImgHomeTopFinixIcon viewBox="0 0 434 200" width="100%" height="100%" />
      </Character>
    </Wrap>
  )
}

export default HomeNotice
