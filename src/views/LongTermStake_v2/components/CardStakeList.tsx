import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Flex, useModal } from 'definixswap-uikit'
import styled from 'styled-components'

import UnstakeModal from './UnstakeModal'

import StakeListHead from './StakeListHead'
import StakeListContentPc from './StakeListContentPc'
import StakeListContentMobile from './StakeListContentMobile'
import StakeListPagination from './StakeListPagination'
import { IsMobileType } from './types'

const FlexCard = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const CardStakeList: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()
  const [onPresentUnstakeModal] = useModal(
    <UnstakeModal
      balance="1,000"
      period="90"
      apr="43.56%"
      fee="15%"
      end="08-Nov-21 14:57:20 GMT+9"
      received="85,000,000.123456"
      unstake={`${t('Early Unstake')}`}
      onOK={() => null}
    />,
    false,
  )

  const data = [
    {
      period: '90',
      amount: '3,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
    {
      period: '180',
      amount: '10,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
    {
      period: '365',
      amount: '30,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
    {
      period: '365',
      amount: '30,000,000',
      end: '08-Nov-21 14:57:20 GMT+9',
    },
  ]

  return (
    <>
      <Card p={isMobile ? 'S_20' : 'S_40'} mt="S_16">
        <FlexCard>
          {!isMobile && <StakeListHead />}
          {isMobile ? (
            <StakeListContentMobile data={data} onPresentUnstakeModal={onPresentUnstakeModal} />
          ) : (
            <StakeListContentPc data={data} onPresentUnstakeModal={onPresentUnstakeModal} />
          )}
          <StakeListPagination isMobile={isMobile} />
        </FlexCard>
      </Card>
    </>
  )
}

export default CardStakeList
