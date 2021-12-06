/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import styled from 'styled-components'
import LazyLoad from 'react-lazyload'
// import LazyLoad from 'react-lazyload'
import { Flex } from '../../../uikit-dev'

interface CardHeadingType {
  data: any
  isSkew?: boolean
  isHorizontal?: boolean
  showAccordion?: boolean
  isOpenAccordion?: boolean
  className?: string
  setIsOpenAccordion?: (open: boolean) => void
  typeName: string
  isMarketplace?: boolean
  dataForGroup: any
}

const ImgWrap = styled(Flex)`
  height: auto;
  max-width: 100%;
  width: 100%;
  flex-shrink: 0;
  justify-content: center;
`

const LayoutImg = styled.div`
  text-align: -webkit-center;
`

const CardHeading: React.FC<CardHeadingType> = ({ data, className = '', typeName, isMarketplace, dataForGroup }) => {
  return (
    <Flex className={`pos-relative ${className}`} flexDirection="column" alignItems="center" justifyContent="center">
      <LazyLoad offset={100}>
        {isMarketplace ? (
          <LayoutImg>
            <ImgWrap>
              <video autoPlay muted loop playsInline style={{ maxWidth: '100.5%' }}>
                <source src={data.videoUrl} type="video/mp4" />
              </video>
            </ImgWrap>
          </LayoutImg>
        ) : (
          <LayoutImg>
            {typeName === 'Group' ? (
              <ImgWrap>
                <video autoPlay muted loop playsInline style={{ maxWidth: '100.5%' }}>
                  <source src={data.filterdList[1]} type="video/mp4" />
                </video>
              </ImgWrap>
            ) : (
              <ImgWrap>
                <video autoPlay muted loop playsInline style={{ maxWidth: '100.5%' }}>
                  <source src={data.videoUrl} type="video/mp4" />
                </video>
              </ImgWrap>
            )}
          </LayoutImg>
        )}
      </LazyLoad>
    </Flex>
  )
}

export default CardHeading
