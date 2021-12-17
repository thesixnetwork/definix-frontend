import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'

import {
  Text,
  Box,
  Flex,
  ImgHomeTopFinix1x,
  ImgHomeTopFinix2x,
  ImgHomeTopFinix3x,
  ImageSet,
} from '@fingerlabs/definixswap-uikit-v2'
import NoticeItem from './NoticeItem'

export interface NoticeProps {
  title: string
  content: string
  link?: string
  linkLabel?: string
}

const KO_NOTICE_LIST: NoticeProps[] = [
  {
    title: 'Definix 클레이튼 체인 V2 Beta 런칭!',
    content: `Definix가 클레이튼 체인을 대상으로 V2 서비스를 런칭하였습니다.
  다양한 의견을 수렴하여 더욱 발전하는 디피닉스가 되도록 노력하겠습니다.`,
  },
  {
    title: 'Definix 클레이튼 체인 V2 Beta 런칭!',
    content: `Definix가 클레이튼 체인을 대상으로 V2 서비스를 런칭하였습니다.
  다양한 의견을 수렴하여 더욱 발전하는 디피닉스가 되도록 노력하겠습니다.`,
    link: '2 ko_link',
    linkLabel: 'Beta 피드백 보내기',
  },
]
const EN_NOTICE_LIST: NoticeProps[] = [
  {
    title: '[번역필요]Definix 클레이튼 체인 V2 Beta 런칭!',
    content: `Definix가 클레이튼 체인을 대상으로 V2 서비스를 런칭하였습니다.
  다양한 의견을 수렴하여 더욱 발전하는 디피닉스가 되도록 노력하겠습니다.`,
  },
  {
    title: '[번역필요]Definix 클레이튼 체인 V2 Beta 런칭!',
    content: `Definix가 클레이튼 체인을 대상으로 V2 서비스를 런칭하였습니다.
  다양한 의견을 수렴하여 더욱 발전하는 디피닉스가 되도록 노력하겠습니다.`,
    link: '2 en_link',
    linkLabel: 'Beta 피드백 보내기',
  },
]

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
    margin-top: 0;
    .slick-list {
      margin-bottom: 0;
    }
    .slick-dots {
      height: 4px;
    }
  }
`

const Notice = styled(Text)`
  white-space: pre-line;
  ${({ theme }) => theme.textStyle.R_20M}
  color: black;
  ${({ theme }) => theme.mediaQueries.mobile} {
    ${({ theme }) => theme.textStyle.R_14M}
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

const Character = styled(ImageSet)`
  display: flex;
  width: 434px;
  height: 200px;
  align-self: flex-end;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 260px;
    height: 120px;
  }
`

const SliderOptions = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 10000,
  speed: 500,
  vertical: true,
  dots: false,
  dotsClass: 'slick-dots slick-thumb',
}

const HomeNotice: React.FC = () => {
  const { i18n } = useTranslation()
  const [notices, setNotices] = useState(i18n.languages[0] === 'ko' ? KO_NOTICE_LIST : EN_NOTICE_LIST)

  useEffect(() => {
    setNotices(i18n.languages[0] === 'ko' ? KO_NOTICE_LIST : EN_NOTICE_LIST)
  }, [i18n.languages])

  return (
    <Wrap>
      <NoticeBox>
        {notices.length === 1 ? (
          <OneNotice>
            <NoticeItem {...notices[0]} />
          </OneNotice>
        ) : (
          <NoticeSlider {...SliderOptions}>
            {notices.map((notice) => (
              <NoticeItem {...notice} />
            ))}
          </NoticeSlider>
        )}
      </NoticeBox>
      <Character srcSet={[ImgHomeTopFinix1x, ImgHomeTopFinix2x, ImgHomeTopFinix3x]} alt="" width={434} height={200} />
    </Wrap>
  )
}

export default HomeNotice
