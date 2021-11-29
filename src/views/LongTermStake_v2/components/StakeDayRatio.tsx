import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex } from 'definixswap-uikit'

interface CardType {
  isMobile: boolean
}

const FlexRatio = styled(Flex)`
  width: 50%;
  flex-direction: column;
`

const TitleStake: React.FC<CardType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <>
      <FlexRatio>
        <></>
      </FlexRatio>
    </>
  )
}

export default TitleStake
