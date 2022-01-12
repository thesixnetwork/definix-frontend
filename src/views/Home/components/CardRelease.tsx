import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  ArrowRightGIcon,
  Box,
} from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

const StyledCardBody = styled(CardBody)`
  padding: 40px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding: 20px;
  }
`

const Title = styled(Text)`
  display: flex;
  ${({ theme }) => theme.textStyle.R_26B}
  color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.mediaQueries.mobile} {
    ${({ theme }) => theme.textStyle.R_20B}
  }
`

const ExtLink = styled(Text)`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.textStyle.R_16M}
  color: ${({ theme }) => theme.colors.deepgrey};

  > span {
    margin-right: 8px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    ${({ theme }) => theme.textStyle.R_14R}
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
  background-color: ${({ theme }) => theme.colors.orange};
`

const CardRelease = () => {
  const { t, i18n } = useTranslation()
  const [isNew, setIsNew] = useState(false);
  const linkHref = useMemo(() => (i18n.language.includes('ko') ? 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/release-note' : 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/release-note'), [i18n.language])
  
  useEffect(() => {
    const releaseDate = localStorage.getItem('releaseDate');
    if (!releaseDate) {
      setIsNew(true);
    } else if (releaseDate !== t('Release notes date')) {
      setIsNew(true);
    }
  }, [t]);

  const goLink = useCallback(() => {
    setIsNew(false);
    localStorage.setItem('releaseDate', t('Release notes date'))
    window.open(linkHref, '_blank');
  }, [linkHref, t]);

  return (
    <Card>
      <StyledCardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Title>
            <span>{t('Release notes title')}</span>
            {isNew && <Dot />}
          </Title>
          <ExtLink as="a" href="#" onClick={goLink}>
            <span>{t('Release notes date')}</span>
            <ArrowRightGIcon />
          </ExtLink>
        </Flex>
      </StyledCardBody>
    </Card>
  )
}

export default CardRelease
