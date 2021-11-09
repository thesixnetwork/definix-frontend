import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import axios from 'axios'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

import { Label, Text, textStyle, Box, ImgHomeTopFinixIcon } from 'definixswap-uikit'

const FullColumnGrid = styled(Box)`
  position: relative;
  grid-column-start: 1;
  grid-column-end: 13;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 32px;
`

const StyledSlider = styled(Slider)`
  grid-column-start: 1;
  grid-column-end: 8;
  margin-top: ${({ theme }) => theme.space.S_20}px;

  .slick-dots {
    position: relative;
    height: 6px;
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
    height: 6px;
    padding: 0;
  }
  .slick-dots li.slick-active {
    width: 28px;
  }
  .slick-dots li button:before {
    width: 12px;
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.pale};
  }
  .slick-dots li.slick-active button:before {
    width: 20px;
    background: ${({ theme }) => theme.colors.yellow};
  }
`

const Notice = styled(Text)`
  ${css(textStyle.R_20M)}
  color: black;
`

const PaginationNotice = styled(Box)``

const Character = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
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
        setNotices(
          new Array(3).fill(true).map((val, index) => ({
            id: index,
            model: index,
            text: '9,757,423 (24% of total FINIX supply) has been staked in Long-term staking pool. What a number!',
          })),
        )
        // setNotice(response.data.data?.data?.map(({ id, model, text}) => ({
        //   id, model, text
        // })))
      }
    }
    fetchNotice()
  }, [])

  return (
    <FullColumnGrid pt="S_30" pb="S_42">
      <Label type="noti">{t('NOTICE')}</Label>
      <StyledSlider {...SliderOptions}>{notices && notices.map(({ text }) => <Notice>{text}</Notice>)}</StyledSlider>
      <PaginationNotice mt="S_28" />
      <Character>
        <ImgHomeTopFinixIcon />
      </Character>
    </FullColumnGrid>
  )
}

export default HomeNotice
