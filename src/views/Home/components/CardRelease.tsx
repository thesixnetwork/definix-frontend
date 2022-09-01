import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CardBody, Text, Flex, ArrowRightGIcon, Box } from '@fingerlabs/definixswap-uikit-v2'
import Card from 'uikitV2/components/Card'

const StyledCardBody = styled(CardBody)`
  padding: 40px;
  @media screen and (max-width: 960px) {
    padding: 20px;
  }
`

const Title = styled(Text)`
  display: flex;
  font-size: 26px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.38;
  letter-spacing: normal;
  color: #222;
  @media screen and (max-width: 960px) {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
  }
`

const ExtLink = styled(Text)`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #666;
  > span {
    margin-right: 8px;
  }
  @media screen and (max-width: 960px) {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: normal;
    > span {
      margin-right: 4px;
    }
  }
`

const Dot = styled(Box)`
  margin-left: 6px;
  margin-top: 6px;
  border-radius: 100%;
  width: 5px;
  height: 5px;
  background-color: #ff6828;
`

const CardRelease = () => {
  const [isNew, setIsNew] = useState(false)
  const linkHref = 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/release-note'

  useEffect(() => {
    const releaseDate = localStorage.getItem('releaseDate')
    if (!releaseDate) {
      setIsNew(true)
    } else if (releaseDate !== 'Release notes date') {
      setIsNew(true)
    }
  }, [])

  const goLink = useCallback(() => {
    setIsNew(false)
    localStorage.setItem('releaseDate', 'Release notes date')
    window.open(linkHref, '_blank')
  }, [linkHref])

  return (
    <Card>
      <StyledCardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Title>
            <span>Definix Update</span>
            {isNew && <Dot />}
          </Title>
          <ExtLink as="a" href="#" onClick={goLink}>
            <span>21. June. 2022</span>
            <ArrowRightGIcon />
          </ExtLink>
        </Flex>
      </StyledCardBody>
    </Card>
  )
}

export default CardRelease
