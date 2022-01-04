import _ from 'lodash'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import { Text, Box, Flex, DoubleArrowButtons } from '@fingerlabs/definixswap-uikit-v2'
import CurrencyText from 'components/CurrencyText'
import BalanceText from 'components/BalanceText'

const Wrap = styled(Flex)<{ bg: any }>`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ theme, bg }) => theme.colors[bg]};
`
const ArrowButtonSection = styled(Box)`
  position: absolute;
  right: 40px;
`
const SliderSection = styled(Box)<{ curTheme: any }>`
  width: 100%;
  flex: 1;

  .slick-slider {
    padding-bottom: ${({ theme }) => (theme.spacing.S_20 + 5)}px;
  }

  .slick-list {
    min-height: 149px;
  }

  .slick-dots {
    position: absolute;
    bottom: ${({ theme }) => theme.spacing.S_20}px;
    height: auto;
    > li {
      padding-right: ${({ theme }) => theme.spacing.S_6}px;
      width: 5px;
      height: 5px;
      > button {
        width: inherit;
        height: inherit;
        &:before {
          width: inherit;
          height: inherit;
          background: ${({ curTheme }) => curTheme.slideDotColor};
          color: transparent;
          opacity: 1;
        }
      }
      &.slick-active {
        > button {
          &:before {
            width: inherit;
            height: inherit;
            border-radius: 50%;
            background: ${({ curTheme }) => curTheme.slideDotActiveColor};
            color: transparent;
            opacity: 1;
          }
        }
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    width: 100%;
    padding: 0 ${({ theme }) => theme.spacing.S_20}px;
  }
`
const NonSlider = styled(Flex)`
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
  }
`
const SlideItem = styled(Box)<{ index: number; curTheme: any }>`
  margin: ${({ theme }) => theme.spacing.S_20}px 0;
  padding-left: ${({ theme, index }) => (index > 0 ? theme.spacing.S_32 : theme.spacing.S_40)}px;
  width: ${({ index }) => (index > 0 ? '277' : '276')}px;
  border-left: ${({ index, curTheme, theme }) =>
    index > 0 ? `1px solid ${theme.colors[curTheme.borderColor]}` : 'none'};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
    /* padding-top: ${({ theme, index }) => theme.spacing[index > 0 ? 'S_20' : 'S_16']}px; */
    padding-top: ${({ theme }) => theme.spacing.S_16}px;
    padding-bottom: ${({ theme }) => theme.spacing.S_16}px;
    width: 100%;
    border-left: none;
    border-bottom: ${({ index, curTheme, theme }) =>
      index <= 0 ? `1px solid ${theme.colors[curTheme.borderColor]}` : 'none'};
  }
`
const commonSlideOptions = {
  infinite: false,
  arrows: false,
  adaptiveHeight: true,
}

interface ValueList {
  title: string
  value?: number
  price: number
}
const Slide: React.FC<{
  isMobile: boolean
  hasAccount: boolean
  displayOnlyTotalPrice: boolean
  curTheme: { [key: string]: any }
  data: ValueList[]
}> = ({ isMobile, hasAccount, displayOnlyTotalPrice, curTheme, data }) => {
  const pcSlider = useRef(null)
  const mobileSlider = useRef(null)
  const [slideIndex, setSlideIndex] = useState(0)

  const slidesToShow = useMemo(() => (isMobile ? 1 : 4), [isMobile])
  const useSlide = useMemo(() => data.length > slidesToShow, [slidesToShow, data.length])
  const slideList = useMemo(() => (isMobile ? _.chunk(data, 2) : data), [isMobile, data])
  const isFirstIndex = useMemo(() => slideIndex === 0, [slideIndex])
  const isLastIndex = useMemo(() => {
    return slideIndex + slidesToShow === slideList.length
  }, [slideList, slideIndex, slidesToShow])

  const renderItemMainValue = useCallback(
    (item) => {
      const value = displayOnlyTotalPrice ? item.price : item.value
      const props = {
        textStyle: isMobile ? 'R_14B' : `R_16M`,
        color: curTheme.itemBalanceColor,
        value: hasAccount ? value : 0,
        postfix: 'FINIX',
        style: { display: 'inline-block' },
      }
      return displayOnlyTotalPrice ? <CurrencyText {...props} /> : <BalanceText {...props} />
    },
    [displayOnlyTotalPrice, isMobile, curTheme.itemBalanceColor, hasAccount],
  )

  const renderItemSubValue = useCallback(
    (item) => {
      return displayOnlyTotalPrice ? null : (
        <CurrencyText
          textStyle={isMobile ? "R_12M" :"R_14M"}
          color={curTheme.itemCurrencyColor}
          value={hasAccount ? item.price : 0}
          prefix="="
          style={{ display: 'inline-block', marginLeft: '8px' }}
        />
      )
    },
    [displayOnlyTotalPrice, isMobile, curTheme.itemCurrencyColor, hasAccount],
  )

  const renderItems = useCallback(
    (list) => {
      return list.map((item, index) => (
        <SlideItem key={item.title} index={index} curTheme={curTheme} className="slide-item">
          <Text 
            textStyle={isMobile ? "R_12R" : "R_14R"}
            color={curTheme.itemTitleColor}
            mb={isMobile? "4px" : "8px"}
          >
            {item.title}
          </Text>
          {renderItemMainValue(item)}
          {renderItemSubValue(item)}
        </SlideItem>
      ))
    },
    [curTheme, isMobile, renderItemMainValue, renderItemSubValue],
  )

  if (isMobile) {
    return (
      <Wrap bg={curTheme.bottomBg}>
        <SliderSection curTheme={curTheme}>
          {useSlide ? (
            <Slider
              ref={mobileSlider}
              {...{
                dots: true,
                slidesToShow: 1,
              }}
              {...commonSlideOptions}
            >
              {slideList.map((slideGroup) => (
                <Box>{renderItems(slideGroup)}</Box>
              ))}
            </Slider>
          ) : (
            <NonSlider>
              {slideList.map((slideGroup) => (
                <>{renderItems(slideGroup)}</>
              ))}
            </NonSlider>
          )}
        </SliderSection>
      </Wrap>
    )
  }

  return (
    <Wrap bg={curTheme.bottomBg}>
      <Box style={{ width: '100%', paddingLeft: '0', paddingRight: '128px' }}>
        <SliderSection curTheme={curTheme}>
          {useSlide ? (
            <Slider
              ref={pcSlider}
              {...{
                dots: false,
                slidesToShow: 4,
                beforeChange: (current, next) => setSlideIndex(next),
              }}
              {...commonSlideOptions}
            >
              {renderItems(data)}
            </Slider>
          ) : (
            <NonSlider>{renderItems(data)}</NonSlider>
          )}
        </SliderSection>
      </Box>

      <ArrowButtonSection>
        <DoubleArrowButtons
          disableLeftArrow={!useSlide || isFirstIndex}
          disableRightArrow={!useSlide || isLastIndex}
          onClickLeftArrow={() => {
            if (isFirstIndex) return
            pcSlider.current.slickPrev()
          }}
          onClickRightArrow={() => {
            if (isLastIndex) return
            pcSlider.current.slickNext()
          }}
        />
      </ArrowButtonSection>
    </Wrap>
  )
}

export default Slide
