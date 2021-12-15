import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  TitleSet,
  ImgPoolIcon,
  Box,
  ImgFarmIcon,
  ImgMyInvestmentDefaultIcon,
  ImgRebalancingIcon,
} from '@fingerlabs/definixswap-uikit-v2'

const Wrap = styled(Flex)`
  justify-content: space-between;
  align-items: flex-end;

  .title-wrap {
    margin-bottom: ${({ theme }) => theme.spacing.S_40}px;
  }

  &.rebalancing .title-wrap {
    margin-bottom: 100px;
  }

  &.myInvestment,
  &.rebalancing {
    .image-wrap {
      margin-right: ${({ theme }) => theme.spacing.S_16}px;
    }
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    .title-wrap {
      margin-bottom: ${({ theme }) => theme.spacing.S_28}px !important;
    }
  }
`
const ImgWrap = styled(Box)`
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    display: none;
  }
`

const ListPageHeader: React.FC<{ type: string }> = ({ type }) => {
  const { t, i18n } = useTranslation()
  const dataTable = useRef({
    pool: {
      title: 'Pool',
      description: 'Deposit a single token',
      linkLabel: 'Learn how to stake',
      linkPath: '/pools/how-to-stake-to-definix-pool',
      image: ImgPoolIcon,
    },
    farm: {
      title: 'Farm',
      description: 'Pairing coins to create LP',
      linkLabel: 'Learn how to stake in Farm',
      linkPath: '/yield-farming/how-to-yield-farm-on-definix',
      image: ImgFarmIcon,
    },
    rebalancing: {
      title: 'Rebalancing Farm',
      description: 'A Farm that automatically performs',
      linkLabel: 'Learn how to invest',
      linkPath: '/rebalancing-farm/how-to-start-investing-in-rebalancing-farm',
      image: ImgRebalancingIcon,
    },
    myInvestment: {
      title: 'My Investment',
      description: 'Check your investment history and profit',
      image: ImgMyInvestmentDefaultIcon,
    },
  })
  const linkLanguage = useMemo(() => (i18n.language.includes('ko') ? 'kr' : 'en'), [i18n.language])
  const currentSet = useMemo(() => dataTable.current[type], [type])
  const currentTitleSet = useMemo(() => {
    return {
      title: t(currentSet.title) || '',
      description: t(currentSet.description) || '',
      ...(currentSet.linkLabel &&
        currentSet.linkPath && {
          linkLabel: t(currentSet.linkLabel) || '',
          link: `https://sixnetwork.gitbook.io/definix-on-klaytn-${linkLanguage}${currentSet.linkPath}`,
        }),
    }
  }, [t, currentSet, linkLanguage])

  return (
    <Wrap className={type}>
      <Box className="title-wrap">
        <TitleSet {...currentTitleSet} />
      </Box>
      {currentSet.image && (
        <ImgWrap className="image-wrap">
          <currentSet.image display="block" />
        </ImgWrap>
      )}
    </Wrap>
  )
}

export default ListPageHeader
