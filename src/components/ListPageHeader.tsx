import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  TitleSet,
  Box,
  ImageSet,
  ImgPool1x,
  ImgPool2x,
  ImgPool3x,
  ImgFarm1x,
  ImgFarm2x,
  ImgFarm3x,
  ImgRebalancing1x,
  ImgRebalancing2x,
  ImgRebalancing3x,
  ImgMyinvestmentDefault1x,
  ImgMyinvestmentDefault2x,
  ImgMyinvestmentDefault3x,
  ImgBridge1x,
  ImgBridge2x,
  ImgBridge3x,
  ImgSilver1x,
  ImgSilver2x,
  ImgSilver3x,
  ImgGold1x,
  ImgGold2x,
  ImgGold3x,
  ImgDiamond1x,
  ImgDiamond2x,
  ImgDiamond3x,
} from '@fingerlabs/definixswap-uikit-v2'

const Wrap = styled(Box)`
  position: relative;

  &.rebalancing .title-wrap {
    padding-bottom: 100px;
  }
  &.pool .title-wrap {
    padding-bottom: 96px;
  }

  &.myInvestment,
  &.rebalancing,
  &.bridge {
    .image-wrap {
      margin-right: ${({ theme }) => theme.spacing.S_16}px;
    }
  }
`
const TitleWrap = styled(Box)<{ imageSize: number }>`
  padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  padding-right: ${({ imageSize, theme }) => imageSize + theme.spacing.S_24}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding-bottom: ${({ theme }) => theme.spacing.S_28}px !important;
    padding-right: 0;
  }
`
const ImgWrap = styled(Box)`
  position: absolute;
  right: 0;
  bottom: 0;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    display: none;
  }
`

const ListPageHeader: React.FC<{
  type: string
  grade?: string
}> = ({ type, grade }) => {
  const { t, i18n } = useTranslation()
  const myInvestmentFinixImage = useMemo(() => {
    if (!grade) return [ImgMyinvestmentDefault1x, ImgMyinvestmentDefault2x, ImgMyinvestmentDefault3x]
    switch (grade.toLowerCase()) {
      case 'diamond':
        return [ImgDiamond1x, ImgDiamond2x, ImgDiamond3x]
      case 'gold':
        return [ImgGold1x, ImgGold2x, ImgGold3x]
      case 'silver':
        return [ImgSilver1x, ImgSilver2x, ImgSilver3x]
      default:
        return [ImgMyinvestmentDefault1x, ImgMyinvestmentDefault2x, ImgMyinvestmentDefault3x]
    }
  }, [grade])
  const dataTable = useMemo(() => {
    return {
      pool: {
        title: 'Pool',
        description: 'Deposit a single token',
        linkLabel: 'Learn how to stake',
        linkPath: '/pools/how-to-stake-to-definix-pool',
        image: [ImgPool1x, ImgPool2x, ImgPool3x],
        imageSize: {
          w: 236,
          h: 144,
        },
      },
      farm: {
        title: 'Farm',
        description: 'Pairing coins to create LP',
        linkLabel: 'Learn how to stake in Farm',
        linkPath: '/yield-farming/how-to-yield-farm-on-definix',
        image: [ImgFarm1x, ImgFarm2x, ImgFarm3x],
        imageSize: {
          w: 200,
          h: 122,
        },
      },
      rebalancing: {
        title: 'Rebalancing Farm',
        description: 'A Farm that automatically performs',
        linkLabel: 'Learn how to invest',
        linkPath: '/rebalancing-farm/how-to-start-investing-in-rebalancing-farm',
        image: [ImgRebalancing1x, ImgRebalancing2x, ImgRebalancing3x],
        imageSize: {
          w: 236,
          h: 144,
        },
      },
      myInvestment: {
        title: 'My Investment',
        description: 'Check your investment history and profit',
        image: myInvestmentFinixImage,
        imageSize: {
          w: 230,
          h: 118,
        },
      },
      bridge: {
        title: 'Bridge',
        description: 'Transfer tokens to other chains',
        image: [ImgBridge1x, ImgBridge2x, ImgBridge3x],
        imageSize: {
          w: 194,
          h: 118,
        },
      }
    }
  }, [myInvestmentFinixImage])
  const linkLanguage = useMemo(() => (i18n.language.includes('ko') ? 'kr' : 'en'), [i18n.language])
  const currentSet = useMemo(() => dataTable[type], [dataTable, type])
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
      <TitleWrap className="title-wrap" imageSize={currentSet.imageSize.w}>
        <TitleSet {...currentTitleSet} />
      </TitleWrap>
      {currentSet.image && (
        <ImgWrap className="image-wrap" width={currentSet.imageSize.w}>
          <ImageSet srcSet={currentSet.image} alt="" width={currentSet.imageSize.w} height={currentSet.imageSize.h} />
          {/* <currentSet.image display="block" /> */}
        </ImgWrap>
      )}
    </Wrap>
  )
}

export default ListPageHeader
