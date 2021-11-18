import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Card, Heading } from '../../../uikit-dev'
import TopicList from './TopicList'
import CardTab from './CardTab'
import SelectType, { TypeChartName } from './SelectType'

const Proposals = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  margin-top: 1.5rem !important;

  a {
    display: block;
  }
`

const Tabs = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const Header = styled.div`
  display: flex !important;
  padding: 1.5rem !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  align-items: center;
`

const CardProposals = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [chartName, setChartName] = useState<TypeChartName>('Core')

  useEffect(
    () => () => {
      setCurrentTab(0)
    },
    [],
  )

  return (
    <>
      <Proposals>
        <Header>
          <Heading fontSize="26px !important">Proposals</Heading>
          <SelectType chartName={chartName} setChartName={setChartName} className="ml-5" />
        </Header>
        <Tabs>
          <CardTab
            menus={['Vote Now', 'Soon', 'Closed']}
            current={currentTab}
            setCurrent={setCurrentTab}
            className="px-5"
          />
          <TopicList />
        </Tabs>
      </Proposals>
    </>
  )
}

export default CardProposals
